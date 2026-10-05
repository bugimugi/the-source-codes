import "./style.css";
import gsap from "gsap";
import { initParticles } from "./gl/particles";
import { initUniverse } from "./gl/universe";
import { initProofOverlay } from "./ui/proofOverlay";
import { initStage } from "./ui/stage";
import { initAtlas } from "./ui/atlas";
import { claims } from "./data/claims";
import { AREA_LABEL, LEVEL_LABEL, type Area, type EvidenceLevel } from "./data/types";
import { AREA_ORDER } from "./data/areas";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

// WebGL can be unavailable (disabled hardware acceleration, old GPU): the page must still work without it.
const noParticles = { pause() {}, resume() {}, assemble() {} };
let particles: typeof noParticles;
try {
  particles = initParticles($<HTMLCanvasElement>("gl"), reduceMotion);
} catch (err) {
  particles = noParticles;
  $("gl").remove();
  console.warn("WebGL nicht verfügbar – Partikelfeld deaktiviert.", err);
}
const overlay = initProofOverlay();

type View = "hero" | "universe" | "atlas";
let view: View = "hero";
let universe: ReturnType<typeof initUniverse> | null = null;
let atlasView: ReturnType<typeof initAtlas> | null = null;
const matrixEl = $("matrix");
const atlasEl = $("atlas");
const stageEl = $("stage");

const stage = initStage(stageEl, reduceMotion, (id, from) => overlay.open(id, from));

// --- filters (universe)
for (const level of Object.keys(LEVEL_LABEL) as EvidenceLevel[]) {
  const li = document.createElement("li");
  li.style.setProperty("--c", `var(--lvl-${level})`);
  li.textContent = LEVEL_LABEL[level];
  $("legend").append(li);
}
let area: Area | null = null;
let query = "";
const applyFilter = () =>
  universe?.setFilter((c) => (!area || c.area === area) && (!query || c.statement.toLowerCase().includes(query)));
const usedAreas = AREA_ORDER.filter((a) => claims.some((c) => c.area === a));
const chips = usedAreas.map((a) => {
  const b = document.createElement("button");
  b.className = "chip";
  b.textContent = AREA_LABEL[a];
  b.setAttribute("aria-pressed", "false");
  b.addEventListener("click", () => {
    area = area === a ? null : a;
    chips.forEach((c, i) => c.setAttribute("aria-pressed", String(usedAreas[i] === area)));
    applyFilter();
    if (area) universe?.flyToArea(area);
  });
  $("areas").append(b);
  return b;
});
$<HTMLInputElement>("search").addEventListener("input", (e) => {
  query = (e.target as HTMLInputElement).value.trim().toLowerCase();
  applyFilter();
});
$("universe-home").addEventListener("click", () => universe?.home());

// --- view switching
function fade(el: HTMLElement, show: boolean, done?: () => void) {
  if (show) {
    el.hidden = false;
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: reduceMotion ? 0 : 0.6 });
  } else {
    gsap.to(el, { opacity: 0, duration: reduceMotion ? 0 : 0.35, onComplete: () => { el.hidden = true; done?.(); } });
  }
}

function go(next: View) {
  if (next === view) return;
  const prev = view;
  view = next;
  if (prev === "universe") { fade(matrixEl, false, () => universe?.stop()); }
  if (prev === "atlas") { fade(atlasEl, false, () => atlasView?.stop()); }
  if (next === "hero") { particles.resume(); return; }
  particles.pause();
  if (next === "universe") {
    try {
      universe ??= initUniverse($<HTMLCanvasElement>("matrix-gl"), $("matrix-labels"), reduceMotion, (id) => {
        const c = claims.find((x) => x.id === id);
        if (c) {
          // the universe sleeps while a stage is open: two WebGL scenes at once would only slow both down
          universe?.stop();
          stage.open(c, $("leave-matrix"), () => universe?.start());
        }
      });
    } catch (err) {
      console.warn("WebGL nicht verfügbar – Universum nicht darstellbar.", err);
      alert("Das 3D-Universum braucht WebGL. Bitte Hardwarebeschleunigung im Browser aktivieren oder einen anderen Browser nutzen.");
      view = prev; particles.resume();
      return;
    }
    fade(matrixEl, true);
    universe.start();
    $("leave-matrix").focus();
  }
  if (next === "atlas") {
    try {
      atlasView ??= initAtlas(atlasEl, reduceMotion, (id, from) => overlay.open(id, from));
    } catch (err) {
      console.warn("WebGL nicht verfügbar – Atlas nicht darstellbar.", err);
      alert("Der 3D-Atlas braucht WebGL. Bitte Hardwarebeschleunigung im Browser aktivieren oder einen anderen Browser nutzen.");
      view = prev; particles.resume();
      return;
    }
    fade(atlasEl, true);
    atlasView.start();
    $("leave-atlas").focus();
  }
}

$("enter-matrix").addEventListener("click", () => go("universe"));
$("enter-atlas").addEventListener("click", () => go("atlas"));
$("leave-matrix").addEventListener("click", () => go("hero"));
$("leave-atlas").addEventListener("click", () => go("hero"));
document.querySelectorAll<HTMLElement>("[data-goto]").forEach((b) =>
  b.addEventListener("click", () => {
    const target = b.dataset.goto as View;
    // switch directly between universe and atlas
    if (view === "universe" || view === "atlas") {
      const from = view;
      view = "hero";
      if (from === "universe") { matrixEl.hidden = true; universe?.stop(); } else { atlasEl.hidden = true; atlasView?.stop(); }
      go(target);
    }
  }),
);

if (!reduceMotion) {
  const tl = gsap.timeline({ delay: 0.3 });
  tl.from("h1 .line > span", { yPercent: 110, duration: 1.2, ease: "power4.out", stagger: 0.15 })
    .from("[data-reveal]:not(h1)", { opacity: 0, y: 18, duration: 0.9, ease: "power2.out", stagger: 0.18 }, "-=0.8");
  particles.assemble();
}
