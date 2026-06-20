"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import styles from "./Background3D.module.css";

// drei + three load lazily, only when the stats band nears the viewport.
const ChromeRing = dynamic(() => import("./ChromeRing"), { ssr: false });

/** Lazy chrome-ring centerpiece. Same mount/visibility discipline as Background3D. */
export function ChromeRing3D({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [near, setNear] = useState(false);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mountIO = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          mountIO.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
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
      {near && <ChromeRing reduce={!!reduce} active={onScreen} />}
    </div>
  );
}
