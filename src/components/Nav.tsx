import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { lockScroll } from "../lib/smoothScroll";
import Logo from "./Logo";
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

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["inicio", ...sections.map((s) => s.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const time = useGranadaTime();
  const active = useActiveSection();

  useEffect(() => lockScroll(open), [open]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        className="fixed top-0 inset-x-0 z-50 bg-cal border-b border-pizarra/10 text-pizarra"
      >
        <div className="flex h-16 md:h-[72px] items-center justify-between px-5 md:px-10">
          <a href="#inicio" className="block" aria-label="Andrés Mata · Arquitectura, inicio">
            <Logo className="h-8 md:h-9 w-auto" />
          </a>

          <nav className="hidden lg:flex items-center gap-10">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`relative text-[14px] tracking-wide transition-colors duration-300 hover:text-almagra ${active === s.id ? "text-almagra" : ""}`}
              >
                {s.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px w-full bg-almagra origin-left transition-transform duration-500 ease-[var(--ease-arch)] ${active === s.id ? "scale-x-100" : "scale-x-0"}`}
                />
              </a>
            ))}
          </nav>

          <span className="hidden lg:inline label !text-[10px] text-pizarra/55 tabular-nums">Granada {time}</span>

          <button onClick={() => setOpen(true)} className="lg:hidden label" aria-label="Abrir menú">
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
            className="fixed inset-0 z-[70] bg-pizarra text-cal flex flex-col px-5 py-6"
          >
            <div className="flex justify-between items-center">
              <Logo className="h-8 w-auto" />
              <button onClick={() => setOpen(false)} className="label" aria-label="Cerrar menú">
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
                    className="flex items-baseline justify-between py-3 font-serif text-[10vw] leading-none tracking-[-0.02em]"
                  >
                    {s.label}
                    <span className="text-xs opacity-50 tabular-nums">0{i + 1}</span>
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
