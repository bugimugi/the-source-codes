import { claims } from "../data/claims";
import { LEVEL_LABEL, type Claim } from "../data/types";
import { CAT_COLOR, ELEMENTS, type Element as ChemElement } from "../data/elements";
import { ELEMENT_NOTICE, FULL, shortProfile, type ElementFull } from "../data/elementProfile";
import { hasAsset, mountSlots } from "../assets/slots";
import { initAtomScene, type AtomMode, type AtomScene, type Orbital } from "../gl/atomscene";
import { esc } from "./dossierParts";
import { ico } from "./icons";
import { ph } from "./landing";
import { bohrSvg, galaxySvg, heroSvg, moleculeSvg, rosetteSvg, sphereSvg, wavelengthColor } from "./elementArt";
import { waveSvg } from "./plantArt";

export interface ElementApi {
  reduceMotion: boolean;
  /** back to the mineral atlas; with a symbol its periodic table opens with that element marked */
  openMinerals(table?: string): void;
  /** another element's profile (from the small periodic table) */
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
  id ? `<p class="ep-claimline">${chipFor(id)} <button class="pl-link" data-claim="${id}">Aussage und Quellen</button></p>` : `<p class="ep-claimline"><span class="ep-textbook">${esc(textbook)}</span></p>`;

const SUB: { id: string; label: string; icon: string }[] = [
  { id: "ep-detail", label: "Übersicht", icon: "overview" }, { id: "ep-atom", label: "Atom & Struktur", icon: "atom" }, { id: "ep-phys", label: "Eigenschaften", icon: "ruler" },
  { id: "ep-universe", label: "Vorkommen", icon: "globe" }, { id: "ep-comp", label: "Verbindungen", icon: "flask" }, { id: "ep-apps", label: "Anwendungen", icon: "bolt" },
  { id: "ep-body", label: "Im Körper", icon: "heart" }, { id: "ep-earth", label: "In der Natur", icon: "leaf" }, { id: "ep-freq", label: "Frequenzen", icon: "sound" },
  { id: "ep-hist", label: "Geschichte & Kultur", icon: "scroll" }, { id: "ep-research", label: "Forschung", icon: "microscope" },
];

const MODES: { id: AtomMode; label: string; icon: string; text: string }[] = [
  { id: "atom", label: "Atommodell", icon: "atom", text: "Bohr-Modell: Der Kern (rot, ein Proton) und ein Elektron auf der innersten Bahn; die zweite Bahn ist vier Mal so weit. Das ist ein historisches Bild: Elektronen laufen nicht wirklich auf Bahnen, und der Kern ist hier stark vergrößert gezeichnet." },
  { id: "dichte", label: "Elektronendichte", icon: "cell", text: "Elektronendichte des Grundzustands (1s): Jeder Punkt ist ein möglicher Aufenthaltsort des Elektrons, und wo die Punkte dichter liegen, ist er wahrscheinlicher. Die Wolke ist kugelförmig und am dichtesten nahe am Kern." },
  { id: "orbital", label: "Orbital-Ansicht", icon: "hex", text: "" },
  { id: "isotope", label: "Isotope vergleichen", icon: "layers", text: "Von links nach rechts: Protium (¹H, ein Proton), Deuterium (²H, ein Proton und ein Neutron) und Tritium (³H, ein Proton und zwei Neutronen). Protonen sind rot, Neutronen grau; die Größen sind nicht maßstäblich." },
];
const ORBITALS: { id: Orbital; text: string }[] = [
  { id: "1s", text: "1s: kugelförmig und ohne Knoten, der Grundzustand des Elektrons." },
  { id: "2s", text: "2s: kugelförmig mit einer Knotenfläche, auf der die Aufenthaltswahrscheinlichkeit null ist. Blau und Orange sind die beiden Vorzeichen der Wellenfunktion." },
  { id: "2p", text: "2p: zwei Keulen mit einer Knotenebene dazwischen. Blau und Orange sind die beiden Vorzeichen der Wellenfunktion." },
];

/** the lines of the hydrogen spectrum from the Rydberg formula 1/lambda = R (1/n1^2 - 1/n2^2), R = 1,0967758 x 10^7 per metre (hydrogen), wavelengths in vacuum */
const RH = 1.0967758e7, C = 299792458, EV_NM = 1239.84198;
const SERIES = [
  { id: "lyman", name: "Lyman-Serie", low: 1, range: "Ultraviolett", axis: [90, 125] as [number, number] },
  { id: "balmer", name: "Balmer-Serie", low: 2, range: "sichtbares Licht", axis: [380, 700] as [number, number] },
  { id: "paschen", name: "Paschen-Serie", low: 3, range: "Infrarot", axis: [800, 1900] as [number, number] },
];
const GREEK = ["α", "β", "γ", "δ", "ε"];
const lambda = (low: number, high: number) => 1e9 / (RH * (1 / low ** 2 - (high ? 1 / high ** 2 : 0)));
const nfd = (n: number, d = 1) => n.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
function spectrumHtml(id: string): string {
  const s = SERIES.find((x) => x.id === id)!;
  const lines = GREEK.map((g, i) => { const hi = s.low + 1 + i, nm = lambda(s.low, hi); return { g, hi, nm, hz: C / (nm * 1e-9), ev: EV_NM / nm }; });
  const limit = lambda(s.low, 0);
  const [a, b] = s.axis;
  const pos = (nm: number) => ((nm - a) / (b - a)) * 100;
  const color = (nm: number) => (s.id === "balmer" ? wavelengthColor(nm) : s.id === "lyman" ? "#b18cff" : "#e0584a");
  return `<div class="ep-spec-strip ${s.id}" role="img" aria-label="${esc(s.name)}: ${lines.map((l) => `${nfd(l.nm)} nm`).join(", ")}">${lines.filter((l) => l.nm >= a && l.nm <= b).map((l) => `<i style="left:${pos(l.nm).toFixed(2)}%;--c:${color(l.nm)}"></i>`).join("")}<span class="ep-spec-end l">${a} nm</span><span class="ep-spec-end r">${b} nm</span></div>
    <table class="ep-spec-table"><caption>${esc(s.name)} (${esc(s.range)}): Übergänge nach n = ${s.low}</caption><thead><tr><th>Linie</th><th>Von n</th><th>Wellenlänge</th><th>Frequenz</th><th>Photon</th></tr></thead>
    <tbody>${lines.map((l) => `<tr><td>${s.id === "lyman" ? "Lyman" : s.id === "balmer" ? "H" : "Paschen"}-${l.g}</td><td>${l.hi}</td><td>${nfd(l.nm)} nm</td><td>${nfd(l.hz / 1e15, 3)} · 10¹⁵ Hz</td><td>${nfd(l.ev, 2)} eV</td></tr>`).join("")}</tbody></table>
    <p class="ep-note">Serienende (n → ∞): ${nfd(limit)} nm. Berechnet aus der Rydberg-Formel für Wasserstoff, Wellenlängen im Vakuum${s.id === "balmer" ? " (in Luft etwas kürzer, z. B. H-α 656,28 nm)" : ""}. Lehrbuchphysik, Source pending verification.</p>`;
}

/** the small periodic table: every cell is clickable with the mouse, the keyboard goes through the button below it */
const miniTable = (sym: string) => `<div class="ep-mt" aria-hidden="true">${ELEMENTS.map((e) => `<i class="ep-mc${e.sym === sym ? " on" : ""}" data-el="${e.sym}" title="${esc(e.name)}" style="grid-column:${e.col};grid-row:${e.row};--c:${CAT_COLOR[e.cat]}">${e.sym === sym ? e.sym : ""}</i>`).join("")}</div>`;

function orbitalBoxes(f: ElementFull): string {
  return f.config.boxes.map((b) => `<div class="ep-orb"><b>${esc(b.label)}</b><div>${Array.from({ length: b.n }, (_, i) => `<span class="ep-box${i < b.filled ? " on" : ""}">${i < b.filled ? "↑" : ""}</span>`).join("")}</div></div>`).join("");
}

/**
 * The element profile page. Hydrogen is the complete template after the user's reference picture: hero with data card, tab strip,
 * atomic structure with a computed 3D view (Bohr model, electron cloud, orbitals, isotopes), electron configuration, properties,
 * occurrence, compounds, isotopes, the body, the spectrum (computed from the Rydberg formula), applications, history and research.
 * Every other element gets a short profile from the element table. Textbook values carry "Source pending verification";
 * health and energy-policy statements are graded claims.
 */
export function initElementProfile(root: HTMLElement, api: ElementApi) {
  const scroll = root.querySelector<HTMLElement>(".ep-scroll")!;
  let scene: AtomScene | null = null;
  let observer: IntersectionObserver | null = null;
  let built = "";
  let spyLock = 0;
  let mode: AtomMode = "atom";
  let orbital: Orbital = "1s";
  const q$ = <T extends HTMLElement>(s: string) => scroll.querySelector<T>(s)!;
  const smooth = (el: Element | null) => el?.scrollIntoView({ behavior: api.reduceMotion ? "auto" : "smooth", block: "start" });

  function heroBlock(e: ChemElement, name: string, alt: string, chips: string[], lead: string, data: [string, string][], full: boolean): string {
    return `<div class="ep-hero">
      ${full && hasAsset("element-h-hero") ? `<div class="ep-hero-bg" data-slot="element-h-hero" data-fit="cover" data-eager="true"></div>` : `<div class="ep-hero-art">${heroSvg("eph")}</div>`}
      <div class="ep-hero-text">
        <nav class="og-crumbs" aria-label="Pfad"><button data-act="minerals">Mineralien</button><i>›</i><button data-act="table">Elemente</button><i>›</i><strong>${esc(name)}</strong></nav>
        <div class="ep-id"><span class="ep-box-z">${e.z}</span><b class="ep-sym">${esc(e.sym)}</b></div>
        <h1>${esc(name)}</h1>${alt ? `<p class="ep-alt">${esc(alt)}</p>` : ""}
        <ul class="ep-chips">${chips.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
        <p class="ep-lead">${esc(lead)}</p>
        ${full ? `<div class="ep-cta"><button class="mn-gold" data-to="ep-detail">Element im Überblick <span aria-hidden="true">→</span></button><button class="pl-ghost" data-to="ep-3d">${ico("atom")} 3D-Ansicht</button></div>` : ""}
      </div>
      <aside class="ep-data" aria-label="Daten"><dl>${data.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></aside>
    </div>`;
  }

  function fullHtml(f: ElementFull, e: ChemElement): string {
    const iso0 = f.isotopes[0];
    return `${heroBlock(e, f.name, f.alt, f.chips, f.lead, f.data, true)}
    <nav class="ep-sub" aria-label="Abschnitte">${SUB.map((s, i) => `<button data-to="${s.id}" ${i === 0 ? 'aria-current="true"' : ""}>${ico(s.icon)}<span>${esc(s.label)}</span></button>`).join("")}</nav>

    <div class="ep-row ep-r1">
      <section class="ep-cell" id="ep-detail" aria-labelledby="ep-detail-h">
        <h2 id="ep-detail-h">Das Element im Detail</h2>
        <p class="ep-text">${esc(f.detail)}</p>
        <div class="ep-btnrow"><button class="pl-ghost" data-pop="data" aria-expanded="false">${ico("flask")} Wissenschaftliche Daten</button><button class="pl-ghost" data-pop="quick" aria-expanded="false">${ico("book")} Kurzfakten</button></div>
        <div class="ep-pop" aria-live="polite" hidden></div>
      </section>
      <section class="ep-cell" id="ep-atom" aria-labelledby="ep-atom-h">
        <h2 id="ep-atom-h">Atomarer Aufbau</h2>
        <div class="ep-atom-top"><div class="ep-bohr-wrap">${bohrSvg("epb", iso0.neutrons)}</div>
          <ul class="ep-legend"><li><i style="background:#ff5a4a"></i>Proton (<b>1</b>)</li><li><i style="background:#a9b4c2"></i>Neutron (<b class="ep-n">${iso0.neutrons}</b>)</li><li><i style="background:#cfeaff"></i>Elektron (<b>1</b>)</li></ul></div>
        <div class="ep-iso-btns" role="group" aria-label="Isotop wählen">${f.isotopes.map((i) => `<button data-iso="${i.id}" aria-pressed="${i === iso0}"><b>${esc(i.sym)}</b><span><strong>${esc(i.name)}</strong><small>(${esc(i.id === "tritium" ? "radioaktiv" : i.share)})</small></span></button>`).join("")}</div>
        <p class="ep-text ep-iso-text" aria-live="polite">${esc(iso0.text)}</p>
      </section>
      <section class="ep-cell ep-3d" id="ep-3d" aria-labelledby="ep-3d-h">
        <h2 id="ep-3d-h">3D-Ansicht</h2>
        <div class="ep-3d-grid">
          <div class="ep-3d-view"><canvas class="ep-canvas" aria-label="3D-Ansicht des Wasserstoffatoms, mit der Maus drehbar" tabindex="0"></canvas><div class="ep-3d-fallback" hidden>${sphereSvg("eps")}</div></div>
          <ul class="ep-3d-list" role="group" aria-label="Darstellung">${MODES.map((m, i) => `<li><button data-mode="${m.id}" aria-pressed="${i === 0}"><i>${ico(m.icon)}</i>${esc(m.label)}</button></li>`).join("")}
            <li class="ep-orb-pick" hidden><div role="group" aria-label="Orbital wählen">${ORBITALS.map((o, i) => `<button data-orbital="${o.id}" aria-pressed="${i === 0}">${o.id}</button>`).join("")}</div></li>
            <li><button data-toggle="rotate" aria-pressed="false"><i>${ico("clock")}</i>Rotieren</button></li>
            <li><button data-toggle="zoom" aria-pressed="false"><i>${ico("target")}</i>Zoom</button></li>
            <li><button data-toggle="animate" aria-pressed="false"><i>${ico("bolt")}</i><span class="ep-anim">Animation starten</span></button></li></ul>
        </div>
        <p class="ep-text ep-3d-text" aria-live="polite">${esc(MODES[0].text)}</p>
        <p class="ep-note">Veranschaulichung, keine Messung. Ziehen mit der Maus oder dem Finger dreht die Ansicht.</p>
      </section>
    </div>

    <div class="ep-row ep-r2">
      <section class="ep-cell" id="ep-pt" aria-labelledby="ep-pt-h">
        <h2 id="ep-pt-h">Periodensystem</h2>${miniTable(e.sym)}
        <button class="pl-ghost" data-act="table">Im Periodensystem anzeigen <span aria-hidden="true">→</span></button>
      </section>
      <section class="ep-cell" id="ep-config" aria-labelledby="ep-config-h">
        <h2 id="ep-config-h">Elektronenkonfiguration</h2>
        <p class="ep-config-big">${esc(f.config.text.replace("¹", ""))}<sup>1</sup></p>
        <div class="ep-config-grid"><div class="ep-orbs">${orbitalBoxes(f)}</div>
          <div class="ep-levels"><b>Energieniveaus</b>${[1, 2].map((n) => `<p><span>n = ${n}</span><em>${nfd(-13.598 / n ** 2)} eV</em></p>`).join("")}</div></div>
        <p class="ep-note">${esc(f.config.levelNote)}</p>
      </section>
      <section class="ep-cell" id="ep-phys" aria-labelledby="ep-phys-h">
        <h2 id="ep-phys-h">Physikalische Eigenschaften</h2>
        <ul class="ep-phys">${f.phys.map((p) => `<li><i>${ico(p.icon)}</i><span><small>${esc(p.label)}</small><b>${esc(p.value)}</b></span></li>`).join("")}</ul>
        <p class="ep-warn">${ico("flame")} ${esc(f.safety)}</p>
      </section>
    </div>

    <div class="ep-row ep-r3">
      <section class="ep-cell ep-universe" id="ep-universe" aria-labelledby="ep-u-h">
        <h2 id="ep-u-h">Vorkommen im Universum</h2>
        <div class="ep-img ep-u-img">${hasAsset("element-h-universum") ? `<div class="ep-img-fill" data-slot="element-h-universum" data-fit="cover"></div>` : galaxySvg("epg")}<div class="ep-pct"><b>${esc(f.universe.pct)}</b><span>${esc(f.universe.text)}</span></div></div>
        <p class="ep-note">${esc(f.universe.note)}</p>
        <button class="pl-ghost" data-more="universe" aria-expanded="false">Im Kosmos entdecken <span aria-hidden="true">→</span></button>
        <p class="ep-more" hidden>${esc(f.universe.more)}</p>
      </section>
      <section class="ep-cell" id="ep-earth" aria-labelledby="ep-e-h">
        <h2 id="ep-e-h">Vorkommen auf der Erde</h2>
        <div class="ep-pair">${ph("element-h-erde-1", "ep-pair-img", "globe", "#5a8ab0")}${ph("element-h-erde-2", "ep-pair-img", "drop", "#8aa0b0")}</div>
        <p class="ep-text">${esc(f.earth.intro)}</p>
        <ul class="ep-dots">${f.earth.list.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <button class="pl-ghost" data-more="earth" aria-expanded="false">Natürliche Vorkommen <span aria-hidden="true">→</span></button>
        <p class="ep-more" hidden>${esc(f.earth.more)}</p>
      </section>
      <section class="ep-cell" id="ep-comp" aria-labelledby="ep-c-h">
        <h2 id="ep-c-h">Verbindungen</h2>
        <button class="ep-water" data-comp="wasser" aria-pressed="false"><span class="ep-mol-box">${hasAsset("element-h-verb-wasser") ? `<span class="ep-mol-img" data-slot="element-h-verb-wasser" data-fit="cover"></span>` : moleculeSvg("wasser", "epm0")}</span><span><strong>${esc(f.compounds[0].name)}</strong><em>${esc(f.compounds[0].formula)}</em><span class="ep-tagrow">${f.compounds[0].tags.map((t) => `<small>${esc(t)}</small>`).join("")}</span></span></button>
        <div class="ep-comp-row">${f.compounds.slice(1).map((c, i) => `<button data-comp="${c.id}" aria-pressed="false"><span class="ep-mol-box">${hasAsset(`element-h-verb-${c.id}`) ? `<span class="ep-mol-img" data-slot="element-h-verb-${c.id}" data-fit="cover"></span>` : moleculeSvg(c.id, `epm${i + 1}`)}</span><strong>${esc(c.name)}</strong><em>${esc(c.formula)}</em><small>${esc(c.sub)}</small></button>`).join("")}</div>
        <p class="ep-text ep-comp-text" aria-live="polite">Tippe auf eine Verbindung. Die Moleküle sind schematisch gezeichnet; beim Wasser ist der Bindungswinkel von 104,5° berechnet.</p>
      </section>
      <section class="ep-cell" id="ep-iso" aria-labelledby="ep-i-h">
        <h2 id="ep-i-h">Isotope</h2>
        <div class="ep-iso-cards">${f.isotopes.map((i) => `<button data-iso-card="${i.id}" aria-pressed="false"><span class="ep-ball n${i.neutrons}"><b>${esc(i.sym)}</b></span><strong>${esc(i.name)}</strong><small>${esc(i.sub)}</small><em>${esc(i.share)}</em></button>`).join("")}</div>
        <p class="ep-text ep-iso-card-text" aria-live="polite">Tippe auf ein Isotop. Isotope haben gleich viele Protonen, aber verschieden viele Neutronen.</p>
        <p class="ep-note">Häufigkeiten nach den Standardwerten der natürlichen Isotopenzusammensetzung (Source pending verification).</p>
      </section>
    </div>

    <div class="ep-row ep-r4">
      <section class="ep-cell ep-body" id="ep-body" aria-labelledby="ep-b-h">
        <h2 id="ep-b-h">Rolle im menschlichen Körper</h2>
        <div class="ep-body-grid"><div class="ep-body-fig">${hasAsset("body-front") ? `<div class="ep-body-img" data-slot="body-front" data-fit="cover" aria-hidden="true"></div>` : `<div class="ep-body-ph">${ico("dna", "big")}</div>`}</div>
          <ul class="ep-body-list">${f.body.map((b) => `<li><button data-body="${b.id}" aria-pressed="false"><i>${ico(b.icon)}</i><span><strong>${esc(b.title)}</strong>${b.sub ? `<small>${esc(b.sub)}</small>` : ""}</span></button></li>`).join("")}</ul></div>
        <div class="ep-text ep-body-text" aria-live="polite"><p>Tippe auf eine Rolle. Hier steht, was im Körper mit Wasserstoff passiert.</p></div>
        <div class="ep-h2med"><p>Molekularer Wasserstoff (H₂) als Gas oder Trinkwasser ist Gegenstand der Forschung:</p>${claimLine(f.bodyClaim)}</div>
      </section>
      <section class="ep-cell ep-freq" id="ep-freq" aria-labelledby="ep-f-h">
        <h2 id="ep-f-h">Frequenzen &amp; Schwingungen</h2><p class="ep-sub2">Die spektrale Signatur des Wasserstoffs.</p>
        <div class="ep-freq-grid">
          <div><div class="ep-wave">${waveSvg()}</div>
            <p class="ep-hz"><span>${esc(f.freq.label)}</span><b>${esc(f.freq.hz)} · ${esc(f.freq.hzExp)}</b><small>(${esc(f.freq.nm)})</small></p>
            <button class="pl-ghost" data-spec aria-expanded="false">Spektrum anzeigen <span aria-hidden="true">→</span></button></div>
          <div class="ep-pattern"><b>Schwingungsmuster</b>${rosetteSvg("epr")}<small>Rosetten aus Winkelfunktionen: Veranschaulichung stehender Wellen, keine Messung.</small></div>
        </div>
        <p class="ep-text">${esc(f.freq.text)}</p>
        <div class="ep-spec" hidden><div class="ep-spec-tabs" role="group" aria-label="Serie wählen">${SERIES.map((s, i) => `<button data-series="${s.id}" aria-pressed="${i === 1}">${esc(s.name)}</button>`).join("")}</div><div class="ep-spec-body"></div></div>
        <h3 class="ep-h3">Resonanz &amp; Anwendungen</h3>
        <ul class="ep-res">${f.resonance.map((r) => `<li><button data-res="${r.id}" aria-pressed="false">${esc(r.title)}</button></li>`).join("")}</ul>
        <div class="ep-text ep-res-text" aria-live="polite" hidden></div>
      </section>
      <section class="ep-cell ep-apps" id="ep-apps" aria-labelledby="ep-a-h">
        <h2 id="ep-a-h">Anwendungen</h2>
        <div class="ep-app-grid">${f.apps.map((a) => `<button data-app="${a.id}" aria-pressed="false">${ph(`element-h-anw-${a.id}`, "ep-app-img", a.icon, "#4a7ab0")}<span><strong>${esc(a.title)}</strong><small>${esc(a.sub)}</small></span></button>`).join("")}</div>
        <div class="ep-text ep-app-text" aria-live="polite"><p>Tippe auf eine Anwendung. Technische Angaben sind Lehrbuchwissen; Erwartungen an die Zukunft stehen als Behauptung mit Belegstufe da.</p></div>
      </section>
    </div>

    <div class="ep-row ep-r5">
      <section class="ep-cell ep-hist" id="ep-hist" aria-labelledby="ep-h-h">
        <h2 id="ep-h-h">Geschichte &amp; Kultur</h2>
        <div class="ep-hist-row">${f.history.map((h) => `<button data-hist="${h.id}" aria-pressed="false">${ph(`element-h-hist-${h.id}`, "ep-hist-img", "scroll", "#9a7a4a")}<span><strong>${esc(h.title)}</strong><small>${esc(h.sub)}</small></span></button>`).join("")}</div>
        <div class="ep-text ep-hist-text" aria-live="polite"><p>Tippe auf eine Epoche. Die Texte sind Überlieferung und Lehrbuchwissen, Source pending verification.</p></div>
      </section>
      <section class="ep-cell ep-research" id="ep-research" aria-labelledby="ep-r-h">
        <h2 id="ep-r-h">Forschung &amp; Aktuelle Studien</h2>
        <ul class="ep-papers">${f.research.map((r) => `<li><i>${ico("book")}</i><div><strong>${esc(r.title)}</strong><small>${esc(r.author)}${r.year ? `, ${esc(r.year)}` : ""} · ${esc(r.kind)}</small><p>${esc(r.note)}</p>${r.claim ? `<p class="ep-claimline">${chipFor(r.claim)} <button class="pl-link" data-claim="${r.claim}">Aussage und Quellen</button></p>` : ""}</div><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Quelle ansehen ${ico("external")}</a></li>`).join("")}</ul>
        <p class="ep-note">Quellen aus Suchauszügen, die Originale sind nicht geprüft (Source pending verification). Die Titel der Vorlage waren Platzhalter und wurden durch auffindbare Quellen ersetzt.</p>
      </section>
    </div>
    <div class="ep-foot"><p class="pl-notice">${esc(ELEMENT_NOTICE)}</p></div>`;
  }

  function shortHtml(e: ChemElement): string {
    const sp = shortProfile(e);
    return `${heroBlock(e, e.name, "", sp.chips, sp.text, sp.data, false)}
    <div class="ep-row ep-r2 ep-short">
      <section class="ep-cell" aria-labelledby="ep-s1"><h2 id="ep-s1">Das Element im Detail</h2><p class="ep-text">${esc(sp.text)}</p><p class="ep-note">Kurzprofil aus der Elementtabelle (Lehrbuchwerte, Source pending verification). Das vollständige Profil mit Atomaufbau, 3D-Ansicht, Eigenschaften, Vorkommen und Quellen gibt es bisher für Wasserstoff.</p>
        <button class="pl-ghost" data-el="H">Zum Wasserstoff-Profil <span aria-hidden="true">→</span></button></section>
      <section class="ep-cell" aria-labelledby="ep-s2"><h2 id="ep-s2">Atomarer Aufbau</h2><div class="ep-short-atom"><span class="ep-box-z big">${e.z}</span><p><b>${e.z} Protonen</b> im Kern und ebenso viele Elektronen in der Hülle (ungeladenes Atom). Die Zahl der Neutronen hängt vom Isotop ab.</p></div></section>
      <section class="ep-cell" aria-labelledby="ep-s3"><h2 id="ep-s3">Periodensystem</h2>${miniTable(e.sym)}<button class="pl-ghost" data-act="table">Im Periodensystem anzeigen <span aria-hidden="true">→</span></button></section>
    </div>
    <div class="ep-foot"><p class="pl-notice">${esc(ELEMENT_NOTICE)}</p></div>`;
  }

  // ---------------------------------------------------------------- 3D
  function setupScene() {
    const canvas = scroll.querySelector<HTMLCanvasElement>(".ep-canvas");
    if (!canvas) return;
    try {
      scene = initAtomScene(canvas, api.reduceMotion);
      observer = new IntersectionObserver(([en]) => { if (en.isIntersecting) scene?.start(); else scene?.stop(); }, { threshold: 0.05 });
      observer.observe(canvas);
    } catch (err) {
      console.warn("3D-Ansicht nicht verfügbar", err);
      scene = null;
      canvas.hidden = true;
      q$<HTMLElement>(".ep-3d-fallback").hidden = false;
    }
  }
  function teardown() {
    observer?.disconnect(); observer = null;
    scene?.dispose(); scene = null;
  }

  function setMode(m: AtomMode) {
    mode = m;
    scene?.setMode(m);
    scroll.querySelectorAll<HTMLElement>("[data-mode]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
    q$<HTMLElement>(".ep-orb-pick").hidden = m !== "orbital";
    q$(".ep-3d-text").textContent = m === "orbital" ? ORBITALS.find((o) => o.id === orbital)!.text : MODES.find((x) => x.id === m)!.text;
  }

  // ---------------------------------------------------------------- page
  function build(sym: string) {
    const e = ELEMENTS.find((x) => x.sym === sym) ?? ELEMENTS[0];
    teardown();
    const f = FULL[e.sym];
    mode = "atom"; orbital = "1s";
    scroll.innerHTML = f ? fullHtml(f, e) : shortHtml(e);
    scroll.dataset.full = f ? "1" : "0";
    mountSlots(scroll);
    if (f) { q$(".ep-spec-body").innerHTML = spectrumHtml("balmer"); setupScene(); }
    built = e.sym;
    scroll.scrollTop = 0;
  }

  /** marks a tab of the strip as current and keeps it in sight (the strip scrolls sideways on narrow screens) */
  function markTab(id: string) {
    const strip = scroll.querySelector<HTMLElement>(".ep-sub");
    strip?.querySelectorAll<HTMLElement>("button").forEach((b) => {
      const on = b.dataset.to === id;
      if (on) { b.setAttribute("aria-current", "true"); strip.scrollTo({ left: b.offsetLeft - (strip.clientWidth - b.offsetWidth) / 2, behavior: api.reduceMotion ? "auto" : "smooth" }); }
      else b.removeAttribute("aria-current");
    });
  }

  const toggle = (name: string, on: boolean) => {
    const b = scroll.querySelector<HTMLElement>(`[data-toggle="${name}"]`)!;
    b.setAttribute("aria-pressed", String(on));
    if (name === "animate") b.querySelector(".ep-anim")!.textContent = on ? "Animation anhalten" : "Animation starten";
  };

  scroll.addEventListener("click", (ev) => {
    const t = ev.target as HTMLElement;
    const f = FULL[built];
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) { api.openClaim(cl.dataset.claim!, cl); return; }
    const to = t.closest<HTMLElement>("[data-to]");
    if (to) {
      spyLock = performance.now() + 900;
      markTab(to.dataset.to!);
      smooth(q$(`#${to.dataset.to}`));
      if (to.dataset.to === "ep-3d") setMode("atom");
      return;
    }
    const act = t.closest<HTMLElement>("[data-act]");
    if (act) { if (act.dataset.act === "minerals") api.openMinerals(); else api.openMinerals(built); return; }
    const el = t.closest<HTMLElement>("[data-el]");
    if (el) { if (el.dataset.el !== built) api.openElement(el.dataset.el!); return; }
    if (!f) return;
    const pop = t.closest<HTMLElement>("[data-pop]");
    if (pop) {
      const box = q$<HTMLElement>(".ep-pop"), open = pop.getAttribute("aria-expanded") !== "true";
      scroll.querySelectorAll<HTMLElement>("[data-pop]").forEach((b) => b.setAttribute("aria-expanded", String(b === pop && open)));
      box.hidden = !open;
      if (open) box.innerHTML = pop.dataset.pop === "data"
        ? `<dl class="ep-datalist">${f.data.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl><p class="ep-note">${esc(f.dataNote)}</p>`
        : `<ul class="ep-dots">${f.quick.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><p class="ep-note">Lehrbuchwissen, Source pending verification.</p>`;
      return;
    }
    const iso = t.closest<HTMLElement>("[data-iso]");
    if (iso) {
      const i = f.isotopes.find((x) => x.id === iso.dataset.iso)!;
      scroll.querySelectorAll<HTMLElement>("[data-iso]").forEach((b) => b.setAttribute("aria-pressed", String(b === iso)));
      q$(".ep-bohr-wrap").innerHTML = bohrSvg("epb", i.neutrons);
      q$(".ep-n").textContent = String(i.neutrons);
      q$(".ep-iso-text").textContent = i.text;
      return;
    }
    const mode$ = t.closest<HTMLElement>("[data-mode]");
    if (mode$) { setMode(mode$.dataset.mode as AtomMode); return; }
    const orb = t.closest<HTMLElement>("[data-orbital]");
    if (orb) {
      orbital = orb.dataset.orbital as Orbital;
      scene?.setOrbital(orbital);
      scroll.querySelectorAll<HTMLElement>("[data-orbital]").forEach((b) => b.setAttribute("aria-pressed", String(b === orb)));
      q$(".ep-3d-text").textContent = ORBITALS.find((o) => o.id === orbital)!.text;
      return;
    }
    const tg = t.closest<HTMLElement>("[data-toggle]");
    if (tg) {
      const on = tg.getAttribute("aria-pressed") !== "true";
      toggle(tg.dataset.toggle!, on);
      if (tg.dataset.toggle === "rotate") scene?.setRotate(on);
      else if (tg.dataset.toggle === "zoom") scene?.setZoom(on);
      else scene?.setAnimate(on);
      return;
    }
    const more = t.closest<HTMLElement>("[data-more]");
    if (more) { const p = more.nextElementSibling as HTMLElement, open = more.getAttribute("aria-expanded") !== "true"; more.setAttribute("aria-expanded", String(open)); p.hidden = !open; if (open) p.textContent = more.dataset.more === "universe" ? f.universe.more : f.earth.more; return; }
    const cp = t.closest<HTMLElement>("[data-comp]");
    if (cp) {
      const c = f.compounds.find((x) => x.id === cp.dataset.comp)!;
      scroll.querySelectorAll<HTMLElement>("[data-comp]").forEach((b) => b.setAttribute("aria-pressed", String(b === cp)));
      q$(".ep-comp-text").innerHTML = `<b>${esc(c.name)} (${esc(c.formula)})</b> ${esc(c.text)}`;
      return;
    }
    const ic = t.closest<HTMLElement>("[data-iso-card]");
    if (ic) {
      const i = f.isotopes.find((x) => x.id === ic.dataset.isoCard)!;
      scroll.querySelectorAll<HTMLElement>("[data-iso-card]").forEach((b) => b.setAttribute("aria-pressed", String(b === ic)));
      q$(".ep-iso-card-text").innerHTML = `<b>${esc(i.name)} (${esc(i.sym)}):</b> ${esc(i.text)}`;
      return;
    }
    const bd = t.closest<HTMLElement>("[data-body]");
    if (bd) {
      const b = f.body.find((x) => x.id === bd.dataset.body)!;
      scroll.querySelectorAll<HTMLElement>("[data-body]").forEach((x) => x.setAttribute("aria-pressed", String(x === bd)));
      q$(".ep-body-text").innerHTML = `<h3>${esc(b.title)} <small>${esc(b.sub)}</small></h3><p>${esc(b.text)}</p>`;
      return;
    }
    if (t.closest("[data-spec]")) {
      const btn = t.closest<HTMLElement>("[data-spec]")!, box = q$<HTMLElement>(".ep-spec"), open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open)); box.hidden = !open;
      return;
    }
    const se = t.closest<HTMLElement>("[data-series]");
    if (se) { scroll.querySelectorAll<HTMLElement>("[data-series]").forEach((b) => b.setAttribute("aria-pressed", String(b === se))); q$(".ep-spec-body").innerHTML = spectrumHtml(se.dataset.series!); return; }
    const rs = t.closest<HTMLElement>("[data-res]");
    if (rs) {
      const r = f.resonance.find((x) => x.id === rs.dataset.res)!, box = q$<HTMLElement>(".ep-res-text");
      scroll.querySelectorAll<HTMLElement>("[data-res]").forEach((b) => b.setAttribute("aria-pressed", String(b === rs)));
      box.hidden = false; box.innerHTML = `<h3>${esc(r.title)}</h3><p>${esc(r.text)}</p>`;
      return;
    }
    const ap = t.closest<HTMLElement>("[data-app]");
    if (ap) {
      const a = f.apps.find((x) => x.id === ap.dataset.app)!;
      scroll.querySelectorAll<HTMLElement>("[data-app]").forEach((b) => b.setAttribute("aria-pressed", String(b === ap)));
      q$(".ep-app-text").innerHTML = `<h3>${esc(a.title)} <small>${esc(a.sub)}</small></h3><p>${esc(a.text)}</p>${claimLine(a.claim)}`;
      return;
    }
    const hs = t.closest<HTMLElement>("[data-hist]");
    if (hs) {
      const h = f.history.find((x) => x.id === hs.dataset.hist)!;
      scroll.querySelectorAll<HTMLElement>("[data-hist]").forEach((b) => b.setAttribute("aria-pressed", String(b === hs)));
      q$(".ep-hist-text").innerHTML = `<h3>${esc(h.title)} <small>${esc(h.sub)}</small></h3><p>${esc(h.text)}</p>`;
    }
  });

  // the tab strip follows the reading position
  let ticking = false;
  scroll.addEventListener("scroll", () => {
    if (ticking || scroll.dataset.full !== "1" || performance.now() < spyLock) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const line = scroll.getBoundingClientRect().top + 140;
      let best = "", bt = -Infinity;
      for (const s of SUB) { const el = scroll.querySelector<HTMLElement>(`#${s.id}`); if (!el) continue; const top = el.getBoundingClientRect().top; if (top <= line && top > bt) { bt = top; best = s.id; } }
      if (!best) best = SUB[0].id;
      markTab(best);
    });
  }, { passive: true });

  return {
    /** shows the profile of an element (rebuilds the page unless it is already showing it) */
    show(sym: string) {
      if (built !== sym) build(sym);
      else { scroll.scrollTop = 0; scene?.resize(); }
    },
    stop() { scene?.stop(); },
  };
}
