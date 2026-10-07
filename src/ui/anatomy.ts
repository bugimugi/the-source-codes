import { BODY_ORGANS } from "../data/body";
import { claims } from "../data/claims";
import { LEVEL_LABEL, type Claim } from "../data/types";
import { ANATOMY_NOTICE, CELLS, CHAIN, FUNCTIONS, HEALTH, HEART_TOPICS, HERO_QUOTE, LIFE, LINKS, MODEL_NOTE, NAV, ORGAN_FACTS, QUOTE, SCIENCE, SYSTEMS, SYSTEMS_NOTE } from "../data/anatomy";
import { BODY_MODEL_CREDIT } from "../data/bodyparts";
import type { BodyLayer, BodyScene, PickedPart } from "../gl/bodyscene";
import { hasAsset, mountSlots } from "../assets/slots";
import { createBodyStage, type BodyStage } from "./bodyStage";
import { esc } from "./dossierParts";
import { ico } from "./icons";
import { ph } from "./landing";
import { cellSvg, heartSvg, lifeSvg } from "./anatomyArt";

export interface AnatomyApi {
  reduceMotion: boolean;
  /** the organ atlas (picture with pins); with an id that organ is selected */
  openBody(organ?: string): void;
  openNutrients(): void;
  openBreath(): void;
  openCultures(): void;
  openPlants(): void;
  openMinerals(): void;
  openFx(): void;
  /** an element profile, e.g. "H" */
  openElement(sym: string): void;
  openClaim(id: string, from: HTMLElement): void;
}

const claimById = (id: string): Claim | undefined => claims.find((c) => c.id === id);
const SHORT: Record<string, string> = { claimed: "Behauptung · ungeprüft", hypothesis: "Hypothese", supported: "Belegt, Deutung offen", established: "Gesichert", historical: "Historisch dokumentiert", unsupported: "Nicht belegt" };
const chipFor = (id?: string) => {
  const c = id ? claimById(id) : undefined;
  return c ? `<span class="pp-lvl" style="--c:var(--lvl-${c.level})" title="${esc(LEVEL_LABEL[c.level])}">${esc(SHORT[c.level] ?? LEVEL_LABEL[c.level])}</span>` : "";
};
const claimLine = (id?: string) => (id && claimById(id) ? `<p class="an-claimline">${chipFor(id)} <button class="pl-link" data-claim="${id}">Aussage und Quellen</button></p>` : "");
const KIND_LABEL = { bone: "Knochen", muscle: "Muskel", soft: "Band, Sehne oder Bandscheibe" } as const;
const FACT_STATS = [
  { icon: "layers", value: String(SYSTEMS.length), label: "Organsysteme" },
  { icon: "bone", value: "206", label: "Knochen beim Erwachsenen" },
  { icon: "muscle", value: "600+", label: "Skelettmuskeln (Größenordnung)" },
  { icon: "cell", value: "30–37 Bio.", label: "Körperzellen (Schätzung)", claim: "koerper-zellzahl" },
];
const LAYER_CHIPS: { id: string; label: string; icon: string }[] = [
  { id: "organe", label: "Organe", icon: "heart" }, { id: "muscles", label: "Muskeln", icon: "muscle" }, { id: "nerven", label: "Nerven", icon: "bolt" },
  { id: "gefaesse", label: "Gefäße", icon: "drop" }, { id: "bones", label: "Knochen", icon: "bone" }, { id: "transparenz", label: "Transparenz", icon: "layers" },
];

/**
 * The landing page "Der menschliche Körper": hero, the organ systems, an interactive body (the anatomy picture with organ pins, or
 * on request the real 3D model of bones and muscles with picking), an organ panel, the chain from atom to organism, cells, life stages,
 * body functions, health, research and links into the atlas. Everything is textbook knowledge with "Source pending verification";
 * claims carry their evidence level; health topics give orientation, not advice.
 */
export function initAnatomy(root: HTMLElement, api: AnatomyApi) {
  const scroll = root.querySelector<HTMLElement>(".pl-scroll")!;
  const q$ = <T extends HTMLElement>(s: string) => scroll.querySelector<T>(s)!;
  const smooth = (el: Element | null) => el?.scrollIntoView({ behavior: api.reduceMotion ? "auto" : "smooth", block: "start" });
  const tint = (i: number, n: number) => `hsl(${Math.round(190 + (i / n) * 150)} 55% 55%)`;

  const heartImg = () => (hasAsset("organ-heart") ? `<div class="an-organ-img" data-slot="organ-heart" data-fit="contain" data-eager="true"></div>` : `<div class="an-organ-img an-organ-art">${heartSvg("anh")}</div>`);

  scroll.innerHTML = `
    <div class="pl-hero an-hero">
      <div class="pl-hero-bg" data-slot="koerper-hero" data-fit="cover" data-eager="true"></div>
      ${hasAsset("koerper-hero") ? "" : `<div class="pl-hero-alt og-hero-alt an-hero-alt" data-slot="body-front" data-fit="contain" data-eager="true" aria-hidden="true"></div>`}
      <div class="pl-hero-text">
        <p class="an-eyebrow">Menschlicher Körper</p>
        <h1>Der menschliche <span>Körper</span></h1>
        <p class="an-tag">Ein faszinierendes System.</p>
        <p class="pl-lead">Der menschliche Körper ist ein Zusammenspiel aus Millionen von Zellen, Geweben, Organen und Systemen. Erkunde Aufbau, Funktionen und Zusammenhänge – von der Zelle bis zum Organismus.</p>
        <div class="an-cta"><button class="mn-gold" data-to="an-3d">Körper erkunden <span aria-hidden="true">→</span></button><button class="pl-ghost an-video" aria-disabled="true">${ico("arrow")} Video ansehen <small>folgt</small></button></div>
        <p class="an-hint" role="status" aria-live="polite"></p>
        <ul class="an-stats" aria-label="Kennzahlen">${FACT_STATS.map((s) => `<li><i>${ico(s.icon)}</i><b>${esc(s.value)}</b><span>${esc(s.label)}</span></li>`).join("")}</ul>
      </div>
      <nav class="an-nav" aria-label="Bereiche des Körpers"><ul>${NAV.map((n) => `<li><button data-nav="${n.to}">${ico(n.icon)}<span>${esc(n.label)}</span><em aria-hidden="true">›</em></button></li>`).join("")}</ul></nav>
      <p class="an-quote">„${esc(HERO_QUOTE)}“<small>Sinnspruch, kein belegtes Zitat</small></p>
    </div>

    <section class="an-band an-sys" id="an-sys" aria-labelledby="an-sys-h">
      <div class="an-head"><h2 id="an-sys-h">Die Organsysteme</h2><p class="pl-sub">${esc(SYSTEMS_NOTE.split(" Die Vorlage")[0])} Tippe auf ein System.</p></div>
      <ul class="an-sys-grid">${SYSTEMS.map((s) => `<li><button data-sys="${s.id}" aria-pressed="false">${ph(`koerper-sys-${s.id}`, "an-sys-img", s.icon, s.tint)}<span><strong>${esc(s.title)}</strong><small>${esc(s.sub)}</small></span></button></li>`).join("")}</ul>
      <div class="an-text an-sys-text" aria-live="polite"><p>Tippe auf ein Organsystem. Du siehst, welche Organe dazugehören, und kannst es im 3D-Körper oder im Körper-Atlas ansehen.</p></div>
    </section>

    <section class="an-band an-3d" id="an-3d" aria-labelledby="an-3d-h">
      <div class="an-3d-l">
        <h2 id="an-3d-h">Interaktiver 3D-Körper</h2>
        <p class="an-3d-lead">Erkunde den Körper von innen. Drehe, zoome und tippe auf einzelne Teile, um mehr zu erfahren.</p>
        <button class="mn-gold" data-start3d>3D-Modell starten <span aria-hidden="true">→</span></button>
        <ul class="an-chips" aria-label="Ebenen">${LAYER_CHIPS.map((c) => {
          const off = c.id === "nerven" || c.id === "gefaesse";
          return `<li><button class="an-chip${off ? " soon" : ""}" data-chip="${c.id}" aria-pressed="false" ${off ? 'aria-disabled="true"' : ""}>${ico(c.icon)}<span>${c.label}</span></button></li>`;
        }).join("")}</ul>
        <p class="an-note an-3d-note">${esc(MODEL_NOTE)}</p>
      </div>
      <div class="an-stage-col">
        <div class="an-stage-wrap">
          <div class="an-stage">
            <div class="an-img-stage"></div>
            <canvas class="an-canvas" hidden role="img" aria-label="Interaktives 3D-Modell von Skelett und Muskeln. Ziehen zum Drehen, Tippen auf ein Teil für seinen Namen."></canvas>
            <div class="an-loading" hidden role="status"><i></i><span>3D-Modell wird geladen …</span></div>
          </div>
          <div class="an-tools" role="group" aria-label="Werkzeuge">
            <button data-tool="in" aria-label="Hineinzoomen" title="Hineinzoomen">${ico("plus")}</button>
            <button data-tool="out" aria-label="Herauszoomen" title="Herauszoomen">${ico("minus")}</button>
            <button data-tool="reset" aria-label="Ansicht zurücksetzen" title="Ansicht zurücksetzen">${ico("reset")}</button>
            <button data-tool="layers" aria-label="Transparenz umschalten" title="Transparenz umschalten" aria-pressed="true">${ico("layers")}</button>
          </div>
        </div>
        <p class="an-cap" aria-live="polite"></p>
      </div>
      <aside class="an-organ" aria-label="Organ im Detail" aria-live="polite"></aside>
    </section>

    <div class="an-grid2 an-chainrow">
      <section class="an-band an-chain" id="an-chain" aria-labelledby="an-chain-h">
        <h2 id="an-chain-h">Von der Zelle zum Organismus</h2><p class="pl-sub">Die Organisationsstufen des Körpers. Tippe auf eine Stufe.</p>
        <ol class="an-chain-row">${CHAIN.map((c, i) => `<li><button data-chain="${c.id}" aria-pressed="false"><b>${i + 1}</b>${ph(`koerper-kette-${c.id}`, "an-chain-img", ["atom", "hex", "cell", "texture", "heart", "overview", "stress"][i], tint(i, CHAIN.length))}<strong>${esc(c.title)}</strong></button></li>`).join("")}</ol>
        <div class="an-text an-chain-text" aria-live="polite"><p>Atome bilden Moleküle, Moleküle Zellen, Zellen Gewebe, Gewebe Organe, Organe Organsysteme und diese zusammen den Körper.</p></div>
      </section>
      <section class="an-band an-cells" id="an-cells" aria-labelledby="an-cells-h">
        <h2 id="an-cells-h">Zellen – die Grundbausteine</h2>
        <div class="an-cells-top">${hasAsset("koerper-zelle") ? `<div class="an-cell-img" data-slot="koerper-zelle" data-fit="cover"></div>` : `<div class="an-cell-img an-cell-art">${cellSvg("anc")}</div>`}<p>${esc(CELLS.text)}</p></div>
        ${claimLine(CELLS.claim)}
        <ul class="an-cell-items">${CELLS.items.map((c) => `<li><button data-cell="${c.id}" aria-pressed="false">${ico(c.icon)}<span>${esc(c.title)}</span></button></li>`).join("")}</ul>
        <div class="an-text an-cell-text" aria-live="polite"><p>Tippe auf ein Thema.</p></div>
      </section>
    </div>

    <div class="an-grid2">
      <section class="an-band an-life" id="an-life" aria-labelledby="an-life-h">
        <h2 id="an-life-h">Der Körper im Laufe des Lebens</h2><p class="pl-sub">Fünf Lebensabschnitte (Altersgrenzen sind Konvention).</p>
        <ol class="an-life-row">${LIFE.map((l, i) => `<li><button data-life="${l.id}" aria-pressed="false">${hasAsset(`koerper-leben-${l.id}`) ? `<div class="an-life-img" data-slot="koerper-leben-${l.id}" data-fit="cover"></div>` : `<div class="an-life-img an-life-art" style="--tint:${tint(i, 8)}">${lifeSvg(l.id, `anl${i}`)}</div>`}<span><strong>${esc(l.title)}</strong><small>${esc(l.sub)}</small></span></button></li>`).join("")}</ol>
        <div class="an-text an-life-text" aria-live="polite"><p>Tippe auf einen Lebensabschnitt.</p></div>
      </section>
      <section class="an-band an-func" id="an-func" aria-labelledby="an-func-h">
        <h2 id="an-func-h">Körperfunktionen &amp; Prozesse</h2><p class="pl-sub">Was im Körper ständig abläuft.</p>
        <ul class="an-tiles">${FUNCTIONS.map((f, i) => `<li><button data-func="${f.id}" aria-pressed="false">${ph(`koerper-funktion-${f.id}`, "an-tile-img", f.icon, tint(i + 2, 10))}<span><strong>${esc(f.title)}</strong><small>${esc(f.sub)}</small></span></button></li>`).join("")}</ul>
        <div class="an-text an-func-text" aria-live="polite"><p>Tippe auf eine Funktion.</p></div>
      </section>
    </div>

    <div class="an-grid2">
      <section class="an-band an-health" id="an-health" aria-labelledby="an-health-h">
        <h2 id="an-health-h">Gesundheit &amp; Wohlbefinden</h2><p class="pl-sub">Allgemeine Orientierung, keine ärztliche Beratung.</p>
        <ul class="an-tiles">${HEALTH.map((h) => `<li><button data-health="${h.id}" aria-pressed="false">${hasAsset(`koerper-gesund-${h.id}`) ? `<div class="an-tile-img" data-slot="koerper-gesund-${h.id}" data-fit="cover"></div>` : `<div class="an-tile-img og-ph" style="--tint:${h.tint}">${ico(h.icon, "big")}</div>`}<span><strong>${esc(h.title)}</strong></span></button></li>`).join("")}</ul>
        <div class="an-text an-health-text" aria-live="polite"><p>Tippe auf ein Thema.</p></div>
      </section>
      <section class="an-band an-science" id="an-science" aria-labelledby="an-sci-h">
        <h2 id="an-sci-h">Wissenschaft &amp; Forschung</h2><p class="pl-sub">Fünf Forschungsfelder mit je einer Arbeit zum Nachlesen.</p>
        <ul class="an-tiles an-sci-tiles">${SCIENCE.map((s, i) => `<li><button data-sci="${s.id}" aria-pressed="false">${ph(`koerper-forschung-${s.id}`, "an-tile-img", s.icon, tint(i + 4, 9))}<span><strong>${esc(s.title)}</strong><small>${esc(s.sub)}</small></span></button></li>`).join("")}</ul>
        <div class="an-text an-sci-text" aria-live="polite"><p>Tippe auf ein Forschungsfeld.</p></div>
        <button class="pl-ghost an-all" data-allstudies aria-expanded="false">Alle Studien anzeigen <span aria-hidden="true">→</span></button>
        <ul class="an-papers" hidden>${SCIENCE.map((s) => `<li><i>${ico("book")}</i><div><strong>${esc(s.source.title)}</strong><small>${esc(s.source.author)}, ${esc(s.source.year)} · ${esc(s.source.venue)}</small></div>${s.source.url ? `<a href="${esc(s.source.url)}" target="_blank" rel="noopener noreferrer">Quelle ansehen ${ico("external")}</a>` : ""}</li>`).join("")}</ul>
      </section>
    </div>

    <div class="an-grid2 an-last">
      <section class="an-band an-links" id="an-links" aria-labelledby="an-links-h">
        <h2 id="an-links-h">Verbindungen im Atlas</h2><p class="pl-sub">Der Körper hängt mit allem zusammen – von der Ernährung bis zur Schwingung.</p>
        <ul class="an-link-row">${LINKS.map((l, i) => `<li><button data-link="${l.act}">${ph(`koerper-link-${l.id}`, "an-link-img", l.icon, tint(i + 1, 5))}<span><strong>${esc(l.title)}</strong><small>${esc(l.sub)}</small></span></button></li>`).join("")}</ul>
      </section>
      <section class="an-band an-brain" aria-label="Zitat">
        <div class="an-brain-img">${hasAsset("koerper-hirn") ? `<div class="an-brain-pic" data-slot="koerper-hirn" data-fit="cover"></div>` : `<div class="an-brain-pic" data-slot="organ-brain" data-fit="cover"></div>`}</div>
        <blockquote>„${esc(QUOTE)}“<small>Leitgedanke der Seite, kein belegtes Zitat</small></blockquote>
      </section>
    </div>
    <div class="pl-wrap"><p class="pl-notice">${esc(ANATOMY_NOTICE)}</p><p class="an-credit">${esc(BODY_MODEL_CREDIT)} <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html" target="_blank" rel="noopener noreferrer">Lizenz</a></p></div>`;

  // ---------------------------------------------------------------- the interactive body
  const stageEl = q$<HTMLElement>(".an-stage");
  const canvas = q$<HTMLCanvasElement>(".an-canvas");
  const loadingEl = q$<HTMLElement>(".an-loading");
  const capEl = q$<HTMLElement>(".an-cap");
  const organEl = q$<HTMLElement>(".an-organ");
  const layers = new Set<BodyLayer>();
  let mode: "bild" | "3d" = "bild";
  let transparent = true;
  /** the muscles are see-through only while bones are shown beneath them; alone they are opaque (else the back shows through) */
  const transOn = () => transparent && layers.has("bones") && layers.has("muscles");
  let organId = "herz";
  let scene: BodyScene | null = null;
  let token = 0;
  let active = false, visible = false;

  const imgStage: BodyStage = createBodyStage(q$<HTMLElement>(".an-img-stage"), {
    reduceMotion: api.reduceMotion,
    focus: (w, h) => [w * 0.5, h * 0.45],
    zoom: 2.6,
    onSelect: (id) => { if (id) showOrgan(id); else say(); },
  });

  function say(text?: string) {
    capEl.textContent = text ?? (mode === "3d"
      ? "Ziehen zum Drehen, Zoom mit den Knöpfen. Tippe auf ein Teil, um seinen Namen zu sehen."
      : "Tippe auf einen Punkt im Bild, um ein Organ zu wählen. „3D-Modell starten“ zeigt Knochen und Muskeln.");
  }
  function syncChips() {
    scroll.querySelectorAll<HTMLElement>("[data-chip]").forEach((b) => {
      const id = b.dataset.chip!;
      const on = id === "organe" ? mode === "bild" : id === "transparenz" ? transOn() : layers.has(id as BodyLayer);
      b.setAttribute("aria-pressed", String(on));
    });
    q$("[data-tool='layers']").setAttribute("aria-pressed", String(transOn()));
    stageEl.classList.toggle("is-3d", mode === "3d");
    canvas.hidden = mode !== "3d";
    q$<HTMLElement>(".an-img-stage").hidden = mode === "3d";
  }
  function syncRun() {
    if (!scene) return;
    if (mode === "3d" && active && visible) scene.start(); else scene.stop();
  }
  const hasWebGL = () => { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; } };

  async function ensureScene(): Promise<BodyScene | null> {
    if (scene) return scene;
    if (!hasWebGL()) return null;
    try {
      const mod = await import("../gl/bodyscene");
      scene = mod.initBodyScene(canvas, api.reduceMotion, onPick);
      scene.setTransparent(transOn());
      return scene;
    } catch { return null; }
  }
  function onPick(p: PickedPart | null) {
    if (!p) { say(); return; }
    const name = `${p.de}${p.side ? ` (${p.side})` : ""}`;
    capEl.innerHTML = `<b>${esc(name)}</b> · ${esc(p.en)} · ${KIND_LABEL[p.kind]}${p.known ? "" : " · deutscher Name noch nicht eingetragen"}`;
  }
  function back2d(note?: string) {
    mode = "bild"; layers.clear(); token++;
    scene?.stop(); loadingEl.hidden = true;
    syncChips(); say(note);
    requestAnimationFrame(() => imgStage.layout());
  }
  /** shows the 3D model with exactly these layers; the first time each layer is fetched (about 1.5 MB) */
  async function enter3D(want: BodyLayer[]) {
    const my = ++token;
    mode = "3d";
    layers.clear(); want.forEach((l) => layers.add(l));
    syncChips();
    loadingEl.hidden = false;
    say("Das 3D-Modell wird geladen …");
    const s = await ensureScene();
    if (my !== token) return;
    if (!s) { back2d(hasWebGL() ? "Das 3D-Modell konnte nicht geladen werden. Das Anatomie-Bild bleibt nutzbar." : "Dein Browser kann kein WebGL. Das 3D-Modell ist nicht verfügbar; das Anatomie-Bild bleibt nutzbar."); return; }
    try {
      await Promise.all((["bones", "muscles"] as BodyLayer[]).map((l) => s.show(l, layers.has(l))));
    } catch { if (my === token) back2d("Das 3D-Modell konnte nicht geladen werden. Das Anatomie-Bild bleibt nutzbar."); return; }
    if (my !== token) return;
    loadingEl.hidden = true;
    s.setTransparent(transOn());
    s.resize();
    syncRun();
    say();
  }
  function toggleTransparency() {
    if (!(layers.has("bones") && layers.has("muscles"))) { say("Transparenz zeigt die Knochen unter den Muskeln. Schalte dafür Knochen und Muskeln zusammen ein."); return; }
    transparent = !transparent;
    scene?.setTransparent(transOn());
    syncChips();
  }
  function toggleLayer(l: BodyLayer) {
    const next = new Set(layers);
    if (next.has(l)) next.delete(l); else next.add(l);
    if (!next.size) { back2d(); return; }
    void enter3D([...next]);
  }

  // ---------------------------------------------------------------- the organ panel
  function showOrgan(id: string) {
    const o = BODY_ORGANS.find((x) => x.id === id);
    if (!o) return;
    organId = id;
    const f = ORGAN_FACTS[id];
    const img = id === "herz" ? heartImg() : `<div class="an-organ-img" data-slot="${o.slot}" data-fit="contain"></div>`;
    organEl.innerHTML = `
      <h3>${esc(f?.title ?? o.name)}</h3>
      <div class="an-organ-top">${img}<div><p>${esc(f?.lead ?? o.text)}</p>
        <button class="pl-ghost" data-organ-open>Organ im Detail ansehen <span aria-hidden="true">→</span></button></div></div>
      ${f ? `<ul class="an-ostats">${f.stats.map(([v, l]) => `<li><b>${esc(v)}</b><span>${esc(l)}</span></li>`).join("")}</ul>` : ""}
      ${id === "herz" ? `<ul class="an-topics">${HEART_TOPICS.map((t) => `<li><button data-topic="${t.id}" aria-expanded="false">${ico(t.icon)}<span>${esc(t.title)}</span><em aria-hidden="true">›</em></button><div class="an-topic-body" hidden><p>${esc(t.text)}</p></div></li>`).join("")}</ul>`
        : `<p class="an-note">Mehr zu diesem Organ, mit überlieferten Zuordnungen und verwandten Aussagen, steht im Körper-Atlas.</p>`}
      <p class="an-note">Lehrbuchwissen, gerundete Richtwerte, Source pending verification.</p>`;
    mountSlots(organEl);
  }

  // ---------------------------------------------------------------- the drawers
  const press = (attr: string, id: string) => scroll.querySelectorAll<HTMLElement>(`[${attr}]`).forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute(attr) === id)));
  const setText = (s: string, html: string) => { q$(s).innerHTML = html; };
  const goTo = (to: string) => {
    if (to === "nutrients") api.openNutrients();
    else if (to === "breath") api.openBreath();
    else if (to === "cultures") api.openCultures();
    else smooth(q$(`#${to}`));
  };

  scroll.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) { api.openClaim(cl.dataset.claim!, cl); return; }
    const to = t.closest<HTMLElement>("[data-to]");
    if (to) { smooth(q$(`#${to.dataset.to}`)); return; }
    const nv = t.closest<HTMLElement>("[data-nav]");
    if (nv) { goTo(nv.dataset.nav!); return; }
    if (t.closest(".an-video")) { q$(".an-hint").textContent = "Ein Video gibt es noch nicht. Die Seite zeigt stattdessen den 3D-Körper."; return; }

    // 3D body
    if (t.closest("[data-start3d]")) { void enter3D(["bones", "muscles"]); return; }
    const chip = t.closest<HTMLElement>("[data-chip]");
    if (chip) {
      const id = chip.dataset.chip!;
      if (id === "organe") { if (mode === "3d") back2d(); else imgStage.select(organId); }
      else if (id === "muscles" || id === "bones") toggleLayer(id);
      else if (id === "transparenz") toggleTransparency();
      else say(MODEL_NOTE);
      return;
    }
    const tool = t.closest<HTMLElement>("[data-tool]");
    if (tool) {
      const k = tool.dataset.tool!;
      if (k === "layers") { toggleTransparency(); return; }
      if (mode === "3d") { if (k === "in") scene?.zoom(0.8); else if (k === "out") scene?.zoom(1.25); else { scene?.reset(); say(); } }
      else if (k === "in") imgStage.select(organId);
      else imgStage.select(null);
      return;
    }
    if (t.closest("[data-organ-open]")) { api.openBody(organId); return; }
    const tp = t.closest<HTMLElement>("[data-topic]");
    if (tp) { const open = tp.getAttribute("aria-expanded") !== "true"; tp.setAttribute("aria-expanded", String(open)); (tp.nextElementSibling as HTMLElement).hidden = !open; return; }

    // organ systems
    const sy = t.closest<HTMLElement>("[data-sys]");
    if (sy) {
      const s = SYSTEMS.find((x) => x.id === sy.dataset.sys)!;
      press("data-sys", s.id);
      const acts = [s.layer ? `<button class="pl-ghost" data-show3d="${s.layer}">${ico("cell")} Im 3D-Körper zeigen</button>` : "", s.organ ? `<button class="pl-ghost" data-show-organ="${s.organ}">${ico("target")} Im Bild zeigen</button><button class="pl-ghost" data-body="${s.organ}">Im Körper-Atlas ansehen <span aria-hidden="true">→</span></button>` : ""].join("");
      setText(".an-sys-text", `<h3>${esc(s.title)} <small>${esc(s.sub)}</small></h3><p>${esc(s.text)}</p><p class="an-organs"><b>Organe und Teile:</b> ${s.organs.map(esc).join(", ")}</p>${acts ? `<div class="an-btnrow">${acts}</div>` : `<p class="an-note">Zu diesem System gibt es noch keine eigene Ansicht.</p>`}<p class="an-note">Lehrbuchwissen, Source pending verification.</p>`);
      return;
    }
    const s3 = t.closest<HTMLElement>("[data-show3d]");
    if (s3) { smooth(q$("#an-3d")); void enter3D([s3.dataset.show3d as BodyLayer]); return; }
    const so = t.closest<HTMLElement>("[data-show-organ]");
    if (so) { smooth(q$("#an-3d")); if (mode === "3d") back2d(); imgStage.select(so.dataset.showOrgan!); return; }
    const bd = t.closest<HTMLElement>("[data-body]");
    if (bd) { api.openBody(bd.dataset.body); return; }

    // chain and cells
    const ch = t.closest<HTMLElement>("[data-chain]");
    if (ch) {
      const c = CHAIN.find((x) => x.id === ch.dataset.chain)!;
      press("data-chain", c.id);
      setText(".an-chain-text", `<h3>${esc(c.title)}</h3><p>${esc(c.text)}</p>${c.link ? `<p><button class="pl-ghost" data-chainlink="${c.link.act}">${esc(c.link.label)} <span aria-hidden="true">→</span></button></p>` : ""}<p class="an-note">Lehrbuchwissen, Source pending verification.</p>`);
      return;
    }
    const cln = t.closest<HTMLElement>("[data-chainlink]");
    if (cln) { if (cln.dataset.chainlink === "element") api.openElement("H"); else { smooth(q$("#an-cells")); q$<HTMLElement>("[data-cell]").click(); } return; }
    const ce = t.closest<HTMLElement>("[data-cell]");
    if (ce) { const c = CELLS.items.find((x) => x.id === ce.dataset.cell)!; press("data-cell", c.id); setText(".an-cell-text", `<h3>${esc(c.title)}</h3><p>${esc(c.text)}</p><p class="an-note">Lehrbuchwissen, Source pending verification.</p>`); return; }

    // rows
    const li = t.closest<HTMLElement>("[data-life]");
    if (li) { const l = LIFE.find((x) => x.id === li.dataset.life)!; press("data-life", l.id); setText(".an-life-text", `<h3>${esc(l.title)} <small>${esc(l.sub)}</small></h3><p>${esc(l.text)}</p><p class="an-note">Überblick, Source pending verification.</p>`); return; }
    const fu = t.closest<HTMLElement>("[data-func]");
    if (fu) { const f = FUNCTIONS.find((x) => x.id === fu.dataset.func)!; press("data-func", f.id); setText(".an-func-text", `<h3>${esc(f.title)} <small>${esc(f.sub)}</small></h3><p>${esc(f.text)}</p>${claimLine(f.claim)}`); return; }
    const he = t.closest<HTMLElement>("[data-health]");
    if (he) {
      const h = HEALTH.find((x) => x.id === he.dataset.health)!; press("data-health", h.id);
      const link = h.link ? `<p><button class="pl-ghost" ${h.link.act === "organ" ? `data-body="${h.link.organ}"` : `data-hlink="${h.link.act}"`}>${esc(h.link.label)} <span aria-hidden="true">→</span></button></p>` : "";
      setText(".an-health-text", `<h3>${esc(h.title)}</h3><p>${esc(h.text)}</p>${link}<p class="an-note">Allgemeine Orientierung, keine medizinische Beratung.</p>`);
      return;
    }
    const hl = t.closest<HTMLElement>("[data-hlink]");
    if (hl) { if (hl.dataset.hlink === "nutrients") api.openNutrients(); else api.openBreath(); return; }
    const sc = t.closest<HTMLElement>("[data-sci]");
    if (sc) {
      const s = SCIENCE.find((x) => x.id === sc.dataset.sci)!; press("data-sci", s.id);
      setText(".an-sci-text", `<h3>${esc(s.title)} <small>${esc(s.sub)}</small></h3><p>${esc(s.text)}</p><p class="an-src"><b>${esc(s.source.author)}, ${esc(s.source.year)}:</b> ${esc(s.source.title)}. ${esc(s.source.venue)}${s.source.url ? ` <a class="pl-link" href="${esc(s.source.url)}" target="_blank" rel="noopener noreferrer">Quelle ansehen</a>` : ""}</p>`);
      return;
    }
    const al = t.closest<HTMLElement>("[data-allstudies]");
    if (al) { const open = al.getAttribute("aria-expanded") !== "true"; al.setAttribute("aria-expanded", String(open)); q$<HTMLElement>(".an-papers").hidden = !open; return; }
    const lk = t.closest<HTMLElement>("[data-link]");
    if (lk) {
      const k = lk.dataset.link;
      if (k === "nutrients") api.openNutrients(); else if (k === "plants") api.openPlants(); else if (k === "minerals") api.openMinerals(); else if (k === "fx") api.openFx();
    }
  });

  // ---------------------------------------------------------------- start
  mountSlots(scroll);
  showOrgan("herz");
  syncChips();
  say();
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; syncRun(); }, { root: scroll, threshold: 0.05 }).observe(stageEl);
  return {
    start() { active = true; syncRun(); requestAnimationFrame(() => imgStage.layout()); },
    stop() { active = false; syncRun(); },
    /** opens the 3D body with one layer (used by deep links) */
    show3d(layer: BodyLayer) { smooth(q$("#an-3d")); void enter3D([layer]); },
    dispose() { scene?.dispose(); scene = null; },
  };
}
