import { motion } from "motion/react";

/**
 * Line elevation that travels from an Alpujarra village on terraces, below Sierra Nevada,
 * to a contemporary house and a residential block: tradition and modernity in one continuous drawing.
 */

type Stroke = { d: string; x: number; weight?: number; tone?: "faint" | "accent"; back?: boolean };
type Fill = { d: string; x: number };

const W = 1600;
const H = 372;
const G = 320; // ground level of the flat part

const strokes: Stroke[] = [];
const fills: Fill[] = [];

function house(x: number, g: number, w: number, h: number, chimney: number, windows: [number, number][], door: number) {
  const top = g - h;
  fills.push({ d: `M${x} ${g}V${top}H${x + w}V${g}Z`, x });
  strokes.push({ d: `M${x} ${g}V${top}M${x + w} ${top}V${g}`, x });
  // Flat terrao finished in launa, with the slate edge slightly overhanging
  strokes.push({ d: `M${x - 6} ${top}H${x + w + 6}V${top - 4}H${x - 6}Z`, x, weight: 1.4 });
  const cx = x + w * chimney;
  strokes.push({
    d: `M${cx - 4} ${top - 4}V${top - 17}M${cx + 4} ${top - 4}V${top - 17}M${cx - 9} ${top - 17}H${cx + 9}V${top - 20.5}H${cx - 9}ZM${cx - 3} ${top - 20.5}V${top - 25}H${cx + 3}V${top - 20.5}`,
    x: cx,
  });
  fills.push({ d: `M${cx - 4} ${top - 4}V${top - 17}H${cx + 4}V${top - 4}Z`, x: cx });
  for (const [dx, dy] of windows) strokes.push({ d: `M${x + dx} ${top + dy}h8v10h-8Z`, x: x + dx, weight: 0.9 });
  strokes.push({ d: `M${x + door} ${g}v-19h11v19`, x: x + door, weight: 0.9 });
}

function olive(x: number, g: number, s = 1) {
  strokes.push({
    d: `M${x} ${g}c1-5-1-9 1-${14 * s}M${x - 16 * s} ${g - 18 * s}c-5-12 10-20 17-13c6-9 22-4 19 7c7 5 0 15-9 12c-6 6-18 5-21-1c-8 1-10-8-6-5z`,
    x,
    weight: 0.9,
    tone: "faint",
  });
}

// Sierra Nevada, behind the village
strokes.push({
  d: "M0 128L60 112L110 119L170 92L230 101L300 66L350 58L385 38L420 52L470 47L520 70L580 63L650 88L720 83L800 104L880 97L960 118L1040 111L1120 130L1200 123L1300 138L1400 131L1500 142L1600 137",
  x: 0,
  weight: 0.9,
  tone: "faint",
  back: true,
});
strokes.push({
  d: "M250 104L300 84L340 96M330 76L385 38L410 70M500 64L540 76M690 90L740 96",
  x: 250,
  weight: 0.7,
  tone: "faint",
  back: true,
});
strokes.push({ d: "M0 176C120 158 220 182 330 168S560 176 700 196S900 214 1000 206", x: 0, weight: 0.7, tone: "faint", back: true });

// Afternoon sun
strokes.push({ d: "M1180 64a30 30 0 1 0 0.1 0", x: 1150, weight: 1.1, tone: "accent", back: true });

// Terraced ground (bancales) with dry-stone retaining walls
strokes.push({ d: `M0 205H170V235H330V262H500V290H660V${G}H${W}`, x: 0, weight: 1.6 });
for (const [x, y1, y2] of [
  [170, 205, 235],
  [330, 235, 262],
  [500, 262, 290],
  [660, 290, 320],
] as const) {
  let d = "";
  for (let y = y1 + 6, i = 0; y < y2; y += 6, i++) d += `M${x - (i % 2 ? 9 : 4)} ${y}h${i % 2 ? 6 : 4}`;
  strokes.push({ d, x, weight: 0.7, tone: "faint" });
}

// Village
house(12, 205, 68, 52, 0.72, [[14, 16], [44, 16]], 30);
house(88, 205, 62, 78, 0.3, [[12, 14], [40, 14], [40, 46]], 14);
house(180, 235, 84, 58, 0.8, [[16, 18], [52, 18]], 36);
house(270, 235, 52, 84, 0.5, [[10, 16], [32, 16], [10, 50]], 30);
house(340, 262, 56, 52, 0.25, [[32, 18]], 12);
house(510, 290, 78, 56, 0.7, [[14, 18], [48, 18]], 30);
house(594, 290, 54, 42, 0.4, [[30, 14]], 10);

// Mudéjar church: tower and nave
fills.push({ d: "M404 262V112H440V262Z", x: 404 }, { d: "M440 262V216L470 200L500 216V262Z", x: 440 });
strokes.push(
  { d: "M404 262V112H440V262M401 112H443M401 108H443M401 108L422 82L443 108M422 82V72M418 76H426", x: 404 },
  { d: "M415 136V124a7 7 0 0 1 14 0V136ZM404 150H440", x: 415, weight: 0.9 },
  { d: "M440 262V216H500V262M436 216L470 199L504 216M462 262v-22a8 8 0 0 1 16 0v22", x: 440 },
);

// Olive grove and dry-stone wall
olive(700, G, 1);
olive(772, G, 0.8);
olive(838, G, 1.1);
strokes.push({ d: `M670 ${G}V309H890V${G}`, x: 670, weight: 0.9 });
strokes.push({
  d: Array.from({ length: 22 }, (_, i) => `M${676 + i * 10} ${i % 2 ? 309 : 314.5}v5.5`).join("") + `M670 314.5H890`,
  x: 676,
  weight: 0.6,
  tone: "faint",
});

// Contemporary house: stone plinth and cantilevered white volume
fills.push({ d: `M900 ${G}V272H1130V${G}Z`, x: 900 }, { d: "M960 272V232H1215V272Z", x: 960 });
strokes.push(
  { d: `M900 ${G}V272H1130V${G}`, x: 900 },
  { d: `M930 ${G}V284H1100V${G}` + [964, 998, 1032, 1066].map((m) => `M${m} 284V${G}`).join(""), x: 930, weight: 0.8 },
  { d: "M954 272H1221M954 268H1221M960 268V232H1215V268M954 232H1221M954 228H1221V232M954 228V232", x: 954, weight: 1.2 },
  { d: "M992 246H1186V258H992Z" + [1040, 1090, 1140].map((m) => `M${m} 246V258`).join(""), x: 992, weight: 0.8 },
  { d: `M1140 ${G}V331H1236V${G}M1146 324H1230`, x: 1140, weight: 0.8, tone: "faint" },
);

// Residential block / hotel
const blockX = 1290;
const blockW = 250;
const floors = 6;
const floorH = 32;
const blockTop = 280 - floors * floorH;
fills.push({ d: `M${blockX} ${G}V${blockTop}H${blockX + blockW}V${G}Z`, x: blockX });
strokes.push({ d: `M${blockX} ${G}V${blockTop}H${blockX + blockW}V${G}`, x: blockX });
strokes.push({
  d: `M${blockX + 20} ${G}V290H${blockX + blockW - 20}V${G}` + [1, 2, 3, 4].map((i) => `M${blockX + 20 + i * 42} 290V${G}`).join(""),
  x: blockX,
  weight: 0.8,
});
for (let f = 0; f <= floors; f++) {
  const y = 280 - f * floorH;
  const slab = `M${blockX - 12} ${y}H${blockX + blockW + 12}`;
  const rail = f > 0 ? `M${blockX - 12} ${y - 11}H${blockX + blockW + 12}M${blockX - 12} ${y}V${y - 11}M${blockX + blockW + 12} ${y}V${y - 11}` : "";
  strokes.push({ d: slab + rail, x: blockX + f * 4, weight: f === floors ? 1.4 : 1 });
}
strokes.push({
  d: Array.from({ length: 6 }, (_, i) => `M${blockX + 20 + i * 42} ${blockTop}V280`).join(""),
  x: blockX + 10,
  weight: 0.6,
  tone: "faint",
});
strokes.push({
  d: `M${blockX + 30} ${blockTop}V${blockTop - 18}M${blockX + 150} ${blockTop}V${blockTop - 18}M${blockX + 20} ${blockTop - 18}H${blockX + 160}` +
    Array.from({ length: 8 }, (_, i) => `M${blockX + 30 + i * 17} ${blockTop - 18}v4`).join(""),
  x: blockX + 30,
  weight: 0.8,
});

// Level marker and height dimension
strokes.push({
  d: `M1572 ${G}L1566 ${G - 8}H1578Z M1572 ${G}V${G - 8}` +
    `M1568 ${blockTop}H1582M1575 ${blockTop}V${G - 14}M1571 ${blockTop + 4}l8 -8M1571 ${G - 10}l8 -8`,
  x: 1560,
  weight: 0.8,
  tone: "accent",
});

type Note = { ax: number; ay: number; lx: number; ly: number; text: string; end?: boolean };
const notes: Note[] = [
  { ax: 385, ay: 38, lx: 385, ly: 14, text: "Mulhacén · 3.479 m" },
  { ax: 61, ay: 128, lx: 92, ly: 100, text: "Chimenea alpujarreña" },
  { ax: 222, ay: 173, lx: 222, ly: 114, text: "Terrao de launa" },
  { ax: 1090, ay: 228, lx: 1090, ly: 186, text: "Vivienda contemporánea" },
  { ax: 1380, ay: blockTop - 18, lx: 1380, ly: 40, text: "Plurifamiliar · hotelero" },
];

const delayFor = (x: number) => 0.35 + (x / W) * 2.3;

function renderStroke(s: Stroke, i: number) {
  return (
    <motion.path
      key={`s${i}`}
      d={s.d}
      fill="none"
      stroke="currentColor"
      strokeWidth={s.weight ?? 1.15}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={s.tone === "accent" ? "text-almagra" : s.tone === "faint" ? "opacity-45" : ""}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: s.back ? 0.1 : delayFor(s.x), duration: s.back ? 2.6 : 1.3, ease: [0.45, 0, 0.2, 1] }}
    />
  );
}

export default function HeroDrawing({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${W + 44} ${H}`} className={className} role="img" aria-label="Dibujo en alzado de un pueblo alpujarreño, una vivienda contemporánea y un bloque de viviendas">
      <defs>
        <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="currentColor" strokeWidth="0.6" />
        </pattern>
      </defs>

      <motion.path
        d={`M0 205H170V235H330V262H500V290H660V${G}H${W}V334H0Z`}
        fill="url(#hatch)"
        opacity={0}
        animate={{ opacity: 0.22 }}
        transition={{ delay: 2.4, duration: 1.2 }}
      />

      {strokes.map((s, i) => s.back && renderStroke(s, i))}

      {fills.map((f, i) => (
        <motion.path
          key={`f${i}`}
          d={f.d}
          className="fill-cal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delayFor(f.x), duration: 0.4 }}
        />
      ))}

      {strokes.map((s, i) => !s.back && renderStroke(s, i))}

      {notes.map((n, i) => (
        <motion.g
          key={`n${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6 + i * 0.12, duration: 0.8 }}
          className="font-mono"
        >
          <circle cx={n.ax} cy={n.ay} r="2.2" className="fill-almagra" />
          <path d={`M${n.ax} ${n.ay}L${n.lx} ${n.ly}H${n.lx + 8}`} fill="none" stroke="currentColor" strokeWidth="0.6" />
          <text
            x={n.lx + 12}
            y={n.ly + 3.5}
            fontSize="11"
            letterSpacing="1"
            className="fill-current uppercase"
            style={{ paintOrder: "stroke", stroke: "var(--color-cal)", strokeWidth: 5 }}
          >
            {n.text}
          </text>
        </motion.g>
      ))}

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 0.8 }}
        className="font-mono fill-current"
        fontSize="10.5"
        letterSpacing="1.2"
      >
        <text x="1584" y={G - 12} className="fill-almagra">±0,00</text>
        <text x="1590" y={(blockTop + G) / 2} className="fill-almagra" transform={`rotate(-90 1590 ${(blockTop + G) / 2})`} textAnchor="middle">
          22,40
        </text>
        <text x="16" y="356" opacity="0.6">A · ARQUITECTURA TRADICIONAL</text>
        <text x="900" y="356" opacity="0.6">B · ARQUITECTURA CONTEMPORÁNEA</text>
        <text x={W - 16} y="356" opacity="0.6" textAnchor="end">ALZADO — E 1:500</text>
      </motion.g>
    </svg>
  );
}
