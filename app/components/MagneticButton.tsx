"use client";

import { type ReactNode, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * A button/link that magnetically pulls toward the cursor while hovered.
 * Pointer position drives motion values directly (never React state) so it
 * runs off the main render cycle at 60fps. Collapses to a static link under
 * reduced motion. The inner content lags slightly behind for a layered feel.
 */
export function MagneticButton({
  href,
  children,
  className,
  strength = 0.4,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });
  // inner label lags a touch less than the shell for depth
  const ix = useTransform(sx, (v) => v * 0.4);
  const iy = useTransform(sy, (v) => v * 0.4);

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={reduce ? undefined : { x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
    >
      <motion.span
        style={reduce ? undefined : { x: ix, y: iy, display: "inline-flex", alignItems: "center", gap: "10px" }}
      >
        {children}
      </motion.span>
    </motion.a>
  );
}
