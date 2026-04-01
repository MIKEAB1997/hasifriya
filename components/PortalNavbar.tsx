import React, { useState } from 'react';
import { BookMarked, Menu, Search, Settings, X } from 'lucide-react';

type ThemeKey = string;

interface PortalNavbarProps {
  onLogoClick: () => void;
  onSearchClick: () => void;
  onCasesClick: () => void;
  onSupportClick: () => void;
  onAdminClick: () => void;
  onTopicsClick: () => void;
  themeMode?: 'light' | 'dark';
  themeKey?: ThemeKey;
  worldLabel?: string;
  isWorldMode?: boolean;
}

const THEME_ACCENTS: Record<string, { brand: string; worldChip: string; halo: string }> = {
  neutral: {
    brand: 'border-blue-200/70 bg-blue-50 text-blue-700',
    worldChip: 'border-gray-200 bg-white/90 text-gray-600',
    halo: 'shadow-[0_12px_40px_rgba(37,99,235,0.08)]',
  },
  cyber: {
    brand: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
    worldChip: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100',
    halo: 'shadow-[0_14px_60px_rgba(16,185,129,0.18)]',
  },
  phishing: {
    brand: 'border-amber-300/20 bg-amber-500/10 text-amber-100',
    worldChip: 'border-amber-300/20 bg-amber-500/10 text-amber-50',
    halo: 'shadow-[0_14px_60px_rgba(251,191,36,0.16)]',
  },
  identity: {
    brand: 'border-yellow-300/20 bg-yellow-500/10 text-yellow-100',
    worldChip: 'border-yellow-300/20 bg-yellow-500/10 text-yellow-50',
    halo: 'shadow-[0_14px_60px_rgba(250,204,21,0.16)]',
  },
  insider: {
    brand: 'border-rose-300/20 bg-rose-500/10 text-rose-100',
    worldChip: 'border-rose-300/20 bg-rose-500/10 text-rose-50',
    halo: 'shadow-[0_14px_60px_rgba(244,63,94,0.18)]',
  },
  ransomware: {
    brand: 'border-red-300/20 bg-red-500/10 text-red-100',
    worldChip: 'border-red-300/20 bg-red-500/10 text-red-50',
    halo: 'shadow-[0_14px_60px_rgba(248,113,113,0.18)]',
  },
  mobile: {
    brand: 'border-indigo-300/20 bg-indigo-500/10 text-indigo-100',
    worldChip: 'border-indigo-300/20 bg-indigo-500/10 text-indigo-50',
    halo: 'shadow-[0_14px_60px_rgba(99,102,241,0.18)]',
  },
  supply: {
    brand: 'border-teal-300/20 bg-teal-500/10 text-teal-100',
    worldChip: 'border-teal-300/20 bg-teal-500/10 text-teal-50',
    halo: 'shadow-[0_14px_60px_rgba(20,184,166,0.18)]',
  },
  espionage: {
    brand: 'border-violet-300/20 bg-violet-500/10 text-violet-100',
    worldChip: 'border-violet-300/20 bg-violet-500/10 text-slate-100',
    halo: 'shadow-[0_14px_60px_rgba(139,92,246,0.18)]',
  },
  cloud: {
    brand: 'border-sky-300/20 bg-sky-500/10 text-sky-100',
    worldChip: 'border-sky-300/20 bg-sky-500/10 text-sky-50',
    halo: 'shadow-[0_14px_60px_rgba(56,189,248,0.18)]',
  },
};

const PortalNavbar: React.FC<PortalNavbarProps> = ({
  onLogoClick,
  onSearchClick,
  onCasesClick,
  onSupportClick,
  onAdminClick,
  onTopicsClick,
  themeMode = 'light',
  themeKey = 'neutral',
  worldLabel,
  isWorldMode = false,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = themeMode === 'dark';
  const themeAccent = THEME_ACCENTS[themeKey] || THEME_ACCENTS['neutral'];

  const topBarClass = isDark
    ? 'border-white/10 bg-slate-950/80 shadow-lg shadow-black/20 backdrop-blur-xl'
    : 'glass border-gray-200 shadow-sm';

  const navWrapClass = isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-100';
  const navItemClass = isDark
    ? 'text-white/70 hover:text-white hover:bg-white/10'
    : 'text-gray-500 hover:text-gray-800 hover:bg-white/60';
  const iconButtonClass = isDark
    ? 'text-white/70 hover:text-white hover:bg-white/10'
    : 'text-gray-500 hover:text-primary hover:bg-primary/5';
  const mobileButtonClass = isDark
    ? 'text-white/75 hover:bg-white/10 hover:text-white'
    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';

  return (
    <header className={`sticky top-0 z-50 border-b ${topBarClass} ${themeAccent.halo}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <button
          onClick={() => {
            setMobileOpen(false);
            onLogoClick();
          }}
          className="group flex flex-shrink-0 items-center gap-2.5 rounded-2xl px-2 py-1.5 transition-all hover:-translate-y-0.5 hover:bg-white/5"
          aria-label="חזרה לראש העמוד"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform group-hover:scale-105"
          >
            <rect width="36" height="36" rx="9" fill={isDark ? '#0F172A' : '#EFF6FF'} />
            <path
              d="M18 5L7 10V19C7 25.1 11.9 30.8 18 32C24.1 30.8 29 25.1 29 19V10L18 5Z"
              fill={isDark ? '#34D399' : '#2563EB'}
              fillOpacity="0.18"
            />
            <path
              d="M18 7L8.5 11.4V19C8.5 24.4 12.8 29.3 18 30.6C23.2 29.3 27.5 24.4 27.5 19V11.4L18 7Z"
              stroke={isDark ? '#34D399' : '#2563EB'}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M13.5 18.5L16.5 21.5L22.5 15.5"
              stroke={isDark ? '#34D399' : '#2563EB'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="hidden min-w-0 items-center gap-2 sm:flex">
            <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              מאגרון
            </span>
            {isWorldMode && worldLabel && (
              <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black tracking-[0.22em] ${themeAccent.worldChip}`}>
                {worldLabel}
              </span>
            )}
          </div>
        </button>

        <nav className={`hidden items-center gap-1 rounded-2xl border p-1 md:flex ${navWrapClass}`}>
          <button onClick={onTopicsClick} className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition-all ${navItemClass}`}>
            עולמות
          </button>
          <button onClick={onCasesClick} className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition-all ${navItemClass}`}>
            אירועי אמת
          </button>
          <button onClick={onSupportClick} className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition-all ${navItemClass}`}>
            מדף עזר
          </button>
        </nav>

        <div className="flex flex-shrink-0 items-center gap-1">
          <button onClick={onSearchClick} className={`rounded-xl p-2.5 transition-all ${iconButtonClass}`} title="חיפוש">
            <Search className="h-5 w-5" />
          </button>
          <button onClick={onSupportClick} className={`rounded-xl p-2.5 transition-all ${iconButtonClass}`} title="מדף עזר">
            <BookMarked className="h-5 w-5" />
          </button>
          <button onClick={onAdminClick} className={`rounded-xl p-2.5 transition-all ${iconButtonClass}`} title="ניהול">
            <Settings className="h-5 w-5" />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`rounded-xl p-2.5 transition-all md:hidden ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className={`animate-fade-in border-t px-4 py-3 md:hidden ${isDark ? 'border-white/10 bg-slate-950/95' : 'border-gray-200 bg-white'}`}>
          <div className="flex flex-col gap-1">
            {isWorldMode && worldLabel && (
              <div className={`mb-2 rounded-2xl border px-4 py-3 text-xs font-black tracking-[0.2em] ${themeAccent.brand}`}>
                {worldLabel}
              </div>
            )}
            <button
              onClick={() => {
                setMobileOpen(false);
                onTopicsClick();
              }}
              className={`rounded-xl px-4 py-3 text-right text-sm font-bold transition-all ${mobileButtonClass}`}
            >
              עולמות
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                onCasesClick();
              }}
              className={`rounded-xl px-4 py-3 text-right text-sm font-bold transition-all ${mobileButtonClass}`}
            >
              אירועי אמת
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                onSupportClick();
              }}
              className={`rounded-xl px-4 py-3 text-right text-sm font-bold transition-all ${mobileButtonClass}`}
            >
              מדף עזר
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default PortalNavbar;
