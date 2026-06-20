"use client";

import { type ReactNode, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import styles from "./Featured.module.css";

const hoverLift = { hover: { y: -8 } } satisfies Variants;

/**
 * A featured card with cursor-reactive 3D tilt and a pointer-following
 * spotlight glare. Pointer position drives motion values directly (no state),
 * so it runs off the render loop. Falls back to the flat lift under reduced
 * motion. `variants` (card) drives the scroll-reveal; `layoutId` enables the
 * shared expand into the detail modal.
 */
export function TiltCard({
  id,
  variants,
  onOpen,
  ariaLabel,
  children,
}: {
  id: string;
  variants: Variants;
  onOpen: () => void;
  ariaLabel: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // -0.5..0.5 normalized pointer position within the card
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 250, damping: 20 });
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 250, damping: 20 });
  // glare position in %
  const gx = useTransform(px, [-0.5, 0.5], [0, 100]);
  const gy = useTransform(py, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.18), transparent 45%)`;

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.article
      ref={ref}
      layout
      layoutId={`card-${id}`}
      className={styles.card}
      variants={variants}
      exit={{ opacity: 0, scale: 0.92 }}
      whileHover={reduce ? undefined : "hover"}
      onClick={onOpen}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      style={
        reduce
          ? { cursor: "pointer", willChange: "transform" }
          : {
              cursor: "pointer",
              willChange: "transform",
              rotateX: rotX,
              rotateY: rotY,
              transformPerspective: 900,
              transformStyle: "preserve-3d",
            }
      }
    >
      <motion.div
        className={styles.cardLift}
        variants={reduce ? undefined : hoverLift}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {children}
      </motion.div>
      {!reduce && (
        <motion.span className={styles.glare} aria-hidden="true" style={{ background: glare }} />
      )}
    </motion.article>
  );
}
