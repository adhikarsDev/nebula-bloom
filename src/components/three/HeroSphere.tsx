import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15 + mouse.current.y * 0.3;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 + mouse.current.x * 0.3;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.5}>
      <mesh ref={meshRef} scale={2.2}>
        <icosahedronGeometry args={[1, 8]} />
        <MeshDistortMaterial
          color="#00d4ff"
          emissive="#0066ff"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
          distort={0.35}
          speed={2}
          wireframe={false}
        />
      </mesh>
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

export default function HeroSphere() {
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  return (
    <div className="absolute inset-0" onMouseMove={handleMouseMove}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Lights />
          <AnimatedSphere mouse={mouse} />
          <ParticleField />
        </Suspense>
      </Canvas>
    </div>
  );
}
