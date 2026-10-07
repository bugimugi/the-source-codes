/**
 * Drawings of the frequency page (src/ui/frequency.ts), used until the generated pictures exist: a night landscape, the gauge of the
 * evidence level, four small pictures for the "Kraft der Frequenz" cards, the resonance curve and the Chladni plate of the explorer.
 * Computed or drawn from vectors, no external pictures.
 */
import { GAUGE_LABELS } from "../data/freqpage";

/** a night sky with stars, mountains, a glow at the horizon and a lake; `lakeOnly` draws just the lower part */
export function landscapeSvg(uid: string): string {
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const stars = Array.from({ length: 90 }, () => { const x = rnd() * 1000, y = rnd() * 250, r = 0.4 + rnd() * 1.1; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" opacity="${(0.35 + rnd() * 0.6).toFixed(2)}"/>`; }).join("");
  return `<svg class="fq-land" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><linearGradient id="${uid}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05071a"/><stop offset=".45" stop-color="#17103a"/><stop offset=".72" stop-color="#4a2150"/><stop offset=".9" stop-color="#c65a2c"/><stop offset="1" stop-color="#f0a050"/></linearGradient>
    <linearGradient id="${uid}-lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d0622c"/><stop offset=".35" stop-color="#3a2150"/><stop offset="1" stop-color="#070514"/></linearGradient>
    <radialGradient id="${uid}-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffb060" stop-opacity=".8"/><stop offset="1" stop-color="#ffb060" stop-opacity="0"/></radialGradient>
    <radialGradient id="${uid}-neb" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#9a6aff" stop-opacity=".45"/><stop offset="1" stop-color="#9a6aff" stop-opacity="0"/></radialGradient></defs>
    <rect width="1000" height="420" fill="url(#${uid}-sky)"/>
    <ellipse cx="170" cy="70" rx="120" ry="60" fill="url(#${uid}-neb)"/><g fill="#fff">${stars}</g>
    <ellipse cx="500" cy="318" rx="360" ry="70" fill="url(#${uid}-glow)"/>
    <path d="M0 340V262L70 214L120 244L190 176L260 250L310 226L380 340Z" fill="#120a28"/><path d="M0 340V292L90 262L170 290L250 268L330 340Z" fill="#0b0618"/>
    <path d="M1000 340V236L930 190L870 246L800 206L720 280L650 262L590 340Z" fill="#120a28"/><path d="M1000 340V288L910 258L830 290L750 266L670 340Z" fill="#0b0618"/>
    <rect y="326" width="1000" height="94" fill="url(#${uid}-lake)"/><path d="M380 336h240M420 346h160M450 358h100" stroke="#ffc880" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/></svg>`;
}

/** concentric sound rings around the chest of the hero figure (animated by CSS unless motion is reduced) */
export function waveRingsSvg(): string {
  return `<svg class="fq-rings" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="none" stroke="#9ad8ff" stroke-width=".5">${[18, 32, 48, 66, 86].map((r, i) => `<circle cx="100" cy="100" r="${r}" opacity="${(0.55 - i * 0.09).toFixed(2)}" style="--i:${i}"/>`).join("")}</g><circle cx="100" cy="100" r="5" fill="#ffe19a" opacity=".9"/></svg>`;
}

/** the half-circle gauge: red to green, five labels, a needle at `pos` (−1 … +1); the needle is moved by CSS */
export function gaugeSvg(): string {
  const cx = 150, cy = 158, R = 116;
  const pt = (deg: number, r: number) => `${(cx + r * Math.cos((deg * Math.PI) / 180)).toFixed(1)},${(cy - r * Math.sin((deg * Math.PI) / 180)).toFixed(1)}`;
  const arc = (a0: number, a1: number, r: number) => `M${pt(a0, r)}A${r},${r} 0 0 1 ${pt(a1, r)}`;
  const spot: [number, number, string][] = [[cx - R, cy + 20, "middle"], [cx - R * 0.707 - 12, cy - R * 0.707 - 6, "end"], [cx, cy - R - 14, "middle"], [cx + R * 0.707 + 12, cy - R * 0.707 - 6, "start"], [cx + R, cy + 20, "middle"]];
  const labels = GAUGE_LABELS.map((t, i) => `<text x="${spot[i][0].toFixed(1)}" y="${spot[i][1].toFixed(1)}" text-anchor="${spot[i][2]}">${t}</text>`).join("");
  const ticks = [0, 1, 2, 3, 4].map((i) => { const deg = 180 - i * 45; return `<line x1="${pt(deg, R - 11).split(",")[0]}" y1="${pt(deg, R - 11).split(",")[1]}" x2="${pt(deg, R + 5).split(",")[0]}" y2="${pt(deg, R + 5).split(",")[1]}" stroke="#ece8de" stroke-opacity=".6" stroke-width="1.2"/>`; }).join("");
  return `<svg class="fq-gauge-svg" viewBox="0 0 300 186" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Anzeige der Belegstufe von Widerlegt bis Gesichert">
    <defs><linearGradient id="fqg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e5483c"/><stop offset=".35" stop-color="#f08a3a"/><stop offset=".55" stop-color="#e6cc4a"/><stop offset="1" stop-color="#2fe068"/></linearGradient></defs>
    <path d="${arc(180, 0, R)}" fill="none" stroke="#0b1020" stroke-width="20" stroke-linecap="round"/><path d="${arc(180, 0, R)}" fill="none" stroke="url(#fqg)" stroke-width="12" stroke-linecap="round"/>
    ${ticks}<g class="fq-gauge-labels">${labels}</g>
    <g class="fq-needle"><path d="M${cx},${cy - R + 18}L${cx - 6},${cy - R + 31}L${cx + 6},${cy - R + 31}z" fill="#ece8de"/><circle cx="${cx}" cy="${cy - R}" r="7" fill="#fff" stroke="#08101a" stroke-width="2.5"/></g></svg>`;
}

const FR = (inner: string, label: string) => `<svg class="fq-pic" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${inner}</svg>`;

export function radioSvg(): string {
  const dial = Array.from({ length: 23 }, (_, i) => `<line x1="${70 + i * 8}" y1="${i % 4 === 0 ? 88 : 94}" x2="${70 + i * 8}" y2="104" stroke="#ffd9a0" stroke-width="1"/>`).join("");
  return FR(`<rect width="400" height="240" fill="#05101c"/>
    <rect x="40" y="56" width="250" height="140" rx="16" fill="#3a2410" stroke="#d09a50" stroke-width="2"/><rect x="58" y="72" width="214" height="48" rx="6" fill="#1a0f06" stroke="#8a6a3a"/>${dial}
    <line x1="160" y1="78" x2="160" y2="114" stroke="#ff5a3c" stroke-width="2"/><g fill="#d0b070"><circle cx="86" cy="158" r="14"/><circle cx="244" cy="158" r="14"/></g>
    <g stroke="#8a6a3a" stroke-width="3" stroke-linecap="round">${[0, 1, 2, 3, 4].map((i) => `<line x1="${124 + i * 14}" y1="140" x2="${124 + i * 14}" y2="178"/>`).join("")}</g>
    <g fill="none" stroke="#58d6e8" stroke-width="2" stroke-linecap="round"><path d="M310 120c14 0 14 0 20-30s14 60 20 0 8 50 14 0 8 30 14 0" /><path d="M306 120h110" opacity=".3"/></g>`, "Gezeichnetes Radio mit Skala und Schallwelle");
}
export function cradleSvg(): string {
  const balls = [0, 1, 2, 3, 4].map((i) => (i === 0 ? `<line x1="146" y1="40" x2="104" y2="150" stroke="#cdb77a"/><circle cx="104" cy="158" r="17" fill="url(#cg)"/>` : `<line x1="${180 + i * 34}" y1="40" x2="${180 + i * 34}" y2="152" stroke="#cdb77a"/><circle cx="${180 + i * 34}" cy="170" r="17" fill="url(#cg)"/>`)).join("");
  return FR(`<defs><radialGradient id="cg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffe9a8"/><stop offset=".5" stop-color="#c88a2a"/><stop offset="1" stop-color="#3a2408"/></radialGradient></defs><rect width="400" height="240" fill="#0a0a14"/>
    <path d="M110 40h250" stroke="#cdb77a" stroke-width="4" stroke-linecap="round"/><path d="M70 214h300" stroke="#6a5a3a" stroke-width="3"/>${balls}
    <g fill="none" stroke="#ffb35a" stroke-width="1.6" opacity=".7"><path d="M330 110c18 14 18 46 0 60"/><path d="M342 96c28 22 28 68 0 90"/><path d="M356 82c38 30 38 90 0 120"/></g>`, "Gezeichnetes Kugelpendel mit goldenen Kugeln");
}
export function levitationSvg(): string {
  return FR(`<rect width="400" height="240" fill="#050d18"/>
    <g fill="none" stroke="#58d6e8" stroke-width="1.4">${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="200" cy="${196 - i * 6}" rx="${150 - i * 18}" ry="${30 - i * 3}" opacity="${(0.8 - i * 0.14).toFixed(2)}"/>`).join("")}</g>
    <ellipse cx="200" cy="96" rx="64" ry="22" fill="#58d6e8" opacity=".12"/>
    <path d="M162 92l22-26 36-8 28 22-6 28-36 10-34-10z" fill="#6b6256" stroke="#a89a82" stroke-width="2"/><path d="M184 66l12 22M220 58l-6 30M248 80l-26 20" stroke="#8a7e6a" stroke-width="1.4"/>
    <g stroke="#ffd9a0" stroke-width="1.6" stroke-linecap="round"><path d="M200 140v-24M192 126l8-10 8 10"/></g>`, "Gezeichneter Stein über einem Schallfeld");
}
export function focusSvg(): string {
  return FR(`<rect width="400" height="240" fill="#0a0a1c"/>
    <g fill="none" stroke="#58a0ff" stroke-width="1.6" stroke-linecap="round" opacity=".85"><path d="M20 30c80 10 150 60 200 90"/><path d="M20 70c70 10 130 36 200 50"/><path d="M20 120h200"/><path d="M20 170c70-10 130-36 200-50"/><path d="M20 210c80-10 150-60 200-90"/></g>
    <circle cx="300" cy="120" r="64" fill="#d83a4a" fill-opacity=".28" stroke="#ff7a8a" stroke-width="2"/><circle cx="300" cy="120" r="22" fill="#8a2ac8" fill-opacity=".45" stroke="#c07bff"/>
    <circle cx="220" cy="120" r="7" fill="#fff"/><circle cx="220" cy="120" r="16" fill="none" stroke="#fff" stroke-opacity=".5"/>`, "Gezeichnete Schallwellen, die auf eine Zelle fokussiert sind");
}
export const POWER_ART: Record<string, () => string> = { radio: radioSvg, resonanz: cradleSvg, levitation: levitationSvg, medizin: focusSvg };

/** amplitude of a driven damped oscillator relative to the static deflection, r = driving frequency / natural frequency */
export const amplitude = (r: number, zeta: number) => 1 / Math.sqrt((1 - r * r) ** 2 + (2 * zeta * r) ** 2);

/** the resonance curve for damping `zeta`, with a marker at the driving ratio `r` (axes fixed: r 0…2, amplitude 0…10) */
export function resonanceSvg(zeta: number, r: number): string {
  const W = 360, H = 170, x = (v: number) => 30 + (v / 2) * (W - 40), y = (a: number) => H - 24 - (Math.min(a, 10) / 10) * (H - 40);
  const pts = Array.from({ length: 121 }, (_, i) => { const v = (i / 120) * 2; return `${x(v).toFixed(1)},${y(amplitude(v, zeta)).toFixed(1)}`; }).join(" ");
  const a = amplitude(r, zeta);
  return `<svg class="fq-res-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Resonanzkurve eines gedämpften Oszillators">
    <g stroke="#ece8de" stroke-opacity=".35" stroke-width="1"><path d="M30 ${H - 24}H${W - 10}M30 ${H - 24}V10"/></g>
    <g fill="#9aa7b4" font-size="9"><text x="${x(0) - 2}" y="${H - 10}">0</text><text x="${x(1) - 12}" y="${H - 10}">Eigenfrequenz</text><text x="${x(2) - 10}" y="${H - 10}">2×</text><text x="2" y="16">Ausschlag</text></g>
    <path d="M${x(1)} ${H - 24}V10" stroke="#f0d18b" stroke-opacity=".4" stroke-dasharray="3 3"/>
    <polyline points="${pts}" fill="none" stroke="#58d6e8" stroke-width="2.2" stroke-linejoin="round"/><polyline points="${pts}" fill="none" stroke="#58d6e8" stroke-width="6" opacity=".18" stroke-linejoin="round"/>
    <circle cx="${x(r)}" cy="${y(a)}" r="5.5" fill="#f0d18b" stroke="#08101a" stroke-width="2"/></svg>`;
}

/** paints the Chladni pattern of mode (m, n) as glowing gold nodal lines on a transparent square (the plate is tilted by CSS) */
export function drawPlate(cv: HTMLCanvasElement, m: number, n: number) {
  const S = cv.width, g = cv.getContext("2d")!;
  const img = g.createImageData(S, S), d = img.data;
  for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
    const x = i / (S - 1), y = j / (S - 1);
    const a = Math.cos(m * Math.PI * x) * Math.cos(n * Math.PI * y) - Math.cos(n * Math.PI * x) * Math.cos(m * Math.PI * y);
    const core = Math.exp(-((a / 0.09) ** 2)), halo = Math.exp(-((a / 0.34) ** 2));
    const k = (j * S + i) * 4;
    d[k] = 255 * Math.min(1, core + halo * 0.35); d[k + 1] = 190 * Math.min(1, core + halo * 0.3); d[k + 2] = 70 * core + 20 * halo; d[k + 3] = 255 * Math.min(1, core * 0.95 + halo * 0.4);
  }
  g.putImageData(img, 0, 0);
}
