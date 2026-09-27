/**
 * Builds the project images in /public/projects from the originals in /assets/originals.
 *
 *   npm run images                     -> local baseline for missing images (no AI)
 *   npm run images -- --ai             -> AI retouch (Gemini) for missing images
 *   npm run images -- --ai --force     -> regenerate everything
 *   npm run images -- --ai --only=slug -> only one project (or a single file: --only=slug/01.jpg)
 *
 * Planning drawings (kind "plan") are never sent to the AI so no lines or labels get invented.
 * AI results are written to /public/projects and the untouched original is kept in /assets/originals,
 * so every output can be compared against its source before publishing.
 */
import { GoogleGenAI } from "@google/genai";
import { config as loadEnv } from "dotenv";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { projects, type ProjectImage } from "../src/data/projects";

loadEnv({ path: [".env.local", ".env"], quiet: true });

const ROOT = path.resolve(import.meta.dirname, "..");
const ORIGINALS = path.join(ROOT, "assets/originals");
const OUTPUT = path.join(ROOT, "public/projects");
const MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-3-pro-image";
const MAX_WIDTH = 2400;

const args = process.argv.slice(2);
const useAI = args.includes("--ai");
const force = args.includes("--force");
const only = args.find((a) => a.startsWith("--only="))?.split("=")[1];

const PRESERVE = `Strict rules: this is the portfolio of a real architect, so the building must remain exactly the same project.
Keep the exact same camera position, framing, building geometry, proportions, number and position of windows, doors, balconies,
roof shape, materials and colours. Do not add, remove or redesign any architectural element. Do not add text, logos or watermarks.`;

const PROMPTS: Record<Exclude<ProjectImage["kind"], "plan">, string> = {
  photo: `Retouch this photograph of a built architectural project so it looks like it was shot by a professional architectural photographer
with a full-frame camera and a tilt-shift lens. Correct the perspective so vertical lines are perfectly vertical, remove wide-angle
barrel distortion, balance exposure and white balance, recover shadows and highlights, use clean natural daylight and a clear sky,
and render crisp high-resolution detail. Remove distracting temporary elements: people, workers, parked cars and vans, cables,
bins, scaffolding, construction debris and lens flare, reconstructing what is behind them plausibly.
${PRESERVE}`,
  render: `This is a dated architectural 3D render. Re-render it as a contemporary, photorealistic architectural visualization of the same
project: physically based materials, realistic global illumination with soft natural light, believable glass reflections, subtle
Mediterranean vegetation consistent with Granada (Andalusia, Spain), and a calm, high-end editorial look. Replace cartoonish
people, cars or trees with realistic, discreet ones or remove them.
${PRESERVE}`,
  aerial: `Enhance this aerial / masterplan image: increase sharpness and clarity, clean compression artefacts, balance colours and
contrast for a clean, professional presentation. Keep every street, plot, building footprint and label exactly where it is.
${PRESERVE}`,
};

const ASPECT_RATIOS = ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"];

function closestAspectRatio(file: string) {
  const [w, h] = execFileSync("identify", ["-format", "%w %h", `${file}[0]`]).toString().split(" ").map(Number);
  const ratio = w / h;
  return ASPECT_RATIOS.reduce((best, r) => {
    const [a, b] = r.split(":").map(Number);
    const [c, d] = best.split(":").map(Number);
    return Math.abs(Math.log(a / b / ratio)) < Math.abs(Math.log(c / d / ratio)) ? r : best;
  });
}

type Mode = "ai" | "local";

/** Each output is tagged with the mode that produced it, so AI runs can replace local baselines. */
const producedBy = (file: string) =>
  existsSync(file) ? execFileSync("identify", ["-format", "%c", file]).toString().trim() : undefined;

function writeJpeg(input: string | Buffer, out: string, mode: Mode, extra: string[] = []) {
  const fromStdin = Buffer.isBuffer(input);
  execFileSync(
    "convert",
    [
      fromStdin ? "-" : `${input}[0]`,
      "-auto-orient",
      "-colorspace", "sRGB",
      ...extra,
      "-resize", `${MAX_WIDTH}x${MAX_WIDTH}>`,
      "-strip",
      "-set", "comment", mode,
      "-interlace", "Plane",
      "-quality", "84",
      out,
    ],
    fromStdin ? { input } : undefined,
  );
}

function localBaseline(src: string, out: string) {
  writeJpeg(src, out, "local", ["-filter", "Lanczos", "-resize", "1600x1600<", "-unsharp", "0x0.8+0.6+0.02"]);
}

async function aiRetouch(ai: GoogleGenAI, image: ProjectImage, src: string, out: string) {
  const prompt = [PROMPTS[image.kind as keyof typeof PROMPTS], image.notes].filter(Boolean).join("\n");
  const mimeType = src.endsWith(".png") ? "image/png" : "image/jpeg";
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [{ inlineData: { mimeType, data: readFileSync(src).toString("base64") } }, { text: prompt }] }],
    config: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: closestAspectRatio(src), imageSize: "2K" } },
  });
  const data = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData?.data;
  if (!data) throw new Error(`No image returned (${response.candidates?.[0]?.finishReason ?? "unknown reason"})`);
  writeJpeg(Buffer.from(data, "base64"), out, "ai");
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (useAI && !apiKey) throw new Error("GEMINI_API_KEY is missing. Add it to .env.local");
  const ai = useAI ? new GoogleGenAI({ apiKey }) : undefined;

  const images = projects
    .flatMap((p) => p.images)
    .filter((img) => !only || img.file === only || img.file.startsWith(`${only}/`));

  let failed = 0;
  for (const image of images) {
    const src = path.join(ORIGINALS, image.source);
    const out = path.join(OUTPUT, image.file);
    const mode: Mode = ai && image.kind !== "plan" ? "ai" : "local";
    const existing = producedBy(out);
    if (!force && (existing === mode || existing === "ai")) continue;
    mkdirSync(path.dirname(out), { recursive: true });

    process.stdout.write(`${mode.padEnd(5)} ${image.file} ... `);
    try {
      if (mode === "ai") await aiRetouch(ai!, image, src, out);
      else localBaseline(src, out);
      console.log("ok");
    } catch (error) {
      failed++;
      console.log(`FAILED: ${(error as Error).message}`);
    }
  }
  if (failed) process.exitCode = 1;
}

main();
