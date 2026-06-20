"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

/**
 * A slow-tumbling reflective chrome ring used as a 3D centerpiece behind the
 * stats band. Isolated R3F leaf. Uses an environment map for the metal look
 * but no shadows/heavy lights, so it stays cheap. Pauses offscreen via the
 * `active` frameloop switch.
 */
function Ring({ reduce }: { reduce: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current || reduce) return;
    ref.current.rotation.x += delta * 0.18;
    ref.current.rotation.y += delta * 0.12;
  });
  return (
    <mesh ref={ref} rotation={[0.6, 0.2, 0]}>
      <torusGeometry args={[1.5, 0.42, 48, 128]} />
      <meshStandardMaterial
        color="#cfd4dc"
        metalness={1}
        roughness={0.18}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

export default function ChromeRing({
  reduce = false,
  active = true,
}: {
  reduce?: boolean;
  active?: boolean;
}) {
  const frameloop = reduce || !active ? "never" : "always";
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.2], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      frameloop={frameloop}
    >
      {/* warm rim + cool fill so the chrome picks up the brand orange */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 3, 5]} intensity={1.4} color="#ff7a40" />
      <directionalLight position={[-5, -2, 2]} intensity={0.8} color="#7fa0d0" />
      <Environment preset="city" />
      <Ring reduce={reduce} />
    </Canvas>
  );
}
