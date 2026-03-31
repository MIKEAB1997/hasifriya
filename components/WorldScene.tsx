import React from 'react';

export type WorldSceneVariant =
  | 'neutral'
  | 'social'
  | 'phishing'
  | 'identity'
  | 'deepfake'
  | 'cloud'
  | 'vulnerabilities'
  | 'insider'
  | 'ransomware'
  | 'cyber'
  | 'mobile'
  | 'mobile-incidents'
  | 'supply';

type WorldSceneMode = 'card' | 'panel' | 'hero';

interface WorldSceneProps {
  variant: WorldSceneVariant;
  mode?: WorldSceneMode;
  className?: string;
}

const getImageFileName = (variant: WorldSceneVariant | 'global') => {
  if (variant === 'insider') return 'espionage-bg.png';
  if (variant === 'mobile-incidents') return 'mobile_incidents-bg.png';
  if (variant === 'neutral') return 'global-bg.png';
  return `${variant}-bg.png`;
};

const overlayByVariant: Record<WorldSceneVariant, string> = {
  neutral: 'bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50',
  social: 'bg-gradient-to-t from-rose-950 via-rose-950/40 to-black/60',
  phishing: 'bg-gradient-to-t from-amber-950/90 via-black/40 to-black/80',
  identity: 'bg-gradient-to-t from-yellow-950/80 via-black/50 to-black/90',
  deepfake: 'bg-gradient-to-t from-fuchsia-950/90 via-[#0f0817]/60 to-[#0f0817]/90',
  cloud: 'bg-gradient-to-t from-sky-950/90 via-blue-900/40 to-black/80',
  vulnerabilities: 'bg-gradient-to-t from-orange-950/90 via-red-950/40 to-black/90',
  insider: 'bg-gradient-to-t from-[#0f1118]/95 via-transparent to-black/80',
  ransomware: 'bg-gradient-to-t from-red-950/95 via-red-900/30 to-black/90',
  cyber: 'bg-gradient-to-t from-[#04140b]/95 via-emerald-950/20 to-black/90',
  mobile: 'bg-gradient-to-t from-indigo-950/90 via-indigo-900/30 to-black/80',
  'mobile-incidents': 'bg-gradient-to-t from-violet-950/90 via-transparent to-black/90',
  supply: 'bg-gradient-to-t from-teal-950/90 via-teal-900/30 to-black/80',
};

export const resolveWorldSceneVariant = (
  topicId: string,
  isWorldMode = true
): WorldSceneVariant => {

  switch (topicId) {
    case 'shortcut-social':
      return 'social';
    case 'shortcut-phishing':
      return 'phishing';
    case 'shortcut-identity':
      return 'identity';
    case 'shortcut-deepfake':
      return 'deepfake';
    case 'shortcut-cloud':
      return 'cloud';
    case 'shortcut-vulnerabilities':
      return 'vulnerabilities';
    case 'shortcut-insider':
      return 'insider';
    case 'shortcut-ransomware':
      return 'ransomware';
    case 'shortcut-cyber':
      return 'cyber';
    case 'shortcut-mobile':
      return 'mobile';
    case 'shortcut-mobile-incidents':
      return 'mobile-incidents';
    case 'shortcut-supply':
      return 'supply';
    default:
      return 'neutral';
  }
};

const WorldScene: React.FC<WorldSceneProps> = ({ variant, mode = 'panel', className = '' }) => {
  const imgSrc = `/worlds/${getImageFileName(variant)}`;

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden rounded-[inherit] bg-black ${className}`}
    >
      <img
        src={imgSrc}
        alt={`${variant} world background`}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-[3000ms] ease-out ${mode === 'hero' ? 'scale-105 saturate-[1.2] opacity-90' : 'scale-100 saturate-100 opacity-60'
          }`}
      />

      {/* Dynamic Overlay per World to ensure UI readability */}
      <div className={`absolute inset-0 ${overlayByVariant[variant]}`} />

      {/* Shared Ambient Particles over the background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0)_60%,rgba(0,0,0,0.6)_100%)]" />

      {mode === 'hero' && (
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--tw-gradient-stops)] to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export default WorldScene;
