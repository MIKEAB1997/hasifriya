import {
  curateArticleCandidate,
  curateVideoCandidate,
  dedupeArticles,
  dedupeVideos,
} from '../services/contentCuration';
import { KnowledgeBundle, KnowledgeTopic } from '../types';

const DEFAULT_TOPICS: KnowledgeTopic[] = [
  { id: 'topic-ai', label: 'בינה מלאכותית', query: 'artificial intelligence cybersecurity', category: 'בינה מלאכותית (AI)', maxItems: 5, enabled: true },
  { id: 'topic-cyber', label: 'איומי סייבר', query: 'cyber security threat campaign OR APT', category: 'אבטחת מכשירים', maxItems: 6, enabled: true },
  { id: 'topic-osint', label: 'OSINT וריגול', query: 'OSINT OR cyber espionage', category: 'הנדסה חברתית', maxItems: 4, enabled: true },
  { id: 'topic-geopolitics', label: 'טכנולוגיה וגיאופוליטיקה', query: 'cyber geopolitics iran china russia technology', category: 'אסטרטגיה ותכנון', maxItems: 4, enabled: true },
  { id: 'topic-incidents', label: 'פרשיות סייבר', query: 'data breach OR ransomware attack OR major cyber incident', category: 'כללי', maxItems: 6, enabled: true },
  { id: 'topic-deepfake', label: 'התחזות ו-Deepfake', query: 'deepfake scam OR voice cloning fraud', category: 'הנדסה חברתית', maxItems: 4, enabled: true },
  { id: 'topic-cloud', label: 'ענן ו-SaaS', query: 'cloud security misconfiguration OR Microsoft 365 security OR Google Workspace security', category: 'ענן ו-SaaS', maxItems: 4, enabled: true },
  { id: 'topic-identity', label: 'זהויות והרשאות', query: 'identity security OR account takeover OR phishing resistant MFA', category: 'זהויות והרשאות', maxItems: 4, enabled: true },
  { id: 'topic-vuln', label: 'חולשות ו-KEV', query: 'known exploited vulnerabilities OR zero day OR CVE exploitation', category: 'חולשות ו-KEV', maxItems: 4, enabled: true },
  { id: 'topic-insider', label: 'איומי פנים', query: 'insider threat OR employee data exfiltration', category: 'איומי פנים', maxItems: 4, enabled: true },
  { id: 'topic-mobile', label: 'איומי מובייל', query: 'mobile spyware OR iphone hack OR android spyware', category: 'אבטחת מכשירים', maxItems: 4, enabled: true },
];

const YOUTUBE_CHANNELS = [
  { label: 'Microsoft Security', handleUrl: 'https://www.youtube.com/@microsoftsecurity' },
  { label: 'Google Cloud Tech', handleUrl: 'https://www.youtube.com/@googlecloudtech' },
  { label: 'Mandiant', handleUrl: 'https://www.youtube.com/@mandiant' },
];

const REQUEST_HEADERS = {
  'user-agent': 'Mozilla/5.0 (compatible; MaagaronBot/1.0; +https://hasifriya.vercel.app)',
  accept: 'application/rss+xml, application/xml, text/xml, text/html, application/xhtml+xml',
};

const GOOGLE_NEWS_BASE = 'https://news.google.com/rss/search';

const buildGoogleNewsRssUrl = (query: string) => {
  const params = new URLSearchParams({
    q: query,
    hl: 'en-US',
    gl: 'US',
    ceid: 'US:en',
  });

  return `${GOOGLE_NEWS_BASE}?${params.toString()}`;
};

const decodeHtml = (value: string) =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const extractTag = (block: string, tag: string) => {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeHtml(match[1]) : '';
};

const extractAttr = (block: string, tag: string, attr: string) => {
  const match = block.match(new RegExp(`<${tag}[^>]*${attr}="([^"]+)"[^>]*>`, 'i'));
  return match ? match[1] : '';
};

const getBlocks = (xml: string, tag: 'item' | 'entry') =>
  Array.from(xml.matchAll(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, 'gi'))).map(match => match[0]);

const parseGoogleNewsRss = (xml: string) =>
  getBlocks(xml, 'item').map((block, index) => ({
    id: `gn-${index}-${extractTag(block, 'guid') || extractTag(block, 'link') || extractTag(block, 'title')}`,
    title: extractTag(block, 'title'),
    summary: extractTag(block, 'description'),
    url: extractTag(block, 'link'),
    publishedAt: extractTag(block, 'pubDate'),
    source: extractTag(block, 'source') || 'Google News',
  }));

const parseYoutubeAtom = (xml: string, sourceLabel: string) =>
  getBlocks(xml, 'entry').map((block, index) => {
    const videoId = extractTag(block, 'yt:videoId');
    const url = extractAttr(block, 'link', 'href') || `https://www.youtube.com/watch?v=${videoId}`;
    return {
      id: `yt-${sourceLabel}-${videoId || index}`,
      title: extractTag(block, 'title'),
      summary: extractTag(block, 'media:description') || extractTag(block, 'summary'),
      url,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnailUrl: videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '',
      publishedAt: extractTag(block, 'published') || extractTag(block, 'updated'),
      source: sourceLabel,
    };
  });

const resolveYoutubeFeed = async (handleUrl: string) => {
  const response = await fetch(handleUrl, { headers: REQUEST_HEADERS });
  if (!response.ok) return null;

  const html = await response.text();
  const channelIdMatch =
    html.match(/"channelId":"(UC[^"]+)"/) ||
    html.match(/https:\/\/www\.youtube\.com\/channel\/(UC[\w-]+)/);

  if (!channelIdMatch) return null;
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelIdMatch[1]}`;
};

const limitByTopic = <T extends { topicId: string; publishedAt: string; trustScore?: number }>(
  items: T[],
  topics: KnowledgeTopic[]
) => {
  const maxByTopic = new Map(topics.map(topic => [topic.id, topic.maxItems]));
  const counters = new Map<string, number>();

  return items
    .sort((left, right) => {
      const trustDiff = (right.trustScore || 0) - (left.trustScore || 0);
      if (trustDiff !== 0) return trustDiff;
      return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
    })
    .filter(item => {
      const used = counters.get(item.topicId) || 0;
      const limit = maxByTopic.get(item.topicId) || 4;
      if (used >= limit) return false;
      counters.set(item.topicId, used + 1);
      return true;
    });
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const parsedBody =
    req.method === 'POST'
      ? typeof req.body === 'string'
        ? JSON.parse(req.body || '{}')
        : req.body || {}
      : {};
  const requestedTopics = parsedBody?.topics;
  const topics = Array.isArray(requestedTopics) && requestedTopics.length > 0
    ? requestedTopics.filter((topic: KnowledgeTopic) => topic?.enabled !== false)
    : DEFAULT_TOPICS.filter(topic => topic.enabled !== false);

  const articleResults = await Promise.all(
    topics.map(async topic => {
      try {
        const response = await fetch(buildGoogleNewsRssUrl(topic.query), { headers: REQUEST_HEADERS });
        if (!response.ok) return [];

        const xml = await response.text();
        return parseGoogleNewsRss(xml)
          .map(item =>
            curateArticleCandidate(
              {
                id: item.id,
                title: item.title,
                summary: item.summary,
                url: item.url,
                source: item.source,
                publishedAt: item.publishedAt,
                topicId: topic.id,
                topicLabel: topic.label,
                category: topic.category,
              },
              topics,
              topic
            )
          )
          .filter(Boolean);
      } catch {
        return [];
      }
    })
  );

  const videoResults = await Promise.all(
    YOUTUBE_CHANNELS.map(async channel => {
      try {
        const feedUrl = await resolveYoutubeFeed(channel.handleUrl);
        if (!feedUrl) return [];

        const response = await fetch(feedUrl, { headers: REQUEST_HEADERS });
        if (!response.ok) return [];

        const xml = await response.text();
        return parseYoutubeAtom(xml, channel.label)
          .map(item =>
            curateVideoCandidate(
              {
                id: item.id,
                title: item.title,
                summary: item.summary,
                url: item.url,
                source: item.source,
                publishedAt: item.publishedAt,
                thumbnailUrl: item.thumbnailUrl,
                embedUrl: item.embedUrl,
              },
              topics
            )
          )
          .filter(Boolean);
      } catch {
        return [];
      }
    })
  );

  const bundle: KnowledgeBundle = {
    articles: limitByTopic(dedupeArticles(articleResults.flat()), topics),
    videos: limitByTopic(dedupeVideos(videoResults.flat()), topics),
    refreshedAt: new Date().toISOString(),
    generator: 'api-curated',
  };

  res.setHeader('Cache-Control', 's-maxage=43200, stale-while-revalidate=86400');
  res.status(200).json(bundle);
}
