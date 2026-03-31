import React from 'react';
import { WorldSceneVariant } from '../WorldScene';
import { EXPERIENCE_THEMES, ExperiencePreset } from './experienceConfig';

interface ExperienceFallbackProps {
  variant: WorldSceneVariant;
  preset: ExperiencePreset;
  className?: string;
}

const ExperienceFallback: React.FC<ExperienceFallbackProps> = ({
  variant,
  preset,
  className = '',
}) => {
  const theme = EXPERIENCE_THEMES[variant];
  const compact = preset === 'arena';

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 42%, ${theme.base}18, transparent 30%), radial-gradient(circle at 50% 50%, ${theme.secondary}16, transparent 44%), linear-gradient(180deg, rgba(2,6,23,0.18), rgba(2,6,23,0.74))`,
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[66%] w-[66%] -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-70"
        style={{ borderColor: `${theme.rim}55`, boxShadow: `0 0 90px ${theme.base}22` }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[52%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed opacity-55"
        style={{ borderColor: `${theme.secondary}55` }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[36%] w-[36%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${theme.base}44 0%, transparent 70%)` }}
      />

      {Array.from({ length: compact ? 8 : 14 }).map((_, index) => (
        <span
          key={index}
          className="absolute rounded-full animate-float-node"
          style={{
            top: `${18 + (index * 9) % 58}%`,
            left: `${8 + (index * 13) % 80}%`,
            width: `${index % 3 === 0 ? 10 : 6}px`,
            height: `${index % 3 === 0 ? 10 : 6}px`,
            background: index % 2 === 0 ? theme.particleA : theme.particleB,
            boxShadow: `0 0 28px ${index % 2 === 0 ? theme.particleA : theme.particleB}`,
            animationDelay: `${index * 0.22}s`,
          }}
        />
      ))}

      <div
        className={`absolute rounded-[2rem] border backdrop-blur-xl ${compact ? 'bottom-5 left-5 right-5 h-20' : 'bottom-8 left-8 w-64 h-24'}`}
        style={{ borderColor: `${theme.rim}30`, background: `${theme.panel}33` }}
      />
      {!compact && (
        <div
          className="absolute right-8 top-8 h-28 w-40 rounded-[1.75rem] border backdrop-blur-xl"
          style={{ borderColor: `${theme.rim}28`, background: `${theme.panel}26` }}
        />
      )}
    </div>
  );
};

export default ExperienceFallback;
