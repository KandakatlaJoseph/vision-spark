import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';

function TechCore() {
  const sphereRef = useRef();

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={sphereRef} args={[1, 64, 64]} scale={1.5}>
        <MeshDistortMaterial
          color="#0054FF"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive="#0054FF"
          emissiveIntensity={0.5}
        />
      </Sphere>
      {/* Inner Core */}
      <Sphere args={[0.8, 32, 32]}>
        <meshStandardMaterial color="#FC5302" emissive="#FC5302" emissiveIntensity={2} />
      </Sphere>
    </Float>
  );
}

function OrbitingElements() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
    }
  });

  const elements = [
    { position: [2.5, 0, 0], color: "#FC5302", scale: 0.2 },
    { position: [-2.5, 0, 0], color: "#0054FF", scale: 0.15 },
    { position: [0, 2.5, 0], color: "#ffffff", scale: 0.1 },
    { position: [0, -2.5, 0], color: "#FC5302", scale: 0.25 },
    { position: [1.8, 1.8, 0], color: "#0054FF", scale: 0.1 },
    { position: [-1.8, -1.8, 0], color: "#ffffff", scale: 0.15 },
  ];

  return (
    <group ref={groupRef}>
      {elements.map((el, i) => (
        <Float key={i} speed={3} rotationIntensity={2} floatIntensity={2}>
          <mesh position={el.position}>
            <boxGeometry args={[el.scale, el.scale, el.scale]} />
            <meshStandardMaterial color={el.color} emissive={el.color} emissiveIntensity={1} />
          </mesh>
        </Float>
      ))}
      {/* Orbit Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#0054FF" transparent opacity={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, Math.PI / 4, 0]}>
        <torusGeometry args={[3, 0.005, 16, 100]} />
        <meshBasicMaterial color="#FC5302" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

export default function Hero3DScene() {
  return (
    <div className="w-full h-full absolute inset-0 z-0 pointer-events-none sm:pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={2} color="#0054FF" />
        <pointLight position={[10, -10, 5]} intensity={2} color="#FC5302" />
        
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        
        <TechCore />
        <OrbitingElements />
        
        {/* Enable mouse interaction but disable zoom to keep page scrollable */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
