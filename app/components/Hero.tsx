"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { MagneticButton } from "./MagneticButton";
import styles from "./Hero.module.css";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

// blur-up word reveal for the headline (storytelling: the message assembles)
const word: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 120, damping: 20, mass: 0.5 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 18, mass: 0.6 },
  },
};

export function Hero() {
  const reduce = useReducedMotion();
  const motionProps = reduce
    ? { initial: "show" as const, animate: "show" as const }
    : { initial: "hidden" as const, animate: "show" as const };

  return (
    <section className={styles.hero}>
      {/* legibility gradient sits ONLY at the very bottom, under the text,
          so the car animation itself stays clean and uncovered */}
      <div className={styles.footFade} aria-hidden="true" />

      <motion.div className={styles.content} variants={container} {...motionProps}>
        <h1 className={styles.headline} aria-label="Drive worth it.">
          <motion.span className={styles.word} variants={word}>Drive</motion.span>{" "}
          <motion.span className={`${styles.word} ${styles.accentWord}`} variants={word}>
            <em>worth it.</em>
          </motion.span>
        </h1>
        <motion.div variants={item} className={styles.ctaWrap}>
          <MagneticButton href="#featured" className={styles.cta}>
            Browse Cars
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
            </svg>
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
