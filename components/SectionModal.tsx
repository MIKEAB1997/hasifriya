import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import WorldScene, { WorldSceneVariant } from './WorldScene';

type ThemeKey = 'neutral' | 'cyber' | 'phishing' | 'espionage' | 'cloud';

interface SectionModalProps {
  title: string;
  subtitle?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  themeKey?: ThemeKey;
  sceneVariant?: WorldSceneVariant;
}

const MODAL_THEME: Record<
  ThemeKey,
  {
    overlay: string;
    shell: string;
    frame: string;
    header: string;
    title: string;
    subtitle: string;
    divider: string;
    close: string;
    body: string;
  }
> = {
  neutral: {
    overlay: 'bg-slate-950/70',
    shell: 'bg-white/92 border-slate-200 text-slate-950',
    frame: 'bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,250,252,0.94))]',
    header: 'bg-white/82',
    title: 'text-slate-950',
    subtitle: 'text-slate-500',
    divider: 'border-slate-200',
    close: 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900',
    body: 'bg-transparent',
  },
  cyber: {
    overlay: 'bg-[#010503]/82',
    shell: 'bg-[#07120c]/88 border-emerald-400/15 text-emerald-50',
    frame: 'bg-[linear-gradient(180deg,rgba(7,18,12,0.92),rgba(3,10,6,0.96))]',
    header: 'bg-[#08130d]/82',
    title: 'text-emerald-50',
    subtitle: 'text-emerald-100/70',
    divider: 'border-emerald-500/12',
    close: 'bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/18 hover:text-white',
    body: 'bg-transparent',
  },
  phishing: {
    overlay: 'bg-[#090501]/82',
    shell: 'bg-[#1b1107]/88 border-amber-300/15 text-amber-50',
    frame: 'bg-[linear-gradient(180deg,rgba(27,17,7,0.92),rgba(19,11,4,0.96))]',
    header: 'bg-[#1a1007]/84',
    title: 'text-amber-50',
    subtitle: 'text-amber-100/72',
    divider: 'border-amber-500/12',
    close: 'bg-amber-500/10 text-amber-100 hover:bg-amber-500/18 hover:text-white',
    body: 'bg-transparent',
  },
  espionage: {
    overlay: 'bg-[#04050a]/84',
    shell: 'bg-[#121725]/88 border-violet-300/15 text-slate-50',
    frame: 'bg-[linear-gradient(180deg,rgba(18,23,37,0.92),rgba(11,13,21,0.96))]',
    header: 'bg-[#0f1320]/84',
    title: 'text-slate-50',
    subtitle: 'text-slate-200/70',
    divider: 'border-violet-500/12',
    close: 'bg-violet-500/10 text-violet-100 hover:bg-violet-500/18 hover:text-white',
    body: 'bg-transparent',
  },
  cloud: {
    overlay: 'bg-[#031019]/82',
    shell: 'bg-[#0d1d2a]/88 border-sky-300/15 text-sky-50',
    frame: 'bg-[linear-gradient(180deg,rgba(13,29,42,0.92),rgba(7,18,28,0.96))]',
    header: 'bg-[#0d1d2a]/84',
    title: 'text-sky-50',
    subtitle: 'text-sky-100/72',
    divider: 'border-sky-500/12',
    close: 'bg-sky-500/10 text-sky-100 hover:bg-sky-500/18 hover:text-white',
    body: 'bg-transparent',
  },
};

const SectionModal: React.FC<SectionModalProps> = ({
  title,
  subtitle,
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-5xl',
  themeKey = 'neutral',
  sceneVariant = 'neutral',
}) => {
  const theme = MODAL_THEME[themeKey];

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto backdrop-blur-xl ${theme.overlay}`}
      onClick={onClose}
      dir="rtl"
    >
      <div
        className={`relative w-full ${maxWidth} min-h-full sm:min-h-0 sm:my-6 overflow-hidden border shadow-2xl sm:rounded-[2rem] animate-slide-up ${theme.shell}`}
        onClick={event => event.stopPropagation()}
      >
        <div className={`absolute inset-0 ${theme.frame}`} />
        <div className="absolute inset-x-0 top-0 h-56 overflow-hidden">
          <WorldScene variant={sceneVariant} mode="panel" className="opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-transparent" />
        </div>
        <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

        <div className="relative z-10 flex min-h-full flex-col">
          <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-5 sm:px-8 backdrop-blur-xl ${theme.header} ${theme.divider} border-b`}>
            <div className="max-w-[calc(100%-4.5rem)]">
              <h2 className={`text-xl font-black tracking-tight sm:text-2xl ${theme.title}`}>{title}</h2>
              {subtitle && <p className={`mt-0.5 text-sm font-medium ${theme.subtitle}`}>{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className={`flex-shrink-0 rounded-full p-2.5 transition-colors ${theme.close}`}
              aria-label="סגור"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className={`relative z-10 flex-grow overflow-y-auto custom-scroll ${theme.body}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionModal;
