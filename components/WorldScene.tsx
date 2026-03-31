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

const wrapperByVariant: Record<WorldSceneVariant, string> = {
  neutral: 'from-slate-100 via-white to-slate-200',
  social: 'from-rose-950 via-fuchsia-950 to-orange-900',
  phishing: 'from-amber-950 via-orange-950 to-stone-950',
  identity: 'from-yellow-950 via-stone-950 to-black',
  deepfake: 'from-indigo-950 via-fuchsia-950 to-slate-950',
  cloud: 'from-sky-950 via-blue-950 to-slate-950',
  vulnerabilities: 'from-orange-950 via-amber-950 to-stone-950',
  insider: 'from-slate-950 via-zinc-900 to-rose-950',
  ransomware: 'from-red-950 via-orange-950 to-black',
  cyber: 'from-emerald-950 via-black to-lime-950',
  mobile: 'from-indigo-950 via-slate-950 to-cyan-950',
  'mobile-incidents': 'from-violet-950 via-slate-950 to-indigo-950',
  supply: 'from-teal-950 via-cyan-950 to-slate-950',
};

const frameByMode: Record<WorldSceneMode, string> = {
  card: 'opacity-90 saturate-[1.05] contrast-[1.02]',
  panel: 'opacity-100 saturate-110 contrast-110',
  hero: 'opacity-100 saturate-125 contrast-110',
};

const GlowNode: React.FC<{ className: string; color: string }> = ({ className, color }) => (
  <span className={`absolute h-3.5 w-3.5 rounded-full shadow-[0_0_40px_currentColor] ${className} ${color}`} />
);

const SurfaceCard: React.FC<{ className: string; children?: React.ReactNode }> = ({ className, children }) => (
  <div className={`absolute rounded-[1.8rem] border border-white/10 bg-black/25 backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

const GridFloor: React.FC<{ className: string }> = ({ className }) => (
  <div className={`absolute inset-x-[-10%] bottom-[-8%] h-[45%] [transform:perspective(900px)_rotateX(72deg)] ${className}`} />
);

export const resolveWorldSceneVariant = (
  topicId: string,
  isWorldMode = true
): WorldSceneVariant => {
  if (!isWorldMode) return 'neutral';

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

const renderScene = (variant: WorldSceneVariant) => {
  switch (variant) {
    case 'cyber':
      return (
        <>
          <GridFloor className="bg-[linear-gradient(rgba(74,222,128,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(74,222,128,0.2)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />
          <div className="animate-glow-pulse absolute right-10 top-8 h-44 w-44 rounded-full border border-emerald-300/40 bg-emerald-400/10 shadow-[0_0_80px_rgba(74,222,128,0.3)]" />
          <div className="animate-orbit-slow absolute right-[0.5rem] top-[-1.5rem] h-64 w-64 rounded-full border-r-2 border-emerald-200/30" />
          <div className="absolute right-[7.6rem] top-2 h-52 w-[2px] bg-emerald-200/40 translate-x-[40px] animate-slide-up" />
          <div className="absolute left-[30%] top-[-10%] w-[1px] h-[120%] bg-emerald-400/20 rotate-12" />
          <SurfaceCard className="left-8 top-20 w-[18rem] p-5 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]"><div className="mb-3 h-3 w-28 rounded-full bg-emerald-200/30 animate-pulse" /><div className="mb-2 h-2 w-48 rounded-full bg-emerald-300/40" /><div className="mb-2 h-2 w-full rounded-full bg-emerald-400/20" /></SurfaceCard>
          {['IRN', 'CN', 'APT'].map((label, index) => <div key={label} className={`absolute font-mono text-xs font-bold tracking-[0.45em] text-emerald-200/80 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)] ${index === 0 ? 'right-24 top-56 animate-float-node' : index === 1 ? 'right-10 top-72' : 'right-40 top-80'}`}>{label}</div>)}
          {Array.from({ length: 12 }).map((_, index) => <div key={index} className="absolute top-0 w-[1px] bg-emerald-400/30 animate-scan-line" style={{ right: `${20 + index * 42}px`, height: `${100 + (index % 4) * 80}%`, animationDelay: `${index * 0.3}s` }} />)}
        </>
      );
    case 'phishing':
      return (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(245,158,11,0.15),transparent_60%)]" />
          <SurfaceCard className="left-10 top-20 w-[20rem] p-6 border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
            <div className="text-amber-200/90 text-[10px] font-black tracking-widest mb-4">URGENT MESSAGE</div>
            <div className="mb-4 h-3 w-32 rounded-full bg-amber-200/30" />
            <div className="rounded-xl border border-amber-400/30 bg-black/60 p-4 shadow-inner">
              <div className="mb-3 h-3 w-40 rounded-full bg-amber-300/40" />
              <div className="mb-3 h-10 w-full rounded-lg bg-black/50 border border-amber-500/20" />
              <div className="h-8 w-full rounded-lg bg-amber-500/40 animate-pulse" />
            </div>
          </SurfaceCard>
          <div className="absolute right-16 top-14 h-24 w-24 rounded-full border-4 border-dashed border-amber-400/60 animate-orbit-slow" />
          <div className="absolute right-32 top-32 h-16 w-16 rounded-full border-2 border-orange-400/40 animate-orbit-reverse" />
          <div className="absolute right-10 top-20 h-40 w-1 rotate-12 rounded-full bg-gradient-to-b from-amber-300/80 to-transparent" />
          <div className="absolute bottom-12 right-24 text-amber-500/30 font-mono text-xl transform -rotate-12 backdrop-blur-sm p-4 border border-amber-500/20 rounded-2xl">UPDATE_REQUIRED.exe</div>
        </>
      );
    case 'identity':
      return (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(234,179,8,0.1),transparent_70%)]" />
          <SurfaceCard className="left-12 top-24 flex h-52 w-64 items-center justify-center border-yellow-400/20 shadow-[0_0_50px_rgba(234,179,8,0.15)] bg-black/40">
            <div className="relative h-28 w-28 rounded-full border-[10px] border-yellow-200/80 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
              <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300/80 animate-glow-pulse" />
              <div className="absolute left-1/2 top-[10px] h-20 w-3 -translate-x-1/2 rounded-full bg-yellow-100/80 animate-planet-pulse" />
            </div>
          </SurfaceCard>
          <div className="absolute right-20 top-20 h-56 w-56 rounded-[35%] border-[2px] border-yellow-300/30 bg-yellow-200/10 shadow-[0_0_100px_rgba(234,179,8,0.25)] animate-orbit-slow" />
          <div className="absolute right-32 top-32 h-44 w-44 rounded-[40%] border-[1px] border-yellow-100/40 animate-orbit-reverse" />
          
          <SurfaceCard className="right-12 bottom-20 w-64 p-5 border-yellow-500/20 bg-black/50">
            <div className="mb-4 flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-yellow-300/20 flex items-center justify-center border border-yellow-400/30">
                <div className="w-6 h-6 rounded-full border-4 border-yellow-100/50" />
              </div>
              <div className="space-y-2.5 flex-1">
                <div className="h-3 w-[70%] rounded-full bg-yellow-200/40" />
                <div className="h-2 w-[40%] rounded-full bg-yellow-100/50" />
              </div>
            </div>
            <div className="h-3 w-full rounded-full bg-yellow-200/20 overflow-hidden text-right">
              <div className="h-full w-[85%] bg-yellow-400/60" />
            </div>
          </SurfaceCard>
        </>
      );
    case 'deepfake':
      return (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(217,70,239,0.15),transparent_60%)]" />
          
          <div className="absolute left-16 top-12 h-[22rem] w-60 rounded-[45%_55%_48%_52%/35%_32%_68%_65%] border-2 border-fuchsia-400/30 bg-white/5 animate-planet-pulse backdrop-blur-md shadow-[0_0_60px_rgba(217,70,239,0.2)]" />
          <div className="absolute left-20 top-16 h-[20rem] w-52 rounded-[55%_45%_52%_48%/32%_35%_65%_68%] border border-cyan-300/60 animate-orbit-slow bg-gradient-to-tr from-cyan-400/10 to-transparent" />
          
          {/* AI Neural nodes */}
          <div className="absolute left-32 top-40 w-full h-full pointer-events-none">
            <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-cyan-400/80 shadow-[0_0_20px_#22d3ee] animate-float-node" />
            <div className="absolute left-24 top-[-20px] h-6 w-6 rounded-full bg-fuchsia-400/80 shadow-[0_0_20px_#e879f9] animate-float-node" style={{ animationDelay: '0.5s' }} />
            <div className="absolute left-[80px] top-[100px] h-5 w-5 rounded-full bg-purple-400/80 shadow-[0_0_20px_#c084fc] animate-float-node" style={{ animationDelay: '1s' }} />
            <div className="absolute left-[-20px] top-[60px] h-7 w-7 rounded-full bg-indigo-400/80 shadow-[0_0_20px_#818cf8] animate-float-node" style={{ animationDelay: '1.5s' }} />
            
            {/* Connecting lines */}
            <svg className="absolute top-[-50px] left-[-50px] w-[300px] h-[300px] overflow-visible opacity-50">
              <path d="M 50 50 Q 80 40 124 30" stroke="#bef264" strokeWidth="2" fill="none" className="animate-pulse" />
              <path d="M 50 50 Q 70 100 130 150" stroke="#67e8f9" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
              <path d="M 50 50 Q 20 80 30 110" stroke="#f0abfc" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
              <path d="M 124 30 Q 140 80 130 150" stroke="#c084fc" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '0.9s' }} />
            </svg>
          </div>
          
          <SurfaceCard className="right-10 bottom-16 w-64 p-6 border-fuchsia-500/30 bg-black/60 shadow-[0_0_50px_rgba(217,70,239,0.15)]">
            <div className="text-fuchsia-200/80 text-[11px] font-black tracking-widest mb-4">GENERATIVE MODEL</div>
            <div className="space-y-3">
              <div className="h-3 w-40 rounded-full bg-gradient-to-r from-fuchsia-400/50 to-cyan-400/50" />
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-cyan-400/80 w-[60%] animate-pulse" />
              </div>
              <div className="h-2 w-[80%] rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-fuchsia-400/80 w-[85%] animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
          </SurfaceCard>
        </>
      );
    case 'cloud':
      return (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(56,189,248,0.15),transparent_60%)]" />
          <SurfaceCard className="left-10 top-20 w-[20rem] p-6 border-sky-400/30 bg-black/50 backdrop-blur-xl">
            <div className="text-sky-200/80 text-[11px] font-black tracking-widest mb-4 uppercase">Data Instances</div>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-16 rounded-xl border border-sky-300/30 bg-gradient-to-t from-sky-400/20 to-transparent flex items-end justify-center pb-2 animate-planet-pulse" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-2 h-2 rounded-full bg-sky-300 shadow-[0_0_10px_#7dd3fc]" />
                </div>
              ))}
            </div>
          </SurfaceCard>
          
          {/* Glowing cloud ring */}
          <div className="absolute right-12 top-24 h-64 w-[28rem] rounded-[999px] border-2 border-sky-300/30 bg-gradient-to-b from-sky-400/10 to-transparent shadow-[0_0_100px_rgba(56,189,248,0.25)] animate-float-node" />
          <div className="absolute right-32 top-14 h-40 w-48 rounded-full border border-sky-100/40 bg-white/5 animate-planet-pulse" />
          
          <GlowNode className="right-40 top-48" color="bg-white text-white shadow-[0_0_50px_#fff]" />
          <GlowNode className="right-64 top-32" color="bg-cyan-300 text-cyan-300 shadow-[0_0_60px_#67e8f9]" />
          <GlowNode className="right-24 top-[9rem]" color="bg-sky-400 text-sky-400 shadow-[0_0_60px_#38bdf8]" />
          
          <div className="absolute right-[30%] top-40 h-[2px] w-48 rotate-[14deg] rounded-full bg-sky-100/60 shadow-[0_0_15px_#e0f2fe]" />
        </>
      );
    case 'vulnerabilities':
      return (
        <>
          <div className="absolute left-16 top-20 h-56 w-56 rounded-full border-[2px] border-dashed border-orange-400/40 animate-orbit-slow" />
          <div className="absolute left-20 top-24 h-48 w-48 rounded-full border-t-[4px] border-amber-500/60 shadow-[0_0_80px_rgba(245,158,11,0.2)] animate-orbit-reverse" />
          
          {/* Target marker */}
          <div className="absolute left-[10.5rem] top-[10.5rem] h-2 w-28 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent to-amber-200/80 animate-scan-line" />
          <div className="absolute left-[10rem] top-[10rem] h-6 w-6 rounded-full bg-red-500 shadow-[0_0_30px_#ef4444] animate-glow-pulse" />
          
          <SurfaceCard className="right-12 top-20 w-[22rem] p-6 border-orange-500/30 bg-[#2a0e08]/80 text-orange-50">
            <div className="text-red-400 font-bold tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> EXPLOIT DETECTED
            </div>
            <div className="mb-4 h-2 w-[80%] rounded-full bg-orange-300/30" />
            <div className="grid grid-cols-3 gap-3">
              {['CVE-2025', 'KEV=TRUE', 'CVSS: 9.8'].map((label, i) => (
                <div key={label} className={`rounded-xl border border-red-500/${i===2?'60':'30'} bg-red-950/40 px-3 py-4 text-center font-mono text-sm text-amber-100 font-bold shadow-inner`}>{label}</div>
              ))}
            </div>
          </SurfaceCard>
          
          <div className="absolute bottom-16 right-16 flex gap-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={`h-20 w-16 rounded-xl border border-orange-500/${index===1?'80':'20'} bg-gradient-to-t from-orange-400/10 to-transparent relative overflow-hidden`}>
                {index === 1 && <div className="absolute bottom-0 w-full h-1/2 bg-red-500/40 border-t border-red-400 animate-pulse" />}
              </div>
            ))}
          </div>
        </>
      );
    case 'insider':
      return (
        <>
          <div className="absolute inset-0 bg-[#0f1118] opacity-90" />
          {/* Search lights */}
          <div className="absolute right-[-10%] top-[-20%] w-[40%] h-[150%] bg-[conic-gradient(from_180deg_at_50%_0%,transparent_0deg,transparent_160deg,rgba(225,29,72,0.15)_170deg,rgba(225,29,72,0.15)_190deg,transparent_200deg)] animate-planet-pulse pointer-events-none transform origin-top rotate-12" />
          
          <SurfaceCard className="left-12 top-20 h-72 w-52 p-6 border-rose-500/20 bg-black/60 shadow-[0_0_50px_rgba(225,29,72,0.15)] flex flex-col">
            <div className="text-rose-300/80 text-[10px] tracking-[0.3em] font-black mb-4 uppercase">Access Logs</div>
            <div className="flex-1 space-y-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black pointer-events-none z-10" />
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`h-3 rounded-full flex gap-2 ${i === 1 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-1/4 h-full rounded-full ${i===1?'bg-rose-500':'bg-slate-600'}`} />
                  <div className="w-3/4 h-full rounded-full bg-slate-700" />
                </div>
              ))}
            </div>
          </SurfaceCard>
          
          <GlowNode className="right-[35%] top-40 animate-glow-pulse" color="bg-rose-500 text-rose-500 shadow-[0_0_60px_#f43f5e]" />
          <GlowNode className="right-[20%] top-64 delay-200" color="bg-slate-400 text-slate-400" />
          
          {/* Red line crossing the organization */}
          <div className="absolute right-[10%] top-40 w-1/2 h-1 border-b-2 border-dashed border-rose-500/60 transform -rotate-12 animate-scan-line shadow-[0_0_20px_#e11d48]" />
          <div className="absolute right-[25%] top-[15rem] text-rose-500 font-mono text-sm tracking-widest bg-black/50 px-2 py-1 border border-rose-500/30">UNAUTHORIZED_TRANSFER</div>
        </>
      );
    case 'ransomware':
      return (
        <>
          <div className="absolute inset-x-[-10%] bottom-[-10%] h-[50%] bg-[linear-gradient(transparent,rgba(239,68,68,0.2)_50%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
          
          {/* Big lock icon / encryption symbol */}
          <SurfaceCard className="left-16 top-24 flex h-60 w-64 items-center justify-center border-red-500/40 bg-red-950/40 shadow-[0_0_80px_rgba(239,68,68,0.25)] backdrop-blur-md">
            <div className="relative flex flex-col items-center">
              <div className="h-20 w-24 rounded-t-[2.5rem] border-[12px] border-b-0 border-red-500/80 mb-[-10px] z-0" />
              <div className="h-28 w-36 rounded-2xl bg-gradient-to-b from-red-600 to-red-900 border border-red-400/50 shadow-2xl z-10 flex items-center justify-center flex-col">
                <div className="h-6 w-6 rounded-full bg-white/90 shadow-[0_0_20px_#fff]" />
                <div className="h-10 w-2 bg-white/90 rounded-b-md mt-[-4px]" />
              </div>
            </div>
          </SurfaceCard>
          
          {/* Encrypted files cascade */}
          <div className="absolute right-12 top-0 h-full w-96 font-mono text-[10px] text-red-500/40 leading-[12px] overflow-hidden rotate-0 pointer-events-none opacity-60">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className={`whitespace-nowrap ${i%3===0?'text-rose-300':'text-red-700'} animate-slide-up`} style={{ animationDuration: `${5 + Math.random()*5}s` }}>
                {Array.from({ length: 15 }).map(() => Math.random().toString(36).substring(2, 8)).join(' ')}.locked
              </div>
            ))}
          </div>
          
          <div className="absolute right-24 bottom-20 flex gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 w-20 rounded-xl border-2 border-red-600/40 bg-red-900/40 relative overflow-hidden shadow-lg animate-planet-pulse">
                <div className="absolute top-1/2 left-0 right-0 h-10 -translate-y-1/2 bg-red-600 flex items-center justify-center border-y border-red-400/50 shadow-[0_0_20px_#ef4444]">
                  <div className="text-white text-xs font-black font-mono tracking-widest">LOCKED</div>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    case 'mobile':
      return (
        <>
          <div className="absolute inset-0 bg-[#090b14] opacity-80" />
          
          {/* Phone device frame */}
          <SurfaceCard className="left-16 top-12 h-[26rem] w-[13rem] rounded-[3rem] border-[6px] border-slate-700 bg-black/80 shadow-[0_0_100px_rgba(99,102,241,0.25)] flex flex-col p-1.5 z-10">
            <div className="flex-1 rounded-[2.5rem] bg-gradient-to-b from-slate-900 to-indigo-950 overflow-hidden relative">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-b-[1rem]" />
              <div className="mt-12 mx-auto h-16 w-16 rounded-3xl bg-indigo-500/30 border border-indigo-400/50 animate-glow-pulse flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-t-transparent border-indigo-200 animate-spin" />
              </div>
              <div className="mt-8 px-4 space-y-3">
                <div className="h-4 w-full rounded-md bg-indigo-900/50" />
                <div className="h-10 w-full rounded-xl bg-indigo-500/20 border border-indigo-400/30" />
                <div className="h-10 w-full rounded-xl bg-indigo-500/20 border border-indigo-400/30" />
              </div>
            </div>
          </SurfaceCard>
          
          {/* Signal waves / Connectivity */}
          <div className="absolute left-[13rem] top-[8rem] w-64 h-64 border-[3px] border-l-0 border-indigo-400/30 rounded-full animate-planet-pulse" />
          <div className="absolute left-[14rem] top-[6rem] w-[18rem] h-[18rem] border-[1px] border-l-0 border-cyan-400/20 rounded-full animate-planet-pulse" style={{ animationDelay: '1s' }} />
          
          <GlowNode className="right-[30%] top-[35%] animate-glow-pulse" color="bg-cyan-400 text-cyan-400 shadow-[0_0_40px_#22d3ee]" />
          <GlowNode className="right-[15%] top-[20%]" color="bg-indigo-300 text-indigo-300" />
          <GlowNode className="right-[10%] top-[50%]" color="bg-purple-400 text-purple-400" />
          
          <div className="absolute bottom-16 right-16 flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 w-16 rounded-[1.5rem] border border-white/20 bg-white/5 backdrop-blur-md shadow-lg font-mono text-[10px] text-center pt-8 text-indigo-200">
                APP_{i+1}
              </div>
            ))}
          </div>
        </>
      );
    case 'mobile-incidents':
      return (
        <>
          <SurfaceCard className="left-16 top-10 h-[24rem] w-[12rem] rounded-[3rem] border-2 border-violet-500/40 bg-black/80 shadow-[0_0_80px_rgba(139,92,246,0.3)] p-1.5">
            <div className="flex-1 h-full rounded-[2.5rem] bg-slate-950 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:100%_4px]" />
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_#22d3ee] animate-scan-line" />
            </div>
          </SurfaceCard>
          
          <div className="absolute left-[6rem] top-[4rem] h-96 w-96 rounded-full border border-cyan-400/20 animate-orbit-slow" />
          <div className="absolute left-[8rem] top-[6rem] h-72 w-72 rounded-full border border-violet-400/30 animate-planet-pulse" />
          
          <div className="absolute left-[13rem] top-[12rem] h-12 w-12 rounded-full bg-cyan-400 shadow-[0_0_80px_#22d3ee] animate-glow-pulse flex items-center justify-center">
            <div className="h-6 w-6 rounded-full bg-white/80" />
          </div>
          
          <SurfaceCard className="right-12 top-[6rem] w-72 p-6 border-violet-500/30 bg-[#1e1533]/80">
            <div className="text-cyan-300 text-xs font-black tracking-[0.2em] mb-4 flex items-center gap-2">ZERO-CLICK DETECTED</div>
            <div className="mb-3 h-2 w-[90%] rounded-full bg-violet-400/40" />
            <div className="mb-3 h-2 w-[60%] rounded-full bg-cyan-400/50" />
            <div className="h-2 w-[40%] rounded-full bg-violet-300/30" />
            <div className="mt-6 border-t border-violet-500/30 pt-4 font-mono text-xs text-violet-200">
              Payload execution...
              <div className="text-cyan-400 mt-1">SUCCESS</div>
            </div>
          </SurfaceCard>
        </>
      );
    case 'supply':
      return (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(20,184,166,0.1),transparent_70%)]" />
          
          {/* Third party network graph */}
          <div className="absolute left-10 top-[5rem] grid grid-cols-4 gap-4 z-10 w-[24rem]">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className={`h-20 w-full rounded-2xl border bg-black/60 shadow-lg flex items-center justify-center ${index===3 ? 'border-red-500/60 shadow-[0_0_20px_#ef4444] animate-pulse' : 'border-teal-400/20 shadow-[0_0_20px_rgba(20,184,166,0.15)]'}`}>
                <div className={`${index===3 ? 'text-red-400' : 'text-teal-400/50'} font-mono text-xs`}>VENDOR_{index}</div>
              </div>
            ))}
          </div>
          
          <GlowNode className="right-56 top-40 animate-glow-pulse" color="bg-teal-400 text-teal-400 shadow-[0_0_60px_#2dd4bf]" />
          <GlowNode className="right-24 top-24" color="bg-cyan-300 text-cyan-300" />
          <GlowNode className="right-12 top-[60%]" color="bg-emerald-400 text-emerald-400" />
          
          {/* Corrupted link */}
          <svg className="absolute top-0 right-0 w-full h-full opacity-60 z-0 pointer-events-none">
            <path d="M 400 300 Q 600 200 800 150" stroke="#2dd4bf" strokeWidth="3" strokeDasharray="10 5" fill="none" className="animate-scan-line" />
            <path d="M 120 150 Q 300 100 800 150" stroke="#ef4444" strokeWidth="4" strokeDasharray="5 5" fill="none" className="animate-pulse" />
          </svg>
          
          <div className="absolute right-16 bottom-20 h-32 w-80 rounded-[2rem] border-2 border-teal-500/30 bg-gradient-to-r from-teal-900/60 to-cyan-900/60 backdrop-blur-xl flex px-6 items-center shadow-[0_0_40px_rgba(20,184,166,0.15)]">
            <div className="w-16 h-16 rounded-full border-4 border-dashed border-teal-400/60 animate-spin-slow flex-shrink-0" />
            <div className="ml-6 flex-1 text-teal-100 font-bold uppercase tracking-widest text-sm text-right">Core Systems</div>
          </div>
        </>
      );
    case 'social':
      return (
        <>
          <div className="absolute inset-0 bg-[#0f070b] opacity-80" />
          {/* Abstract human shapes / trust indicators */}
          <SurfaceCard className="left-12 top-20 w-[22rem] p-6 border-rose-500/30 bg-black/50 shadow-[0_0_60px_rgba(244,63,94,0.15)]">
            <div className="flex gap-4 items-center border-b border-rose-500/20 pb-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-rose-400/20 border-2 border-rose-400/50 flex items-center justify-center">
                <div className="w-6 h-6 bg-rose-300 rounded-full" />
              </div>
              <div>
                <div className="text-base font-bold text-rose-100">CEO / Authority Figure</div>
                <div className="text-xs text-rose-300/60 font-mono mt-1">Status: URGENT</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full rounded-full bg-rose-200/20" />
              <div className="h-2 w-[80%] rounded-full bg-rose-200/20" />
              <div className="h-6 w-32 mt-4 rounded-lg bg-rose-500/40 border border-rose-400 text-[10px] text-white flex items-center justify-center font-bold tracking-widest animate-pulse">CLICK HERE</div>
            </div>
          </SurfaceCard>
          
          <div className="absolute left-[40%] top-[40%] h-32 w-32 rounded-full border border-pink-500/40 animate-planet-pulse shadow-[0_0_80px_rgba(236,72,153,0.2)]" />
          <div className="absolute right-20 top-20 h-64 w-64 rounded-full border-r-2 border-orange-400/30 animate-orbit-slow" />
          
          <div className="absolute right-12 bottom-20 h-28 w-64 rounded-[2rem] border border-rose-400/20 bg-gradient-to-l from-rose-900/40 to-transparent p-6 text-right">
            <div className="text-rose-300 text-xs font-black tracking-[0.2em] mb-2 uppercase">Manipulation Vector</div>
            <div className="text-rose-100/70 text-sm">Targeting trust, urgency, and fear to bypass logical verification.</div>
          </div>
        </>
      );
    case 'neutral':
      return (
        <>
          <SurfaceCard className="left-16 top-24 w-64 p-6 border-slate-300 bg-white/60 shadow-xl backdrop-blur-xl">
            <div className="mb-5 h-3 w-32 rounded-full bg-blue-600/20" />
            <div className="mb-4 h-5 w-48 rounded-full bg-blue-600/80 shadow-[0_0_15px_rgba(37,99,235,0.3)]" />
            <div className="mb-4 h-3 w-56 rounded-full bg-slate-400/20" />
            <div className="h-3 w-32 rounded-full bg-blue-500/10" />
          </SurfaceCard>
          
          <div className="absolute right-20 top-20 h-48 w-36 rounded-[2rem] border border-blue-200 bg-gradient-to-b from-white to-blue-50/50 shadow-2xl animate-float-node" />
          <div className="absolute right-[20rem] top-32 h-32 w-32 rounded-full border border-blue-300/50 bg-blue-100/30 shadow-[0_0_40px_rgba(59,130,246,0.15)] animate-planet-pulse" />
          
          <div className="absolute bottom-16 right-16 h-28 w-72 rounded-[2rem] border border-slate-200 bg-gradient-to-r from-white to-slate-50 shadow-lg p-6 flex flex-col justify-center">
            <div className="h-2 w-24 bg-blue-300 rounded-full mb-3" />
            <div className="h-2 w-48 bg-slate-200 rounded-full" />
          </div>
        </>
      );
  }
};
const WorldScene: React.FC<WorldSceneProps> = ({ variant, mode = 'panel', className = '' }) => (
  <div
    aria-hidden="true"
    className={`absolute inset-0 overflow-hidden rounded-[inherit] bg-gradient-to-br ${wrapperByVariant[variant]} ${frameByMode[mode]} ${className}`}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_28%)]" />
    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_45%)]" />
    {renderScene(variant)}
  </div>
);

export default WorldScene;
