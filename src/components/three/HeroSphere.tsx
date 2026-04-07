import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion';
import * as THREE from 'three';

function OrbitalRing({ radius, tubeRadius, rotation, color, speed, emissive }: { radius: number; tubeRadius: number; rotation: [number, number, number]; color: string; speed: number; emissive: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={ref} rotation={rotation}>
      <torusGeometry args={[radius, tubeRadius, 32, 120]} />
      <meshPhysicalMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.6}
        roughness={0.1}
        metalness={0.9}
        clearcoat={1}
        clearcoatRoughness={0.05}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function ElectronDot({ orbitRadius, rotation, speed, phase }: { orbitRadius: number; rotation: [number, number, number]; speed: number; phase: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current && groupRef.current) {
      const t = state.clock.elapsedTime * speed + phase;
      ref.current.position.x = Math.cos(t) * orbitRadius;
      ref.current.position.y = Math.sin(t) * orbitRadius;
      // Pulsing glow
      const s = 0.08 + Math.sin(t * 2) * 0.02;
      ref.current.scale.setScalar(s / 0.08);
    }
  });

  return (
    <group ref={groupRef} rotation={rotation}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#00ffcc" transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

function AtomStructure({ mouse, scrollScale, scrollX }: { mouse: React.MutableRefObject<{ x: number; y: number }>; scrollScale: React.MutableRefObject<number>; scrollX: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const currentX = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;
    const s = scrollScale.current;
    groupRef.current.scale.setScalar(s);
    currentX.current += (scrollX.current - currentX.current) * 0.05;
    groupRef.current.position.x = currentX.current;

    const t = state.clock.elapsedTime;
    groupRef.current.rotation.x = t * 0.05 + mouse.current.y * 0.15;
    groupRef.current.rotation.y = t * 0.08 + mouse.current.x * 0.15;
  });

  const orbitRadius = 1.4;

  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={0.8}>
      <group ref={groupRef} scale={2.2}>
        {/* Core nucleus — glowing sphere */}
        <mesh>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshPhysicalMaterial
            color="#00ffcc"
            emissive="#00ddaa"
            emissiveIntensity={1.5}
            roughness={0}
            metalness={0.5}
            clearcoat={1}
          />
        </mesh>
        {/* Core glow */}
        <mesh scale={1.8}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshBasicMaterial color="#00ffcc" transparent opacity={0.08} side={THREE.BackSide} />
        </mesh>

        {/* Orbital ring 1 — horizontal-ish */}
        <OrbitalRing
          radius={orbitRadius}
          tubeRadius={0.025}
          rotation={[0.3, 0, 0]}
          color="#00e6b8"
          emissive="#008866"
          speed={0.3}
        />

        {/* Orbital ring 2 — tilted */}
        <OrbitalRing
          radius={orbitRadius}
          tubeRadius={0.025}
          rotation={[1.2, 0.8, 0]}
          color="#00ccaa"
          emissive="#007755"
          speed={-0.25}
        />

        {/* Orbital ring 3 — opposite tilt */}
        <OrbitalRing
          radius={orbitRadius}
          tubeRadius={0.025}
          rotation={[-0.6, 1.5, 0.3]}
          color="#00ddbb"
          emissive="#009977"
          speed={0.35}
        />

        {/* Electrons orbiting along ring paths */}
        <ElectronDot orbitRadius={orbitRadius} rotation={[0.3, 0, 0]} speed={0.8} phase={0} />
        <ElectronDot orbitRadius={orbitRadius} rotation={[1.2, 0.8, 0]} speed={-0.7} phase={2} />
        <ElectronDot orbitRadius={orbitRadius} rotation={[-0.6, 1.5, 0.3]} speed={0.9} phase={4} />

        {/* Faint wireframe outer shell */}
        <mesh scale={1.6}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#00ffcc" wireframe transparent opacity={0.04} />
        </mesh>
      </group>
    </Float>
  );
}

function ParticleField() {
  const count = 350;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.015;
      ref.current.rotation.x = state.clock.elapsedTime * 0.008;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.012} color="#00e6b8" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00ffcc" />
      <pointLight position={[-5, -3, 3]} intensity={0.6} color="#00aa88" />
      <pointLight position={[0, 5, -5]} intensity={0.4} color="#00ddbb" />
      <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} color="#00ffcc" />
    </>
  );
}

export default function FixedHeroSphere() {
  const mouse = useRef({ x: 0, y: 0 });
  const scrollScaleRef = useRef(2.2);
  const scrollXRef = useRef(0);

  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [2.2, 1.3, 1.0, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.85, 1], [1, 0.6, 0.4, 0.2]);
  const xPosition = useTransform(scrollYProgress, [0, 0.12, 0.2, 0.38, 0.48, 0.65, 0.75, 1], [0, 0, -3, -3, 3, 3, -3, -3]);

  useMotionValueEvent(scale, 'change', (v) => {
    scrollScaleRef.current = v;
  });

  useMotionValueEvent(xPosition, 'change', (v) => {
    scrollXRef.current = v;
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  return (
    <motion.div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity }}
    >
      <div className="absolute inset-0 pointer-events-auto" onMouseMove={handleMouseMove}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <Lights />
            <AtomStructure mouse={mouse} scrollScale={scrollScaleRef} scrollX={scrollXRef} />
            <ParticleField />
          </Suspense>
        </Canvas>
      </div>
    </motion.div>
  );
}
