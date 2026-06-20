"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import styles from "./Loader.module.css";

/**
 * Brief branded intro that masks initial load (hero video buffering, fonts,
 * first 3D chunk). Dismisses on window load or a short fallback timeout, so it
 * never traps the user. Under reduced motion it disappears almost immediately.
 */
export function Loader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) {
      const t = setTimeout(() => setDone(true), 150);
      return () => clearTimeout(t);
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      setDone(true);
    };
    // dismiss when the page has loaded, or after a 2s safety cap
    if (document.readyState === "complete") {
      const t = setTimeout(finish, 500);
      return () => clearTimeout(t);
    }
    window.addEventListener("load", finish, { once: true });
    const cap = setTimeout(finish, 2000);
    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(cap);
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className={styles.loader}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
        >
          <motion.div
            className={styles.mark}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 13l2-5a2 2 0 0 1 1.9-1.3h10.2A2 2 0 0 1 19 8l2 5" />
              <path d="M3 13h18v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1z" />
            </svg>
            <span className={styles.word}>Vanta Motors</span>
          </motion.div>
          {!reduce && (
            <div className={styles.barTrack}>
              <motion.div
                className={styles.bar}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
