import React from 'react';
import { Orbit, Shield } from 'lucide-react';
import { SearchTopicShortcut } from '../portalData';
import WorldScene, { resolveWorldSceneVariant, WorldSceneVariant } from './WorldScene';
import { getWorldVisual } from './worldVisuals';

type HeroTheme = {
  badge: string;
  heroPattern: string;
  heroGlowA: string;
  heroGlowB: string;
  primaryButton: string;
  secondaryButton: string;
};

interface LibraryHeroProps {
  theme: HeroTheme;
  topics: SearchTopicShortcut[];
  activeTopic: SearchTopicShortcut | null;
  sceneVariant: WorldSceneVariant;
  previewImageUrl?: string;
  onSelectTopic: (topicId: string) => void;
}

const LibraryHero: React.FC<LibraryHeroProps> = ({
  theme,
  topics,
  activeTopic,
  sceneVariant,
  previewImageUrl,
  onSelectTopic,
}) => {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: '72vh' }}>
      <WorldScene variant={sceneVariant} mode="hero" className="absolute inset-0 h-full w-full opacity-55" />
      <img
        src={previewImageUrl || getWorldVisual(sceneVariant)}
        alt={activeTopic?.label || 'מאגרון'}
        className="absolute inset-0 h-full w-full object-cover opacity-78"
        referrerPolicy="no-referrer"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/55" />
      {theme.heroPattern && <div className={`pointer-events-none absolute inset-0 opacity-40 ${theme.heroPattern}`} />}
      <div className={`pointer-events-none absolute right-0 top-0 h-[400px] w-[600px] rounded-full blur-[120px] opacity-25 ${theme.heroGlowA}`} />
      <div className={`pointer-events-none absolute bottom-0 left-0 h-[300px] w-[500px] rounded-full blur-[100px] opacity-20 ${theme.heroGlowB}`} />

      <div className="relative z-10 mx-auto flex min-h-[inherit] h-full max-w-7xl flex-col justify-end px-4 pb-12 pt-20 sm:px-8 sm:pb-16 sm:pt-28">
        <div className="mb-8 flex items-center justify-between sm:mb-10">
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${theme.badge}`}>
            <Shield className="h-4 w-4" />
            כניסה לעולמות התוכן
          </div>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.82fr)] lg:gap-10">
          <div className="animate-slide-up">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.45em] text-white/30">MAAGARON · WORLD ENTRY</p>
            <h1 className="mb-5 text-5xl font-black leading-none tracking-tight text-white sm:text-7xl">
              בוחרים עולם
              <br />
              <span className="gradient-text">ונכנסים פנימה</span>
            </h1>
            <p className="mb-8 max-w-2xl text-base font-medium leading-relaxed text-slate-300 sm:text-xl">
              העמוד הראשי מתמקד רק בעולמות. כל עולם מרכז בתוכו את המצגות, הסרטונים, הכתבות, אירועי האמת וה־previewים ששייכים אליו.
            </p>

            {activeTopic && (
              <div className="mb-8 rounded-[1.75rem] border border-white/10 bg-black/25 p-5 backdrop-blur-md sm:p-6">
                <p className="text-[11px] font-black tracking-[0.28em] text-white/40">עולם פעיל</p>
                <h2 className="mt-3 text-3xl font-black text-white">{activeTopic.label}</h2>
                <p className="mt-3 text-sm leading-7 text-white/72 sm:text-base">{activeTopic.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {activeTopic.categories.slice(0, 5).map(category => (
                    <span
                      key={category}
                      className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs font-black text-white/78"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {topics.map(topic => {
                const isActive = topic.id === activeTopic?.id;

                return (
                  <button
                    key={topic.id}
                    onClick={() => onSelectTopic(topic.id)}
                    className={`group relative overflow-hidden rounded-[1.55rem] border p-4 text-right transition-all ${
                      isActive
                        ? 'border-white/20 bg-white/12 shadow-[0_20px_60px_rgba(0,0,0,0.34)]'
                        : 'border-white/10 bg-black/25 hover:-translate-y-1 hover:border-white/16 hover:bg-white/8'
                    }`}
                  >
                    <WorldScene variant={resolveWorldSceneVariant(topic.id, true)} mode="card" className="absolute inset-0 opacity-35" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/28 to-transparent" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-black text-white/85">
                          {topic.shortLabel || topic.label}
                        </span>
                        <Orbit className="h-4 w-4 text-white/45" />
                      </div>
                      <h3 className="mt-4 text-lg font-black text-white">{topic.label}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/72">{topic.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="animate-slide-up [animation-delay:120ms]">
            <div className="relative h-[20rem] overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 shadow-[0_30px_100px_rgba(0,0,0,0.38)] sm:h-[24rem]">
              <WorldScene variant={sceneVariant} mode="hero" className="absolute inset-0 opacity-55" />
              <img
                src={previewImageUrl || getWorldVisual(sceneVariant)}
                alt={activeTopic?.label || 'קטגוריה פעילה'}
                className="absolute inset-0 h-full w-full object-cover opacity-84"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <div className="rounded-[1.6rem] border border-white/10 bg-black/35 p-4 backdrop-blur-md">
                  <p className="text-[11px] font-black tracking-[0.22em] text-white/40">PREVIEW</p>
                  <p className="mt-2 text-2xl font-black text-white">{activeTopic?.label || 'מאגרון'}</p>
                  <p className="mt-2 text-sm leading-6 text-white/72">
                    {activeTopic?.headline || 'בחירה לעולם אחד, ואז מעבר ישיר לתוכן ששייך רק אליו.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LibraryHero;
