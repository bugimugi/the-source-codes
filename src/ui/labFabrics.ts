import { FABRICS, FABRIC_CLAIM, FABRIC_NOTICE, FABRIC_SOURCES, GROUP_LABEL, type Fabric, type FabricGroup } from "../data/fabrics";
import { claimHtml, esc, toggleRedaction } from "./dossierParts";
import type { LabApi } from "./lab";

const W = 300, H = 430;
const PATTERNS: Record<Fabric["weave"], { w: number; h: number; svg: (c: string) => string }> = {
  plain: { w: 6, h: 6, svg: (c) => `<rect width="6" height="6" fill="${c}"/><path d="M0 3H6M3 0V6" stroke="rgba(0,0,0,.12)" stroke-width=".8"/>` },
  slub: { w: 12, h: 10, svg: (c) => `<rect width="12" height="10" fill="${c}"/><path d="M0 3H12M0 8H12" stroke="rgba(0,0,0,.16)" stroke-width="1.1"/><path d="M3 0V10M9 0V10" stroke="rgba(255,255,255,.1)" stroke-width="1"/>` },
  rib: { w: 6, h: 6, svg: (c) => `<rect width="6" height="6" fill="${c}"/><path d="M1.5 0V6M4.5 0V6" stroke="rgba(0,0,0,.18)" stroke-width="1.2"/>` },
  knit: { w: 10, h: 10, svg: (c) => `<rect width="10" height="10" fill="${c}"/><path d="M0 8 L5 2 L10 8" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="1.3"/>` },
  smooth: { w: 10, h: 10, svg: (c) => `<rect width="10" height="10" fill="${c}"/><path d="M-2 12 L12 -2" stroke="rgba(255,255,255,.12)" stroke-width="2"/>` },
};

/**
 * Fabric station: a mannequin wears the chosen fabric; next to it a symbolic meter shows the CLAIM of the energetic tradition
 * (no number, no unit: there is no measurement method) and a plain list shows what textile science describes. The claim itself
 * is a redacted bar with evidence level and counter-evidence, like on the dossier pages.
 */
export function initFabrics(root: HTMLElement, api: LabApi) {
  let a = FABRICS.find((f) => f.id === "baumwolle")!;
  let b: Fabric | null = null;
  let slot: "a" | "b" = "a";
  let raf = 0, t = 0, active = false;

  root.innerHTML = `
    <div class="cu-journey-head"><h2>Stoffe</h2><p>Eine Puppe trägt, was du wählst. Die Überlieferung der Energiemedizin sagt, Kleidung beeinflusse die „Frequenz“ des Körpers. Hier siehst du diese Vorstellung als Bild und daneben, was an den Stoffen tatsächlich beschrieben ist.</p></div>
    <div class="fb">
      <div class="fb-stage">
        <div class="fb-figs"></div>
        <label class="fb-compare"><input type="checkbox" class="fb-cmp"> Zwei Stoffe nebeneinander vergleichen</label>
      </div>
      <div class="fb-side">
        <h3>Stoff wählen</h3>
        <div class="fb-pick" role="group" aria-label="Stoff"></div>
        <div class="fb-info" aria-live="polite"></div>
      </div>
    </div>
    <div class="fb-claim"><h3>Die Behauptung</h3>${claimHtml({ text: FABRIC_CLAIM.text, level: FABRIC_CLAIM.level, counter: FABRIC_CLAIM.counter })}</div>
    <p class="cu-small fb-note"></p>
    <ul class="fb-src cu-small">${FABRIC_SOURCES.map((x) => `<li>${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.label)}</a>` : esc(x.label)}</li>`).join("")}</ul>`;
  const figs = root.querySelector<HTMLElement>(".fb-figs")!;
  const pick = root.querySelector<HTMLElement>(".fb-pick")!;
  const info = root.querySelector<HTMLElement>(".fb-info")!;
  const cmp = root.querySelector<HTMLInputElement>(".fb-cmp")!;
  root.querySelector<HTMLElement>(".fb-note")!.textContent = FABRIC_NOTICE;

  const order: FabricGroup[] = ["natur", "halb", "kunst"];
  pick.innerHTML = order.map((g) => `<div class="fb-group"><small>${esc(GROUP_LABEL[g])}</small><div>${FABRICS.filter((f) => f.group === g).map((f) => `<button class="rt-chip" data-fabric="${f.id}" aria-pressed="false" style="--c:${f.color}"><i></i>${esc(f.name)}</button>`).join("")}</div></div>`).join("");

  /** one mannequin, wearing the fabric, with its symbolic field around it */
  function figureSvg(f: Fabric, id: string) {
    const lvl = f.claim;
    return `<svg class="fb-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Puppe in ${esc(f.name)}. Darstellung der Behauptung: ${lvl > 0.6 ? "Feld angehoben" : lvl > 0.3 ? "Feld mittel" : "Feld gedämpft"}.">
      <defs>
        <pattern id="fb-w-${id}" width="${PATTERNS[f.weave].w}" height="${PATTERNS[f.weave].h}" patternUnits="userSpaceOnUse">${PATTERNS[f.weave].svg(f.color)}</pattern>
        <radialGradient id="fb-aura-${id}"><stop offset="0" stop-color="#F0D18B" stop-opacity="${(0.1 + 0.55 * lvl).toFixed(2)}"/><stop offset="1" stop-color="#58D6E8" stop-opacity="0"/></radialGradient>
      </defs>
      <ellipse class="fb-aura" cx="150" cy="215" rx="${(78 + 66 * lvl).toFixed(0)}" ry="${(138 + 66 * lvl).toFixed(0)}" fill="url(#fb-aura-${id})"/>
      <g class="fb-wave" data-lvl="${lvl}" fill="none" stroke="${lvl > 0.5 ? "#F0D18B" : "#8a93a3"}" stroke-width="2" stroke-linecap="round" opacity="${(0.35 + 0.5 * lvl).toFixed(2)}"></g>
      <!-- stand -->
      <path d="M150 330 V404 M96 410 H204" stroke="#6b645a" stroke-width="7" stroke-linecap="round" fill="none"/>
      <!-- mannequin body -->
      <path d="M112 120 C128 112 172 112 188 120 C198 126 204 150 200 190 C198 230 196 270 192 330 H108 C104 270 102 230 100 190 C96 150 102 126 112 120 Z" fill="#2a2f36" stroke="#6b645a" stroke-width="1.5"/>
      <path d="M135 96 C135 112 139 120 150 122 C161 120 165 112 165 96 Z" fill="#2a2f36" stroke="#6b645a" stroke-width="1.5"/>
      <ellipse cx="150" cy="66" rx="30" ry="38" fill="#2f353d" stroke="#6b645a" stroke-width="1.5"/>
      <!-- garment: shirt with short sleeves -->
      <path class="fb-garment" d="M114 118 C130 125 170 125 186 118 L224 144 L206 182 L192 170 C194 210 196 250 192 322 H108 C104 250 106 210 108 170 L94 182 L76 144 Z" fill="url(#fb-w-${id})" stroke="rgba(0,0,0,.45)" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M130 120 C140 134 160 134 170 120" fill="none" stroke="rgba(0,0,0,.4)" stroke-width="2"/>
      <path d="M150 134 V320" stroke="rgba(0,0,0,.12)" stroke-width="1.5"/>
    </svg>
    <p class="fb-cap"><strong>${esc(f.name)}</strong><small>${esc(GROUP_LABEL[f.group])}</small></p>
    <div class="fb-meter" role="img" aria-label="Darstellung der Behauptung, keine Messung: ${lvl > 0.6 ? "angehoben" : lvl > 0.3 ? "mittel" : "gedämpft"}"><span>gedämpft</span><i><b style="left:${(lvl * 100).toFixed(0)}%"></b></i><span>angehoben</span></div>
    <p class="fb-meter-note">Darstellung der Behauptung · keine Messung</p>`;
  }

  function render() {
    const list = b && cmp.checked ? [a, b] : [a];
    figs.className = `fb-figs n${list.length}`;
    figs.innerHTML = list.map((f, i) => `<figure class="fb-fig${(i === 0 ? "a" : "b") === slot && list.length > 1 ? " active" : ""}" data-slot="${i === 0 ? "a" : "b"}">${figureSvg(f, i === 0 ? "a" : "b")}</figure>`).join("");
    pick.querySelectorAll<HTMLElement>("[data-fabric]").forEach((el) => el.setAttribute("aria-pressed", String(el.dataset.fabric === a.id || (cmp.checked && el.dataset.fabric === b?.id))));
    info.innerHTML = list.map((f) => `<article class="fb-card"><h4>${esc(f.name)}</h4><p>${esc(f.text)}</p><p class="fb-claimline"><strong>Behauptung:</strong> ${esc(f.claimText)}${f.circulating ? `<small>Zahl in diesen Listen: ${esc(f.circulating)}. Ungeprüft, keine belegte Einheit.</small>` : ""}</p><dl>${f.facts.map((x) => `<div><dt>${esc(x.label)}</dt><dd>${esc(x.value)}</dd></div>`).join("")}</dl></article>`).join("");
    draw();
  }

  /** the field line: calm and bright for a high claim, flat and dull for a low one; moves gently */
  function draw() {
    figs.querySelectorAll<SVGGElement>(".fb-wave").forEach((g) => {
      const lvl = Number(g.dataset.lvl);
      const amp = 4 + 22 * lvl, len = 70 - 34 * lvl;
      const phase = api.reduceMotion ? 0 : t * (0.6 + 1.6 * lvl);
      const line = (x0: number) => {
        let d = "";
        for (let y = 40; y <= 390; y += 6) d += `${d ? "L" : "M"}${(x0 + Math.sin(y / len * 6.283 + phase) * amp).toFixed(1)} ${y} `;
        return d;
      };
      g.innerHTML = `<path d="${line(40)}"/><path d="${line(260)}"/>`;
    });
  }
  function loop(now = performance.now()) {
    t = now / 1000;
    draw();
    raf = active && !api.reduceMotion ? requestAnimationFrame(loop) : 0;
  }

  root.addEventListener("click", (e) => {
    const el = e.target as HTMLElement;
    if (toggleRedaction(el)) return;
    const p = el.closest<HTMLElement>("[data-fabric]");
    if (p) {
      const f = FABRICS.find((x) => x.id === p.dataset.fabric)!;
      if (cmp.checked) { if (slot === "a") a = f; else b = f; slot = slot === "a" ? "b" : "a"; } else a = f;
      render();
      return;
    }
    const fg = el.closest<HTMLElement>(".fb-fig");
    if (fg && cmp.checked) { slot = fg.dataset.slot as "a" | "b"; render(); }
  });
  cmp.addEventListener("change", () => { if (cmp.checked && !b) b = FABRICS.find((f) => f.id === "polyester")!; slot = "a"; render(); });

  render();
  return {
    start() { active = true; if (!raf) raf = requestAnimationFrame(loop); },
    stop() { active = false; cancelAnimationFrame(raf); raf = 0; },
  };
}
