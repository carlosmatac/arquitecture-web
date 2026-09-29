import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import type { Project } from "../data/projects";
import { MULHACEN, STUDIO, municipalities, type LatLon } from "../data/territory";
import { EASE, MaskLines, Reveal, SectionLabel } from "./ui";

const W = 1000;
const H = 650;
const LON: [number, number] = [-4.3, -2.95];
const LAT: [number, number] = [36.64, 37.34];
const K = W / ((LON[1] - LON[0]) * Math.cos((37 * Math.PI) / 180));

const project = ([lat, lon]: LatLon) => ({
  x: (lon - LON[0]) * Math.cos((37 * Math.PI) / 180) * K,
  y: (LAT[1] - lat) * K,
});

const inBounds = ([lat, lon]: LatLon) => lon >= LON[0] && lon <= LON[1] && lat >= LAT[0] && lat <= LAT[1];

/** Nested, slightly irregular closed curves that read as topographic contour lines. */
function contours(center: LatLon, rx: number, ry: number, levels: number, seed: number, peak: LatLon = center) {
  return Array.from({ length: levels }, (_, level) => {
    const t = level / levels;
    const s = 1 - t * 0.88;
    const c: LatLon = [center[0] + (peak[0] - center[0]) * t, center[1] + (peak[1] - center[1]) * t];
    const points = Array.from({ length: 140 }, (_, i) => {
      const a = (i / 140) * Math.PI * 2;
      const r = 1 + 0.07 * Math.sin(3 * a + seed) + 0.045 * Math.sin(5 * a + seed * 2 + t) + 0.02 * Math.sin(11 * a + seed * 3);
      const p = project([c[0] + Math.sin(a) * ry * s * r, c[1] + Math.cos(a) * rx * s * r]);
      return `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    });
    return `M${points.join("L")}Z`;
  });
}

const ranges = [
  { lines: contours([37.07, -3.15], 0.62, 0.15, 10, 1.3, MULHACEN), label: "Sierra Nevada", at: [37.19, -3.22] as LatLon },
  { lines: contours([36.87, -3.95], 0.2, 0.075, 6, 2.1), label: "Sierra de Almijara", at: [36.96, -4.02] as LatLon },
  { lines: contours([36.8, -3.33], 0.24, 0.05, 5, 3.7), label: "Sierra de Lújar", at: [36.855, -3.2] as LatLon },
  { lines: contours([37.28, -3.47], 0.13, 0.06, 5, 4.2) },
  { lines: contours([37.1, -4.09], 0.12, 0.05, 4, 5.5), label: "Sierra de Loja", at: [37.03, -4.2] as LatLon },
  { lines: contours([37.245, -3.72], 0.05, 0.022, 3, 6.1) },
];

const coast: LatLon[] = [
  [36.72, -4.3], [36.74, -4.1], [36.752, -3.98], [36.745, -3.88], [36.752, -3.8], [36.735, -3.74], [36.728, -3.69],
  [36.745, -3.6], [36.722, -3.53], [36.718, -3.44], [36.722, -3.35], [36.74, -3.2], [36.745, -3.05], [36.742, -2.95],
];
const coastPath = coast.map((c, i) => {
  const p = project(c);
  return `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
}).join("");

const regions: { name: string; at: LatLon }[] = [
  { name: "La Alpujarra", at: [36.915, -3.24] },
  { name: "Valle de Lecrín", at: [36.935, -3.6] },
  { name: "Vega de Granada", at: [37.2, -3.86] },
  { name: "Costa Tropical", at: [36.775, -3.66] },
];

const alwaysLabelled = new Set(["Granada", "Loja", "Motril", "La Herradura", "Capileira", "Nigüelas"]);
const studio = project(STUDIO);
const mulhacen = project(MULHACEN);

export default function Territory({ onOpen }: { onOpen: (p: Project) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const closeTimer = useRef<number>(undefined);
  const enter = (name: string) => {
    window.clearTimeout(closeTimer.current);
    setActive(name);
  };
  const leave = () => {
    closeTimer.current = window.setTimeout(() => setActive(null), 220);
  };
  const activeMunicipality = municipalities.find((m) => m.name === active);

  const points = municipalities.map((m) => {
    const inside = inBounds(m.coords);
    const raw = project(m.coords);
    return {
      ...m,
      inside,
      p: inside ? raw : { x: Math.min(W - 40, Math.max(40, raw.x)), y: Math.min(H - 30, Math.max(30, raw.y)) },
      angle: (Math.atan2(raw.y - H / 2, raw.x - W / 2) * 180) / Math.PI,
    };
  });
  const activePoint = points.find((p) => p.name === active);

  return (
    <section id="territorio" className="bg-pizarra text-cal px-5 md:px-10 py-28 md:py-40 overflow-hidden">
      <div className="grid grid-cols-12 gap-x-6 gap-y-14">
        <div className="col-span-12 lg:col-span-4">
          <SectionLabel index="04" className="text-cal/60">Territorio</SectionLabel>
          <h2 className="mt-10 font-serif text-[2.6rem] md:text-6xl lg:text-[3.8vw] leading-[1.02] tracking-[-0.025em]">
            <MaskLines lines={["Del Mulhacén", <><span className="text-almagra-claro">al</span> Mediterráneo.</>]} />
          </h2>
          <Reveal className="mt-8 text-[15px] leading-relaxed text-cal/65 max-w-md">
            Conocemos el territorio porque trabajamos en él: los pueblos de la Alpujarra y el Valle de Lecrín, la Vega, la costa y
            la ciudad. Cada lugar tiene su clima, su pendiente, su normativa y su manera de construir.
          </Reveal>

        </div>

        <div className="col-span-12 lg:col-span-8 lg:col-start-5 lg:row-start-1 lg:row-span-2 relative">
          <motion.svg initial="hidden" whileInView="shown" viewport={{ once: true, margin: "-20%" }} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Mapa de la provincia de Granada con los municipios donde hay proyectos del estudio">
            <motion.path
              d={`${coastPath}L${W} ${H}L0 ${H}Z`}
              className="fill-cal/[0.035]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            />
            {Array.from({ length: 5 }, (_, i) => (
              <path key={i} d={coastPath} transform={`translate(0 ${14 + i * 12})`} fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" className="opacity-20" />
            ))}
            <motion.path
              d={coastPath}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 2.4, ease: EASE }}
            />

            {ranges.flatMap((r, ri) =>
              r.lines.map((d, li) => (
                <motion.path
                  key={`${ri}-${li}`}
                  d={d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={li % 5 === 4 ? 0.9 : 0.5}
                  className="opacity-30"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ duration: 2.2, ease: EASE, delay: 0.2 + li * 0.08 + ri * 0.1 }}
                />
              )),
            )}

            <g className="font-serif fill-current">
              {ranges.map((r) => {
                if (!r.label || !r.at) return null;
                const p = project(r.at);
                return (
                  <text key={r.label} x={p.x} y={p.y} fontSize="17" textAnchor="middle" className="opacity-45">
                    {r.label}
                  </text>
                );
              })}
              <text x={W * 0.3} y={H - 40} fontSize="26" className="opacity-40" letterSpacing="2">
                Mar Mediterráneo
              </text>
            </g>
            <g className="font-mono fill-current uppercase" fontSize="9.5" letterSpacing="2">
              {regions.map((r) => {
                const p = project(r.at);
                return (
                  <text key={r.name} x={p.x} y={p.y} textAnchor="middle" className="opacity-40">
                    {r.name}
                  </text>
                );
              })}
            </g>

            <g className="text-cal">
              <path d={`M${mulhacen.x} ${mulhacen.y - 7}l6 10h-12z`} fill="none" stroke="currentColor" strokeWidth="1" />
              <text x={mulhacen.x + 10} y={mulhacen.y + 3} fontSize="10" letterSpacing="1.5" className="font-mono fill-current uppercase opacity-70">
                Mulhacén 3.479
              </text>
            </g>

            {points.filter((m) => m.inside && m.name !== "Granada").map((m, i) => {
              const mx = (studio.x + m.p.x) / 2;
              const my = (studio.y + m.p.y) / 2 - Math.hypot(m.p.x - studio.x, m.p.y - studio.y) * 0.18;
              return (
                <motion.path
                  key={`arc-${m.name}`}
                  d={`M${studio.x} ${studio.y}Q${mx} ${my} ${m.p.x} ${m.p.y}`}
                  fill="none"
                  stroke="var(--color-almagra-claro)"
                  strokeWidth={active === m.name ? 1.4 : 0.7}
                  className={`transition-opacity duration-300 ${active && active !== m.name ? "opacity-15" : "opacity-70"}`}
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ duration: 1.4, ease: EASE, delay: 1.2 + i * 0.06 }}
                />
              );
            })}

            {points.map((m, i) => {
              const r = 3 + Math.sqrt(m.projects.length) * 2.2;
              const isActive = active === m.name;
              const showLabel = isActive || !m.inside || (alwaysLabelled.has(m.name) && !active);
              return (
                <motion.g
                  key={m.name}
                  variants={{ hidden: { opacity: 0, scale: 0 }, shown: { opacity: 1, scale: 1 } }}
                  transition={{ duration: 0.6, ease: EASE, delay: 1.6 + i * 0.05 }}
                  style={{ transformOrigin: `${m.p.x}px ${m.p.y}px` }}
                  onMouseEnter={() => enter(m.name)}
                  onMouseLeave={leave}
                  onClick={() => setActive(isActive ? null : m.name)}
                  className="cursor-pointer"
                >
                  <circle cx={m.p.x} cy={m.p.y} r={r + 10} fill="transparent" />
                  {m.inside ? (
                    <circle cx={m.p.x} cy={m.p.y} r={isActive ? r + 2 : r} className="fill-almagra-claro transition-all duration-300" />
                  ) : (
                    <path
                      d={`M${m.p.x - 6} ${m.p.y - 7}L${m.p.x + 6} ${m.p.y}L${m.p.x - 6} ${m.p.y + 7}`}
                      transform={`rotate(${m.angle} ${m.p.x} ${m.p.y})`}
                      fill="none"
                      stroke="var(--color-almagra-claro)"
                      strokeWidth="1.5"
                    />
                  )}
                  {showLabel && (
                    <text
                      x={m.p.x + (m.p.x > W - 140 ? -r - 8 : r + 8)}
                      y={m.p.y + 4}
                      textAnchor={m.p.x > W - 140 ? "end" : "start"}
                      fontSize="12"
                      letterSpacing="0.5"
                      className="fill-cal font-sans"
                      style={{ paintOrder: "stroke", stroke: "var(--color-pizarra)", strokeWidth: 4 }}
                    >
                      {m.name}
                      
                    </text>
                  )}
                </motion.g>
              );
            })}

            <g>
              <circle cx={studio.x} cy={studio.y} r="16" fill="none" stroke="currentColor" strokeWidth="0.8" className="opacity-50">
                <animate attributeName="r" values="8;26" dur="2.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0" dur="2.6s" repeatCount="indefinite" />
              </circle>
              <circle cx={studio.x} cy={studio.y} r="5" className="fill-cal" />
            </g>
          </motion.svg>

          <AnimatePresence>
            {activeMunicipality && activePoint && (
              <motion.div
                key={activeMunicipality.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onMouseEnter={() => enter(activeMunicipality.name)}
                onMouseLeave={leave}
                className="absolute z-10 w-64 bg-cal text-pizarra p-4 shadow-2xl"
                style={{
                  left: `clamp(0px, calc(${(activePoint.p.x / W) * 100}% - 8rem), calc(100% - 16rem))`,
                  top: `${(activePoint.p.y / H) * 100}%`,
                  translate: activePoint.p.y > H * 0.55 ? "0 calc(-100% - 18px)" : "0 18px",
                }}
              >
                <span className="label text-almagra !text-[10px]">
                  {activeMunicipality.name} · {activeMunicipality.projects.length} {activeMunicipality.projects.length === 1 ? "proyecto" : "proyectos"}
                </span>
                <ul className="mt-2">
                  {activeMunicipality.projects.map((p) => (
                    <li key={p.slug}>
                      <button onClick={() => onOpen(p)} className="w-full text-left py-1.5 border-t border-pizarra/10 text-[13px] leading-snug hover:text-almagra transition-colors">
                        {p.title} ↗
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex justify-between label !text-[10px] text-cal/45">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cal" /> Estudio · C/ Buensuceso, Granada
            </span>
            <span>Provincia de Granada</span>
          </div>
        </div>

        <ul className="col-span-12 lg:col-span-4 lg:col-start-1 self-start grid grid-cols-2 gap-x-6 border-t border-cal/15">
          {municipalities.map((m) => (
            <li key={m.name}>
              <button
                onMouseEnter={() => enter(m.name)}
                onMouseLeave={leave}
                onClick={() => setActive(active === m.name ? null : m.name)}
                className={`w-full flex justify-between items-baseline py-2.5 border-b border-cal/10 text-left text-[14px] transition-colors ${
                  active === m.name ? "text-almagra-claro" : "text-cal/80 hover:text-cal"
                }`}
              >
                {m.name}
                <span className="font-mono text-[11px] opacity-60">{String(m.projects.length).padStart(2, "0")}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
