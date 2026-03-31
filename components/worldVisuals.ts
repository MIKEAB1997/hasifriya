import { WorldSceneVariant } from './WorldScene';

const WORLD_VISUALS: Record<WorldSceneVariant | 'global', string> = {
  global: '/worlds/global-world.svg',
  neutral: '/worlds/global-world.svg',
  cyber: '/worlds/cyber-world.svg',
  phishing: '/worlds/phishing-world.svg',
  identity: '/worlds/identity-world.svg',
  deepfake: '/worlds/deepfake-world.svg',
  cloud: '/worlds/cloud-world.svg',
  vulnerabilities: '/worlds/ransomware-world.svg',
  insider: '/worlds/insider-world.svg',
  ransomware: '/worlds/ransomware-world.svg',
  social: '/worlds/social-world.svg',
  mobile: '/worlds/mobile-world.svg',
  'mobile-incidents': '/worlds/mobile-world.svg',
  supply: '/worlds/cloud-world.svg',
};

export const getWorldVisual = (variant: WorldSceneVariant | 'global') => WORLD_VISUALS[variant];
