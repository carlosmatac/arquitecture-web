import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useMediaQuery } from "../lib/smoothScroll";
import GeometricGrid from "./GeometricGrid";
import HeroDrawing from "./HeroDrawing";
import { EASE, MaskLines } from "./ui";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const desktop = useMediaQuery("(min-width: 1024px)");

  return (
    <section ref={ref} id="inicio" className="relative overflow-hidden">
      {desktop && (
        <motion.div
          style={{ y: gridY }}
          className="absolute right-0 top-[92px] w-[70vw] max-w-[1240px] pb-14 text-pizarra [mask-image:linear-gradient(to_right,rgba(0,0,0,0.3),#000_32%)]"
        >
          <GeometricGrid minImageCol={3} className="w-full" />
        </motion.div>
      )}

      <div className="min-h-[100svh] grid grid-cols-12 gap-x-6 gap-y-16 items-center px-5 md:px-10 pt-32 pb-8 lg:pt-28 lg:pb-16">
        <div className="col-span-12 lg:col-span-6 relative z-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="label text-pizarra/60 mb-8 flex items-center gap-3"
          >
            <span className="w-8 h-px bg-almagra" />
            Estudio de arquitectura · Granada, desde 1993
          </motion.p>
          <h1 className="font-serif font-normal tracking-[-0.025em] leading-[1.02] text-[13vw] sm:text-[9vw] lg:text-[5.3vw]">
            <MaskLines onMount delay={0.3} lines={["Arquitectura que", <>nace del <em className="text-almagra">lugar.</em></>]} />
          </h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.9 }}>
            <p className="mt-8 text-[17px] leading-relaxed text-pizarra/75 max-w-md">
              De la casa de pueblo en la Alpujarra al bloque de viviendas y el hotel en la ciudad. Proyectos que respetan la memoria
              del lugar y responden a la vida de hoy.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#obra" className="group inline-flex items-center gap-3 bg-pizarra text-cal px-6 py-4 label !text-[12px] hover:bg-almagra transition-colors duration-500">
                Ver la obra <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </a>
              <a href="#contacto" className="inline-flex items-center border border-pizarra/25 px-6 py-4 label !text-[12px] hover:border-pizarra transition-colors">
                Hablemos de su proyecto
              </a>
            </div>
          </motion.div>
        </div>

        {!desktop && (
          <div className="col-span-12 -mx-5 md:-mx-10 text-pizarra pb-6">
            <GeometricGrid columns={[3, 10]} minImageCol={3} className="w-full" />
          </div>
        )}
      </div>

      <div className="relative pb-10">
        <div className="flex justify-between px-5 md:px-10 pb-4 label text-pizarra/50">
          <span>Del pueblo a la ciudad</span>
          <span className="hidden sm:inline">37°10′36″ N — 3°36′02″ O</span>
        </div>
        <div className="md:px-10 overflow-hidden">
          <div className="w-[1100px] md:w-full animate-pan md:animate-none [--pan:calc(100vw-1100px)] [animation:pan_22s_ease-in-out_3.5s_infinite_alternate] md:[animation:none]">
            <HeroDrawing className="w-full h-auto text-pizarra" />
          </div>
        </div>
      </div>
    </section>
  );
}
