import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpLeft, BookOpen, BrainCircuit, Film, ImageIcon, Layers3, Radio, ShieldCheck, Smartphone } from 'lucide-react';
import { CYBER_CASES, PORTAL_VIDEOS, CyberCase, PortalVideo, SearchTopicShortcut } from '../portalData';
import { KnowledgeArticle, KnowledgeVideo, Presentation } from '../types';
import { DriveImageItem, DriveVideoItem } from '../services/googleDriveService';
import WorldScene, { resolveWorldSceneVariant } from './WorldScene';
import { getWorldVisual } from './worldVisuals';

type SectionKey = 'videos' | 'scenarios' | 'hardening' | 'cases';
type ContentTab = 'presentations' | 'articles' | 'cases' | 'media';
type ThemeKey = 'neutral' | 'cyber' | 'phishing' | 'espionage' | 'cloud';

type MediaPreviewItem = {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  url: string;
  source: string;
  thumbnailUrl?: string;
  previewLabel?: string;
};

interface TopicExplorerProps {
  topics: SearchTopicShortcut[];
  activeTopicId: string;
  searchQuery: string;
  presentations: Presentation[];
  articles: KnowledgeArticle[];
  driveVideos: DriveVideoItem[];
  webVideos: KnowledgeVideo[];
  driveImages: DriveImageItem[];
  themeKey: ThemeKey;
  isWorldMode?: boolean;
  onSelectTopic: (topicId: string) => void;
  onOpenPresentation: (presentation: Presentation) => void;
  onOpenGlossary: () => void;
  onOpenSection: (section: SectionKey, focusTopicId?: string) => void;
}

type SupportSuggestion = {
  id: 'glossary' | 'hardening' | 'scenarios';
  title: string;
  description: string;
  actionLabel: string;
  action: () => void;
  Icon: React.ComponentType<{ className?: string }>;
};

type TabDeckCard = {
  id: ContentTab;
  count: number;
  title: string;
  teaser: string;
  imageUrl?: string;
};

const TAB_META: Record<ContentTab, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  presentations: { label: 'מצגות וחומרים', icon: BookOpen },
  articles: { label: 'כתבות ועדכונים', icon: Radio },
  cases: { label: 'אירועי אמת', icon: ShieldCheck },
  media: { label: 'סרטונים ומדיה', icon: Film },
};

const TOPIC_VIDEO_FALLBACKS: Partial<Record<string, string[]>> = {
  'shortcut-social': ['v4', 'v1'],
  'shortcut-phishing': ['v1', 'v5'],
  'shortcut-identity': ['v5', 'v2'],
  'shortcut-deepfake': ['v4', 'v5'],
  'shortcut-cyber': ['v3', 'v6'],
  'shortcut-cloud': ['v5', 'v6'],
  'shortcut-mobile': ['v6', 'v5'],
  'shortcut-vulnerabilities': ['v3', 'v6'],
  'shortcut-ransomware': ['v3'],
  'shortcut-insider': ['v5', 'v4'],
  'shortcut-supply': ['v6', 'v3'],
};

const SURFACE_STYLES: Record<ThemeKey, Record<string, string>> = {
  neutral: {
    section: 'border-y border-slate-200 bg-white',
    introBadge: 'border-slate-200 bg-slate-50 text-slate-700',
    introTitle: 'text-slate-950',
    introText: 'text-slate-600',
    searchNotice: 'border-slate-200 bg-slate-50 text-slate-700',
    tabsWrap: 'border-slate-200 bg-white/70',
    activeTab: 'bg-slate-950 text-white',
    tab: 'border-slate-200 bg-white text-slate-600 hover:text-slate-950',
    contentPanel: 'border-slate-200 bg-white text-slate-950',
    item: 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white',
    meta: 'text-slate-400',
    body: 'text-slate-950',
    sub: 'text-slate-600',
    empty: 'border-slate-300 bg-slate-50 text-slate-500',
    divider: 'border-slate-100',
  },
  cyber: {
    section: 'border-y border-emerald-500/10 bg-[#040c08]',
    introBadge: 'border-emerald-400/15 bg-emerald-500/10 text-emerald-100',
    introTitle: 'text-emerald-50',
    introText: 'text-emerald-100/72',
    searchNotice: 'border-emerald-500/10 bg-emerald-500/8 text-emerald-100/85',
    tabsWrap: 'border-emerald-500/10 bg-[#07130d]',
    activeTab: 'bg-emerald-400 text-slate-950',
    tab: 'border-emerald-500/10 bg-emerald-500/10 text-emerald-50 hover:bg-emerald-500/15',
    contentPanel: 'border-emerald-500/10 bg-[#07130d]/90 text-emerald-50',
    item: 'border-emerald-500/10 bg-emerald-500/6 hover:bg-emerald-500/10',
    meta: 'text-emerald-100/38',
    body: 'text-emerald-50',
    sub: 'text-emerald-100/72',
    empty: 'border-emerald-500/15 bg-emerald-500/6 text-emerald-100/72',
    divider: 'border-emerald-500/10',
  },
  phishing: {
    section: 'border-y border-amber-500/10 bg-[#140d04]',
    introBadge: 'border-amber-300/15 bg-amber-500/10 text-amber-50',
    introTitle: 'text-amber-50',
    introText: 'text-amber-100/74',
    searchNotice: 'border-amber-500/10 bg-amber-500/8 text-amber-50/85',
    tabsWrap: 'border-amber-500/10 bg-[#1b1107]',
    activeTab: 'bg-amber-300 text-slate-950',
    tab: 'border-amber-500/10 bg-amber-500/10 text-amber-50 hover:bg-amber-500/15',
    contentPanel: 'border-amber-500/10 bg-[#1b1107]/90 text-amber-50',
    item: 'border-amber-500/10 bg-amber-500/6 hover:bg-amber-500/10',
    meta: 'text-amber-100/38',
    body: 'text-amber-50',
    sub: 'text-amber-100/72',
    empty: 'border-amber-500/15 bg-amber-500/6 text-amber-100/72',
    divider: 'border-amber-500/10',
  },
  espionage: {
    section: 'border-y border-violet-500/10 bg-[#0b0d15]',
    introBadge: 'border-violet-300/15 bg-violet-500/10 text-violet-50',
    introTitle: 'text-slate-50',
    introText: 'text-slate-200/72',
    searchNotice: 'border-violet-500/10 bg-violet-500/8 text-slate-100/85',
    tabsWrap: 'border-violet-500/10 bg-[#121725]',
    activeTab: 'bg-violet-400 text-white',
    tab: 'border-violet-500/10 bg-violet-500/10 text-slate-100 hover:bg-violet-500/15',
    contentPanel: 'border-violet-500/10 bg-[#121725]/92 text-slate-50',
    item: 'border-violet-500/10 bg-violet-500/6 hover:bg-violet-500/10',
    meta: 'text-slate-200/38',
    body: 'text-slate-50',
    sub: 'text-slate-200/72',
    empty: 'border-violet-500/15 bg-violet-500/6 text-slate-200/72',
    divider: 'border-violet-500/10',
  },
  cloud: {
    section: 'border-y border-sky-500/10 bg-[#07121c]',
    introBadge: 'border-sky-300/15 bg-sky-500/10 text-sky-50',
    introTitle: 'text-sky-50',
    introText: 'text-sky-100/74',
    searchNotice: 'border-sky-500/10 bg-sky-500/8 text-sky-50/85',
    tabsWrap: 'border-sky-500/10 bg-[#0f1d2a]',
    activeTab: 'bg-sky-300 text-slate-950',
    tab: 'border-sky-500/10 bg-sky-500/10 text-sky-50 hover:bg-sky-500/15',
    contentPanel: 'border-sky-500/10 bg-[#0f1d2a]/92 text-sky-50',
    item: 'border-sky-500/10 bg-sky-500/6 hover:bg-sky-500/10',
    meta: 'text-sky-100/38',
    body: 'text-sky-50',
    sub: 'text-sky-100/72',
    empty: 'border-sky-500/15 bg-sky-500/6 text-sky-100/72',
    divider: 'border-sky-500/10',
  },
};

const normalize = (value: string) => value.toLowerCase();
const termsFrom = (values: string[]) => values.flatMap(value => normalize(value).split(' ')).map(term => term.trim()).filter(Boolean);
const buildPortalVideoUrl = (video: PortalVideo) => `https://www.youtube.com/watch?v=${video.youtubeId}`;
const buildPortalVideoThumbnail = (video: PortalVideo) => `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(parsed);
};

const matchesTopic = (value: string, topic: SearchTopicShortcut) => {
  const haystack = normalize(value);
  return termsFrom([topic.label, topic.description, ...topic.aliases, ...topic.categories]).some(term => haystack.includes(term));
};

const TopicExplorer: React.FC<TopicExplorerProps> = ({
  topics,
  activeTopicId,
  searchQuery,
  presentations,
  articles,
  driveVideos,
  webVideos,
  driveImages,
  themeKey,
  isWorldMode = false,
  onSelectTopic,
  onOpenPresentation,
  onOpenGlossary,
  onOpenSection,
}) => {
  const [activeTab, setActiveTab] = useState<ContentTab>('presentations');
  const surface = SURFACE_STYLES[themeKey];
  const activeTopic = useMemo(() => topics.find(topic => topic.id === activeTopicId) || topics[0], [activeTopicId, topics]);
  const activeScene = resolveWorldSceneVariant(activeTopic?.id || '', true);

  const topicPresentations = useMemo(() => presentations.filter(item => activeTopic.presentationIds?.includes(item.id) || activeTopic.categories.includes(item.category) || matchesTopic(`${item.title} ${item.description} ${item.category}`, activeTopic)).slice(0, 6), [activeTopic, presentations]);
  const topicArticles = useMemo(() => articles.filter(item => activeTopic.topicIds.includes(item.topicId) || activeTopic.categories.includes(item.category) || matchesTopic(`${item.title} ${item.summary} ${item.category} ${item.topicLabel}`, activeTopic)).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 6), [activeTopic, articles]);
  const topicCases = useMemo(() => CYBER_CASES.filter(item => activeTopic.caseIds?.includes(item.id) || activeTopic.categories.includes(item.category) || matchesTopic(`${item.title} ${item.summary} ${item.category} ${item.tags.join(' ')}`, activeTopic)).slice(0, 5), [activeTopic]);
  const topicVideos = useMemo<MediaPreviewItem[]>(() => {
    const directMatches = [
      ...PORTAL_VIDEOS.map(video => ({ id: video.id, title: video.title, category: video.category, subtitle: video.description, url: buildPortalVideoUrl(video), source: 'YouTube', thumbnailUrl: buildPortalVideoThumbnail(video), previewLabel: video.duration })),
      ...driveVideos.map(video => ({ id: video.id, title: video.title, category: video.category, subtitle: 'וידאו מתוך Google Drive', url: video.embedUrl, source: 'Drive', thumbnailUrl: video.thumbnailUrl, previewLabel: 'Drive' })),
      ...webVideos.map(video => ({ id: video.id, title: video.title, category: video.category, subtitle: video.summary, url: video.url, source: video.source, thumbnailUrl: video.thumbnailUrl, previewLabel: video.source })),
    ].filter(item => activeTopic.categories.includes(item.category) || matchesTopic(`${item.title} ${item.subtitle} ${item.category}`, activeTopic));

    if (directMatches.length > 0) {
      return directMatches.slice(0, 6);
    }

    const fallbackIds = TOPIC_VIDEO_FALLBACKS[activeTopic.id] || [];
    return PORTAL_VIDEOS.filter(video => fallbackIds.includes(video.id))
      .map(video => ({ id: video.id, title: video.title, category: video.category, subtitle: video.description, url: buildPortalVideoUrl(video), source: 'YouTube', thumbnailUrl: buildPortalVideoThumbnail(video), previewLabel: video.duration }))
      .slice(0, 6);
  }, [activeTopic, driveVideos, webVideos]);
  const topicImages = useMemo(() => driveImages.filter(item => activeTopic.categories.includes(item.category) || matchesTopic(`${item.title} ${item.category} ${item.folderPath || ''}`, activeTopic)).slice(0, 4), [activeTopic, driveImages]);

  const topicCatalog = useMemo(() => topics.map(topic => {
    const presentationCount = presentations.filter(item => topic.presentationIds?.includes(item.id) || topic.categories.includes(item.category) || matchesTopic(`${item.title} ${item.description} ${item.category}`, topic)).length;
    const articleCount = articles.filter(item => topic.topicIds.includes(item.topicId) || topic.categories.includes(item.category) || matchesTopic(`${item.title} ${item.summary} ${item.category} ${item.topicLabel}`, topic)).length;
    const caseCount = CYBER_CASES.filter(item => topic.caseIds?.includes(item.id) || topic.categories.includes(item.category) || matchesTopic(`${item.title} ${item.summary} ${item.category} ${item.tags.join(' ')}`, topic)).length;
    const mediaCount = PORTAL_VIDEOS.filter(item => topic.categories.includes(item.category) || matchesTopic(`${item.title} ${item.description} ${item.category}`, topic)).length + driveVideos.filter(item => topic.categories.includes(item.category) || matchesTopic(`${item.title} ${item.category} ${item.folderPath || ''}`, topic)).length + webVideos.filter(item => topic.categories.includes(item.category) || matchesTopic(`${item.title} ${item.summary} ${item.category}`, topic)).length + driveImages.filter(item => topic.categories.includes(item.category) || matchesTopic(`${item.title} ${item.category} ${item.folderPath || ''}`, topic)).length;
    const previewImage = driveImages.find(item => topic.categories.includes(item.category) || matchesTopic(`${item.title} ${item.category} ${item.folderPath || ''}`, topic));
    return { ...topic, presentationCount, articleCount, caseCount, mediaCount, totalCount: presentationCount + articleCount + caseCount + mediaCount, previewImage, scene: resolveWorldSceneVariant(topic.id, true) };
  }), [articles, driveImages, driveVideos, presentations, topics, webVideos]);

  const activeCatalogTopic = topicCatalog.find(topic => topic.id === activeTopic.id) || topicCatalog[0];
  const getTabCount = (tab: ContentTab) => {
    switch (tab) {
      case 'presentations':
        return topicPresentations.length;
      case 'articles':
        return topicArticles.length;
      case 'cases':
        return topicCases.length;
      case 'media':
        return topicVideos.length + topicImages.length;
      default:
        return 0;
    }
  };
  const availableTabs = useMemo(() => {
    const result: ContentTab[] = [];
    if (topicPresentations.length > 0) result.push('presentations');
    if (topicArticles.length > 0) result.push('articles');
    if (topicCases.length > 0) result.push('cases');
    if (topicVideos.length > 0 || topicImages.length > 0) result.push('media');
    return result.length > 0 ? result : ['presentations'];
  }, [topicArticles.length, topicCases.length, topicImages.length, topicPresentations.length, topicVideos.length]);

  const supportSuggestions = useMemo<SupportSuggestion[]>(() => {
    const suggestions: SupportSuggestion[] = [
      {
        id: 'glossary',
        title: 'מילון מושגים',
        description: 'מושגי יסוד והסברים קצרים למונחים שחוזרים בתוך הכתבות, המצגות והאירועים.',
        actionLabel: 'פתחו מילון',
        action: onOpenGlossary,
        Icon: BookOpen,
      },
    ];

    const isMobileWorld =
      activeTopic.id.includes('mobile') ||
      activeTopic.categories.some(category =>
        ['אבטחת מכשירים', 'אבטחה בדרכים'].includes(category)
      );

    if (isMobileWorld) {
      suggestions.push({
        id: 'hardening',
        title: 'הקשחת טלפון נייד',
        description: 'צ׳ק ליסט קצר להגדרות, הרשאות, נעילה ועדכונים שמתאימים במיוחד לקטגוריית המובייל.',
        actionLabel: 'פתחו מדריך',
        action: () => onOpenSection('hardening'),
        Icon: Smartphone,
      });
    }

    const isPracticeRelevant = [
      'shortcut-social',
      'shortcut-phishing',
      'shortcut-identity',
      'shortcut-deepfake',
      'shortcut-cyber',
    ].includes(activeTopic.id);

    if (isPracticeRelevant) {
      suggestions.push({
        id: 'scenarios',
        title: 'סימולציות מהירות',
        description: 'תרגול קצר של פישינג, שיחה חשודה או החלטה תחת לחץ כדי לחזק את ההבנה של הקטגוריה.',
        actionLabel: 'עברו לתרגול',
        action: () => onOpenSection('scenarios'),
        Icon: BrainCircuit,
      });
    }

    return suggestions;
  }, [activeTopic, onOpenGlossary, onOpenSection]);

  const tabDeck = useMemo<TabDeckCard[]>(
    () => [
      {
        id: 'presentations',
        count: topicPresentations.length,
        title: 'מצגות וחומרים',
        teaser: topicPresentations[0]?.title || 'כניסה למצגות, PDF וחומרים עם cover ברור.',
        imageUrl: topicPresentations[0]?.thumbnailUrl || getWorldVisual(activeScene),
      },
      {
        id: 'articles',
        count: topicArticles.length,
        title: 'כתבות ועדכונים',
        teaser: topicArticles[0]?.title || 'מקורות מהימנים, כתבות ועדכונים חיים מתוך הקטגוריה הזאת.',
        imageUrl: topicImages[0]?.thumbnailUrl || getWorldVisual(activeScene),
      },
      {
        id: 'cases',
        count: topicCases.length,
        title: 'אירועי אמת',
        teaser: topicCases[0]?.title || 'פרשיות אמיתיות, לקחים ודפוסים שחוזרים מהשטח.',
        imageUrl: topicImages[1]?.thumbnailUrl || topicImages[0]?.thumbnailUrl || getWorldVisual(activeScene),
      },
      {
        id: 'media',
        count: topicVideos.length + topicImages.length,
        title: 'סרטונים ומדיה',
        teaser: topicVideos[0]?.title || topicImages[0]?.title || 'סרטונים, thumbnails ותמונות שממחישים את הקטגוריה.',
        imageUrl: topicVideos[0]?.thumbnailUrl || topicImages[0]?.thumbnailUrl || getWorldVisual(activeScene),
      },
    ].filter(item => item.count > 0),
    [
      topicArticles,
      topicCases,
      topicImages,
      topicPresentations,
      topicVideos,
    ]
  );

  const activePreview = useMemo(() => {
    if (activeTab === 'presentations' && topicPresentations[0]) {
      return {
        eyebrow: 'מצגת / חומר',
        title: topicPresentations[0].title,
        summary: topicPresentations[0].description,
        meta: `${topicPresentations[0].category} · ${formatDate(topicPresentations[0].addedAt)}`,
        imageUrl: topicPresentations[0].thumbnailUrl || getWorldVisual(activeScene),
      };
    }

    if (activeTab === 'articles' && topicArticles[0]) {
      return {
        eyebrow: 'כתבה',
        title: topicArticles[0].title,
        summary: topicArticles[0].summary,
        meta: `${topicArticles[0].source} · ${formatDate(topicArticles[0].publishedAt)}`,
        imageUrl: topicImages[0]?.thumbnailUrl || getWorldVisual(activeScene),
      };
    }

    if (activeTab === 'cases' && topicCases[0]) {
      return {
        eyebrow: 'אירוע אמת',
        title: topicCases[0].title,
        summary: topicCases[0].lesson || topicCases[0].summary,
        meta: `${topicCases[0].category} · ${topicCases[0].year}`,
        imageUrl: topicImages[1]?.thumbnailUrl || topicImages[0]?.thumbnailUrl || getWorldVisual(activeScene),
      };
    }

    if (activeTab === 'media' && (topicVideos[0] || topicImages[0])) {
      const mediaTitle = topicVideos[0]?.title || topicImages[0]?.title || '';
      const mediaSummary = topicVideos[0]?.subtitle || 'מדיה, וידאו ותמונות שנותנים תחושה ברורה של התוכן לפני פתיחה.';
      const mediaMeta = topicVideos[0]
        ? `${topicVideos[0].source} · ${topicVideos[0].category}`
        : topicImages[0]?.category || activeTopic.label;

      return {
        eyebrow: 'מדיה',
        title: mediaTitle,
        summary: mediaSummary,
        meta: mediaMeta,
        imageUrl: topicVideos[0]?.thumbnailUrl || topicImages[0]?.thumbnailUrl || getWorldVisual(activeScene),
      };
    }

    return {
      eyebrow: 'קטגוריה פעילה',
      title: activeTopic.label,
      summary: activeTopic.description,
      meta: 'תצוגה מקדימה ברורה לכל תוכן.',
      imageUrl: topicImages[0]?.thumbnailUrl || getWorldVisual(activeScene),
    };
  }, [activeTab, activeTopic, topicArticles, topicCases, topicImages, topicPresentations, topicVideos]);

  useEffect(() => {
    setActiveTab(availableTabs[0]);
  }, [activeTopicId, availableTabs]);

  const previewSceneByCategory = (category: string) => topicCatalog.find(topic => topic.categories.includes(category) || matchesTopic(category, topic))?.scene || activeScene;

  const renderVisualLayer = (imageUrl: string | undefined, alt: string, category: string, mode: 'card' | 'panel' | 'hero' = 'card') => {
    const scene = previewSceneByCategory(category || activeTopic.categories[0] || activeTopic.label);
    const fallbackImage = imageUrl || getWorldVisual(scene);

    return (
      <>
        <WorldScene variant={scene} mode={mode} className="opacity-85" />
        <img
          src={fallbackImage}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover opacity-70 mix-blend-screen"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/30 to-transparent" />
      </>
    );
  };

  const renderPresentationCard = (item: Presentation) => (
    <button key={item.id} onClick={() => onOpenPresentation(item)} className={`group w-full overflow-hidden rounded-[1.55rem] border text-right transition-all hover:-translate-y-1 ${surface.item}`}>
      <div className="relative aspect-[16/9] overflow-hidden bg-black/20">
        {renderVisualLayer(item.thumbnailUrl, item.title, item.category)}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3">
          <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] font-black text-white">מצגת</span>
          <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/90">{formatDate(item.addedAt)}</span>
        </div>
      </div>
      <div className="p-4">
        <p className={`mb-1 text-xs font-black ${surface.meta}`}>{item.category}</p>
        <p className={`text-base font-black leading-snug ${surface.body}`}>{item.title}</p>
        <p className={`mt-2 line-clamp-2 text-sm leading-6 ${surface.sub}`}>{item.description || 'פתיחה מהירה של החומר כדי להבין מה יש בפנים.'}</p>
      </div>
    </button>
  );

  const renderArticleCard = (item: KnowledgeArticle) => (
    <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className={`group block overflow-hidden rounded-[1.55rem] border transition-all hover:-translate-y-1 ${surface.item}`}>
      <div className="relative aspect-[16/9] overflow-hidden">
        {renderVisualLayer(topicImages[0]?.thumbnailUrl, item.title, item.category)}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] font-black text-white">כתבה</span>
            <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/90">{item.source}</span>
          </div>
          <p className="line-clamp-2 text-sm font-bold leading-6 text-white/90">{item.summary}</p>
        </div>
      </div>
      <div className="p-4">
        <p className={`mb-1 text-xs font-black ${surface.meta}`}>{item.topicLabel} · {formatDate(item.publishedAt)}</p>
        <p className={`text-base font-black leading-snug ${surface.body}`}>{item.title}</p>
        <div className={`mt-3 inline-flex items-center gap-2 text-sm font-black ${surface.body}`}>
          קרא מקור
          <ArrowUpLeft className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
        </div>
      </div>
    </a>
  );

  const renderCaseCard = (item: CyberCase) => (
    <div key={item.id} className={`overflow-hidden rounded-[1.55rem] border transition-all hover:-translate-y-1 ${surface.item}`}>
      <div className="relative aspect-[16/8.7] overflow-hidden">
        {renderVisualLayer(topicImages[1]?.thumbnailUrl || topicImages[0]?.thumbnailUrl, item.title, item.category)}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] font-black text-white">{item.severity === 'critical' ? 'קריטי' : item.severity === 'high' ? 'גבוה' : 'בינוני'}</span>
            <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/90">{item.year}</span>
          </div>
          <p className="line-clamp-2 text-sm font-bold leading-6 text-white/92">{item.hook}</p>
        </div>
      </div>
      <div className="p-4">
        <p className={`mb-1 text-xs font-black ${surface.meta}`}>{item.category}</p>
        <p className={`mb-2 text-base font-black leading-snug ${surface.body}`}>{item.title}</p>
        <p className={`line-clamp-2 text-sm leading-6 ${surface.sub}`}>{item.lesson}</p>
      </div>
    </div>
  );

  const renderMediaCard = (item: MediaPreviewItem) => (
    <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className={`group block overflow-hidden rounded-[1.55rem] border transition-all hover:-translate-y-1 ${surface.item}`}>
      <div className="relative aspect-[16/9] overflow-hidden bg-black/20">
        {renderVisualLayer(item.thumbnailUrl, item.title, item.category)}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3">
          <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] font-black text-white">וידאו</span>
          {item.previewLabel && <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/90">{item.previewLabel}</span>}
        </div>
      </div>
      <div className="p-4">
        <p className={`mb-1 text-xs font-black ${surface.meta}`}>{item.source} · {item.category}</p>
        <p className={`text-base font-black leading-snug ${surface.body}`}>{item.title}</p>
        <p className={`mt-2 line-clamp-2 text-sm leading-6 ${surface.sub}`}>{item.subtitle}</p>
        <div className={`mt-3 inline-flex items-center gap-2 text-sm font-black ${surface.body}`}>
          צפה עכשיו
          <ArrowUpLeft className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
        </div>
      </div>
    </a>
  );

  const activeDeckCard = tabDeck.find(item => item.id === activeTab);

  const contentPanels = (
    <div className="mt-5">
      {activeTab === 'presentations' && (
        <div className={`rounded-[1.85rem] border p-5 sm:p-6 ${surface.contentPanel}`}>
          <div className="mb-5">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${surface.tab}`}>
              <BookOpen className="h-3.5 w-3.5" />
              מצגות וחומרים
              <span className="rounded-full border border-current/15 px-2 py-0.5 text-[10px]">{activeDeckCard?.count ?? topicPresentations.length}</span>
            </div>
            <p className={`mt-3 max-w-2xl text-sm leading-7 ${surface.sub}`}>{activeDeckCard?.teaser || 'כל המצגות, קבצי ה־PDF והחומרים המקצועיים של העולם הזה במקום אחד.'}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topicPresentations.length > 0 ? topicPresentations.map(renderPresentationCard) : <div className={`col-span-2 rounded-2xl border border-dashed px-4 py-8 text-center text-sm font-medium ${surface.empty}`}>עדיין אין חומרים בקטגוריה הזאת.</div>}
          </div>
        </div>
      )}

      {activeTab === 'articles' && (
        <div className={`rounded-[1.85rem] border p-5 sm:p-6 ${surface.contentPanel}`}>
          <div className="mb-5">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${surface.tab}`}>
              <Radio className="h-3.5 w-3.5" />
              כתבות ועדכונים
              <span className="rounded-full border border-current/15 px-2 py-0.5 text-[10px]">{activeDeckCard?.count ?? topicArticles.length}</span>
            </div>
            <p className={`mt-3 max-w-2xl text-sm leading-7 ${surface.sub}`}>{activeDeckCard?.teaser || 'מקורות מהימנים, כתבות ופרסומים עדכניים שנבחרו עבור העולם הזה.'}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topicArticles.length > 0 ? topicArticles.map(renderArticleCard) : <div className={`col-span-2 rounded-2xl border border-dashed px-4 py-8 text-center text-sm font-medium ${surface.empty}`}>כרגע אין כתבות בקטגוריה הזאת.</div>}
          </div>
        </div>
      )}

      {activeTab === 'cases' && (
        <div className={`rounded-[1.85rem] border p-5 sm:p-6 ${surface.contentPanel}`}>
          <div className="mb-5">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${surface.tab}`}>
              <ShieldCheck className="h-3.5 w-3.5" />
              אירועי אמת
              <span className="rounded-full border border-current/15 px-2 py-0.5 text-[10px]">{activeDeckCard?.count ?? topicCases.length}</span>
            </div>
            <p className={`mt-3 max-w-2xl text-sm leading-7 ${surface.sub}`}>{activeDeckCard?.teaser || 'פרשיות אמיתיות, לקחים ודפוסים שעוזרים להבין איך העולם הזה נראה בשטח.'}</p>
          </div>
          <div className="mb-5 flex items-center justify-between gap-3">
            <button onClick={() => onOpenSection('cases', activeTopic.id)} className={`inline-flex items-center gap-2 text-sm font-bold ${surface.sub}`}>כל הפרשיות<ArrowUpLeft className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {topicCases.length > 0 ? topicCases.map(renderCaseCard) : <div className={`rounded-2xl border border-dashed px-4 py-8 text-center text-sm font-medium ${surface.empty}`}>עדיין אין אירועי אמת בקטגוריה הזאת.</div>}
          </div>
        </div>
      )}

      {activeTab === 'media' && (
        <div className={`rounded-[1.85rem] border p-5 sm:p-6 ${surface.contentPanel}`}>
          <div className="mb-5">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${surface.tab}`}>
              <Film className="h-3.5 w-3.5" />
              סרטונים ומדיה
              <span className="rounded-full border border-current/15 px-2 py-0.5 text-[10px]">{activeDeckCard?.count ?? topicVideos.length + topicImages.length}</span>
            </div>
            <p className={`mt-3 max-w-2xl text-sm leading-7 ${surface.sub}`}>{activeDeckCard?.teaser || 'וידאו, thumbnails ותמונות שנותנים תחושה ברורה של העולם הזה לפני פתיחה.'}</p>
          </div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <button onClick={() => onOpenSection('videos', activeTopic.id)} className={`inline-flex items-center gap-2 text-sm font-bold ${surface.sub}`}>כל הסרטונים<ArrowUpLeft className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topicVideos.length > 0 ? topicVideos.map(renderMediaCard) : null}
            {topicVideos.length === 0 && topicImages.length === 0 && <div className={`col-span-2 rounded-2xl border border-dashed px-4 py-8 text-center text-sm font-medium ${surface.empty}`}>אין כרגע סרטונים בקטגוריה הזאת.</div>}
          </div>
          {topicImages.length > 0 && (
            <div className={`mt-5 border-t pt-5 ${surface.divider}`}>
              <div className="mb-3 flex items-center gap-2"><ImageIcon className="h-4 w-4" /><p className={`text-sm font-black ${surface.body}`}>תמונות</p></div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {topicImages.map(image => (
                  <a key={image.id} href={image.fullUrl} target="_blank" rel="noreferrer" className={`group block overflow-hidden rounded-2xl border transition-all hover:-translate-y-0.5 ${surface.item}`}>
                    <div className="aspect-square overflow-hidden bg-black/10"><img src={image.thumbnailUrl} alt={image.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" referrerPolicy="no-referrer" /></div>
                    <div className="p-2.5"><p className={`line-clamp-2 text-xs font-bold leading-snug ${surface.body}`}>{image.title}</p></div>
                  </a>
                ))}
              </div>
            </div>
          )}
          {activeTopic.id.includes('mobile') && <button onClick={() => onOpenSection('hardening')} className={`mt-4 inline-flex items-center gap-2 rounded-2xl border px-4 py-3 font-bold transition-all ${surface.item}`}><Smartphone className="h-4 w-4" />הקשחת מובייל</button>}
        </div>
      )}

      {!isWorldMode && supportSuggestions.length > 0 && (
        <div className={`mt-5 rounded-[1.85rem] border p-5 sm:p-6 ${surface.contentPanel}`}>
          <div className="mb-4 flex items-center gap-2">
            <Layers3 className="h-4 w-4" />
            <h3 className={`text-lg font-black ${surface.body}`}>תוכן משלים לקטגוריה הזאת</h3>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {supportSuggestions.map(item => {
              const Icon = item.Icon;

              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`group rounded-[1.5rem] border p-4 text-right transition-all hover:-translate-y-1 ${surface.item}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-xs font-black ${surface.meta}`}>לא קטגוריה נפרדת</p>
                      <h4 className={`mt-2 text-lg font-black ${surface.body}`}>{item.title}</h4>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-2.5">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className={`mt-3 text-sm leading-6 ${surface.sub}`}>{item.description}</p>
                  <div className={`mt-4 inline-flex items-center gap-2 text-sm font-black ${surface.body}`}>
                    {item.actionLabel}
                    <ArrowUpLeft className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  if (isWorldMode) {
    return (
      <section id="topics" className={`scroll-mt-20 ${surface.section}`}>
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
          {searchQuery.trim() && <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-medium ${surface.searchNotice}`}>חיפוש פעיל: "{searchQuery}"</div>}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/22 shadow-[0_26px_80px_rgba(0,0,0,0.26)]">
            {renderVisualLayer(activePreview.imageUrl, activePreview.title, activeTopic.categories[0] || activeTopic.label, 'hero')}
            <div className="relative z-10 p-5 sm:p-7">
              <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-black ${surface.introBadge}`}>
                {activeTopic.label}
              </span>
              <h3 className="mt-4 max-w-3xl text-2xl font-black leading-tight text-white sm:text-4xl">
                {activeTopic.label}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
                {activeTopic.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold text-white/80">מצגות {activeCatalogTopic?.presentationCount || 0}</span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold text-white/80">כתבות {activeCatalogTopic?.articleCount || 0}</span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold text-white/80">אירועים {activeCatalogTopic?.caseCount || 0}</span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold text-white/80">מדיה {activeCatalogTopic?.mediaCount || 0}</span>
              </div>
              <div className={`mt-5 hide-scrollbar flex gap-2 overflow-x-auto rounded-[1.35rem] border p-2 ${surface.tabsWrap}`}>
                {availableTabs.map(tab => {
                  const meta = TAB_META[tab];
                  const Icon = meta.icon;
                  const isActive = activeTab === tab;

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold transition-all ${isActive ? surface.activeTab : surface.tab}`}
                    >
                      <Icon className="h-4 w-4" />
                      {meta.label}
                      <span className="rounded-full border border-current/15 px-2 py-0.5 text-[11px] font-black">{getTabCount(tab)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {contentPanels}
        </div>
      </section>
    );
  }

  return (
    <section id="topics" className={`scroll-mt-20 py-10 sm:py-14 ${surface.section}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black tracking-widest ${surface.introBadge}`}><Layers3 className="h-3.5 w-3.5" />עולמות תוכן</span>
          <h2 className={`text-3xl font-black leading-tight sm:text-4xl ${surface.introTitle}`}>בחרו את העולם שמעניין אתכם</h2>
          <p className={`mt-3 text-base leading-relaxed sm:text-lg ${surface.introText}`}>עולם אחד בכל רגע. לוחצים ונכנסים ישר לתוכן ששייך לו.</p>
        </div>
        {searchQuery.trim() && <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-medium ${surface.searchNotice}`}>חיפוש פעיל: "{searchQuery}" · כרגע פתוח העולם {activeTopic.label}</div>}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {topicCatalog.map(topic => {
            const isActive = topic.id === activeTopic.id;
            return (
              <button key={topic.id} onClick={() => onSelectTopic(topic.id)} className={`group relative min-h-[228px] overflow-hidden rounded-[1.85rem] border text-right transition-all ${isActive ? 'border-white/10 shadow-2xl shadow-black/30' : 'border-white/10 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20'}`}>
                <WorldScene variant={topic.scene} mode="card" />
                {topic.previewImage && <img src={topic.previewImage.thumbnailUrl} alt={topic.previewImage.title} className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${isActive ? 'opacity-24' : 'opacity-18 group-hover:opacity-24'}`} referrerPolicy="no-referrer" />}
                <div className={`absolute inset-0 ${isActive ? 'bg-black/42' : 'bg-black/48 group-hover:bg-black/42'}`} />
                <div className="relative z-10 flex h-full flex-col justify-between p-5 text-white">
                  <div>
                    <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-black">{topic.shortLabel || topic.label}</span>
                    <h3 className="mt-4 text-xl font-black leading-tight">{topic.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/80">{topic.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-white/80"><span>{topic.totalCount} פריטים</span><span>פתח עולם</span></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopicExplorer;
