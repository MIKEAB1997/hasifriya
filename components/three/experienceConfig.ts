import { WorldSceneVariant } from '../WorldScene';

export type ExperiencePreset = 'hero' | 'selector' | 'arena';

export interface ExperienceTheme {
  base: string;
  glow: string;
  secondary: string;
  rim: string;
  particleA: string;
  particleB: string;
  panel: string;
}

export const EXPERIENCE_THEMES: Record<WorldSceneVariant, ExperienceTheme> = {
  neutral: {
    base: '#60a5fa',
    glow: '#2563eb',
    secondary: '#c4b5fd',
    rim: '#e0f2fe',
    particleA: '#93c5fd',
    particleB: '#e9d5ff',
    panel: '#eff6ff',
  },
  cyber: {
    base: '#34d399',
    glow: '#14532d',
    secondary: '#a3e635',
    rim: '#d1fae5',
    particleA: '#6ee7b7',
    particleB: '#bef264',
    panel: '#052e16',
  },
  phishing: {
    base: '#fbbf24',
    glow: '#7c2d12',
    secondary: '#fb923c',
    rim: '#fef3c7',
    particleA: '#fde68a',
    particleB: '#fdba74',
    panel: '#451a03',
  },
  identity: {
    base: '#fde047',
    glow: '#854d0e',
    secondary: '#facc15',
    rim: '#fef9c3',
    particleA: '#fde68a',
    particleB: '#fef08a',
    panel: '#422006',
  },
  deepfake: {
    base: '#e879f9',
    glow: '#701a75',
    secondary: '#22d3ee',
    rim: '#f5d0fe',
    particleA: '#f0abfc',
    particleB: '#67e8f9',
    panel: '#3b0764',
  },
  cloud: {
    base: '#38bdf8',
    glow: '#0f172a',
    secondary: '#60a5fa',
    rim: '#e0f2fe',
    particleA: '#7dd3fc',
    particleB: '#93c5fd',
    panel: '#082f49',
  },
  vulnerabilities: {
    base: '#f59e0b',
    glow: '#78350f',
    secondary: '#fb923c',
    rim: '#ffedd5',
    particleA: '#fdba74',
    particleB: '#fde68a',
    panel: '#431407',
  },
  insider: {
    base: '#fb7185',
    glow: '#4c0519',
    secondary: '#f472b6',
    rim: '#ffe4e6',
    particleA: '#fda4af',
    particleB: '#f9a8d4',
    panel: '#4c0519',
  },
  ransomware: {
    base: '#f87171',
    glow: '#450a0a',
    secondary: '#fb923c',
    rim: '#fee2e2',
    particleA: '#fca5a5',
    particleB: '#fdba74',
    panel: '#450a0a',
  },
  social: {
    base: '#fb923c',
    glow: '#7c2d12',
    secondary: '#f472b6',
    rim: '#ffedd5',
    particleA: '#fdba74',
    particleB: '#f9a8d4',
    panel: '#431407',
  },
  mobile: {
    base: '#22d3ee',
    glow: '#083344',
    secondary: '#818cf8',
    rim: '#cffafe',
    particleA: '#67e8f9',
    particleB: '#a5b4fc',
    panel: '#082f49',
  },
  'mobile-incidents': {
    base: '#a78bfa',
    glow: '#312e81',
    secondary: '#22d3ee',
    rim: '#ede9fe',
    particleA: '#c4b5fd',
    particleB: '#67e8f9',
    panel: '#312e81',
  },
  supply: {
    base: '#2dd4bf',
    glow: '#134e4a',
    secondary: '#22d3ee',
    rim: '#ccfbf1',
    particleA: '#5eead4',
    particleB: '#67e8f9',
    panel: '#134e4a',
  },
};

export const PRESET_SCALE: Record<ExperiencePreset, number> = {
  hero: 1,
  selector: 0.92,
  arena: 0.84,
};
