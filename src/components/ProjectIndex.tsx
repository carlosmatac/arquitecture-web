import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useState } from "react";
import { projectImageUrl, projects, type Category, type Project } from "../data/projects";
import { useMediaQuery } from "../lib/smoothScroll";
import { municipalityOf } from "../data/territory";
import { EASE, MaskLines } from "./ui";

const filters: ("Todos" | Category)[] = ["Todos", "Edificación", "Urbanismo"];
const INITIAL_ROWS = 8;
const count = (f: (typeof filters)[number]) => (f === "Todos" ? projects : projects.filter((p) => p.category === f)).length;

export default function ProjectIndex({ onOpen }: { onOpen: (p: Project) => void }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todos");
  const [hovered, setHovered] = useState<Project | null>(null);
  const [expanded, setExpanded] = useState(false);
  const canHover = useMediaQuery("(hover: hover) and (min-width: 768px)");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.6 });
  const y = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.6 });

  const filtered = filter === "Todos" ? projects : projects.filter((p) => p.category === filter);
  const list = expanded ? filtered : filtered.slice(0, INITIAL_ROWS);

  return (
    <section
      id="indice"
      className="px-5 md:px-10 py-28 md:py-40 border-t border-pizarra/15"
      onMouseMove={(e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <h2 className="font-serif text-[2.6rem] md:text-6xl leading-[1.02] tracking-[-0.025em]">
          <MaskLines lines={["Índice de", <span className="text-almagra">proyectos</span>]} />
        </h2>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`relative font-serif text-xl sm:text-2xl md:text-3xl transition-colors ${filter === f ? "text-pizarra" : "text-pizarra/35 hover:text-pizarra/70"}`}
            >
              {f}
              <sup className="text-[10px] ml-1 align-super tabular-nums">{count(f)}</sup>
              {filter === f && <motion.span layoutId="index-filter" className="absolute -bottom-1 left-0 right-0 h-px bg-pizarra" />}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-16 hidden md:grid grid-cols-12 gap-6 pb-4 label !text-[10px] text-pizarra/45 border-b border-pizarra/20">
        <span className="col-span-1">Nº</span>
        <span className="col-span-5">Proyecto</span>
        <span className="col-span-3">Municipio</span>
        <span className="col-span-3">Tipología</span>
      </div>

      <ul className="group/list mt-8 md:mt-0" onMouseLeave={() => setHovered(null)}>
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p, i) => (
            <motion.li
              layout
              key={p.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="border-b border-pizarra/15"
            >
              <button
                onClick={() => onOpen(p)}
                onMouseEnter={() => setHovered(p)}
                className="group w-full grid grid-cols-12 gap-x-6 gap-y-1 items-baseline py-5 md:py-6 text-left transition-opacity duration-300 md:group-hover/list:opacity-35 md:hover:!opacity-100"
              >
                <span className="col-span-2 md:col-span-1 text-xs text-pizarra/50 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="col-span-10 md:col-span-5 font-serif text-2xl md:text-[1.85rem] leading-tight tracking-[-0.01em] transition-transform duration-500 ease-[var(--ease-arch)] md:group-hover:translate-x-3">
                  {p.title}
                </span>
                <span className="col-start-3 col-span-10 md:col-start-auto md:col-span-3 text-[14px] text-pizarra/70">{municipalityOf(p)}</span>
                <span className="hidden md:flex col-span-3 justify-between text-[14px] text-pizarra/70">
                  {p.subcategory}
                  <span className="opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">↗</span>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {filtered.length > INITIAL_ROWS && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => {
              if (expanded) document.getElementById("indice")?.scrollIntoView({ behavior: "smooth" });
              setExpanded(!expanded);
            }}
            className="group inline-flex items-center gap-3 border border-pizarra/25 px-7 py-4 label !text-[12px] hover:bg-pizarra hover:text-cal hover:border-pizarra transition-colors duration-500"
          >
            {expanded ? "Ver menos" : `Ver todos los proyectos · ${filtered.length}`}
            <span className={`transition-transform duration-500 ${expanded ? "rotate-180" : "group-hover:translate-y-0.5"}`}>↓</span>
          </button>
        </div>
      )}

      {canHover && (
        <motion.div
          style={{ x, y }}
          className="pointer-events-none fixed left-0 top-0 z-40 -translate-x-1/2 -translate-y-[115%]"
          aria-hidden="true"
        >
          <AnimatePresence>
            {hovered && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="relative w-[300px] h-[210px] overflow-hidden bg-cal-2 shadow-2xl"
              >
                <AnimatePresence initial={false}>
                  <motion.img
                    key={hovered.slug}
                    src={projectImageUrl(hovered.images[0])}
                    alt=""
                    initial={{ clipPath: "inset(0 0 100% 0)" }}
                    animate={{ clipPath: "inset(0 0 0% 0)" }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="absolute inset-0 w-full h-full object-cover graded"
                  />
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
