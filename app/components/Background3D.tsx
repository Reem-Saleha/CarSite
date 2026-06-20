"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import styles from "./Background3D.module.css";

// three.js only downloads when this chunk is needed (lazy, client-only).
const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

/**
 * Lazy 3D particle background for a section. Mounts the heavy R3F canvas only
 * once it scrolls near the viewport (IntersectionObserver), so first paint and
 * the hero stay fast. Sits behind content via z-index and never intercepts
 * pointer events.
 */
export function Background3D({
  count,
  color,
  accent,
  className,
}: {
  count?: number;
  color?: string;
  accent?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [near, setNear] = useState(false);   // one-time: mount the canvas
  const [onScreen, setOnScreen] = useState(false); // toggles the render loop

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // mount a bit before it enters view so it's ready
    const mountIO = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          mountIO.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    // run the loop only while actually visible
    const visIO = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((e) => e.isIntersecting)),
      { threshold: 0.01 }
    );
    mountIO.observe(el);
    visIO.observe(el);
    return () => {
      mountIO.disconnect();
      visIO.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={`${styles.layer} ${className ?? ""}`} aria-hidden="true">
      {near && (
        <ParticleField
          count={count}
          color={color}
          accent={accent}
          reduce={!!reduce}
          active={onScreen}
        />
      )}
    </div>
  );
}
