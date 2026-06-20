"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Loader } from "./Loader";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Featured } from "./Featured";
import { Brands } from "./Brands";
import { Lineup } from "./Lineup";
import { SocialProof } from "./SocialProof";
import { Sections } from "./Sections";
import styles from "./ScrollStage.module.css";

/**
 * Owns ONE shared car video. It starts full-bleed behind the hero, then as the
 * user scrolls it shrinks and flies into the highlighted product card slot in
 * the Featured section. Scroll progress drives motion values directly (never
 * React state) so it stays at 60fps and re-renders nothing.
 */
export function ScrollStage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  // Geometry of the target card slot, measured in viewport units.
  const [slot, setSlot] = useState({ top: 0, left: 0, width: 0, height: 0 });
  // Viewport, measured client-side so transforms never use stale SSR defaults.
  const [vp, setVp] = useState({ w: 1440, h: 900 });
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    const el = slotRef.current;
    const v = videoRef.current;

    const measure = () => {
      setVp({ w: window.innerWidth, h: window.innerHeight });
      if (!el) return;
      const r = el.getBoundingClientRect();
      setSlot({
        top: r.top + window.scrollY,
        left: r.left,
        width: r.width,
        height: r.height,
      });
      setMeasured(true);
    };
    measure();

    // Robust alignment: re-measure on resize AND whenever the slot's box
    // changes (font load, image reflow, layout shift).
    window.addEventListener("resize", measure);
    const ro = el ? new ResizeObserver(measure) : null;
    if (el && ro) ro.observe(el);
    const t = setTimeout(measure, 300);

    // Continuous, smooth playback at native framerate. The scroll only drives
    // the shrink-into-card morph below, never the video frames.
    if (v) {
      v.loop = true;
      v.play().catch(() => {});
    }

    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
      clearTimeout(t);
    };
  }, []);

  const vh = vp.h;
  const vw = vp.w;

  // Raw page scroll in pixels. The morph runs over the distance between the top
  // of the page and the moment the slot is comfortably in view.
  const { scrollY } = useScroll();
  // distance scrolled when the slot's top reaches ~22% down the viewport.
  const end = Math.max(1, (slot.top || vh * 1.4) - vh * 0.22);
  const raw = useTransform(scrollY, [0, end], [0, 1], { clamp: true });
  const p = useSpring(raw, { stiffness: 130, damping: 28, mass: 0.5 });

  // Under reduced motion, keep gentle looping playback (already set above).
  useEffect(() => {
    const v = videoRef.current;
    if (v && reduce) {
      v.loop = true;
      v.play().catch(() => {});
    }
  }, [reduce]);

  const range = [0, 1];
  const width = useTransform(p, range, [vw, slot.width || vw * 0.42]);
  const height = useTransform(p, range, [vh, slot.height || vh * 0.5]);
  const left = useTransform(p, range, [0, slot.left || vw * 0.29]);
  // Fixed layer: on-screen top of the slot = its document top minus current
  // scroll. At p=1 we've scrolled `end`px, so the slot sits at slot.top - end.
  const top = useTransform(p, range, [0, (slot.top || vh) - end]);
  const radius = useTransform(p, range, [0, 16]);

  // ---- Exhaust smoke trail (tracks the shrinking car) ----------------------
  // The trail sits centered horizontally on the car and just below its bottom
  // edge, so it reads as exhaust the car is leaving behind as it flies in.
  const trailX = useTransform([left, width], ([l, w]: number[]) => l + w / 2);
  const trailY = useTransform([top, height], ([t, h]: number[]) => t + h * 0.92);
  // Intensity ramps up as the morph starts and fades as it settles into the card.
  const trailOpacity = useTransform(p, [0, 0.12, 0.7, 1], [0, 0.9, 0.7, 0]);
  const trailScale = useTransform(p, [0, 0.5, 1], [0.6, 1.1, 0.7]);

  // If reduced motion, pin the video fullscreen and skip the morph.
  const style = reduce
    ? { top: 0, left: 0, width: "100vw", height: "100vh", borderRadius: 0 }
    : { top, left, width, height, borderRadius: radius };

  return (
    <div ref={wrapRef} id="top" className={styles.stage}>
      <Loader />
      <Nav />

      {/* exhaust trail behind the car during the fly-in (skipped if reduced) */}
      {!reduce && (
        <motion.div
          className={styles.trail}
          aria-hidden="true"
          style={{ x: trailX, y: trailY, opacity: trailOpacity, scale: trailScale }}
        >
          <span className={`${styles.trailPuff} ${styles.tp1}`} />
          <span className={`${styles.trailPuff} ${styles.tp2}`} />
          <span className={`${styles.trailPuff} ${styles.tp3}`} />
        </motion.div>
      )}

      <motion.div
        className={styles.shared}
        style={style as never}
        initial={{ opacity: 0 }}
        animate={{ opacity: measured || reduce ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <video
          ref={videoRef}
          className={styles.video}
          muted
          playsInline
          preload="auto"
        >
          <source src="/car.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <Hero />
      <Featured slotRef={slotRef} />
      <Brands />
      <Lineup />
      <SocialProof />
      <Sections />
    </div>
  );
}
