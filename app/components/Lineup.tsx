"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import styles from "./Lineup.module.css";

const IMG_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MjAiIGhlaWdodD0iNDgwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTYxODFjIi8+PC9zdmc+";
const img = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`;

const PANELS = [
  { kicker: "01", title: "Engineered to be felt", photo: "photo-1492144534655-ae79c964c9d7", copy: "Every chassis is tuned on the same roads you drive, not a lab bench." },
  { kicker: "02", title: "Silent when you want it", photo: "photo-1549317661-bd32c8ce0db2", copy: "Our EVs deliver instant torque and a cabin quiet enough to hear yourself think." },
  { kicker: "03", title: "Built for the long haul", photo: "photo-1494976388531-d1058494cdd8", copy: "All-wheel confidence, year-round, with the range to disappear for the weekend." },
  { kicker: "04", title: "Yours in two days", photo: "photo-1503376780353-7e6692767b70", copy: "Pick it, finance it, and we deliver to your door. No showroom, no pressure." },
];

export function Lineup() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  // pan the track from 0 to the overflow width (panels - 1 viewport-ish)
  const xRaw = useTransform(scrollYProgress, [0, 1], ["2%", "-78%"]);
  const x = useSpring(xRaw, { stiffness: 90, damping: 26, mass: 0.5 });

  // Reduced motion: render a plain vertical-stacked, scrollable section instead.
  if (reduce) {
    return (
      <section className={styles.fallback} aria-label="The lineup">
        <h2 className={styles.heading}>The lineup</h2>
        <div className={styles.stack}>
          {PANELS.map((p) => (
            <article key={p.kicker} className={styles.panel}>
              <div className={styles.panelPhoto}>
                <Image src={img(p.photo, 900)} alt={p.title} fill sizes="100vw" className={styles.img} placeholder="blur" blurDataURL={IMG_BLUR} />
              </div>
              <div className={styles.panelText}>
                <span className={styles.kicker}>{p.kicker}</span>
                <h3 className={styles.panelTitle}>{p.title}</h3>
                <p className={styles.panelCopy}>{p.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    // tall wrapper provides the scroll distance for the pin
    <section ref={wrapRef} className={styles.wrap} aria-label="The lineup">
      <div className={styles.sticky}>
        <div className={styles.headingRow}>
          <h2 className={styles.heading}>The lineup</h2>
          <span className={styles.hint}>Keep scrolling</span>
        </div>
        <motion.div className={styles.track} style={{ x }}>
          {PANELS.map((p) => (
            <article key={p.kicker} className={styles.panel}>
              <div className={styles.panelPhoto}>
                <Image src={img(p.photo, 1100)} alt={p.title} fill sizes="(max-width: 760px) 90vw, 60vw" className={styles.img} placeholder="blur" blurDataURL={IMG_BLUR} />
                <div className={styles.panelOverlay} />
                <div className={styles.panelText}>
                  <span className={styles.kicker}>{p.kicker}</span>
                  <h3 className={styles.panelTitle}>{p.title}</h3>
                  <p className={styles.panelCopy}>{p.copy}</p>
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
