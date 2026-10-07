import type { SystemId } from "../data/crystals";

/**
 * Drawings for the crystal landing page (src/ui/crystals.ts): line pictures of the seven crystal systems and their lattices,
 * the SiO4 building block, a seated figure with the seven chakra points. All computed from vectors, no pictures.
 */
type V = [number, number, number];
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const iso = (p: V): [number, number] => [(p[0] - p[1]) * 0.866, (p[0] + p[1]) * 0.5 - p[2]];
const depth = (p: V) => p[0] + p[1];

/** edge vectors of the unit cell of every system (angles are drawn schematically) */
const CELL: Record<Exclude<SystemId, "hexagonal">, [V, V, V]> = {
  kubisch: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
  tetragonal: [[1, 0, 0], [0, 1, 0], [0, 0, 1.7]],
  orthorhombisch: [[1.4, 0, 0], [0, 0.85, 0], [0, 0, 1.15]],
  monoklin: [[1.3, 0, 0], [0, 0.9, 0], [0.5, 0, 1.05]],
  triklin: [[1.25, 0.2, 0], [0.3, 0.95, 0], [0.5, 0.3, 1.05]],
  trigonal: [[0.9, 0, 0.62], [-0.45, 0.78, 0.62], [-0.45, -0.78, 0.62]],
};

/** fits projected points into a 100 x 100 box with a margin */
function fit(pts: [number, number][], m = 12): (p: [number, number]) => [number, number] {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const s = (100 - 2 * m) / Math.max(x1 - x0, y1 - y0, 1e-6);
  return (p) => [50 + (p[0] - (x0 + x1) / 2) * s, 50 + (p[1] - (y0 + y1) / 2) * s];
}

/** line picture of the unit cell of a crystal system (gold lines, hidden edges dashed) */
export function systemSvg(id: SystemId, uid = "sy"): string {
  const L = (d: string, dash = false) => `<path d="${d}" fill="none" stroke="#F0D18B" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"${dash ? ' stroke-dasharray="2.5 3" opacity=".5"' : ""}/>`;
  let body = "";
  if (id === "hexagonal") {
    const ring = (z: number) => Array.from({ length: 6 }, (_, i): V => [Math.cos((i * Math.PI) / 3 + 0.3), Math.sin((i * Math.PI) / 3 + 0.3), z]);
    const bot = ring(0), top = ring(1.5), all = [...bot, ...top].map(iso), f = fit(all);
    const P = (v: V) => f(iso(v)).map((n) => n.toFixed(1)).join(" ");
    const hidden = bot.map((v, i) => ({ v, i, d: depth(v) })).sort((a, b) => a.d - b.d).slice(0, 2).map((x) => x.i);
    body = L(`M${top.map(P).join("L")}Z`) + bot.map((v, i) => { const a = P(v), b = P(bot[(i + 1) % 6]); return L(`M${a}L${b}`, hidden.includes(i) || hidden.includes((i + 1) % 6)); }).join("") + bot.map((v, i) => L(`M${P(v)}L${P(top[i])}`, hidden.includes(i))).join("");
  } else {
    const [u, v, w] = CELL[id];
    const corners: V[] = [];
    for (const k of [0, 1]) for (const j of [0, 1]) for (const i of [0, 1]) corners.push(add(add([u[0] * i, u[1] * i, u[2] * i], [v[0] * j, v[1] * j, v[2] * j]), [w[0] * k, w[1] * k, w[2] * k]));
    const f = fit(corners.map(iso));
    const P = (c: V) => f(iso(c)).map((n) => n.toFixed(1)).join(" ");
    let hid = 0; corners.forEach((c, i) => { if (depth(c) < depth(corners[hid])) hid = i; });
    const idx = (i: number, j: number, k: number) => i + 2 * j + 4 * k;
    for (const k of [0, 1]) for (const j of [0, 1]) for (const i of [0, 1]) {
      const a = idx(i, j, k);
      for (const b of [i === 0 ? idx(1, j, k) : -1, j === 0 ? idx(i, 1, k) : -1, k === 0 ? idx(i, j, 1) : -1]) if (b >= 0) body += L(`M${P(corners[a])}L${P(corners[b])}`, a === hid || b === hid);
    }
  }
  return `<svg class="kr-sys-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><radialGradient id="${uid}-${id}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F0D18B" stop-opacity=".2"/><stop offset="1" stop-color="#F0D18B" stop-opacity="0"/></radialGradient></defs><circle cx="50" cy="50" r="48" fill="url(#${uid}-${id})"/>${body}</svg>`;
}

/** a 2 x 2 x 2 piece of lattice (violet nodes, light bonds) in the system's cell; without a system an irregular network (glass) */
export function latticeSvg(id: SystemId | null, uid = "la"): string {
  const nodes: V[] = [];
  if (id === null) { for (let i = 0; i < 9; i++) nodes.push([Math.sin(i * 12.9) * 0.9 + 0.5, Math.cos(i * 7.7) * 0.9 + 0.5, Math.sin(i * 3.1) * 0.9 + 0.5]); }
  else {
    const [u, v, w] = id === "hexagonal" ? CELL.trigonal : CELL[id];
    for (const k of [0, 1]) for (const j of [0, 1]) for (const i of [0, 1]) nodes.push(add(add([u[0] * i, u[1] * i, u[2] * i], [v[0] * j, v[1] * j, v[2] * j]), [w[0] * k, w[1] * k, w[2] * k]));
  }
  const f = fit(nodes.map(iso), 14);
  const pts = nodes.map((n) => f(iso(n)));
  const bonds: string[] = [];
  for (let a = 0; a < nodes.length; a++) for (let b = a + 1; b < nodes.length; b++) {
    const bit = (a ^ b) & 7;
    const near = id === null ? Math.hypot(nodes[a][0] - nodes[b][0], nodes[a][1] - nodes[b][1], nodes[a][2] - nodes[b][2]) <= 1.1 : bit === 1 || bit === 2 || bit === 4;
    if (near) bonds.push(`<line x1="${pts[a][0].toFixed(1)}" y1="${pts[a][1].toFixed(1)}" x2="${pts[b][0].toFixed(1)}" y2="${pts[b][1].toFixed(1)}" stroke="#d9ccff" stroke-opacity=".6" stroke-width="1.1"/>`);
  }
  return `<svg class="kr-lat" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><radialGradient id="${uid}-n" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#b07cff"/><stop offset="1" stop-color="#4a2a8a"/></radialGradient></defs>
    ${bonds.join("")}${pts.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.6" fill="url(#${uid}-n)"/>`).join("")}</svg>`;
}

/** the SiO4 tetrahedron: one silicon atom with four oxygen atoms (the building block of quartz) */
export function tetraSvg(uid = "te"): string {
  const o: [number, number][] = [[50, 14], [18, 70], [82, 70], [58, 54]];
  return `<svg class="kr-lat" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
    <radialGradient id="${uid}-s" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#b07cff"/><stop offset="1" stop-color="#4a2a8a"/></radialGradient>
    <radialGradient id="${uid}-o" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".5" stop-color="#e0e6f0"/><stop offset="1" stop-color="#7a8aa6"/></radialGradient></defs>
    <path d="M50 14L18 70L82 70Z M50 14L58 54 M18 70L58 54 M82 70L58 54" fill="none" stroke="#d9ccff" stroke-opacity=".55" stroke-width="1.1"/>
    ${o.map(([x, y]) => `<line x1="50" y1="46" x2="${x}" y2="${y}" stroke="#d9ccff" stroke-width="1.6"/>`).join("")}
    ${o.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="url(#${uid}-o)"/>`).join("")}<circle cx="50" cy="46" r="10" fill="url(#${uid}-s)"/></svg>`;
}

/** a seated figure with the seven chakra points; `active` are the ids (crown first) that are lit, the others stay dim */
export function sittingSvg(uid: string, points: { id: string; color: string }[], active: string[]): string {
  const ys = [26, 52, 80, 112, 140, 168, 198];
  const dots = points.map((p, i) => { const on = active.includes(p.id); return `<circle cx="110" cy="${ys[i]}" r="${on ? 17 : 11}" fill="url(#${uid}-${i})" opacity="${on ? 1 : 0.55}"/><circle cx="110" cy="${ys[i]}" r="${on ? 6 : 4}" fill="${p.color}"/>`; }).join("");
  return `<svg class="kr-sit" viewBox="0 0 220 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sitzende Figur mit den sieben Chakra-Punkten; die dem Kristall zugeordneten leuchten">
    <defs><radialGradient id="${uid}-aura" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#b07cff" stop-opacity=".25"/><stop offset="1" stop-color="#b07cff" stop-opacity="0"/></radialGradient>
    ${points.map((p, i) => `<radialGradient id="${uid}-${i}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${p.color}" stop-opacity=".85"/><stop offset="1" stop-color="${p.color}" stop-opacity="0"/></radialGradient>`).join("")}</defs>
    <ellipse cx="110" cy="130" rx="100" ry="128" fill="url(#${uid}-aura)" stroke="#b07cff" stroke-opacity=".25"/>
    <g fill="none" stroke="#e8e0ff" stroke-opacity=".8" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round">
      <circle cx="110" cy="62" r="20" fill="rgba(160,140,220,.12)"/>
      <path d="M86 94C80 126 82 168 92 204H128C138 168 140 126 134 94C124 84 96 84 86 94Z" fill="rgba(160,140,220,.1)"/>
      <path d="M86 98C66 128 60 168 76 196M134 98C154 128 160 168 144 196" />
      <path d="M44 232C58 200 162 200 176 232C150 252 70 252 44 232Z" fill="rgba(160,140,220,.1)"/><path d="M70 214C90 226 130 226 150 214"/></g>
    ${dots}</svg>`;
}

/** two overlapping circles (vesica) for the 432 Hz item */
export function vesicaSvg(): string {
  return `<svg class="kr-ico-svg" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="none" stroke="#58a8ff" stroke-width="1.6"><circle cx="30" cy="30" r="22"/><circle cx="50" cy="30" r="22"/><circle cx="40" cy="30" r="22" stroke-opacity=".5"/></g><circle cx="40" cy="30" r="3" fill="#9fd8ff"/></svg>`;
}

/** a small atom-like picture for the 963 Hz item */
export function ringsSvg(): string {
  return `<svg class="kr-ico-svg" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="none" stroke="#d9d4f0" stroke-width="1.3">${[0, 60, 120].map((r) => `<ellipse cx="40" cy="30" rx="28" ry="10" transform="rotate(${r} 40 30)"/>`).join("")}</g><circle cx="40" cy="30" r="6" fill="#ffb35a"/><circle cx="40" cy="30" r="11" fill="#ffb35a" opacity=".25"/></svg>`;
}
