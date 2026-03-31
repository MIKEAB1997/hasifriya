import React from 'react';
import { Compass, Globe, ImageIcon, Layers3, Radar } from 'lucide-react';
import { DriveImageItem } from '../services/googleDriveService';
import WorldScene, { WorldSceneVariant } from './WorldScene';
import { getWorldVisual } from './worldVisuals';

type ThemeKey = 'neutral' | 'cyber' | 'phishing' | 'espionage' | 'cloud';

interface WorldArenaProps {
  themeKey: ThemeKey;
  topicLabel: string;
  shortLabel?: string;
  sceneVariant: WorldSceneVariant;
  signals: string[];
  categories: string[];
  metrics: Array<{ label: string; value: number }>;
  images: DriveImageItem[];
}

const ARENA_THEME: Record<
  ThemeKey,
  {
    shell: string;
    hud: string;
    chip: string;
    metric: string;
    glowA: string;
    glowB: string;
    trace: string;
    text: string;
    imageShell: string;
  }
> = {
  neutral: {
    shell: 'border-slate-200/70 bg-white/12',
    hud: 'border-white/15 bg-slate-950/36',
    chip: 'border-white/15 bg-white/10 text-white/85',
    metric: 'border-white/12 bg-white/10 text-white',
    glowA: 'bg-blue-400/18',
    glowB: 'bg-indigo-400/16',
    trace: 'bg-blue-300/70',
    text: 'text-white/82',
    imageShell: 'border-white/15 bg-black/28',
  },
  cyber: {
    shell: 'border-emerald-400/18 bg-emerald-950/20',
    hud: 'border-emerald-400/18 bg-[#03130b]/54',
    chip: 'border-emerald-400/18 bg-emerald-500/10 text-emerald-100',
    metric: 'border-emerald-400/18 bg-emerald-500/10 text-emerald-50',
    glowA: 'bg-emerald-500/24',
    glowB: 'bg-lime-400/14',
    trace: 'bg-emerald-300/70',
    text: 'text-emerald-50/88',
    imageShell: 'border-emerald-400/18 bg-black/38',
  },
  phishing: {
    shell: 'border-amber-300/18 bg-amber-950/18',
    hud: 'border-amber-300/18 bg-[#1a1007]/56',
    chip: 'border-amber-300/18 bg-amber-500/10 text-amber-50',
    metric: 'border-amber-300/18 bg-amber-500/10 text-amber-50',
    glowA: 'bg-amber-400/24',
    glowB: 'bg-orange-500/16',
    trace: 'bg-amber-300/72',
    text: 'text-amber-50/88',
    imageShell: 'border-amber-300/18 bg-black/40',
  },
  espionage: {
    shell: 'border-violet-300/18 bg-violet-950/18',
    hud: 'border-violet-300/18 bg-[#0f1320]/58',
    chip: 'border-violet-300/18 bg-violet-500/10 text-slate-50',
    metric: 'border-violet-300/18 bg-violet-500/10 text-slate-50',
    glowA: 'bg-violet-500/22',
    glowB: 'bg-sky-500/16',
    trace: 'bg-violet-300/72',
    text: 'text-slate-50/88',
    imageShell: 'border-violet-300/18 bg-black/42',
  },
  cloud: {
    shell: 'border-sky-300/18 bg-sky-950/18',
    hud: 'border-sky-300/18 bg-[#0b1f2d]/58',
    chip: 'border-sky-300/18 bg-sky-500/10 text-sky-50',
    metric: 'border-sky-300/18 bg-sky-500/10 text-sky-50',
    glowA: 'bg-sky-400/22',
    glowB: 'bg-blue-500/16',
    trace: 'bg-sky-300/72',
    text: 'text-sky-50/88',
    imageShell: 'border-sky-300/18 bg-black/42',
  },
};

const WorldArena: React.FC<WorldArenaProps> = ({
  themeKey,
  topicLabel,
  shortLabel,
  sceneVariant,
  signals,
  categories,
  metrics,
  images,
}) => {
  const theme = ARENA_THEME[themeKey];
  const heroImages = images.slice(0, 3);
  const displaySignals = (signals.length > 0 ? signals : categories).slice(0, 3);
  const displayMetrics = metrics.slice(0, 4);

  return (
    <div className={`relative min-h-[26rem] overflow-hidden rounded-[2.4rem] border shadow-[0_40px_130px_rgba(0,0,0,0.42)] ${theme.shell}`}>
      <WorldScene variant={sceneVariant} mode="hero" className="absolute inset-0 opacity-75" />
      <img
        src={getWorldVisual(sceneVariant)}
        alt={topicLabel}
        className="absolute inset-0 h-full w-full object-cover opacity-82"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/28 to-black/10" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_32%)]" />
      <div className="animate-arena-sweep absolute inset-y-0 -left-1/3 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)] opacity-50" />

      <div className={`animate-arena-pulse absolute top-[-4rem] right-[-2rem] h-48 w-48 rounded-full blur-[100px] ${theme.glowA}`} />
      <div className={`animate-arena-pulse absolute bottom-[-4rem] left-[-3rem] h-56 w-56 rounded-full blur-[110px] ${theme.glowB}`} style={{ animationDelay: '1.2s' }} />
      <div className="absolute inset-x-10 top-8 h-px bg-white/10" />
      <div className="absolute inset-y-10 left-[18%] w-px bg-white/10" />
      <div className="animate-arena-orbit absolute right-[18%] top-14 h-24 w-24 rounded-full border border-white/12" />
      <div className="animate-arena-orbit absolute right-[19.75%] top-[4.55rem] h-16 w-16 rounded-full border border-white/10" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
      <div className={`animate-arena-pulse absolute right-[22%] top-[6.25rem] h-2 w-2 rounded-full shadow-[0_0_24px_currentColor] ${theme.trace}`} />
      <div className="absolute inset-x-0 top-[48%] h-px border-t border-dashed border-white/12" />
      <div className="animate-arena-drift absolute right-[12%] top-[22%] h-28 w-28 rounded-full border border-white/8" />
      <div className="animate-arena-drift absolute left-[10%] bottom-[14%] h-20 w-20 rounded-full border border-white/8" style={{ animationDelay: '1.4s' }} />

      <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black tracking-[0.28em] ${theme.hud}`}>
            <Globe className="h-3.5 w-3.5" />
            GLOBAL WORLD
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {displaySignals.slice(0, 2).map(signal => (
              <span key={signal} className={`rounded-full border px-3 py-1 text-[11px] font-bold ${theme.chip}`}>
                {signal}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="relative min-h-[15rem] overflow-hidden rounded-[1.9rem] border border-white/10 bg-black/18 backdrop-blur-[1px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_55%)]" />

            {heroImages.length > 0 ? (
              <>
                <div className={`animate-image-float absolute left-5 top-6 w-[47%] overflow-hidden rounded-[1.7rem] border shadow-2xl ${theme.imageShell}`} style={{ ['--float-rotate' as string]: '-4deg' }}>
                  <img
                    src={heroImages[0].fullUrl}
                    alt={heroImages[0].title}
                    className="aspect-[4/5] w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3">
                    <p className="line-clamp-2 text-xs font-bold text-white">{heroImages[0].title}</p>
                  </div>
                </div>
                {heroImages[1] && (
                  <div className={`animate-image-float absolute right-5 top-8 w-[34%] overflow-hidden rounded-[1.5rem] border shadow-xl ${theme.imageShell}`} style={{ ['--float-rotate' as string]: '6deg', animationDelay: '0.8s' }}>
                    <img
                      src={heroImages[1].thumbnailUrl}
                      alt={heroImages[1].title}
                      className="aspect-[4/4.5] w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                {heroImages[2] && (
                  <div className={`animate-image-float absolute bottom-5 right-10 w-[30%] overflow-hidden rounded-[1.35rem] border shadow-xl ${theme.imageShell}`} style={{ ['--float-rotate' as string]: '-6deg', animationDelay: '1.4s' }}>
                    <img
                      src={heroImages[2].thumbnailUrl}
                      alt={heroImages[2].title}
                      className="aspect-[1/1] w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className={`animate-arena-drift absolute left-5 top-6 w-[48%] rounded-[1.8rem] border px-5 py-5 ${theme.imageShell}`}>
                  <div className="mb-3 flex items-center gap-2 text-white/85">
                    <Radar className="h-4 w-4" />
                    <span className="text-xs font-black tracking-[0.24em]">ARENA CORE</span>
                  </div>
                  <p className={`text-2xl font-black leading-tight ${theme.text}`}>
                    {shortLabel || topicLabel}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/60">
                    זירת מודיעין חיה עם שכבות תוכן, מדיה ואירועים שמרוכזים סביב אותו עולם.
                  </p>
                </div>
                <div className={`animate-arena-drift absolute right-5 top-8 w-[36%] rounded-[1.5rem] border px-4 py-4 ${theme.imageShell}`} style={{ animationDelay: '0.9s' }}>
                  <div className="mb-3 flex items-center gap-2 text-white/80">
                    <Layers3 className="h-4 w-4" />
                    <span className="text-[11px] font-black tracking-[0.22em]">MISSION LAYERS</span>
                  </div>
                  <div className="space-y-2">
                    {categories.slice(0, 3).map(category => (
                      <div key={category} className="h-10 rounded-2xl border border-white/10 bg-white/5" />
                    ))}
                  </div>
                </div>
                <div className={`animate-arena-drift absolute bottom-5 right-8 flex items-center gap-2 rounded-[1.3rem] border px-4 py-3 ${theme.imageShell}`} style={{ animationDelay: '1.7s' }}>
                  <ImageIcon className="h-4 w-4 text-white/75" />
                  <span className="text-xs font-bold text-white/75">תמונות יוטמעו כאן אוטומטית מה־Drive</span>
                </div>
              </>
            )}

            <div className="animate-arena-drift absolute bottom-5 left-5 flex items-center gap-2 rounded-[1.3rem] border border-white/10 bg-black/36 px-4 py-3 backdrop-blur-md">
              <Compass className="h-4 w-4 text-white/80" />
              <div>
                <p className="text-[11px] font-black tracking-[0.24em] text-white/45">ACTIVE WORLD</p>
                <p className="text-sm font-bold text-white">{topicLabel}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {displayMetrics.map(metric => (
              <div key={metric.label} className={`rounded-[1.35rem] border px-4 py-3 backdrop-blur-md ${theme.metric}`}>
                <p className="text-[11px] font-black tracking-[0.2em] text-white/50">{metric.label}</p>
                <p className="mt-1 text-3xl font-black text-white">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldArena;
