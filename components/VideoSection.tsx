import React, { useMemo, useState } from 'react';
import { Clock, ExternalLink, Film, FolderOpen, Globe2, Play, ShieldCheck, Youtube } from 'lucide-react';
import { PORTAL_VIDEOS, PortalVideo, SearchTopicShortcut } from '../portalData';
import { DriveVideoItem } from '../services/googleDriveService';
import { KnowledgeVideo } from '../types';
import WorldScene, { resolveWorldSceneVariant } from './WorldScene';
import { getWorldVisual } from './worldVisuals';

type SourceFilter = 'all' | 'youtube' | 'web' | 'drive';

type UnifiedVideo = {
  id: string;
  title: string;
  summary: string;
  category: string;
  thumbnailUrl?: string;
  embedUrl?: string;
  externalUrl: string;
  sourceType: Exclude<SourceFilter, 'all'>;
  sourceLabel: string;
  durationLabel?: string;
};

interface VideoSectionProps {
  modal?: boolean;
  driveVideos?: DriveVideoItem[];
  webVideos?: KnowledgeVideo[];
  focusTopic?: SearchTopicShortcut | null;
}

interface UnifiedVideoCardProps {
  video: UnifiedVideo;
  focusTopic?: SearchTopicShortcut | null;
}

const SOURCE_META: Record<
  SourceFilter,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  all: { label: 'הכול', icon: Film },
  youtube: { label: 'YouTube', icon: Youtube },
  web: { label: 'מקורות רשת', icon: Globe2 },
  drive: { label: 'Drive', icon: FolderOpen },
};

const normalize = (value: string) => value.toLowerCase();
const termsFrom = (values: string[]) =>
  values
    .flatMap(value => normalize(value).split(' '))
    .map(term => term.trim())
    .filter(Boolean);

const matchesFocusTopic = (video: UnifiedVideo, focusTopic?: SearchTopicShortcut | null) => {
  if (!focusTopic) return true;

  const haystack = normalize(
    `${video.title} ${video.summary} ${video.category} ${focusTopic.label} ${focusTopic.description}`
  );

  return termsFrom([focusTopic.label, focusTopic.description, ...focusTopic.aliases, ...focusTopic.categories]).some(
    term => haystack.includes(term)
  );
};

const buildPortalVideo = (video: PortalVideo): UnifiedVideo => ({
  id: video.id,
  title: video.title,
  summary: video.description,
  category: video.category,
  thumbnailUrl: `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`,
  embedUrl: `https://www.youtube.com/embed/${video.youtubeId}?rel=0`,
  externalUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
  sourceType: 'youtube',
  sourceLabel: 'YouTube',
  durationLabel: video.duration,
});

const buildDriveVideo = (video: DriveVideoItem): UnifiedVideo => ({
  id: video.id,
  title: video.title,
  summary: 'וידאו מתוך Google Drive',
  category: video.category,
  thumbnailUrl: video.thumbnailUrl,
  embedUrl: video.embedUrl,
  externalUrl: video.embedUrl,
  sourceType: 'drive',
  sourceLabel: 'Google Drive',
  durationLabel: 'Drive',
});

const buildWebVideo = (video: KnowledgeVideo): UnifiedVideo => ({
  id: video.id,
  title: video.title,
  summary: video.summary,
  category: video.category,
  thumbnailUrl: video.thumbnailUrl,
  embedUrl: video.embedUrl,
  externalUrl: video.url,
  sourceType: 'web',
  sourceLabel: video.source,
  durationLabel: video.sourceDomain || 'מאומת',
});

const UnifiedVideoCard: React.FC<UnifiedVideoCardProps> = ({ video, focusTopic }) => {
  const [playing, setPlaying] = useState(false);
  const sceneVariant = resolveWorldSceneVariant(focusTopic?.id || '', true);
  const fallbackVisual = getWorldVisual(sceneVariant);

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/20 text-white shadow-[0_18px_60px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-black/28">
      <div className="relative aspect-[16/10] overflow-hidden">
        {playing && video.embedUrl ? (
          <iframe
            className="h-full w-full"
            src={video.embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <WorldScene variant={sceneVariant} mode="card" className="opacity-90" />
            <img
              src={video.thumbnailUrl || fallbackVisual}
              alt={video.title}
              className="absolute inset-0 h-full w-full object-cover opacity-72 mix-blend-screen transition-transform duration-500 group-hover:scale-[1.04]"
              onError={event => {
                (event.currentTarget as HTMLImageElement).src = fallbackVisual;
              }}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-3">
              <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] font-black text-white">
                {video.sourceLabel}
              </span>
              {video.durationLabel && (
                <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/85">
                  {video.durationLabel}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                if (video.embedUrl) {
                  setPlaying(true);
                  return;
                }

                window.open(video.externalUrl, '_blank', 'noopener,noreferrer');
              }}
              className="absolute inset-0 flex items-center justify-center"
              aria-label="נגן סרטון"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/90 shadow-2xl transition-transform group-hover:scale-110">
                <Play className="h-7 w-7 fill-slate-950 text-slate-950" />
              </span>
            </button>
          </>
        )}
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-black text-white/70">
            {video.category}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white/50">
            <ShieldCheck className="h-3.5 w-3.5" />
            {video.sourceType === 'web' ? 'מקור מאומת' : 'מקור זמין'}
          </span>
        </div>
        <h3 className="line-clamp-2 text-lg font-black leading-snug text-white">{video.title}</h3>
        <p className="line-clamp-2 text-sm leading-6 text-white/72">{video.summary}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => {
              if (video.embedUrl) {
                setPlaying(true);
                return;
              }

              window.open(video.externalUrl, '_blank', 'noopener,noreferrer');
            }}
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white px-4 py-2 text-sm font-black text-slate-950 transition-all hover:-translate-y-0.5"
          >
            <Play className="h-4 w-4" />
            {video.embedUrl ? 'נגן עכשיו' : 'פתח מקור'}
          </button>
          <a
            href={video.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-bold text-white/82 transition-all hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4" />
            פתח בחלון חדש
          </a>
        </div>
      </div>
    </article>
  );
};

const VideoSection: React.FC<VideoSectionProps> = ({ modal, driveVideos = [], webVideos = [], focusTopic = null }) => {
  const [activeFilter, setActiveFilter] = useState<SourceFilter>('all');

  const allVideos = useMemo(
    () => [...PORTAL_VIDEOS.map(buildPortalVideo), ...webVideos.map(buildWebVideo), ...driveVideos.map(buildDriveVideo)],
    [driveVideos, webVideos]
  );

  const focusedVideos = useMemo(() => allVideos.filter(video => matchesFocusTopic(video, focusTopic)), [allVideos, focusTopic]);

  const visibleVideos = useMemo(
    () => focusedVideos.filter(video => activeFilter === 'all' || video.sourceType === activeFilter),
    [activeFilter, focusedVideos]
  );

  const sourceCounts = useMemo(
    () => ({
      all: focusedVideos.length,
      youtube: focusedVideos.filter(video => video.sourceType === 'youtube').length,
      web: focusedVideos.filter(video => video.sourceType === 'web').length,
      drive: focusedVideos.filter(video => video.sourceType === 'drive').length,
    }),
    [focusedVideos]
  );

  const heroVideo = visibleVideos[0] || focusedVideos[0] || null;
  const sceneVariant = resolveWorldSceneVariant(focusTopic?.id || '', true);
  const fallbackVisual = getWorldVisual(sceneVariant);

  const content = (
    <div className={modal ? 'p-5 sm:p-7' : 'mx-auto max-w-7xl px-4 sm:px-6'}>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_360px]">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/20">
          <WorldScene variant={sceneVariant} mode="hero" className="opacity-90" />
          <img
            src={heroVideo?.thumbnailUrl || fallbackVisual}
            alt={heroVideo?.title || focusTopic?.label || 'ספריית וידאו'}
            className="absolute inset-0 h-full w-full object-cover opacity-72 mix-blend-screen"
            onError={event => {
              (event.currentTarget as HTMLImageElement).src = fallbackVisual;
            }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
          <div className="relative z-10 flex min-h-[18rem] flex-col justify-end p-5 sm:min-h-[20rem] sm:p-7">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-black text-white/82">
              <Film className="h-3.5 w-3.5" />
              {focusTopic ? `סרטונים לעולם ${focusTopic.label}` : 'ספריית הווידאו'}
            </span>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl">
              {heroVideo?.title || 'סרטונים, מדריכים והמחשות מהימנות'}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/76 sm:text-base">
              {heroVideo?.summary || (focusTopic ? `כל הווידאו הרלוונטי לעולם ${focusTopic.label}, מסודר לפי מקור ועם תצוגה מקדימה ברורה.` : 'וידאו מתוך YouTube, מקורות רשת ו־Google Drive, עם חלוקה ברורה ומעבר מהיר לצפייה.')}
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black/16 p-4 backdrop-blur-xl sm:p-5">
          <p className="text-xs font-black tracking-[0.22em] text-white/42">מקורות וידאו</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {(['all', 'youtube', 'web', 'drive'] as SourceFilter[]).map(filter => {
              const meta = SOURCE_META[filter];
              const Icon = meta.icon;
              const isActive = activeFilter === filter;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-[1.35rem] border px-4 py-4 text-right transition-all ${isActive ? 'border-white/18 bg-white text-slate-950 shadow-lg shadow-black/10' : 'border-white/10 bg-white/5 text-white/82 hover:bg-white/8'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-sm font-black">
                      <Icon className="h-4 w-4" />
                      {meta.label}
                    </span>
                    <span className="rounded-full border border-current/15 px-2 py-0.5 text-[11px] font-black">
                      {sourceCounts[filter]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-white">
              <Clock className="h-4 w-4" />
              {focusedVideos.length} פריטי וידאו זמינים
            </div>
            <p className="mt-2 text-sm leading-7 text-white/68">
              הכרטיסים כאן מציעים ניגון מהיר כשאפשר, ובכל מקרה גם פתיחה ישירה של המקור כדי שלא תיתקע על embed בעייתי.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleVideos.length > 0 ? (
          visibleVideos.map(video => <UnifiedVideoCard key={video.id} video={video} focusTopic={focusTopic} />)
        ) : (
          <div className="col-span-full rounded-[1.8rem] border border-dashed border-white/12 bg-white/5 px-5 py-10 text-center text-sm font-medium text-white/72">
            אין כרגע סרטונים שמתאימים למסנן הזה.
          </div>
        )}
      </div>
    </div>
  );

  if (modal) return content;

  return (
    <section id="videos" className="scroll-mt-20 bg-background py-14 sm:py-20">
      {content}
    </section>
  );
};

export default VideoSection;
