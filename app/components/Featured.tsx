"use client";

import { type RefObject, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { TiltCard } from "./TiltCard";
import styles from "./Featured.module.css";

type Car = {
  id: string;
  name: string;
  trim: string;
  price: string;
  priceNum: number;
  spec: string;
  body: "Coupe" | "EV" | "Roadster" | "SUV";
  photo: string; // Unsplash photo id, "" for the video-slot car
  blurb: string;
  highlight?: boolean;
};

const IMG_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MjAiIGhlaWdodD0iNDgwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTYxODFjIi8+PC9zdmc+";

// real car photography (free, direct Unsplash CDN URLs, no API key)
const carImg = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

const CARS: Car[] = [
  { id: "velar-gt", name: "Velar GT", trim: "Twin-Turbo V6", price: "$74,900", priceNum: 74900, spec: "0-60 in 3.9s", body: "Coupe", photo: "photo-1503376780353-7e6692767b70", blurb: "A grand tourer that turns the daily commute into the best part of the day." },
  // the highlighted card is the slot the hero car flies into:
  { id: "apex-rs", name: "Apex RS", trim: "Track Edition", price: "$112,500", priceNum: 112500, spec: "612 hp", body: "Coupe", photo: "", blurb: "Track-bred aero, carbon everywhere, and 612 horses on tap.", highlight: true },
  { id: "lumen-ev", name: "Lumen EV", trim: "Long Range", price: "$58,200", priceNum: 58200, spec: "412 mi range", body: "EV", photo: "photo-1549317661-bd32c8ce0db2", blurb: "412 miles of silent range and a cabin that charges as fast as you do." },
  { id: "onyx-coupe", name: "Onyx Coupe", trim: "Blackout", price: "$89,400", priceNum: 89400, spec: "0-60 in 3.4s", body: "Coupe", photo: "photo-1552519507-da3b142c6e3d", blurb: "Murdered-out from grille to diffuser, with the pace to back up the look." },
  { id: "sable-roadster", name: "Sable Roadster", trim: "Convertible", price: "$96,750", priceNum: 96750, spec: "577 hp", body: "Roadster", photo: "photo-1583121274602-3e2820c69888", blurb: "Drop the top, drop your jaw. A roadster tuned for open roads." },
  { id: "helix-sport", name: "Helix Sport", trim: "AWD", price: "$67,300", priceNum: 67300, spec: "0-60 in 4.1s", body: "SUV", photo: "photo-1494976388531-d1058494cdd8", blurb: "All-wheel-drive confidence with sports-car reflexes underneath." },
];

const BODIES = ["All", "Coupe", "EV", "Roadster", "SUV"] as const;
type Sort = "featured" | "price-asc" | "price-desc";

const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const card: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 18 } },
};
const arrow = { hover: { opacity: 1, x: 0 } } satisfies Variants;

export function Featured({ slotRef }: { slotRef: RefObject<HTMLDivElement | null> }) {
  const reduce = useReducedMotion();
  const [body, setBody] = useState<(typeof BODIES)[number]>("All");
  const [sort, setSort] = useState<Sort>("featured");
  const [openId, setOpenId] = useState<string | null>(null);

  // Parallax: the smoke drifts slower than the page for a sense of depth.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smokeY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-60, 90]);

  const visible = useMemo(() => {
    let list = CARS.filter((c) => body === "All" || c.body === body);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.priceNum - b.priceNum);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.priceNum - a.priceNum);
    return list;
  }, [body, sort]);

  const openCar = CARS.find((c) => c.id === openId) || null;

  return (
    <section id="featured" ref={sectionRef} className={styles.section}>
      {/* smoke layer surrounding all the cards (parallax drift on scroll) */}
      <motion.div className={styles.smoke} style={{ y: smokeY }} aria-hidden="true">
        <span className={`${styles.puff} ${styles.p1}`} />
        <span className={`${styles.puff} ${styles.p2}`} />
        <span className={`${styles.puff} ${styles.p3}`} />
        <span className={`${styles.puff} ${styles.p4}`} />
        <span className={`${styles.puff} ${styles.p5}`} />
      </motion.div>

      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 className={styles.title}>Featured cars</h2>

          {/* filter / sort bar */}
          <div className={styles.controls}>
            <div className={styles.filters} role="group" aria-label="Filter by body type">
              {BODIES.map((b) => (
                <button
                  key={b}
                  type="button"
                  className={`${styles.chip} ${body === b ? styles.chipOn : ""}`}
                  aria-pressed={body === b}
                  onClick={() => setBody(b)}
                >
                  {b}
                </button>
              ))}
            </div>
            <label className={styles.sort}>
              <span className={styles.srOnly}>Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </label>
          </div>
        </div>

        <motion.div
          className={styles.grid}
          variants={grid}
          initial={reduce ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <AnimatePresence mode="popLayout">
            {visible.map((c) =>
              c.highlight ? (
                <motion.article
                  key={c.id}
                  layout
                  className={`${styles.card} ${styles.slotCard}`}
                  variants={card}
                  exit={{ opacity: 0, scale: 0.92 }}
                >
                  <div ref={slotRef} className={styles.slot} aria-hidden="true" />
                  <div className={styles.meta}>
                    <motion.span
                      className={styles.badge}
                      animate={reduce ? undefined : { opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      In the spotlight
                    </motion.span>
                    <h3 className={styles.name}>{c.name}</h3>
                    <p className={styles.trim}>{c.trim} · {c.spec}</p>
                    <p className={styles.price}>{c.price}</p>
                  </div>
                </motion.article>
              ) : (
                <TiltCard
                  key={c.id}
                  id={c.id}
                  variants={card}
                  onOpen={() => setOpenId(c.id)}
                  ariaLabel={`View ${c.name} ${c.trim}`}
                >
                  <motion.div layoutId={`photo-${c.id}`} className={styles.photo}>
                    <Image
                      src={carImg(c.photo, 720)}
                      alt={`${c.name} ${c.trim}`}
                      fill
                      sizes="(max-width: 600px) 100vw, (max-width: 980px) 50vw, 33vw"
                      className={styles.photoImg}
                      placeholder="blur"
                      blurDataURL={IMG_BLUR}
                    />
                  </motion.div>
                  <div className={styles.meta}>
                    <div className={styles.metaHead}>
                      <h3 className={styles.name}>{c.name}</h3>
                      <motion.span className={styles.arrow} variants={reduce ? undefined : arrow} aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
                      </motion.span>
                    </div>
                    <p className={styles.trim}>{c.trim} · {c.spec}</p>
                    <p className={styles.price}>{c.price}</p>
                  </div>
                </TiltCard>
              )
            )}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 && (
          <motion.div
            className={styles.empty}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className={styles.emptyTitle}>No {body.toLowerCase()} models in stock right now.</p>
            <button type="button" className={styles.chip} onClick={() => setBody("All")}>
              Clear filter
            </button>
          </motion.div>
        )}
      </div>

      {/* detail modal with shared-element (layoutId) expand */}
      <AnimatePresence>
        {openCar && (
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenId(null)}
          >
            <motion.div
              layoutId={`card-${openCar.id}`}
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-label={`${openCar.name} details`}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div layoutId={`photo-${openCar.id}`} className={styles.modalPhoto}>
                <Image
                  src={carImg(openCar.photo, 1280)}
                  alt={`${openCar.name} ${openCar.trim}`}
                  fill
                  sizes="(max-width: 760px) 100vw, 760px"
                  className={styles.photoImg}
                  placeholder="blur"
                  blurDataURL={IMG_BLUR}
                />
              </motion.div>
              <motion.div
                className={styles.modalBody}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { delay: reduce ? 0 : 0.12 } }}
                exit={{ opacity: 0 }}
              >
                <button className={styles.close} onClick={() => setOpenId(null)} aria-label="Close">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
                <span className={styles.modalBadge}>{openCar.body}</span>
                <h3 className={styles.modalName}>{openCar.name}</h3>
                <p className={styles.modalTrim}>{openCar.trim} · {openCar.spec}</p>
                <p className={styles.modalBlurb}>{openCar.blurb}</p>
                <div className={styles.modalFoot}>
                  <span className={styles.modalPrice}>{openCar.price}</span>
                  <a className={styles.modalCta} href="#finance" onClick={() => setOpenId(null)}>
                    Check my rate
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
