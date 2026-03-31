import { WorldSceneVariant } from './WorldScene';

const WORLD_VISUALS: Record<WorldSceneVariant | 'global', string> = {
  global: '/worlds/global-bg.png',
  neutral: '/worlds/global-bg.png',
  cyber: '/worlds/cyber-bg.png',
  phishing: '/worlds/phishing-bg.png',
  identity: '/worlds/identity-bg.png',
  deepfake: '/worlds/deepfake-bg.png',
  cloud: '/worlds/cloud-bg.png',
  vulnerabilities: '/worlds/vulnerabilities-bg.png',
  insider: '/worlds/espionage-bg.png',
  ransomware: '/worlds/ransomware-bg.png',
  social: '/worlds/social-bg.png',
  mobile: '/worlds/mobile-bg.png',
  'mobile-incidents': '/worlds/mobile_incidents-bg.png',
  supply: '/worlds/supply-bg.png',
};

export const getWorldVisual = (variant: WorldSceneVariant | 'global') => WORLD_VISUALS[variant];
