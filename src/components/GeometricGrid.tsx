import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { referenceUrl, references } from "../data/references";
import { EASE } from "./ui";

/**
 * Modular grid of square cells joined by tangent curves, drawn like an architect's plan.
 * Lines keep drawing, erasing, flipping and being traced, while emblematic buildings reveal inside
 * single cells. On top of the grid language borrowed from plans: semicircular arches (an arcade, a nod
 * to the Alhambra), hatched cells (poché) and dimension lines with their measurements.
 *
 * The whole composition lives on a 10 × 7 grid (1 cell = 100 SVG units). `columns` shows a range of them,
 * so narrow screens can display a crop of the same drawing.
 */

const TOTAL_COLS = 10;
const ROWS = 7;
const U = 100;

const cluster: [number, number][] = [
  [5, 0], [6, 0],
  [3, 1], [4, 1], [5, 1], [6, 1], [7, 1],
  [1, 2], [4, 2], [6, 2], [8, 2],
  [0, 3], [1, 3], [2, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3],
  [2, 4], [3, 4], [5, 4], [8, 4],
  [1, 5], [2, 5], [3, 5], [4, 5], [6, 5], [8, 5], [9, 5],
  [3, 6], [6, 6],
];

type Pt = [number, number];
type Kind = "edge" | "ghost" | "curve" | "arch" | "hatch" | "dim";
type Line = { kind: Kind; d: string; alt?: string; accent?: boolean; label?: { x: number; y: number; text: string; vertical?: boolean } };

const P = ([x, y]: Pt) => `${x * U} ${y * U}`;

/** Sigmoid between two grid points, tangent to horizontal (h) or vertical (v) grid lines. */
function sigmoid([x0, y0]: Pt, [x1, y1]: Pt, tangent: "h" | "v") {
  const [a, b, c, d] = [x0 * U, y0 * U, x1 * U, y1 * U];
  const cp = tangent === "h" ? `${(a + c) / 2} ${b} ${(a + c) / 2} ${d}` : `${a} ${(b + d) / 2} ${c} ${(b + d) / 2}`;
  return `M${a} ${b}C${cp} ${c} ${d}`;
}

const curves: { from: Pt; to: Pt; tangent: "h" | "v"; accent?: boolean }[] = [
  { from: [4, 1], to: [5, 0], tangent: "h" },
  { from: [2, 2], to: [3, 1], tangent: "h" },
  { from: [7, 1], to: [8, 2], tangent: "h" },
  { from: [8, 1], to: [9, 0], tangent: "h" },
  { from: [0, 4], to: [1, 3], tangent: "h", accent: true },
  { from: [1, 4], to: [2, 5], tangent: "v" },
  { from: [5, 3], to: [6, 4], tangent: "v" },
  { from: [6, 3], to: [5, 4], tangent: "v" },
  { from: [8, 4], to: [9, 3], tangent: "h" },
  { from: [9, 4], to: [10, 5], tangent: "v" },
  { from: [4, 6], to: [5, 7], tangent: "h" },
  { from: [2, 3], to: [3, 2], tangent: "h", accent: true },
  { from: [0, 5], to: [1, 6], tangent: "h" },
  { from: [7, 5], to: [8, 6], tangent: "v" },
];

function buildLines(): Line[] {
  const lines: Line[] = [];
  const edges = new Set<string>();
  const edge = (x1: number, y1: number, x2: number, y2: number) => {
    const key = [x1, y1, x2, y2].join();
    if (edges.has(key)) return;
    edges.add(key);
    // Alternate the drawing direction so segments don't all grow the same way
    const d = (x1 + y1) % 2 ? `M${P([x1, y1])}L${P([x2, y2])}` : `M${P([x2, y2])}L${P([x1, y1])}`;
    lines.push({ kind: "edge", d });
  };
  for (const [c, r] of cluster) {
    edge(c, r, c + 1, r);
    edge(c, r + 1, c + 1, r + 1);
    edge(c, r, c, r + 1);
    edge(c + 1, r, c + 1, r + 1);
  }

  // Construction lines that run out of the massing
  for (const [x1, y1, x2, y2] of [
    [-1, 3, 0, 3], [-0.6, 4, 0, 4], [0, 2, 0.6, 2], [2.4, 1, 3, 1], [9, 1, 10, 1], [10, 2.4, 10, 3], [0, 6, 0.8, 6],
    [7, 7, 8.5, 7], [5, 7, 5, 7.4], [9.3, 6, 10, 6], [1, 1.4, 1, 2], [7, 0, 7, 0.6],
  ]) lines.push({ kind: "ghost", d: `M${P([x1, y1])}L${P([x2, y2])}` });

  // Tangent curves; each one can flip between its horizontal and vertical form
  for (const { from, to, tangent, accent } of curves)
    lines.push({ kind: "curve", d: sigmoid(from, to, tangent), alt: sigmoid(from, to, tangent === "h" ? "v" : "h"), accent });

  // Arcade: semicircular arches on slender jambs
  for (const [c, r] of [[7, 6], [8, 6], [9, 6], [2, 1]] as Pt[]) {
    const [x, y] = [c * U, (r + 1) * U];
    lines.push({ kind: "arch", d: `M${x + 18} ${y}V${y - 42}A32 32 0 0 1 ${x + 82} ${y - 42}V${y}` });
  }

  // Hatched cells (poché)
  for (const [c, r] of [[4, 4], [7, 2], [0, 2]] as Pt[]) {
    const [x, y] = [c * U, r * U];
    const d = [20, 40, 60, 80, 100, 120, 140, 160, 180]
      .map((k) => (k <= 100 ? `M${x} ${y + k}L${x + k} ${y}` : `M${x + k - 100} ${y + 100}L${x + 100} ${y + k - 100}`))
      .join("");
    lines.push({ kind: "hatch", d });
  }

  // Dimension lines with ticks and measurements
  const dim = (from: Pt, to: Pt, text: string) => {
    const [x0, y0, x1, y1] = [from[0] * U, from[1] * U, to[0] * U, to[1] * U];
    const vertical = x0 === x1;
    const tick = (x: number, y: number) => `M${x - 5} ${y + 5}L${x + 5} ${y - 5}`;
    const ext = vertical ? `M${x0 - 8} ${y0}H${x0 + 8}M${x1 - 8} ${y1}H${x1 + 8}` : `M${x0} ${y0 - 8}V${y0 + 8}M${x1} ${y1 - 8}V${y1 + 8}`;
    lines.push({
      kind: "dim",
      accent: true,
      d: `M${x0} ${y0}L${x1} ${y1}${tick(x0, y0)}${tick(x1, y1)}${ext}`,
      label: vertical ? { x: x0 + 12, y: (y0 + y1) / 2, text, vertical } : { x: (x0 + x1) / 2, y: y0 - 10, text },
    });
  };
  dim([3, 0.72], [8, 0.72], "15,00");
  dim([9.72, 2], [9.72, 3], "3,00");
  dim([1, 6.3], [3, 6.3], "6,00");

  return lines;
}

type State = { on: boolean; fromEnd: boolean; flip: boolean; dur: number };
type Tile = { id: number; ref: number; cell: Pt; from: "left" | "right" | "top" | "bottom" };
type Pulse = { id: number; line: number; reverse: boolean };

const hidden = {
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
  top: "inset(0 0 100% 0)",
  bottom: "inset(100% 0 0 0)",
} as const;

const rand = (n: number) => Math.floor(Math.random() * n);
const pick = <T,>(items: T[]) => items[rand(items.length)];

export default function GeometricGrid({
  className = "",
  columns: [firstCol, lastCol] = [0, TOTAL_COLS],
  minImageCol = 0,
}: {
  className?: string;
  /** Columns to display: [first, last) */
  columns?: [number, number];
  /** Keep references away from the columns covered by the headline */
  minImageCol?: number;
}) {
  const cols = lastCol - firstCol;
  const lines = useMemo(buildLines, []);
  const slots = useMemo(
    () => [...cluster, [9, 0], [0, 1], [7, 4], [9, 2]].filter(([c]) => c >= Math.max(firstCol, minImageCol) && c < lastCol) as Pt[],
    [firstCol, lastCol, minImageCol],
  );
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const [state, setState] = useState<State[]>(() => lines.map(() => ({ on: false, fromEnd: false, flip: false, dur: 1.2 })));
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const ids = useRef({ tile: 0, pulse: 0, ref: 0 });
  const stateRef = useRef(state);
  stateRef.current = state;

  // Build-up: the drawing appears stroke by stroke
  useEffect(() => {
    const order = lines.map((_, i) => i).sort(() => Math.random() - 0.5);
    if (reduce) return setState(lines.map(() => ({ on: true, fromEnd: false, flip: false, dur: 0 })));
    const timers = order.map((index, n) =>
      window.setTimeout(
        () => setState((s) => s.map((st, i) => (i === index ? { ...st, on: Math.random() > 0.15, dur: 0.9 + Math.random() * 0.8 } : st))),
        200 + n * 22,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [lines, reduce]);

  // Continuous life: several strokes change at every beat, in different ways
  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => {
      setState((s) => {
        const next = [...s];
        const share = next.filter((st) => st.on).length / next.length;
        for (let k = 0; k < 1 + rand(3); k++) {
          const i = rand(next.length);
          const st = next[i];
          const line = lines[i];
          if (line.alt && st.on && Math.random() < 0.35) {
            next[i] = { ...st, flip: !st.flip, dur: 1 + Math.random() * 0.6 };
            continue;
          }
          if ((share > 0.82 && !st.on) || (share < 0.55 && st.on)) continue;
          next[i] = { on: !st.on, fromEnd: Math.random() < 0.5, flip: st.flip, dur: 0.6 + Math.random() * 1.1 };
        }
        return next;
      });
    }, 160);
    return () => clearInterval(id);
  }, [inView, reduce, lines]);

  // Tracers: a short almagra stroke travels along a visible line, like a pen checking the drawing
  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => {
      const candidates = lines.map((l, i) => ({ l, i })).filter(({ l, i }) => (l.kind === "edge" || l.kind === "curve") && stateRef.current[i].on);
      if (!candidates.length) return;
      const { i } = pick(candidates);
      const pulse = { id: ids.current.pulse++, line: i, reverse: Math.random() < 0.5 };
      setPulses((p) => [...p.slice(-4), pulse]);
    }, 520);
    return () => clearInterval(id);
  }, [inView, reduce, lines]);

  // References reveal inside single cells
  useEffect(() => {
    references.forEach((r) => (new Image().src = referenceUrl(r)));
    if (!slots.length) return;
    if (reduce) return setTiles([{ id: 0, ref: 0, cell: slots[0], from: "left" }]);
    if (!inView) return;
    const spawn = () => {
      const tileId = ids.current.tile++;
      const refIndex = ids.current.ref++ % references.length;
      setTiles((current) => {
        const kept = current.slice(-3);
        const busy = new Set(kept.map((t) => t.cell.join()));
        const free = slots.filter((s) => !busy.has(s.join()));
        if (!free.length) return kept;
        return [...kept, { id: tileId, ref: refIndex, cell: pick(free), from: pick(["left", "right", "top", "bottom"] as const) }];
      });
    };
    const first = window.setTimeout(spawn, 700);
    const id = window.setInterval(spawn, 1500);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [inView, reduce, slots]);

  const latest = tiles[tiles.length - 1];
  const tone = (l: Line) =>
    l.kind === "ghost" || l.kind === "hatch" ? "opacity-25" : l.kind === "dim" ? "opacity-80" : l.accent ? "" : "opacity-40";

  return (
    <div ref={ref} className={`relative ${className}`} style={{ aspectRatio: `${cols} / ${ROWS}` }}>
      <svg
        viewBox={`${firstCol * U} 0 ${cols * U} ${ROWS * U}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full overflow-visible"
        aria-hidden="true"
      >
        {lines.map((line, i) => {
          const st = state[i];
          return (
            <motion.path
              key={i}
              fill="none"
              stroke={line.accent ? "var(--color-almagra)" : "currentColor"}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              className={tone(line)}
              initial={{ d: line.d, pathLength: 0, pathOffset: 0 }}
              animate={{
                d: st.flip && line.alt ? line.alt : line.d,
                pathLength: st.on ? 1 : 0,
                pathOffset: st.on ? 0 : st.fromEnd ? 1 : 0,
              }}
              transition={{ duration: st.dur, ease: EASE }}
            />
          );
        })}

        {lines.map((line, i) =>
          line.label ? (
            <motion.text
              key={`label-${i}`}
              x={line.label.x}
              y={line.label.y}
              textAnchor="middle"
              dominantBaseline={line.label.vertical ? "middle" : "auto"}
              transform={line.label.vertical ? `rotate(90 ${line.label.x} ${line.label.y})` : undefined}
              className="fill-almagra font-mono"
              fontSize="11"
              letterSpacing="1"
              style={{ paintOrder: "stroke", stroke: "var(--color-cal)", strokeWidth: 4 }}
              animate={{ opacity: state[i].on ? 1 : 0 }}
              transition={{ duration: 0.6, delay: state[i].on ? 0.5 : 0 }}
            >
              {line.label.text}
            </motion.text>
          ) : null,
        )}

        <AnimatePresence>
          {pulses.map((p) => {
            const line = lines[p.line];
            const d = state[p.line].flip && line.alt ? line.alt : line.d;
            return (
              <motion.path
                key={p.id}
                d={d}
                fill="none"
                stroke="var(--color-almagra)"
                strokeWidth={1.6}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0.14, pathOffset: p.reverse ? 1 : -0.14, opacity: 0 }}
                animate={{ pathOffset: p.reverse ? -0.14 : 1, opacity: [0, 1, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
            );
          })}
        </AnimatePresence>
      </svg>

      <AnimatePresence>
        {tiles.map((tile) => {
          const r = references[tile.ref];
          return (
            <motion.figure
              key={tile.id}
              initial={{ clipPath: hidden[tile.from] }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ clipPath: hidden[tile.from] }}
              transition={{ duration: 0.9, ease: EASE }}
              className="absolute m-0 overflow-hidden bg-cal-2"
              style={{
                left: `${((tile.cell[0] - firstCol) / cols) * 100}%`,
                top: `${(tile.cell[1] / ROWS) * 100}%`,
                width: `${100 / cols}%`,
                height: `${100 / ROWS}%`,
              }}
            >
              <motion.img
                src={referenceUrl(r)}
                alt={`${r.name}, ${r.place}`}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2, ease: EASE }}
                className="block w-full h-full max-w-none object-cover"
              />
            </motion.figure>
          );
        })}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {latest && (
          <motion.figcaption
            key={latest.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="absolute -bottom-10 right-5 md:right-10 flex items-baseline gap-3 text-right"
          >
            <span className="label !text-[10px] text-almagra">Referencia</span>
            <span className="text-[13px] text-pizarra">{references[latest.ref].name}</span>
            <span className="hidden sm:inline text-[12px] text-pizarra/55">{references[latest.ref].place}</span>
          </motion.figcaption>
        )}
      </AnimatePresence>
    </div>
  );
}
