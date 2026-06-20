"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import styles from "./Nav.module.css";

export function Nav() {
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const [condensed, setCondensed] = useState(false);

  // State transition: nav gains a backdrop + condenses once you leave the hero.
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 80;
    if (next !== condensed) setCondensed(next);
  });

  return (
    <motion.nav
      className={`${styles.nav} ${condensed ? styles.condensed : ""}`}
      initial={reduce ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
    >
      <div className={styles.inner}>
        <a className={styles.brand} href="#top" aria-label="Vanta Motors home">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 13l2-5a2 2 0 0 1 1.9-1.3h10.2A2 2 0 0 1 19 8l2 5" />
            <path d="M3 13h18v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1z" />
          </svg>
          Vanta Motors
        </a>

        <ul className={styles.links}>
          <li><a href="#featured">Inventory</a></li>
          <li><a href="#brands">Brands</a></li>
          <li><a href="#finance">Financing</a></li>
          <li><a href="#trade">How it works</a></li>
        </ul>

        <motion.a
          className={styles.cta}
          href="#featured"
          whileHover={reduce ? undefined : { y: -2 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          Browse Cars
        </motion.a>
      </div>

      {/* scroll progress indicator along the nav's bottom edge */}
      <motion.div
        className={styles.progress}
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
    </motion.nav>
  );
}
