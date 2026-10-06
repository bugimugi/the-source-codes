import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/500.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource-variable/inter";
import "./style.css";
import gsap from "gsap";
import { initHero, type HeroApi, type HeroPin } from "./gl/hero";
import { initParticles } from "./gl/particles";
import { initUniverse } from "./gl/universe";
import { initProofOverlay } from "./ui/proofOverlay";
import { initStage } from "./ui/stage";
import { initAtlas } from "./ui/atlas";
import { initSearch } from "./ui/search";
import { claims } from "./data/claims";
import { atlas } from "./data/atlas";
import { AREA_LABEL, LEVEL_LABEL, isSettled, type Area, type EvidenceLevel } from "./data/types";
import { AREA_ORDER } from "./data/areas";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const html = document.documentElement;
if (!reduceMotion) html.classList.add("intro");

// ---------------------------------------------------------------- hero (with WebGL fallbacks)
const PINS: (HeroPin & { title: string; claimIds: string[] })[] = [
  { id: "neural", label: "NEURAL NETWORK", title: "Neural network", claimIds: [] },
  { id: "plants", label: "PLANT COMPOUNDS", title: "Plant compounds", claimIds: ["willow-bark", "kamille-traditional-use", "signature-doctrine"] },
  { id: "dna", label: "DNA", title: "DNA", claimIds: [] },
  { id: "bioelectric", label: "CELLULAR BIOELECTRICITY", title: "Cellular bioelectricity", claimIds: ["membrane-potential"] },
];

const classic = new URLSearchParams(location.search).get("hero") === "classic";
const noHero: HeroApi = {
  pause() {}, resume() {}, resize() {}, onPin() {}, resetCamera() {},
  buildIntro: () => gsap.timeline({ paused: true }),
  transitionOut: () => Promise.resolve(),
};
let hero: HeroApi = noHero;
try {
  if (classic) {
    // the original particle hero stays available at /?hero=classic
    const p = initParticles($<HTMLCanvasElement>("gl"), reduceMotion);
    hero = { ...noHero, pause: p.pause, resume: p.resume, buildIntro: () => gsap.timeline({ paused: true }).add(() => p.assemble(), 0) };
  } else {
    hero = initHero($<HTMLCanvasElement>("gl"), $("pins"), PINS, reduceMotion);
  }
} catch (err) {
  // WebGL can be unavailable (disabled hardware acceleration, old GPU): the page must still work without it.
  $("gl").remove();
  console.warn("WebGL not available – hero scene disabled.", err);
}

const overlay = initProofOverlay();
hero.onPin((id) => {
  const pin = PINS.find((p) => p.id === id);
  if (!pin) return;
  overlay.openGroup({ title: pin.title, subtitle: "Verified Knowledge Reference", claimIds: pin.claimIds }, document.querySelector<HTMLElement>(`[data-pin="${id}"]`) ?? document.body);
});

// ---------------------------------------------------------------- honest stats from the real data
{
  const sources = claims.flatMap((c) => c.sources);
  const reviewed = claims.filter(isSettled).length;
  const pending = claims.length - reviewed;
  const stat = (n: string | number, l: string) => `<div><dd>${n}</dd><dt>${l}</dt></div>`;
  $("stats").innerHTML =
    stat(claims.length, "Graded Claims") + stat(reviewed, "Expert-Reviewed") + stat(sources.length, "Sources Listed") +
    stat(atlas.length, "Encyclopedia Entries") + stat("∞", "Expanding Universe");
  // Pilot: unreviewed content is allowed while the site is built, but it must never look final.
  // The banner disappears by itself once every published claim has been reviewed by an expert.
  const notice = $("notice");
  notice.innerHTML = (pending > 0
    ? `<strong class="pilot">PILOT VERSION – ${pending} of ${claims.length} statements are awaiting expert review. Not for public release.</strong> `
    : "") + "Information only – not medical advice. Content does not replace medical treatment; never stop medication without consulting a doctor.";
}

// ---------------------------------------------------------------- manifesto
const manifesto = $("manifesto");
const setManifesto = (open: boolean) => {
  manifesto.hidden = !open;
  if (open) manifesto.querySelector<HTMLElement>("[data-close]")?.focus();
};
$("open-manifesto").addEventListener("click", () => setManifesto(true));
$("open-manifesto-nav").addEventListener("click", () => setManifesto(true));
manifesto.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => setManifesto(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !manifesto.hidden) setManifesto(false); });

// ---------------------------------------------------------------- views
type View = "hero" | "universe" | "atlas";
let view: View = "hero";
let universe: ReturnType<typeof initUniverse> | null = null;
let atlasView: ReturnType<typeof initAtlas> | null = null;
const matrixEl = $("matrix");
const atlasEl = $("atlas");
const stageEl = $("stage");
const nav = $("nav");
const pinsEl = $("pins");
const stage = initStage(stageEl, reduceMotion, (id, from) => overlay.open(id, from));

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

function fade(el: HTMLElement, show: boolean, done?: () => void) {
  if (show) {
    el.hidden = false;
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: reduceMotion ? 0 : 0.6 });
  } else {
    gsap.to(el, { opacity: 0, duration: reduceMotion ? 0 : 0.35, onComplete: () => { el.hidden = true; done?.(); } });
  }
}

function setChrome(forHero: boolean) {
  nav.hidden = !forHero;
  pinsEl.hidden = !forHero;
  $("notice")?.toggleAttribute("hidden", !forHero);
}

function openUniverse(instant = false): boolean {
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
    console.warn("WebGL not available – universe cannot be shown.", err);
    alert("The 3D universe needs WebGL. Please enable hardware acceleration in your browser or use another browser.");
    return false;
  }
  if (instant) { matrixEl.hidden = false; matrixEl.style.opacity = "1"; } else fade(matrixEl, true);
  universe.start();
  $("leave-matrix").focus();
  return true;
}

function openAtlas(): boolean {
  try {
    atlasView ??= initAtlas(atlasEl, reduceMotion, (id, from) => overlay.open(id, from));
  } catch (err) {
    console.warn("WebGL not available – atlas cannot be shown.", err);
    alert("The 3D atlas needs WebGL. Please enable hardware acceleration in your browser or use another browser.");
    return false;
  }
  fade(atlasEl, true);
  atlasView.start();
  $("leave-atlas").focus();
  return true;
}

function go(next: View, opts: { instant?: boolean } = {}) {
  if (next === view) return;
  const prev = view;
  if (next === "universe" && !openUniverse(opts.instant)) return;
  if (next === "atlas" && !openAtlas()) return;
  view = next;
  if (prev === "universe") fade(matrixEl, false, () => universe?.stop());
  if (prev === "atlas") fade(atlasEl, false, () => atlasView?.stop());
  if (next === "hero") { hero.resetCamera(); hero.resume(); setChrome(true); }
  else { hero.pause(); setChrome(false); }
}

/** Cinematic entry: the camera flies into the brain, light floods the screen, the universe opens. */
async function enterLibrary() {
  if (view !== "hero") return;
  const flash = $("flash");
  const t = gsap.to(flash, { opacity: 1, duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.8, ease: "power2.in" });
  await hero.transitionOut();
  await t;
  go("universe", { instant: true });
  universe?.intro();
  gsap.to(flash, { opacity: 0, duration: reduceMotion ? 0 : 1.2, ease: "power2.out" });
}

$("enter-matrix").addEventListener("click", enterLibrary);
document.querySelectorAll<HTMLElement>("[data-view]").forEach((b) =>
  b.addEventListener("click", () => (b.dataset.view === "atlas" ? go("atlas") : void enterLibrary())),
);
$("leave-matrix").addEventListener("click", () => go("hero"));
$("leave-atlas").addEventListener("click", () => go("hero"));
document.querySelectorAll<HTMLElement>("[data-goto]").forEach((b) =>
  b.addEventListener("click", () => {
    const target = b.dataset.goto as View;
    if (view === "universe" || view === "atlas") {
      const from = view;
      view = "hero";
      if (from === "universe") { matrixEl.hidden = true; universe?.stop(); } else { atlasEl.hidden = true; atlasView?.stop(); }
      go(target);
    }
  }),
);

// ---------------------------------------------------------------- knowledge search
initSearch($<HTMLInputElement>("nav-search"), $("search-results"), (it) => {
  if (it.kind === "claim") overlay.open(it.id, $("nav-search"));
  else { go("atlas"); atlasView?.select(it.id); }
});

// ---------------------------------------------------------------- intro (≈3 s, then fully interactive)
function playIntro() {
  const tl = hero.buildIntro();
  if (reduceMotion) { html.classList.remove("intro"); tl.progress(1); return; }
  // elements are hidden by the `intro` class until GSAP takes over their opacity
  tl.set([nav, ...document.querySelectorAll("[data-reveal], [data-cta]")], { opacity: 0 }, 0)
    .add(() => html.classList.remove("intro"), 0)
    .from("h1 .line > span", { yPercent: 110, duration: 1.0, ease: "power4.out", stagger: 0.12 }, 2.2)
    .to("[data-reveal]", { opacity: 1, duration: 0.9, ease: "power2.out", stagger: 0.08 }, 2.2)
    .to([nav, ...document.querySelectorAll("[data-cta]")], { opacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.1 }, 2.5);
  tl.play();
}
try { playIntro(); } catch (err) { html.classList.remove("intro"); console.warn(err); }
