import { useEffect, useState } from 'react';

interface ExperienceCapabilities {
  webglSupported: boolean | null;
  reducedMotion: boolean;
  compact: boolean;
}

const safeMatchMedia = (query: string) =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query)
    : null;

const detectWebgl = () => {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
};

export const useExperienceCapabilities = (): ExperienceCapabilities => {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    setWebglSupported(detectWebgl());

    const motionQuery = safeMatchMedia('(prefers-reduced-motion: reduce)');
    const compactQuery = safeMatchMedia('(max-width: 900px)');

    const updateMotion = () => setReducedMotion(Boolean(motionQuery?.matches));
    const updateCompact = () => setCompact(Boolean(compactQuery?.matches));

    updateMotion();
    updateCompact();

    motionQuery?.addEventListener?.('change', updateMotion);
    compactQuery?.addEventListener?.('change', updateCompact);

    return () => {
      motionQuery?.removeEventListener?.('change', updateMotion);
      compactQuery?.removeEventListener?.('change', updateCompact);
    };
  }, []);

  return { webglSupported, reducedMotion, compact };
};
