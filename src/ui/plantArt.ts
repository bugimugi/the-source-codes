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
export function bowlSvg(uid: string, kind: "powder" | "arils" = "powder"): string {
  return `<svg class="pa-bowl" viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><linearGradient id="${uid}-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a30"/><stop offset="1" stop-color="#3f2812"/></linearGradient>
    <radialGradient id="${uid}-p" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#e7cf9f"/><stop offset="1" stop-color="#b58f55"/></radialGradient></defs>
    <ellipse cx="150" cy="206" rx="118" ry="14" fill="#000" opacity=".4"/>
    <path d="M30 108c0 62 52 98 120 98s120-36 120-98z" fill="url(#${uid}-w)" stroke="#2a1a0a"/>
    <ellipse cx="150" cy="108" rx="120" ry="24" fill="#5a3a1c" stroke="#2a1a0a"/>
    <path d="M42 106c14-26 38-52 108-52s94 26 108 52c-18 14-56 22-108 22s-90-8-108-22z" fill="${kind === "arils" ? "#8d1426" : `url(#${uid}-p)`}"/>
    ${kind === "arils" ? `<g>${Array.from({ length: 46 }, (_, i) => { const a = i * 2.4, r = 14 + ((i * 29) % 100); const x = 150 + Math.cos(a) * r * 1.05, y = 92 + Math.sin(a) * r * 0.26; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="#c4223a" stroke="#5a0c18" stroke-width=".8"/><circle cx="${(x - 3).toFixed(1)}" cy="${(y - 3).toFixed(1)}" r="2.4" fill="#fff" fill-opacity=".4"/>`; }).join("")}</g>` : ""}
    <g fill="#8d6a3a" opacity="${kind === "arils" ? 0 : 0.5}">${Array.from({ length: 30 }, (_, i) => `<circle cx="${70 + ((i * 41) % 170)}" cy="${84 + ((i * 17) % 34)}" r="${0.9 + (i % 3) * 0.5}"/>`).join("")}</g>
    <g fill="${kind === "arils" ? "#6a2a1c" : "#a47a48"}" stroke="#5a3a1c" opacity="${kind === "arils" ? 0 : 1}"><rect x="226" y="164" width="62" height="14" rx="7" transform="rotate(-16 257 171)"/><rect x="238" y="186" width="54" height="12" rx="6" transform="rotate(8 265 192)"/><rect x="40" y="170" width="50" height="12" rx="6" transform="rotate(14 65 176)"/></g></svg>`;
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

/** a pomegranate branch with leaves, a red flower, one whole fruit and one cut fruit with arils (640 x 520) */
export function fruitSvg(uid: string, opt: { sketch?: boolean; ground?: boolean } = {}): string {
  const sk = !!opt.sketch, ink = "#4a3a24";
  const skin = sk ? "none" : `url(#${uid}-s)`, aril = sk ? "none" : `url(#${uid}-a)`, lf = sk ? "rgba(120,100,60,.07)" : `url(#${uid}-l)`;
  const edge = sk ? ink : "#4a0b12";
  const leafAt = (x: number, y: number, rot: number, s: number) =>
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${f(s)})"><path d="M0 0C10 -9 38 -10 56 0C38 10 10 9 0 0Z" fill="${lf}" stroke="${sk ? ink : "#26451a"}" stroke-width="${f(1.1 / s)}" stroke-linejoin="round"/><path d="M2 0L52 0" stroke="${sk ? ink : "#26451a"}" stroke-opacity=".5" stroke-width="${f(0.8 / s)}"/></g>`;
  const b1: P[] = [[40, 70], [130, 90], [210, 140], [300, 190]], b2: P[] = [[300, 190], [360, 150], [430, 120], [500, 118]];
  let body = "";
  const twig = (p: P[]) => `<path d="M${p[0]} C${p[1]} ${p[2]} ${p[3]}" fill="none" stroke="${sk ? ink : "#5b4a2c"}" stroke-width="${sk ? 2 : 5}" stroke-linecap="round"/>`;
  body += twig(b1) + twig(b2);
  body += `<path d="M215 250C216 215 208 175 201 135" fill="none" stroke="${sk ? ink : "#5b4a2c"}" stroke-width="${sk ? 2 : 4}" stroke-linecap="round"/>`;
  const L1 = [0.12, 0.26, 0.4, 0.55, 0.7, 0.85], L2 = [0.22, 0.45, 0.68];
  L1.forEach((t, i) => { const [x, y] = bez(b1, t); body += leafAt(x, y, tangent(b1, t) + (i % 2 ? 58 : -58), 1.05 + (i % 3) * 0.12); });
  L2.forEach((t, i) => { const [x, y] = bez(b2, t); body += leafAt(x, y, tangent(b2, t) + (i % 2 ? 60 : -60), 1.0 + (i % 2) * 0.15); });
  body += leafAt(40, 70, tangent(b1, 0) + 180, 0.9) + leafAt(500, 118, 20, 0.85);
  // whole fruit
  body += `<ellipse cx="215" cy="350" rx="108" ry="104" fill="${skin}" stroke="${edge}" stroke-width="1.6"/>`;
  if (!sk) body += `<ellipse cx="178" cy="308" rx="40" ry="22" transform="rotate(-30 178 308)" fill="#fff" fill-opacity=".16"/>`;
  body += `<path d="M188 252L194 228L205 244L215 224L225 244L236 228L242 252Z" fill="${sk ? "none" : "#7a1a1a"}" stroke="${edge}" stroke-width="1.2" stroke-linejoin="round"/>`;
  // cut fruit
  const cx = 410, cy = 345;
  body += `<circle cx="${cx}" cy="${cy}" r="100" fill="${skin}" stroke="${edge}" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="88" fill="${sk ? "none" : "#f2d8c0"}" stroke="${sk ? ink : "#d9b99c"}"/>`;
  let mem = "";
  for (let i = 0; i < 8; i++) { const a = (i / 8) * 6.283 + 0.2; mem += `M${cx} ${cy}L${f(cx + Math.cos(a) * 88)} ${f(cy + Math.sin(a) * 88)}`; }
  body += `<path d="${mem}" stroke="${sk ? ink : "#e4bfa0"}" stroke-width="3" fill="none"/>`;
  const ring = (r: number, n: number, ar: number, off: number) => {
    let s = "";
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 6.283 + off, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      s += `<circle cx="${f(x)}" cy="${f(y)}" r="${ar}" fill="${aril}" stroke="${sk ? ink : "#5a0c18"}" stroke-width=".8"/>${sk ? "" : `<circle cx="${f(x - ar * 0.3)}" cy="${f(y - ar * 0.32)}" r="${f(ar * 0.28)}" fill="#fff" fill-opacity=".35"/>`}`;
    }
    return s;
  };
  body += ring(72, 16, 11.5, 0.1) + ring(47, 9, 12.5, 0.4) + ring(22, 4, 12, 0.2) + ring(0, 1, 11, 0);
  // loose arils
  [[540, 405, 9], [556, 420, 9], [528, 424, 9], [572, 398, 8], [548, 440, 9], [520, 448, 8]].forEach(([x, y, r]) => {
    body += `<circle cx="${x}" cy="${y}" r="${r}" fill="${aril}" stroke="${sk ? ink : "#5a0c18"}" stroke-width=".8"/>${sk ? "" : `<circle cx="${x - 3}" cy="${y - 3}" r="2.4" fill="#fff" fill-opacity=".35"/>`}`;
  });
  // flower
  const petals = Array.from({ length: 6 }, (_, i) => `<ellipse cx="0" cy="-22" rx="13" ry="28" transform="rotate(${i * 60})" fill="${sk ? "none" : `url(#${uid}-f)`}" stroke="${sk ? ink : "#8f2410"}" stroke-width="1"/>`).join("");
  body += `<g transform="translate(500 112)"><path d="M-13 14C-16 38 -9 52 0 58C9 52 16 38 13 14Z" fill="${sk ? "none" : "#a33a1e"}" stroke="${sk ? ink : "#6b200f"}"/>${petals}<circle r="8" fill="${sk ? "none" : "#f6c744"}" stroke="${sk ? ink : "#b88a1c"}"/><g fill="${sk ? ink : "#e8a21c"}">${Array.from({ length: 8 }, (_, i) => `<circle cx="${f(Math.cos(i * 0.785) * 5)}" cy="${f(Math.sin(i * 0.785) * 5)}" r="1.3"/>`).join("")}</g></g>`;
  body += `<g transform="translate(548 158) scale(.55)"><path d="M-12 12C-14 34 -8 46 0 52C8 46 14 34 12 12Z" fill="${sk ? "none" : "#a33a1e"}" stroke="${sk ? ink : "#6b200f"}"/>${petals}</g>`;
  const defs = sk ? "" : `<defs>
    <radialGradient id="${uid}-s" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#e8554a"/><stop offset=".55" stop-color="#b3202a"/><stop offset="1" stop-color="#5c0f17"/></radialGradient>
    <radialGradient id="${uid}-a" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#f4707a"/><stop offset=".6" stop-color="#c4223a"/><stop offset="1" stop-color="#7b1020"/></radialGradient>
    <linearGradient id="${uid}-l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7db055"/><stop offset="1" stop-color="#2f5a22"/></linearGradient>
    <linearGradient id="${uid}-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a3d"/><stop offset="1" stop-color="#d93a1c"/></linearGradient>
    <radialGradient id="${uid}-g" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#d9a640" stop-opacity=".2"/><stop offset="1" stop-color="#d9a640" stop-opacity="0"/></radialGradient>
  </defs>`;
  const glow = sk || opt.ground === false && sk ? "" : `<ellipse cx="320" cy="270" rx="310" ry="250" fill="url(#${uid}-g)"/>`;
  return `<svg class="pa-svg" viewBox="0 0 640 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gezeichnete Darstellung von Zweig, Blüte und Frucht (Platzhalter bis das Bild vorliegt)" preserveAspectRatio="xMidYMid meet">${defs}${glow}${body}</svg>`;
}

/** four small growth-stage drawings of a fruit tree (100 x 130): seedling, flower, green fruit, ripe fruit */
export function fruitStageSvg(stage: number): string {
  const lf = (x: number, y: number, r: number, s: number) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0 0C8 -8 28 -9 40 0C28 9 8 8 0 0Z" fill="#5f9440" stroke="#26451a" stroke-width=".8"/></g>`;
  const soil = `<ellipse cx="50" cy="108" rx="34" ry="8" fill="#1d140b"/>`;
  const twig = `<path d="M50 108C52 84 48 60 56 34" stroke="#5b4a2c" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  const crown = (x: number, y: number, s: number) => `<path d="M${x - 6 * s} ${y}L${x - 4 * s} ${y - 8 * s}L${x} ${y - 3 * s}L${x + 4 * s} ${y - 8 * s}L${x + 6 * s} ${y}Z" fill="#7a1a1a"/>`;
  let g = "";
  if (stage === 0) g = soil + `<path d="M50 108C50 98 49 94 50 88" stroke="#5b4a2c" stroke-width="2.4" fill="none" stroke-linecap="round"/>` + lf(50, 90, -150, 0.5) + lf(50, 90, -30, 0.5);
  else if (stage === 1) {
    const petals = Array.from({ length: 6 }, (_, i) => `<ellipse cy="-6" rx="3.4" ry="7" transform="rotate(${i * 60})" fill="#e8552b" stroke="#8f2410" stroke-width=".6"/>`).join("");
    g = soil + twig + lf(50, 96, -165, 0.8) + lf(51, 82, -15, 0.8) + lf(53, 64, -160, 0.7) + `<g transform="translate(56 34)">${petals}<circle r="2.6" fill="#f6c744"/></g>` + `<g transform="translate(36 54) scale(.7)">${petals}<circle r="2.6" fill="#f6c744"/></g>`;
  } else if (stage === 2) g = soil + twig + lf(50, 96, -165, 0.8) + lf(51, 82, -15, 0.8) + `<circle cx="58" cy="46" r="13" fill="#7fa24a" stroke="#3d5a22"/>` + crown(58, 33, 1) + `<ellipse cx="54" cy="42" rx="4" ry="2.6" fill="#fff" fill-opacity=".25"/>`;
  else g = soil + twig + lf(50, 96, -165, 0.8) + lf(51, 82, -15, 0.8) + `<circle cx="58" cy="50" r="19" fill="#b3202a" stroke="#5c0f17"/>` + crown(58, 31, 1.3) + `<ellipse cx="51" cy="43" rx="6" ry="3.4" transform="rotate(-30 51 43)" fill="#fff" fill-opacity=".25"/>`;
  return `<svg class="pa-stage" viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${g}</svg>`;
}

/** the "pomegranate pattern": seeds packed on a hexagonal lattice inside one circle (the geometric signature of the profile) */
export function seedPatternSvg(uid: string): string {
  const d = 13, pts: P[] = [];
  for (let q = -3; q <= 3; q++) for (let s = -3; s <= 3; s++) if (Math.max(Math.abs(q), Math.abs(s), Math.abs(q + s)) <= 3) pts.push([d * (q + s / 2), d * (Math.sqrt(3) / 2) * s]);
  return `<svg class="pa-fol" viewBox="-56 -56 112 112" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><radialGradient id="${uid}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#f4707a"/><stop offset="1" stop-color="#7b1020"/></radialGradient></defs><circle r="52" fill="none" stroke="#F0D18B" stroke-width="1.4"/><g fill="url(#${uid})" stroke="#F0D18B" stroke-width=".7">${pts.map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="5.6"/>`).join("")}</g></svg>`;
}

/**
 * The tree as a living system (800 x 520): sun, crown, trunk, roots and the fungal network in the soil next to a second tree.
 * Every part sits in a group with `data-flow` so that the page can light up the one that is selected.
 */
export function treeSystemSvg(uid: string): string {
  const stars = Array.from({ length: 36 }, (_, i) => `<circle cx="${(i * 197) % 800}" cy="${(i * 61) % 230}" r="${0.6 + (i % 3) * 0.4}" fill="#fff" opacity="${0.25 + (i % 4) * 0.12}"/>`).join("");
  const blobs: [number, number, number][] = [[400, 118, 70], [330, 142, 62], [470, 142, 62], [290, 178, 52], [510, 178, 52], [360, 176, 60], [440, 176, 60], [400, 70, 50], [340, 96, 48], [462, 96, 48], [400, 160, 58]];
  const crown = blobs.map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${uid}-c${i % 2})" opacity=".96"/>`).join("");
  const roots = [
    "M400 336 C380 360 340 380 292 410 C262 430 236 470 220 506",
    "M400 336 C392 372 372 408 350 440 C340 462 336 490 334 512",
    "M400 336 C404 376 402 416 398 452 C396 478 398 498 400 514",
    "M400 336 C420 366 462 384 506 410 C540 432 556 470 570 506",
    "M400 336 C414 370 430 402 452 430 C466 452 470 484 468 512",
    "M340 380 C312 386 284 404 270 430", "M452 396 C482 406 508 424 524 452", "M292 410 C266 408 242 418 226 440", "M506 410 C532 404 556 412 572 432",
  ];
  const rootPaths = roots.map((d, i) => `<path d="${d}" fill="none" stroke="#a07a45" stroke-width="${i < 5 ? 6 - i * 0.6 : 2.4}" stroke-linecap="round"/>`).join("");
  const hair = Array.from({ length: 18 }, (_, i) => { const x = 230 + i * 19, y = 440 + ((i * 29) % 60); return `<path d="M${x} ${y}c6 8 10 16 8 26" fill="none" stroke="#c9a66b" stroke-width="1" opacity=".6"/>`; }).join("");
  const net = `<path d="M292 410 C340 470 430 482 560 420 M350 440 C420 500 520 494 640 410 M452 430 C520 470 590 458 664 392" fill="none" stroke="#d9b8ff" stroke-width="1.4" stroke-dasharray="3 5" class="bm-dash"/>${[[340, 470], [430, 484], [520, 490], [600, 452]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#f0e0ff"/>`).join("")}`;
  const neighbour = `<path d="M676 336 C672 300 672 262 676 226 L694 226 C698 262 698 300 696 336Z" fill="#5b3f26"/><circle cx="686" cy="196" r="46" fill="url(#${uid}-c0)"/><circle cx="656" cy="226" r="32" fill="url(#${uid}-c1)"/><circle cx="716" cy="226" r="32" fill="url(#${uid}-c1)"/><path d="M686 336 C680 380 660 420 640 450 M686 336 C700 380 716 410 740 440" fill="none" stroke="#a07a45" stroke-width="4" stroke-linecap="round"/>`;
  const shrooms = [[246, 340], [560, 344], [622, 344]].map(([x, y]) => `<path d="M${x - 9} ${y}c0-12 18-12 18 0z" fill="#d9a47a"/><rect x="${x - 2}" y="${y}" width="4" height="9" fill="#efe2cc"/>`).join("");
  return `<svg class="bm-svg" viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gezeichnetes Schaubild: Baum mit Sonne, Krone, Stamm, Wurzeln und Pilzgeflecht im Boden (Platzhalter bis das Bild vorliegt)" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="${uid}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1230"/><stop offset=".7" stop-color="#1b3a4a"/><stop offset="1" stop-color="#2f5a48"/></linearGradient>
      <linearGradient id="${uid}-gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a18"/><stop offset="1" stop-color="#120c07"/></linearGradient>
      <radialGradient id="${uid}-c0" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#8fcf5a"/><stop offset="1" stop-color="#2f6a2a"/></radialGradient>
      <radialGradient id="${uid}-c1" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#6fb04a"/><stop offset="1" stop-color="#24562a"/></radialGradient>
      <radialGradient id="${uid}-sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2b0"/><stop offset=".4" stop-color="#ffd24a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd24a" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="800" height="336" fill="url(#${uid}-sky)"/>${stars}
    <rect y="336" width="800" height="184" fill="url(#${uid}-gr)"/><path d="M0 336 C200 328 600 328 800 336" stroke="#4a6a2a" stroke-width="3" fill="none"/>
    ${neighbour}
    <g data-flow="roots">${rootPaths}${hair}</g>
    <g data-flow="soil">${net}${shrooms}</g>
    <g data-flow="trunk"><path d="M370 342 C380 300 386 250 384 196 L418 196 C416 250 422 300 432 342 Z" fill="#6b4a2c" stroke="#3f2a16" stroke-width="2"/><path d="M394 330 L394 206 M408 330 L408 206" stroke="#3f2a16" stroke-opacity=".5" fill="none"/><path d="M401 336 L401 200" stroke="#58D6E8" stroke-width="3" stroke-linecap="round" fill="none" class="bm-dash" stroke-dasharray="6 8"/></g>
    <g data-flow="leaves">${crown}</g>
    <g data-flow="sun"><circle cx="120" cy="84" r="74" fill="url(#${uid}-sun)"/><circle cx="120" cy="84" r="26" fill="#ffe27a"/><path d="M158 112 L300 160 M170 90 L318 124 M150 130 L280 190" stroke="#ffe27a" stroke-width="2.4" stroke-linecap="round" fill="none" class="bm-dash" stroke-dasharray="4 8"/></g>
    <g data-flow="co2"><path d="M40 250 C120 244 200 220 290 176" stroke="#9be7ff" stroke-width="2.4" fill="none" stroke-linecap="round" class="bm-dash" stroke-dasharray="5 7"/>${[[70, 248], [130, 240], [200, 224]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#9be7ff" opacity=".9"/>`).join("")}</g>
    <g data-flow="o2"><path d="M300 150 C250 120 200 100 150 70" stroke="#b6ffb0" stroke-width="2.4" fill="none" stroke-linecap="round" class="bm-dash" stroke-dasharray="5 7"/>${[[236, 112], [196, 92], [166, 78]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="none" stroke="#b6ffb0" stroke-width="1.6"/>`).join("")}</g>
  </svg>`;
}

/** a torus seen from the side: nested field loops around a small tree (the symbolic "energy flow" picture, 600 x 380) */
export function torusSvg(uid: string): string {
  const loops = Array.from({ length: 7 }, (_, i) => `<ellipse cx="300" cy="190" rx="${250 - i * 30}" ry="${160 - i * 19}" fill="none" stroke="url(#${uid}-g)" stroke-width="${1.6 - i * 0.12}" opacity="${0.9 - i * 0.08}"/>`).join("");
  const arcs = Array.from({ length: 5 }, (_, i) => { const k = 40 + i * 42; return `<path d="M300 24 C${300 + k * 1.7} 70 ${300 + k * 1.7} 310 300 356 C${300 - k * 1.7} 310 ${300 - k * 1.7} 70 300 24" fill="none" stroke="#58D6E8" stroke-width="1" opacity=".5"/>`; }).join("");
  return `<svg class="bm-torus" viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><linearGradient id="${uid}-g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#58D6E8"/><stop offset=".5" stop-color="#F0D18B"/><stop offset="1" stop-color="#58D6E8"/></linearGradient>
    <radialGradient id="${uid}-b" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F0D18B" stop-opacity=".35"/><stop offset="1" stop-color="#58D6E8" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="300" cy="190" rx="260" ry="170" fill="url(#${uid}-b)"/>${loops}${arcs}
    <path d="M300 300 L300 205" stroke="#a07a45" stroke-width="7" stroke-linecap="round"/><circle cx="300" cy="170" r="40" fill="#5fa84a" opacity=".9"/><circle cx="270" cy="188" r="26" fill="#4a9040" opacity=".9"/><circle cx="332" cy="188" r="26" fill="#4a9040" opacity=".9"/>
    <path d="M300 300 C280 322 250 330 226 346 M300 300 C320 322 350 330 374 346 M300 300 L300 346" stroke="#c9a66b" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
}
