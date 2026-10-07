/**
 * Placeholder illustrations drawn in code for the plant profile pages. They stand in until the user's own pictures
 * (`plant-<id>-*`, see docs/ASSET-LIST.md) exist, and they are generated from a few colours so every plant gets one.
 * Plants are images on this site, not 3D models; this is a flat drawing, no model.
 */
type P = [number, number];

const bez = (p: P[], t: number): P => {
  const u = 1 - t;
  return [
    u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
    u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1],
  ];
};
const tangent = (p: P[], t: number): number => {
  const a = bez(p, Math.max(0, t - 0.01)), b = bez(p, Math.min(1, t + 0.01));
  return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
};
const f = (n: number) => n.toFixed(1);

export interface ArtOptions {
  /** pen-and-ink look on parchment instead of colour */
  sketch?: boolean;
  /** main leaf colour; the berry colour; the root colour */
  leaf?: string;
  berry?: string;
  root?: string;
  /** draw the berries / flowers / roots (false: leaves only) */
  berries?: boolean;
  flowers?: boolean;
  roots?: boolean;
  /** dark soil under the plant (default true) */
  ground?: boolean;
}

/** One leaf pointing along +x (length 1), placed with a transform. */
function leaf(x: number, y: number, rot: number, size: number, fill: string, stroke: string): string {
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${f(size)})"><path d="M0 0C14 -22 44 -24 62 0C44 24 14 22 0 0Z" fill="${fill}" stroke="${stroke}" stroke-width="${f(1.2 / size)}" stroke-linejoin="round"/><path d="M2 0L56 0M16 0L30 -11M16 0L30 11M32 0L46 -9M32 0L46 9" fill="none" stroke="${stroke}" stroke-opacity=".55" stroke-width="${f(0.9 / size)}" stroke-linecap="round"/></g>`;
}

function flower(x: number, y: number, r: number, sketch: boolean): string {
  const petals = Array.from({ length: 5 }, (_, i) => `<ellipse cx="0" cy="${f(-r * 0.95)}" rx="${f(r * 0.42)}" ry="${f(r * 0.85)}" transform="rotate(${i * 72})"/>`).join("");
  return `<g transform="translate(${f(x)} ${f(y)})" fill="${sketch ? "none" : "#f3eec2"}" stroke="${sketch ? "#4a3a24" : "#b9ad63"}" stroke-width="1">${petals}<circle r="${f(r * 0.32)}" fill="${sketch ? "none" : "#c9a93c"}" stroke="${sketch ? "#4a3a24" : "none"}"/></g>`;
}

/** a berry in its papery husk (calyx) hanging from (x, y) */
function berry(x: number, y: number, s: number, o: Required<Pick<ArtOptions, "berry" | "sketch">>, uid: string): string {
  const husk = `M0 0C-9 4 -14 17 -10 29Q0 38 10 29C14 17 9 4 0 0Z`;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})">
    <circle cx="0" cy="21" r="10" fill="${o.sketch ? "none" : `url(#${uid}-b)`}" stroke="${o.sketch ? "#4a3a24" : "#6a140e"}" stroke-width="1"/>
    <path d="${husk}" fill="${o.sketch ? "none" : "rgba(214,196,130,.34)"}" stroke="${o.sketch ? "#4a3a24" : "#b2a05c"}" stroke-width="1"/>
    <path d="M0 0L0 31M-4 3L-6 29M4 3L6 29" stroke="${o.sketch ? "#4a3a24" : "#b2a05c"}" stroke-opacity=".6" stroke-width=".7" fill="none"/></g>`;
}

/**
 * A whole plant (stems, leaves, flowers, berries, a cut berry with seeds and the root) in a 640 x 520 box.
 * The positions of flowers, leaves, berries, seeds and root are fixed so that the callouts of the profile data match:
 * root ~ (50 %, 83 %), leaves ~ (32 %, 40 %), flower ~ (64 %, 30 %), berries ~ (71 %, 52 %), seeds ~ (83 %, 73 %).
 */
export function plantSvg(uid: string, opt: ArtOptions = {}): string {
  const sketch = !!opt.sketch;
  const leafC = opt.leaf ?? "#6f9a43", berryC = opt.berry ?? "#c8402c", rootC = opt.root ?? "#b98a55";
  const ink = "#4a3a24";
  const lf = sketch ? "rgba(120,100,60,.07)" : `url(#${uid}-l)`;
  const lfS = sketch ? ink : "#2c4a1c";
  const stems: P[][] = [
    [[320, 332], [318, 272], [300, 212], [286, 132]],
    [[322, 332], [332, 282], [368, 224], [420, 160]],
    [[318, 332], [300, 288], [256, 252], [198, 214]],
    [[321, 332], [336, 270], [342, 200], [354, 112]],
    [[322, 332], [352, 306], [402, 284], [452, 266]],
  ];
  const leafAt: { s: number; t: number; side: 1 | -1; size: number }[] = [
    { s: 0, t: 0.35, side: -1, size: 0.95 }, { s: 0, t: 0.55, side: 1, size: 1.05 }, { s: 0, t: 0.75, side: -1, size: 1.1 }, { s: 0, t: 0.9, side: 1, size: 0.9 },
    { s: 1, t: 0.4, side: 1, size: 1.0 }, { s: 1, t: 0.6, side: -1, size: 1.1 }, { s: 1, t: 0.8, side: 1, size: 0.95 },
    { s: 2, t: 0.35, side: 1, size: 1.1 }, { s: 2, t: 0.55, side: -1, size: 1.2 }, { s: 2, t: 0.75, side: 1, size: 1.3 }, { s: 2, t: 0.92, side: -1, size: 1.1 },
    { s: 3, t: 0.4, side: -1, size: 1.0 }, { s: 3, t: 0.6, side: 1, size: 1.1 }, { s: 3, t: 0.8, side: -1, size: 1.05 },
    { s: 4, t: 0.4, side: 1, size: 0.9 }, { s: 4, t: 0.7, side: -1, size: 0.95 },
  ];
  let body = "";
  for (const st of stems) body += `<path d="M${st[0]} C${st[1]} ${st[2]} ${st[3]}" fill="none" stroke="${sketch ? ink : "#5b4a2c"}" stroke-width="${sketch ? 2 : 4}" stroke-linecap="round"/>`;
  for (let i = 0; i < stems.length; i++) {
    const st = stems[i];
    body += leaf(st[3][0], st[3][1], tangent(st, 1), 1.0, lf, lfS);
  }
  leafAt.forEach((l, i) => {
    const st = stems[l.s], [x, y] = bez(st, l.t);
    const rot = tangent(st, l.t) + l.side * (52 + (i % 3) * 7);
    body += leaf(x, y, rot, l.size, lf, lfS);
  });
  if (opt.flowers !== false) {
    body += flower(420, 161, 11, sketch) + flower(346, 150, 8, sketch) + flower(248, 244, 8, sketch) + flower(300, 168, 7, sketch);
  }
  if (opt.berries !== false) {
    const o = { berry: berryC, sketch };
    body += berry(440, 270, 1.05, o, uid) + berry(466, 276, 0.95, o, uid) + berry(418, 282, 0.9, o, uid) + berry(352, 214, 0.8, o, uid) + berry(300, 196, 0.8, o, uid);
    // a cut berry showing seeds (to the right, at ~ 83 % / 73 %)
    const seeds = Array.from({ length: 11 }, (_, i) => {
      const a = (i / 11) * 6.283, r = 7 + (i % 3) * 3;
      return `<ellipse cx="${f(Math.cos(a) * r)}" cy="${f(Math.sin(a) * r)}" rx="2.4" ry="1.6" transform="rotate(${f((a * 180) / Math.PI)} ${f(Math.cos(a) * r)} ${f(Math.sin(a) * r)})"/>`;
    }).join("");
    body += `<g transform="translate(530 380)"><circle r="23" fill="${sketch ? "none" : `url(#${uid}-b)`}" stroke="${sketch ? ink : "#6a140e"}"/><circle r="15" fill="${sketch ? "none" : "#efd9a8"}" stroke="${sketch ? ink : "none"}"/><g fill="${sketch ? "none" : "#c79a52"}" stroke="${sketch ? ink : "#8a6a30"}" stroke-width=".6">${seeds}</g></g>`;
    body += `<g fill="${sketch ? "none" : "#d9b66e"}" stroke="${sketch ? ink : "#8a6a30"}" stroke-width=".6"><ellipse cx="568" cy="420" rx="4" ry="2.6"/><ellipse cx="580" cy="432" rx="4" ry="2.6" transform="rotate(30 580 432)"/><ellipse cx="556" cy="436" rx="4" ry="2.6" transform="rotate(-20 556 436)"/></g>`;
  }
  let root = "";
  if (opt.roots !== false) {
    const rf = sketch ? "none" : `url(#${uid}-r)`, rs = sketch ? ink : "#5a3a1c";
    const shapes = [
      "M308 332C300 372 296 420 300 470C302 490 306 504 312 512C320 496 324 470 326 440C328 400 330 370 332 332Z",
      "M304 372C282 384 262 404 252 432C248 444 250 452 256 446C268 424 286 408 306 396Z",
      "M300 420C282 436 272 456 270 480C270 490 276 490 278 482C284 462 294 448 304 440Z",
      "M330 380C352 392 372 412 380 440C383 452 378 456 372 450C362 428 346 412 328 402Z",
      "M326 430C344 446 354 466 354 490C354 498 348 498 346 490C342 472 334 458 324 448Z",
    ];
    root += shapes.map((d) => `<path d="${d}" fill="${rf}" stroke="${rs}" stroke-width="1.4" stroke-linejoin="round"/>`).join("");
    root += `<g fill="none" stroke="${sketch ? ink : "#3a2410"}" stroke-opacity="${sketch ? 0.7 : 0.4}" stroke-width="1" stroke-linecap="round"><path d="M304 350c8 4 20 4 26 0M302 382c8 4 20 4 26 0M300 414c8 4 20 4 25 0M300 446c8 3 18 3 24 0M304 478c6 3 14 3 18 0"/><path d="M252 446c-8 6-14 14-18 24M248 440c-10 2-20 8-26 16M270 482c-4 8-6 14-6 22M372 452c6 6 10 14 12 24M380 444c8 2 16 8 20 16M354 492c2 8 2 14 0 20M300 500c-8 4-14 8-18 14M318 508c6 4 10 8 12 14"/></g>`;
  }
  const defs = sketch ? "" : `<defs>
    <linearGradient id="${uid}-l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${leafC}"/><stop offset="1" stop-color="#3d6a2a"/></linearGradient>
    <linearGradient id="${uid}-r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${rootC}"/><stop offset="1" stop-color="#7a5230"/></linearGradient>
    <radialGradient id="${uid}-b" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ee6a52"/><stop offset=".6" stop-color="${berryC}"/><stop offset="1" stop-color="#7c1a12"/></radialGradient>
    <radialGradient id="${uid}-g" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="#d9a640" stop-opacity=".22"/><stop offset="1" stop-color="#d9a640" stop-opacity="0"/></radialGradient>
    <linearGradient id="${uid}-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1d11"/><stop offset="1" stop-color="#120c07" stop-opacity="0"/></linearGradient>
  </defs>`;
  const ground = sketch || opt.ground === false ? sketch ? "" : `<ellipse cx="320" cy="260" rx="300" ry="250" fill="url(#${uid}-g)"/>` : `<ellipse cx="320" cy="260" rx="300" ry="250" fill="url(#${uid}-g)"/><path d="M40 338Q320 316 600 338L620 520H20Z" fill="url(#${uid}-s)"/><g fill="#6b5130" fill-opacity=".5">${Array.from({ length: 26 }, (_, i) => `<circle cx="${60 + ((i * 97) % 520)}" cy="${344 + ((i * 53) % 150)}" r="${1 + (i % 3) * 0.6}"/>`).join("")}</g>`;
  return `<svg class="pa-svg" viewBox="0 0 640 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gezeichnete Darstellung der Pflanze (Platzhalter bis das Bild vorliegt)" preserveAspectRatio="xMidYMid meet">${defs}${ground}${root}${body}</svg>`;
}

/** five small growth-stage drawings (100 x 130): seedling, growth, bloom, fruit, root */
export function stageSvg(uid: string, stage: number, o: { leaf?: string; berry?: string; root?: string } = {}): string {
  const lc = o.leaf ?? "#6f9a43", bc = o.berry ?? "#c8402c", rc = o.root ?? "#b98a55";
  const soil = `<ellipse cx="50" cy="104" rx="34" ry="8" fill="#1d140b"/>`;
  const lf = (x: number, y: number, r: number, s: number) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0 0C8 -12 24 -13 34 0C24 13 8 12 0 0Z" fill="${lc}" stroke="#2c4a1c" stroke-width=".9"/><path d="M1 0L30 0" stroke="#2c4a1c" stroke-opacity=".5" stroke-width=".8"/></g>`;
  const stem = (h: number) => `<path d="M50 104C50 ${104 - h * 0.5} 49 ${104 - h * 0.8} 50 ${104 - h}" stroke="#5b4a2c" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  let g = "";
  if (stage === 0) g = soil + stem(18) + lf(50, 88, -150, 0.55) + lf(50, 88, -30, 0.55);
  else if (stage === 1) g = soil + stem(56) + lf(50, 90, -160, 0.7) + lf(50, 90, -20, 0.7) + lf(50, 74, -150, 0.7) + lf(50, 74, -30, 0.7) + lf(50, 58, -125, 0.6) + lf(50, 58, -55, 0.6) + lf(50, 48, -90, 0.5);
  else if (stage === 2) {
    const fl = (x: number, y: number) => `<g transform="translate(${x} ${y})" fill="#f3eec2" stroke="#b9ad63" stroke-width=".7">${Array.from({ length: 5 }, (_, i) => `<ellipse cy="-4.4" rx="2.4" ry="4.4" transform="rotate(${i * 72})"/>`).join("")}<circle r="1.8" fill="#c9a93c" stroke="none"/></g>`;
    g = soil + stem(64) + lf(50, 92, -160, 0.65) + lf(50, 92, -20, 0.65) + lf(50, 76, -150, 0.65) + lf(50, 76, -30, 0.65) + lf(50, 62, -135, 0.55) + fl(34, 54) + fl(66, 46) + fl(50, 36);
  } else if (stage === 3) {
    const br = (x: number, y: number) => `<g transform="translate(${x} ${y})"><circle cy="9" r="5.4" fill="${bc}" stroke="#6a140e" stroke-width=".7"/><path d="M0 0C-5 2 -8 9 -5.5 15Q0 20 5.5 15C8 9 5 2 0 0Z" fill="rgba(214,196,130,.38)" stroke="#b2a05c" stroke-width=".7"/></g>`;
    g = soil + stem(64) + lf(50, 92, -160, 0.65) + lf(50, 92, -20, 0.65) + lf(50, 76, -150, 0.6) + lf(50, 76, -30, 0.6) + br(36, 52) + br(62, 46) + br(50, 36) + br(70, 64);
  } else g = `<path d="M44 20C42 44 40 70 42 96C43 106 46 112 50 116C54 108 56 96 57 80C58 58 58 40 56 20Z" fill="${rc}" stroke="#5a3a1c"/><path d="M42 60C32 66 26 78 24 92M44 82C36 90 34 100 34 108M57 64C66 70 72 82 74 96M56 88C62 96 64 104 64 110" stroke="${rc}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M43 36c5 2 10 2 13 0M42 54c5 2 10 2 14 0M42 72c5 2 10 2 14 0" stroke="#3a2410" stroke-opacity=".35" fill="none"/>`;
  return `<svg class="pa-stage" viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-uid="${uid}">${g}</svg>`;
}

/** wooden bowl with powder and dried root pieces (320 x 240) */
export function bowlSvg(uid: string): string {
  return `<svg class="pa-bowl" viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><linearGradient id="${uid}-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a30"/><stop offset="1" stop-color="#3f2812"/></linearGradient>
    <radialGradient id="${uid}-p" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#e7cf9f"/><stop offset="1" stop-color="#b58f55"/></radialGradient></defs>
    <ellipse cx="150" cy="206" rx="118" ry="14" fill="#000" opacity=".4"/>
    <path d="M30 108c0 62 52 98 120 98s120-36 120-98z" fill="url(#${uid}-w)" stroke="#2a1a0a"/>
    <ellipse cx="150" cy="108" rx="120" ry="24" fill="#5a3a1c" stroke="#2a1a0a"/>
    <path d="M42 106c14-26 38-52 108-52s94 26 108 52c-18 14-56 22-108 22s-90-8-108-22z" fill="url(#${uid}-p)"/>
    <g fill="#8d6a3a" opacity=".5">${Array.from({ length: 30 }, (_, i) => `<circle cx="${70 + ((i * 41) % 170)}" cy="${84 + ((i * 17) % 34)}" r="${0.9 + (i % 3) * 0.5}"/>`).join("")}</g>
    <g fill="#a47a48" stroke="#5a3a1c"><rect x="226" y="164" width="62" height="14" rx="7" transform="rotate(-16 257 171)"/><rect x="238" y="186" width="54" height="12" rx="6" transform="rotate(8 265 192)"/><rect x="40" y="170" width="50" height="12" rx="6" transform="rotate(14 65 176)"/></g></svg>`;
}

/** simple glowing figure for the "Wirkung" panel (200 x 360); the lines mark the nervous system */
export function figureSvg(uid: string): string {
  return `<svg class="pa-fig" viewBox="0 0 200 360" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><linearGradient id="${uid}-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#58D6E8" stop-opacity=".55"/><stop offset="1" stop-color="#147A91" stop-opacity=".12"/></linearGradient>
    <radialGradient id="${uid}-h" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff9a3c" stop-opacity=".9"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient></defs>
    <circle cx="100" cy="52" r="34" fill="url(#${uid}-h)"/>
    <path d="M100 18c-18 0-28 14-28 32s10 30 28 30 28-12 28-30-10-32-28-32zM84 84v12c-22 4-40 14-44 40l-6 90 18 4 8-70 14 100h60l14-100 8 70 18-4-6-90c-4-26-22-36-44-40V84z" fill="url(#${uid}-f)" stroke="#58D6E8" stroke-opacity=".75" stroke-width="1.4"/>
    <path d="M100 44v220M100 110c-20 8-36 24-44 52M100 110c20 8 36 24 44 52M100 160c-12 16-18 34-20 56M100 160c12 16 18 34 20 56" fill="none" stroke="#ffb35a" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>
    <g fill="#ffd9a0">${[44, 110, 160, 214, 264].map((y) => `<circle cx="100" cy="${y}" r="3.2"/>`).join("")}</g></svg>`;
}

/** the Flower of Life: 19 circles of equal radius on a hexagonal lattice, inside one outer circle */
export function flowerOfLifeSvg(): string {
  const r = 17, pts: P[] = [];
  for (let q = -2; q <= 2; q++) for (let s = -2; s <= 2; s++) if (Math.max(Math.abs(q), Math.abs(s), Math.abs(q + s)) <= 2) pts.push([r * (q + s / 2), r * (Math.sqrt(3) / 2) * s]);
  return `<svg class="pa-fol" viewBox="-60 -60 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="none" stroke="#F0D18B" stroke-width=".9" stroke-opacity=".85">${pts.map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}"/>`).join("")}<circle r="${r * 3}" stroke-width="1.4"/></g></svg>`;
}
