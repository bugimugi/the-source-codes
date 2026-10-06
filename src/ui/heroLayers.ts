/**
 * Living versions of two hero pictures. Both take the already mounted image slot, read the picture's URL and replace
 * the slot's content:
 *  - planets: the four planets of `hero-planets` are cut out and each one turns slowly on its own
 *  - DNA: one turn of the helix of `hero-dna` is repeated and scrolled, which reads as the helix rotating
 * The cut-out coordinates are measured on the current artwork; re-measure them when the pictures are replaced.
 * Parallax uses the individual `translate` property and the spin uses `rotate`, so the two never fight.
 */

const urlOf = (slot: HTMLElement): string | null => {
  const img = slot.querySelector("img");
  return img ? img.currentSrc || img.src : null;
};

// Circle of each planet in hero-planets (1536 × 1024 px): centre, radius; placement in % of the hero; spin seconds per turn
const SHEET = { w: 1536, h: 1024 };
const PLANETS = [
  { cx: 473, cy: 352, r: 340, x: 25, y: 10.5, w: 6.6, spin: 260, depth: 8 }, // Earth-like
  { cx: 1146, cy: 368, r: 252, x: 32.8, y: 9.5, w: 4.5, spin: -190, depth: 12 }, // ochre planet
  { cx: 556, cy: 841, r: 148, x: 17.5, y: 14.5, w: 2.6, spin: 150, depth: 17 }, // grey moon
  { cx: 1036, cy: 826, r: 158, x: 37.8, y: 17, w: 2.8, spin: -130, depth: 21 }, // teal planet
];

export interface Moving { el: HTMLElement; depth: number; grow?: number }

export function buildPlanets(slot: HTMLElement): Moving[] {
  const url = urlOf(slot);
  if (!url) return [];
  slot.replaceChildren();
  return PLANETS.map((p) => {
    const el = document.createElement("div");
    el.className = "planet";
    // background-size / -position as percentages: the sheet is cropped to the planet's circle
    el.style.cssText = `left:${p.x}%;top:${p.y}%;width:${p.w}%;background-image:url("${url}");` +
      `background-size:${(SHEET.w / (2 * p.r)) * 100}% auto;` +
      `background-position:${((p.cx - p.r) / (SHEET.w - 2 * p.r)) * 100}% ${((p.cy - p.r) / (SHEET.h - 2 * p.r)) * 100}%;` +
      `--spin:${Math.abs(p.spin)}s;--dir:${p.spin < 0 ? "reverse" : "normal"};`;
    slot.append(el);
    return { el, depth: p.depth };
  });
}

// One full turn of the helix in hero-dna, as fractions of the picture height (two crossings of the same kind)
const DNA = { y0: 0.2424, period: 0.4059, seconds: 9 };

export interface DnaLoop extends Moving { draw(t: number): void }

export function buildDna(slot: HTMLElement, reduceMotion: boolean): DnaLoop | null {
  const url = urlOf(slot);
  if (!url) return null;
  const canvas = document.createElement("canvas");
  canvas.className = "dna-canvas";
  canvas.width = 444;
  canvas.height = 888;
  slot.replaceChildren(canvas);
  const ctx = canvas.getContext("2d");
  const img = new Image();
  let ready = false;
  img.onload = () => { ready = true; draw(0); };
  img.src = url;

  function draw(t: number) {
    if (!ready || !ctx) return;
    const sh = img.naturalHeight * DNA.period, sy = img.naturalHeight * DNA.y0;
    const tile = (sh / img.naturalWidth) * canvas.width; // height of one tile on the canvas
    const off = reduceMotion ? 0 : ((t / DNA.seconds) % 1) * tile;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let k = -1; (k + 1) * tile - off < canvas.height + tile; k++) {
      const y = k * tile + off;
      ctx.drawImage(img, 0, sy, img.naturalWidth, sh, 0, y, canvas.width, tile + 1);
    }
  }
  return { el: canvas, depth: 20, draw };
}
