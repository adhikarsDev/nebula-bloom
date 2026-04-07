import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion';
import * as THREE from 'three';

function AbstractRibbon({ mouse, scrollScale, scrollX }: { mouse: React.MutableRefObject<{ x: number; y: number }>; scrollScale: React.MutableRefObject<number>; scrollX: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const ribbonRef = useRef<THREE.Mesh>(null);
  const currentX = useRef(0);

  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2, 0, 0),
      new THREE.Vector3(-1, 1.2, 0.8),
      new THREE.Vector3(0, -0.5, -0.6),
      new THREE.Vector3(0.8, 1, 0.4),
      new THREE.Vector3(1.5, -0.8, -0.3),
      new THREE.Vector3(2, 0.3, 0.6),
    ], true, 'catmullrom', 0.5);

    const frames = curve.computeFrenetFrames(200, true);
    const positions: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];
    const width = 0.35;
    const segments = 200;
    const twists = 3;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const point = curve.getPointAt(t);
      const normal = frames.normals[Math.min(i, segments - 1)];
      const binormal = frames.binormals[Math.min(i, segments - 1)];

      const twistAngle = t * Math.PI * twists;
      const cos = Math.cos(twistAngle);
      const sin = Math.sin(twistAngle);

      const dir = new THREE.Vector3()
        .addScaledVector(normal, cos * width)
        .addScaledVector(binormal, sin * width);

      positions.push(point.x + dir.x, point.y + dir.y, point.z + dir.z);
      positions.push(point.x - dir.x, point.y - dir.y, point.z - dir.z);

      uvs.push(t, 0);
      uvs.push(t, 1);

      if (i < segments) {
        const a = i * 2;
        const b = i * 2 + 1;
        const c = (i + 1) * 2;
        const d = (i + 1) * 2 + 1;
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const s = scrollScale.current;
    groupRef.current.scale.setScalar(s);
    // Smooth lerp for horizontal position
    currentX.current += (scrollX.current - currentX.current) * 0.05;
    groupRef.current.position.x = currentX.current;
    groupRef.current.rotation.x = state.clock.elapsedTime * 0.1 + mouse.current.y * 0.2;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15 + mouse.current.x * 0.2;
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.05;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
      <group ref={groupRef} scale={2.2}>
        {/* Main ribbon - front */}
        <mesh geometry={geometry}>
          <meshPhysicalMaterial
            color="#00c8ff"
            emissive="#0040cc"
            emissiveIntensity={0.6}
            roughness={0.08}
            metalness={1}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={2.5}
            side={THREE.FrontSide}
            transparent
            opacity={0.92}
          />
        </mesh>
        {/* Main ribbon - back */}
        <mesh geometry={geometry}>
          <meshPhysicalMaterial
            color="#7c3aed"
            emissive="#4c1d95"
            emissiveIntensity={0.4}
            roughness={0.12}
            metalness={0.9}
            clearcoat={0.8}
            clearcoatRoughness={0.1}
            side={THREE.BackSide}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Wireframe overlay */}
        <mesh ref={ribbonRef} geometry={geometry}>
          <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.06} />
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
      <pointsMaterial size={0.012} color="#00d4ff" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#00d4ff" />
      <pointLight position={[-5, -3, 3]} intensity={0.7} color="#8b5cf6" />
      <pointLight position={[0, 5, -5]} intensity={0.5} color="#06b6d4" />
      <spotLight position={[0, 10, 0]} intensity={0.6} angle={0.3} penumbra={1} color="#00d4ff" />
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
  // Hero: center → Features (text right, 3D left) → Showcase (text left, 3D right) → About (text left, 3D right)
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
            <AbstractRibbon mouse={mouse} scrollScale={scrollScaleRef} scrollX={scrollXRef} />
            <ParticleField />
          </Suspense>
        </Canvas>
      </div>
    </motion.div>
  );
}
