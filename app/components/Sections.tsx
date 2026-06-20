"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { MagneticButton } from "./MagneticButton";
import { Background3D } from "./Background3D";
import { ChromeRing3D } from "./ChromeRing3D";
import { CountUp } from "./CountUp";
import styles from "./Sections.module.css";

// distinct heading gesture: a left-to-right clip wipe (not another fade)
const wipe: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0.4 },
  show: {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

// parent that staggers its children's reveal
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
// child item revealed by the group's stagger
const itemRise: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 110, damping: 18 } },
};

const STATS = [
  { value: 312, decimals: 0, suffix: "", label: "Cars in stock" },
  { value: 4.9, decimals: 1, suffix: "", label: "Owner rating" },
  { value: 48, decimals: 0, suffix: "h", label: "Avg. delivery" },
  { value: 0, decimals: 0, suffix: "", label: "Hidden fees" },
];

const STEPS = [
  { k: "Pick", body: "Browse the curated lineup and lock the one that fits." },
  { k: "Finance", body: "Get a transparent rate in minutes, no dealer markup." },
  { k: "Drive", body: "We deliver to your door, often within two days." },
];

export function Sections() {
  const reduce = useReducedMotion();

  // a parent that staggers its children into view
  const grouped = {
    variants: group,
    initial: reduce ? ("show" as const) : ("hidden" as const),
    whileInView: "show" as const,
    viewport: { once: true, amount: 0.3 },
  };

  // heading wipe (distinct from the body rise)
  const wipeReveal = {
    variants: wipe,
    initial: reduce ? ("show" as const) : ("hidden" as const),
    whileInView: "show" as const,
    viewport: { once: true, amount: 0.6 },
  };

  return (
    <>
      {/* Stats band: plain layout, no card boxes (high-density discipline) */}
      <section className={styles.stats} aria-label="By the numbers">
        {/* 3D chrome ring accent, offset to the right edge */}
        <ChromeRing3D className={styles.ringLayer} />
        <motion.div className={styles.statsInner} {...grouped}>
          {STATS.map((s) => (
            <motion.div key={s.label} className={styles.stat} variants={itemRise}>
              <span className={styles.statValue}>
                <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </span>
              <span className={styles.statLabel}>{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Financing: asymmetric split (different family from the grid above) */}
      <section id="finance" className={styles.finance}>
        <div className={styles.financeInner}>
          <motion.div className={styles.financeCopy} {...grouped}>
            <motion.h2 className={styles.h2} variants={wipe}>Financing without the fog.</motion.h2>
            <motion.p className={styles.lead} variants={itemRise}>
              See your real monthly number before you ever talk to a person.
              Pre-qualify in two minutes with no impact to your credit score.
            </motion.p>
            <motion.div variants={itemRise}>
              <MagneticButton href="#featured" className={styles.btnPrimary}>
                Check my rate
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
              </MagneticButton>
            </motion.div>
          </motion.div>

          <motion.div className={styles.rateCard} {...grouped}>
            <motion.span className={styles.rateLabel} variants={itemRise}>From</motion.span>
            <motion.span className={styles.rateValue} variants={itemRise}>4.2<span className={styles.pct}>% APR</span></motion.span>
            <motion.div className={styles.rateRow} variants={itemRise}><span>Term</span><span>24 - 72 mo</span></motion.div>
            <motion.div className={styles.rateRow} variants={itemRise}><span>Down payment</span><span>Flexible</span></motion.div>
            <motion.div className={styles.rateRow} variants={itemRise}><span>Approval</span><span>Same day</span></motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it works: 3 steps, vertical-numbered (yet another family) */}
      <section id="trade" className={styles.steps}>
        <div className={styles.stepsInner}>
          <motion.h2 className={styles.h2} {...wipeReveal}>How it works</motion.h2>
          <motion.div className={styles.stepGrid} {...grouped}>
            {STEPS.map((s) => (
              <motion.div key={s.k} className={styles.step} variants={itemRise}>
                <span className={styles.stepK}>{s.k}</span>
                <p className={styles.stepBody}>{s.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA band */}
      <section className={styles.cta}>
        <Background3D count={700} color="#8a8782" accent="#ff6a33" />
        <motion.div className={styles.ctaInner} {...grouped}>
          <motion.h2 className={styles.ctaTitle} variants={wipe}>Your next car is one scroll away.</motion.h2>
          <motion.div variants={itemRise}>
            <MagneticButton href="#featured" className={styles.btnPrimary}>
              Browse Cars
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </section>

      <footer id="about" className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footTop}>
            <div className={styles.footBrandCol}>
              <div className={styles.footBrand}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 13l2-5a2 2 0 0 1 1.9-1.3h10.2A2 2 0 0 1 19 8l2 5" />
                  <path d="M3 13h18v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1z" />
                </svg>
                Vanta Motors
              </div>
              <p className={styles.footTagline}>
                Hand-picked cars, transparent pricing, delivered to your door.
              </p>
            </div>

            <div className={styles.footCols}>
              <div className={styles.footCol}>
                <span className={styles.footColTitle}>Explore</span>
                <a href="#featured">Inventory</a>
                <a href="#brands">Brands</a>
                <a href="#finance">Financing</a>
                <a href="#trade">How it works</a>
              </div>
              <div className={styles.footCol}>
                <span className={styles.footColTitle}>Company</span>
                <a href="#about">About</a>
                <a href="#about">Careers</a>
                <a href="#about">Press</a>
                <a href="#about">Contact</a>
              </div>
              <div className={styles.footCol}>
                <span className={styles.footColTitle}>Support</span>
                <a href="#about">Help center</a>
                <a href="#about">Warranty</a>
                <a href="#about">Returns</a>
                <a href="#about">Privacy</a>
              </div>
            </div>
          </div>

          <div className={styles.footBottom}>
            <span className={styles.copy}>© {new Date().getFullYear()} Vanta Motors. All rights reserved.</span>
            <span className={styles.footMeta}>Built for people who like driving.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
