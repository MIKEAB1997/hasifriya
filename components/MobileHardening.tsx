
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Smartphone, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { MOBILE_STEPS, MobileStep } from '../portalData';

type Platform = 'all' | 'ios' | 'android';

const PRIORITY_CONFIG = {
  critical: {
    label: 'קריטי',
    className: 'bg-red-100 text-red-700 border border-red-200',
    dot: 'bg-red-500',
    Icon: AlertTriangle,
  },
  high: {
    label: 'גבוה',
    className: 'bg-amber-100 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500',
    Icon: AlertCircle,
  },
  medium: {
    label: 'בינוני',
    className: 'bg-blue-100 text-blue-700 border border-blue-200',
    dot: 'bg-blue-500',
    Icon: Info,
  },
};

interface StepCardProps {
  step: MobileStep;
  index: number;
  activePlatform: Platform;
}

const StepCard: React.FC<StepCardProps> = ({ step, index, activePlatform }) => {
  const [open, setOpen] = useState(false);
  const p = PRIORITY_CONFIG[step.priority];
  const { Icon } = p;

  const showIosPath = activePlatform !== 'android' && step.iosPath;
  const showAndroidPath = activePlatform !== 'ios' && step.androidPath;

  return (
    <div className="bg-surface border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-right"
      >
        {/* Step number */}
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-black text-sm">
          {index + 1}
        </div>

        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-gray-900 text-base text-right">{step.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${p.className}`}>
              <Icon className="w-3 h-3" />
              {p.label}
            </span>
            {step.platforms.includes('ios') && step.platforms.includes('android') || step.platforms[0] === 'both' ? (
              <span className="text-xs text-gray-400 font-medium">iOS + Android</span>
            ) : step.platforms.includes('ios') ? (
              <span className="text-xs text-gray-400 font-medium">iOS</span>
            ) : (
              <span className="text-xs text-gray-400 font-medium">Android</span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 text-gray-400">
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 animate-fade-in">
          <p className="text-gray-600 text-sm leading-relaxed mt-4 mb-4">
            {step.description}
          </p>
          {(showIosPath || showAndroidPath) && (
            <div className="space-y-2">
              {showIosPath && (
                <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-slate-500 text-xs font-bold flex-shrink-0 mt-0.5">iOS:</span>
                  <span className="text-slate-700 text-xs font-medium">{step.iosPath}</span>
                </div>
              )}
              {showAndroidPath && (
                <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
                  <span className="text-green-600 text-xs font-bold flex-shrink-0 mt-0.5">Android:</span>
                  <span className="text-green-800 text-xs font-medium">{step.androidPath}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface MobileHardeningProps {
  modal?: boolean;
}

const MobileHardening: React.FC<MobileHardeningProps> = ({ modal }) => {
  const [platform, setPlatform] = useState<Platform>('all');

  const filteredSteps = MOBILE_STEPS.filter(step => {
    if (platform === 'all') return true;
    return step.platforms.includes(platform) || step.platforms.includes('both');
  });

  const content = (
    <div className={modal ? 'p-6 sm:p-8' : 'max-w-7xl mx-auto px-4 sm:px-6'}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${modal ? 'mb-6' : 'mb-10'}`}>
        {!modal && (
          <div>
            <span className="inline-block text-primary text-xs font-black uppercase tracking-widest mb-2 bg-primary/8 px-3 py-1 rounded-full border border-primary/15">
              מדריך מעשי
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-1">
              הגבהת חומות בטלפון נייד
            </h2>
            <p className="text-gray-500 mt-2 text-lg font-medium">
              10 צעדים לאבטחת המכשיר שלך – iOS ואנדרואיד
            </p>
          </div>
        )}
        {/* Platform Filter */}
        <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-sm">
          {(['all', 'ios', 'android'] as Platform[]).map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                platform === p
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              {p === 'all' ? 'הכל' : p === 'ios' ? 'iOS' : 'Android'}
            </button>
          ))}
        </div>
      </div>

      {/* Priority legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {Object.entries(PRIORITY_CONFIG).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
            <div className={`w-2 h-2 rounded-full ${val.dot}`} />
            {val.label}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {filteredSteps.map((step, idx) => (
          <StepCard key={step.id} step={step} index={idx} activePlatform={platform} />
        ))}
      </div>
    </div>
  );

  if (modal) return content;

  return (
    <section id="hardening" className="scroll-mt-20 py-14 sm:py-20 bg-surface-light">
      {content}
    </section>
  );
};

export default MobileHardening;
