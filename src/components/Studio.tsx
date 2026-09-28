import { animate, motion, useInView, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { municipalities } from "../data/territory";
import { EASE, MaskLines, Reveal, SectionLabel } from "./ui";

const FOUNDED = 1993;

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 2, ease: EASE, onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to]);
  return <span ref={ref}>{value}</span>;
}

const team = [
  { name: "Andrés Carlos Mata Caro", role: "Arquitecto" },
  { name: "Javier Sánchez Pineda", role: "Arquitecto técnico" },
  { name: "José García Vargas", role: "Técnico superior en proyectos de edificación" },
];

const collaborators = [
  { name: "Rubén Yeste Martín", role: "Ingeniero de caminos, canales y puertos" },
  { name: "José Luis Martínez Fajardo", role: "Geógrafo · consultor ambiental" },
  { name: "Carlos Sánchez Tarifa", role: "Arqueólogo" },
  { name: "José Solana Jiménez", role: "Topógrafo · arquitecto técnico" },
];

export default function Studio() {
  const years = new Date().getFullYear() - FOUNDED;
  const photoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="estudio" className="px-5 md:px-10 py-28 md:py-44">
      <SectionLabel index="01">Estudio</SectionLabel>

      <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-16">
        <div className="col-span-12 md:col-span-5 lg:col-span-4">
          <motion.div ref={photoRef} initial="hidden" whileInView="shown" viewport={{ once: true, margin: "-15%" }} className="relative aspect-[4/5]">
            <motion.div
              variants={{ hidden: { clipPath: "inset(100% 0 0 0)" }, shown: { clipPath: "inset(0% 0 0 0)" } }}
              transition={{ duration: 1.4, ease: EASE }}
              className="absolute inset-0 overflow-hidden bg-cal-2"
            >
              <motion.img
                style={{ y: photoY }}
                src="/andres.jpg"
                alt="Andrés Mata Caro, arquitecto"
                loading="lazy"
                className="absolute inset-0 w-full h-[116%] -top-[8%] object-cover object-top graded"
              />
            </motion.div>
          </motion.div>
          <div className="mt-4 flex justify-between label text-pizarra/60">
            <span>Andrés Mata Caro</span>
            <span>Arquitecto · COA Granada</span>
          </div>
        </div>

        <div className="col-span-12 md:col-span-7 lg:col-start-6">
          <h2 className="font-serif text-[2.6rem] md:text-6xl lg:text-[4.2vw] leading-[1.02] tracking-[-0.025em]">
            <MaskLines lines={[<>{years} años <em className="text-almagra">haciendo</em></>, "arquitectura en Granada."]} />
          </h2>

          <div className="mt-12 grid sm:grid-cols-2 gap-8 text-[15px] leading-relaxed text-pizarra/75 max-w-3xl">
            <Reveal>
              El estudio se funda en {FOUNDED} y acumula una dilatada experiencia en la redacción, tramitación y ejecución de todo
              tipo de proyectos, tanto de edificación como de urbanismo, contando con un equipo pluridisciplinar de arquitectos,
              ingenieros, geógrafos y topógrafos.
            </Reveal>
            <Reveal delay={0.1}>
              Nuestro trabajo no termina al entregar el proyecto: ese es el momento en que empieza a materializarse lo proyectado.
              La dirección de obra es la hora de la verdad, y acompañamos al cliente en ella.
            </Reveal>
          </div>

          <div className="mt-16 grid grid-cols-3 border-t border-pizarra/15">
            {[
              { value: FOUNDED, label: "Año de fundación", static: true },
              { value: years, label: "Años de oficio" },
              { value: municipalities.length, label: "Municipios con obra" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="pt-6 pr-4 border-r border-pizarra/15 last:border-r-0 [&:not(:first-child)]:pl-4 md:[&:not(:first-child)]:pl-8">
                <span className="font-serif text-5xl md:text-7xl leading-none tabular-nums block">
                  {s.static ? s.value : <Counter to={s.value} />}
                </span>
                <span className="label text-pizarra/55 mt-3 block !text-[10px] md:!text-[11px]">{s.label}</span>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid sm:grid-cols-2 gap-10">
            {[
              { title: "Equipo", people: team },
              { title: "Colaboran", people: collaborators },
            ].map((group) => (
              <Reveal key={group.title}>
                <h3 className="label text-almagra mb-4">{group.title}</h3>
                <ul>
                  {group.people.map((p) => (
                    <li key={p.name} className="py-3 border-t border-pizarra/10">
                      <span className="block text-[15px]">{p.name}</span>
                      <span className="block text-[13px] text-pizarra/55">{p.role}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
