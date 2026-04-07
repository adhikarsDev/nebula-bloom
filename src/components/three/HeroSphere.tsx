import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion';
import * as THREE from 'three';

function SingleRing({ radius, tube, rotation, color, emissive }: { radius: number; tube: number; rotation: [number, number, number]; color: string; emissive: string }) {
  return (
    <mesh rotation={rotation}>
      <torusGeometry args={[radius, tube, 48, 128]} />
      <meshPhysicalMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.5}
        roughness={0.08}
        metalness={1}
        clearcoat={1}
        clearcoatRoughness={0.03}
        envMapIntensity={2}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function OrbitalObject({ mouse, scrollScale, scrollX }: { mouse: React.MutableRefObject<{ x: number; y: number }>; scrollScale: React.MutableRefObject<number>; scrollX: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringGroupRef = useRef<THREE.Group>(null);
  const currentX = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;
    const s = scrollScale.current;
    groupRef.current.scale.setScalar(s);
    currentX.current += (scrollX.current - currentX.current) * 0.05;
    groupRef.current.position.x = currentX.current;

    const t = state.clock.elapsedTime;
    groupRef.current.rotation.x = t * 0.06 + mouse.current.y * 0.12;
    groupRef.current.rotation.y = t * 0.1 + mouse.current.x * 0.12;

    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.z = t * 0.15;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={0.8}>
      <group ref={groupRef} scale={2.2}>
        {/* Solid core sphere */}
        <mesh>
          <sphereGeometry args={[0.45, 64, 64]} />
          <meshPhysicalMaterial
            color="#00e0b0"
            emissive="#009070"
            emissiveIntensity={0.8}
            roughness={0.04}
            metalness={1}
            clearcoat={1}
            clearcoatRoughness={0.02}
            envMapIntensity={3}
          />
        </mesh>

        {/* Core inner glow */}
        <mesh scale={1.15}>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshBasicMaterial color="#00ffcc" transparent opacity={0.06} side={THREE.BackSide} />
        </mesh>

        {/* Single solid orbital ring */}
        <group ref={ringGroupRef}>
          <SingleRing
            radius={1.1}
            tube={0.045}
            rotation={[Math.PI / 2.5, 0.3, 0]}
            color="#00d4aa"
            emissive="#007755"
          />
        </group>

        {/* Outer subtle shell */}
        <mesh scale={1.5}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#00e0b0" transparent opacity={0.025} side={THREE.BackSide} />
        </mesh>
      </group>
    </Float>
  );
}

function ParticleField() {
  const count = 300;
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
      ref.current.rotation.y = state.clock.elapsedTime * 0.012;
      ref.current.rotation.x = state.clock.elapsedTime * 0.006;
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
      <pointsMaterial size={0.01} color="#00d4aa" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#00ffcc" />
      <pointLight position={[-5, -3, 3]} intensity={0.5} color="#00aa88" />
      <pointLight position={[0, 5, -5]} intensity={0.4} color="#00ddbb" />
      <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} color="#00e0b0" />
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
            <OrbitalObject mouse={mouse} scrollScale={scrollScaleRef} scrollX={scrollXRef} />
            <ParticleField />
          </Suspense>
        </Canvas>
      </div>
    </motion.div>
  );
}
