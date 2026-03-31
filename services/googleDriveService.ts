import { Presentation } from '../types';

const CONFIG_KEY = 'hasifriya_drive_config';
const CACHE_KEY = 'hasifriya_drive_cache';
const CACHE_TTL = 5 * 60 * 1000;
const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const FOLDER_MIME = 'application/vnd.google-apps.folder';
const TONES = ['sky', 'amber', 'rose', 'emerald', 'indigo'] as const;

// Pre-configured folder ID — users only need to add their Google API key
export const DEFAULT_FOLDER_ID = '1mUiRLUgbpFOSKX4LiLsIntnA-Kwto5_j';

export interface DriveConfig {
  folderId: string;
  apiKey: string;
}

export interface DriveVideoItem {
  id: string;
  title: string;
  category: string;
  embedUrl: string;
  thumbnailUrl: string;
  addedAt: string;
  folderPath?: string;
}

export interface DriveImageItem {
  id: string;
  title: string;
  category: string;
  previewUrl: string;
  fullUrl: string;
  thumbnailUrl: string;
  addedAt: string;
  folderPath?: string;
}

export interface DriveTopicItem {
  id: string;
  folderId: string;
  label: string;
  category: string;
  description: string;
  aliases: string[];
  query: string;
  tone: (typeof TONES)[number];
  counts: {
    presentations: number;
    videos: number;
    images: number;
  };
}

export interface DriveResult {
  presentations: Presentation[];
  videos: DriveVideoItem[];
  images: DriveImageItem[];
  topics: DriveTopicItem[];
}

interface DriveApiFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  modifiedTime?: string;
  webViewLink?: string;
}

interface DriveListResponse {
  files?: DriveApiFile[];
  nextPageToken?: string;
}

interface DriveCache {
  data: DriveResult;
  fetchedAt: number;
}

interface TopicScanResult {
  presentations: Presentation[];
  videos: DriveVideoItem[];
  images: DriveImageItem[];
}

const PRESENTATION_MIME = new Set([
  'application/vnd.google-apps.presentation',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
]);

const VIDEO_MIME = new Set([
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/mpeg',
  'video/webm',
  'video/ogg',
  'application/vnd.google-apps.video',
]);

const IMAGE_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
  'image/svg+xml',
]);

const normalizeValue = (value: string) =>
  value
    .toLowerCase()
    .replace(/["'`,.:;!?()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const stripFileExtension = (value: string) =>
  value.replace(/\.(pdf|pptx?|key|mp4|mov|avi|mkv|webm|jpeg|jpg|png|gif|webp|heic|heif|svg)$/i, '');

const buildTimestamp = (value?: string) => value || new Date().toISOString();

const buildThumbnailUrl = (fileId: string, size = 'w1200') =>
  `https://drive.google.com/thumbnail?id=${fileId}&sz=${size}`;

const buildPreviewUrl = (fileId: string) => `https://drive.google.com/file/d/${fileId}/preview`;

const buildImageUrl = (fileId: string) => `https://drive.google.com/uc?export=view&id=${fileId}`;

const pickTone = (value: string): (typeof TONES)[number] => {
  const seed = normalizeValue(value)
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return TONES[seed % TONES.length];
};

const buildTopicDescription = (label: string, counts: DriveTopicItem['counts']) => {
  const parts = [
    counts.presentations ? `${counts.presentations} חומרים` : '',
    counts.videos ? `${counts.videos} סרטונים` : '',
    counts.images ? `${counts.images} תמונות` : '',
  ].filter(Boolean);

  if (parts.length === 0) {
    return `נושא שמסתנכרן ישירות מתיקיית Google Drive בשם ${label}.`;
  }

  return `נושא שמסתנכרן ישירות מ-Google Drive וכולל ${parts.join(', ')}.`;
};

const buildTopicAliases = (label: string) =>
  Array.from(
    new Set(
      [
        label,
        label.replace(/[-_/]/g, ' '),
        label.replace(/\s+/g, ''),
      ].map(value => value.trim()).filter(Boolean)
    )
  );

export const getConfig = (): DriveConfig | null => {
  try {
    return JSON.parse(localStorage.getItem(CONFIG_KEY) || 'null');
  } catch {
    return null;
  }
};

export const saveConfig = (config: DriveConfig) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  localStorage.removeItem(CACHE_KEY);
};

export const clearConfig = () => {
  localStorage.removeItem(CONFIG_KEY);
  localStorage.removeItem(CACHE_KEY);
};

export const isConfigured = (): boolean => {
  const config = getConfig();
  return !!(config?.folderId && config?.apiKey);
};

const getCache = (): DriveCache | null => {
  try {
    const raw = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null') as DriveCache | null;
    if (!raw) return null;
    if (Date.now() - raw.fetchedAt > CACHE_TTL) return null;
    return raw;
  } catch {
    return null;
  }
};

const setCache = (data: DriveResult) => {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data,
      fetchedAt: Date.now(),
    } satisfies DriveCache)
  );
};

export const clearCache = () => localStorage.removeItem(CACHE_KEY);

async function listFolder(folderId: string, apiKey: string): Promise<DriveApiFile[]> {
  const fields =
    'nextPageToken,files(id,name,mimeType,thumbnailLink,modifiedTime,webViewLink)';

  const files: DriveApiFile[] = [];
  let nextPageToken = '';

  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed=false`,
      key: apiKey,
      fields,
      pageSize: '200',
      orderBy: 'modifiedTime desc,name_natural',
      includeItemsFromAllDrives: 'true',
      supportsAllDrives: 'true',
    });

    if (nextPageToken) {
      params.set('pageToken', nextPageToken);
    }

    const response = await fetch(`${DRIVE_API}/files?${params.toString()}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.error?.message || `HTTP ${response.status}`);
    }

    const payload = (await response.json()) as DriveListResponse;
    files.push(...(payload.files || []));
    nextPageToken = payload.nextPageToken || '';
  } while (nextPageToken);

  return files;
}

const isPresentationFile = (file: DriveApiFile) => PRESENTATION_MIME.has(file.mimeType);
const isVideoFile = (file: DriveApiFile) => VIDEO_MIME.has(file.mimeType);
const isImageFile = (file: DriveApiFile) => IMAGE_MIME.has(file.mimeType) || file.mimeType.startsWith('image/');

function fileToPresentation(file: DriveApiFile, category: string): Presentation {
  const isSlides = file.mimeType === 'application/vnd.google-apps.presentation';
  const driveUrl = isSlides
    ? `https://docs.google.com/presentation/d/${file.id}/embed?start=false&loop=false`
    : buildPreviewUrl(file.id);

  return {
    id: `drive_${file.id}`,
    title: stripFileExtension(file.name),
    description: '',
    category,
    thumbnailUrl: buildThumbnailUrl(file.id, 'w1000'),
    driveUrl,
    isNew: false,
    addedAt: buildTimestamp(file.modifiedTime),
  };
}

function fileToVideo(file: DriveApiFile, category: string, folderPath: string): DriveVideoItem {
  return {
    id: `drive_vid_${file.id}`,
    title: stripFileExtension(file.name),
    category,
    embedUrl: buildPreviewUrl(file.id),
    thumbnailUrl: buildThumbnailUrl(file.id, 'w1200'),
    addedAt: buildTimestamp(file.modifiedTime),
    folderPath,
  };
}

function fileToImage(file: DriveApiFile, category: string, folderPath: string): DriveImageItem {
  return {
    id: `drive_img_${file.id}`,
    title: stripFileExtension(file.name),
    category,
    previewUrl: buildImageUrl(file.id),
    fullUrl: file.webViewLink || buildImageUrl(file.id),
    thumbnailUrl: buildThumbnailUrl(file.id, 'w1200'),
    addedAt: buildTimestamp(file.modifiedTime),
    folderPath,
  };
}

async function scanTopicFolder(
  folder: DriveApiFile,
  apiKey: string,
  topicCategory: string,
  pathSegments: string[] = []
): Promise<TopicScanResult> {
  const entries = await listFolder(folder.id, apiKey);
  const result: TopicScanResult = {
    presentations: [],
    videos: [],
    images: [],
  };

  for (const entry of entries) {
    if (entry.mimeType === FOLDER_MIME) {
      const nested = await scanTopicFolder(entry, apiKey, topicCategory, [...pathSegments, entry.name]);
      result.presentations.push(...nested.presentations);
      result.videos.push(...nested.videos);
      result.images.push(...nested.images);
      continue;
    }

    const folderPath = [topicCategory, ...pathSegments].filter(Boolean).join(' / ');

    if (isPresentationFile(entry)) {
      result.presentations.push(fileToPresentation(entry, topicCategory));
      continue;
    }

    if (isVideoFile(entry)) {
      result.videos.push(fileToVideo(entry, topicCategory, folderPath));
      continue;
    }

    if (isImageFile(entry)) {
      result.images.push(fileToImage(entry, topicCategory, folderPath));
    }
  }

  return result;
}

function buildDriveTopic(folder: DriveApiFile, scan: TopicScanResult): DriveTopicItem {
  const label = folder.name.trim();
  const counts = {
    presentations: scan.presentations.length,
    videos: scan.videos.length,
    images: scan.images.length,
  };

  return {
    id: `drive_topic_${folder.id}`,
    folderId: folder.id,
    label,
    category: label,
    description: buildTopicDescription(label, counts),
    aliases: buildTopicAliases(label),
    query: label,
    tone: pickTone(label),
    counts,
  };
}

export const fetchFromDrive = async (): Promise<DriveResult> => {
  const config = getConfig();
  if (!config?.folderId || !config?.apiKey) {
    return { presentations: [], videos: [], images: [], topics: [] };
  }

  const cached = getCache();
  if (cached) return cached.data;

  try {
    const result: DriveResult = {
      presentations: [],
      videos: [],
      images: [],
      topics: [],
    };

    const rootEntries = await listFolder(config.folderId, config.apiKey);

    for (const entry of rootEntries) {
      if (entry.mimeType === FOLDER_MIME) {
        const scan = await scanTopicFolder(entry, config.apiKey, entry.name.trim());
        result.presentations.push(...scan.presentations);
        result.videos.push(...scan.videos);
        result.images.push(...scan.images);
        result.topics.push(buildDriveTopic(entry, scan));
        continue;
      }

      if (isPresentationFile(entry)) {
        result.presentations.push(fileToPresentation(entry, 'כללי'));
        continue;
      }

      if (isVideoFile(entry)) {
        result.videos.push(fileToVideo(entry, 'כללי', 'כללי'));
        continue;
      }

      if (isImageFile(entry)) {
        result.images.push(fileToImage(entry, 'כללי', 'כללי'));
      }
    }

    result.presentations.sort(
      (left, right) => new Date(right.addedAt).getTime() - new Date(left.addedAt).getTime()
    );
    result.videos.sort(
      (left, right) => new Date(right.addedAt).getTime() - new Date(left.addedAt).getTime()
    );
    result.images.sort(
      (left, right) => new Date(right.addedAt).getTime() - new Date(left.addedAt).getTime()
    );

    setCache(result);
    return result;
  } catch (error: any) {
    console.warn('Google Drive sync failed:', error?.message || error);
    throw error;
  }
};
