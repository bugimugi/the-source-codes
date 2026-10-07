import { ORIGIN_LABEL, PART_LABEL, RECIPES, VESSEL_LABEL, type Ingredient, type Origin, type Recipe, type VesselKind } from "../data/recipes";
import { LEVEL_LABEL } from "../data/types";
import { esc } from "./dossierParts";
import type { LabApi } from "./lab";

/** interior of each vessel: a clip path and the vertical range the liquid may fill (viewBox 240 × 230) */
const VESSELS: Record<VesselKind, { body: string; extra: string; clip: string; y0: number; y1: number }> = {
  becher: { body: "M62 62 L178 62 L168 196 Q168 206 158 206 L82 206 Q72 206 72 196 Z", extra: `<path d="M178 88 C226 88 226 166 172 166" fill="none" stroke-width="9"/>`, clip: "M66 66 L174 66 L164 194 Q164 202 156 202 L84 202 Q76 202 76 194 Z", y0: 200, y1: 80 },
  topf: { body: "M36 78 L204 78 L198 190 Q198 206 182 206 L58 206 Q42 206 42 190 Z", extra: `<path d="M36 100 H14 M204 100 H226" fill="none" stroke-width="8"/><path d="M30 78 H210" fill="none" stroke-width="5"/>`, clip: "M42 82 L198 82 L193 188 Q193 202 180 202 L60 202 Q47 202 47 188 Z", y0: 200, y1: 92 },
  schale: { body: "M26 96 H214 C214 168 172 208 120 208 C68 208 26 168 26 96 Z", extra: `<path d="M22 96 H218" fill="none" stroke-width="5"/>`, clip: "M32 100 H208 C206 164 168 202 120 202 C72 202 34 164 32 100 Z", y0: 200, y1: 108 },
  glas: { body: "M68 58 H172 V196 Q172 208 160 208 H80 Q68 208 68 196 Z", extra: `<rect x="62" y="34" width="116" height="22" rx="5" fill="rgba(203,170,103,.25)" stroke-width="4"/>`, clip: "M72 62 H168 V194 Q168 204 158 204 H82 Q72 204 72 194 Z", y0: 202, y1: 76 },
  dampf: { body: "M26 112 H214 C214 176 172 208 120 208 C68 208 26 176 26 112 Z", extra: `<path d="M22 112 H218" fill="none" stroke-width="5"/>`, clip: "M32 116 H208 C206 172 168 202 120 202 C72 202 34 172 32 116 Z", y0: 200, y1: 122 },
  moerser: { body: "M44 104 H196 L182 184 Q180 206 160 206 H80 Q60 206 58 184 Z", extra: `<path d="M150 22 L112 132" fill="none" stroke-width="16" stroke-linecap="round"/>`, clip: "M52 108 H188 L176 182 Q174 200 158 200 H82 Q66 200 64 182 Z", y0: 198, y1: 118 },
  raeucher: { body: "M56 150 H184 C184 190 154 208 120 208 C86 208 56 190 56 150 Z", extra: `<path d="M52 150 H188" fill="none" stroke-width="5"/>`, clip: "M62 154 H178 C176 188 150 202 120 202 C90 202 64 188 62 154 Z", y0: 200, y1: 158 },
};
const SOLID: Part[] = ["wurzel", "blatt", "bluete", "schale", "same", "rinde", "frucht", "pulver"];
type Part = Ingredient["part"];

const fmtN = (n: number) => {
  if (n >= 10) return String(Math.round(n));
  const q = Math.round(n * 4) / 4;
  if (q <= 0) return "etwas";
  const whole = Math.floor(q), frac = q - whole;
  const f = frac === 0.25 ? "¼" : frac === 0.5 ? "½" : frac === 0.75 ? "¾" : "";
  return `${whole || ""}${f}` || "0";
};
const amountText = (i: Ingredient, mult: number) => i.amount <= 0 ? (i.unit || "nach Bedarf") : `${fmtN(i.scales === false ? i.amount : i.amount * mult)} ${i.unit}`.trim();
const hash = (s: string, k: number) => { let h = 2166136261 ^ k; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return ((h >>> 0) % 1000) / 1000; };
const mixColor = (items: { color: string; w: number }[]) => {
  let r = 0, g = 0, b = 0, w = 0;
  for (const it of items) { const n = parseInt(it.color.slice(1), 16); r += ((n >> 16) & 255) * it.w; g += ((n >> 8) & 255) * it.w; b += (n & 255) * it.w; w += it.w; }
  return w ? `rgb(${Math.round(r / w)},${Math.round(g / w)},${Math.round(b / w)})` : "#58D6E8";
};
const ICON: Record<Part, string> = { saft: "💧", schale: "◠", wurzel: "⸙", blatt: "❦", bluete: "✿", same: "∙", rinde: "▤", frucht: "●", pulver: "∴", fluessig: "≈", sonst: "•" };

export function initBench(root: HTMLElement, api: LabApi) {
  let origin: Origin | "alle" = "alle";
  let query = "";
  let recipe: Recipe | null = null;
  let mult = 1;
  let added: string[] = [];
  let stepIdx = 0;
  let mixed = false;
  let timer: { step: number; left: number; handle: number } | null = null;
  const origins = [...new Set(RECIPES.map((r) => r.origin))];

  root.innerHTML = `
    <div class="lb-list">
      <div class="lb-find">
        <label class="lb-search"><span>Was hast du zuhause?</span><input type="search" class="lb-q" placeholder="z. B. Ingwer, Honig, Zitrone, Minze …" autocomplete="off"></label>
        <div class="lb-origins" role="group" aria-label="Herkunft"></div>
      </div>
      <p class="lb-count" aria-live="polite"></p>
      <div class="lb-cards"></div>
    </div>
    <div class="lb-detail" hidden></div>`;
  const listEl = root.querySelector<HTMLElement>(".lb-list")!;
  const cardsEl = root.querySelector<HTMLElement>(".lb-cards")!;
  const countEl = root.querySelector<HTMLElement>(".lb-count")!;
  const detailEl = root.querySelector<HTMLElement>(".lb-detail")!;
  const originsEl = root.querySelector<HTMLElement>(".lb-origins")!;
  const qIn = root.querySelector<HTMLInputElement>(".lb-q")!;

  originsEl.innerHTML = [`<button class="rt-chip" data-origin="alle" aria-pressed="true">Alle</button>`, ...origins.map((o) => `<button class="rt-chip" data-origin="${o}" aria-pressed="false">${esc(ORIGIN_LABEL[o])}</button>`)].join("");

  const totalMinutes = (r: Recipe) => r.steps.reduce((a, s) => a + (s.minutes ?? 0), 0);
  const miniVessel = (k: VesselKind) => `<svg viewBox="0 0 240 230" aria-hidden="true"><g fill="rgba(88,214,232,.08)" stroke="#CBAA67" stroke-width="7" stroke-linejoin="round">${VESSELS[k].extra}<path d="${VESSELS[k].body}"/></g></svg>`;

  function renderList() {
    const q = query.trim().toLowerCase();
    const words = q.split(/[\s,;]+/).filter(Boolean);
    const hay = (r: Recipe) => [r.name, r.tradition, r.provenance, ...(r.keywords ?? []), ...r.ingredients.map((i) => i.name)].join(" ").toLowerCase();
    const list = RECIPES.filter((r) => (origin === "alle" || r.origin === origin) && words.every((w) => hay(r).includes(w)));
    countEl.textContent = RECIPES.length ? `${list.length} von ${RECIPES.length} Rezepten` : "Die Rezeptsammlung wird gerade aufgebaut.";
    originsEl.querySelectorAll<HTMLElement>("[data-origin]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.origin === origin)));
    cardsEl.innerHTML = list.length ? list.map((r) => `
      <button class="lb-card" data-recipe="${r.id}">
        <span class="lb-card-vessel">${miniVessel(r.vessel)}</span>
        <span class="lb-card-body">
          <small class="lb-origin">${esc(ORIGIN_LABEL[r.origin])}</small>
          <strong>${esc(r.name)}</strong>
          <small>${esc(r.provenance)}</small>
          <small class="lb-meta">${r.ingredients.length} Zutaten${totalMinutes(r) ? ` · ${totalMinutes(r)} Min.` : ""} · ${esc(VESSEL_LABEL[r.vessel])}</small>
        </span>
      </button>`).join("") : `<p class="lb-empty">${RECIPES.length ? "Kein Rezept passt. Versuche ein anderes Wort oder „Alle“." : ""}</p>`;
  }

  // ------------------------------------------------------------ vessel picture
  function vesselSvg(r: Recipe) {
    const v = VESSELS[r.vessel];
    const totalVol = r.ingredients.reduce((a, i) => a + (i.vol ?? 1), 0) || 1;
    const span = v.y0 - v.y1;
    let y = v.y0;
    const layers: string[] = [], pieces: string[] = [];
    const items = added.map((id) => r.ingredients.find((i) => i.id === id)!).filter(Boolean);
    const blend = mixColor(items.map((i) => ({ color: i.color, w: i.vol ?? 1 })));
    items.forEach((i, n) => {
      const h = Math.max(7, ((i.vol ?? 1) / totalVol) * span * 0.92);
      y -= h;
      const isNew = n === items.length - 1 && !mixed;
      layers.push(`<rect class="lb-layer${isNew ? " new" : ""}" x="0" y="${y.toFixed(1)}" width="240" height="${(h + 0.6).toFixed(1)}" fill="${mixed ? blend : i.color}" fill-opacity="${mixed ? 0.7 : 0.62}"/>`);
      if (SOLID.includes(i.part)) {
        const count = i.part === "pulver" ? 14 : 6;
        for (let k = 0; k < count; k++) {
          const px = 54 + hash(i.id, k * 2) * 132, py = y + 3 + hash(i.id, k * 2 + 1) * Math.max(2, h - 6);
          const rot = Math.round(hash(i.id, k + 40) * 180);
          pieces.push(i.part === "blatt"
            ? `<path d="M0 0 C4 -6 10 -6 14 0 C10 6 4 6 0 0Z" fill="${i.color}" stroke="rgba(0,0,0,.35)" stroke-width=".6" transform="translate(${px.toFixed(0)} ${py.toFixed(0)}) rotate(${rot})"/>`
            : `<rect x="-4" y="-2.5" width="${i.part === "pulver" ? 2.4 : 8}" height="${i.part === "pulver" ? 2.4 : 5}" rx="1.5" fill="${i.color}" stroke="rgba(0,0,0,.3)" stroke-width=".5" transform="translate(${px.toFixed(0)} ${py.toFixed(0)}) rotate(${rot})"/>`);
        }
      }
    });
    const hot = timer !== null || r.steps.slice(0, stepIdx).some((s) => s.action === "heat");
    const steam = r.vessel === "dampf" || r.vessel === "topf" || hot
      ? `<g class="lb-steam${hot && !api.reduceMotion ? " on" : ""}" fill="none" stroke="#ECE8DE" stroke-width="3" stroke-linecap="round" opacity=".0"><path d="M92 ${v.y1 - 8} q-10 -16 0 -30 q10 -14 0 -28"/><path d="M122 ${v.y1 - 8} q-10 -16 0 -30 q10 -14 0 -28"/><path d="M152 ${v.y1 - 8} q-10 -16 0 -30 q10 -14 0 -28"/></g>` : "";
    const smoke = r.vessel === "raeucher" ? `<g class="lb-steam${added.length && !api.reduceMotion ? " on" : ""}" fill="none" stroke="#bdb7aa" stroke-width="3" stroke-linecap="round" opacity="0"><path d="M112 ${v.y1 - 6} q-14 -22 2 -40 q14 -18 -2 -40"/><path d="M134 ${v.y1 - 6} q-14 -22 2 -40 q14 -18 -2 -40"/></g>` : "";
    return `<svg viewBox="0 0 240 230" class="lb-vessel-svg" role="img" aria-label="${esc(VESSEL_LABEL[r.vessel])}${items.length ? ", enthält: " + items.map((i) => i.name).join(", ") : ", noch leer"}">
      <defs><clipPath id="lb-clip"><path d="${v.clip}"/></clipPath></defs>
      <ellipse cx="120" cy="214" rx="86" ry="9" fill="#000" opacity=".35"/>
      <g clip-path="url(#lb-clip)">${layers.join("")}${pieces.join("")}</g>
      <g fill="none" stroke="#CBAA67" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">${v.extra}<path d="${v.body}" fill="rgba(240,209,139,.06)"/></g>
      ${steam}${smoke}
    </svg>`;
  }

  // ------------------------------------------------------------ detail
  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  function renderDetail() {
    const r = recipe!;
    const idx = RECIPES.indexOf(r);
    const done = stepIdx >= r.steps.length;
    detailEl.innerHTML = `
      <button class="cu-link lb-back">← Alle Rezepte</button>
      <header class="lb-dhead">
        <small class="lb-origin">${esc(ORIGIN_LABEL[r.origin])}</small>
        <h2>${esc(r.name)}</h2>
        <p class="lb-prov">${esc(r.provenance)}</p>
        <p class="lb-trad"><strong>Traditionell:</strong> ${esc(r.tradition)}</p>
      </header>
      <div class="lb-work">
        <figure class="lb-vessel">
          <div class="lb-vessel-pic">${vesselSvg(r)}</div>
          <figcaption>${esc(VESSEL_LABEL[r.vessel])}</figcaption>
          <div class="lb-portion" role="group" aria-label="Portionen">
            <button data-mult="-1" aria-label="Eine Portion weniger" ${mult <= 1 ? "disabled" : ""}>−</button>
            <span><strong>${mult}</strong> × ${esc(r.portion)}</span>
            <button data-mult="1" aria-label="Eine Portion mehr" ${mult >= 6 ? "disabled" : ""}>+</button>
          </div>
        </figure>
        <div class="lb-recipe">
          <h3>Zutaten</h3>
          <ul class="lb-ings">${r.ingredients.map((i) => `
            <li class="${added.includes(i.id) ? "in" : ""}">
              <i class="lb-sw" style="--c:${i.color}" aria-hidden="true"></i>
              <span class="lb-ing-name"><strong>${esc(i.name)}</strong><em class="lb-part">${ICON[i.part]} ${esc(PART_LABEL[i.part])}</em>${i.note ? `<small>${esc(i.note)}</small>` : ""}</span>
              <span class="lb-amt">${esc(amountText(i, mult))}</span>
            </li>`).join("")}</ul>
          <h3>Zubereitung</h3>
          <ol class="lb-steps">${r.steps.map((s, n) => {
            const state = n < stepIdx ? "done" : n === stepIdx ? "now" : "next";
            const running = timer?.step === n;
            return `<li class="${state}">
              <p>${esc(s.text)}${s.add?.length ? `<small class="lb-adds">Hinein: ${s.add.map((id) => esc(r.ingredients.find((i) => i.id === id)?.name ?? id)).join(", ")}</small>` : ""}</p>
              ${state === "now" ? `<div class="lb-step-do">
                ${running ? `<span class="lb-timer" role="timer" aria-live="off"><b class="lb-timer-out">${fmtTime(timer!.left)}</b></span><button class="cu-ghost" data-skip>Zeit überspringen</button>`
                  : `<button class="cu-primary lb-do" data-do>${s.minutes ? `Starten · ${s.minutes} Min.` : s.add?.length ? "Zutat hineingeben" : "Erledigt"}</button>`}</div>` : ""}
            </li>`; }).join("")}</ol>
          <p class="lb-status" aria-live="polite">${done ? "Fertig. Zum Neuausprobieren oben auf „Zurücksetzen“ klicken." : `Schritt ${Math.min(stepIdx + 1, r.steps.length)} von ${r.steps.length}`}</p>
          <button class="cu-link lb-reset">Zurücksetzen</button>
        </div>
      </div>
      <section class="lb-info">
        <div class="lb-box"><h3>Was ist belegt?</h3><span class="cu-level" style="--c:var(--lvl-${r.evidence.level})">${esc(LEVEL_LABEL[r.evidence.level])}</span><p>${esc(r.evidence.text)}</p></div>
        <div class="lb-box warn"><h3>Sicherheit</h3><ul>${r.safety.map((t) => `<li>${esc(t)}</li>`).join("")}</ul><p class="lb-doc"><strong>Wann zum Arzt:</strong> ${esc(r.doctor)}</p></div>
        <div class="lb-box"><h3>Quellen</h3><ul>${r.sources.length ? r.sources.map((s) => `<li>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>` : esc(s.label)}</li>`).join("") : "<li>Source pending verification</li>"}</ul><p class="cu-small">Pilot: nicht fachlich geprüft.</p></div>
      </section>
      <nav class="cu-file-nav">${RECIPES[idx - 1] ? `<button data-recipe="${RECIPES[idx - 1].id}">← ${esc(RECIPES[idx - 1].name)}</button>` : "<span></span>"}${RECIPES[idx + 1] ? `<button data-recipe="${RECIPES[idx + 1].id}">${esc(RECIPES[idx + 1].name)} →</button>` : "<span></span>"}</nav>`;
  }

  function clearTimer() { if (timer) { clearInterval(timer.handle); timer = null; } }
  function finishStep() {
    clearTimer();
    stepIdx++;
    renderDetail();
  }
  function doStep() {
    const r = recipe!;
    const s = r.steps[stepIdx];
    if (!s) return;
    for (const id of s.add ?? []) if (!added.includes(id)) added.push(id);
    if (s.action === "mix") mixed = true;
    if (s.minutes) {
      timer = { step: stepIdx, left: s.minutes * 60, handle: window.setInterval(() => {
        if (!timer) return;
        timer.left--;
        const out = detailEl.querySelector<HTMLElement>(".lb-timer-out");
        if (out) out.textContent = fmtTime(Math.max(0, timer.left));
        if (timer.left <= 0) finishStep();
      }, 1000) };
      renderDetail();
    } else finishStep();
  }

  function open(id: string) {
    const r = RECIPES.find((x) => x.id === id);
    if (!r) return;
    clearTimer();
    recipe = r; mult = 1; added = []; stepIdx = 0; mixed = false;
    listEl.hidden = true; detailEl.hidden = false;
    renderDetail();
    detailEl.scrollIntoView({ block: "start", behavior: api.reduceMotion ? "auto" : "smooth" });
    detailEl.querySelector<HTMLElement>(".lb-back")?.focus({ preventScroll: true });
  }
  function back() {
    clearTimer();
    recipe = null;
    detailEl.hidden = true; listEl.hidden = false;
    renderList();
  }

  root.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const o = t.closest<HTMLElement>("[data-origin]");
    if (o) { origin = o.dataset.origin as Origin | "alle"; renderList(); return; }
    const rc = t.closest<HTMLElement>("[data-recipe]");
    if (rc) { open(rc.dataset.recipe!); return; }
    if (t.closest(".lb-back")) { back(); return; }
    const m = t.closest<HTMLElement>("[data-mult]");
    if (m) { mult = Math.min(6, Math.max(1, mult + Number(m.dataset.mult))); renderDetail(); detailEl.querySelector<HTMLElement>(`[data-mult="${m.dataset.mult}"]`)?.focus({ preventScroll: true }); return; }
    if (t.closest("[data-do]")) { doStep(); detailEl.querySelector<HTMLElement>("[data-skip], [data-do]")?.focus({ preventScroll: true }); return; }
    if (t.closest("[data-skip]")) { finishStep(); detailEl.querySelector<HTMLElement>("[data-do]")?.focus({ preventScroll: true }); return; }
    if (t.closest(".lb-reset")) { clearTimer(); added = []; stepIdx = 0; mixed = false; renderDetail(); return; }
  });
  qIn.addEventListener("input", () => { query = qIn.value; renderList(); });

  renderList();
  return { open, stop() { clearTimer(); if (recipe) renderDetail(); } };
}
