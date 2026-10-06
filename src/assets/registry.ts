/**
 * Bild-Slots. Single source of truth for every image position on the site: name, fixed format, background type.
 * Mirrors docs/ASSET-LIST.md (binding). Files live in public/assets/ as <name>.avif|webp|jpg|png,
 * optionally with width variants <name>-<width>.<ext>. Until a file exists the slot shows its fallback.
 */
export interface SlotDef {
  w: number;
  h: number;
  /** "black": glowing motif on pure black, blended with `screen`; "scene": opaque image */
  bg: "black" | "scene";
  /** portrait variant used below 700 px viewport width */
  mobile?: string;
}

const s = (w: number, h: number, bg: SlotDef["bg"] = "scene", mobile?: string): SlotDef => ({ w, h, bg, mobile });
const black = (w: number, h: number): SlotDef => s(w, h, "black");

export const SLOTS = {
  // Priority 1 – hero
  "hero-world": s(3840, 2160, "scene", "hero-mobile"),
  "hero-figure": black(2400, 3000),
  "hero-planets": black(2400, 1600),
  "hero-dna": black(1200, 2400),
  "hero-lotus": black(1600, 1600),
  "hero-bokeh": black(3840, 2160),
  "hero-mobile": s(1080, 1920),
  // Priority 2 – knowledge matrix
  "matrix-quantum-battery": s(1200, 800),
  "matrix-grounding": s(1200, 800),
  "matrix-resonance-sites": s(1200, 800),
  "matrix-frequency-apothecary": s(1200, 800),
  "matrix-organ-nature": s(1200, 800),
  "matrix-center-emblem": black(1200, 800),
  // Priority 3 – body & plants
  "body-front": black(2400, 3600),
  "organ-heart": black(1600, 1600),
  "organ-brain": black(1600, 1600),
  "organ-lungs": black(1600, 1600),
  "organ-liver": black(1600, 1600),
  "organ-stomach": black(1600, 1600),
  "organ-intestines": black(1600, 1600),
  "organ-kidneys": black(1600, 1600),
  "organ-skin": black(1600, 1600),
  "organ-immune": black(1600, 1600),
  "organ-endocrine": black(1600, 1600),
  "heart-botanical": black(2000, 2400),
  "plant-hawthorn": black(1000, 1000),
  "plant-garlic": black(1000, 1000),
  "plant-cacao": black(1000, 1000),
  // Priority 4 – places of resonance
  "globe-earth": black(3000, 3000),
  "site-giza": s(1600, 1000),
  "site-machu-picchu": s(1600, 1000),
  "site-angkor-wat": s(1600, 1000),
  "site-goebekli-tepe": s(1600, 1000),
  "site-malta-hypogeum": s(1600, 1000),
  "site-stonehenge": s(1600, 1000),
  "site-istanbul-mosque-dome": s(1600, 1000),
  "diagram-dome-acoustics": black(1600, 1600),
  "cymatics-1": black(1600, 1600),
  "cymatics-2": black(1600, 1600),
  "cymatics-3": black(1600, 1600),
  // Priority 5 – frequency lab & food
  "lab-waveform-bg": black(3840, 1000),
  "food-organ-signatures": s(1400, 900),
  "food-nutrients-compounds": s(1400, 900),
  "food-diy-lab": s(1400, 900),
  "food-recipes-protocols": s(1400, 900),
  "food-plants-herbs": s(1400, 900),
} as const satisfies Record<string, SlotDef>;

export type SlotName = keyof typeof SLOTS;
