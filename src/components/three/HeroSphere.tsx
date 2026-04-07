import { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion';
import * as THREE from 'three';

function DoubleHelix({ mouse, scrollScale, scrollX }: { mouse: React.MutableRefObject<{ x: number; y: number }>; scrollScale: React.MutableRefObject<number>; scrollX: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const currentX = useRef(0);

  const { strandA, strandB, rungs } = useMemo(() => {
    const segments = 120;
    const radius = 1.2;
    const height = 5;
    const twists = 2.5;

    const makeStrand = (offset: number) => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 2 * twists + offset;
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          (t - 0.5) * height,
          Math.sin(angle) * radius
        ));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      return new THREE.TubeGeometry(curve, segments, 0.06, 8, false);
    };

    const rungGeos: { geo: THREE.TubeGeometry; }[] = [];
    const rungCount = 30;
    for (let i = 0; i < rungCount; i++) {
      const t = i / rungCount;
      const angle = t * Math.PI * 2 * twists;
      const y = (t - 0.5) * height;
      const pA = new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      const pB = new THREE.Vector3(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius);
      const curve = new THREE.CatmullRomCurve3([pA, pB]);
      rungGeos.push({ geo: new THREE.TubeGeometry(curve, 4, 0.025, 6, false) });
    }

    return { strandA: makeStrand(0), strandB: makeStrand(Math.PI), rungs: rungGeos };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const s = scrollScale.current;
    groupRef.current.scale.setScalar(s);
    currentX.current += (scrollX.current - currentX.current) * 0.05;
    groupRef.current.position.x = currentX.current;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.2 + mouse.current.x * 0.3;
    groupRef.current.rotation.x = mouse.current.y * 0.15;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.8}>
      <group ref={groupRef} scale={2.2}>
        {/* Strand A */}
        <mesh geometry={strandA}>
          <meshPhysicalMaterial
            color="#00e5ff"
            emissive="#0066cc"
            emissiveIntensity={0.6}
            roughness={0.1}
            metalness={1}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={2}
            transparent
            opacity={0.95}
          />
        </mesh>
        {/* Strand B */}
        <mesh geometry={strandB}>
          <meshPhysicalMaterial
            color="#00b8d4"
            emissive="#004466"
            emissiveIntensity={0.5}
            roughness={0.12}
            metalness={0.95}
            clearcoat={0.9}
            clearcoatRoughness={0.08}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Rungs */}
        {rungs.map((r, i) => (
          <mesh key={i} geometry={r.geo}>
            <meshPhysicalMaterial
              color="#40e0ff"
              emissive="#0088aa"
              emissiveIntensity={0.3}
              roughness={0.2}
              metalness={0.8}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
        {/* Wireframe overlay strand A */}
        <mesh geometry={strandA}>
          <meshBasicMaterial color="#00e5ff" wireframe transparent opacity={0.08} />
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
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.012} color="#00e5ff" transparent opacity={0.45} sizeAttenuation />
    </points>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#00e5ff" />
      <pointLight position={[-5, -3, 3]} intensity={0.7} color="#00b8d4" />
      <pointLight position={[0, 5, -5]} intensity={0.5} color="#40e0ff" />
      <spotLight position={[0, 10, 0]} intensity={0.6} angle={0.3} penumbra={1} color="#00e5ff" />
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

  useMotionValueEvent(scale, 'change', (v) => { scrollScaleRef.current = v; });
  useMotionValueEvent(xPosition, 'change', (v) => { scrollXRef.current = v; });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <motion.div className="fixed inset-0 z-0 pointer-events-none" style={{ opacity }}>
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
          <Suspense fallback={null}>
            <Lights />
            <DoubleHelix mouse={mouse} scrollScale={scrollScaleRef} scrollX={scrollXRef} />
            <ParticleField />
          </Suspense>
        </Canvas>
      </div>
    </motion.div>
  );
}
