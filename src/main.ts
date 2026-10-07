import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/500.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource-variable/inter";
import "./style.css";
import "./home.css";
import "./fx.css";
import "./body.css";
import "./breath.css";
import "./cultures.css";
import "./energy.css";
import "./lab.css";
import "./depth.css";
import gsap from "gsap";
import { initHero, type HeroApi, type HeroPin } from "./gl/hero";
import { initParticles } from "./gl/particles";
import { initUniverse } from "./gl/universe";
import { initProofOverlay } from "./ui/proofOverlay";
import { initStage } from "./ui/stage";
import { initAtlas } from "./ui/atlas";
import { initSearch } from "./ui/search";
import { initHome } from "./ui/home";
import { initFx } from "./ui/fx";
import { initBody } from "./ui/body";
import { initChakra } from "./ui/chakra";
import { initBreath } from "./ui/breath";
import { initPlaces } from "./ui/places";
import { initCultures } from "./ui/cultures";
import { initNutrients } from "./ui/nutrients";
import { initEnergy } from "./ui/energy";
import { initLab } from "./ui/lab";
import type { StationId } from "./data/lab";
import type { FxMode } from "./gl/fxscene";
import { claims } from "./data/claims";
import { atlas } from "./data/atlas";
import { AREA_LABEL, LEVEL_LABEL, isSettled, type Area, type AtlasCategory, type EvidenceLevel } from "./data/types";
import { AREA_ORDER } from "./data/areas";
import { mountSlots } from "./assets/slots";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const html = document.documentElement;
mountSlots();
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
    stat(claims.length, "Bewertete Aussagen") + stat(reviewed, "Fachlich geprüft") + stat(sources.length, "Quellen gelistet") +
    stat(atlas.length, "Atlas-Einträge") + stat("∞", "Wachsendes Universum");
  // Wissensebenen: real counts per evidence group
  const groups: { label: string; levels: EvidenceLevel[]; c: string }[] = [
    { label: "Wissenschaftlich belegt", levels: ["established", "supported"], c: "var(--lvl-established)" },
    { label: "Historisch dokumentiert", levels: ["historical"], c: "var(--lvl-historical)" },
    { label: "Hypothese", levels: ["hypothesis"], c: "var(--lvl-hypothesis)" },
    { label: "Nicht belegt / widerlegt", levels: ["unsupported", "refuted"], c: "var(--lvl-unsupported)" },
    { label: "Behauptung – ungeprüft", levels: ["claimed"], c: "var(--lvl-claimed)" },
  ];
  // the legend stays closed until asked for: it opens on click and closes on a second click, Escape or a click elsewhere
  const lvToggle = $("levels-toggle"), lvBody = $("levels-body");
  const setLevels = (open: boolean) => { lvBody.hidden = !open; lvToggle.setAttribute("aria-expanded", String(open)); lvToggle.classList.toggle("open", open); };
  lvToggle.addEventListener("click", () => setLevels(lvBody.hidden !== false));
  document.addEventListener("click", (e) => { if (!lvBody.hidden && !(e.target as HTMLElement).closest(".levels")) setLevels(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lvBody.hidden) { setLevels(false); lvToggle.focus(); } });
  $("levels").innerHTML = groups
    .map((g) => `<li style="--c:${g.c}">${g.label}<em>${claims.filter((c) => g.levels.includes(c.level)).length}</em></li>`).join("");
  // Pilot: unreviewed content is allowed while the site is built, but it must never look final.
  // The banner disappears by itself once every published claim has been reviewed by an expert.
  $("notice").innerHTML = (pending > 0
    ? `<strong class="pilot">PILOTVERSION – ${pending} von ${claims.length} Aussagen warten auf die Fachprüfung. Nicht zur Veröffentlichung bestimmt.</strong><br>`
    : "") + "Informationsangebot – keine medizinische Beratung. Die Inhalte ersetzen keine ärztliche Behandlung; Medikamente nie ohne Rücksprache mit Ärztin oder Arzt absetzen.";
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
type View = "hero" | "universe" | "atlas" | "fx" | "body" | "chakra" | "breath" | "places" | "cultures" | "nutrients" | "energy" | "lab";
let view: View = "hero";
let universe: ReturnType<typeof initUniverse> | null = null;
let atlasView: ReturnType<typeof initAtlas> | null = null;
let fxView: ReturnType<typeof initFx> | null = null;
let fxMode: FxMode = "kymatik";
let bodyView: ReturnType<typeof initBody> | null = null;
let chakraView: ReturnType<typeof initChakra> | null = null;
let breathView: ReturnType<typeof initBreath> | null = null;
let placesView: ReturnType<typeof initPlaces> | null = null;
let pendingPlace: string | undefined;
let culturesView: ReturnType<typeof initCultures> | null = null;
let nutrientsView: ReturnType<typeof initNutrients> | null = null;
let energyView: ReturnType<typeof initEnergy> | null = null;
let pendingEnergy: string | undefined;
let labView: ReturnType<typeof initLab> | null = null;
let pendingLab: StationId | undefined;
let pendingChakra: string | undefined;
const matrixEl = $("matrix");
const atlasEl = $("atlas");
const fxEl = $("fx");
const bodyEl = $("body");
const chakraEl = $("chakra");
const breathEl = $("breath");
const placesEl = $("places");
const culturesEl = $("cultures");
const nutrientsEl = $("nutrients");
const energyEl = $("energy");
const labEl = $("lab");

// the tab bar of every full-screen view is built from one list: a new page is added here and in SCREENS below
const VIEW_TABS: { id: View; label: string }[] = [
  { id: "universe", label: "Universum" }, { id: "atlas", label: "Atlas" }, { id: "fx", label: "Frequenz" }, { id: "body", label: "Körper" },
  { id: "chakra", label: "Chakren" }, { id: "breath", label: "Atem" }, { id: "places", label: "Orte" },
  { id: "cultures", label: "Kulturen" }, { id: "nutrients", label: "Nährstoffe" }, { id: "energy", label: "Energie" }, { id: "lab", label: "Rezepte" },
];
document.querySelectorAll<HTMLElement>("nav[data-tabs]").forEach((nav) => {
  nav.innerHTML = VIEW_TABS.map((t) => (t.id === nav.dataset.tabs ? `<button class="tab" aria-current="true">${t.label}</button>` : `<button class="tab" data-goto="${t.id}">${t.label}</button>`)).join("");
});
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
  html.classList.toggle("lock", !forHero);
}

addEventListener("scroll", () => nav.classList.toggle("solid", scrollY > 40), { passive: true });

// the hero scene only renders while it is on screen and the home page is the active view
let heroInView = true;
const syncHero = () => (view === "hero" && heroInView ? hero.resume() : hero.pause());
new IntersectionObserver((e) => { heroInView = e[0].isIntersecting; syncHero(); }).observe($("top"));

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

function openFxView(): boolean {
  // the canvas needs its real size when the scene starts, so the view is unhidden first
  fxEl.hidden = false;
  try {
    fxView ??= initFx(fxEl, reduceMotion);
    fxView.start(fxMode);
  } catch (err) {
    fxEl.hidden = true;
    console.warn("WebGL not available – frequency page cannot be shown.", err);
    alert("The 3D frequency page needs WebGL. Please enable hardware acceleration in your browser or use another browser.");
    return false;
  }
  fade(fxEl, true);
  $("leave-fx").focus();
  return true;
}

function openCulturesView(): boolean {
  culturesEl.hidden = false;
  culturesView ??= initCultures(culturesEl, { reduceMotion });
  culturesView.start();
  fade(culturesEl, true);
  $("leave-cultures").focus();
  return true;
}

function openEnergyView(id?: string): boolean {
  energyEl.hidden = false;
  energyView ??= initEnergy(energyEl, { reduceMotion });
  energyView.start(id);
  fade(energyEl, true);
  $("leave-energy").focus();
  return true;
}

function openLabView(station?: StationId): boolean {
  labEl.hidden = false;
  labView ??= initLab(labEl, {
    reduceMotion,
    openClaim: (cid, from) => overlay.open(cid, from),
    openEnergy: (eid) => { labEl.hidden = true; labView?.stop(); view = "hero"; pendingEnergy = eid; go("energy"); },
  });
  labView.start(station);
  fade(labEl, true);
  $("leave-lab").focus();
  return true;
}

function openNutrientsView(): boolean {
  nutrientsEl.hidden = false;
  nutrientsView ??= initNutrients(nutrientsEl, { openClaim: (cid, from) => overlay.open(cid, from) });
  fade(nutrientsEl, true);
  $("leave-nutrients").focus();
  return true;
}

function openPlacesView(id?: string): boolean {
  placesEl.hidden = false;
  try {
    placesView ??= initPlaces(placesEl, { openClaim: (cid, from) => overlay.open(cid, from), reduceMotion });
    placesView.start(id);
  } catch (err) {
    placesEl.hidden = true;
    console.warn("WebGL not available – places page cannot be shown.", err);
    alert("The 3D globe needs WebGL. Please enable hardware acceleration in your browser or use another browser.");
    return false;
  }
  fade(placesEl, true);
  $("leave-places").focus();
  return true;
}

function openBreathView(): boolean {
  breathEl.hidden = false;
  breathView ??= initBreath(breathEl, { openBody: (organ) => { breathEl.hidden = true; breathView?.stop(); view = "hero"; pendingOrgan = organ; go("body"); }, reduceMotion });
  fade(breathEl, true);
  $("leave-breath").focus();
  return true;
}

function openChakraView(id?: string): boolean {
  chakraEl.hidden = false;
  try {
    chakraView ??= initChakra(chakraEl, {
      openClaim: (cid, from) => overlay.open(cid, from),
      openAtlas: (aid) => { chakraEl.hidden = true; chakraView?.stop(); view = "hero"; go("atlas"); atlasView?.select(aid); },
      reduceMotion,
    });
    chakraView.start(id);
  } catch (err) {
    chakraEl.hidden = true;
    console.warn("WebGL not available – chakra page cannot be shown.", err);
    alert("The 3D chakra page needs WebGL. Please enable hardware acceleration in your browser or use another browser.");
    return false;
  }
  fade(chakraEl, true);
  $("leave-chakra").focus();
  return true;
}

let pendingOrgan: string | undefined;
function openBodyView(organ?: string): boolean {
  bodyEl.hidden = false;
  bodyView ??= initBody(bodyEl, {
    openClaim: (id, from) => overlay.open(id, from),
    openAtlas: (_c, id) => { bodyEl.hidden = true; view = "hero"; go("atlas"); atlasView?.select(id); },
    reduceMotion,
  });
  if (organ) bodyView.show(organ);
  fade(bodyEl, true);
  $("leave-body").focus();
  return true;
}

/** every full-screen view: its element and how to stop its rendering */
const SCREENS: Record<Exclude<View, "hero">, { el: HTMLElement; stop: () => void }> = {
  universe: { el: matrixEl, stop: () => universe?.stop() },
  atlas: { el: atlasEl, stop: () => atlasView?.stop() },
  fx: { el: fxEl, stop: () => fxView?.stop() },
  body: { el: bodyEl, stop: () => {} },
  chakra: { el: chakraEl, stop: () => chakraView?.stop() },
  breath: { el: breathEl, stop: () => breathView?.stop() },
  places: { el: placesEl, stop: () => placesView?.stop() },
  cultures: { el: culturesEl, stop: () => culturesView?.stop() },
  nutrients: { el: nutrientsEl, stop: () => nutrientsView?.stop() },
  energy: { el: energyEl, stop: () => energyView?.stop() },
  lab: { el: labEl, stop: () => labView?.stop() },
};

function go(next: View, opts: { instant?: boolean } = {}): boolean {
  if (next === view) return false;
  const prev = view;
  if (next === "universe" && !openUniverse(opts.instant)) return false;
  if (next === "atlas" && !openAtlas()) return false;
  if (next === "fx" && !openFxView()) return false;
  if (next === "body" && !openBodyView(pendingOrgan)) return false;
  if (next === "chakra" && !openChakraView(pendingChakra)) return false;
  if (next === "breath" && !openBreathView()) return false;
  if (next === "places" && !openPlacesView(pendingPlace)) return false;
  if (next === "cultures" && !openCulturesView()) return false;
  if (next === "nutrients" && !openNutrientsView()) return false;
  if (next === "energy" && !openEnergyView(pendingEnergy)) return false;
  if (next === "lab" && !openLabView(pendingLab)) return false;
  pendingEnergy = undefined;
  pendingLab = undefined;
  pendingOrgan = undefined;
  pendingChakra = undefined;
  pendingPlace = undefined;
  view = next;
  // with many tabs the bar scrolls sideways: keep the current page's tab in sight
  if (next !== "hero") SCREENS[next].el.querySelector<HTMLElement>(".tabs [aria-current]")?.scrollIntoView({ inline: "center", block: "nearest" });
  if (next !== "hero") home?.stopAudio();
  if (prev !== "hero") fade(SCREENS[prev].el, false, SCREENS[prev].stop);
  if (next === "hero") { hero.resetCamera(); setChrome(true); }
  else setChrome(false);
  syncHero();
  return true;
}

/** Cinematic entry: the camera flies into the brain, light floods the screen, the universe opens. */
async function enterLibrary() {
  if (view !== "hero") return;
  // far down the page the flight into the hero would be invisible: open the library directly
  if (scrollY > innerHeight * 0.5) { if (go("universe")) universe?.intro(); return; }
  const flash = $("flash");
  const t = gsap.to(flash, { opacity: 1, duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.8, ease: "power2.in" });
  await hero.transitionOut();
  await t;
  go("universe", { instant: true });
  universe?.intro();
  gsap.to(flash, { opacity: 0, duration: reduceMotion ? 0 : 1.2, ease: "power2.out" });
}

// ---------------------------------------------------------------- home page (sections below the hero)
const home = initHome($("home"), {
  openAtlas(category: AtlasCategory | null, id?: string) {
    if (!go("atlas")) return;
    if (id) atlasView?.select(id);
    else atlasView?.showCategory(category);
  },
  openUniverse() { void enterLibrary(); },
  openBody(organ?: string) { if (view === "body") { if (organ) bodyView?.show(organ); } else { pendingOrgan = organ; go("body"); } },
  openBreath() { go("breath"); },
  openCultures() { go("cultures"); },
  openNutrients() { go("nutrients"); },
  openEnergy(id?: string) { if (view === "energy") energyView?.start(id); else { pendingEnergy = id; go("energy"); } },
  openLab(station?: StationId) { if (view === "lab") labView?.start(station); else { pendingLab = station; go("lab"); } },
  openPlaces(id?: string) { if (view === "places") placesView?.start(id); else { pendingPlace = id; go("places"); } },
  openChakra(id?: string) { if (view === "chakra") chakraView?.start(id); else { pendingChakra = id; go("chakra"); } },
  openFx(mode: FxMode) { fxMode = mode; if (view === "fx") fxView?.start(mode); else go("fx"); },
  openClaim: (id, from) => overlay.open(id, from),
}, reduceMotion);

$("enter-matrix").addEventListener("click", enterLibrary);
document.querySelectorAll<HTMLElement>("[data-view]").forEach((b) =>
  b.addEventListener("click", () => (b.dataset.view === "atlas" ? go("atlas") : void enterLibrary())),
);
document.querySelectorAll<HTMLElement>("[data-scroll]").forEach((b) =>
  b.addEventListener("click", () => {
    if (b.dataset.scroll === "top") scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    else home.scrollTo(b.dataset.scroll!);
  }),
);
$("leave-matrix").addEventListener("click", () => go("hero"));
$("leave-atlas").addEventListener("click", () => go("hero"));
$("leave-fx").addEventListener("click", () => go("hero"));
$("leave-body").addEventListener("click", () => go("hero"));
$("leave-chakra").addEventListener("click", () => go("hero"));
$("leave-breath").addEventListener("click", () => go("hero"));
$("leave-places").addEventListener("click", () => go("hero"));
$("leave-cultures").addEventListener("click", () => go("hero"));
$("leave-nutrients").addEventListener("click", () => go("hero"));
$("leave-energy").addEventListener("click", () => go("hero"));
$("leave-lab").addEventListener("click", () => go("hero"));
document.querySelectorAll<HTMLElement>("[data-goto]").forEach((b) =>
  b.addEventListener("click", () => {
    const target = b.dataset.goto as View;
    if (view === "hero" || view === target) return;
    // switch straight from one full-screen view to another: close the current one at once, then open the target
    const from = view;
    view = "hero";
    SCREENS[from].el.hidden = true;
    SCREENS[from].stop();
    go(target);
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
