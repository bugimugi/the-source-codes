import { atlas } from "../data/atlas";
import { claims } from "../data/claims";
import { CATEGORY_LABEL, LEVEL_LABEL, ORIGIN_LABEL, type AtlasEntry, type Claim, type EvidenceLevel } from "../data/types";
import { PROFILES, type Box, type PlantProfile } from "../data/profiles";
import { ORIGIN, REGIONS, type Region } from "../data/plants";
import dots from "../data/landdots.json";
import { hasAsset, mountSlots } from "../assets/slots";
import { createTone } from "../audio/tone";
import { claimHtml, esc, toggleRedaction } from "./dossierParts";
import { ico } from "./icons";
import { bowlSvg, figureSvg, flowerOfLifeSvg, plantSvg, stageSvg } from "./plantArt";

export interface PlantProfileApi {
  reduceMotion: boolean;
  /** another plant's profile */
  openPlant(id: string): void;
  /** the 3D atlas page with this entry selected */
  openAtlas(id: string): void;
  openBody(organ?: string): void;
  openCultures(): void;
  openBreath(): void;
  openFxGeometry(): void;
  openLab(): void;
  openClaim(id: string, from: HTMLElement): void;
  /** back to the plant atlas overview */
  back(): void;
}

const SHORT: Record<EvidenceLevel, string> = {
  claimed: "Behauptung · ungeprüft", established: "Gesichert", supported: "Belegt, Deutung offen", hypothesis: "Hypothese",
  historical: "Historisch belegt", unsupported: "Nicht belegt", refuted: "Widerlegt",
};
const claimById = (id: string): Claim | undefined => claims.find((c) => c.id === id);
const entryById = (id: string): AtlasEntry | undefined => atlas.find((e) => e.id === id);
const br = (s: string) => esc(s).replace(/\n/g, "<br>");
const chip = (level: EvidenceLevel) => `<span class="pp-lvl" style="--c:var(--lvl-${level})" title="${esc(LEVEL_LABEL[level])}">${esc(SHORT[level])}</span>`;

/** a box holding the picture slot when the file exists, else the drawn placeholder (the box is sized by the CSS class `cls`) */
function slotOr(name: string, cls: string, fallback: string, alt = ""): string {
  const inner = hasAsset(name)
    ? `<div data-slot="${name}" data-fit="cover"${alt ? ` data-alt="${esc(alt)}"` : ""}></div>`
    : `<div class="pp-ph">${fallback}</div>`;
  return `<div class="pp-img ${cls}">${inner}</div>`;
}

/** rough boxes of the world regions for plants without their own origin boxes */
const REGION_BOX: Record<Region, Box> = {
  europa: { lat0: 36, lon0: -10, lat1: 62, lon1: 40 }, asien: { lat0: 5, lon0: 60, lat1: 55, lon1: 140 }, afrika: { lat0: -34, lon0: -17, lat1: 35, lon1: 50 },
  nordamerika: { lat0: 15, lon0: -130, lat1: 60, lon1: -60 }, suedamerika: { lat0: -55, lon0: -80, lat1: 12, lon1: -35 }, ozeanien: { lat0: -45, lon0: 110, lat1: -10, lon1: 155 },
};
const inBox = (lat: number, lon: number, b: Box) => lat >= b.lat0 && lat <= b.lat1 && lon >= b.lon0 && lon <= b.lon1;

function drawMap(cv: HTMLCanvasElement, home: Box[], spread: Box[]) {
  const r = cv.getBoundingClientRect();
  if (!r.width) return;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
  const g = cv.getContext("2d")!;
  g.scale(dpr, dpr);
  g.clearRect(0, 0, r.width, r.height);
  // keep the proportions of the world: fit 360 x 136 degrees into the box and centre it
  const sc = Math.min(r.width / 360, r.height / 136), ox = (r.width - 360 * sc) / 2, oy = (r.height - 136 * sc) / 2;
  const rad = Math.max(1.3, sc * 1.9);
  for (const [la, lo] of dots as [number, number][]) {
    const lat = la / 10, lon = lo / 10;
    if (lat > 78 || lat < -58) continue;
    const isHome = home.some((b) => inBox(lat, lon, b)), isSpread = !isHome && spread.some((b) => inBox(lat, lon, b));
    g.fillStyle = isHome ? "#f0a248" : isSpread ? "#7fc46a" : "rgba(214,186,128,0.34)";
    g.fillRect(ox + (lon + 180) * sc - rad / 2, oy + (78 - lat) * sc - rad / 2, rad, rad);
  }
}

let uidN = 0;

/**
 * The plant profile page (opened from the plant atlas). Ashwagandha has a complete profile after the user's reference picture
 * (src/data/profiles.ts); every other plant gets a shorter one built from its atlas entry. All statements about effects come
 * from graded claims; the page itself makes none.
 */
export function initPlantProfile(root: HTMLElement, api: PlantProfileApi) {
  const scroll = root.querySelector<HTMLElement>(".pp-scroll")!;
  const tone = createTone();
  let raf = 0, playing = false, resize: ResizeObserver | null = null;
  let current: string | null = null;

  function stopTone() { tone.stop(); playing = false; cancelAnimationFrame(raf); raf = 0; }

  // ------------------------------------------------------------------ shared pieces
  const panel = (id: string, cls: string, inner: string, label = "") => `<section class="pp-panel ${cls}" id="${id}"${label ? ` aria-label="${esc(label)}"` : ""}>${inner}</section>`;
  const head = (title: string, sub?: string) => `<h2>${esc(title)}</h2>${sub ? `<p class="pp-sub">${esc(sub)}</p>` : ""}`;

  const plantArtFor = (_e: AtlasEntry, uid: string, sketch = false, ground = true): string => plantSvg(uid, { sketch, ground });

  function safetyHtml(text: string, e: AtlasEntry): string {
    return `<aside class="pp-safety" aria-label="Hinweis"><p>${esc(text)}</p><div class="pp-actions"><button class="pp-ghost" data-act="atlas">${ico("globe")}Im 3D-Atlas ansehen</button><button class="pp-ghost" data-act="back">${ico("arrow")}Zurück zum Pflanzenatlas</button></div><p class="pp-pilot">Pilot: nicht fachlich geprüft. Alle Aussagen tragen eine Belegstufe; Quellen nennen wir als „Source pending verification“, solange das Original nicht geprüft ist. ${esc(e.name)} ersetzt keine ärztliche Beratung.</p></aside>`;
  }

  // ------------------------------------------------------------------ the complete profile (Ashwagandha)
  function fullHtml(e: AtlasEntry, p: PlantProfile): string {
    const uid = `pp${++uidN}`;
    const heroArt = plantArtFor(e, `${uid}h`, false, false);
    const tabs: { label: string; icon: string; to?: string; act?: string }[] = [
      { label: "Übersicht", icon: "overview", to: "pp-top" }, { label: "Eigenschaften", icon: "leaf", to: "pp-traits" }, { label: "Inhaltsstoffe", icon: "flask", to: "pp-compounds" },
      { label: "Wirkung", icon: "target", to: "pp-effects" }, { label: "Anwendung", icon: "cup", to: "pp-forms" }, { label: "Kombinationen", icon: "link", to: "pp-combos" },
      { label: "Rezepte", icon: "book", act: "lab" }, { label: "Frequenzen & Geometrie", icon: "hex", to: "pp-freq" }, { label: "Geschichte", icon: "scroll", to: "pp-history" },
      { label: "Anbau & Ernte", icon: "sprout", to: "pp-growth" }, { label: "Forschung", icon: "microscope", to: "pp-research" },
    ];
    const heroImg = hasAsset(`plant-${e.id}-hero`);
    const hero = `
    <header class="pp-hero${heroImg ? " has-img" : ""}" id="pp-top">
      ${heroImg ? `<div class="pp-hero-bg" data-slot="plant-${e.id}-hero" data-fit="cover" data-eager="true"></div>` : `<div class="pp-hero-art" aria-hidden="true">${heroArt}</div>`}
      <div class="pp-hero-text">
        <nav class="pp-crumbs" aria-label="Pfad"><button data-act="back">${esc(p.crumbs[0])}</button><i>›</i><span>${esc(p.crumbs[1])}</span><i>›</i><strong>${esc(e.name)}</strong></nav>
        <h1>${esc(e.name)}</h1>
        <p class="pp-latin">${esc(e.latin)}</p>
        <ul class="pp-tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        <p class="pp-lead">${esc(p.lead)}</p>
        <ul class="pp-bubbles" aria-label="Themen in der Überlieferung">${p.bubbles.map((b) => `<li><i>${ico(b.icon)}</i><span>${br(b.label)}</span></li>`).join("")}</ul>
        <p class="pp-bubbles-note">Themen der Überlieferung, keine Wirkversprechen</p>
      </div>
      <aside class="pp-glance" aria-label="Auf einen Blick">
        ${slotOr(`plant-${e.id}-sketch`, "pp-sketch", plantArtFor(e, `${uid}s`, true))}
        <h2>Auf einen Blick</h2>
        <dl>${p.glance.map((g) => `<div><i>${ico(g.icon)}</i><dt>${esc(g.label)}</dt><dd>${esc(g.value)}</dd></div>`).join("")}</dl>
      </aside>
    </header>
    <nav class="pp-tabs" aria-label="Abschnitte">${tabs.map((t, i) => `<button class="pp-tab" ${t.to ? `data-to="${t.to}"` : `data-act="${t.act}"`} ${i === 0 ? 'aria-current="true"' : ""}>${ico(t.icon)}<span>${esc(t.label)}</span></button>`).join("")}</nav>`;

    // --- row A: parts + traits
    const parts = panel("pp-plant", "pp-parts", `
      ${head("Die Pflanze", "Bestandteile und ihre Verwendung.")}
      <div class="pp-parts-grid">
        <ul class="pp-partbtns" role="group" aria-label="Pflanzenteil wählen">${p.parts.map((x, i) => `<li><button data-part="${x.id}" aria-pressed="${i === 0}">${ico(x.icon)}<span>${esc(x.label)}</span></button></li>`).join("")}</ul>
        <div class="pp-figwrap">
          <figure class="pp-fig">
            ${slotOr(`plant-${e.id}-parts`, "pp-fig-img", plantArtFor(e, `${uid}p`), `Die Pflanze ${e.name} mit Wurzel, Blättern, Blüten und Früchten`)}
            <svg class="pp-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${p.parts.filter((x) => x.callout).map((x) => {
              const c = x.callout!, ax = c.side === "l" ? c.at[0] + 21 : c.at[0] - 0.6, ay = c.at[1] + 3.4;
              return `<g data-line="${x.id}"><line x1="${ax}" y1="${ay}" x2="${c.to[0]}" y2="${c.to[1]}"/><circle cx="${c.to[0]}" cy="${c.to[1]}" r="1.1"/></g>`;
            }).join("")}</svg>
            ${p.parts.filter((x) => x.callout).map((x) => `<button class="pp-call ${x.callout!.side}" data-part="${x.id}" style="left:${x.callout!.at[0]}%;top:${x.callout!.at[1]}%"><strong>${esc(x.label)}</strong><small>${br(x.callout!.short)}</small></button>`).join("")}
            <span class="pp-ring" hidden></span>
          </figure>
          <p class="pp-partnote" aria-live="polite"></p>
        </div>
      </div>`);
    const traits = panel("pp-traits", "pp-traitspanel", `
      ${head("Botanische Merkmale")}
      <div class="pp-traits-grid">
        <dl class="pp-traitlist">${p.traits.map((t) => `<div><i>${ico(t.icon)}</i><dt>${esc(t.label)}</dt><dd>${esc(t.value)}</dd></div>`).join("")}</dl>
        <div class="pp-gallery">
          <div class="pp-main">${slotOr(`plant-${e.id}-photo`, "pp-main-img", `<span class="pp-glyph" aria-hidden="true">✿</span><small>Bild folgt</small>`, `${e.name}: Blüte`)}</div>
          <div class="pp-thumbs">${(["wurzel", "blatt", "bluete", "frucht"] as const).map((k, i) => `<button data-thumb="${k}" aria-label="${["Wurzel", "Blatt", "Blüte", "Frucht"][i]} zeigen">${slotOr(`plant-${e.id}-thumb-${k}`, "pp-thumb", `<span class="pp-glyph" aria-hidden="true">${["⌇", "❧", "✿", "●"][i]}</span>`)}</button>`).join("")}<button class="pp-expand" data-act="expand" aria-label="Bild vergrößern">${ico("expand")}</button></div>
        </div>
      </div>
      <p class="pp-note">${esc(p.traitsNote)}</p>`);

    // --- row B: origin, sensory, growth
    const origin = panel("pp-origin", "pp-originpanel", `
      ${head("Ursprung & Verbreitung", "Historische Herkunft und heutige Anbaugebiete.")}
      <div class="pp-origin-grid">
        <div class="pp-map"><canvas class="pp-map-cv" aria-hidden="true"></canvas><ul class="pp-legend"><li><i style="--c:#f0a248"></i>Ursprungsgebiet</li><li><i style="--c:#7fc46a"></i>Verbreitet / Kultiviert</li></ul></div>
        <div class="pp-place">${slotOr(`plant-${e.id}-origin`, "pp-place-img", ico("globe", "big"))}<h3>${esc(p.origin.place.title)}</h3><p>${esc(p.origin.place.text)}</p></div>
      </div>
      <p class="pp-note">${esc(p.origin.note)}</p>`);
    const sensory = panel("pp-sensory", "pp-sensorypanel", `
      ${head("Geschmack, Duft & Textur")}
      <div class="pp-sens-grid"><ul>${p.sensory.map((s) => `<li><i>${ico(s.icon)}</i><div><strong>${esc(s.label)}</strong><span>${esc(s.value)}</span></div></li>`).join("")}</ul>${slotOr(`plant-${e.id}-powder`, "pp-powder", bowlSvg(`${uid}b`))}</div>`);
    const growth = panel("pp-growth", "pp-growthpanel", `
      ${head("Wachstumszyklus")}
      <ol class="pp-stages">${p.stages.map((s, i) => `<li>${slotOr(`plant-${e.id}-stage-${i + 1}`, "pp-stage-img", stageSvg(`${uid}${i}`, i, { leaf: e.model.color, berry: e.model.color2 }))}<strong>${esc(s.label)}</strong><small>${esc(s.time)}</small></li>`).join("")}</ol>`);

    // --- row C: compounds, effects, frequency
    const cmp = panel("pp-compounds", "pp-compoundspanel", `
      ${head("Inhaltsstoffe", "Wichtige bioaktive Verbindungen.")}
      <div class="pp-ctabs" role="group" aria-label="Stoffgruppe">${p.compounds.map((c, i) => `<button data-cmp="${i}" aria-pressed="${i === 0}">${esc(c.tab)}</button>`).join("")}</div>
      <div class="pp-cmpcard" aria-live="polite"></div>`);
    const fx = claimById(p.frequency.claim);
    const effects = panel("pp-effects", "pp-effectspanel", `
      <div class="pp-eff-fig" aria-hidden="true">${slotOr("body-front", "pp-eff-img", figureSvg(`${uid}f`))}</div>
      <div class="pp-eff-body">
        ${head("Wirkung & Anwendungsbereiche", "Traditionell und erforscht, mit Belegstufe.")}
        <ul class="pp-eff">${p.effects.map((x) => {
          const c = claimById(x.claim);
          return `<li><button data-claim="${x.claim}"><i>${ico(x.icon)}</i><span>${esc(x.label)}</span><em></em>${c ? chip(c.level) : ""}</button></li>`;
        }).join("")}</ul>
        <button class="pp-ghost" data-act="alleff">Alle Wirkungen im Detail <b aria-hidden="true">→</b></button>
        <div class="pp-eff-all" hidden>${p.effects.map((x) => { const c = claimById(x.claim); return c ? claimHtml({ text: c.statement, level: c.level, counter: c.rationale }, x.label) : ""; }).join("")}</div>
        <p class="pp-note">Behauptungen sind keine Tatsachen: Jede Zeile öffnet die Quellen. Keine Anwendungsempfehlung.</p>
      </div>`);
    const freq = panel("pp-freq", "pp-freqpanel", `
      ${head("Frequenzen & Geometrie", "Die energetische Signatur der Pflanze (Überlieferung).")}
      <div class="pp-fcard"><button class="pp-play" data-act="play" aria-pressed="false" aria-label="Ton ${p.frequency.hz} Hertz abspielen">${ico("sound")}</button><div><small>Schwingungsfrequenz</small><strong>${p.frequency.hz} Hz</strong><small>natürliche Resonanz (Behauptung)</small></div><svg class="pp-wave" viewBox="0 0 160 40" preserveAspectRatio="none" aria-hidden="true"><path d=""/></svg></div>
      <div class="pp-fcard"><div class="pp-fol">${flowerOfLifeSvg()}</div><div><small>Geometrische Form</small><strong>${esc(p.frequency.geometry)}</strong><small>(${esc(p.frequency.geometryNote)})</small><button class="pp-ghost sm" data-act="fx">In 3D ansehen <b aria-hidden="true">→</b></button></div></div>
      <p class="pp-themes"><span>Themen:</span>${p.frequency.themes.map((t) => `<em>${esc(t)}</em>`).join("")}</p>
      ${fx ? claimHtml({ text: fx.statement, level: fx.level, counter: fx.rationale }) : ""}
      <p class="pp-note">Reiner Sinuston, leise, startet nur auf Klick. Er zeigt den genannten Wert und keine Wirkung.</p>`);

    // --- row D: forms, combinations
    const forms = panel("pp-forms", "pp-formspanel", `
      ${head("Anwendungsformen", "Wie wird die Pflanze traditionell zubereitet?")}
      <ul class="pp-formgrid">${p.forms.map((f) => `<li>${slotOr(f.slot, "pp-form-img", ico(f.icon, "big"))}<strong>${esc(f.name)}</strong><small>${esc(f.text)}</small></li>`).join("")}</ul>
      <p class="pp-note">Mengen und Dauer nennt diese Seite bewusst nicht (keine Dosierungsangaben). Fertigpräparate: Packungsbeilage und ärztlichen Rat beachten.</p>`);
    const combos = panel("pp-combos", "pp-comboblock", `
      ${head("Kombinationen & Synergien", "Wird in der Überlieferung gemeinsam mit anderen Pflanzen genannt.")}
      <div class="pp-ctabs" role="group" aria-label="Art der Kombination">${p.combos.map((c, i) => `<button data-combo="${i}" aria-pressed="${i === 0}">${esc(c.tab)}</button>`).join("")}</div>
      <div class="pp-carousel"><button class="pp-arrow l" data-act="prev" aria-label="Zurück">‹</button><div class="pp-combo-row" tabindex="-1"></div><button class="pp-arrow r" data-act="next" aria-label="Weiter">›</button></div>`);

    // --- row E: history, research, network
    const history = panel("pp-history", "pp-historypanel", `
      ${head("Geschichte & Kultur", "Verwendung im Laufe der Zeit.")}
      <ol class="pp-hist">${p.history.map((h) => `<li>${slotOr(h.slot, "pp-hist-img", ico(h.icon, "big"))}<strong>${esc(h.title)}</strong><small>${esc(h.sub)}</small><span>${esc(h.text)}</span></li>`).join("")}</ol>
      <div class="pp-timeline" aria-hidden="true">${p.history.map(() => "<i></i>").join("")}</div>
      <p class="pp-note">${esc(p.historyNote)}</p>`);
    const research = panel("pp-research", "pp-researchpanel", `
      ${head("Forschung", "Aktuelle Studien und Erkenntnisse.")}
      <ul class="pp-studies">${p.research.map((r) => `<li${r.more ? ' class="more" hidden' : ""}><div><strong>${esc(r.title)}</strong><small>${r.year ? `Jahr ${r.year} · ` : ""}Suchauszug, Source pending verification</small></div><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Ansehen ${ico("external")}</a></li>`).join("")}</ul>
      <button class="pp-ghost" data-act="allstudies" aria-expanded="false">Alle Studien anzeigen <b aria-hidden="true">→</b></button>
      <p class="pp-note">Kleine Studien, uneinheitliche Qualität: Das ist keine Wirkungsbestätigung. Die zugehörigen Aussagen mit Belegstufe stehen oben bei „Wirkung“.</p>`);
    const nodes = p.network;
    const net = panel("pp-network", "pp-networkpanel", `
      ${head("Wissensnetz", "Verbundene Themen, Pflanzen und Konzepte.")}
      <div class="pp-net" role="group" aria-label="Verbundene Themen">
        <svg class="pp-net-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${nodes.map((_, i) => { const [x, y] = netPos(i, nodes.length); return `<line x1="50" y1="52" x2="${x}" y2="${y}"/>`; }).join("")}</svg>
        <div class="pp-node center"><span class="pp-node-img">${slotOr(hasAsset(`atlas-${e.id}`) ? `atlas-${e.id}` : `nutrient-${e.id}`, "pp-ni", `<span class="pp-glyph" aria-hidden="true">✿</span>`)}</span><em>${esc(e.name)}</em></div>
        ${nodes.map((n, i) => { const [x, y] = netPos(i, nodes.length); const ent = n.kind === "plant" ? entryById(n.ref!) : undefined;
          const img = ent ? slotOr(hasAsset(`atlas-${ent.id}`) ? `atlas-${ent.id}` : `nutrient-${ent.id}`, "pp-ni", `<span class="pp-glyph" aria-hidden="true">✿</span>`) : `<span class="pp-ni pp-ph">${ico(n.kind === "organ" ? "shield" : n.kind === "culture" ? "scroll" : n.kind === "breath" ? "stress" : n.kind === "claim" ? "target" : "dna")}</span>`;
          return `<button class="pp-node ${n.kind}" data-node="${i}" style="left:${x}%;top:${y}%"${n.hint ? ` aria-describedby="pp-net-hint"` : ""}><span class="pp-node-img">${img}</span><em>${esc(n.label)}</em></button>`; }).join("")}
      </div>
      <p class="pp-net-hint" id="pp-net-hint" aria-live="polite">Tippe auf einen Punkt: Pflanzen öffnen ihr Profil, Themen führen zu Körper, Kulturen, Atem oder zur Aussage mit Belegstufe.</p>`);

    return `${hero}
    <div class="pp-wrap">
      <div class="pp-row a">${parts}${traits}</div>
      <div class="pp-row b">${origin}${sensory}${growth}</div>
      <div class="pp-row c">${cmp}${effects}${freq}</div>
      <div class="pp-row d">${forms}${combos}</div>
      <div class="pp-row e">${history}${research}${net}</div>
      ${safetyHtml(p.safety, e)}
    </div>`;
  }

  /** positions of the network nodes on an ellipse around the centre (percent) */
  function netPos(i: number, n: number): [number, number] {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + 0.35;
    return [Math.round(50 + 39 * Math.cos(a)), Math.round(52 + 37 * Math.sin(a))];
  }

  // ------------------------------------------------------------------ the shorter profile of every other plant
  function genericHtml(e: AtlasEntry): string {
    const fam = e.facts.find((f) => f.label === "Familie")?.value;
    const regions = ORIGIN[e.id] ?? [];
    const tags = [CATEGORY_LABEL[e.category], ...(fam ? [fam.replace(/\s*\(.*\)/, "")] : []), ...e.associations.map((a) => a.system).filter((v, i, a) => a.indexOf(v) === i).slice(0, 2)];
    const hasImg = hasAsset(`atlas-${e.id}`) || hasAsset(`nutrient-${e.id}`);
    const imgName = hasAsset(`atlas-${e.id}`) ? `atlas-${e.id}` : `nutrient-${e.id}`;
    const glance = [
      { icon: "dna", label: "Wissenschaftlicher Name", value: e.latin },
      ...e.facts.slice(0, 5).map((f) => ({ icon: f.label === "Familie" ? "family" : f.label === "Verwendete Teile" ? "root" : f.label === "Heimat" ? "globe" : "leaf", label: f.label, value: f.value })),
      ...(regions.length ? [{ icon: "globe", label: "Herkunftsregion", value: regions.map((r) => REGIONS.find((x) => x.id === r)!.name).join(", ") }] : []),
    ];
    const ec = e.claims.map(claimById).filter((c): c is Claim => !!c);
    const hero = `
    <header class="pp-hero generic" id="pp-top">
      <div class="pp-hero-art" aria-hidden="true">${hasImg ? slotOr(imgName, "pp-hero-img", "") : `<div class="pp-hero-glyph" style="--tint:${esc(e.model.color)}"><span>✿</span><small>Bild folgt</small></div>`}</div>
      <div class="pp-hero-text">
        <nav class="pp-crumbs" aria-label="Pfad"><button data-act="back">Pflanzenatlas</button><i>›</i><span>${esc(CATEGORY_LABEL[e.category])}</span><i>›</i><strong>${esc(e.name)}</strong></nav>
        <h1>${esc(e.name)}</h1>
        <p class="pp-latin">${esc(e.latin)}</p>
        <ul class="pp-tags">${tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        <p class="pp-lead">${esc(e.tradition)}</p>
        <p class="pp-bubbles-note">Kurzprofil. Das ausführliche Profil mit Bildern, Inhaltsstoffen und Forschung folgt.</p>
      </div>
      <aside class="pp-glance" aria-label="Auf einen Blick"><h2>Auf einen Blick</h2><dl>${glance.map((g) => `<div><i>${ico(g.icon)}</i><dt>${esc(g.label)}</dt><dd>${esc(g.value)}</dd></div>`).join("")}</dl></aside>
    </header>`;
    const trad = panel("pp-assoc", "pp-assocpanel", `
      ${head("Überlieferte Zuordnungen", "Wem die Überlieferung diese Pflanze zuordnet. Das ist kein Wirkungsnachweis.")}
      ${e.associations.length ? `<ul class="pp-assoc">${e.associations.map((a) => `<li><strong>${esc(a.target)}</strong><small>${esc(a.system)} · ${esc(ORIGIN_LABEL[a.origin])}</small>${a.note ? `<span>${esc(a.note)}</span>` : ""}</li>`).join("")}</ul>` : `<p class="pp-sub">Für diese Pflanze sind noch keine Zuordnungen erfasst.</p>`}`);
    const cl = panel("pp-claims", "pp-claimspanel", `
      ${head("Aussagen mit Belegstufe", "Jede Aussage ist zunächst eine Behauptung, bis Fachleute sie geprüft haben.")}
      ${ec.length ? ec.map((c) => claimHtml({ text: c.statement, level: c.level, counter: c.rationale })).join("") : `<p class="pp-sub">Noch keine Aussagen erfasst.</p>`}`);
    const comb = panel("pp-combos", "pp-comboblock", `
      ${head("Kombinationen", "Überlieferte Paarungen mit anderen Einträgen.")}
      ${e.combinations.length ? `<ul class="pp-assoc">${e.combinations.map((c) => { const o = entryById(c.with); return `<li>${o ? `<button class="pp-link" data-plant="${o.id}"><strong>${esc(o.name)}</strong> ${ico("arrow")}</button>` : `<strong>${esc(c.with)}</strong>`}<small>${esc(ORIGIN_LABEL[c.origin])}</small><span>${esc(c.note)}</span></li>`; }).join("")}</ul>` : `<p class="pp-sub">Noch keine Kombinationen erfasst.</p>`}`);
    const org = regions.length ? panel("pp-origin", "pp-originpanel", `
      ${head("Herkunft", "Herkunftsregion nach Lehrbuchwissen.")}
      <div class="pp-map"><canvas class="pp-map-cv" aria-hidden="true"></canvas><ul class="pp-legend"><li><i style="--c:#f0a248"></i>Herkunftsregion</li></ul></div>
      <p class="pp-note">Grobe Darstellung (Source pending verification).</p>`) : "";
    const src = panel("pp-sources", "pp-sourcespanel", `
      ${head("Quellen")}
      <ul class="pp-assoc">${e.sources.map((s) => `<li><strong>${esc(s.title)}</strong><small>${esc(s.author)}</small><span>${esc(s.citation)}${s.url ? ` · <a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">Seite öffnen</a>` : ""}${s.verified ? "" : " · nicht geprüft"}</span></li>`).join("")}</ul>`);
    return `${hero}<div class="pp-wrap"><div class="pp-row g1">${trad}${cl}</div><div class="pp-row g2">${comb}${org}${src}</div>${safetyHtml("Information, keine medizinische Beratung. Pflanzen können Wechselwirkungen mit Medikamenten haben; bei Beschwerden, Schwangerschaft oder Medikamenten bitte ärztlich oder in der Apotheke nachfragen. Wildpflanzen und Pilze nur sammeln und essen, wenn eine Fachperson sie sicher bestimmt hat.", e)}</div>`;
  }

  // ------------------------------------------------------------------ show / interactions
  function show(id: string) {
    const e = entryById(id);
    if (!e) return;
    stopTone();
    current = id;
    const p = PROFILES[id];
    scroll.innerHTML = p ? fullHtml(e, p) : genericHtml(e);
    scroll.scrollTop = 0;
    mountSlots(scroll);
    if (p) { renderCompound(p, 0); renderCombos(p, 0); drawWave(); setPart(p, "gesamt"); }
    resize?.disconnect();
    const cv = scroll.querySelector<HTMLCanvasElement>(".pp-map-cv");
    if (cv) {
      const home = p ? p.origin.home : (ORIGIN[id] ?? []).map((r) => REGION_BOX[r]);
      const spread = p ? p.origin.spread : [];
      resize = new ResizeObserver(() => drawMap(cv, home, spread));
      resize.observe(cv);
    }
    spy();
  }

  function setPart(p: PlantProfile, id: string) {
    const part = p.parts.find((x) => x.id === id)!;
    scroll.querySelectorAll<HTMLElement>(".pp-partbtns [data-part]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.part === id)));
    const fig = scroll.querySelector<HTMLElement>(".pp-fig")!;
    if (id === "gesamt") fig.removeAttribute("data-sel"); else fig.dataset.sel = id;
    scroll.querySelectorAll<HTMLElement>(".pp-call").forEach((c) => c.classList.toggle("on", c.dataset.part === id));
    scroll.querySelectorAll<SVGGElement>(".pp-lines [data-line]").forEach((g) => g.classList.toggle("on", g.dataset.line === id));
    const ring = scroll.querySelector<HTMLElement>(".pp-ring")!;
    if (part.callout) { ring.hidden = false; ring.style.left = `${part.callout.to[0]}%`; ring.style.top = `${part.callout.to[1]}%`; }
    else if (id === "staengel") { ring.hidden = false; ring.style.left = "50%"; ring.style.top = "58%"; }
    else ring.hidden = true;
    scroll.querySelector<HTMLElement>(".pp-partnote")!.innerHTML = `<strong>${esc(part.title)}</strong> ${esc(part.text)}`;
  }

  function renderCompound(p: PlantProfile, i: number) {
    const c = p.compounds[i];
    scroll.querySelectorAll<HTMLElement>("[data-cmp]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.cmp) === i)));
    const card = scroll.querySelector<HTMLElement>(".pp-cmpcard")!;
    const sName = `compound-${c.title.toLowerCase().replace(/\s+/g, "-")}`;
    const withStruct = c.formula && hasAsset(sName);
    card.innerHTML = `
      <h3>${esc(c.title)}</h3>
      <div class="pp-cmp-body">
        <div>
          <ul class="pp-bul">${c.bullets.map((b) => `<li>${ico("check")}${esc(b)}</li>`).join("")}</ul>
          ${c.bulletsNote ? `<p class="pp-cmp-note">${esc(c.bulletsNote)}</p>` : ""}
          ${c.formula ? `<p class="pp-formula"><span>Summenformel</span><strong>${esc(c.formula).replace(/(\d+)/g, "<sub>$1</sub>")}</strong>${c.mass ? `<em>${esc(c.mass)}</em>` : ""}</p>` : ""}
        </div>
        ${c.formula ? (withStruct ? `<div class="pp-struct pp-img"><div data-slot="${sName}" data-fit="cover"></div></div>` : `<div class="pp-struct pp-img"><div class="pp-ph"><span>${esc(c.formula).replace(/(\d+)/g, "<sub>$1</sub>")}</span><small>Strukturformel: Bild folgt</small></div></div>`) : ""}
      </div>
      <button class="pp-more" data-act="cmpmore" aria-expanded="false">Mehr über ${esc(c.tab)} ${ico("arrow")}</button>
      <p class="pp-cmp-text" hidden>${esc(c.text)}</p>`;
    mountSlots(card);
  }

  function renderCombos(p: PlantProfile, i: number) {
    const c = p.combos[i];
    scroll.querySelectorAll<HTMLElement>("[data-combo]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.combo) === i)));
    const row = scroll.querySelector<HTMLElement>(".pp-combo-row")!;
    const cards = c.items.map((it, k) => {
      const other = it.ids.find((x) => x !== p.id), oe = other ? entryById(other) : undefined;
      return `<article class="pp-combo"><div class="pp-combo-img">${slotOr(it.slot ?? "form-pulver", "pp-ci", ico("link", "big"))}</div><strong>${esc(it.title)}</strong><small>${esc(it.sub)}</small>${oe ? `<button class="pp-ghost sm dark" data-plant="${oe.id}">Profil ${esc(oe.name)} <b aria-hidden="true">→</b></button>` : ""}</article>`;
    });
    row.innerHTML = (c.intro ? `<p class="pp-combo-intro">${esc(c.intro)}</p>` : "") + cards.join("");
    row.classList.toggle("intro-only", !c.items.length);
    row.scrollLeft = 0;
    mountSlots(row);
  }

  function drawWave(phase = 0, amp = 1) {
    const path = scroll.querySelector<SVGPathElement>(".pp-wave path");
    if (!path) return;
    let d = "";
    for (let x = 0; x <= 160; x += 2) { const env = Math.sin((x / 160) * Math.PI); d += `${x ? "L" : "M"}${x} ${(20 + Math.sin(x * 0.42 + phase) * 15 * env * amp).toFixed(1)} `; }
    path.setAttribute("d", d);
  }
  function loop(t: number) {
    drawWave(t / 160, 1);
    raf = playing && !api.reduceMotion ? requestAnimationFrame(loop) : 0;
  }

  // scroll spy for the section tabs
  let spyRaf = 0;
  function spy() {
    const tabs = [...scroll.querySelectorAll<HTMLElement>(".pp-tab[data-to]")];
    if (!tabs.length) return;
    const top = scroll.getBoundingClientRect().top + 120;
    // the section whose top is the lowest one still above the reading line (tabs are not in page order)
    let cur = tabs[0], best = -Infinity;
    for (const t of tabs) {
      const y = scroll.querySelector<HTMLElement>(`#${t.dataset.to}`)?.getBoundingClientRect().top;
      if (y !== undefined && y <= top && y > best) { best = y; cur = t; }
    }
    scroll.querySelectorAll<HTMLElement>(".pp-tab").forEach((t) => (t === cur ? t.setAttribute("aria-current", "true") : t.removeAttribute("aria-current")));
  }
  scroll.addEventListener("scroll", () => { if (!spyRaf) spyRaf = requestAnimationFrame(() => { spyRaf = 0; spy(); }); }, { passive: true });

  function lightbox() {
    const box = document.createElement("div");
    box.className = "pp-lightbox";
    box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Bild vergrößert");
    const main = scroll.querySelector<HTMLElement>(".pp-main-img")!;
    box.innerHTML = `<div class="pp-lb-in">${main.outerHTML}</div><button class="pp-lb-x" aria-label="Schließen">×</button>`;
    const close = () => { box.remove(); document.removeEventListener("keydown", onKey); };
    const onKey = (ev: KeyboardEvent) => { if (ev.key === "Escape") close(); };
    box.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    root.append(box);
    box.querySelector<HTMLElement>(".pp-lb-x")!.focus();
  }

  scroll.addEventListener("click", (ev) => {
    const t = ev.target as HTMLElement;
    if (toggleRedaction(t)) return;
    const p = current ? PROFILES[current] : undefined;
    const e = current ? entryById(current) : undefined;
    const to = t.closest<HTMLElement>("[data-to]");
    if (to) {
      const el = scroll.querySelector<HTMLElement>(`#${to.dataset.to}`);
      if (el) {
        const bar = scroll.querySelector<HTMLElement>(".pp-tabs")?.offsetHeight ?? 0;
        scroll.scrollTo({ top: el.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop - bar - 64, behavior: api.reduceMotion ? "auto" : "smooth" });
      }
      return;
    }
    const pl = t.closest<HTMLElement>("[data-plant]");
    if (pl) { api.openPlant(pl.dataset.plant!); return; }
    const part = t.closest<HTMLElement>("[data-part]");
    if (part && p) { setPart(p, part.dataset.part!); return; }
    const cmp = t.closest<HTMLElement>("[data-cmp]");
    if (cmp && p) { renderCompound(p, Number(cmp.dataset.cmp)); return; }
    const cb = t.closest<HTMLElement>("[data-combo]");
    if (cb && p) { renderCombos(p, Number(cb.dataset.combo)); return; }
    const th = t.closest<HTMLElement>("[data-thumb]");
    if (th) {
      const k = th.dataset.thumb!, main = scroll.querySelector<HTMLElement>(".pp-main")!;
      if (e && hasAsset(`plant-${e.id}-thumb-${k}`)) { main.innerHTML = `<div class="pp-main-img" data-slot="plant-${e.id}-thumb-${k}" data-fit="cover"></div>`; mountSlots(main); }
      scroll.querySelectorAll(".pp-thumbs [data-thumb]").forEach((b) => b.classList.toggle("on", b === th));
      return;
    }
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) { api.openClaim(cl.dataset.claim!, cl); return; }
    const nd = t.closest<HTMLElement>("[data-node]");
    if (nd && p) {
      const n = p.network[Number(nd.dataset.node)];
      if (n.kind === "plant") api.openPlant(n.ref!);
      else if (n.kind === "claim") api.openClaim(n.ref!, nd);
      else if (n.kind === "organ") api.openBody(n.ref);
      else if (n.kind === "culture") api.openCultures();
      else if (n.kind === "breath") api.openBreath();
      else scroll.querySelector<HTMLElement>(".pp-net-hint")!.textContent = n.hint ?? "";
      return;
    }
    const act = t.closest<HTMLElement>("[data-act]")?.dataset.act;
    if (!act) return;
    if (act === "back") api.back();
    else if (act === "atlas" && e) api.openAtlas(e.id);
    else if (act === "lab") api.openLab();
    else if (act === "fx") api.openFxGeometry();
    else if (act === "expand") lightbox();
    else if (act === "alleff") {
      const box = scroll.querySelector<HTMLElement>(".pp-eff-all")!, btn = t.closest<HTMLElement>("[data-act]")!;
      box.hidden = !box.hidden;
      btn.setAttribute("aria-expanded", String(!box.hidden));
    } else if (act === "allstudies") {
      const btn = t.closest<HTMLElement>("[data-act]")!, open = btn.getAttribute("aria-expanded") !== "true";
      scroll.querySelectorAll<HTMLElement>(".pp-studies .more").forEach((li) => (li.hidden = !open));
      btn.setAttribute("aria-expanded", String(open));
      btn.firstChild!.textContent = open ? "Weniger anzeigen " : "Alle Studien anzeigen ";
    } else if (act === "cmpmore") {
      const btn = t.closest<HTMLElement>("[data-act]")!, txt = scroll.querySelector<HTMLElement>(".pp-cmp-text")!;
      txt.hidden = !txt.hidden;
      btn.setAttribute("aria-expanded", String(!txt.hidden));
    } else if (act === "prev" || act === "next") {
      const row = scroll.querySelector<HTMLElement>(".pp-combo-row")!;
      row.scrollBy({ left: (act === "next" ? 1 : -1) * row.clientWidth * 0.8, behavior: api.reduceMotion ? "auto" : "smooth" });
    } else if (act === "play") {
      const btn = t.closest<HTMLElement>("[data-act]")!;
      if (playing) { stopTone(); btn.setAttribute("aria-pressed", "false"); drawWave(); return; }
      if (p && tone.start(p.frequency.hz)) {
        playing = true; btn.setAttribute("aria-pressed", "true");
        if (!api.reduceMotion) raf = requestAnimationFrame(loop);
      }
    }
  });

  return {
    show,
    stop() { stopTone(); resize?.disconnect(); resize = null; root.querySelector(".pp-lightbox")?.remove(); },
  };
}
