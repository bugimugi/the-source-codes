import { atlas } from "../data/atlas";
import { claims } from "../data/claims";
import { LEVEL_LABEL, ORIGIN_LABEL, type Claim } from "../data/types";
import { CHAKRAS } from "../data/chakras";
import { APPS, CRYSTALS, FORMATION, FREQS, FREQ_FACT, GROUPS, HISTORY, KRISTALL_NOTICE, POPULAR, STUDIES, SYSTEMS, THEMES, crystalById, type Crystal } from "../data/crystals";
import dots from "../data/landdots.json";
import { hasAsset, mountSlots } from "../assets/slots";
import { esc } from "./dossierParts";
import { ico } from "./icons";
import { ph } from "./landing";
import { gemSvg, quartzSvg, waveSvg } from "./plantArt";
import { latticeSvg, ringsSvg, sittingSvg, systemSvg, tetraSvg, vesicaSvg } from "./crystalArt";

export interface CrystalsApi {
  reduceMotion: boolean;
  /** the 3D atlas of crystals: with an id that entry is selected, without the category opens */
  openAtlas(id?: string): void;
  /** the mineral atlas; "table" opens its periodic table, "formation" scrolls to the formation section */
  openMinerals(section?: "table" | "formation"): void;
  openFx(): void;
  openCultures(): void;
  openClaim(id: string, from: HTMLElement): void;
}

const claimById = (id: string): Claim | undefined => claims.find((c) => c.id === id);
const SHORT: Record<string, string> = { claimed: "Behauptung · ungeprüft", hypothesis: "Hypothese", supported: "Belegt, Deutung offen", established: "Gesichert", historical: "Historisch dokumentiert", unsupported: "Nicht belegt" };
const chipFor = (id?: string) => {
  const c = id ? claimById(id) : undefined;
  return c ? `<span class="pp-lvl" style="--c:var(--lvl-${c.level})" title="${esc(LEVEL_LABEL[c.level])}">${esc(SHORT[c.level] ?? LEVEL_LABEL[c.level])}</span>` : "";
};
const claimLine = (id?: string) => (id && claimById(id) ? `<p class="kr-claimline">${chipFor(id)} <button class="pl-link" data-claim="${id}">Aussage und Quellen</button></p>` : "");
const effectClaim = (id: string) => (claimById(`crystal-${id}-effects`) ? `crystal-${id}-effects` : "crystal-healing-general");
const colorOf = (id: string) => atlas.find((e) => e.id === id)?.model.color ?? "#b07cff";
const PROP_ICON = ["layers", "palette", "ruler", "balance", "hex", "sun", "target", "soil", "link", "cell", "pin"];
const TAB_LABEL: [string, string][] = [["eig", "Eigenschaften"], ["wirk", "Wirkung"], ["anw", "Anwendung"], ["vork", "Vorkommen"]];

/** the crystal's associations with chakras from the atlas (modern lore), as chakra ids */
function chakrasOf(id: string): string[] {
  const e = atlas.find((x) => x.id === id);
  return CHAKRAS.filter((c) => e?.associations.some((a) => a.target === c.target)).map((c) => c.id);
}

/**
 * The "Kristalle & Heilsteine" landing page (Kristall-Atlas): hero with figures, ten categories, popular crystals, the seven crystal
 * systems, a spotlight on one crystal (switchable) with properties, lore, uses and localities, chakra assignment, frequencies,
 * applications, world map, formation, history, related topics and studies. Properties are textbook values; lore (effects, chakras,
 * Solfeggio frequencies, "gemstone water") is shown as lore with the evidence level of its claim and safety notes.
 */
export function initCrystals(root: HTMLElement, api: CrystalsApi) {
  const scroll = root.querySelector<HTMLElement>(".pl-scroll")!;
  const q$ = <T extends HTMLElement>(s: string) => scroll.querySelector<T>(s)!;
  let sel = "amethyst";
  let tab = "eig";
  let thumb = 0;
  let group = "alle";
  let place = "";
  const hasChakra = (c: Crystal) => chakrasOf(c.id).length > 0;
  const members = (gid: string) => { const g = GROUPS.find((x) => x.id === gid)!; return g.members ? CRYSTALS.filter((c) => g.members!(c, hasChakra(c))) : []; };
  const byPop = (list: Crystal[]) => [...list].sort((a, b) => POPULAR.indexOf(a.id) - POPULAR.indexOf(b.id));
  const art = (c: Crystal, cls: string) => hasAsset(`atlas-${c.id}`) ? `<div class="${cls}" data-slot="atlas-${c.id}" data-fit="cover" data-sizes="(max-width: 700px) 40vw, 12vw"></div>` : `<div class="${cls} kr-gem">${gemSvg(colorOf(c.id))}</div>`;

  // countries of all localities, with the crystals found there
  const countries = new Map<string, { crystals: Set<string>; lat: number; lon: number }>();
  for (const c of CRYSTALS) for (const p of c.places) { const e = countries.get(p.name) ?? { crystals: new Set<string>(), lat: p.lat, lon: p.lon }; e.crystals.add(c.id); countries.set(p.name, e); }
  const topCountries = [...countries.entries()].sort((a, b) => b[1].crystals.size - a[1].crystals.size).slice(0, 5);
  const allPins = [...countries.entries()];

  scroll.innerHTML = `
    <div class="pl-hero kr-hero">
      <div class="pl-hero-bg" data-slot="kristall-hero" data-fit="cover" data-eager="true"></div>
      ${hasAsset("kristall-hero") ? "" : `<div class="pl-hero-alt og-hero-alt kr-hero-alt" data-slot="tile-kristalle" data-fit="cover" aria-hidden="true"></div>`}
      <div class="pl-hero-text">
        <p class="kr-eyebrow">Kristall-Atlas</p>
        <h1>Kristalle <span>&amp;</span> Heilsteine</h1>
        <p class="kr-tag">Die verborgene Geometrie der Erde</p>
        <p class="pl-lead">Kristalle sind die natürliche, geordnete Form der Materie. Sie verbinden Geologie, Wissenschaft, Ästhetik und jahrtausendealtes Wissen über ihre zugeschriebene Wirkung und symbolische Bedeutung.</p>
        <div class="kr-cta"><button class="mn-gold" data-to="kr-pop">Kristalle entdecken <span aria-hidden="true">→</span></button><button class="pl-ghost" data-to="kr-science">${ico("microscope")} Die Wissenschaft</button></div>
      </div>
      <aside class="kr-stats" aria-label="Kennzahlen"><ul>
        <li><i>${ico("hex")}</i><b>6.000+</b><span>Mineralarten (<a href="https://rruff.info/ima/" target="_blank" rel="noopener noreferrer">IMA</a>)</span></li>
        <li><i>${ico("layers")}</i><b>${SYSTEMS.length}</b><span>Kristallsysteme</span></li>
        <li><i>${ico("palette")}</i><b>∞</b><span>Formen &amp; Farben</span></li>
        <li><i>${ico("scroll")}</i><span class="solo">Alte Kulturen weltweit</span></li></ul></aside>
      <p class="kr-quote">„Kristalle sind gefrorenes Licht der Erde.“<small>Sinnspruch, kein belegtes Zitat</small></p>
    </div>

    <section class="kr-cats" aria-label="Kategorien"><div class="kr-cat-row">${GROUPS.map((g) => `<button class="kr-cat${g.soon ? " soon" : ""}${g.id === group ? " on" : ""}" data-group="${g.id}" ${g.soon ? 'aria-disabled="true"' : ""} aria-pressed="${g.id === group}">${ph(g.slot, "kr-cat-img", g.icon, g.tint)}<span><strong>${esc(g.title)}</strong>${g.soon ? "<small>in Vorbereitung</small>" : ""}</span></button>`).join("")}</div></section>

    <div class="kr-grid2">
      <section class="kr-band kr-pop" id="kr-pop" aria-labelledby="kr-pop-h">
        <h2 id="kr-pop-h">Beliebte Kristalle</h2><p class="pl-sub kr-pop-sub">Entdecke einige der faszinierendsten Kristalle.</p>
        <div class="kr-rel-wrap"><button class="kr-arr l" data-pop="-1" aria-label="Zurück">‹</button><div class="kr-pop-row" tabindex="-1"></div><button class="kr-arr r" data-pop="1" aria-label="Weiter">›</button></div>
      </section>
      <section class="kr-band kr-sys" id="kr-sys" aria-labelledby="kr-sys-h">
        <h2 id="kr-sys-h">Kristallsysteme</h2><p class="pl-sub">Die 7 kristallographischen Systeme. Tippe auf eins.</p>
        <div class="kr-sys-grid"><ul class="kr-sys-list">${SYSTEMS.map((s) => `<li><button data-sys="${s.id}" aria-pressed="false">${systemSvg(s.id, "krs")}<strong>${esc(s.title)}</strong><small>(${esc(s.axes)})</small></button></li>`).join("")}</ul>
          <div class="kr-sys-big">${hasAsset("kristall-system") ? `<div class="kr-sys-img" data-slot="kristall-system" data-fit="cover" aria-hidden="true"></div>` : quartzSvg("krb", "#b07cff", 2)}</div></div>
        <div class="kr-text kr-sys-text" aria-live="polite"><p>Jedes Kristallsystem ist durch seine Symmetrie bestimmt. Tippe auf ein System, um sein Beispiel zu sehen.</p></div>
      </section>
    </div>

    <section class="kr-band kr-spot" id="kr-spot" aria-labelledby="kr-spot-h">
      <div class="kr-spot-l">
        <h2 class="kr-big" id="kr-spot-h"></h2>
        <p class="kr-keys"></p>
        <p class="kr-spot-text"></p>
        <div class="kr-cta"><button class="mn-gold" data-details aria-expanded="false">Details ansehen <span aria-hidden="true">→</span></button><button class="pl-ghost" data-atlas3d>${ico("cell")} 3D-Ansicht</button></div>
      </div>
      <div class="kr-stage-wrap">
        <ul class="kr-thumbs" aria-label="Ansichten"></ul>
        <div class="kr-stage"><button class="kr-arr l" data-shot="-1" aria-label="Vorherige Ansicht">‹</button><div class="kr-stage-art"></div><button class="kr-arr r" data-shot="1" aria-label="Nächste Ansicht">›</button></div>
      </div>
      <div class="kr-tabs-wrap">
        <div class="kr-tabs" role="tablist" aria-label="Kristall-Informationen">${TAB_LABEL.map(([id, l]) => `<button role="tab" data-tab="${id}" aria-selected="${id === tab}">${l}</button>`).join("")}</div>
        <div class="kr-tab-body" role="tabpanel" aria-live="polite"></div>
      </div>
      <div class="kr-details" hidden></div>
    </section>

    <div class="kr-grid3">
      <section class="kr-band kr-energy" id="kr-energy" aria-labelledby="kr-en-h">
        <h2 id="kr-en-h">Energetische Eigenschaften</h2>
        <p class="pl-sub">Kristalle besitzen eine geordnete innere Struktur, die in der Überlieferung mit Schwingungen, Licht und Energie in Verbindung gebracht wird.</p>
        <ul class="kr-freqs">${FREQS.map((f) => `<li><button data-freq="${f.id}" aria-pressed="false"><span class="kr-freq-ic">${f.id === "528" ? waveSvg() : f.id === "432" ? vesicaSvg() : ringsSvg()}</span><b>${esc(f.hz)}</b><small>${esc(f.sub)}</small></button></li>`).join("")}</ul>
        <div class="kr-text kr-freq-text" aria-live="polite"><p>Tippe auf eine Frequenz. Es sind Zuschreibungen der modernen Klangheilkunde, mit Belegstufe.</p>${claimLine("kristall-solfeggio")}</div>
        <p class="kr-fact">${esc(FREQ_FACT)}</p>
        <button class="pl-ghost" data-fx>Mehr über Frequenzen <span aria-hidden="true">→</span></button>
      </section>
      <section class="kr-band kr-chakra" id="kr-chakra" aria-labelledby="kr-ch-h">
        <h2 id="kr-ch-h">Chakra-Zuordnung</h2><p class="pl-sub kr-ch-sub"></p>
        <div class="kr-ch-grid"><div class="kr-ch-fig"></div><ul class="kr-ch-list">${[...CHAKRAS].reverse().map((c) => `<li data-chakra="${c.id}" style="--c:${c.color}"><i></i><span><strong>${esc(c.name)}</strong><small>${esc(c.themes)}</small></span></li>`).join("")}</ul></div>
        <p class="kr-fact">Die Zuordnung von Steinen zu Chakren ist überwiegend modern (20. Jahrhundert); eine historische Quelle ist nicht bekannt. Hervorgehoben sind die Chakren des gewählten Kristalls.</p>
      </section>
      <section class="kr-band kr-apps" id="kr-apps" aria-labelledby="kr-a-h">
        <h2 id="kr-a-h">Anwendungsbereiche</h2><p class="pl-sub">Kristalle werden seit Jahrtausenden in verschiedenen Kulturen, Traditionen und modernen Anwendungen eingesetzt.</p>
        <div class="kr-app-grid">${APPS.map((a) => `<button data-app="${a.id}" aria-pressed="false">${ph(`kristall-anw-${a.id}`, "kr-app-img", a.icon, "#7a6aa8")}<em class="${a.kind}">${a.kind === "dok" ? "Dokumentiert" : "Überlieferung"}</em><span><strong>${esc(a.title)}</strong><small>${esc(a.sub)}</small></span></button>`).join("")}</div>
        <div class="kr-text kr-app-text" aria-live="polite"><p>Tippe auf einen Bereich. Dokumentiertes (Schmuck, Sammlung, Technik) und Überlieferung (Wirkungen) sind getrennt gekennzeichnet.</p></div>
      </section>
    </div>

    <div class="kr-grid4">
      <section class="kr-band kr-map" id="kr-map" aria-labelledby="kr-m-h">
        <h2 id="kr-m-h">Vorkommen weltweit</h2><p class="pl-sub">Wichtige Fundorte und geologische Regionen (Auswahl, nicht vollständig).</p>
        <div class="kr-map-grid">
          <div class="kr-map-box" role="group" aria-label="Weltkarte mit Fundorten"><div class="kr-map-bg" data-slot="kristall-map" data-fit="cover"></div><canvas class="kr-map-cv" aria-hidden="true"></canvas>
            <div class="kr-pins">${allPins.map(([n, e]) => `<button class="kr-pin" data-place="${esc(n)}" style="left:${(((e.lon + 180) / 360) * 100).toFixed(1)}%;top:${(((78 - e.lat) / 136) * 100).toFixed(1)}%" aria-pressed="false" aria-label="${esc(n)}: ${[...e.crystals].map((id) => crystalById(id)!.short).join(", ")}"><span>${esc(n)}</span></button>`).join("")}</div></div>
          <ul class="kr-places">${topCountries.map(([n, e]) => `<li><button data-place="${esc(n)}" aria-pressed="false"><i>${gemSvg("#b07cff")}</i><span><strong>${esc(n)}</strong><small>${[...e.crystals].slice(0, 3).map((id) => esc(crystalById(id)!.short)).join(", ")}</small></span></button></li>`).join("")}</ul>
        </div>
        <button class="pl-ghost" data-minerals>Mineralatlas öffnen <span aria-hidden="true">→</span></button>
      </section>
      <section class="kr-band kr-form" id="kr-form" aria-labelledby="kr-f-h">
        <h2 id="kr-f-h">Entstehung</h2><p class="pl-sub kr-form-sub">Kristalle entstehen in der Natur durch verschiedene geologische Prozesse.</p>
        <div class="kr-form-row">${FORMATION.map((f) => `<button data-fo="${f.id}" aria-pressed="false">${ph(`mineral-bild-${f.id}`, "kr-fo-img", f.icon, f.id === "magma" ? "#d6502a" : f.id === "meta" ? "#8a6a5a" : f.id === "sedi" ? "#c8964a" : "#58a8d6")}<span><strong>${esc(f.title)}</strong><small>${esc(f.sub)}</small></span></button>`).join("")}</div>
        <div class="kr-text kr-fo-text" aria-live="polite"><p>Tippe auf eine Entstehungsart. Hervorgehoben sind die, in denen der gewählte Kristall vorkommt (Lehrbuchwissen, Source pending verification).</p></div>
      </section>
      <section class="kr-band kr-hist" id="kr-hist" aria-labelledby="kr-h-h">
        <h2 id="kr-h-h">Geschichte &amp; Kultur</h2><p class="pl-sub">Kristalle in verschiedenen Kulturen und Epochen.</p>
        <ol class="kr-tl">${HISTORY.map((h) => `<li><i aria-hidden="true"></i><button data-hist="${h.id}" aria-pressed="false">${ph(`kristall-hist-${h.id}`, "kr-h-img", "scroll", "#9a7a4a")}<span><strong>${esc(h.title)}</strong><small>${esc(h.sub)}</small></span></button></li>`).join("")}</ol>
        <div class="kr-text kr-hist-text" aria-live="polite"><p>Tippe auf eine Epoche. Die Texte sind Überlieferung und Lehrbuchwissen, Source pending verification.</p></div>
      </section>
    </div>

    <div class="kr-bottom">
      <section class="kr-band kr-themes" id="kr-themes" aria-labelledby="kr-t-h">
        <h2 id="kr-t-h">Verwandte Themen</h2>
        <ul class="kr-theme-row">${THEMES.map((t) => `<li><button data-theme="${t.to}">${ph(`kristall-thema-${t.id}`, "kr-th-img", t.icon, "#6a7aa8")}<span><strong>${esc(t.title)}</strong><small>${esc(t.sub)}</small></span></button></li>`).join("")}</ul>
      </section>
      <section class="kr-band kr-science" id="kr-science" aria-labelledby="kr-s-h">
        <h2 id="kr-s-h">Wissenschaft &amp; Studien</h2>
        <ul class="kr-papers">${STUDIES.map((s) => `<li><i>${ico("book")}</i><div><strong>${esc(s.title)}</strong><small>${esc(s.author)}, ${esc(s.year)} · ${esc(s.kind)}</small><p>${esc(s.note)}</p></div>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">Quelle ansehen ${ico("external")}</a>` : `<button data-claim="${s.claim}">Aussage ansehen</button>`}</li>`).join("")}</ul>
        <p class="kr-fact">Die drei Einträge ersetzen die Platzhalter-Titel der Vorlage. Quellen aus Suchauszügen, Originale nicht geprüft (Source pending verification).</p>
      </section>
    </div>
    <div class="pl-wrap"><p class="pl-notice">${esc(KRISTALL_NOTICE)}</p></div>`;

  // ---------------------------------------------------------------- categories and the popular row
  const popRow = q$<HTMLElement>(".kr-pop-row");
  function renderPop() {
    const g = GROUPS.find((x) => x.id === group)!;
    const list = g.soon ? [] : byPop(members(group));
    q$("#kr-pop-h").textContent = group === "alle" ? "Beliebte Kristalle" : g.title;
    q$(".kr-pop-sub").textContent = g.soon ? `${g.title} sind noch nicht im Atlas. Der Bereich ist in Vorbereitung.` : group === "alle" ? "Entdecke einige der faszinierendsten Kristalle." : `${list.length} Einträge im Atlas: ${g.sub}.`;
    popRow.innerHTML = list.map((c) => `<button class="kr-card${c.id === sel ? " on" : ""}" data-crystal="${c.id}" aria-pressed="${c.id === sel}">${art(c, "kr-card-img")}<strong>${esc(c.short)}</strong></button>`).join("");
    mountSlots(popRow);
    scroll.querySelectorAll<HTMLElement>("[data-group]").forEach((b) => { const o = b.dataset.group === group; b.classList.toggle("on", o); b.setAttribute("aria-pressed", String(o)); });
  }

  // ---------------------------------------------------------------- spotlight
  const views = (c: Crystal) => (c.id === "amethyst" ? 4 : hasAsset(`atlas-${c.id}`) ? 1 : 4);
  const stageHtml = (c: Crystal, v: number, cls: string) => {
    const slot = c.id === "amethyst" ? `kristall-amethyst-${v + 1}` : `atlas-${c.id}`;
    return hasAsset(slot) ? `<div class="${cls}" data-slot="${slot}" data-fit="cover" data-alt="${esc(c.short)}" data-sizes="(max-width: 700px) 90vw, 30vw"></div>` : quartzSvg(`kq${v}${cls.length}`, colorOf(c.id), v);
  };
  function tabBody(c: Crystal): string {
    if (tab === "eig") {
      const rows = [["Mineralgruppe", c.group], ["Farbe", c.color], ["Härte (Mohs)", c.hardness], ["Dichte", c.density], ["Kristallsystem", c.systemLabel], ["Transparenz", c.transparency], ["Glanz", c.luster], ["Strichfarbe", c.streak], ["Spaltbarkeit", c.cleavage], ["Bruch", c.fracture], ["Fundorte", c.places.slice(0, 3).map((p) => p.name).join(", ") + " u. a."]];
      return `<div class="kr-eig"><ul class="kr-props">${rows.map(([l, v], i) => `<li><i>${ico(PROP_ICON[i])}</i><span>${esc(l)}</span><b>${esc(v)}</b></li>`).join("")}</ul>
        <div class="kr-diag"><div><h4>Chemische Formel</h4><p class="kr-formula">${esc(c.formula)}</p>${c.formula === "SiO₂" ? tetraSvg("kt") : latticeSvg(c.system, "kf")}<small>Schematisch</small></div>
        <div><h4>Kristallstruktur</h4>${latticeSvg(c.system, "kl")}<small>Schematisch${c.system ? "" : ": Glas ohne Gitter"}</small></div></div></div><p class="kr-note">Lehrbuchwerte, Source pending verification.</p>`;
    }
    if (tab === "wirk") {
      const e = atlas.find((x) => x.id === c.id);
      return `<div class="kr-lore"><p class="kr-lore-h">Überlieferung der modernen Steinkunde, keine Messung:</p><p class="kr-lore-keys">${esc(c.keywords)}</p>
        ${e?.tradition ? `<p>${esc(e.tradition)}</p>` : ""}
        ${e?.associations.length ? `<ul class="kr-assoc">${e.associations.map((a) => `<li><b>${esc(a.target)}</b> <small>${esc(ORIGIN_LABEL[a.origin])}</small></li>`).join("")}</ul>` : ""}
        ${claimLine(effectClaim(c.id))}${effectClaim(c.id) !== "crystal-healing-general" ? claimLine("crystal-healing-general") : ""}
        <p class="kr-note">Für eine Wirkung über den Placebo-Effekt hinaus ist keine kontrollierte Studie bekannt. Heilsteine ersetzen keine ärztliche Behandlung.</p></div>`;
    }
    if (tab === "anw") return `<ul class="kr-uses">${c.uses.map((u) => `<li><em class="${u.kind}">${u.kind === "dok" ? "Dokumentiert" : "Überlieferung"}</em><strong>${esc(u.title)}</strong><p>${esc(u.text)}</p></li>`).join("")}</ul><p class="kr-note">Lehrbuchwissen und Überlieferung, Source pending verification.</p>`;
    return `<p class="kr-lore-h">${esc(c.formedText)}</p><ul class="kr-uses vork">${c.places.map((p) => `<li><i>${ico("pin")}</i><strong>${esc(p.name)}</strong><span>${esc(p.note)}</span></li>`).join("")}</ul><button class="pl-ghost" data-to="kr-map">Auf der Karte zeigen <span aria-hidden="true">→</span></button>`;
  }
  function renderSpot() {
    const c = crystalById(sel)!;
    q$(".kr-big").textContent = c.short;
    q$(".kr-keys").innerHTML = `${esc(c.keywords)} <span class="kr-keys-chip">${chipFor(effectClaim(c.id))}</span>`;
    q$(".kr-spot-text").textContent = c.text;
    const n = views(c);
    if (thumb >= n) thumb = 0;
    q$(".kr-stage-art").innerHTML = stageHtml(c, thumb, "kr-stage-img");
    const th = q$(".kr-thumbs");
    th.hidden = n < 2;
    th.innerHTML = Array.from({ length: n }, (_, i) => `<li><button data-thumb="${i}" aria-pressed="${i === thumb}" aria-label="Ansicht ${i + 1}">${stageHtml(c, i, "kr-thumb-img")}</button></li>`).join("");
    scroll.querySelectorAll<HTMLElement>("[data-shot]").forEach((b) => (b.hidden = n < 2));
    scroll.querySelectorAll<HTMLElement>("[data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
    q$(".kr-tab-body").innerHTML = tabBody(c);
    // chakras
    const act = chakrasOf(c.id);
    q$(".kr-ch-sub").textContent = act.length ? `${c.short}: nach der modernen Steinkunde zugeordnet.` : `${c.short}: im Atlas keinem Chakra zugeordnet.`;
    q$(".kr-ch-fig").innerHTML = sittingSvg("kch", [...CHAKRAS].reverse().map((x) => ({ id: x.id, color: x.color })), act);
    scroll.querySelectorAll<HTMLElement>("[data-chakra]").forEach((li) => li.classList.toggle("on", act.includes(li.dataset.chakra!)));
    // formation
    scroll.querySelectorAll<HTMLElement>("[data-fo]").forEach((b) => b.classList.toggle("off", !c.formed.includes(b.dataset.fo!)));
    // map: the selected crystal's localities are lit
    const mine = new Set(c.places.map((p) => p.name));
    scroll.querySelectorAll<HTMLElement>(".kr-pin").forEach((p) => p.classList.toggle("mine", mine.has(p.dataset.place!)));
    q$(".kr-details").hidden = true;
    q$("[data-details]").setAttribute("aria-expanded", "false");
    mountSlots(q$(".kr-spot"));
    popRow.querySelectorAll<HTMLElement>(".kr-card").forEach((b) => { b.classList.toggle("on", b.dataset.crystal === sel); b.setAttribute("aria-pressed", String(b.dataset.crystal === sel)); });
  }
  function details(): string {
    const c = crystalById(sel)!, e = atlas.find((x) => x.id === sel)!;
    const cl = e.claims.map((id) => claimById(id)).filter((x): x is Claim => !!x);
    return `<h3>${esc(e.name)}${e.latin && e.latin !== e.name ? ` · ${esc(e.latin)}` : ""}</h3>
      <div class="kr-det-grid"><div><h4>Fakten im Atlas</h4><ul class="kr-uses">${e.facts.map((f) => `<li><strong>${esc(f.label)}</strong><p>${esc(f.value)}</p></li>`).join("")}</ul></div>
      <div><h4>Aussagen dazu</h4><ul class="kr-uses">${cl.map((x) => `<li>${chipFor(x.id)} <button class="pl-link" data-claim="${x.id}">${esc(x.short ?? x.statement)}</button></li>`).join("")}</ul>
      <h4>Quellen</h4><ul class="kr-uses">${e.sources.map((s) => `<li><strong>${esc(s.title)}</strong>${s.url ? ` <a class="pl-link" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">öffnen</a>` : ""}<p>${esc(s.citation)} (ungeprüft)</p></li>`).join("")}</ul></div></div>
      <p class="kr-note">Eigenschaften: ${esc(c.systemLabel)}, Härte ${esc(c.hardness)}. Alles Lehrbuchwissen und Überlieferung, Source pending verification.</p>
      <p><button class="pl-ghost" data-atlas3d>Im Atlas ansehen <span aria-hidden="true">→</span></button></p>`;
  }

  // ---------------------------------------------------------------- the map
  const cv = q$<HTMLCanvasElement>(".kr-map-cv");
  const mapBox = q$<HTMLElement>(".kr-map-box");
  function drawMap() {
    q$<HTMLElement>(".kr-map-bg").hidden = !hasAsset("kristall-map");
    if (hasAsset("kristall-map")) { cv.hidden = true; return; }
    cv.hidden = false;
    const r = mapBox.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    const g = cv.getContext("2d")!;
    g.scale(dpr, dpr);
    g.clearRect(0, 0, r.width, r.height);
    const rad = Math.max(1.3, r.width / 320);
    for (const [la, lo] of dots as [number, number][]) {
      const lat = la / 10, lon = lo / 10;
      if (lat > 78 || lat < -58) continue;
      g.fillStyle = "rgba(190, 165, 120, 0.7)";
      g.fillRect(((lon + 180) / 360) * r.width - rad / 2, ((78 - lat) / 136) * r.height - rad / 2, rad, rad);
    }
  }
  new ResizeObserver(drawMap).observe(mapBox);

  // ---------------------------------------------------------------- clicks
  const smooth = (el: Element | null) => el?.scrollIntoView({ behavior: api.reduceMotion ? "auto" : "smooth", block: "start" });
  const press = (attr: string, id: string) => scroll.querySelectorAll<HTMLElement>(`[${attr}]`).forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute(attr) === id)));
  const setText = (s: string, html: string) => { q$(s).innerHTML = html; };

  scroll.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) { api.openClaim(cl.dataset.claim!, cl); return; }
    const to = t.closest<HTMLElement>("[data-to]");
    if (to) { smooth(q$(`#${to.dataset.to}`)); return; }
    const gr = t.closest<HTMLElement>("[data-group]");
    if (gr) { group = group === gr.dataset.group ? "alle" : gr.dataset.group!; renderPop(); if (gr.getAttribute("aria-disabled") !== "true") smooth(q$("#kr-pop")); return; }
    const cr = t.closest<HTMLElement>("[data-crystal]");
    if (cr) { sel = cr.dataset.crystal!; thumb = 0; tab = "eig"; renderSpot(); smooth(q$("#kr-spot")); return; }
    const pp = t.closest<HTMLElement>("[data-pop]");
    if (pp) { popRow.scrollBy({ left: Number(pp.dataset.pop) * popRow.clientWidth * 0.8, behavior: api.reduceMotion ? "auto" : "smooth" }); return; }
    const sy = t.closest<HTMLElement>("[data-sys]");
    if (sy) {
      const s = SYSTEMS.find((x) => x.id === sy.dataset.sys)!;
      press("data-sys", s.id);
      const own = CRYSTALS.filter((c) => c.system === s.id);
      setText(".kr-sys-text", `<h3>${esc(s.title)} <small>${esc(s.axes)}</small></h3><p>${esc(s.text)}</p><p><b>Beispiele:</b> ${esc(s.examples)}.</p>${own.length ? `<p class="kr-sys-own">Im Atlas: ${own.map((c) => `<button class="pl-link" data-crystal="${c.id}">${esc(c.short)}</button>`).join(", ")}</p>` : ""}<p class="kr-note">Lehrbuchwissen, Source pending verification. Die Vorlage nannte „Kubisch (4-zählig)“ und „Orthorhombisch (3-zählig)“; richtig sind vier dreizählige und drei zweizählige Achsen.</p>`);
      return;
    }
    const th = t.closest<HTMLElement>("[data-thumb]");
    if (th) { thumb = Number(th.dataset.thumb); renderSpot(); return; }
    const sh = t.closest<HTMLElement>("[data-shot]");
    if (sh) { const n = views(crystalById(sel)!); thumb = (thumb + Number(sh.dataset.shot) + n) % n; renderSpot(); return; }
    const tb = t.closest<HTMLElement>("[data-tab]");
    if (tb) { tab = tb.dataset.tab!; scroll.querySelectorAll<HTMLElement>("[data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b === tb))); q$(".kr-tab-body").innerHTML = tabBody(crystalById(sel)!); return; }
    const dt = t.closest<HTMLElement>("[data-details]");
    if (dt) { const box = q$(".kr-details"), open = dt.getAttribute("aria-expanded") !== "true"; dt.setAttribute("aria-expanded", String(open)); box.hidden = !open; if (open) { box.innerHTML = details(); smooth(box); } return; }
    if (t.closest("[data-atlas3d]")) { api.openAtlas(sel); return; }
    const fq = t.closest<HTMLElement>("[data-freq]");
    if (fq) { const f = FREQS.find((x) => x.id === fq.dataset.freq)!; press("data-freq", f.id); setText(".kr-freq-text", `<h3>${esc(f.hz)} <small>${esc(f.title)}</small></h3><p>${esc(f.text)}</p>${claimLine(f.claim)}${f.id === "432" ? claimLine("hz432-theta") : ""}`); return; }
    if (t.closest("[data-fx]")) { api.openFx(); return; }
    const ap = t.closest<HTMLElement>("[data-app]");
    if (ap) { const a = APPS.find((x) => x.id === ap.dataset.app)!; press("data-app", a.id); setText(".kr-app-text", `<h3>${esc(a.title)} <small>${esc(a.sub)}</small></h3><p>${esc(a.text)}</p>${claimLine(a.claim)}`); return; }
    const pl = t.closest<HTMLElement>("[data-place]");
    if (pl) {
      place = place === pl.dataset.place ? "" : pl.dataset.place!;
      scroll.querySelectorAll<HTMLElement>("[data-place]").forEach((b) => b.setAttribute("aria-pressed", String(!!place && b.dataset.place === place)));
      return;
    }
    if (t.closest("[data-minerals]")) { api.openMinerals(); return; }
    const fo = t.closest<HTMLElement>("[data-fo]");
    if (fo) {
      const f = FORMATION.find((x) => x.id === fo.dataset.fo)!, c = crystalById(sel)!;
      press("data-fo", f.id);
      setText(".kr-fo-text", `<h3>${esc(f.title)} <small>${esc(f.sub)}</small></h3><p>${esc(f.text)}</p><p class="kr-note">${esc(c.short)}: ${c.formed.includes(f.id) ? "kommt hier vor" : "hier eher nicht typisch"}. ${esc(c.formedText)}</p>`);
      return;
    }
    const hs = t.closest<HTMLElement>("[data-hist]");
    if (hs) { const h = HISTORY.find((x) => x.id === hs.dataset.hist)!; press("data-hist", h.id); setText(".kr-hist-text", `<h3>${esc(h.title)} <small>${esc(h.sub)}</small></h3><p>${esc(h.text)}</p>`); return; }
    const tm = t.closest<HTMLElement>("[data-theme]");
    if (tm) {
      const k = tm.dataset.theme!;
      if (k === "minerals") api.openMinerals();
      else if (k === "elements") api.openMinerals("table");
      else if (k === "geology") api.openMinerals("formation");
      else if (k === "fx") api.openFx();
      else if (k === "cultures") api.openCultures();
      else smooth(q$("#kr-science"));
    }
  });

  mountSlots(scroll);
  renderPop();
  renderSpot();
  return {
    start() { requestAnimationFrame(drawMap); },
    stop() { /* nothing runs in the background */ },
  };
}
