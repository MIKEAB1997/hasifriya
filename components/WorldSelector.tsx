import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpLeft, Orbit, Settings, Shield } from 'lucide-react';
import WorldScene, { WorldSceneVariant } from './WorldScene';
import { getWorldVisual } from './worldVisuals';

interface WorldDef {
  id: string;
  variant: WorldSceneVariant;
  label: string;
  labelEn: string;
  tagline: string;
  accentColor: string;
  borderIdle: string;
  borderHover: string;
  glowColor: string;
  mood: string;
  cues: string[];
}

const WORLDS: WorldDef[] = [
  {
    id: 'shortcut-cyber',
    variant: 'cyber',
    label: 'עולם הסייבר',
    labelEn: 'CYBER',
    tagline: 'APT, מדינות, ריגול, חולשות מנוצלות ותמונת מצב חיה של זירת התקיפה.',
    accentColor: '#34d399',
    borderIdle: 'rgba(52,211,153,0.18)',
    borderHover: 'rgba(52,211,153,0.75)',
    glowColor: 'rgba(52,211,153,0.24)',
    mood: 'מטריקס ירוק, מודיעין חי וזירת תקיפה עולמית.',
    cues: ['APT', 'Threat Intel', 'Cyber']
  },
  {
    id: 'shortcut-phishing',
    variant: 'phishing',
    label: 'עולם הפישינג',
    labelEn: 'PHISHING',
    tagline: 'דפי התחברות מזויפים, הודעות דחופות, מיילים ו־SMS שמתחזים לאמת.',
    accentColor: '#fbbf24',
    borderIdle: 'rgba(251,191,36,0.18)',
    borderHover: 'rgba(251,191,36,0.75)',
    glowColor: 'rgba(251,191,36,0.24)',
    mood: 'מלכודות, המסכים השקריים, נורות אזהרה ומלכודות מתוחכמות.',
    cues: ['Email', 'SMS', 'Fake Login']
  },
  {
    id: 'shortcut-social',
    variant: 'social',
    label: 'הנדסה חברתית',
    labelEn: 'SOCIAL',
    tagline: 'לחץ, אמון, דחיפות וניצול של בני אדם לפני ניצול של טכנולוגיה.',
    accentColor: '#fb923c',
    borderIdle: 'rgba(251,146,60,0.18)',
    borderHover: 'rgba(251,146,60,0.75)',
    glowColor: 'rgba(251,146,60,0.24)',
    mood: 'עולם של שכנוע, שיחות, פיתוי והפעלת לחץ אנושי מתעתע.',
    cues: ['Urgency', 'Authority', 'Manipulation']
  },
  {
    id: 'shortcut-identity',
    variant: 'identity',
    label: 'זהויות והרשאות',
    labelEn: 'IDENTITY',
    tagline: 'MFA, SSO, הרשאות וחשבון אחד שיכול לפתוח או להפיל ארגון.',
    accentColor: '#facc15',
    borderIdle: 'rgba(250,204,21,0.18)',
    borderHover: 'rgba(250,204,21,0.85)',
    glowColor: 'rgba(250,204,21,0.28)',
    mood: 'ליבה של גישה מוגנת, קוד הרשאות ומנעולים ביומטריים.',
    cues: ['MFA', 'SSO', 'Access']
  },
  {
    id: 'shortcut-deepfake',
    variant: 'deepfake',
    label: 'Deepfake ו-AI',
    labelEn: 'AI & FAKE',
    tagline: 'קול, וידאו וזהות מלאכותית שנראים אנושיים מספיק כדי לעקוף שיקול דעת.',
    accentColor: '#e879f9',
    borderIdle: 'rgba(232,121,249,0.18)',
    borderHover: 'rgba(232,121,249,0.85)',
    glowColor: 'rgba(232,121,249,0.28)',
    mood: 'רשת נוירונים צבעונית, מראה שבורה ותודעה מסונתזת פנטסטית.',
    cues: ['Voice Clone', 'Synthetic Media', 'Identity']
  },
  {
    id: 'shortcut-vulnerabilities',
    variant: 'vulnerabilities',
    label: 'חולשות ו-KEV',
    labelEn: 'VULN',
    tagline: 'אפס-ימים, עדכונים דחופים, שרתים חשופים ונקודות תורפה קריטיות.',
    accentColor: '#f97316',
    borderIdle: 'rgba(249,115,22,0.18)',
    borderHover: 'rgba(249,115,22,0.8)',
    glowColor: 'rgba(249,115,22,0.25)',
    mood: 'זרקורי סריקה, התרעות צבע כתום ומדדים קריטיים במערכת.',
    cues: ['Zero Day', 'CVE', 'Patching']
  },
  {
    id: 'shortcut-insider',
    variant: 'insider',
    label: 'איומי פנים',
    labelEn: 'INSIDER',
    tagline: 'גישה לא-נכונה, טעויות חמורות או עמוקות בתוך מתחמי הארגון.',
    accentColor: '#f43f5e',
    borderIdle: 'rgba(244,63,94,0.18)',
    borderHover: 'rgba(244,63,94,0.85)',
    glowColor: 'rgba(244,63,94,0.3)',
    mood: 'מרחב חשאי של צדודיות באפלה, אורות סורקים ותחושת מעקב עדינה.',
    cues: ['Privilege', 'Behavior', 'Data Leak']
  },
  {
    id: 'shortcut-ransomware',
    variant: 'ransomware',
    label: 'כופרה',
    labelEn: 'RANSOMWARE',
    tagline: 'הצפנה, דרישות תשלום, שיתוק והרגעים הראשונים שאחרי הנפילה.',
    accentColor: '#f87171',
    borderIdle: 'rgba(248,113,113,0.18)',
    borderHover: 'rgba(248,113,113,0.75)',
    glowColor: 'rgba(248,113,113,0.24)',
    mood: 'אדום חם, סירנות מהבהבות, נתונים מוצפנים ותחושת סכנה.',
    cues: ['Encryption', 'Extortion', 'Recovery']
  },
  {
    id: 'shortcut-mobile',
    variant: 'mobile',
    label: 'מובייל ונסיעות',
    labelEn: 'MOBILE',
    tagline: 'הארגון נמצא בכיס: Wi-Fi פתוח, אפליקציות חודרניות והשפעת רשת בדרכים.',
    accentColor: '#6366f1',
    borderIdle: 'rgba(99,102,241,0.18)',
    borderHover: 'rgba(99,102,241,0.8)',
    glowColor: 'rgba(99,102,241,0.25)',
    mood: 'חלל אינדיגו עמוק עם רשתות קורנות, אותות ניידים ומסכים צפים.',
    cues: ['Apps', 'Wi-Fi', 'Travel']
  },
  {
    id: 'shortcut-mobile-incidents',
    variant: 'mobile-incidents',
    label: 'פריצות למובייל',
    labelEn: 'MOBILE BREACH',
    tagline: 'אירועי עבר מרעישים של פריצה שקטה מרחוק למכשירי קצה.',
    accentColor: '#8b5cf6',
    borderIdle: 'rgba(139,92,246,0.18)',
    borderHover: 'rgba(139,92,246,0.8)',
    glowColor: 'rgba(139,92,246,0.25)',
    mood: 'צלילה לחיבורים נסתרים, אלמנטי רקע ארגמניים ואוקיינוס נתונים.',
    cues: ['Spyware', 'Zero Click', 'iOS/Android']
  },
  {
    id: 'shortcut-cloud',
    variant: 'cloud',
    label: 'ענן ו-SaaS',
    labelEn: 'CLOUD',
    tagline: 'סייבר חוצה גבולות בתוך מרחבי האחסון והדאטה המשולבים בארגון.',
    accentColor: '#38bdf8',
    borderIdle: 'rgba(56,189,248,0.18)',
    borderHover: 'rgba(56,189,248,0.75)',
    glowColor: 'rgba(56,189,248,0.24)',
    mood: 'חדר צלול, צבעי שמים סייבריים הולכים ומתבהרים.',
    cues: ['Drive', 'Sharing', 'Permissions']
  },
  {
    id: 'shortcut-supply',
    variant: 'supply',
    label: 'שרשרת אספקה',
    labelEn: 'SUPPLY CHAIN',
    tagline: 'גישה של ספקים וחשבונות שותפים שהפכה לכניסה העיקרית של התוקפים.',
    accentColor: '#14b8a6',
    borderIdle: 'rgba(20,184,166,0.18)',
    borderHover: 'rgba(20,184,166,0.8)',
    glowColor: 'rgba(20,184,166,0.25)',
    mood: 'מרחב גיאומטרי מצטלב של טורקיז וכחול קר ושרשרת פיסית שבורה.',
    cues: ['Vendor', 'Remote Access', 'Third Party']
  }
];

const ORBIT_LAYOUT = [
  { top: '3%', right: '10%' },
  { top: '15%', right: '-2%' },
  { top: '47%', right: '-4%' },
  { top: '76%', right: '6%' },
  { top: '88%', right: '35%' },
  { top: '78%', left: '10%' },
  { top: '56%', left: '-2%' },
  { top: '24%', left: '-5%' },
  { top: '4%', left: '10%' },
  { top: '38%', right: '23%' },
  { top: '20%', left: '26%' },
  { top: '65%', left: '18%' }
];


interface WorldSelectorProps {
  onSelectWorld: (topicId: string) => void;
  onAdminClick: () => void;
}

const WorldSelector: React.FC<WorldSelectorProps> = ({ onSelectWorld, onAdminClick }) => {
  const [entering, setEntering] = useState<string | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [previewWorldId, setPreviewWorldId] = useState(WORLDS[0]?.id ?? '');

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const previewWorld = useMemo(
    () => WORLDS.find(world => world.id === (entering || previewWorldId)) || WORLDS[0],
    [entering, previewWorldId]
  );

  const handleEnter = (worldId: string) => {
    if (entering) return;
    setEntering(worldId);
    setTimeout(() => setOverlayVisible(true), 45);
    setTimeout(() => onSelectWorld(worldId), 230);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      dir="rtl"
      style={{ background: 'radial-gradient(circle at top, #11204a 0%, #060d1d 34%, #02050d 100%)' }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_22%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.10),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.18),rgba(2,6,23,0.88))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div className="absolute -top-20 left-[12%] h-80 w-80 rounded-full bg-cyan-400/12 blur-[120px]" />
        <div className="absolute top-[18%] right-[10%] h-96 w-96 rounded-full bg-fuchsia-500/10 blur-[140px]" />
        <div className="absolute bottom-[-8rem] left-[28%] h-96 w-96 rounded-full bg-emerald-500/10 blur-[160px]" />
      </div>

      {overlayVisible && (
        <div className="fixed inset-0 z-[100] animate-world-overlay bg-black" />
      )}

      <header className="relative z-20 mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-300/25 bg-blue-400/10 text-blue-100">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-black tracking-[0.28em] text-white/35">GLOBAL LIBRARY</p>
            <p className="text-xl font-black text-white">מאגרון</p>
          </div>
        </div>

        <button
          onClick={onAdminClick}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white/70 transition-all hover:bg-white/10 hover:text-white"
        >
          <Settings className="h-4 w-4" />
          ניהול
        </button>
      </header>

      <main className="relative z-10 mx-auto max-w-screen-2xl px-4 pb-12 sm:px-8 sm:pb-20">
        <div
          className="mx-auto max-w-4xl text-center transition-all duration-700"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <p className="text-[11px] font-black tracking-[0.45em] text-white/35 sm:text-xs">GLOBAL WORLD ENTRY</p>
        </div>

        <section className="relative mt-4 hidden min-h-[48rem] lg:block">
          <div className="absolute inset-0">
            <div className="animate-orbit-slow absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8" />
            <div className="animate-orbit-reverse absolute left-1/2 top-1/2 h-[31rem] w-[31rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12 bg-white/[0.03] shadow-[0_0_120px_rgba(59,130,246,0.14)]" />
          </div>

          <div className={`absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-white/10 bg-black/25 shadow-[0_50px_160px_rgba(0,0,0,0.55)] ${entering ? 'animate-world-enter' : ''}`}>
            <WorldScene variant={previewWorld.variant} mode="hero" className="absolute inset-0 opacity-55" />
            <img
              src={getWorldVisual(previewWorld.variant)}
              alt={previewWorld.label}
              className="absolute inset-0 h-full w-full object-cover opacity-82"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_36%),linear-gradient(to_top,rgba(0,0,0,0.75),rgba(0,0,0,0.10))]" />
            <div className="animate-planet-pulse absolute inset-[14%] rounded-full border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.08)]" />

            <div className="absolute inset-x-0 bottom-0 p-7">
              <div className="mx-auto max-w-sm rounded-[2rem] border border-white/10 bg-black/40 p-5 text-center backdrop-blur-xl">
                <p className="text-[11px] font-black tracking-[0.28em] text-white/40">ACTIVE WORLD</p>
                <h2 className="mt-2 text-3xl font-black text-white">{previewWorld.label}</h2>
                <p className="mt-3 text-sm leading-7 text-white/70">{previewWorld.mood}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {previewWorld.cues.map(cue => (
                    <span
                      key={cue}
                      className="rounded-full border px-3 py-1 text-[11px] font-black"
                      style={{
                        color: previewWorld.accentColor,
                        borderColor: previewWorld.borderHover,
                        background: previewWorld.glowColor,
                      }}
                    >
                      {cue}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleEnter(previewWorld.id)}
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white transition-all hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${previewWorld.accentColor}, rgba(255,255,255,0.12))`,
                    boxShadow: `0 20px 50px ${previewWorld.glowColor}`,
                  }}
                >
                  כניסה לעולם
                  <ArrowUpLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {WORLDS.map((world, index) => {
            const pos = ORBIT_LAYOUT[index % ORBIT_LAYOUT.length];
            const isActive = previewWorld.id === world.id;
            const isEntering = entering === world.id;

            return (
              <button
                key={world.id}
                onMouseEnter={() => setPreviewWorldId(world.id)}
                onFocus={() => setPreviewWorldId(world.id)}
                onClick={() => handleEnter(world.id)}
                className={`group absolute w-[13rem] text-right transition-all duration-500 ${entering && entering !== world.id ? 'opacity-0' : ''}`}
                style={{
                  ...pos,
                  transform: isEntering ? 'scale(1.08)' : isActive ? 'translateY(-8px) scale(1.03)' : 'translateY(0)',
                }}
              >
                <div
                  className="relative overflow-hidden rounded-[1.8rem] border bg-black/35 p-4 backdrop-blur-xl transition-all duration-500"
                  style={{
                    borderColor: isActive ? world.borderHover : world.borderIdle,
                    boxShadow: isActive ? `0 25px 80px ${world.glowColor}` : '0 20px 55px rgba(0,0,0,0.22)',
                  }}
                >
                  <WorldScene variant={world.variant} mode="card" className="absolute inset-0 opacity-35" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/88 to-black/25" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="rounded-full border px-2.5 py-1 text-[10px] font-black tracking-[0.22em]"
                        style={{
                          color: world.accentColor,
                          borderColor: world.borderHover,
                          background: world.glowColor,
                        }}
                      >
                        {world.labelEn}
                      </span>
                      <Orbit className="h-4 w-4 text-white/45" />
                    </div>
                    <h3 className="mt-4 text-lg font-black text-white">{world.label}</h3>
                    <p className="mt-2 text-xs leading-6 text-white/68">{world.tagline}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </section>

        <section className="mt-4 lg:hidden">
          <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-black/30 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.42)]">
            <div className="relative h-[22rem] overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/25">
              <WorldScene variant={previewWorld.variant} mode="hero" className="absolute inset-0 opacity-55" />
              <img
                src={getWorldVisual(previewWorld.variant)}
                alt={previewWorld.label}
                className="absolute inset-0 h-full w-full object-cover opacity-84"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-black/42 p-4 backdrop-blur-xl">
                  <p className="text-[10px] font-black tracking-[0.28em] text-white/40">WORLD PREVIEW</p>
                  <h2 className="mt-2 text-2xl font-black text-white">{previewWorld.label}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/68">{previewWorld.mood}</p>
                </div>
              </div>
            </div>

            <div className="hide-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
              {WORLDS.map(world => {
                const isActive = previewWorld.id === world.id;
                return (
                  <button
                    key={world.id}
                    onClick={() => handleEnter(world.id)}
                    onMouseEnter={() => setPreviewWorldId(world.id)}
                    className="relative min-w-[13rem] overflow-hidden rounded-[1.55rem] border bg-black/30 p-4 text-right backdrop-blur-xl"
                    style={{
                      borderColor: isActive ? world.borderHover : world.borderIdle,
                      boxShadow: isActive ? `0 20px 50px ${world.glowColor}` : 'none',
                    }}
                  >
                    <WorldScene variant={world.variant} mode="card" className="absolute inset-0 opacity-35" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/88 to-black/25" />
                    <div className="relative z-10">
                      <p className="text-[10px] font-black tracking-[0.24em]" style={{ color: world.accentColor }}>
                        {world.labelEn}
                      </p>
                      <h3 className="mt-3 text-base font-black text-white">{world.label}</h3>
                      <p className="mt-2 text-xs leading-6 text-white/68">{world.mood}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handleEnter(previewWorld.id)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-black text-white"
              style={{
                background: `linear-gradient(135deg, ${previewWorld.accentColor}, rgba(255,255,255,0.12))`,
              }}
            >
              כניסה לעולם
              <ArrowUpLeft className="h-4 w-4" />
            </button>
          </div>
        </section>

      </main>
    </div>
  );
};

export default WorldSelector;
