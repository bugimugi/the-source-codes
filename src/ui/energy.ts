import { ATMOSPHERE, ENERGY_NOTICE, E_KIND_COLOR, E_KIND_SECTION, E_KIND_TAG, SCALE, SCALE_NOTE, SOURCES, THESIS, TOPICS, type EBlockKind, type EDossier } from "../data/energy";
import { LEVEL_LABEL } from "../data/types";
import { mountSlots } from "../assets/slots";
import { initFieldScene, type FieldScene } from "../gl/fieldscene";
import { claimHtml, esc, toggleRedaction } from "./dossierParts";

const ORDER: EBlockKind[] = ["fund", "nutzung", "grenze", "raetsel"];
const ALL = [...SOURCES, ...TOPICS];

export interface EnergyApi { reduceMotion: boolean }

/**
 * "Freie Energie der Erde": hero, the operator's thesis next to what is documented and what speaks against it, an order-of-
 * magnitude strip, seven energy sources and eight topics as "Akten" (drawer), and three computed demos (atmosphere layers,
 * a lightning animation, Earth with its magnetic field). The demos only run while they are on screen. Works without WebGL
 * (the field demo is then replaced by a note).
 */
export function initEnergy(root: HTMLElement, api: EnergyApi) {
  const q = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const file = q<HTMLElement>(".cu-file");
  const body = q<HTMLElement>(".cu-file-body");
  const closeBtn = q<HTMLButtonElement>(".cu-file-close");
  let opener: HTMLElement | null = null;
  let current: EDossier | null = null;
  let active = false;

  // ---- thesis
  q(".eg-thesis").innerHTML = `
    <div class="eg-thesis-head"><span class="eg-tag">These des Betreibers</span><span class="cu-level" style="--c:var(--lvl-${THESIS.level})">${esc(LEVEL_LABEL[THESIS.level])}</span></div>
    <p class="eg-thesis-text">„${esc(THESIS.text)}“</p>
    <div class="eg-cols">
      <div><h3>Was dafür spricht (dokumentiert)</h3><ul>${THESIS.forPoints.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>
      <div><h3>Was dagegen spricht / Einordnung</h3><ul>${THESIS.againstPoints.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>
    </div>
    <p class="eg-note">${esc(THESIS.note)}</p>`;

  // ---- order-of-magnitude strip (logarithmic bars)
  const maxLog = Math.log10(Math.max(...SCALE.map((s) => s.tw))) + 1;
  q(".eg-scale-bars").innerHTML = SCALE.map((s) => `
    <div class="eg-bar"><div class="eg-bar-label">${esc(s.label)}</div>
      <div class="eg-bar-track"><i style="width:${(((Math.log10(s.tw) + 1) / maxLog) * 100).toFixed(1)}%;background:${s.color}"></i></div>
      <div class="eg-bar-text">${esc(s.text)}</div></div>`).join("");
  q(".eg-scale-note").textContent = `Logarithmische Skala: Der Abstand zwischen den Balken ist in Wirklichkeit viel größer, als er aussieht. ${SCALE_NOTE}`;

  // ---- cards
  q(".eg-sources").innerHTML = SOURCES.map((d) => `<button class="eg-src" data-dossier="${d.id}"><div class="eg-src-img" data-slot="${d.slot}" data-fit="cover" data-sizes="(max-width: 700px) 45vw, 14vw"></div><span><strong>${esc(d.name)}</strong><small>${esc(d.sub)}</small></span></button>`).join("");
  q(".eg-topics").innerHTML = TOPICS.map((d) => `<button class="eg-topic" data-dossier="${d.id}"><div class="eg-topic-img" data-slot="${d.slot}" data-fit="cover" data-sizes="(max-width: 700px) 90vw, 30vw"></div><span><strong>${esc(d.name)}</strong><small>${esc(d.sub)}</small></span></button>`).join("");
  q(".eg-notice").textContent = ENERGY_NOTICE;
  mountSlots(root);

  // ---- atmosphere layers
  const atmoEl = q(".eg-atmo");
  atmoEl.innerHTML = `<div class="eg-layers" role="group" aria-label="Atmosphärenschicht wählen">${[...ATMOSPHERE].reverse().map((l) => `<button class="eg-layer" data-layer="${l.id}" aria-pressed="false"><strong>${esc(l.name)}</strong><small>${esc(l.km)}</small></button>`).join("")}</div><div class="eg-layer-text" aria-live="polite"></div>`;
  const layerText = q(".eg-layer-text");
  const showLayer = (id: string) => {
    const l = ATMOSPHERE.find((x) => x.id === id) ?? ATMOSPHERE[0];
    atmoEl.querySelectorAll<HTMLElement>(".eg-layer").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.layer === l.id)));
    layerText.innerHTML = `<h3>${esc(l.name)}</h3><p class="eg-km">${esc(l.km)}</p><p>${esc(l.text)}</p>`;
  };
  showLayer("tropo");

  // ---- lightning (2D canvas, computed)
  const cv = q<HTMLCanvasElement>(".eg-bolt");
  const ctx = cv.getContext("2d")!;
  let boltT = -1, boltPath: [number, number][] = [], boltBranches: [number, number][][] = [], timer = 0, visibleBolt = false, raf = 0;
  const jag = (x0: number, y0: number, x1: number, y1: number, d: number, out: [number, number][]) => {
    if (d < 3) { out.push([x1, y1]); return; }
    const mx = (x0 + x1) / 2 + (Math.random() - 0.5) * d, my = (y0 + y1) / 2 + (Math.random() - 0.5) * d * 0.4;
    jag(x0, y0, mx, my, d / 2, out); jag(mx, my, x1, y1, d / 2, out);
  };
  function newBolt() {
    const w = cv.clientWidth, h = cv.clientHeight;
    const x0 = w * (0.3 + Math.random() * 0.4), y0 = h * 0.34, x1 = x0 + (Math.random() - 0.5) * w * 0.3, y1 = h * 0.94;
    boltPath = [[x0, y0]];
    jag(x0, y0, x1, y1, w * 0.22, boltPath);
    boltBranches = [];
    for (let i = 0; i < 3; i++) {
      const at = boltPath[Math.floor(boltPath.length * (0.25 + Math.random() * 0.5))];
      const br: [number, number][] = [at];
      jag(at[0], at[1], at[0] + (Math.random() - 0.5) * w * 0.35, at[1] + h * (0.15 + Math.random() * 0.2), w * 0.12, br);
      boltBranches.push(br);
    }
    boltT = performance.now();
  }
  function drawBolt(now: number) {
    const dpr = Math.min(devicePixelRatio, 2), w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#0a0f1c"); sky.addColorStop(1, "#05080f");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
    // cloud with charge separation (+ above, − below), the textbook picture
    const flash = boltT > 0 ? Math.max(0, 1 - (now - boltT) / 900) : 0;
    const cloud = ctx.createRadialGradient(w / 2, h * 0.2, 10, w / 2, h * 0.2, w * 0.5);
    cloud.addColorStop(0, `rgba(${90 + flash * 120},${95 + flash * 110},${120 + flash * 120},0.95)`); cloud.addColorStop(1, "rgba(30,34,50,0)");
    ctx.fillStyle = cloud; ctx.beginPath(); ctx.ellipse(w / 2, h * 0.2, w * 0.46, h * 0.17, 0, 0, Math.PI * 2); ctx.fill();
    ctx.font = "600 15px Inter, sans-serif"; ctx.textAlign = "center";
    ctx.fillStyle = "#ff9f9f"; for (let i = 0; i < 5; i++) ctx.fillText("+", w * (0.28 + i * 0.11), h * 0.14);
    ctx.fillStyle = "#9fc3ff"; for (let i = 0; i < 5; i++) ctx.fillText("−", w * (0.28 + i * 0.11), h * 0.26);
    ctx.fillStyle = "#0b1a10"; ctx.fillRect(0, h * 0.94, w, h * 0.06);
    if (flash > 0) {
      const stroke = (p: [number, number][], width: number, a: number) => {
        ctx.beginPath(); p.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.lineWidth = width; ctx.strokeStyle = `rgba(200,215,255,${a})`; ctx.shadowColor = "#9db6ff"; ctx.shadowBlur = 18 * flash; ctx.stroke(); ctx.shadowBlur = 0;
      };
      stroke(boltPath, 5, flash * 0.35); stroke(boltPath, 2, flash);
      boltBranches.forEach((b) => stroke(b, 1.4, flash * 0.8));
    }
  }
  function boltLoop(now: number) {
    drawBolt(now);
    raf = visibleBolt && active && (boltT < 0 || performance.now() - boltT < 1000) ? requestAnimationFrame(boltLoop) : 0;
  }
  const fire = () => { newBolt(); cancelAnimationFrame(raf); raf = requestAnimationFrame(boltLoop); };
  function schedule() {
    clearTimeout(timer);
    if (api.reduceMotion || !visibleBolt || !active) return;
    timer = window.setTimeout(() => { fire(); schedule(); }, 2600 + Math.random() * 2400);
  }
  q(".eg-bolt-btn").addEventListener("click", fire);
  new IntersectionObserver((e) => { visibleBolt = e[0].isIntersecting; if (visibleBolt) { raf = requestAnimationFrame(boltLoop); schedule(); } }).observe(cv);

  // ---- Earth with magnetic field (3D)
  const fcv = q<HTMLCanvasElement>(".eg-field");
  let field: FieldScene | null = null, fieldFailed = false, visibleField = false;
  function syncField() {
    if (!active || !visibleField) { field?.stop(); return; }
    if (!field && !fieldFailed) {
      try { field = initFieldScene(fcv, api.reduceMotion); } catch (err) { fieldFailed = true; console.warn("WebGL not available – magnetic field demo disabled.", err); q(".eg-field-fallback").hidden = false; fcv.hidden = true; }
    }
    field?.start();
  }
  new IntersectionObserver((e) => { visibleField = e[0].isIntersecting; syncField(); }).observe(fcv);

  // ---- the file (drawer)
  function render(d: EDossier) {
    const sections = ORDER.map((k) => {
      const bl = d.blocks.filter((b) => b.kind === k);
      return bl.length ? `<section class="cu-sec"><h3>${E_KIND_SECTION[k]}</h3>${bl.map((b) => `<article class="cu-block"><span class="cu-kind" style="--c:${E_KIND_COLOR[k]}">${E_KIND_TAG[k]}</span><h4>${esc(b.title)}</h4><p>${esc(b.text)}</p></article>`).join("")}</section>` : "";
    }).join("");
    const i = ALL.indexOf(d), prev = ALL[i - 1], next = ALL[i + 1];
    const isSource = SOURCES.includes(d);
    body.innerHTML = `
      <div class="cu-stamp" aria-hidden="true">Pilot · ungeprüft</div>
      <p class="cu-file-no">${isSource ? "Energiequelle" : "Thema"} ${isSource ? SOURCES.indexOf(d) + 1 : TOPICS.indexOf(d) + 1} von ${isSource ? SOURCES.length : TOPICS.length}</p>
      <h2 id="cu-file-title">${esc(d.name)}</h2>
      <p class="cu-tagline">${esc(d.sub)}</p>
      ${sections}
      ${d.claims.length ? `<section class="cu-sec"><h3>Behauptungen &amp; Gegenbelege</h3><p class="cu-small">Diese Aussagen kursieren, sind aber nicht oder nicht ausreichend belegt. Jede steht mit ihrer Belegstufe und den Gegenbelegen da.</p>${d.claims.map((c) => claimHtml(c)).join("")}</section>` : ""}
      <p class="cu-small">Quellen: Source pending verification. ${esc(ENERGY_NOTICE.split(".")[0])}.</p>
      <nav class="cu-file-nav">${prev ? `<button data-dossier="${prev.id}">← ${esc(prev.name)}</button>` : "<span></span>"}${next ? `<button data-dossier="${next.id}">${esc(next.name)} →</button>` : "<span></span>"}</nav>`;
  }
  function open(id: string, from: HTMLElement | null) {
    const d = ALL.find((x) => x.id === id);
    if (!d) return;
    if (file.hidden) opener = from;
    current = d;
    render(d);
    file.hidden = false;
    file.scrollTop = 0;
    root.classList.add("file-open");
    closeBtn.focus();
  }
  function close() {
    if (file.hidden) return;
    file.hidden = true;
    root.classList.remove("file-open");
    current = null;
    opener?.focus();
  }

  root.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    if (toggleRedaction(t)) return;
    const dz = t.closest<HTMLElement>("[data-dossier]");
    if (dz) { open(dz.dataset.dossier!, dz.closest(".cu-file") ? opener : dz); return; }
    const ly = t.closest<HTMLElement>("[data-layer]");
    if (ly) { showLayer(ly.dataset.layer!); return; }
    const sc = t.closest<HTMLElement>("[data-scroll-to]");
    if (sc) q(`.${sc.dataset.scrollTo}`).scrollIntoView({ behavior: api.reduceMotion ? "auto" : "smooth", block: "start" });
  });
  closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !file.hidden && !root.hidden) { e.stopPropagation(); close(); } });

  return {
    /** Opens the page; with an id, the matching file opens right away. */
    start(id?: string) {
      active = true;
      syncField(); schedule();
      if (visibleBolt) raf = requestAnimationFrame(boltLoop);
      if (id) open(id, null);
    },
    stop() { active = false; close(); clearTimeout(timer); cancelAnimationFrame(raf); field?.stop(); },
    get open() { return current?.id ?? null; },
  };
}
