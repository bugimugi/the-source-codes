/**
 * Drawn placeholders of the body landing page (src/ui/anatomy.ts): the five life stages and a cell in cross-section. They stand
 * in until the generated pictures exist (`koerper-leben-*`, `koerper-zelle`). Simplified schematic drawings, not anatomy.
 */

const GLOW = (uid: string) => `<defs><radialGradient id="${uid}-g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#58d6e8" stop-opacity=".5"/><stop offset="1" stop-color="#58d6e8" stop-opacity="0"/></radialGradient></defs>`;

/** one standing pictogram: `h` = body height in a 100 x 120 box, `stoop` bends the upper body, `cane` adds a stick */
function figure(h: number, opt: { stoop?: number; cane?: boolean; wide?: number } = {}): string {
  const base = 112, top = base - h, hr = Math.max(5.5, h * 0.075), w = opt.wide ?? 1;
  const sh = top + hr * 2 + 2.5, hip = base - h * 0.47, tw = h * 0.1 * w, sw = h * 0.16 * w, lean = opt.stoop ?? 0, arm = h * 0.34;
  const limb = `fill="none" stroke="#58d6e8" stroke-width="${Math.max(2.4, h * 0.05).toFixed(1)}" stroke-linecap="round" stroke-opacity=".85"`;
  return `<g stroke-linejoin="round">
    <g transform="rotate(${lean} 50 ${hip})">
      <circle cx="50" cy="${top + hr}" r="${hr}" fill="rgba(88,214,232,.2)" stroke="#58d6e8" stroke-width="1.5"/>
      <rect x="${50 - tw}" y="${sh}" width="${2 * tw}" height="${hip - sh}" rx="${tw * 0.45}" fill="rgba(88,214,232,.2)" stroke="#58d6e8" stroke-width="1.5"/>
      <path d="M${50 - sw} ${sh + 4}L${50 - sw - 1.5} ${sh + arm}M${50 + sw} ${sh + 4}L${50 + sw + 1.5} ${sh + arm}" ${limb}/>
    </g>
    <path d="M${50 - tw * 0.5} ${hip}L${50 - tw * 0.55} ${base}M${50 + tw * 0.5} ${hip}L${50 + tw * 0.55} ${base}" ${limb}/>
    ${opt.cane ? `<path d="M${50 + sw + 5} ${sh + arm * 0.8}L${50 + sw + 6.5} ${base}" fill="none" stroke="#f0d18b" stroke-width="1.8" stroke-linecap="round"/>` : ""}
  </g>`;
}

/** life stages: embryo, child, youth, adult, elder */
export function lifeSvg(id: string, uid: string): string {
  let body = "";
  if (id === "embryo") {
    body = `<circle cx="50" cy="60" r="38" fill="rgba(88,214,232,.08)" stroke="#58d6e8" stroke-opacity=".5" stroke-width="1.2" stroke-dasharray="3 3"/>
      <g fill="rgba(240,209,139,.2)" stroke="#f0d18b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="42" cy="46" r="11"/>
      <path d="M50 54c14 2 20 14 14 26-5 9-17 11-26 5M38 82c-5-6-4-14 2-18"/><path d="M62 70c4 2 6 6 5 10"/></g>`;
  } else if (id === "kindheit") body = figure(58);
  else if (id === "jugend") body = figure(86);
  else if (id === "erwachsen") body = figure(98, { wide: 1.05 });
  else body = figure(92, { stoop: 6, cane: true });
  return `<svg class="an-life-svg" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${GLOW(uid)}<ellipse cx="50" cy="112" rx="34" ry="6" fill="url(#${uid}-g)"/>${body}</svg>`;
}

/** a cell in cross-section: membrane, nucleus with nucleolus, mitochondria, endoplasmic reticulum and small vesicles (400 x 280) */
export function cellSvg(uid: string): string {
  const mito = [[120, 90, -20], [290, 70, 25], [300, 200, -35], [110, 205, 15], [210, 235, 5]];
  return `<svg class="an-cell-svg" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><radialGradient id="${uid}-c" cx=".5" cy=".5" r=".55"><stop offset="0" stop-color="#58d6e8" stop-opacity=".28"/><stop offset="1" stop-color="#58d6e8" stop-opacity=".06"/></radialGradient>
    <radialGradient id="${uid}-n" cx=".4" cy=".4" r=".7"><stop offset="0" stop-color="#9a8cff" stop-opacity=".85"/><stop offset="1" stop-color="#3a2a8a" stop-opacity=".8"/></radialGradient></defs>
    <path d="M200 14c70 0 150 40 164 112 12 66-40 142-130 148-84 6-206-30-216-130C8 68 100 14 200 14z" fill="url(#${uid}-c)" stroke="#58d6e8" stroke-width="2.2"/>
    <path d="M200 26c64 0 138 36 150 102" fill="none" stroke="#bfefff" stroke-opacity=".5" stroke-width="1.2"/>
    <g fill="none" stroke="#c07bff" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"><path d="M158 120c-30 4-40 26-28 40 12 14 34 6 40-6M162 134c-20 2-22 14-12 20"/><path d="M246 168c30 4 44 24 30 40-12 12-34 4-38-8M246 182c20 2 22 14 12 20"/></g>
    <g>${mito.map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse rx="26" ry="13" fill="rgba(255,160,70,.28)" stroke="#ffb35a" stroke-width="1.6"/><path d="M-17 0c4-8 7 8 11 0s7 8 11 0 7 8 11 0" fill="none" stroke="#ffb35a" stroke-width="1.2"/></g>`).join("")}</g>
    <circle cx="206" cy="132" r="48" fill="url(#${uid}-n)" stroke="#d6ccff" stroke-width="2"/><circle cx="196" cy="124" r="14" fill="#f0d18b" fill-opacity=".85"/>
    <g fill="#bfefff" fill-opacity=".55">${[[84, 150], [330, 130], [250, 40], [160, 52], [64, 120], [338, 170], [150, 250], [250, 255]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5"/>`).join("")}</g></svg>`;
}

/** a heart for the organ panel while no picture exists: four chambers, aorta, pulmonary artery, venae cavae (200 x 220) */
export function heartSvg(uid: string): string {
  return `<svg class="an-heart-svg" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><radialGradient id="${uid}-h" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#ff7a6a"/><stop offset=".6" stop-color="#c8283a"/><stop offset="1" stop-color="#6a1020"/></radialGradient></defs>
    <path d="M96 52c-6-22 12-40 28-38 4 16-2 30-14 40" fill="#5aa8e8" fill-opacity=".85" stroke="#9fd0ff" stroke-width="1.4"/>
    <path d="M60 60c-14-14-12-34 4-42 6 14 8 26 6 42" fill="#5aa8e8" fill-opacity=".85" stroke="#9fd0ff" stroke-width="1.4"/>
    <path d="M118 56c14-6 34-4 44 10 4 6-2 8-8 6-14-2-26 0-34 4" fill="#d83a4a" stroke="#ffb0a8" stroke-width="1.4"/>
    <path d="M100 206C56 176 22 146 24 106c2-34 30-52 56-44 10 3 16 9 20 14 4-5 10-11 20-14 26-8 54 10 56 44 2 40-34 70-76 100z" fill="url(#${uid}-h)" stroke="#ffb0a8" stroke-width="1.6"/>
    <path d="M100 76c-4 40 2 90 0 130" fill="none" stroke="#ffd0c8" stroke-opacity=".5" stroke-width="1.6"/><path d="M60 100c14 8 28 8 40 0M100 100c14 8 28 8 40 0" fill="none" stroke="#ffd0c8" stroke-opacity=".4" stroke-width="1.2"/>
    <path d="M70 70c-10 14-12 32-6 50" fill="none" stroke="#ffe0d8" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/></svg>`;
}
