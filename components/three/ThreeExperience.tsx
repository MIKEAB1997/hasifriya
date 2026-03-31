import React, { Suspense, lazy } from 'react';
import { WorldSceneVariant } from '../WorldScene';
import ExperienceFallback from './ExperienceFallback';
import { ExperiencePreset } from './experienceConfig';
import { useExperienceCapabilities } from './useExperienceCapabilities';

const LazyImmersiveScene = lazy(() => import('./ImmersiveScene'));

interface ThreeExperienceProps {
  variant: WorldSceneVariant;
  preset: ExperiencePreset;
  className?: string;
}

const ThreeExperience: React.FC<ThreeExperienceProps> = ({
  variant,
  preset,
  className = '',
}) => {
  const { webglSupported, reducedMotion, compact } = useExperienceCapabilities();

  if (webglSupported === false) {
    return <ExperienceFallback variant={variant} preset={preset} className={className} />;
  }

  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden="true">
      <Suspense fallback={<ExperienceFallback variant={variant} preset={preset} />}>
        {webglSupported ? (
          <LazyImmersiveScene
            variant={variant}
            preset={preset}
            reducedMotion={reducedMotion}
            compact={compact}
          />
        ) : (
          <ExperienceFallback variant={variant} preset={preset} />
        )}
      </Suspense>
    </div>
  );
};

export default ThreeExperience;
