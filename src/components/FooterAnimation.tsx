import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Hand-drawn "line boil": four redrawings of the same ink sketch (assets/animation/casa-dibujo-v2, frames 3–6)
 * shown in sequence, so the lines tremble, the figures walk and the chimney smokes.
 * Frames are cropped identically and exported as ink-on-transparent WebP (public/footer).
 */

const frames = [1, 2, 3, 4].map((n) => `/footer/casa-${n}.webp`);
const FRAME_MS = 170;

export default function FooterAnimation({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % frames.length), FRAME_MS);
    return () => clearInterval(id);
  }, [inView, reduce]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
      className={`relative aspect-[2400/759] ${className}`}
      role="img"
      aria-label="Boceto a tinta de una vivienda con pabellón acristalado, dos árboles y dos personas paseando"
    >
      <motion.div
        variants={{ hidden: { clipPath: "inset(0 100% 0 0)" }, shown: { clipPath: "inset(0 0% 0 0)" } }}
        transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
        className="absolute inset-0"
      >
        {frames.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            decoding="async"
            className="absolute inset-0 w-full h-full select-none pointer-events-none"
            style={{ visibility: i === frame ? "visible" : "hidden" }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
