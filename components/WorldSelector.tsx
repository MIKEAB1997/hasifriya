import React, { useState } from 'react';
import { ArrowUpLeft, Settings, Shield, Orbit } from 'lucide-react';
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
    label: 'מובייל',
    labelEn: 'MOBILE',
    tagline: 'הארגון נמצא בכיס: תקשורת, נסיעות לחו"ל והשפעת רשת בדרכים.',
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
    label: 'תקיפות מובייל',
    labelEn: 'MOBILE BREACH',
    tagline: 'פריצה שקטה מרחוק למכשירי קצה ללא התערבות משתמש.',
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
    labelEn: 'SUPPLY',
    tagline: 'גישה של ספקים וחשבונות שותפים שהפכה לכניסה העיקרית של התוקפים.',
    accentColor: '#14b8a6',
    borderIdle: 'rgba(20,184,166,0.18)',
    borderHover: 'rgba(20,184,166,0.8)',
    glowColor: 'rgba(20,184,166,0.25)',
    mood: 'מרחב גיאומטרי מצטלב של טורקיז וכחול קר ושרשרת פיסית שבורה.',
    cues: ['Vendor', 'Remote Access', 'Third Party']
  }
];

interface WorldSelectorProps {
  onSelectWorld: (topicId: string) => void;
  onAdminClick: () => void;
}

const WorldSelector: React.FC<WorldSelectorProps> = ({ onSelectWorld, onAdminClick }) => {
  const [hoveredWorld, setHoveredWorld] = useState<WorldDef | null>(null);

  // Split into left and right columns for the layout
  const leftCol = WORLDS.slice(0, 6);
  const rightCol = WORLDS.slice(6, 12);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black font-sans selection:bg-white/30 text-white">
      {/* Immersive 3D Game Background that changes on hover */}
      <div className="absolute inset-0 transition-all duration-1000">
        <WorldScene 
          variant={hoveredWorld ? hoveredWorld.variant : 'neutral'} 
          mode="hero" 
        />
        {/* Deep dark gradient over background to ensure UI is readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      </div>

      <header className="absolute top-0 inset-x-0 h-24 flex items-center justify-between px-10 z-20">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
            <Orbit className="h-6 w-6 text-white/80" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-[0.2em] text-white">מאגרון</h1>
            <p className="text-xs font-mono tracking-widest text-white/50">GLOBAL LIBRARY HUB</p>
          </div>
        </div>
        <button
          onClick={onAdminClick}
          className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/15 transition-colors border border-white/10 flex items-center justify-center backdrop-blur-md"
        >
          <Settings className="h-4 w-4 text-white/70" />
        </button>
      </header>

      {/* Main UI Layout - Epic Game Selection Menu Style */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-24 px-8">
        
        {/* Title Area */}
        <div className="text-center mb-10 transform transition-all duration-500">
          <h2 className="text-[10px] sm:text-xs font-mono tracking-[0.5em] text-white/40 mb-4 uppercase">
            {hoveredWorld ? 'INCOMING CONNECTION' : 'SELECT YOUR DESTINATION'}
          </h2>
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight"
            style={{
              color: hoveredWorld ? hoveredWorld.accentColor : 'white',
              textShadow: hoveredWorld ? `0 0 40px ${hoveredWorld.glowColor}` : '0 0 20px rgba(255,255,255,0.2)'
            }}
          >
            {hoveredWorld ? hoveredWorld.label : 'בחר עולם סייבר'}
          </h1>
          <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto font-light h-16">
            {hoveredWorld ? hoveredWorld.tagline : 'היכנס לממד סייבר ספציפי כדי לחקור אירועים, חומרים מיוחדים ותרחישי אמת מותאמים.'}
          </p>
        </div>

        {/* Two-Column Clean Grid */}
        <div className="w-full max-w-6xl mx-auto flex gap-4 md:gap-8 justify-center">
          
          {/* Left Column */}
          <div className="flex flex-col gap-3 w-1/2 max-w-[400px]">
            {leftCol.map(world => (
              <WorldMenuItem 
                key={world.id} 
                world={world} 
                isHovered={hoveredWorld?.id === world.id}
                onHover={() => setHoveredWorld(world)}
                onLeave={() => setHoveredWorld(null)}
                onClick={() => onSelectWorld(world.id)}
              />
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-3 w-1/2 max-w-[400px]">
            {rightCol.map(world => (
              <WorldMenuItem 
                key={world.id} 
                world={world}
                isHovered={hoveredWorld?.id === world.id}
                onHover={() => setHoveredWorld(world)}
                onLeave={() => setHoveredWorld(null)}
                onClick={() => onSelectWorld(world.id)}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

// Sub-component for individual list item rendering
const WorldMenuItem = ({ world, isHovered, onHover, onLeave, onClick }: { 
  world: WorldDef, isHovered: boolean, onHover: () => void, onLeave: () => void, onClick: () => void 
}) => {
  return (
    <button
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={`relative group w-full flex items-center justify-between p-4 rounded-xl border backdrop-blur-md transition-all duration-300 ${
        isHovered 
          ? 'bg-black/60 scale-[1.02] translate-x-2' 
          : 'bg-black/30 hover:bg-black/50 hover:border-white/20 border-white/5'
      }`}
      style={{
        borderColor: isHovered ? world.borderHover : '',
        boxShadow: isHovered ? `0 0 30px ${world.glowColor} inset, 0 0 20px ${world.glowColor}` : ''
      }}
    >
      <div className="flex items-center gap-4 text-right">
        {/* Bullet Indicator */}
        <div 
          className="w-1.5 h-8 rounded-full transition-all duration-300"
          style={{ backgroundColor: isHovered ? world.accentColor : 'rgba(255,255,255,0.1)' }}
        />
        <div>
          <h3 
            className="text-xl font-bold transition-colors duration-300 text-right"
            style={{ color: isHovered ? 'white' : 'rgba(255,255,255,0.7)' }}
          >
            {world.label}
          </h3>
          <p className="text-[10px] font-mono tracking-widest uppercase mt-1 text-right transition-colors duration-300" style={{ color: isHovered ? world.accentColor : 'rgba(255,255,255,0.3)' }}>
            {world.labelEn} // {world.cues[0]}
          </p>
        </div>
      </div>
      
      <ArrowUpLeft 
        className={`w-5 h-5 transition-all duration-300 transform ${isHovered ? 'opacity-100 translate-x-[-8px]' : 'opacity-0 translate-x-0'}`} 
        style={{ color: world.accentColor }}
      />
    </button>
  );
};

export default WorldSelector;
