"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type Variants,
} from "motion/react";
import styles from "./Brands.module.css";

const BRANDS = [
  "Toyota", "Honda", "Kia", "Hyundai",
  "Suzuki", "BMW", "Audi", "Volkswagen",
  "Porsche", "Volvo", "Mazda", "Nissan",
  "Subaru", "Peugeot", "Renault", "Tesla",
];

const slug = (name: string) => name.toLowerCase().replace(/\s+/g, "");

// deterministic pseudo-random scatter offset per tile (stable across renders)
function scatter(i: number) {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12733.1234;
  const rx = (a - Math.floor(a)) * 2 - 1; // -1..1
  const ry = (b - Math.floor(b)) * 2 - 1;
  return { x: rx * 240, y: -180 - Math.abs(ry) * 160, rot: rx * 30 };
}

const container: Variants = {
  scattered: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  aligned: { transition: { staggerChildren: 0.05 } },
};

function tileVariants(i: number): Variants {
  const s = scatter(i);
  return {
    scattered: {
      x: s.x,
      y: s.y,
      rotate: s.rot,
      opacity: 0,
      transition: { type: "spring", stiffness: 200, damping: 22 },
    },
    aligned: {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 24 },
    },
  };
}

export function Brands() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [aligned, setAligned] = useState(false);

  // Direction-aware trigger: scrolling down past the entry point ALIGNS the
  // tiles; scrolling back up past it SCATTERS them. The animation then plays
  // out on its own spring timing, independent of scroll speed.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.25"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // hysteresis so it doesn't flicker right at the threshold
    if (!aligned && p > 0.55) setAligned(true);
    else if (aligned && p < 0.25) setAligned(false);
  });

  // If the section starts already in view (reload mid-page), align it.
  useEffect(() => {
    if (scrollYProgress.get() > 0.55) setAligned(true);
  }, [scrollYProgress]);

  return (
    <section id="brands" ref={ref} className={styles.section} aria-label="Browse by brand">
      <div className={styles.inner}>
        <motion.h2
          className={styles.title}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Browse by brand
        </motion.h2>

        <motion.div
          className={styles.grid}
          variants={container}
          animate={reduce ? "aligned" : aligned ? "aligned" : "scattered"}
          initial={reduce ? "aligned" : "scattered"}
        >
          {BRANDS.map((name, i) => (
            <motion.a
              key={name}
              href="#featured"
              className={styles.tile}
              variants={reduce ? undefined : tileVariants(i)}
              whileHover={reduce ? undefined : { y: -6, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className={styles.logoWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://cdn.simpleicons.org/${slug(name)}/f2f4f8`}
                  alt={`${name} logo`}
                  width={40}
                  height={40}
                  loading="lazy"
                />
              </span>
              <span className={styles.name}>{name}</span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
