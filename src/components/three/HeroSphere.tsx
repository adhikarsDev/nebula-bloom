import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion';
import * as THREE from 'three';

function AnimatedTorusKnot({ mouse, scrollScale }: { mouse: React.MutableRefObject<{ x: number; y: number }>; scrollScale: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const s = scrollScale.current;
    meshRef.current.scale.setScalar(s);
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.12 + mouse.current.y * 0.25;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.18 + mouse.current.x * 0.25;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;

    if (innerRef.current) {
      innerRef.current.rotation.x = -state.clock.elapsedTime * 0.08;
      innerRef.current.rotation.y = -state.clock.elapsedTime * 0.12;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={1.2}>
      <group ref={meshRef} scale={2.2}>
        {/* Main torus knot */}
        <mesh>
          <torusKnotGeometry args={[0.8, 0.25, 200, 32, 2, 3]} />
          <meshPhysicalMaterial
            color="#00c8ff"
            emissive="#0050dd"
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={2}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Inner wireframe knot for depth */}
        <mesh ref={innerRef}>
          <torusKnotGeometry args={[0.8, 0.26, 100, 16, 2, 3]} />
          <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.12} />
        </mesh>
        {/* Outer glow shell */}
        <mesh scale={1.08}>
          <torusKnotGeometry args={[0.8, 0.25, 80, 16, 2, 3]} />
          <meshBasicMaterial color="#00aaff" transparent opacity={0.04} side={THREE.BackSide} />
        </mesh>
      </group>
    </Float>
  );
}

function ParticleField() {
  const count = 500;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
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
      <pointsMaterial size={0.015} color="#00d4ff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00d4ff" />
      <pointLight position={[-5, -3, 3]} intensity={0.6} color="#8b5cf6" />
      <pointLight position={[0, 5, -5]} intensity={0.4} color="#06b6d4" />
      <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} color="#00d4ff" />
    </>
  );
}

export default function FixedHeroSphere() {
  const mouse = useRef({ x: 0, y: 0 });
  const scrollScaleRef = useRef(2.2);

  const { scrollYProgress } = useScroll();
  // Scale from 2.2 (hero) down to 1.2 as user scrolls, and opacity fades slightly
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [2.2, 1.3, 1.0, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.85, 1], [1, 0.5, 0.3, 0.15]);

  useMotionValueEvent(scale, 'change', (v) => {
    scrollScaleRef.current = v;
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
            <AnimatedSphere mouse={mouse} scrollScale={scrollScaleRef} />
            <ParticleField />
          </Suspense>
        </Canvas>
      </div>
    </motion.div>
  );
}
