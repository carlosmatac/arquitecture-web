import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import mapSvg from "../assets/granada-costa-map.svg?raw";
import type { Project } from "../data/projects";
import { municipalities, type LatLon } from "../data/territory";
import { EASE, MaskLines, Reveal, SectionLabel } from "./ui";

/**
 * Illustrated map (assets/maps/quiver-arrow-2-telos/granada-costa.svg, cleaned into src/assets) with the
 * municipalities placed on top. The illustration is editorial, not surveyed, so real coordinates are mapped
 * with an affine fit over the places the drawing itself locates, plus an inverse-distance correction that makes
 * those anchors land exactly and drags nearby villages along with them.
 */
const W = 1400;
const H = 950;
const mapContent = mapSvg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

const anchors: { at: LatLon; x: number; y: number }[] = [
  { at: [37.1773, -3.5986], x: 595, y: 224 }, // Granada
  { at: [37.1686, -4.1514], x: 169, y: 211 }, // Loja
  { at: [36.9867, -3.5367], x: 655, y: 428 }, // Nigüelas
  { at: [36.9617, -3.3589], x: 913, y: 450 }, // Capileira
  { at: [36.7358, -3.7372], x: 532, y: 800 }, // La Herradura
  { at: [36.745, -3.5178], x: 835, y: 760 }, // Motril
  { at: [37.0533, -3.3114], x: 1038, y: 354 }, // Mulhacén
];

/** Least-squares affine map (lon, lat) → (x, y), solved with normal equations. */
function fitAffine() {
  const rows = anchors.map(({ at: [lat, lon] }) => [lon, lat, 1]);
  const ata = [0, 1, 2].map((i) => [0, 1, 2].map((j) => rows.reduce((sum, r) => sum + r[i] * r[j], 0)));
  const det = (m: number[][]) =>
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const solve = (key: "x" | "y") => {
    const atb = [0, 1, 2].map((i) => rows.reduce((sum, r, k) => sum + r[i] * anchors[k][key], 0));
    const d = det(ata);
    return [0, 1, 2].map((c) => det(ata.map((row, i) => row.map((v, j) => (j === c ? atb[i] : v)))) / d);
  };
  return { x: solve("x"), y: solve("y") };
}
const affine = fitAffine();
const linear = ([lat, lon]: LatLon) => ({
  x: affine.x[0] * lon + affine.x[1] * lat + affine.x[2],
  y: affine.y[0] * lon + affine.y[1] * lat + affine.y[2],
});
const residuals = anchors.map((a) => {
  const p = linear(a.at);
  return { at: a.at, dx: a.x - p.x, dy: a.y - p.y };
});

const project = (at: LatLon) => {
  const p = linear(at);
  let wx = 0;
  let wy = 0;
  let total = 0;
  for (const r of residuals) {
    const d2 = (r.at[0] - at[0]) ** 2 + (r.at[1] - at[1]) ** 2;
    if (d2 < 1e-10) return { x: p.x + r.dx, y: p.y + r.dy };
    const w = 1 / d2;
    wx += w * r.dx;
    wy += w * r.dy;
    total += w;
  }
  return { x: p.x + wx / total, y: p.y + wy / total };
};

/**
 * Engraving entrance: ridge and drainage lines draw themselves from north to south, then the fine
 * texture (reused fronds) fades in, and finally the sea and the coastline. Works on the injected SVG DOM.
 */
function engrave(root: SVGGElement) {
  const relief = root.querySelector<SVGGElement>("#relief");
  if (!relief) return () => {};
  const lines = [...relief.querySelectorAll<SVGPathElement>("path")];
  const texture = [...relief.querySelectorAll<SVGUseElement>("use")];
  const sea = ["#sea", "#bathymetry"].map((id) => root.querySelector<SVGElement>(id)).filter(Boolean) as SVGElement[];
  const coast = root.querySelector<SVGPathElement>("#coastline");

  const top = (el: SVGGraphicsElement) => el.getBBox().y / 700;
  const runs: Animation[] = [];
  const opts = (delay: number, duration: number): KeyframeAnimationOptions => ({ delay, duration, easing: "cubic-bezier(0.45, 0, 0.2, 1)", fill: "backwards" });
  for (const path of [...lines, ...(coast ? [coast] : [])]) {
    path.setAttribute("pathLength", "1");
    path.style.strokeDasharray = "1";
    const delay = path === coast ? 1500 : Math.min(1, Math.max(0, top(path))) * 1100 + Math.random() * 250;
    runs.push(path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], opts(delay, path === coast ? 1400 : 1300 + Math.random() * 700)));
  }
  texture.forEach((use) => runs.push(use.animate([{ opacity: 0 }, { opacity: 1 }], opts(500 + Math.min(1, Math.max(0, top(use))) * 1100, 700))));
  sea.forEach((el) => runs.push(el.animate([{ opacity: 0 }, { opacity: getComputedStyle(el).opacity }], opts(1300, 1200))));
  return () => runs.forEach((a) => a.cancel());
}

const alwaysLabelled = new Set(["Granada", "Loja", "Motril", "La Herradura", "Capileira", "Nigüelas"]);
const studio = project(anchors[0].at);
const MARGIN = 48;

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
    const raw = project(m.coords);
    const inside = raw.x >= 0 && raw.x <= W && raw.y >= 0 && raw.y <= H;
    return {
      ...m,
      inside,
      p: inside ? raw : { x: Math.min(W - MARGIN, Math.max(MARGIN, raw.x)), y: Math.min(H - MARGIN, Math.max(MARGIN * 2.6, raw.y)) },
      angle: (Math.atan2(raw.y - H / 2, raw.x - W / 2) * 180) / Math.PI,
    };
  });
  const activePoint = points.find((p) => p.name === active);

  const svgRef = useRef<SVGSVGElement>(null);
  const mapRef = useRef<SVGGElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(svgRef, { once: true, margin: "-20% 0px" });
  const [armed, setArmed] = useState(false);

  // Inject the map once: React must never re-render its children, or running animations would be lost
  useLayoutEffect(() => {
    if (mapRef.current && !mapRef.current.childElementCount) mapRef.current.innerHTML = mapContent;
  }, []);

  // Hide the relief until the section is reached, then engrave it
  useEffect(() => {
    const root = mapRef.current;
    if (!root || reduce) return;
    root.querySelectorAll<SVGPathElement>("#relief path, #coastline").forEach((p) => {
      p.setAttribute("pathLength", "1");
      p.style.strokeDasharray = "1";
      p.style.strokeDashoffset = inView ? "0" : "1";
    });
    root.querySelectorAll<SVGElement>("#relief use, #sea, #bathymetry").forEach((el) => (el.style.opacity = inView ? "" : "0"));
    if (!inView) return;
    setArmed(true);
    return engrave(root);
  }, [inView, reduce]);

  // Drafting-lamp light: follows the pointer, or glides to the municipality being explored
  const lampX = useMotionValue(studio.x);
  const lampY = useMotionValue(studio.y);
  const x = useSpring(lampX, { stiffness: 90, damping: 20 });
  const y = useSpring(lampY, { stiffness: 90, damping: 20 });
  const [pointerInside, setPointerInside] = useState(false);
  useEffect(() => {
    if (!activePoint) return;
    lampX.set(activePoint.p.x);
    lampY.set(activePoint.p.y);
  }, [activePoint, lampX, lampY]);
  const trackPointer = (e: MouseEvent<SVGSVGElement>) => {
    if (activePoint) return;
    const box = e.currentTarget.getBoundingClientRect();
    lampX.set(((e.clientX - box.left) / box.width) * W);
    lampY.set(((e.clientY - box.top) / box.height) * H);
  };
  const lampOn = armed && (pointerInside || !!activePoint);

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
          <motion.svg
            ref={svgRef}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, margin: "-20%" }}
            onMouseMove={trackPointer}
            onMouseEnter={() => setPointerInside(true)}
            onMouseLeave={() => setPointerInside(false)}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto" role="img" aria-label="Mapa de la provincia de Granada con los municipios donde hay proyectos del estudio">
            <defs>
              <linearGradient id="map-fade-x">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.06" stopColor="#fff" />
                <stop offset="0.94" stopColor="#fff" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="map-fade-y" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.07" stopColor="#fff" />
                <stop offset="0.9" stopColor="#fff" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <mask id="map-mask-x">
                <rect width={W} height={H} fill="url(#map-fade-x)" />
              </mask>
              <radialGradient id="lamp">
                <stop offset="0" stopColor="var(--color-almagra-claro)" stopOpacity="0.2" />
                <stop offset="0.45" stopColor="var(--color-cal)" stopOpacity="0.07" />
                <stop offset="1" stopColor="var(--color-cal)" stopOpacity="0" />
              </radialGradient>
              <mask id="map-mask-y">
                <rect width={W} height={H} fill="url(#map-fade-y)" />
              </mask>
            </defs>
            <g mask="url(#map-mask-x)">
              <g mask="url(#map-mask-y)">
                <g ref={mapRef} className="territory-map" />
              </g>
            </g>

            <motion.circle
              cx={x}
              cy={y}
              r={300}
              fill="url(#lamp)"
              style={{ mixBlendMode: "screen" }}
              className="pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: lampOn ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            />

            {points.filter((m) => m.inside && m.name !== "Granada").map((m, i) => {
              const mx = (studio.x + m.p.x) / 2;
              const my = (studio.y + m.p.y) / 2 - Math.hypot(m.p.x - studio.x, m.p.y - studio.y) * 0.18;
              return (
                <motion.path
                  key={`arc-${m.name}`}
                  d={`M${studio.x} ${studio.y}Q${mx} ${my} ${m.p.x} ${m.p.y}`}
                  fill="none"
                  stroke="var(--color-almagra-claro)"
                  strokeWidth={active === m.name ? 2 : 1}
                  className={`transition-opacity duration-300 ${active && active !== m.name ? "opacity-15" : "opacity-70"}`}
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ duration: 1.4, ease: EASE, delay: (reduce ? 0 : 2.1) + i * 0.06 }}
                />
              );
            })}

            {points.map((m, i) => {
              const r = 5 + Math.sqrt(m.projects.length) * 3;
              const isActive = active === m.name;
              const showLabel = isActive || !m.inside || (alwaysLabelled.has(m.name) && !active);
              return (
                <motion.g
                  key={m.name}
                  variants={{ hidden: { opacity: 0, scale: 0 }, shown: { opacity: 1, scale: 1 } }}
                  transition={{ duration: 0.6, ease: EASE, delay: (reduce ? 0 : 2.4) + i * 0.05 }}
                  style={{ transformOrigin: `${m.p.x}px ${m.p.y}px` }}
                  onMouseEnter={() => enter(m.name)}
                  onMouseLeave={leave}
                  onClick={() => setActive(isActive ? null : m.name)}
                  className="cursor-pointer"
                >
                  <circle cx={m.p.x} cy={m.p.y} r={r + 12} fill="transparent" />
                  {m.inside ? (
                    <circle cx={m.p.x} cy={m.p.y} r={isActive ? r + 3 : r} stroke="var(--color-pizarra)" strokeWidth="3" className="fill-almagra-claro transition-all duration-300" />
                  ) : (
                    <path
                      d={`M${m.p.x - 9} ${m.p.y - 10}L${m.p.x + 9} ${m.p.y}L${m.p.x - 9} ${m.p.y + 10}`}
                      transform={`rotate(${m.angle} ${m.p.x} ${m.p.y})`}
                      fill="none"
                      stroke="var(--color-almagra-claro)"
                      strokeWidth="2"
                    />
                  )}
                  {showLabel && (
                    <text
                      x={m.p.x + (m.p.x > W - 200 ? -r - 10 : r + 10)}
                      y={m.p.y + 4}
                      textAnchor={m.p.x > W - 200 ? "end" : "start"}
                      fontSize="17"
                      letterSpacing="0.3"
                      className="fill-cal font-sans"
                      style={{ paintOrder: "stroke", stroke: "var(--color-pizarra)", strokeWidth: 5 }}
                    >
                      {m.name}
                      
                    </text>
                  )}
                </motion.g>
              );
            })}

            <g>
              <circle cx={studio.x} cy={studio.y} r="16" fill="none" stroke="var(--color-almagra-claro)" strokeWidth="1.2" className="opacity-50">
                <animate attributeName="r" values="10;34" dur="2.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0" dur="2.6s" repeatCount="indefinite" />
              </circle>
              <circle cx={studio.x} cy={studio.y} r="7" stroke="var(--color-pizarra)" strokeWidth="3" className="fill-cal" />
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
