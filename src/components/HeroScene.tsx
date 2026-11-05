"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  Lightformer,
  MeshDistortMaterial,
  PerformanceMonitor,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

const LIME = "#c6f432";
const VIOLET = "#7b61ff";
const CORAL = "#ff5c39";

/** Liquid-chrome core: the "Original" heart of the brand. */
function Core() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += dt * 0.15;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });
  return (
    <mesh ref={mesh} scale={1.15}>
      <icosahedronGeometry args={[1, 48]} />
      <MeshDistortMaterial
        color="#8f95c9"
        roughness={0.12}
        metalness={0.95}
        distort={0.4}
        speed={1.6}
        envMapIntensity={2.2}
      />
    </mesh>
  );
}

/** Three orbit rings = Build / Grow / Fix. */
function Ring({ color, radius, tilt, speed }: { color: string; radius: number; tilt: [number, number, number]; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * speed;
  });
  return (
    <group rotation={tilt}>
      <mesh ref={ref}>
        <torusGeometry args={[radius, 0.012, 16, 220]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {/* orbiting satellite */}
      <Satellite color={color} radius={radius} speed={speed * 2.2} offset={radius * 2.4} />
    </group>
  );
}

function Satellite({ color, radius, speed, offset }: { color: string; radius: number; speed: number; offset: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    if (ref.current) ref.current.position.set(Math.cos(t) * radius, Math.sin(t) * radius, 0);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.055, 24, 24]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

/** Floating glass/metal shards for depth. */
function Shards() {
  const items = useMemo(
    () => [
      { pos: [-2.6, 1.3, -0.6], geo: "oct", color: LIME, s: 0.22 },
      { pos: [2.5, -1.2, -0.4], geo: "box", color: VIOLET, s: 0.24 },
      { pos: [2.1, 1.6, -1.2], geo: "tet", color: CORAL, s: 0.2 },
      { pos: [-2.2, -1.5, -1], geo: "box", color: "#ffffff", s: 0.14 },
      { pos: [0.4, 2.2, -1.6], geo: "oct", color: VIOLET, s: 0.12 },
      { pos: [-0.8, -2.1, -0.8], geo: "tet", color: LIME, s: 0.13 },
    ] as const,
    []
  );
  return (
    <>
      {items.map((it, i) => (
        <Float key={i} speed={1.5 + i * 0.2} rotationIntensity={2} floatIntensity={1.4}>
          <mesh position={it.pos as unknown as [number, number, number]} scale={it.s}>
            {it.geo === "oct" && <octahedronGeometry args={[1]} />}
            {it.geo === "box" && <boxGeometry args={[1.3, 1.3, 1.3]} />}
            {it.geo === "tet" && <tetrahedronGeometry args={[1.2]} />}
            <meshStandardMaterial color={it.color} metalness={0.6} roughness={0.15} emissive={it.color} emissiveIntensity={0.35} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

/** Mouse-reactive parallax rig. */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame((_, dt) => {
    if (!group.current) return;
    const k = 1 - Math.pow(0.02, dt);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.45, k);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.3, k);
  });
  return <group ref={group}>{children}</group>;
}

export default function HeroScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(1.5);

  // Stop rendering when the hero is off-screen (saves battery and CPU).
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        dpr={dpr}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 7.4], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.75)} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <Rig>
          <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
            <Core />
          </Float>
          <Ring color={LIME} radius={2.05} tilt={[1.25, 0.2, 0]} speed={0.35} />
          <Ring color={VIOLET} radius={2.35} tilt={[1.0, -0.6, 0.4]} speed={-0.25} />
          <Ring color={CORAL} radius={2.65} tilt={[1.5, 0.7, -0.3]} speed={0.18} />
          <Shards />
          <Sparkles count={70} scale={[8, 5, 3]} size={2.2} speed={0.35} color="#ffffff" opacity={0.5} />
        </Rig>
        {/* Procedural studio lighting: no HDR download needed */}
        <Environment resolution={256} frames={1}>
          <color attach="background" args={["#141729"]} />
          <Lightformer form="rect" intensity={6} color={LIME} position={[-5, 2, 2]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
          <Lightformer form="rect" intensity={8} color={VIOLET} position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[8, 5, 1]} />
          <Lightformer form="ring" intensity={6} color={CORAL} position={[0, 5, -2]} rotation-x={Math.PI / 2} scale={4} />
          <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 0, 8]} scale={[10, 2, 1]} />
          <Lightformer form="circle" intensity={2} color="#7ef0c8" position={[0, -5, 0]} rotation-x={-Math.PI / 2} scale={6} />
        </Environment>
      </Canvas>
    </div>
  );
}
