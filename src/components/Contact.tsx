import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { references } from "../data/references";
import { MaskLines, NasridStar, Reveal, SectionLabel } from "./ui";

const details = [
  {
    label: "Estudio",
    lines: ["Calle Buensuceso 1, 3º A", "18002 Granada"],
    href: "https://www.google.com/maps/search/?api=1&query=Calle+Buensuceso+1+18002+Granada",
    cta: "Cómo llegar",
  },
  { label: "Teléfono", lines: ["958 52 19 55", "616 47 94 46"], href: "tel:+34958521955", cta: "Llamar" },
  { label: "Correo", lines: ["andresmata@coagranada.org"], href: "mailto:andresmata@coagranada.org", cta: "Escribir" },
];

export default function Contact() {
  const footerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: footerRef, offset: ["start end", "end end"] });
  const wordmarkY = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);

  return (
    <footer id="contacto" className="bg-cal">
      <div className="px-5 md:px-10 pt-28 md:pt-44">
        <SectionLabel index="05">Contacto</SectionLabel>
        <a href="mailto:andresmata@coagranada.org" className="group block mt-10">
          <h2 className="font-serif text-[11vw] md:text-[7.4vw] leading-[0.98] tracking-[-0.03em]">
            <MaskLines
              lines={[
                "Hablemos de",
                <>
                  <em className="text-almagra">su</em> proyecto
                  <span className="inline-block ml-[0.15em] transition-transform duration-700 ease-[var(--ease-arch)] group-hover:translate-x-4 group-hover:-translate-y-4">
                    ↗
                  </span>
                </>,
              ]}
            />
          </h2>
        </a>

        <div className="mt-20 md:mt-28 grid md:grid-cols-3 border-t border-pizarra/20">
          {details.map((d, i) => (
            <Reveal key={d.label} delay={i * 0.08} className="border-b md:border-b-0 md:border-r last:border-r-0 border-pizarra/20 py-8 md:pr-8 [&:not(:first-child)]:md:pl-8">
              <span className="label text-pizarra/50 !text-[10px]">{d.label}</span>
              <div className="mt-4 text-lg md:text-xl leading-snug">
                {d.lines.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
              <a href={d.href} target={d.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="mt-6 inline-flex items-center gap-2 label !text-[10px] text-almagra hover:gap-4 transition-all">
                {d.cta} →
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      <div ref={footerRef} className="mt-24 bg-pizarra text-cal overflow-hidden">
        <div className="px-5 md:px-10 pt-10 flex flex-wrap gap-4 justify-between label !text-[10px] text-cal/50">
          <span className="flex items-center gap-3">
            <NasridStar className="w-3.5 h-3.5 text-almagra-claro" /> Arquitectura y urbanismo · Granada, desde 1993
          </span>
          <span>© {new Date().getFullYear()} Andrés Mata Caro</span>
        </div>
        <details className="px-5 md:px-10 pt-6 group">
          <summary className="label !text-[10px] text-cal/40 cursor-pointer hover:text-cal/70 transition-colors list-none">
            Créditos de las imágenes de referencia <span className="inline-block transition-transform group-open:rotate-45">+</span>
          </summary>
          <ul className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1.5 text-[12px] text-cal/50">
            {references.map((r) => (
              <li key={r.slug}>
                <a href={r.source} target="_blank" rel="noreferrer" className="hover:text-cal transition-colors">
                  {r.name}
                </a>{" "}
                — {r.author},{" "}
                <a href={r.licenseUrl} target="_blank" rel="noreferrer" className="underline decoration-cal/20 hover:text-cal">
                  {r.license}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] text-cal/35">Wikimedia Commons. Imágenes recortadas. Obras de otros autores mostradas como referencia.</p>
        </details>
        <motion.p
          style={{ y: wordmarkY }}
          className="font-serif whitespace-nowrap text-[19vw] leading-[0.8] tracking-[-0.04em] text-center pt-8 -mb-[3vw] select-none"
          aria-hidden="true"
        >
          Mata <em className="text-almagra-claro">Caro</em>
        </motion.p>
      </div>
    </footer>
  );
}
