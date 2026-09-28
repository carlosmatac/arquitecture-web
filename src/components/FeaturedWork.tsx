import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { projectImageUrl, projects, type Project } from "../data/projects";
import { useMediaQuery } from "../lib/smoothScroll";
import { MaskLines, Reveal, SectionLabel } from "./ui";

const featured = projects.filter((p) => p.featured);
const pad = (n: number) => String(n).padStart(2, "0");

function Card({ project, index, progress, onOpen }: { project: Project; index: number; progress?: MotionValue<number>; onOpen: (p: Project) => void }) {
  const fallback = useSpring(0);
  const imageX = useTransform(progress ?? fallback, [0, 1], ["6%", "-6%"]);
  const cover = project.images[0];
  return (
    <button
      onClick={() => onOpen(project)}
      className={`group shrink-0 text-left snap-start w-[82vw] sm:w-[60vw] lg:w-auto ${index % 2 ? "lg:self-end" : "lg:self-start"}`}
    >
      <div className="relative overflow-hidden bg-cal-2 aspect-[4/3] lg:aspect-auto lg:h-[56vh] lg:w-[74.6vh]">
        <motion.img
          style={progress ? { x: imageX } : undefined}
          src={projectImageUrl(cover)}
          alt={cover.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full max-w-none lg:w-[116%] lg:-left-[8%] object-cover graded transition-[filter,scale] duration-[1.2s] ease-[var(--ease-arch)] group-hover:[filter:none] group-hover:scale-[1.04]"
        />
        <span className="absolute left-4 top-4 label !text-[10px] text-cal bg-pizarra/75 backdrop-blur px-2 py-1">{pad(index + 1)}</span>
        {project.images.length > 1 && (
          <span className="absolute right-4 top-4 label !text-[10px] text-cal bg-pizarra/75 backdrop-blur px-2 py-1">{project.images.length} imágenes</span>
        )}
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className="font-serif text-3xl md:text-4xl leading-none">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_1px] bg-[position:0_100%] group-hover:bg-[length:100%_1px] transition-[background-size] duration-700 ease-[var(--ease-arch)]">
              {project.title}
            </span>
          </h3>
          <p className="mt-2 label !text-[10px] text-pizarra/55">
            {project.location} · {project.subcategory}
          </p>
        </div>
        <span className="font-serif text-3xl transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
      </div>
    </button>
  );
}

function Intro() {
  return (
    <div className="shrink-0 w-full lg:w-[34vw] lg:pr-10 flex flex-col justify-between lg:h-[70vh]">
      <div>
        <SectionLabel index="03">Obra</SectionLabel>
        <h2 className="mt-10 font-serif text-[2.6rem] md:text-6xl lg:text-[4.2vw] leading-[1.02] tracking-[-0.025em]">
          <MaskLines lines={["Obra", <em className="text-almagra">seleccionada</em>]} />
        </h2>
      </div>
      <Reveal className="mt-8 lg:mt-0 max-w-sm text-[15px] leading-relaxed text-pizarra/70">
        Viviendas en la Alpujarra y el Valle de Lecrín, bloques de viviendas, equipamientos públicos y planeamiento. Una selección
        de {featured.length} proyectos entre los {projects.length} publicados.
      </Reveal>
    </div>
  );
}

export default function FeaturedWork({ onOpen }: { onOpen: (p: Project) => void }) {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    if (!desktop || !trackRef.current) return;
    const measure = () => setDistance(trackRef.current!.scrollWidth - window.innerWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [desktop]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const current = useTransform(scrollYProgress, (v) => pad(Math.min(featured.length, Math.floor(v * featured.length) + 1)));

  if (!desktop) {
    return (
      <section id="obra" ref={sectionRef} className="py-28">
        <div className="px-5 md:px-10">
          <Intro />
        </div>
        <div className="mt-14 flex gap-5 overflow-x-auto snap-x snap-mandatory px-5 md:px-10 pb-4 scroll-px-5 [scrollbar-width:none]">
          {featured.map((p, i) => (
            <Card key={p.slug} project={p} index={i} onOpen={onOpen} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="obra" ref={sectionRef} style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <motion.div ref={trackRef} style={{ x }} className="flex gap-16 items-stretch w-max h-[78vh] pl-10 pr-[12vw]">
          <Intro />
          {featured.map((p, i) => (
            <Card key={p.slug} project={p} index={i} progress={scrollYProgress} onOpen={onOpen} />
          ))}
          <a href="#indice" className="group shrink-0 self-center w-[26vw] flex flex-col items-start gap-6">
            <span className="label text-pizarra/50">Índice completo</span>
            <span className="font-serif text-5xl leading-[1.02] tracking-[-0.02em]">
              Ver los {projects.length} <em className="text-almagra">proyectos</em>
            </span>
            <span className="font-serif text-5xl transition-transform duration-500 group-hover:translate-y-2">↓</span>
          </a>
        </motion.div>

        <div className="absolute bottom-8 inset-x-10 flex items-center gap-6 label !text-[10px] text-pizarra/60">
          <motion.span className="tabular-nums">{current}</motion.span>
          <div className="relative flex-1 h-px bg-pizarra/15">
            <motion.div style={{ scaleX: scrollYProgress }} className="absolute inset-0 bg-pizarra origin-left" />
          </div>
          <span>{pad(featured.length)}</span>
        </div>
      </div>
    </section>
  );
}
