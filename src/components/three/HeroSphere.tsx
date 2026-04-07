import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion';
import * as THREE from 'three';

function CrystalPolyhedron({ mouse, scrollScale, scrollX }: { mouse: React.MutableRefObject<{ x: number; y: number }>; scrollScale: React.MutableRefObject<number>; scrollX: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const currentX = useRef(0);

  // Create icosahedron geometry for edges
  const edgesGeo = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1, 0);
    return new THREE.EdgesGeometry(ico);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const s = scrollScale.current;
    groupRef.current.scale.setScalar(s);
    currentX.current += (scrollX.current - currentX.current) * 0.05;
    groupRef.current.position.x = currentX.current;

    const t = state.clock.elapsedTime;
    groupRef.current.rotation.x = t * 0.08 + mouse.current.y * 0.2;
    groupRef.current.rotation.y = t * 0.12 + mouse.current.x * 0.2;
    groupRef.current.rotation.z = t * 0.04;

    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.1;
      innerRef.current.rotation.y = -t * 0.15;
      innerRef.current.rotation.z = t * 0.06;
    }

    if (edgesRef.current) {
      edgesRef.current.rotation.x = t * 0.05;
      edgesRef.current.rotation.y = -t * 0.08;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={1.2}>
      <group ref={groupRef} scale={2.2}>
        {/* Main crystal — outer shell */}
        <mesh>
          <icosahedronGeometry args={[1, 1]} />
          <meshPhysicalMaterial
            color="#ff69b4"
            emissive="#cc2277"
            emissiveIntensity={0.5}
            roughness={0.05}
            metalness={0.95}
            clearcoat={1}
            clearcoatRoughness={0.02}
            envMapIntensity={3}
            transparent
            opacity={0.75}
            side={THREE.FrontSide}
          />
        </mesh>

        {/* Inner crystal — smaller, rotated differently for depth */}
        <mesh ref={innerRef} scale={0.6}>
          <icosahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#ff99cc"
            emissive="#ff3388"
            emissiveIntensity={0.7}
            roughness={0.02}
            metalness={1}
            clearcoat={1}
            clearcoatRoughness={0.01}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Wireframe edges — outer facets */}
        <lineSegments ref={edgesRef} scale={1.15}>
          <bufferGeometry attach="geometry" {...edgesGeo} />
          <lineBasicMaterial color="#ffb6d9" transparent opacity={0.35} />
        </lineSegments>

        {/* Outer glow shell */}
        <mesh scale={1.2}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#ff88bb" transparent opacity={0.04} side={THREE.BackSide} />
        </mesh>

        {/* Faint wireframe overlay on main shape */}
        <mesh scale={1.01}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#ffaacc" wireframe transparent opacity={0.08} />
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
      <pointsMaterial size={0.012} color="#ff88bb" transparent opacity={0.45} sizeAttenuation />
    </points>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#ff69b4" />
      <pointLight position={[-5, -3, 3]} intensity={0.7} color="#cc44aa" />
      <pointLight position={[0, 5, -5]} intensity={0.5} color="#ff99cc" />
      <spotLight position={[0, 10, 0]} intensity={0.6} angle={0.3} penumbra={1} color="#ff77bb" />
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
            <CrystalPolyhedron mouse={mouse} scrollScale={scrollScaleRef} scrollX={scrollXRef} />
            <ParticleField />
          </Suspense>
        </Canvas>
      </div>
    </motion.div>
  );
}
