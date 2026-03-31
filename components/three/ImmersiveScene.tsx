import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { WorldSceneVariant } from '../WorldScene';
import { EXPERIENCE_THEMES, ExperiencePreset, PRESET_SCALE } from './experienceConfig';

interface ImmersiveSceneProps {
  variant: WorldSceneVariant;
  preset: ExperiencePreset;
  reducedMotion: boolean;
  compact: boolean;
}

const CameraRig: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  useFrame(({ camera, pointer }) => {
    if (reducedMotion) {
      camera.lookAt(0, 0, 0);
      return;
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.55, 0.035);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.18 + pointer.y * 0.25, 0.035);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const ParticleField: React.FC<{
  theme: ReturnType<typeof getTheme>;
  count: number;
  reducedMotion: boolean;
}> = ({ theme, count, reducedMotion }) => {
  const points = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const color = new Float32Array(count * 3);
    const colorA = new THREE.Color(theme.particleA);
    const colorB = new THREE.Color(theme.particleB);

    for (let index = 0; index < count; index += 1) {
      const stride = index * 3;
      const radius = 3.4 + Math.random() * 4.6;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 4.4;
      const tint = index % 2 === 0 ? colorA : colorB;

      pos[stride] = Math.cos(angle) * radius;
      pos[stride + 1] = height;
      pos[stride + 2] = Math.sin(angle) * radius;

      color[stride] = tint.r;
      color[stride + 1] = tint.g;
      color[stride + 2] = tint.b;
    }

    return [pos, color];
  }, [count, theme.particleA, theme.particleB]);

  useFrame((_, delta) => {
    if (reducedMotion || !points.current) return;
    points.current.rotation.y += delta * 0.045;
    points.current.rotation.x += delta * 0.01;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} transparent opacity={0.9} vertexColors sizeAttenuation />
    </points>
  );
};

const OrbitalNetwork: React.FC<{
  theme: ReturnType<typeof getTheme>;
  preset: ExperiencePreset;
  reducedMotion: boolean;
}> = ({ theme, preset, reducedMotion }) => {
  const group = useRef<THREE.Group>(null);
  const scale = PRESET_SCALE[preset];

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += reducedMotion ? 0 : delta * 0.18;
    group.current.rotation.z = reducedMotion ? 0.08 : Math.sin(state.clock.elapsedTime * 0.28) * 0.08;
  });

  return (
    <group ref={group} scale={scale}>
      <mesh>
        <sphereGeometry args={[1.6, 40, 40]} />
        <MeshDistortMaterial
          color={theme.base}
          transparent
          opacity={0.16}
          roughness={0.1}
          metalness={0.3}
          distort={reducedMotion ? 0.02 : 0.16}
          speed={reducedMotion ? 0 : 1.2}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.018, 16, 140]} />
        <meshBasicMaterial color={theme.secondary} transparent opacity={0.48} />
      </mesh>
      <mesh rotation={[0.95, 0.5, 0.4]}>
        <torusGeometry args={[2.65, 0.014, 16, 140]} />
        <meshBasicMaterial color={theme.rim} transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[1.62, 18, 18]} />
        <meshBasicMaterial color={theme.rim} wireframe transparent opacity={0.14} />
      </mesh>

      {Array.from({ length: 9 }).map((_, index) => {
        const angle = (index / 9) * Math.PI * 2;
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * 2.2, Math.sin(angle * 2) * 0.35, Math.sin(angle) * 2.2]}
          >
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshBasicMaterial color={index % 2 === 0 ? theme.particleA : theme.particleB} />
          </mesh>
        );
      })}
    </group>
  );
};

const FloatingPanels: React.FC<{
  theme: ReturnType<typeof getTheme>;
  variant: WorldSceneVariant;
  reducedMotion: boolean;
}> = ({ theme, variant, reducedMotion }) => {
  const panelRotation =
    variant === 'phishing'
      ? [0.18, -0.42, 0.12]
      : variant === 'mobile' || variant === 'mobile-incidents'
        ? [0.2, 0.18, 0.08]
        : [0.14, -0.25, 0.06];

  return (
    <>
      <Float speed={reducedMotion ? 0 : 1.1} rotationIntensity={reducedMotion ? 0 : 0.22} floatIntensity={reducedMotion ? 0 : 0.28}>
        <RoundedBox args={[1.8, 1.05, 0.08]} radius={0.16} smoothness={4} position={[-2.65, 1.1, -0.65]} rotation={panelRotation as [number, number, number]}>
          <meshPhysicalMaterial color={theme.panel} transparent opacity={0.2} roughness={0.18} transmission={0.2} />
        </RoundedBox>
      </Float>
      <Float speed={reducedMotion ? 0 : 1.35} rotationIntensity={reducedMotion ? 0 : 0.2} floatIntensity={reducedMotion ? 0 : 0.36}>
        <RoundedBox args={[1.3, 0.78, 0.06]} radius={0.14} smoothness={4} position={[2.45, -1.25, -0.55]} rotation={[0.1, 0.24, -0.08]}>
          <meshPhysicalMaterial color={theme.secondary} transparent opacity={0.14} roughness={0.22} transmission={0.16} />
        </RoundedBox>
      </Float>
    </>
  );
};

const VariantAccent: React.FC<{
  variant: WorldSceneVariant;
  theme: ReturnType<typeof getTheme>;
  reducedMotion: boolean;
}> = ({ variant, theme, reducedMotion }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y += delta * 0.12;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
  });

  if (variant === 'cyber') {
    return (
      <group ref={group}>
        <mesh position={[0, 0.2, 0]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={theme.base} emissive={theme.glow} emissiveIntensity={1.4} wireframe />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0.4, 0]}>
          <torusGeometry args={[3.2, 0.025, 16, 160]} />
          <meshBasicMaterial color={theme.base} transparent opacity={0.24} />
        </mesh>
      </group>
    );
  }

  if (variant === 'phishing') {
    return (
      <group ref={group}>
        <mesh position={[0, 0.1, 0]}>
          <torusKnotGeometry args={[0.72, 0.14, 120, 18, 2, 3]} />
          <meshStandardMaterial color={theme.base} emissive={theme.glow} emissiveIntensity={1.1} />
        </mesh>
        <mesh position={[1.7, 0.85, 0.3]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.22, 0.56, 3]} />
          <meshStandardMaterial color={theme.secondary} emissive={theme.glow} emissiveIntensity={0.8} />
        </mesh>
      </group>
    );
  }

  if (variant === 'cloud' || variant === 'supply') {
    return (
      <group ref={group}>
        <RoundedBox args={[1.25, 0.62, 0.42]} radius={0.18} smoothness={4} position={[0, 0.4, 0.25]}>
          <meshPhysicalMaterial color={theme.base} transparent opacity={0.26} roughness={0.08} transmission={0.28} />
        </RoundedBox>
        <RoundedBox args={[1.9, 0.5, 0.22]} radius={0.2} smoothness={4} position={[0.85, 0.05, -0.35]}>
          <meshPhysicalMaterial color={theme.secondary} transparent opacity={0.18} roughness={0.16} transmission={0.14} />
        </RoundedBox>
      </group>
    );
  }

  if (variant === 'mobile' || variant === 'mobile-incidents') {
    return (
      <group ref={group}>
        <RoundedBox args={[1.08, 2.06, 0.18]} radius={0.18} smoothness={4} position={[0, 0.18, 0.1]}>
          <meshPhysicalMaterial color={theme.base} transparent opacity={0.16} roughness={0.1} transmission={0.22} />
        </RoundedBox>
        <mesh position={[0, 1.02, 0.15]}>
          <sphereGeometry args={[0.07, 18, 18]} />
          <meshBasicMaterial color={theme.rim} />
        </mesh>
      </group>
    );
  }

  if (variant === 'deepfake' || variant === 'social' || variant === 'insider') {
    return (
      <group ref={group}>
        <mesh position={[-0.28, 0.22, 0]}>
          <sphereGeometry args={[0.74, 28, 28]} />
          <meshPhysicalMaterial color={theme.base} transparent opacity={0.16} roughness={0.14} transmission={0.22} />
        </mesh>
        <mesh position={[0.32, -0.08, 0.18]}>
          <sphereGeometry args={[0.62, 24, 24]} />
          <meshPhysicalMaterial color={theme.secondary} transparent opacity={0.13} roughness={0.18} transmission={0.2} />
        </mesh>
      </group>
    );
  }

  if (variant === 'identity' || variant === 'vulnerabilities' || variant === 'ransomware') {
    return (
      <group ref={group}>
        <mesh position={[0, 0.1, 0]}>
          <octahedronGeometry args={[0.95, 0]} />
          <meshStandardMaterial color={theme.base} emissive={theme.glow} emissiveIntensity={0.95} wireframe />
        </mesh>
        <mesh rotation={[0.6, 0.6, 0]}>
          <torusGeometry args={[2.75, 0.03, 16, 120]} />
          <meshBasicMaterial color={theme.secondary} transparent opacity={0.22} />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={group}>
      <mesh position={[0, 0.1, 0]}>
        <icosahedronGeometry args={[0.86, 0]} />
        <meshStandardMaterial color={theme.base} emissive={theme.glow} emissiveIntensity={0.8} transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

const MotionLines: React.FC<{
  theme: ReturnType<typeof getTheme>;
  reducedMotion: boolean;
}> = ({ theme, reducedMotion }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = reducedMotion ? 0.35 : state.clock.elapsedTime * 0.08;
  });

  const curves = useMemo(() => {
    const items: THREE.Vector3[][] = [];

    for (let index = 0; index < 4; index += 1) {
      items.push([
        new THREE.Vector3(-2.8 + index * 0.2, 0.9 - index * 0.2, -1.4),
        new THREE.Vector3(-0.8 + index * 0.25, 1.55 - index * 0.18, 0),
        new THREE.Vector3(2.1 - index * 0.2, 0.4 - index * 0.1, 1.25),
      ]);
    }

    return items;
  }, []);

  return (
    <group ref={group}>
      {curves.map((curve, index) => {
        const path = new THREE.CatmullRomCurve3(curve);
        const points = path.getPoints(60);
        return (
          <line key={index}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array(points.flatMap(point => [point.x, point.y, point.z])), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={index % 2 === 0 ? theme.particleA : theme.particleB}
              transparent
              opacity={0.18}
            />
          </line>
        );
      })}
    </group>
  );
};

function getTheme(variant: WorldSceneVariant) {
  return EXPERIENCE_THEMES[variant];
}

const SceneContents: React.FC<ImmersiveSceneProps> = ({ variant, preset, reducedMotion, compact }) => {
  const theme = getTheme(variant);
  const pointCount = compact ? 120 : preset === 'selector' ? 160 : 220;

  return (
    <>
      <fog attach="fog" args={['#020617', 8, 18]} />
      <ambientLight intensity={0.9} />
      <hemisphereLight intensity={0.85} color={theme.rim} groundColor={theme.glow} />
      <pointLight position={[4, 3, 4]} color={theme.base} intensity={18} distance={22} />
      <pointLight position={[-5, -2, 1]} color={theme.secondary} intensity={10} distance={18} />
      <spotLight position={[0, 5, 6]} color={theme.rim} intensity={18} angle={0.35} penumbra={0.5} />

      <Environment preset="night" />
      <CameraRig reducedMotion={reducedMotion} />
      <ParticleField theme={theme} count={pointCount} reducedMotion={reducedMotion} />
      <MotionLines theme={theme} reducedMotion={reducedMotion} />
      <FloatingPanels theme={theme} variant={variant} reducedMotion={reducedMotion} />
      <OrbitalNetwork theme={theme} preset={preset} reducedMotion={reducedMotion} />
      <VariantAccent variant={variant} theme={theme} reducedMotion={reducedMotion} />
    </>
  );
};

const ImmersiveScene: React.FC<ImmersiveSceneProps> = ({
  variant,
  preset,
  reducedMotion,
  compact,
}) => {
  const camera = compact ? [0, 0.45, 7.5] : preset === 'selector' ? [0, 0.2, 8.3] : [0, 0.15, 8.9];

  return (
    <Canvas
      dpr={compact ? [1, 1.2] : [1, 1.7]}
      gl={{ alpha: true, antialias: !compact, powerPreference: 'high-performance' }}
      camera={{ position: camera as [number, number, number], fov: compact ? 42 : 38 }}
      frameloop={reducedMotion ? 'demand' : 'always'}
    >
      <SceneContents
        variant={variant}
        preset={preset}
        reducedMotion={reducedMotion}
        compact={compact}
      />
    </Canvas>
  );
};

export default ImmersiveScene;
