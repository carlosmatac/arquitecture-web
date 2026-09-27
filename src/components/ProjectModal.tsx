import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { projectImageUrl, type Project } from "../data/projects";
import { lockScroll } from "../lib/smoothScroll";
import { EASE } from "./ui";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [index, setIndex] = useState(0);
  const total = project?.images.length ?? 0;

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + total) % total), [total]);

  useEffect(() => setIndex(0), [project]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    lockScroll(true);
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [project, go, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="project-modal"
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="fixed inset-0 z-[60] bg-cal flex flex-col lg:flex-row"
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
          data-lenis-prevent
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 md:top-7 md:right-10 z-10 label bg-cal/80 backdrop-blur px-3 py-2 hover:text-almagra transition-colors"
            aria-label="Cerrar"
          >
            Cerrar ✕
          </button>

          <div className="relative flex-1 min-h-0 flex flex-col p-4 pt-16 md:p-10 md:pt-20">
            <div className="relative flex-1 min-h-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={project.images[index].file}
                  src={projectImageUrl(project.images[index])}
                  alt={project.images[index].alt}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="max-w-full max-h-full object-contain graded"
                />
              </AnimatePresence>

              {total > 1 && (
                <>
                  <button onClick={() => go(-1)} className="absolute left-0 inset-y-0 w-1/3 cursor-w-resize" aria-label="Imagen anterior" />
                  <button onClick={() => go(1)} className="absolute right-0 inset-y-0 w-1/3 cursor-e-resize" aria-label="Imagen siguiente" />
                </>
              )}
            </div>

            {total > 1 && (
              <div className="mt-5 flex items-center gap-5">
                <button onClick={() => go(-1)} className="font-serif text-2xl hover:text-almagra transition-colors" aria-label="Imagen anterior">
                  ←
                </button>
                <div className="overflow-x-auto flex-1">
                  <div className="flex gap-2 w-max mx-auto">
                    {project.images.map((image, i) => (
                      <button
                        key={image.file}
                        onClick={() => setIndex(i)}
                        className={`shrink-0 w-16 h-11 md:w-20 md:h-14 overflow-hidden transition-opacity ${i === index ? "opacity-100 outline outline-1 outline-offset-2 outline-pizarra" : "opacity-40 hover:opacity-80"}`}
                        aria-label={`Ver imagen ${i + 1}`}
                      >
                        <img src={projectImageUrl(image)} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => go(1)} className="font-serif text-2xl hover:text-almagra transition-colors" aria-label="Imagen siguiente">
                  →
                </button>
              </div>
            )}
          </div>

          <aside className="lg:w-[400px] shrink-0 border-t lg:border-t-0 lg:border-l border-pizarra/15 p-6 md:p-10 lg:pt-24 overflow-y-auto max-h-[38vh] lg:max-h-none">
            <span className="label text-almagra !text-[10px] block mb-5">
              {project.category} · {project.subcategory}
            </span>
            <h3 className="font-serif text-4xl lg:text-5xl leading-[0.95] tracking-[-0.01em] mb-4">{project.title}</h3>
            <p className="label !text-[10px] text-pizarra/55 mb-8">{project.location}</p>
            <p className="text-[15px] leading-relaxed text-pizarra/80">{project.description}</p>
            {total > 1 && (
              <p className="mt-10 pt-4 border-t border-pizarra/15 label !text-[10px] text-pizarra/50 flex justify-between gap-4">
                <span>{project.images[index].alt}</span>
                <span className="tabular-nums shrink-0">
                  {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
              </p>
            )}
          </aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
