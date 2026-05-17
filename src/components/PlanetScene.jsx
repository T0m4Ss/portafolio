import { useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Ring, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const TWO_PI = Math.PI * 2;

const PLANET_TEXTURES = {
  sun:     '/textures/2k_sun.jpg',
  mercury: '/textures/2k_mercury.jpg',
  venus:   '/textures/2k_venus_surface.jpg',
  earth:   '/textures/2k_earth_daymap.jpg',
  mars:    '/textures/2k_mars.jpg',
  jupiter: '/textures/2k_jupiter.jpg',
  saturn:  '/textures/2k_saturn.jpg',
  uranus:  '/textures/2k_uranus.jpg',
  neptune: '/textures/2k_neptune.jpg',
};

function CameraRig({ cameraTarget, planetTarget }) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(5, 1, 6));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const speed = Math.min(delta * 1.4, 0.08);
    targetPos.current.fromArray(cameraTarget);
    targetLook.current.fromArray(planetTarget);
    currentPos.current.lerp(targetPos.current, speed);
    currentLookAt.current.lerp(targetLook.current, speed);
    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

function Planet({ config, texture, ringTexture, moonTexture }) {
  const meshRef = useRef();
  const isSun = config.id === 'sun';

  useEffect(() => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.needsUpdate = true;
    }
  }, [texture]);

  useFrame((_, delta) => {
    if (texture) {
      texture.offset.x = (texture.offset.x + delta * config.rotationSpeed / TWO_PI) % 1;
    } else if (meshRef.current) {
      meshRef.current.rotation.y += delta * config.rotationSpeed;
    }
  });

  return (
    <group position={config.position}>
      <Sphere ref={meshRef} args={[config.radius, 64, 64]}>
        <meshStandardMaterial
          map={texture}
          color={texture ? '#ffffff' : config.color}
          emissive={config.emissive}
          emissiveIntensity={config.emissiveIntensity}
          roughness={1}
          metalness={0}
        />
      </Sphere>

      <Sphere args={[config.radius * 1.06, 32, 32]}>
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={isSun ? 0.05 : 0.06}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>

      {config.hasRing && (
        <Ring
          args={[config.radius * 1.4, config.radius * 2.3, 80]}
          rotation={[config.ringTilt ?? Math.PI / 2.5, 0, 0]}
        >
          <meshStandardMaterial
            map={ringTexture}
            color={config.id === 'uranus' ? '#80deea' : '#c9a96e'}
            transparent
            opacity={ringTexture ? 0.88 : 0.38}
            alphaTest={ringTexture ? 0.01 : 0}
            side={THREE.DoubleSide}
            roughness={0.9}
            depthWrite={false}
          />
        </Ring>
      )}

      {config.hasMoon && (
        <Sphere args={[0.15, 24, 24]} position={[1.3, 0.3, 0.5]}>
          <meshStandardMaterial
            map={moonTexture}
            color={moonTexture ? '#ffffff' : '#bdbdbd'}
            roughness={0.9}
            metalness={0.05}
          />
        </Sphere>
      )}
    </group>
  );
}

function PointsField({ positions, size, color, opacity }) {
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={size} color={color} transparent opacity={opacity} sizeAttenuation />
    </points>
  );
}

function Stars() {
  const count = 1400;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.3) * 140;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 50;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return arr;
  }, []);
  return <PointsField positions={positions} size={0.06} color="#e3f2fd" opacity={0.6} />;
}

function AsteroidBelt() {
  const count = 500;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spread = 1.2 + Math.random() * 2.4;
      arr[i * 3]     = 41.5 + (Math.random() - 0.5) * 7;
      arr[i * 3 + 1] = Math.sin(angle) * spread * 0.25;
      arr[i * 3 + 2] = Math.cos(angle) * spread;
    }
    return arr;
  }, []);
  return <PointsField positions={positions} size={0.055} color="#b8b8b8" opacity={0.7} />;
}

function Background({ texture }) {
  const meshRef = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (meshRef.current) meshRef.current.position.copy(camera.position);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[100, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function Scene({ planets, cameraTarget, planetTarget }) {
  const textures = useTexture(PLANET_TEXTURES);
  const saturnRingTexture = useTexture('/textures/2k_saturn_ring_alpha.png');
  const moonTexture = useTexture('/textures/2k_moon.jpg');
  const bgTexture = useTexture('/textures/8k_stars_milky_way.jpg');

  return (
    <>
      <Background texture={bgTexture} />

      <ambientLight intensity={0.07} color="#1a237e" />
      <directionalLight
        position={[-5, 3, 5]}
        intensity={1.1}
        color="#fff8ee"
      />
      <pointLight position={[0, 0, 0]} intensity={2.6} color="#ff7020" distance={42} decay={2} />
      <pointLight position={[105, 5, -10]} intensity={0.12} color="#4dd0e1" distance={45} />

      <Stars />
      <AsteroidBelt />
      <CameraRig cameraTarget={cameraTarget} planetTarget={planetTarget} />

      {planets.map((config) => (
        <Planet
          key={config.id}
          config={config}
          texture={textures[config.id]}
          ringTexture={config.id === 'saturn' ? saturnRingTexture : undefined}
          moonTexture={config.hasMoon ? moonTexture : undefined}
        />
      ))}
    </>
  );
}

export default function PlanetScene({ planets, cameraTarget, planetTarget }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [5, 1, 6], fov: 50, near: 0.1, far: 220 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene planets={planets} cameraTarget={cameraTarget} planetTarget={planetTarget} />
        </Suspense>
      </Canvas>
    </div>
  );
}
