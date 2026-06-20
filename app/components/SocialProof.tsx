"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import styles from "./SocialProof.module.css";

// Real brand marks via Simple Icons CDN, rendered single-color for the dark theme.
// Logo wall = logos only, no category labels (per skill social-proof rules).
const LOGOS = [
  { slug: "trustpilot", name: "Trustpilot" },
  { slug: "carfax", name: "Carfax" },
  { slug: "visa", name: "Visa" },
  { slug: "mastercard", name: "Mastercard" },
  { slug: "googlepay", name: "Google Pay" },
  { slug: "applepay", name: "Apple Pay" },
];

const QUOTES = [
  {
    body: "Saw the rate before anyone called me. The car showed up two days later, spotless.",
    name: "Priya Raghavan",
    role: "Product designer",
    company: "Northwind Studio",
  },
  {
    body: "First time buying a car without the showroom dread. The whole thing felt honest.",
    name: "Marcus Bellweather",
    role: "Logistics lead",
    company: "Harbor Freight Co.",
  },
  {
    body: "Traded in my old wagon online, picked the Lumen, done by lunch. No haggling at all.",
    name: "Sofia Marchetti",
    role: "Architect",
    company: "Studio Vermillion",
  },
];

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 18 } },
};

export function SocialProof() {
  const reduce = useReducedMotion();
  const groupProps = {
    variants: group,
    initial: reduce ? ("show" as const) : ("hidden" as const),
    whileInView: "show" as const,
    viewport: { once: true, amount: 0.3 },
  };

  return (
    <section className={styles.section} aria-label="What owners say">
      <div className={styles.inner}>
        {/* trust logo strip */}
        <p className={styles.kicker}>Trusted by drivers and backed by names you know</p>
        <motion.div className={styles.logos} {...groupProps}>
          {LOGOS.map((l) => (
            <motion.span key={l.slug} className={styles.logo} variants={item}>
              {/* single-color mark, works on the dark theme */}
              <img
                src={`https://cdn.simpleicons.org/${l.slug}/a7adb8`}
                alt={l.name}
                width={92}
                height={28}
                loading="lazy"
              />
            </motion.span>
          ))}
        </motion.div>

        {/* testimonials */}
        <motion.div className={styles.quotes} {...groupProps}>
          {QUOTES.map((q) => (
            <motion.figure key={q.name} className={styles.quote} variants={item}>
              <blockquote className={styles.quoteBody}>{q.body}</blockquote>
              <figcaption className={styles.cite}>
                <span className={styles.citeName}>{q.name}</span>
                <span className={styles.citeRole}>{q.role}, {q.company}</span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
