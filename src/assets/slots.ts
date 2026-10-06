import manifest from "virtual:asset-manifest";
import { slotDef, type SlotName } from "./registry";

/**
 * Image slots. Markup: <div data-slot="hero-figure"></div>  (or slotHtml("hero-figure")).
 *  - the box gets the fixed aspect ratio from the registry, so layout never jumps when the image arrives
 *  - data-fit="cover" instead fills the parent (absolute, object-fit: cover) – for full-bleed layers
 *  - no file in public/assets → class "slot-empty" (plain gradient from CSS); the page's own procedural scene can
 *    check hasAsset() and keep drawing
 *  - file present → <picture> with AVIF/WebP/JPG/PNG sources (and -<width> variants as srcset), loaded lazily
 *  - motifs on pure black use mix-blend-mode: screen (CSS class slot-black)
 */
const TYPE: Record<string, string> = { avif: "image/avif", webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" };
const ORDER = ["avif", "webp", "jpg", "jpeg", "png"];
const BASE = "/assets/";

export const hasAsset = (name: string): boolean => name in manifest;

/** `<name>-<w>.<ext>` files become a srcset; the plain `<name>.<ext>` is the default source. */
function sources(name: string): { type: string; srcset: string }[] {
  const files = manifest[name] ?? [];
  const byExt = new Map<string, { url: string; w: number | null }[]>();
  for (const f of files) {
    const m = /^(?:.+?)(?:-(\d+))?\.(\w+)$/.exec(f);
    if (!m) continue;
    const ext = m[2].toLowerCase();
    (byExt.get(ext) ?? byExt.set(ext, []).get(ext)!).push({ url: BASE + f, w: m[1] ? Number(m[1]) : null });
  }
  return ORDER.filter((e) => byExt.has(e)).map((e) => {
    const items = byExt.get(e)!;
    const sized = items.filter((i) => i.w).sort((a, b) => a.w! - b.w!);
    const plain = items.find((i) => !i.w);
    const srcset = [...sized.map((i) => `${i.url} ${i.w}w`), ...(plain && !sized.length ? [plain.url] : [])].join(", ");
    return { type: TYPE[e], srcset: srcset || plain!.url };
  });
}

function pictureHtml(name: string, alt: string, eager: boolean, mobile?: string): string {
  const src = (n: string, media?: string) =>
    sources(n).map((s) => `<source type="${s.type}" srcset="${s.srcset}"${media ? ` media="${media}"` : ""}${/ \d+w/.test(s.srcset) ? ' sizes="100vw"' : ""}>`).join("");
  const fallbackUrl = BASE + (manifest[name].find((f) => /\.(jpe?g|png)$/i.test(f)) ?? manifest[name][0]);
  const dims = slotDef(name)!;
  return `<picture>${mobile && hasAsset(mobile) ? src(mobile, "(max-width: 700px)") : ""}${src(name)}` +
    `<img src="${fallbackUrl}" alt="${alt}" width="${dims.w}" height="${dims.h}" decoding="async" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}></picture>`;
}

function fill(el: HTMLElement): void {
  const name = el.dataset.slot as string;
  const def = slotDef(name);
  if (!def) { console.warn(`Unknown image slot "${name}" – add it to src/assets/registry.ts`); return; }
  el.classList.add("slot", def.bg === "black" ? "slot-black" : "slot-scene");
  el.style.setProperty("--slot-ratio", `${def.w} / ${def.h}`);
  el.dataset.slotLabel = `${name} · ${def.w}×${def.h}`;
  if (el.dataset.fit === "cover") el.classList.add("slot-cover");
  if (!hasAsset(name)) { el.classList.add("slot-empty"); return; }
  // decorative by default; give data-alt when the image carries information
  el.innerHTML = pictureHtml(name, el.dataset.alt ?? "", el.dataset.eager === "true", def.mobile);
  el.classList.remove("slot-empty");
  el.classList.add("slot-filled");
  if (!el.dataset.alt) el.setAttribute("aria-hidden", "true");
}

/** Fills every [data-slot] below `root`. Safe to call again after inserting new markup. */
export function mountSlots(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-slot]").forEach(fill);
}

/** Markup for a slot, for UI built from template strings. Call mountSlots() on the container afterwards. */
export function slotHtml(name: SlotName | `atlas-${string}`, opts: { cover?: boolean; alt?: string; eager?: boolean; className?: string } = {}): string {
  const a = [`data-slot="${name}"`];
  if (opts.cover) a.push('data-fit="cover"');
  if (opts.alt) a.push(`data-alt="${opts.alt}"`);
  if (opts.eager) a.push('data-eager="true"');
  return `<div class="${opts.className ?? ""}" ${a.join(" ")}></div>`;
}
