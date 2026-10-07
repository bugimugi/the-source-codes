import { atlas } from "../data/atlas";
import { claims } from "../data/claims";
import { LEVEL_LABEL, type Claim } from "../data/types";
import { CAT_COLOR, CAT_LABEL, ELEMENTS, FEATURED, FILTERS, NATURAL_COUNT, TRACE, matches, type Element as ChemElement, type Filter } from "../data/elements";
import { APPS, BODY, BODY_INTRO, BUBBLES, FORMATION, FORMATION_NOTE, FREQ, GROUP_ORDER, HISTORY, JOURNEY, MINERALS, MINERAL_NOTICE, NAV, type Mineral } from "../data/minerals";
import dots from "../data/landdots.json";
import { hasAsset, mountSlots } from "../assets/slots";
import { createTone } from "../audio/tone";
import { esc } from "./dossierParts";
import { ico } from "./icons";
import { ph } from "./landing";
import { crystalGeomSvg, figureSvg, flowerOfLifeSvg, gemSvg, journeySvg, quartzSvg, waveSvg } from "./plantArt";

export interface MineralsApi {
  reduceMotion: boolean;
  /** the 3D atlas of crystals: with an id that entry is selected, without the category opens */
  openAtlas(id?: string): void;
  /** the frequency page with the cymatics plate */
  openFx(): void;
  /** the profile page of an element */
  openElement(sym: string): void;
  openClaim(id: string, from: HTMLElement): void;
}

const claimById = (id: string): Claim | undefined => claims.find((c) => c.id === id);
const SHORT: Record<string, string> = { claimed: "Behauptung · ungeprüft", hypothesis: "Hypothese", supported: "Belegt, Deutung offen", established: "Gesichert", historical: "Historisch dokumentiert", unsupported: "Nicht belegt" };
const chipFor = (id?: string) => {
  const c = id ? claimById(id) : undefined;
  return c ? `<span class="pp-lvl" style="--c:var(--lvl-${c.level})" title="${esc(LEVEL_LABEL[c.level])}">${esc(SHORT[c.level] ?? LEVEL_LABEL[c.level])}</span>` : "";
};
const claimLine = (id?: string, textbook = "Lehrbuchwissen · Source pending verification") =>
  id ? `<p class="mn-claimline">${chipFor(id)} <button class="pl-link" data-claim="${id}">Aussage und Quellen</button></p>` : `<p class="mn-claimline"><span class="mn-textbook">${esc(textbook)}</span></p>`;
const nf = (n: number) => n.toLocaleString("de-DE");
const IMA_URL = "https://rruff.info/ima/";
/** "more than 6,000": the IMA list holds about 6,000 accepted species (exact number changes yearly: not stated) */
const MINERAL_COUNT_LABEL = "6.000+";
const colorOf = (id: string) => (id === "quarz" ? "#dfefff" : atlas.find((e) => e.id === id)?.model.color ?? "#dfefff");
const cardName = (m: Mineral) => (m.id === "quarz" ? "Bergkristall" : m.name);
const slug = (s: string) => s.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/[^a-z0-9]+/g, "-");
/** where on the body figure (percent) each spot's line ends */
const BODY_DOT: Record<string, [number, number]> = { haut: [38, 30], haare: [50, 9], binde: [60, 36], knochen: [44, 57], silizium: [53, 47] };
const GEOMS: { id: "prisma" | "doppel" | "rhomboeder"; label: string }[] = [{ id: "prisma", label: "Prisma mit Spitze" }, { id: "doppel", label: "Doppelender" }, { id: "rhomboeder", label: "Rhomboeder" }];
const FREQ_ICON: Record<string, string> = { muster: "hex", piezo: "bolt", resonanz: "sound" };

/**
 * The "Mineral Atlas" landing page: hero with element bubbles, the periodic table (13 element cards, filter, search, all 118 elements),
 * the journey from atom to crystal, a quartz spotlight (switchable between the quartz group), formation, world map of localities, the
 * body, frequencies, applications, history and related minerals. Numbers come from the data or name their source; statements about the
 * body, frequencies and healing stones are graded claims, textbook values say "Source pending verification".
 */
export function initMinerals(root: HTMLElement, api: MineralsApi) {
  const scroll = root.querySelector<HTMLElement>(".pl-scroll")!;
  const q$ = <T extends HTMLElement>(s: string) => scroll.querySelector<T>(s)!;
  let sel = "quarz";
  let thumb = 0;
  let geo: (typeof GEOMS)[number]["id"] = "prisma";
  let filter: Filter = "alle";
  let query = "";
  let elSel = "";
  let placeSel = -1;
  let toneOn = false;
  const tone = createTone();
  const featured = FEATURED.map((f) => ELEMENTS.find((e) => e.sym === f.sym)!);
  const stat = (n: string, l: string) => `<div><dd>${n}</dd><dt>${l}</dt></div>`;
  const elCard = (e: ChemElement) => {
    const slot = `element-${e.sym.toLowerCase()}`;
    const art = hasAsset(slot) ? `<div class="mn-el-img" data-slot="${slot}" data-fit="cover" data-sizes="(max-width: 700px) 30vw, 8vw"></div>` : `<div class="mn-el-img mn-el-art">${gemSvg(CAT_COLOR[e.cat])}</div>`;
    return `<button class="mn-el" data-el="${e.sym}" style="--c:${CAT_COLOR[e.cat]}"><small>${e.z}</small><strong>${e.sym}</strong><em>${esc(e.name)}</em>${art}</button>`;
  };

  scroll.innerHTML = `
    <div class="pl-hero mn-hero">
      <div class="pl-hero-bg" data-slot="mineral-hero" data-fit="cover" data-eager="true"></div>
      ${hasAsset("mineral-hero") ? "" : `<div class="pl-hero-alt og-hero-alt mn-hero-alt" data-slot="tile-mineralien" data-fit="cover" aria-hidden="true"></div>`}
      <div class="mn-bubs">${BUBBLES.map((b) => { const e = ELEMENTS.find((x) => x.sym === b.sym)!; return `<button class="mn-bub" data-el="${b.sym}" style="left:${b.at[0]}%;top:${b.at[1]}%;--s:${b.size}px;--c:${b.color}" aria-label="${esc(e.name)}"><b>${b.sym}</b><small>${esc(e.name)}</small></button>`; }).join("")}</div>
      <div class="pl-hero-text">
        <p class="mn-eyebrow">Elemente · Mineralien · Kristalle</p>
        <h1>Mineral Atlas</h1>
        <p class="mn-tag">Die Bausteine der Erde</p>
        <p class="pl-lead">Mineralien, Elemente und Spurenelemente formen unsere Welt. Sie sind in Gesteinen, Böden, Pflanzen, Tieren und in uns selbst. Entdecke ihre Struktur, Eigenschaften, Vorkommen und ihre Bedeutung für Leben, Gesundheit, Technologie und Kultur.</p>
        <div class="mn-cta"><button class="mn-gold" data-to="mn-elements">Atlas erkunden <span aria-hidden="true">→</span></button><button class="pl-ghost" data-table="open">Periodensystem öffnen</button></div>
        <dl class="pl-stats">
          ${stat(MINERAL_COUNT_LABEL, `Mineralarten (<a href="${IMA_URL}" target="_blank" rel="noopener noreferrer">IMA</a>)`)}
          ${stat(String(ELEMENTS.length), "Elemente")}
          ${stat(String(NATURAL_COUNT), "natürlich vorkommend")}
          ${stat("∞", "Verbindungen")}
        </dl>
      </div>
      <nav class="mn-nav" aria-label="Im Atlas springen"><ul>${NAV.map((n) => `<li><button data-to="${n.to}"><i>${ico(n.icon)}</i>${esc(n.label)}</button></li>`).join("")}</ul></nav>
    </div>

    <section class="mn-band mn-elements" id="mn-elements" aria-labelledby="mn-el-h">
      <div class="mn-bar">
        <div class="mn-bar-t"><h2 id="mn-el-h">Das Periodensystem</h2><p class="pl-sub">Alle Elemente interaktiv entdecken. Ein Klick öffnet die Seite des Elements.</p></div>
        <div class="mn-chips" role="group" aria-label="Elemente filtern">${FILTERS.map((f) => `<button data-filter="${f.id}" aria-pressed="${f.id === "alle"}">${esc(f.label)}</button>`).join("")}</div>
        <label class="mn-find"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/></svg><input type="search" class="mn-q" placeholder="Element suchen …" aria-label="Element suchen" autocomplete="off"></label>
        <button class="pl-ghost mn-3d" data-3d>${ico("cell")} 3D-Ansicht</button>
      </div>
      <div class="mn-el-row" tabindex="-1"></div>
      <div class="mn-table-bar"><button class="pl-ghost" data-table="toggle" aria-expanded="false" aria-controls="mn-table">Alle ${ELEMENTS.length} Elemente im Periodensystem <span aria-hidden="true">→</span></button></div>
      <div class="mn-table-wrap" id="mn-table" hidden>
        <div class="mn-table" role="group" aria-label="Periodensystem der Elemente">${ELEMENTS.map((e) => `<button class="mn-cell" data-el="${e.sym}" style="grid-column:${e.col};grid-row:${e.row};--c:${CAT_COLOR[e.cat]}" aria-label="${esc(e.name)}, Ordnungszahl ${e.z}"><small>${e.z}</small><b>${e.sym}</b></button>`).join("")}</div>
        <ul class="mn-legend">${(Object.keys(CAT_LABEL) as (keyof typeof CAT_LABEL)[]).map((c) => `<li><i style="background:${CAT_COLOR[c]}"></i>${esc(CAT_LABEL[c])}</li>`).join("")}</ul>
      </div>
    </section>

    <section class="mn-band mn-journey" id="mn-journey" aria-labelledby="mn-jo-h">
      <h2 id="mn-jo-h">Von Atom bis Kristall</h2><p class="pl-sub">Die Reise der Materie. Tippe auf eine Station.</p>
      <ol class="mn-steps">${JOURNEY.map((j, i) => `${i ? `<li class="mn-arrow" aria-hidden="true">→</li>` : ""}<li><button class="mn-step" data-step="${j.id}" aria-pressed="false"><span class="mn-step-art">${hasAsset(`mineral-reise-${j.id}`) ? `<span class="mn-step-img" data-slot="mineral-reise-${j.id}" data-fit="cover" data-sizes="12vw"></span>` : journeySvg(j.id, `mj${j.id}`)}</span><strong>${esc(j.title)}</strong>${j.sub ? `<small>${esc(j.sub)}</small>` : ""}</button></li>`).join("")}</ol>
      <div class="mn-text mn-step-text" aria-live="polite"><p>Tippe auf eine Station: Hier steht, was dort passiert. Die Texte sind Lehrbuchwissen und tragen den Vermerk „Source pending verification“.</p></div>
    </section>

    <section class="mn-band mn-spot" id="mn-spot" aria-labelledby="mn-spot-h">
      <div class="mn-spot-l">
        <h2 class="mn-big" id="mn-spot-h"></h2>
        <p class="mn-formula"></p>
        <ul class="mn-tags"></ul>
        <p class="mn-spot-text"></p>
        <div class="mn-cta"><button class="pl-ghost" data-3d-model>3D-Modell öffnen <span aria-hidden="true">→</span></button><button class="pl-ghost" data-nature>${ico("pin")} In der Natur sehen</button></div>
      </div>
      <div class="mn-stage-wrap">
        <ul class="mn-thumbs" aria-label="Ansichten"></ul>
        <div class="mn-stage"><button class="mn-arr l" data-shot="-1" aria-label="Vorherige Ansicht">‹</button><div class="mn-stage-art"></div><button class="mn-arr r" data-shot="1" aria-label="Nächste Ansicht">›</button></div>
      </div>
      <aside class="mn-props" aria-labelledby="mn-pr-h"><h3 id="mn-pr-h">Wichtige Eigenschaften</h3><ul></ul><p class="mn-props-note">Lehrbuchwerte, Source pending verification.</p></aside>
      <aside class="mn-geo" aria-labelledby="mn-geo-h">
        <h3 id="mn-geo-h">Kristallgeometrie</h3>
        <p class="mn-geo-sys"><b></b><small></small></p>
        <div class="mn-geo-big"></div>
        <div class="mn-geo-row" role="group" aria-label="Kristallform wählen">${GEOMS.map((g) => `<button data-geo="${g.id}" aria-pressed="false" title="${esc(g.label)}" aria-label="${esc(g.label)}">${crystalGeomSvg(g.id, `mgs${g.id}`)}</button>`).join("")}</div>
        <p class="mn-geo-cap">Schematische Linienzeichnung</p>
      </aside>
    </section>

    <div class="mn-split">
      <section class="mn-band mn-formation" id="mn-formation" aria-labelledby="mn-fo-h">
        <h2 id="mn-fo-h">Entstehung &amp; Vorkommen</h2><p class="pl-sub mn-fo-sub"></p>
        <div class="mn-fo-row">${FORMATION.map((f) => `<button class="mn-fo" data-fo="${f.id}" aria-pressed="false">${ph(`mineral-bild-${f.id}`, "mn-fo-img", f.icon, f.id === "magma" ? "#d6502a" : f.id === "meta" ? "#8a6a5a" : f.id === "sedi" ? "#c8964a" : "#58a8d6")}<span><strong>${esc(f.title)}</strong><small>${esc(f.example)}</small></span></button>`).join("")}</div>
        <div class="mn-text mn-fo-text" aria-live="polite"><p>Tippe auf eine Entstehungsart. Hervorgehoben sind die, in denen das gewählte Mineral vorkommt. ${esc(FORMATION_NOTE)}</p></div>
      </section>
      <section class="mn-band mn-world" id="mn-map" aria-labelledby="mn-w-h">
        <h2 id="mn-w-h">Vorkommen weltweit</h2><p class="pl-sub">Wichtige Fundorte (Auswahl, nicht vollständig).</p>
        <div class="mn-world-grid">
          <div class="mn-map" role="group" aria-label="Weltkarte mit Fundorten"><div class="mn-map-bg" data-slot="mineral-map" data-fit="cover"></div><canvas class="mn-map-cv" aria-hidden="true"></canvas><div class="mn-pins"></div><ul class="mn-map-legend"><li><i class="a"></i>Fundort (Auswahl)</li><li><i class="b"></i>ausgewählt</li></ul></div>
          <ul class="mn-places"></ul>
        </div>
      </section>
    </div>

    <div class="mn-triple">
      <section class="mn-band mn-body" id="mn-body" aria-labelledby="mn-b-h">
        <h2 id="mn-b-h"><span class="mn-b-name">Quarz</span> im menschlichen Körper?</h2>
        <p class="pl-sub">${esc(BODY_INTRO)}</p>
        <div class="mn-body-fig">
          <div class="mn-body-art">${hasAsset("body-front") ? `<div class="mn-body-img" data-slot="body-front" data-fit="cover" aria-hidden="true"></div>` : figureSvg("mnb")}</div>
          <svg class="mn-body-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${BODY.map((b) => { const t = BODY_DOT[b.id], ax = b.side === "l" ? b.at[0] + 24 : b.at[0]; return `<g data-line="${b.id}"><line x1="${ax}" y1="${b.at[1] + 5}" x2="${t[0]}" y2="${t[1]}"/><circle cx="${t[0]}" cy="${t[1]}" r="1.1"/></g>`; }).join("")}</svg>
          <ul class="mn-body-btns">${BODY.map((b) => `<li style="left:${b.at[0]}%;top:${b.at[1]}%"><button class="mn-bbtn ${b.side}" data-body="${b.id}" aria-pressed="false"><i>${ico(b.id === "silizium" ? "flask" : b.id === "knochen" ? "muscle" : b.id === "binde" ? "link" : b.id === "haut" ? "layers" : "dna")}</i><span><strong>${esc(b.title)}</strong><small>${esc(b.sub)}</small></span></button></li>`).join("")}</ul>
        </div>
        <div class="mn-text mn-body-text" aria-live="polite"><p>Tippe auf eine Stelle. Wichtig: Gelöstes Silizium kommt im Körper vor, Quarzkristalle werden nicht aufgenommen.</p>${claimLine("mineral-silizium")}</div>
      </section>

      <section class="mn-band mn-freq" id="mn-freq" aria-labelledby="mn-f-h">
        <h2 id="mn-f-h">Frequenzen &amp; Schwingung</h2><p class="pl-sub">Die energetische Signatur von Quarz, als Angabe des Betreibers (unbelegt).</p>
        <div class="mn-freq-top">
          <div class="mn-wave">${waveSvg()}</div>
          <div class="mn-hz"><b>432 Hz</b><small>Harmonische Resonanz<br>(Behauptung: „entspricht natürlicher Ordnung“)</small>${chipFor("mineral-quarz-frequenz")}</div>
          <div class="mn-flower" aria-hidden="true">${flowerOfLifeSvg()}</div>
        </div>
        <div class="mn-freq-act"><button class="pl-ghost mn-tone" aria-pressed="false">Frequenz demonstrieren <span aria-hidden="true">→</span></button><button class="pl-link" data-claim="mineral-quarz-frequenz">Aussage und Quellen</button></div>
        <ul class="mn-freq3">${FREQ.map((f) => `<li><button data-fq="${f.id}" aria-pressed="false"><i>${ico(FREQ_ICON[f.id] ?? f.icon)}</i><span>${esc(f.title)}</span></button></li>`).join("")}</ul>
        <div class="mn-text mn-fq-text" aria-live="polite"><p>Der Ton ist ein reiner 432-Hz-Ton zum Anhören, keine Messung am Quarz. Tippe unten auf ein Thema: Gemessene Physik (Piezoeffekt, Resonanz) steht getrennt von der Behauptung.</p></div>
      </section>

      <section class="mn-band mn-apps" id="mn-apps" aria-labelledby="mn-a-h">
        <h2 id="mn-a-h">Anwendungen</h2><p class="pl-sub">Von der Antike bis zur modernen Technologie.</p>
        <div class="mn-app-grid">${APPS.map((a) => `<button class="mn-app" data-app="${a.id}" aria-pressed="false">${ph(`mineral-anw-${a.id}`, "mn-app-img", a.icon, "#7a6aa8")}<span><strong>${esc(a.title)}</strong><small>${esc(a.sub)}</small></span></button>`).join("")}</div>
        <div class="mn-text mn-app-text" aria-live="polite"><p>Tippe auf eine Anwendung. Technische Verwendungen sind Lehrbuchwissen; die Heilstein-Überlieferung steht als Behauptung mit Belegstufe da.</p></div>
      </section>
    </div>

    <div class="mn-duo">
      <section class="mn-band mn-hist" id="mn-hist" aria-labelledby="mn-h-h">
        <h2 id="mn-h-h">Geschichte &amp; Kultur</h2><p class="pl-sub">Quarz in verschiedenen Kulturen und Epochen.</p>
        <div class="mn-hist-row">${HISTORY.map((h) => `<button class="mn-h" data-hist="${h.id}" aria-pressed="false">${ph(`mineral-hist-${h.id}`, "mn-h-img", "scroll", "#9a7a4a")}<span><strong>${esc(h.title)}</strong><small>${esc(h.sub)}</small></span></button>`).join("")}</div>
        <div class="mn-timeline" aria-hidden="true">${HISTORY.map(() => `<i></i>`).join("")}</div>
        <div class="mn-text mn-hist-text" aria-live="polite"><p>Tippe auf eine Epoche. Die Texte sind Überlieferung und Lehrbuchwissen, Source pending verification.</p></div>
      </section>
      <section class="mn-band mn-related" id="mn-related" aria-labelledby="mn-r-h">
        <h2 id="mn-r-h">Verwandte Mineralien</h2><p class="pl-sub">Mineralien aus der Quarz-Gruppe. Tippe auf eins: Die Seite zeigt dann dieses Mineral.</p>
        <div class="pl-row-wrap mn-rel-wrap"><button class="mn-rel-arr l" data-rel="-1" aria-label="Zurück">‹</button><div class="mn-rel-row" tabindex="-1"></div><button class="mn-rel-arr r" data-rel="1" aria-label="Weiter">›</button></div>
      </section>
    </div>

    <div class="pl-wrap"><p class="pl-notice">${esc(MINERAL_NOTICE)}</p></div>`;

  // ---------------------------------------------------------------- the 13 element cards, the table and the detail box
  const row = q$<HTMLElement>(".mn-el-row");
  const tableWrap = q$<HTMLElement>(".mn-table-wrap");
  const visible = (e: ChemElement) => matches(e, filter) && (!query || [e.name, e.sym, String(e.z)].some((v) => v.toLowerCase().includes(query)));
  function renderRow() {
    const list = featured.filter(visible);
    row.innerHTML = list.length
      ? list.map(elCard).join("")
      : `<p class="pl-none">${filter === "alle" && !query ? "" : `Zu dieser Auswahl gibt es noch keine Karte. Im Periodensystem unten sind die passenden Elemente hervorgehoben.`}</p>`;
    mountSlots(row);
    row.querySelectorAll<HTMLElement>("[data-el]").forEach((b) => b.classList.toggle("sel", b.dataset.el === elSel));
    scroll.querySelectorAll<HTMLElement>(".mn-cell").forEach((c) => { const e = ELEMENTS.find((x) => x.sym === c.dataset.el)!; c.classList.toggle("dim", !visible(e)); c.classList.toggle("sel", e.sym === elSel); });
    scroll.querySelectorAll<HTMLElement>("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === filter)));
  }
  function setTable(open: boolean) {
    tableWrap.hidden = !open;
    scroll.querySelectorAll<HTMLElement>('[data-table="toggle"]').forEach((b) => b.setAttribute("aria-expanded", String(open)));
  }
  /** marks an element in the table and row (when coming back from its profile) and opens the table */
  function focusElement(sym: string) {
    elSel = sym;
    setTable(true);
    renderRow();
    requestAnimationFrame(() => q$(".mn-table-bar").scrollIntoView({ behavior: api.reduceMotion ? "auto" : "smooth", block: "start" }));
  }

  // ---------------------------------------------------------------- the spotlight (one mineral of the quartz group at a time)
  const thumbCount = (m: Mineral) => (m.id === "quarz" ? 4 : hasAsset(`atlas-${m.id}`) ? 1 : 4);
  const stageHtml = (m: Mineral, v: number, cls = "mn-stage-img") => {
    const slot = m.id === "quarz" ? `mineral-quarz-${v + 1}` : `atlas-${m.id}`;
    return hasAsset(slot) ? `<div class="${cls}" data-slot="${slot}" data-fit="cover" data-alt="${esc(m.name)}" data-sizes="(max-width: 700px) 90vw, 30vw"></div>` : quartzSvg(`mq${v}${cls.length}`, colorOf(m.id), v);
  };
  function renderSpot() {
    const m = MINERALS.find((x) => x.id === sel)!;
    q$(".mn-big").textContent = m.name;
    q$(".mn-formula").textContent = m.formula;
    q$(".mn-tags").innerHTML = m.tags.map((t) => `<li>${esc(t)}</li>`).join("");
    q$(".mn-spot-text").textContent = m.text;
    q$(".mn-props ul").innerHTML = m.props.map((p) => `<li><i>${ico(p.icon)}</i><span>${esc(p.label)}</span><b>${esc(p.value)}</b></li>`).join("");
    q$(".mn-geo-sys b").textContent = m.system;
    q$(".mn-geo-sys small").textContent = `(${m.habit})`;
    q$(".mn-geo-big").innerHTML = crystalGeomSvg(geo, "mgb");
    scroll.querySelectorAll<HTMLElement>("[data-geo]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.geo === geo)));
    const n = thumbCount(m);
    if (thumb >= n) thumb = 0;
    q$(".mn-stage-art").innerHTML = stageHtml(m, thumb);
    const th = q$(".mn-thumbs");
    th.hidden = n < 2;
    th.innerHTML = Array.from({ length: n }, (_, i) => `<li><button data-thumb="${i}" aria-pressed="${i === thumb}" aria-label="Ansicht ${i + 1}">${stageHtml(m, i, "mn-thumb-img")}</button></li>`).join("");
    scroll.querySelectorAll<HTMLElement>("[data-shot]").forEach((b) => (b.hidden = n < 2));
    q$(".mn-b-name").textContent = m.name === "Quarz" ? "Quarz" : m.name;
    q$(".mn-fo-sub").textContent = m.formedText;
    scroll.querySelectorAll<HTMLElement>("[data-fo]").forEach((b) => b.classList.toggle("off", !m.formed.includes(b.dataset.fo!)));
    mountSlots(q$(".mn-spot"));
    renderMap(m);
    renderRelated();
  }

  // ---------------------------------------------------------------- the map with the localities of the selected mineral
  const cv = q$<HTMLCanvasElement>(".mn-map-cv");
  const mapBox = q$<HTMLElement>(".mn-map");
  function drawMap() {
    q$<HTMLElement>(".mn-map-bg").hidden = !hasAsset("mineral-map");
    if (hasAsset("mineral-map")) { cv.hidden = true; return; }
    cv.hidden = false;
    const r = mapBox.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    const g = cv.getContext("2d")!;
    g.scale(dpr, dpr);
    g.clearRect(0, 0, r.width, r.height);
    const rad = Math.max(1.4, r.width / 300);
    for (const [la, lo] of dots as [number, number][]) {
      const lat = la / 10, lon = lo / 10;
      if (lat > 78 || lat < -58) continue;
      g.fillStyle = "rgba(160, 180, 230, 0.8)";
      g.fillRect(((lon + 180) / 360) * r.width - rad / 2, ((78 - lat) / 136) * r.height - rad / 2, rad, rad);
    }
  }
  new ResizeObserver(drawMap).observe(mapBox);
  function renderMap(m: Mineral) {
    placeSel = -1;
    q$(".mn-pins").innerHTML = m.places.map((p, i) => `<button class="mn-pin" data-place="${i}" style="left:${(((p.lon + 180) / 360) * 100).toFixed(1)}%;top:${(((78 - p.lat) / 136) * 100).toFixed(1)}%" aria-pressed="false" aria-label="${esc(p.name)}: ${esc(p.note)}"><span>${esc(p.name)}</span></button>`).join("");
    q$(".mn-places").innerHTML = m.places.map((p, i) => `<li><button class="mn-place" data-place="${i}" aria-pressed="false">${ph(`mineral-ort-${slug(p.name)}`, "mn-place-img", "pin", "#6a7aa8")}<span><strong>${esc(p.name)}</strong><small>${esc(p.note)}</small></span></button></li>`).join("");
    mountSlots(q$(".mn-places"));
  }
  function selectPlace(i: number) {
    placeSel = placeSel === i ? -1 : i;
    scroll.querySelectorAll<HTMLElement>("[data-place]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.place) === placeSel)));
  }

  function renderRelated() {
    q$(".mn-rel-row").innerHTML = GROUP_ORDER.map((id) => {
      const m = MINERALS.find((x) => x.id === id)!;
      const slot = `atlas-${id}`;
      const art = hasAsset(slot) ? `<div class="mn-rel-img" data-slot="${slot}" data-fit="cover" data-sizes="(max-width: 700px) 30vw, 8vw"></div>` : `<div class="mn-rel-img mn-el-art">${gemSvg(colorOf(id))}</div>`;
      return `<button class="mn-rel${id === sel ? " on" : ""}" data-mineral="${id}" aria-pressed="${id === sel}">${art}<strong>${esc(cardName(m))}</strong><small>${esc(m.formula)}</small></button>`;
    }).join("");
    mountSlots(q$(".mn-rel-row"));
  }

  // ---------------------------------------------------------------- clicks
  const smooth = (el: Element | null) => el?.scrollIntoView({ behavior: api.reduceMotion ? "auto" : "smooth", block: "start" });
  const setText = (sel: string, html: string) => { q$(sel).innerHTML = html; };
  const press = (attr: string, id: string) => scroll.querySelectorAll<HTMLElement>(`[${attr}]`).forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute(attr) === id)));
  function stopTone() { if (!toneOn) return; tone.stop(); toneOn = false; const b = q$(".mn-tone"); b.setAttribute("aria-pressed", "false"); b.firstChild!.textContent = "Frequenz demonstrieren "; q$(".mn-wave").classList.remove("playing"); }

  scroll.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) { api.openClaim(cl.dataset.claim!, cl); return; }
    const to = t.closest<HTMLElement>("[data-to]");
    if (to) { smooth(q$(`#${to.dataset.to}`)); return; }
    const tb = t.closest<HTMLElement>("[data-table]");
    if (tb) {
      const open = tb.dataset.table === "open" ? true : Boolean(tableWrap.hidden);
      setTable(open);
      if (tb.dataset.table === "open") smooth(q$("#mn-elements"));
      return;
    }
    const f = t.closest<HTMLElement>("[data-filter]");
    if (f) { filter = f.dataset.filter as Filter; if (filter !== "alle") setTable(true); renderRow(); return; }
    const el = t.closest<HTMLElement>("[data-el]");
    if (el) { api.openElement(el.dataset.el!); return; }
    if (t.closest("[data-3d]")) { api.openAtlas(); return; }
    if (t.closest("[data-3d-model]")) { api.openAtlas(sel); return; }
    if (t.closest("[data-nature]")) { smooth(q$("#mn-map")); return; }
    const st = t.closest<HTMLElement>("[data-step]");
    if (st) { const j = JOURNEY.find((x) => x.id === st.dataset.step)!; press("data-step", j.id); setText(".mn-step-text", `<h3>${esc(j.title)}${j.sub ? ` <small>${esc(j.sub)}</small>` : ""}</h3><p>${esc(j.text)}</p>`); return; }
    const th = t.closest<HTMLElement>("[data-thumb]");
    if (th) { thumb = Number(th.dataset.thumb); renderSpot(); return; }
    const vw = t.closest<HTMLElement>("[data-shot]");
    if (vw) { const n = thumbCount(MINERALS.find((x) => x.id === sel)!); thumb = (thumb + Number(vw.dataset.shot) + n) % n; renderSpot(); return; }
    const gm = t.closest<HTMLElement>("[data-geo]");
    if (gm) { geo = gm.dataset.geo as typeof geo; renderSpot(); return; }
    const fo = t.closest<HTMLElement>("[data-fo]");
    if (fo) {
      const x = FORMATION.find((k) => k.id === fo.dataset.fo)!, m = MINERALS.find((k) => k.id === sel)!;
      press("data-fo", x.id);
      setText(".mn-fo-text", `<h3>${esc(x.title)} <small>${esc(x.example)}</small></h3><p>${esc(x.text)}</p><p class="mn-claimline"><span class="mn-textbook">${m.formed.includes(x.id) ? `${esc(m.name)}: kommt hier vor` : `${esc(m.name)}: hier eher nicht typisch`} · Lehrbuchwissen, Source pending verification</span></p>`);
      return;
    }
    const pl = t.closest<HTMLElement>("[data-place]");
    if (pl) { selectPlace(Number(pl.dataset.place)); return; }
    const bd = t.closest<HTMLElement>("[data-body]");
    if (bd) {
      const b = BODY.find((x) => x.id === bd.dataset.body)!;
      press("data-body", b.id);
      scroll.querySelectorAll<SVGGElement>(".mn-body-lines [data-line]").forEach((g) => g.classList.toggle("on", g.dataset.line === b.id));
      q$<HTMLElement>(".mn-body-fig").dataset.sel = b.id;
      setText(".mn-body-text", `<h3>${esc(b.title)} <small>${esc(b.sub)}</small></h3><p>${esc(b.text)}</p>${claimLine("mineral-silizium")}`);
      return;
    }
    if (t.closest(".mn-tone")) {
      if (toneOn) { stopTone(); return; }
      if (tone.start(432)) {
        toneOn = true;
        const b = q$(".mn-tone"); b.setAttribute("aria-pressed", "true"); b.firstChild!.textContent = "Ton anhalten ";
        q$(".mn-wave").classList.add("playing");
        setText(".mn-fq-text", `<p>Du hörst gerade einen reinen Sinuston von 432 Hz in niedriger Lautstärke. Das ist nur ein Ton zum Anhören; dass Quarz „auf 432 Hz schwingt“, ist eine unbelegte Behauptung.</p>${claimLine("mineral-quarz-frequenz")}`);
      } else setText(".mn-fq-text", `<p>Ton ist auf diesem Gerät gerade nicht verfügbar.</p>`);
      return;
    }
    const fq = t.closest<HTMLElement>("[data-fq]");
    if (fq) {
      const x = FREQ.find((k) => k.id === fq.dataset.fq)!;
      press("data-fq", x.id);
      setText(".mn-fq-text", `<h3>${esc(x.title)}</h3><p>${esc(x.text)}</p>${claimLine(x.claim)}${x.id === "muster" ? `<p><button class="pl-ghost" data-fx>Frequenz-Seite öffnen <span aria-hidden="true">→</span></button></p>` : ""}`);
      return;
    }
    if (t.closest("[data-fx]")) { api.openFx(); return; }
    const ap = t.closest<HTMLElement>("[data-app]");
    if (ap) { const x = APPS.find((k) => k.id === ap.dataset.app)!; press("data-app", x.id); setText(".mn-app-text", `<h3>${esc(x.title)} <small>${esc(x.sub)}</small></h3><p>${esc(x.text)}</p>${claimLine(x.claim)}`); return; }
    const hs = t.closest<HTMLElement>("[data-hist]");
    if (hs) { const x = HISTORY.find((k) => k.id === hs.dataset.hist)!; press("data-hist", x.id); setText(".mn-hist-text", `<h3>${esc(x.title)} <small>${esc(x.sub)}</small></h3><p>${esc(x.text)}</p>`); return; }
    const mn = t.closest<HTMLElement>("[data-mineral]");
    if (mn) { sel = mn.dataset.mineral!; thumb = 0; renderSpot(); smooth(q$("#mn-spot")); return; }
    const rl = t.closest<HTMLElement>("[data-rel]");
    if (rl) { const r = q$(".mn-rel-row"); r.scrollBy({ left: Number(rl.dataset.rel) * r.clientWidth * 0.8, behavior: api.reduceMotion ? "auto" : "smooth" }); }
  });

  const input = q$<HTMLInputElement>(".mn-q");
  input.addEventListener("input", () => {
    query = input.value.trim().toLowerCase();
    if (query) setTable(true);
    renderRow();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault(); // focus moves to the next page's button: its click must not fire from this same key press
    const hit = ELEMENTS.find(visible);
    if (hit) api.openElement(hit.sym);
  });

  mountSlots(scroll);
  renderRow();
  renderSpot();
  return {
    start() { requestAnimationFrame(drawMap); },
    stop() { stopTone(); },
    focusElement,
  };
}
