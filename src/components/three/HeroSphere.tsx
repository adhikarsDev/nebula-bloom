import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion';
import * as THREE from 'three';

function MorphingBlob({ mouse, scrollScale, scrollX }: { mouse: React.MutableRefObject<{ x: number; y: number }>; scrollScale: React.MutableRefObject<number>; scrollX: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const currentX = useRef(0);

  const originalPositions = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 4);
    return geo.attributes.position.array.slice();
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const s = scrollScale.current;
    groupRef.current.scale.setScalar(s);
    currentX.current += (scrollX.current - currentX.current) * 0.05;
    groupRef.current.position.x = currentX.current;

    const t = state.clock.elapsedTime;
    groupRef.current.rotation.x = t * 0.06 + mouse.current.y * 0.15;
    groupRef.current.rotation.y = t * 0.1 + mouse.current.x * 0.15;

    // Morph vertices
    if (meshRef.current) {
      const pos = meshRef.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const ox = originalPositions[i * 3];
        const oy = originalPositions[i * 3 + 1];
        const oz = originalPositions[i * 3 + 2];

        const noise =
          Math.sin(ox * 2.5 + t * 0.8) * 0.12 +
          Math.sin(oy * 3.2 + t * 0.6) * 0.1 +
          Math.sin(oz * 2.8 + t * 1.0) * 0.08 +
          Math.sin((ox + oy) * 1.5 + t * 0.4) * 0.06;

        const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const scale = 1 + noise;
        pos.setXYZ(i, (ox / len) * scale, (oy / len) * scale, (oz / len) * scale);
      }
      pos.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }

    // Sync wireframe
    if (wireRef.current && meshRef.current) {
      const src = meshRef.current.geometry.attributes.position;
      const dst = wireRef.current.geometry.attributes.position;
      for (let i = 0; i < src.count; i++) {
        dst.setXYZ(i, src.getX(i), src.getY(i), src.getZ(i));
      }
      dst.needsUpdate = true;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.8}>
      <group ref={groupRef} scale={2.2}>
        {/* Main morphing blob */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1, 4]} />
          <meshPhysicalMaterial
            color="#e8a830"
            emissive="#b8660a"
            emissiveIntensity={0.5}
            roughness={0.06}
            metalness={1}
            clearcoat={1}
            clearcoatRoughness={0.03}
            envMapIntensity={2.5}
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* Wireframe overlay */}
        <mesh ref={wireRef} scale={1.005}>
          <icosahedronGeometry args={[1, 4]} />
          <meshBasicMaterial color="#ffd080" wireframe transparent opacity={0.07} />
        </mesh>

        {/* Outer glow */}
        <mesh scale={1.3}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#e8a830" transparent opacity={0.03} side={THREE.BackSide} />
        </mesh>
      </group>
    </Float>
  );
}

function ParticleField() {
  const count = 400;
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
      <pointsMaterial size={0.012} color="#e8a830" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight position={[5, 5, 5]} intensity={1.3} color="#e8a830" />
      <pointLight position={[-5, -3, 3]} intensity={0.6} color="#ff8c00" />
      <pointLight position={[0, 5, -5]} intensity={0.5} color="#ffc060" />
      <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} color="#e8a830" />
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
  // Hero: center → Features (text right, 3D left) → Showcase (text left, 3D right) → About (text right, 3D left)
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
            <MorphingBlob mouse={mouse} scrollScale={scrollScaleRef} scrollX={scrollXRef} />
            <ParticleField />
          </Suspense>
        </Canvas>
      </div>
    </motion.div>
  );
}
