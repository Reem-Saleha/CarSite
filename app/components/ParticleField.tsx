"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Ambient dust + debris field used as a section background below the hero.
 * Built to echo the hero video's smoke/dust/flying-particle look: particles
 * drift and settle (not just spin), with size variation so some read as bigger
 * debris chunks. Isolated R3F leaf; pointer parallax + drift run in useFrame so
 * nothing re-renders React. Honors reduced motion with a static frame.
 */
function Dust({
  count,
  color,
  reduce,
  big = false,
}: {
  count: number;
  color: string;
  reduce: boolean;
  big?: boolean;
}) {
  const ref = useRef<THREE.Points>(null);
  const { pointer } = useThree();

  // positions + per-particle drift velocity (so they swirl like settling dust)
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9;
      // slow lateral drift + gentle downward settle
      velocities[i * 2 + 0] = (Math.random() - 0.5) * 0.6;
      velocities[i * 2 + 1] = -0.15 - Math.random() * 0.45;
    }
    return { positions, velocities };
  }, [count]);

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts || reduce) return;
    const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] += velocities[i * 2 + 0] * delta;
      arr[i * 3 + 1] += velocities[i * 2 + 1] * delta;
      // wrap around the box so the field never empties
      if (arr[i * 3 + 1] < -5.5) {
        arr[i * 3 + 1] = 5.5;
        arr[i * 3 + 0] = (Math.random() - 0.5) * 18;
      }
      if (arr[i * 3 + 0] > 9) arr[i * 3 + 0] = -9;
      else if (arr[i * 3 + 0] < -9) arr[i * 3 + 0] = 9;
    }
    pos.needsUpdate = true;
    // subtle parallax toward the cursor
    pts.position.x = THREE.MathUtils.lerp(pts.position.x, pointer.x * 0.5, 0.04);
    pts.position.y = THREE.MathUtils.lerp(pts.position.y, -pointer.y * 0.3, 0.04);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={big ? 0.12 : 0.05}
        sizeAttenuation
        transparent
        opacity={big ? 0.5 : 0.7}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

export default function ParticleField({
  count = 1400,
  color = "#8a8782", // ash / dust gray
  accent = "#ff6a33", // ember orange
  reduce = false,
  active = true,
}: {
  count?: number;
  color?: string;
  accent?: string;
  reduce?: boolean;
  active?: boolean;
}) {
  const frameloop = reduce || !active ? "never" : "always";
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 60 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      frameloop={frameloop}
    >
      <fog attach="fog" args={["#0a0b0d", 7, 17]} />
      {/* fine dust */}
      <Dust count={count} color={color} reduce={reduce} />
      {/* sparse larger debris chunks */}
      <Dust count={Math.round(count * 0.12)} color="#5b5854" reduce={reduce} big />
      {/* a few glowing embers */}
      <Dust count={Math.round(count * 0.05)} color={accent} reduce={reduce} big />
    </Canvas>
  );
}
