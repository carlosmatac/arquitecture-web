import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { lockScroll } from "../lib/smoothScroll";
import { EASE } from "./ui";

export const sections = [
  { id: "estudio", label: "Estudio" },
  { id: "servicios", label: "Servicios" },
  { id: "obra", label: "Obra" },
  { id: "territorio", label: "Territorio" },
  { id: "contacto", label: "Contacto" },
];

function useGranadaTime() {
  const format = () =>
    new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 15_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const time = useGranadaTime();

  useEffect(() => lockScroll(open), [open]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.2 }}
        className="fixed top-0 inset-x-0 z-50 mix-blend-difference text-white"
      >
        <div className="flex items-start justify-between px-5 md:px-10 py-5 md:py-7">
          <a href="#inicio" className="group leading-none">
            <span className="font-serif text-[26px] md:text-[30px] tracking-tight block">Andrés Mata Caro</span>
            <span className="label !text-[10px] opacity-60 block mt-1">Arquitecto · Granada</span>
          </a>

          <nav className="hidden lg:flex items-center gap-9 pt-2">
            {sections.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} className="group relative text-[13px] tracking-wide">
                <span className="font-mono text-[10px] opacity-50 mr-1.5">0{i + 1}</span>
                {s.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-[var(--ease-arch)] group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
            <span className="label !text-[10px] opacity-60 tabular-nums">Granada {time}</span>
          </nav>

          <button onClick={() => setOpen(true)} className="lg:hidden label pt-2" aria-label="Abrir menú">
            Menú
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="fixed inset-0 z-[70] bg-pizarra text-cal flex flex-col px-5 py-5"
          >
            <div className="flex justify-between items-start">
              <span className="font-serif text-[26px]">Andrés Mata Caro</span>
              <button onClick={() => setOpen(false)} className="label pt-2" aria-label="Cerrar menú">
                Cerrar
              </button>
            </div>
            <nav className="mt-auto mb-10 flex flex-col">
              {sections.map((s, i) => (
                <div key={s.id} className="overflow-hidden border-t border-cal/15">
                  <motion.a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.06 }}
                    className="flex items-baseline justify-between py-3 font-serif text-[13vw] leading-none"
                  >
                    {s.label}
                    <span className="font-mono text-xs opacity-50">0{i + 1}</span>
                  </motion.a>
                </div>
              ))}
            </nav>
            <div className="label opacity-60 flex justify-between">
              <span>Granada {time}</span>
              <a href="tel:+34616479446">616 47 94 46</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
