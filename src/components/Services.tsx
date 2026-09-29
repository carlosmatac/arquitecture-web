import { MaskLines, Reveal, SectionLabel } from "./ui";

// Based on the service catalogue of the studio's previous website
const services = [
  {
    title: "Edificación",
    text: "Proyectos de obra nueva: vivienda unifamiliar, bloques de viviendas, hoteles, edificios comerciales, industriales y equipamientos públicos.",
    tags: ["Obra nueva", "Vivienda", "Hotelero", "Equipamientos"],
  },
  {
    title: "Rehabilitación",
    text: "Reforma y rehabilitación de edificios existentes, cambios de uso y conservación del patrimonio y la arquitectura tradicional.",
    tags: ["Reforma", "Cambio de uso", "Patrimonio"],
  },
  {
    title: "Urbanismo",
    text: "Planeamiento general, planes parciales y especiales, proyectos de urbanización y reparcelación para ayuntamientos y promotores.",
    tags: ["PGOU", "Planes parciales", "Urbanización"],
  },
  {
    title: "Asesoramiento",
    text: "Estudio previo a la compra de terrenos, legalizaciones y expedientes de AFO, informes periciales, tasaciones y trámites con la Administración.",
    tags: ["Terrenos", "Legalización", "AFO", "Peritajes"],
  },
  {
    title: "Dirección de obra",
    text: "Seguimiento y control de la ejecución, licitación, adjudicación y liquidación. El momento en que el proyecto se hace realidad.",
    tags: ["Supervisión", "Licitación", "Liquidación"],
  },
];

export default function Services() {
  return (
    <section id="servicios" className="bg-cal-2 px-5 md:px-10 py-28 md:py-44">
      <div className="grid grid-cols-12 gap-6 items-end">
        <div className="col-span-12 lg:col-span-7">
          <SectionLabel index="02">Servicios</SectionLabel>
          <h2 className="mt-10 font-serif text-[2.6rem] md:text-6xl lg:text-[4.2vw] leading-[1.02] tracking-[-0.025em]">
            <MaskLines lines={["Del primer croquis", <><span className="text-almagra">a la última</span> piedra.</>]} />
          </h2>
        </div>
        <Reveal className="col-span-12 lg:col-span-4 lg:col-start-9 text-[15px] leading-relaxed text-pizarra/75">
          Apoyo profesional en todas las fases de su proyecto, desde el asesoramiento previo sobre el terreno hasta la dirección
          de la obra terminada.
        </Reveal>
      </div>

      <ul className="mt-20 border-b border-pizarra/20">
        {services.map((s, i) => (
          <li key={s.title} className="group relative border-t border-pizarra/20 overflow-hidden">
            <span className="absolute inset-0 bg-pizarra origin-bottom scale-y-0 transition-transform duration-700 ease-[var(--ease-arch)] group-hover:scale-y-100" />
            <Reveal className="relative grid grid-cols-12 gap-x-6 gap-y-3 py-8 md:py-10 transition-colors duration-500 group-hover:text-cal">
              <span className="col-span-2 md:col-span-1 text-xs pt-3 opacity-60 tabular-nums">0{i + 1}</span>
              <h3 className="col-span-10 md:col-span-4 font-serif text-4xl md:text-5xl leading-none tracking-[-0.02em] transition-transform duration-700 ease-[var(--ease-arch)] group-hover:translate-x-3">
                {s.title}
              </h3>
              <p className="col-span-12 md:col-span-4 md:col-start-6 text-[15px] leading-relaxed opacity-75">{s.text}</p>
              <div className="col-span-12 md:col-span-3 flex flex-wrap md:justify-end gap-2 content-start">
                {s.tags.map((t) => (
                  <span key={t} className="label !text-[10px] border border-current/25 rounded-full px-3 py-1 opacity-70">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
