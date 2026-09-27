import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import HeroDrawing from "./HeroDrawing";
import { EASE, MaskLines } from "./ui";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const drawingY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section ref={ref} id="inicio" className="relative min-h-[100svh] flex flex-col overflow-hidden">
      <motion.div style={{ y: titleY, opacity: titleOpacity }} className="relative z-10 px-5 md:px-10 pt-28 md:pt-36">
        <div className="grid grid-cols-12 gap-x-6 items-end">
          <h1 className="col-span-12 lg:col-span-9 font-serif font-normal tracking-[-0.02em] leading-[0.88] text-[17vw] md:text-[12vw] lg:text-[8.8vw]">
            <MaskLines
              onMount
              delay={0.3}
              lines={[
                "Arquitectura",
                <>
                  <em className="text-almagra">que nace</em> del
                </>,
                "lugar.",
              ]}
            />
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.1 }}
            className="col-span-12 md:col-span-7 lg:col-span-3 mt-8 lg:mt-0 lg:pb-6"
          >
            <p className="text-[15px] leading-relaxed text-pizarra/75 max-w-sm">
              De la casa de pueblo en la Alpujarra al bloque de viviendas en la ciudad. Proyectos que respetan la memoria del
              lugar y responden a la vida de hoy.
            </p>
            <a href="#obra" className="group mt-6 inline-flex items-center gap-3 label">
              <span className="relative">
                Ver la obra
                <span className="absolute -bottom-1 left-0 h-px w-full bg-current origin-left transition-transform duration-500 group-hover:scale-x-0" />
              </span>
              <span className="transition-transform duration-500 group-hover:translate-y-1">↓</span>
            </a>
          </motion.div>
        </div>
      </motion.div>

      <motion.div style={{ y: drawingY }} className="relative mt-auto pt-8 overflow-hidden">
        <div className="flex justify-between px-5 md:px-10 pb-4 label text-pizarra/50">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
            Estudio desde 1993
          </motion.span>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="hidden sm:inline">
            37°10′36″ N — 3°36′02″ O
          </motion.span>
        </div>
        <div className="md:px-10">
          <div className="w-[1100px] md:w-full animate-pan md:animate-none [--pan:calc(100vw-1100px)] [animation:pan_22s_ease-in-out_3.5s_infinite_alternate] md:[animation:none]">
            <HeroDrawing className="w-full h-auto text-pizarra" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
