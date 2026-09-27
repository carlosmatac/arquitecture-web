import { motion } from "motion/react";
import type { ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Headline whose lines slide up from behind a mask. */
export function MaskLines({
  lines,
  className = "",
  delay = 0,
  onMount = false,
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  onMount?: boolean;
}) {
  return (
    <motion.span
      className={`block ${className}`}
      initial="hidden"
      {...(onMount ? { animate: "shown" } : { whileInView: "shown", viewport: { once: true, margin: "-10%" } })}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pt-[0.14em] -mt-[0.14em] pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="block"
            variants={{ hidden: { y: "105%" }, shown: { y: "0%" } }}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Numbered section heading label, e.g. "02 — Estudio". */
export function SectionLabel({ index, children, className = "" }: { index: string; children: ReactNode; className?: string }) {
  return (
    <Reveal className={`label flex items-center gap-4 ${className}`}>
      <span className="opacity-50">{index}</span>
      <span className="h-px w-10 bg-current opacity-30" />
      <span>{children}</span>
    </Reveal>
  );
}

/** Eight-pointed star of Nasrid geometry, a quiet nod to Granada. */
export function NasridStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="5" y="5" width="14" height="14" />
        <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
      </g>
    </svg>
  );
}
