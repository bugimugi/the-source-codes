import { atlas } from "../data/atlas";
import { claims } from "../data/claims";
import { CATEGORY_LABEL, LEVEL_LABEL, ORIGIN_LABEL, type AtlasEntry, type Claim, type EvidenceLevel } from "../data/types";
import { PROFILES } from "../data/profiles";
import type { Box, MapLayer, PlantProfile } from "../data/profileTypes";
import { ORIGIN, REGIONS, type Region } from "../data/plants";
import dots from "../data/landdots.json";
import { hasAsset, mountSlots } from "../assets/slots";
import { createTone } from "../audio/tone";
import { claimHtml, esc, toggleRedaction } from "./dossierParts";
import { ico } from "./icons";
import { bowlSvg, figureSvg, flowerOfLifeSvg, fruitSvg, fruitStageSvg, plantSvg, seedPatternSvg, stageSvg } from "./plantArt";

/** the landing page a profile was opened from: the plant atlas or the fruit and vegetable atlas */
export type ProfileFrom = "plants" | "produce" | "trees";
const FROM_LABEL: Record<ProfileFrom, string> = { plants: "Pflanzenatlas", produce: "Obst & Gemüse Atlas", trees: "Baum Atlas" };

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
  /** back to the page the profile was opened from */
  back(from: ProfileFrom): void;
}

const SHORT: Record<EvidenceLevel, string> = {
  claimed: "Behauptung · ungeprüft", established: "Gesichert", supported: "Belegt, Deutung offen", hypothesis: "Hypothese",
  historical: "Historisch belegt", unsupported: "Nicht belegt", refuted: "Widerlegt",
};
const claimById = (id: string): Claim | undefined => claims.find((c) => c.id === id);
const entryById = (id: string): AtlasEntry | undefined => atlas.find((e) => e.id === id);
const br = (s: string) => esc(s).replace(/\n/g, "<br>");
const chip = (level: EvidenceLevel) => `<span class="pp-lvl" style="--c:var(--lvl-${level})" title="${esc(LEVEL_LABEL[level])}">${esc(SHORT[level])}</span>`;
const sub = (formula: string) => esc(formula).replace(/(\d+)/g, "<sub>$1</sub>");

/** a box holding the picture slot when the file exists, else the drawn placeholder (the box is sized by the CSS class `cls`) */
function slotOr(name: string, cls: string, fallback: string, alt = ""): string {
  const inner = hasAsset(name)
    ? `<div data-slot="${name}" data-fit="cover"${alt ? ` data-alt="${esc(alt)}"` : ""}></div>`
    : `<div class="pp-ph">${fallback}</div>`;
  return `<div class="pp-img ${cls}">${inner}</div>`;
}

/** rough boxes of the world regions for plants without their own origin map */
const REGION_BOX: Record<Region, Box> = {
  europa: { lat0: 36, lon0: -10, lat1: 62, lon1: 40 }, asien: { lat0: 5, lon0: 60, lat1: 55, lon1: 140 }, afrika: { lat0: -34, lon0: -17, lat1: 35, lon1: 50 },
  nordamerika: { lat0: 15, lon0: -130, lat1: 60, lon1: -60 }, suedamerika: { lat0: -55, lon0: -80, lat1: 12, lon1: -35 }, ozeanien: { lat0: -45, lon0: 110, lat1: -10, lon1: 155 },
};
const inBox = (lat: number, lon: number, b: Box) => lat >= b.lat0 && lat <= b.lat1 && lon >= b.lon0 && lon <= b.lon1;

/** the land dots of the world, coloured by the first layer that contains them */
function drawMap(cv: HTMLCanvasElement, layers: MapLayer[]) {
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
    const layer = layers.find((l) => l.boxes.some((b) => inBox(lat, lon, b)));
    g.fillStyle = layer ? layer.color : "rgba(214,186,128,0.34)";
    g.fillRect(ox + (lon + 180) * sc - rad / 2, oy + (78 - lat) * sc - rad / 2, rad, rad);
  }
}

let uidN = 0;
const panel = (id: string, cls: string, inner: string, label = "") => `<section class="pp-panel ${cls}" id="${id}"${label ? ` aria-label="${esc(label)}"` : ""}>${inner}</section>`;
const head = (title: string, subText?: string) => `<h2>${esc(title)}</h2>${subText ? `<p class="pp-sub">${esc(subText)}</p>` : ""}`;

function safetyHtml(text: string, e: AtlasEntry, from: ProfileFrom): string {
  return `<aside class="pp-safety" aria-label="Hinweis"><p>${esc(text)}</p><div class="pp-actions"><button class="pp-ghost" data-act="atlas">${ico("globe")}Im 3D-Atlas ansehen</button><button class="pp-ghost" data-act="back">${ico("arrow")}Zurück zum ${FROM_LABEL[from]}</button></div><p class="pp-pilot">Pilot: nicht fachlich geprüft. Alle Aussagen tragen eine Belegstufe; Quellen nennen wir als „Source pending verification“, solange das Original nicht geprüft ist. ${esc(e.name)} ersetzt keine ärztliche Beratung.</p></aside>`;
}

/** the drawn placeholder of a profile: herb or fruit */
const artFor = (p: PlantProfile, uid: string, sketch = false, ground = true) => (p.art === "fruit" ? fruitSvg(uid, { sketch, ground }) : plantSvg(uid, { sketch, ground }));

// ---------------------------------------------------------------------------------------------------------- the sections of a full profile
function heroHtml(e: AtlasEntry, p: PlantProfile, uid: string, from: ProfileFrom): string {
  const tabs: { label: string; icon: string; to?: string; act?: string }[] = p.layout === "frucht"
    ? [
      { label: "Übersicht", icon: "overview", to: "pp-top" }, { label: "Eigenschaften", icon: "leaf", to: "pp-traits" }, { label: "Nährstoffe", icon: "flask", to: "pp-nutrients" },
      { label: "Wirkung", icon: "target", to: "pp-effects" }, { label: "Anwendung", icon: "cup", to: "pp-forms" }, { label: "Rezepte", icon: "book", act: "lab" },
      { label: "Kombinationen", icon: "link", to: "pp-combos" }, { label: "Frequenzen & Geometrie", icon: "hex", to: "pp-freq" }, { label: "Geschichte", icon: "scroll", to: "pp-history" },
      { label: "Anbau & Ernte", icon: "sprout", to: "pp-growth" }, { label: "Forschung", icon: "microscope", to: "pp-research" },
    ]
    : [
      { label: "Übersicht", icon: "overview", to: "pp-top" }, { label: "Eigenschaften", icon: "leaf", to: "pp-traits" }, { label: "Inhaltsstoffe", icon: "flask", to: "pp-compounds" },
      { label: "Wirkung", icon: "target", to: "pp-effects" }, { label: "Anwendung", icon: "cup", to: "pp-forms" }, { label: "Kombinationen", icon: "link", to: "pp-combos" },
      { label: "Rezepte", icon: "book", act: "lab" }, { label: "Frequenzen & Geometrie", icon: "hex", to: "pp-freq" }, { label: "Geschichte", icon: "scroll", to: "pp-history" },
      { label: "Anbau & Ernte", icon: "sprout", to: "pp-growth" }, { label: "Forschung", icon: "microscope", to: "pp-research" },
    ];
  const heroImg = hasAsset(`plant-${e.id}-hero`);
  return `
    <header class="pp-hero${heroImg ? " has-img" : ""}" id="pp-top">
      ${heroImg ? `<div class="pp-hero-bg" data-slot="plant-${e.id}-hero" data-fit="cover" data-eager="true"></div>` : `<div class="pp-hero-art" aria-hidden="true">${artFor(p, `${uid}h`, false, false)}</div>`}
      <div class="pp-hero-text">
        <nav class="pp-crumbs" aria-label="Pfad"><button data-act="back">${FROM_LABEL[from]}</button><i>›</i><span>${esc(p.crumb)}</span><i>›</i><strong>${esc(e.name)}</strong></nav>
        <h1>${esc(e.name)}</h1>
        <p class="pp-latin">${esc(e.latin)}</p>
        <ul class="pp-tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        <p class="pp-lead">${esc(p.lead)}</p>
        <ul class="pp-bubbles" aria-label="Themen in der Überlieferung">${p.bubbles.map((b) => `<li><i>${ico(b.icon)}</i><span>${br(b.label)}</span></li>`).join("")}</ul>
        <p class="pp-bubbles-note">Themen der Überlieferung, keine Wirkversprechen</p>
      </div>
      <aside class="pp-glance" aria-label="Auf einen Blick">
        ${slotOr(`plant-${e.id}-sketch`, "pp-sketch", artFor(p, `${uid}s`, true))}
        <h2>Auf einen Blick</h2>
        <dl>${p.glance.map((g) => `<div><i>${ico(g.icon)}</i><dt>${esc(g.label)}</dt><dd>${esc(g.value)}</dd></div>`).join("")}</dl>
      </aside>
    </header>
    <nav class="pp-tabs" aria-label="Abschnitte">${tabs.map((t, i) => `<button class="pp-tab" ${t.to ? `data-to="${t.to}"` : `data-act="${t.act}"`} ${i === 0 ? 'aria-current="true"' : ""}>${ico(t.icon)}<span>${esc(t.label)}</span></button>`).join("")}</nav>`;
}

function partsHtml(e: AtlasEntry, p: PlantProfile, uid: string): string {
  return panel("pp-plant", "pp-parts", `
      ${head(p.t.parts, p.t.partsSub)}
      <div class="pp-parts-grid">
        <ul class="pp-partbtns" role="group" aria-label="Teil wählen">${p.parts.map((x) => `<li><button data-part="${x.id}" aria-pressed="${x.id === p.startPart}">${ico(x.icon)}<span>${esc(x.label)}</span></button></li>`).join("")}</ul>
        <div class="pp-figwrap">
          <figure class="pp-fig">
            ${slotOr(`plant-${e.id}-parts`, "pp-fig-img", artFor(p, `${uid}p`), `${e.name} mit seinen Teilen`)}
            <svg class="pp-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${p.parts.filter((x) => x.callout).map((x) => {
              const c = x.callout!, ax = c.side === "l" ? c.at[0] + 19 : c.at[0] - 0.6, ay = c.at[1] + 3.4;
              return `<g data-line="${x.id}"><line x1="${ax}" y1="${ay}" x2="${c.to[0]}" y2="${c.to[1]}"/><circle cx="${c.to[0]}" cy="${c.to[1]}" r="1.1"/></g>`;
            }).join("")}</svg>
            ${p.parts.filter((x) => x.callout).map((x) => `<button class="pp-call ${x.callout!.side}" data-part="${x.id}" style="left:${x.callout!.at[0]}%;top:${x.callout!.at[1]}%"><strong>${esc(x.id === "frucht" && p.layout === "frucht" ? "Fruchtfleisch" : x.label)}</strong><small>${br(x.callout!.short)}</small></button>`).join("")}
            <span class="pp-ring" hidden></span>
          </figure>
          <p class="pp-partnote" aria-live="polite"></p>
        </div>
      </div>`);
}

function traitsHtml(e: AtlasEntry, p: PlantProfile): string {
  const list = `<dl class="pp-traitlist">${p.traits.map((t) => `<div><i>${ico(t.icon)}</i><dt>${esc(t.label)}</dt><dd>${esc(t.value)}</dd></div>`).join("")}</dl>`;
  const gallery = `<div class="pp-gallery">
          <div class="pp-main">${slotOr(`plant-${e.id}-photo`, "pp-main-img", `<span class="pp-glyph" aria-hidden="true">✿</span><small>Bild folgt</small>`, `${e.name}: Blüte`)}</div>
          <div class="pp-thumbs">${(["wurzel", "blatt", "bluete", "frucht"] as const).map((k, i) => `<button data-thumb="${k}" aria-label="${["Wurzel", "Blatt", "Blüte", "Frucht"][i]} zeigen">${slotOr(`plant-${e.id}-thumb-${k}`, "pp-thumb", `<span class="pp-glyph" aria-hidden="true">${["⌇", "❧", "✿", "●"][i]}</span>`)}</button>`).join("")}<button class="pp-expand" data-act="expand" aria-label="Bild vergrößern">${ico("expand")}</button></div>
        </div>`;
  return panel("pp-traits", "pp-traitspanel", `${head(p.t.traits)}${p.gallery ? `<div class="pp-traits-grid">${list}${gallery}</div>` : `<div class="pp-traits-one">${list}</div>`}<p class="pp-note">${esc(p.traitsNote)}</p>`);
}

function originHtml(e: AtlasEntry, p: PlantProfile): string {
  return panel("pp-origin", "pp-originpanel", `
      ${head(p.t.origin, p.t.originSub)}
      <div class="pp-origin-grid">
        <div class="pp-map"><canvas class="pp-map-cv" aria-hidden="true"></canvas><ul class="pp-legend">${p.origin.layers.map((l) => `<li><i style="--c:${l.color}"></i>${esc(l.label)}</li>`).join("")}</ul></div>
        <div class="pp-place">${slotOr(`plant-${e.id}-origin`, "pp-place-img", ico("globe", "big"))}<h3>${esc(p.origin.place.title)}</h3><p>${esc(p.origin.place.text)}</p></div>
      </div>
      <p class="pp-note">${esc(p.origin.note)}</p>`);
}

function sensoryHtml(e: AtlasEntry, p: PlantProfile, uid: string): string {
  const pic = p.art === "fruit" ? slotOr(`plant-${e.id}-bowl`, "pp-powder", bowlSvg(`${uid}b`, "arils")) : slotOr(`plant-${e.id}-powder`, "pp-powder", bowlSvg(`${uid}b`));
  return panel("pp-sensory", "pp-sensorypanel", `
      ${head("Geschmack, Duft & Textur")}
      <div class="pp-sens-grid"><ul>${p.sensory.map((s) => `<li><i>${ico(s.icon)}</i><div><strong>${esc(s.label)}</strong><span>${esc(s.value)}</span></div></li>`).join("")}</ul>${pic}</div>`);
}

/** herb layout: the growth stages as a row of cards */
function stagesHtml(e: AtlasEntry, p: PlantProfile, uid: string): string {
  return panel("pp-growth", "pp-growthpanel", `
      ${head("Wachstumszyklus")}
      <ol class="pp-stages">${p.stages.map((s, i) => `<li>${slotOr(`plant-${e.id}-stage-${i + 1}`, "pp-stage-img", stageSvg(`${uid}${i}`, i, { leaf: e.model.color, berry: e.model.color2 }))}<strong>${esc(s.label)}</strong><small>${esc(s.time)}</small></li>`).join("")}</ol>`);
}

/** fruit layout: the growth cycle as a parchment card with four stages and arrows */
function cycleHtml(e: AtlasEntry, p: PlantProfile): string {
  const at = ["c1 r2", "c1 r1", "c2 r1", "c2 r2"];
  return panel("pp-growth", "pp-cyclepanel", `
      <div class="pp-cycle-card">
        <h2>Wachstumszyklus</h2>
        <div class="pp-cycle-wrap">
          <ol class="pp-cycle">${p.stages.map((s, i) => `<li class="${at[i % 4]}">${slotOr(`plant-${e.id}-stage-${i + 1}`, "pp-stage-img", fruitStageSvg(i))}<strong>${esc(s.label)}</strong><small>${esc(s.time)}</small></li>`).join("")}</ol>
          <span class="pp-cyc a1" aria-hidden="true">→</span><span class="pp-cyc a2" aria-hidden="true">↓</span><span class="pp-cyc a3" aria-hidden="true">←</span><span class="pp-cyc a4" aria-hidden="true">↑</span>
        </div>
      </div>`);
}

function nutrientsHtml(p: PlantProfile): string {
  const n = p.nutrients!;
  return panel("pp-nutrients", "pp-nutpanel", `
      <h2>Nährstoffe <small>(${esc(n.per)})</small></h2>
      <div class="pp-nut-grid">
        <ul class="pp-bars">${n.rows.map((r) => `<li><span>${esc(r.label)}</span>${r.share !== undefined ? `<i class="pp-bar" role="img" aria-label="${Math.round(r.share * 100)} % des EU-Referenzwerts"><b style="width:${(r.share * 100).toFixed(1)}%"></b></i>` : `<i class="pp-bar none" aria-hidden="true"></i>`}<em>${esc(r.value)}</em></li>`).join("")}</ul>
        <aside class="pp-rich"><h3>${esc(n.richTitle)}</h3><ul>${n.rich.map((x) => `<li><i>${ico("drop")}</i>${esc(x)}</li>`).join("")}</ul></aside>
      </div>
      <p class="pp-note">${esc(n.note)}</p>`);
}

function compoundsHtml(p: PlantProfile): string {
  return panel("pp-compounds", "pp-compoundspanel", `
      ${head(p.t.compounds, p.t.compoundsSub || undefined)}
      <div class="pp-ctabs" role="group" aria-label="Stoffgruppe">${p.compounds.map((c, i) => `<button data-cmp="${i}" aria-pressed="${i === 0}">${esc(c.tab)}</button>`).join("")}</div>
      <div class="pp-cmpcard" aria-live="polite"></div>
      <ul class="pp-cthumbs" hidden></ul>`);
}

function effectsHtml(p: PlantProfile, uid: string): string {
  return panel("pp-effects", `pp-effectspanel${p.layout === "frucht" ? " fig-left" : ""}`, `
      <div class="pp-eff-fig" aria-hidden="true">${slotOr("body-front", "pp-eff-img", figureSvg(`${uid}f`))}</div>
      <div class="pp-eff-body">
        ${head(p.t.effects, p.t.effectsSub)}
        <ul class="pp-eff">${p.effects.map((x) => {
          const c = claimById(x.claim);
          return `<li><button data-claim="${x.claim}"><i>${ico(x.icon)}</i><span>${esc(x.label)}</span><em></em>${c ? chip(c.level) : ""}</button></li>`;
        }).join("")}</ul>
        <button class="pp-ghost" data-act="alleff">Alle Wirkungen im Detail <b aria-hidden="true">→</b></button>
        <div class="pp-eff-all" hidden>${p.effects.map((x) => { const c = claimById(x.claim); return c ? claimHtml({ text: c.statement, level: c.level, counter: c.rationale }, x.label) : ""; }).join("")}</div>
        <p class="pp-note">Behauptungen sind keine Tatsachen: Jede Zeile öffnet die Quellen. Keine Anwendungsempfehlung.</p>
      </div>`);
}

function freqHtml(p: PlantProfile, uid: string): string {
  const f = p.frequency, fx = claimById(f.claim);
  return panel("pp-freq", "pp-freqpanel", `
      ${head("Frequenzen & Geometrie", p.t.freqSub)}
      <div class="pp-fcard"><button class="pp-play" data-act="play" aria-pressed="false" aria-label="Ton abspielen">${ico("sound")}</button><div><small>Schwingungsfrequenz</small><strong class="pp-hz">${f.hz} Hz</strong><small>${esc(f.hzNote)}</small></div><svg class="pp-wave" viewBox="0 0 160 40" preserveAspectRatio="none" aria-hidden="true"><path d=""/></svg></div>
      <div class="pp-fcard two"><div class="pp-fol">${f.pattern === "seeds" ? seedPatternSvg(`${uid}sp`) : flowerOfLifeSvg()}</div><div><small>Geometrische Form</small><strong>${esc(f.geometry)}</strong><small>(${esc(f.geometryNote)})</small>${f.symbolics ? `<small class="pp-sym">Symbolik: ${esc(f.symbolics)}</small>` : ""}<button class="pp-ghost sm" data-act="fx">${esc(f.fxLabel)} <b aria-hidden="true">→</b></button></div></div>
      ${f.themes.length ? `<p class="pp-themes"><span>Themen:</span>${f.themes.map((t) => `<em>${esc(t)}</em>`).join("")}</p>` : ""}
      ${f.more ? `<div class="pp-morehz"><span>Weitere Frequenzen</span><div role="group" aria-label="Frequenz wählen">${f.more.map((h) => `<button data-hz="${h}" aria-pressed="${h === f.hz}">${h} Hz</button>`).join("")}</div></div>` : ""}
      ${fx ? claimHtml({ text: fx.statement, level: fx.level, counter: fx.rationale }) : ""}
      <p class="pp-note">Reiner Sinuston, leise, startet nur auf Klick. Er zeigt den genannten Wert und keine Wirkung.</p>`);
}

function formsHtml(p: PlantProfile): string {
  return panel("pp-forms", "pp-formspanel", `
      ${head(p.t.forms, p.t.formsSub)}
      <ul class="pp-formgrid" style="--n:${p.forms.length}">${p.forms.map((f) => `<li>${slotOr(f.slot, "pp-form-img", ico(f.icon, "big"))}<strong>${esc(f.name)}</strong><small>${esc(f.text)}</small></li>`).join("")}</ul>
      <p class="pp-note">Mengen und Dauer nennt diese Seite bewusst nicht (keine Dosierungsangaben). Fertigpräparate: Packungsbeilage und ärztlichen Rat beachten.</p>`);
}

function combosHtml(p: PlantProfile): string {
  return panel("pp-combos", "pp-comboblock", `
      ${head(p.t.combos, p.t.combosSub)}
      <div class="pp-ctabs" role="group" aria-label="Art der Kombination">${p.combos.map((c, i) => `<button data-combo="${i}" aria-pressed="${i === 0}">${esc(c.tab)}</button>`).join("")}</div>
      <div class="pp-carousel"><button class="pp-arrow l" data-act="prev" aria-label="Zurück">‹</button><div class="pp-combo-row" tabindex="-1"></div><button class="pp-arrow r" data-act="next" aria-label="Weiter">›</button></div>`);
}

function historyHtml(p: PlantProfile): string {
  return panel("pp-history", "pp-historypanel", `
      ${head(p.t.history, p.t.historySub)}
      <ol class="pp-hist" style="--n:${p.history.length}">${p.history.map((h) => `<li>${slotOr(h.slot, "pp-hist-img", ico(h.icon, "big"))}<strong>${esc(h.title)}</strong><small>${esc(h.sub)}</small>${h.text ? `<span>${esc(h.text)}</span>` : ""}</li>`).join("")}</ol>
      <div class="pp-timeline" style="--n:${p.history.length}" aria-hidden="true">${p.history.map(() => "<i></i>").join("")}</div>
      <p class="pp-note">${esc(p.historyNote)}</p>`);
}

function researchHtml(p: PlantProfile): string {
  return panel("pp-research", "pp-researchpanel", `
      ${head("Forschung", p.t.researchSub)}
      <ul class="pp-studies">${p.research.map((r) => `<li${r.more ? ' class="more" hidden' : ""}><div><strong>${esc(r.title)}</strong><small>${r.year ? `Jahr ${r.year} · ` : ""}Suchauszug, Source pending verification</small></div><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Ansehen ${ico("external")}</a></li>`).join("")}</ul>
      <button class="pp-ghost" data-act="allstudies" aria-expanded="false">Alle Studien anzeigen <b aria-hidden="true">→</b></button>
      <p class="pp-note">Kleine Studien, uneinheitliche Qualität: Das ist keine Wirkungsbestätigung. Die zugehörigen Aussagen mit Belegstufe stehen bei „Wirkung“.</p>`);
}

/** positions of the network nodes on an ellipse around the centre (percent) */
function netPos(i: number, n: number): [number, number] {
  const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + 0.35;
  return [Math.round(50 + 39 * Math.cos(a)), Math.round(52 + 37 * Math.sin(a))];
}

function networkHtml(e: AtlasEntry, p: PlantProfile): string {
  const nodes = p.network;
  const imgOf = (id: string) => (hasAsset(`atlas-${id}`) ? `atlas-${id}` : `nutrient-${id}`);
  return panel("pp-network", "pp-networkpanel", `
      ${head("Wissensnetz", p.t.networkSub)}
      <div class="pp-net" role="group" aria-label="Verbundene Themen">
        <svg class="pp-net-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${nodes.map((_, i) => { const [x, y] = netPos(i, nodes.length); return `<line x1="50" y1="52" x2="${x}" y2="${y}"/>`; }).join("")}</svg>
        <div class="pp-node center"><span class="pp-node-img">${slotOr(imgOf(e.id), "pp-ni", `<span class="pp-glyph" aria-hidden="true">✿</span>`)}</span><em>${esc(e.name)}</em></div>
        ${nodes.map((n, i) => {
          const [x, y] = netPos(i, nodes.length);
          const ent = n.kind === "plant" ? entryById(n.ref!) : undefined;
          const img = ent ? slotOr(imgOf(ent.id), "pp-ni", `<span class="pp-glyph" aria-hidden="true">✿</span>`) : `<span class="pp-ni pp-ph">${ico(n.kind === "organ" ? "heart" : n.kind === "culture" ? "scroll" : n.kind === "breath" ? "stress" : n.kind === "claim" ? "target" : "dna")}</span>`;
          return `<button class="pp-node ${n.kind}" data-node="${i}" style="left:${x}%;top:${y}%"${n.hint ? ` aria-describedby="pp-net-hint"` : ""}><span class="pp-node-img">${img}</span><em>${esc(n.label)}</em></button>`;
        }).join("")}
      </div>
      <p class="pp-net-hint" id="pp-net-hint" aria-live="polite">Tippe auf einen Punkt: Pflanzen öffnen ihr Profil, Themen führen zu Körper, Kulturen, Atem oder zur Aussage mit Belegstufe.</p>`);
}

/** the complete profile: the hero, then rows of panels (the rows differ by layout) */
function fullHtml(e: AtlasEntry, p: PlantProfile, from: ProfileFrom): string {
  const uid = `pp${++uidN}`;
  const rows = p.layout === "frucht"
    ? [
      ["f1", partsHtml(e, p, uid) + traitsHtml(e, p) + cycleHtml(e, p)],
      ["f2", originHtml(e, p) + sensoryHtml(e, p, uid) + nutrientsHtml(p)],
      ["f3", effectsHtml(p, uid) + compoundsHtml(p) + freqHtml(p, uid)],
      ["f4", formsHtml(p) + combosHtml(p)],
      ["f5", historyHtml(p) + researchHtml(p) + networkHtml(e, p)],
    ]
    : [
      ["a", partsHtml(e, p, uid) + traitsHtml(e, p)],
      ["b", originHtml(e, p) + sensoryHtml(e, p, uid) + stagesHtml(e, p, uid)],
      ["c", compoundsHtml(p) + effectsHtml(p, uid) + freqHtml(p, uid)],
      ["d", formsHtml(p) + combosHtml(p)],
      ["e", historyHtml(p) + researchHtml(p) + networkHtml(e, p)],
    ];
  return `${heroHtml(e, p, uid, from)}<div class="pp-wrap">${rows.map(([k, inner]) => `<div class="pp-row ${k}">${inner}</div>`).join("")}${safetyHtml(p.safety, e, from)}</div>`;
}

// ---------------------------------------------------------------------------------------------------------- the shorter profile of every other plant
function genericHtml(e: AtlasEntry, from: ProfileFrom): string {
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
        <nav class="pp-crumbs" aria-label="Pfad"><button data-act="back">${FROM_LABEL[from]}</button><i>›</i><span>${esc(CATEGORY_LABEL[e.category])}</span><i>›</i><strong>${esc(e.name)}</strong></nav>
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
  return `${hero}<div class="pp-wrap"><div class="pp-row g1">${trad}${cl}</div><div class="pp-row g2">${comb}${org}${src}</div>${safetyHtml("Information, keine medizinische Beratung. Pflanzen können Wechselwirkungen mit Medikamenten haben; bei Beschwerden, Schwangerschaft oder Medikamenten bitte ärztlich oder in der Apotheke nachfragen. Wildpflanzen und Pilze nur sammeln und essen, wenn eine Fachperson sie sicher bestimmt hat.", e, from)}</div>`;
}

// ---------------------------------------------------------------------------------------------------------- the page
/**
 * The plant profile page (opened from the plant atlas). Plants with an entry in src/data/profiles.ts get the complete profile
 * after the user's reference pictures (herb layout: Ashwagandha, fruit layout: Granatapfel); every other plant gets a shorter
 * one built from its atlas entry. All statements about effects come from graded claims; the page itself makes none.
 */
export function initPlantProfile(root: HTMLElement, api: PlantProfileApi) {
  const scroll = root.querySelector<HTMLElement>(".pp-scroll")!;
  const tone = createTone();
  let raf = 0, playing = false, resize: ResizeObserver | null = null;
  let current: string | null = null;
  let from: ProfileFrom = "plants";
  let hz = 432;

  function stopTone() { tone.stop(); playing = false; cancelAnimationFrame(raf); raf = 0; }

  function show(id: string, origin: ProfileFrom = from) {
    const e = entryById(id);
    if (!e) return;
    from = origin;
    stopTone();
    current = id;
    const p = PROFILES[id];
    hz = p?.frequency.hz ?? 432;
    scroll.innerHTML = p ? fullHtml(e, p, from) : genericHtml(e, from);
    scroll.scrollTop = 0;
    mountSlots(scroll);
    if (p) { renderCompound(p, 0, 0); renderCombos(p, 0); drawWave(); setPart(p, p.startPart, true); }
    resize?.disconnect();
    const cv = scroll.querySelector<HTMLCanvasElement>(".pp-map-cv");
    if (cv) {
      const layers: MapLayer[] = p ? p.origin.layers : [{ label: "Herkunftsregion", color: "#f0a248", boxes: (ORIGIN[id] ?? []).map((r) => REGION_BOX[r]) }];
      resize = new ResizeObserver(() => drawMap(cv, layers));
      resize.observe(cv);
    }
    spy();
  }

  /** `quiet`: the first state of the page: the button is pressed but no callout is dimmed and no ring shows */
  function setPart(p: PlantProfile, id: string, quiet = false) {
    const part = p.parts.find((x) => x.id === id)!;
    scroll.querySelectorAll<HTMLElement>(".pp-partbtns [data-part]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.part === id)));
    const fig = scroll.querySelector<HTMLElement>(".pp-fig")!;
    const overview = quiet || id === "gesamt";
    if (overview) fig.removeAttribute("data-sel"); else fig.dataset.sel = id;
    scroll.querySelectorAll<HTMLElement>(".pp-call").forEach((c) => c.classList.toggle("on", !overview && c.dataset.part === id));
    scroll.querySelectorAll<SVGGElement>(".pp-lines [data-line]").forEach((g) => g.classList.toggle("on", !overview && g.dataset.line === id));
    const ring = scroll.querySelector<HTMLElement>(".pp-ring")!;
    const at = part.callout?.to ?? part.ring;
    if (at && !overview) { ring.hidden = false; ring.style.left = `${at[0]}%`; ring.style.top = `${at[1]}%`; } else ring.hidden = true;
    scroll.querySelector<HTMLElement>(".pp-partnote")!.innerHTML = `<strong>${esc(part.title)}</strong> ${esc(part.text)}`;
  }

  function renderCompound(p: PlantProfile, g: number, i: number) {
    const group = p.compounds[g], c = group.items[i];
    scroll.querySelectorAll<HTMLElement>("[data-cmp]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.cmp) === g)));
    const card = scroll.querySelector<HTMLElement>(".pp-cmpcard")!;
    const pic = c.slot ? (hasAsset(c.slot)
      ? `<div class="pp-struct pp-img"><div data-slot="${c.slot}" data-fit="cover"></div></div>`
      : c.formula ? `<div class="pp-struct pp-img"><div class="pp-ph"><span>${sub(c.formula)}</span><small>Strukturformel: Bild folgt</small></div></div>` : `<div class="pp-struct pp-img"><div class="pp-ph">${ico("drop", "big")}<small>Bild folgt</small></div></div>`) : "";
    card.innerHTML = `
      <h3>${esc(c.title)}</h3>
      <div class="pp-cmp-body${pic ? "" : " solo"}">
        <div>
          <ul class="pp-bul">${c.bullets.map((b) => `<li>${ico("check")}${esc(b)}</li>`).join("")}</ul>
          ${c.bulletsNote ? `<p class="pp-cmp-note">${esc(c.bulletsNote)}</p>` : ""}
          ${c.formula ? `<p class="pp-formula"><span>Summenformel</span><strong>${sub(c.formula)}</strong>${c.mass ? `<em>${esc(c.mass)}</em>` : ""}</p>` : ""}
        </div>
        ${pic}
      </div>
      <button class="pp-more" data-act="cmpmore" aria-expanded="false">Mehr über ${esc(c.title)} ${ico("arrow")}</button>
      <p class="pp-cmp-text" hidden>${esc(c.text)}</p>`;
    const th = scroll.querySelector<HTMLElement>(".pp-cthumbs")!;
    if (group.items.length > 1) {
      th.hidden = false;
      th.innerHTML = group.items.map((it, k) => `<li><button data-citem="${k}" aria-pressed="${k === i}">${it.slot ? slotOr(it.slot, "pp-cthumb", ico("drop")) : `<span class="pp-cthumb pp-img"><span class="pp-ph">${ico("drop")}</span></span>`}<span>${esc(it.thumb ?? it.title)}</span></button></li>`).join("");
    } else { th.hidden = true; th.innerHTML = ""; }
    mountSlots(card); mountSlots(th);
  }

  function renderCombos(p: PlantProfile, i: number) {
    const c = p.combos[i];
    scroll.querySelectorAll<HTMLElement>("[data-combo]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.combo) === i)));
    const row = scroll.querySelector<HTMLElement>(".pp-combo-row")!;
    const cards = c.items.map((it) => {
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

  // scroll spy for the section tabs: the section whose top is the lowest one still above the reading line (tabs are not in page order)
  let spyRaf = 0, spyLock = 0;
  function spy() {
    if (Date.now() < spyLock) return;
    const tabs = [...scroll.querySelectorAll<HTMLElement>(".pp-tab[data-to]")];
    if (!tabs.length) return;
    const top = scroll.getBoundingClientRect().top + 120;
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
      // side-by-side panels share one top: the tab that was clicked stays current while the page scrolls there
      spyLock = Date.now() + 900;
      scroll.querySelectorAll<HTMLElement>(".pp-tab").forEach((x) => (x === to ? x.setAttribute("aria-current", "true") : x.removeAttribute("aria-current")));
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
    if (cmp && p) { renderCompound(p, Number(cmp.dataset.cmp), 0); return; }
    const ci = t.closest<HTMLElement>("[data-citem]");
    if (ci && p) {
      const g = Number(scroll.querySelector<HTMLElement>("[data-cmp][aria-pressed='true']")?.dataset.cmp ?? 0);
      renderCompound(p, g, Number(ci.dataset.citem));
      return;
    }
    const cb = t.closest<HTMLElement>("[data-combo]");
    if (cb && p) { renderCombos(p, Number(cb.dataset.combo)); return; }
    const th = t.closest<HTMLElement>("[data-thumb]");
    if (th) {
      const k = th.dataset.thumb!, main = scroll.querySelector<HTMLElement>(".pp-main")!;
      if (e && hasAsset(`plant-${e.id}-thumb-${k}`)) { main.innerHTML = `<div class="pp-img pp-main-img"><div data-slot="plant-${e.id}-thumb-${k}" data-fit="cover"></div></div>`; mountSlots(main); }
      scroll.querySelectorAll(".pp-thumbs [data-thumb]").forEach((b) => b.classList.toggle("on", b === th));
      return;
    }
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) { api.openClaim(cl.dataset.claim!, cl); return; }
    const hzb = t.closest<HTMLElement>("[data-hz]");
    if (hzb) {
      hz = Number(hzb.dataset.hz);
      scroll.querySelectorAll<HTMLElement>("[data-hz]").forEach((b) => b.setAttribute("aria-pressed", String(b === hzb)));
      scroll.querySelector<HTMLElement>(".pp-hz")!.textContent = `${hz} Hz`;
      if (playing) tone.setHz(hz);
      return;
    }
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
    if (act === "back") api.back(from);
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
      if (p && tone.start(hz)) {
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
