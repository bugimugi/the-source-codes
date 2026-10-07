/**
 * Drawings of the breath landing page (src/ui/atem.ts), used until the generated pictures exist: a meditating figure with glowing
 * lungs, drawn from vectors. Simplified schematic drawing, not anatomy.
 */

/** a figure in lotus position, seen from the front, with two lungs and a bronchial tree inside the torso (240 x 300) */
export function meditatorSvg(uid: string): string {
  return `<svg class="at-fig-svg" viewBox="0 0 240 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="${uid}-aura" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#58b8ff" stop-opacity=".4"/><stop offset="1" stop-color="#58b8ff" stop-opacity="0"/></radialGradient>
      <linearGradient id="${uid}-lung" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfefff"/><stop offset=".55" stop-color="#4aa8ff"/><stop offset="1" stop-color="#ff8a3c"/></linearGradient>
      <radialGradient id="${uid}-dia" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff9a3c" stop-opacity=".9"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>
    </defs>
    <ellipse cx="120" cy="140" rx="116" ry="140" fill="url(#${uid}-aura)"/>
    <g fill="rgba(88,184,255,.1)" stroke="#8fd0ff" stroke-opacity=".85" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
      <circle cx="120" cy="50" r="21"/>
      <path d="M110 70v12M130 70v12"/>
      <path d="M82 92C70 100 66 128 66 168L58 206C70 214 82 210 92 200L96 170M158 92C170 100 174 128 174 168L182 206C170 214 158 210 148 200L144 170"/>
      <path d="M82 92C96 82 144 82 158 92C164 120 160 160 150 196H90C80 160 76 120 82 92Z"/>
      <path d="M28 244C44 206 196 206 212 244C186 270 54 270 28 244Z"/><path d="M60 226C86 240 154 240 180 226"/>
    </g>
    <ellipse cx="120" cy="190" rx="40" ry="14" fill="url(#${uid}-dia)"/>
    <g fill="url(#${uid}-lung)" fill-opacity=".7" stroke="#e8f8ff" stroke-width="1.2" stroke-linejoin="round">
      <path d="M112 106C100 106 86 118 86 148C86 170 90 184 100 184C108 184 112 176 112 164Z"/>
      <path d="M128 106C140 106 154 118 154 148C154 170 150 184 140 184C132 184 128 176 128 164Z"/>
    </g>
    <g fill="none" stroke="#ffffff" stroke-opacity=".85" stroke-width="1.3" stroke-linecap="round"><path d="M120 84v34M120 118c-8 6-14 12-18 22M120 118c8 6 14 12 18 22M106 132c-6 4-10 10-12 18M134 132c6 4 10 10 12 18"/></g>
    <circle cx="120" cy="150" r="3" fill="#fff"/>
  </svg>`;
}
