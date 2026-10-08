/**
 * Drawings of the chakra landing page (src/ui/chakren.ts), used until the generated pictures exist: the lotus symbol of a chakra and a
 * seated figure with the seven points. Simplified symbolic drawings in the tradition's style, not anatomy.
 */

/** inner markup of a lotus (120 x 120 box): one ring of `petals` petals (crown: three rings, "thousand" drawn symbolically) around a centre */
function lotusInner(uid: string, color: string, petals: number, small: boolean): string {
  const ring = (n: number, len: number, hw: number, op: number, rot = 0) =>
    Array.from({ length: n }, (_, i) => {
      const a = rot + (i * 360) / n;
      return `<path d="M60 60C${60 - hw} ${60 - len * 0.35} ${60 - hw * 0.8} ${60 - len * 0.85} 60 ${60 - len}C${60 + hw * 0.8} ${60 - len * 0.85} ${60 + hw} ${60 - len * 0.35} 60 60Z" transform="rotate(${a.toFixed(1)} 60 60)" fill="${color}" fill-opacity="${op}" stroke="${color}" stroke-opacity=".9" stroke-width="${small ? 2.2 : 1.1}" stroke-linejoin="round"/>`;
    }).join("");
  const n = petals > 24 ? 24 : petals;
  let body: string;
  if (petals === 2) body = ring(2, 54, 20, 0.22, 90);
  else if (petals >= 24) body = ring(24, 56, 7, 0.1) + ring(12, 46, 9, 0.16, 15) + ring(8, 34, 10, 0.22);
  else body = ring(n, 52, n <= 6 ? 17 : n <= 12 ? 11 : 8, 0.2) + (n >= 10 ? ring(Math.round(n / 2), 34, 9, 0.2) : "");
  return `<defs><radialGradient id="${uid}-g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${color}" stop-opacity=".55"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs>
    <circle cx="60" cy="60" r="58" fill="url(#${uid}-g)"/>${body}
    <circle cx="60" cy="60" r="${small ? 11 : 9}" fill="#05070f" stroke="${color}" stroke-width="${small ? 2.2 : 1.2}"/><circle cx="60" cy="60" r="${small ? 4 : 3}" fill="${color}"/>`;
}

/** the lotus of a chakra as a stand-alone drawing (120 x 120) */
export function lotusSvg(uid: string, color: string, petals: number, small = false): string {
  return `<svg class="ch-lotus" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${lotusInner(uid, color, petals, small)}</svg>`;
}

const Y: Record<string, number> = { krone: 44, stirn: 89, hals: 130, herz: 170, solar: 207, sakral: 240, wurzel: 270 };

/** a seated figure in lotus position (300 x 400) with the seven points along the middle line; `active` is drawn large and pulses */
export function figureSvg(uid: string, points: { id: string; color: string }[], active: string): string {
  const dots = points.map((p) => {
    const on = p.id === active, y = Y[p.id] ?? 200;
    return `<g ${on ? 'class="ch-pulse"' : ""}><circle cx="150" cy="${y}" r="${on ? 30 : 13}" fill="url(#${uid}-${p.id})" opacity="${on ? 1 : 0.7}"/><circle cx="150" cy="${y}" r="${on ? 8 : 4.5}" fill="${p.color}" stroke="#fff" stroke-opacity="${on ? 0.9 : 0.5}" stroke-width="1.2"/></g>`;
  }).join("");
  const act = points.find((p) => p.id === active);
  return `<svg class="ch-fig-svg" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sitzende Figur mit den sieben Chakra-Punkten">
    <defs><radialGradient id="${uid}-aura" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${act?.color ?? "#a46be0"}" stop-opacity=".38"/><stop offset="1" stop-color="${act?.color ?? "#a46be0"}" stop-opacity="0"/></radialGradient>
    ${points.map((p) => `<radialGradient id="${uid}-${p.id}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${p.color}" stop-opacity=".95"/><stop offset=".5" stop-color="${p.color}" stop-opacity=".35"/><stop offset="1" stop-color="${p.color}" stop-opacity="0"/></radialGradient>`).join("")}</defs>
    <ellipse cx="150" cy="200" rx="136" ry="196" fill="url(#${uid}-aura)"/>
    <g transform="translate(116 10) scale(.5667)" opacity="${active === "krone" ? 1 : 0.55}">${lotusInner(`${uid}-lot`, points.find((p) => p.id === "krone")?.color ?? "#a46be0", 24, false)}</g>
    <g fill="none" stroke="#efe8ff" stroke-opacity=".85" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
      <ellipse cx="150" cy="92" rx="20" ry="24" fill="rgba(170,150,230,.14)"/>
      <path d="M142 114v15M158 114v15"/>
      <path d="M142 129C124 131 108 137 101 151C95 168 104 204 118 230C122 246 120 262 116 276H184C180 262 178 246 182 230C196 204 205 168 199 151C192 137 176 131 158 129Z" fill="rgba(170,150,230,.1)"/>
      <path d="M101 151C84 178 78 226 84 262C86 277 90 289 96 300M199 151C216 178 222 226 216 262C214 277 210 289 204 300"/>
      <circle cx="96" cy="303" r="6" fill="rgba(170,150,230,.22)"/><circle cx="204" cy="303" r="6" fill="rgba(170,150,230,.22)"/>
      <path d="M44 336C60 292 110 282 150 282C190 282 240 292 256 336C226 362 74 362 44 336Z" fill="rgba(170,150,230,.1)"/><path d="M70 326C110 346 190 346 230 326"/>
      <path d="M150 66V282" stroke-dasharray="2 5" stroke-opacity=".5"/>
    </g>${dots}</svg>`;
}
