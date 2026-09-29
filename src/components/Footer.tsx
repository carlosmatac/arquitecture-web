import { references } from "../data/references";
import FooterAnimation from "./FooterAnimation";
import Logo from "./Logo";
import { sections } from "./Nav";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-cal to-cal-2 border-t border-pizarra/15">
      <div className="px-5 md:px-10 pt-12 grid grid-cols-2 md:grid-cols-3 gap-y-10 items-start">
        <nav className="flex flex-col gap-1.5 text-[15px]">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="w-fit hover:text-almagra transition-colors">
              {s.label}
            </a>
          ))}
        </nav>

        <div className="order-first col-span-2 md:order-none md:col-span-1 flex flex-col items-center text-center">
          <Logo className="h-12 md:h-14 w-auto" />
          <p className="mt-4 text-[13px] text-pizarra/60">
            © {new Date().getFullYear()} Andrés Mata Caro · Arquitectura y urbanismo desde 1993
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 text-[15px] text-right">
          <a href="tel:+34958521955" className="hover:text-almagra transition-colors">958 52 19 55</a>
          <a href="tel:+34616479446" className="hover:text-almagra transition-colors">616 47 94 46</a>
          <a href="mailto:andresmata@coagranada.org" className="hover:text-almagra transition-colors">andresmata@coagranada.org</a>
          <span className="text-pizarra/55">C/ Buensuceso 1, 3º A · Granada</span>
        </div>
      </div>

      <div className="mx-5 md:mx-10 mt-10 pt-5 border-t border-pizarra/15 grid grid-cols-2 md:grid-cols-3 items-start gap-4">
        <span className="hidden md:block label !text-[10px] text-pizarra/50">Granada · 37°10′ N 3°36′ O</span>
        <a href="#inicio" className="label !text-[10px] md:justify-self-center hover:text-almagra transition-colors">
          Volver arriba ↑
        </a>
        <details className="group justify-self-end text-right">
          <summary className="label !text-[10px] text-pizarra/50 cursor-pointer hover:text-pizarra list-none">
            Créditos de imagen <span className="inline-block transition-transform group-open:rotate-45">+</span>
          </summary>
          <ul className="mt-3 space-y-1 text-[12px] text-pizarra/60 max-w-md ml-auto">
            {references.map((r) => (
              <li key={r.slug}>
                <a href={r.source} target="_blank" rel="noreferrer" className="hover:text-pizarra">
                  {r.name}
                </a>{" "}
                — {r.author},{" "}
                <a href={r.licenseUrl} target="_blank" rel="noreferrer" className="underline decoration-pizarra/20 hover:text-pizarra">
                  {r.license}
                </a>
              </li>
            ))}
            <li className="pt-1 text-pizarra/45">Wikimedia Commons. Imágenes recortadas; obras de otros autores mostradas como referencia.</li>
          </ul>
        </details>
      </div>

      <FooterAnimation className="w-full mt-6 md:mt-2" />
    </footer>
  );
}
