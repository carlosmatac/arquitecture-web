import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Fragment, useRef } from "react";
import { NasridStar, Reveal } from "./ui";

const typologies = [
  "Vivienda rural",
  "Rehabilitación",
  "Vivienda unifamiliar",
  "Bloques de viviendas",
  "Hoteles",
  "Equipamientos públicos",
  "Urbanismo",
];

export function Marquee() {
  const row = typologies.map((t) => (
    <Fragment key={t}>
      <span className="font-serif italic">{t}</span>
      <NasridStar className="w-5 h-5 md:w-7 md:h-7 text-almagra shrink-0" />
    </Fragment>
  ));
  return (
    <div className="relative border-y border-pizarra/15 py-6 md:py-8 overflow-hidden select-none" aria-label={typologies.join(", ")}>
      <div className="animate-marquee flex w-max items-center gap-8 md:gap-12 text-3xl md:text-5xl tracking-[-0.01em] [animation:marquee_40s_linear_infinite]">
        {row}
        {row}
      </div>
    </div>
  );
}

// From the studio's own words on the previous website
const text =
  "Nos interesa la arquitectura hecha a la medida del hombre: que se pueda construir, que se pueda costear, que se pueda mantener. Que se pueda disfrutar y, también, que sea *bella* y provoque *emociones.*";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const accent = word.startsWith("*");
  return (
    <motion.span style={{ opacity }} className={accent ? "italic text-almagra-claro" : ""}>
      {word.replaceAll("*", "")}{" "}
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.6"] });
  const words = text.split(" ");

  return (
    <section className="bg-pizarra text-cal px-5 md:px-10 py-32 md:py-48">
      <div className="grid grid-cols-12 gap-6">
        <Reveal className="col-span-12 md:col-span-3 label text-cal/50 flex items-center gap-3">
          <NasridStar className="w-4 h-4 text-almagra-claro" /> Manifiesto
        </Reveal>
        <div ref={ref} className="col-span-12 md:col-span-9">
          <p className="font-serif font-light text-[7.4vw] md:text-[3.9vw] leading-[1.12] tracking-[-0.02em]">
            {words.map((w, i) => (
              <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
            ))}
          </p>
          <Reveal className="mt-14 flex items-center gap-4 label text-cal/60">
            <span className="h-px w-12 bg-cal/40" />
            Andrés Mata Caro, arquitecto
          </Reveal>
        </div>
      </div>
    </section>
  );
}
