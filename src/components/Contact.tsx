import { MaskLines, Reveal, SectionLabel } from "./ui";

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
  return (
    <section id="contacto" className="bg-cal pb-28 md:pb-36">
      <div className="px-5 md:px-10 pt-28 md:pt-44">
        <SectionLabel index="05">Contacto</SectionLabel>
        <a href="mailto:andresmata@coagranada.org" className="group block mt-10">
          <h2 className="font-serif text-[11vw] md:text-[7.4vw] leading-[0.98] tracking-[-0.03em]">
            <MaskLines
              lines={[
                "Hablemos de",
                <>
                  <span className="text-almagra">su</span> proyecto
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

    </section>
  );
}
