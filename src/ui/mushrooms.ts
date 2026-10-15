import { atlas } from "../data/atlas";
import { claims } from "../data/claims";
import { BODY_ORGANS } from "../data/body";
import { RECIPES } from "../data/recipes";
import { LEVEL_LABEL, ORIGIN_LABEL, type AtlasEntry, type Claim } from "../data/types";
import { ORIGIN, REGIONS, type Region } from "../data/plants";
import {
  APPLICATIONS, COMPOUNDS, COMPOUND_NOTE, COMPOUND_TABS, COMPOUND_THUMBS, CULTURES, ECOLOGY, GEO, GLANCE, GLANCE_NOTE, GROUPS, HEALTH_AREAS, HEALTH_NOTE, KNOWN_SPECIES,
  LIFECYCLE, LIFECYCLE_NOTE, MUSHROOMS_NOTICE, NETWORK, NETWORK_INTRO, POPULAR, RESEARCH, STAT_SOURCE, STUDY_CLAIMS, TAGLINE, WILD_WARNING, groupEntries,
} from "../data/mushrooms";
import dots from "../data/landdots.json";
import { hasAsset, mountSlots } from "../assets/slots";
import { searchItems } from "./search";
import { esc } from "./dossierParts";
import { ico } from "./icons";
import { itemImage, ph } from "./landing";
import { figureSvg, fractalSvg, mushroomSvg, myceliumSvg, spiralSvg } from "./plantArt";

export interface MushroomsApi {
  reduceMotion: boolean;
  /** the profile page of one mushroom (opened from this page, so "back" leads here) */
  openPlant(id: string): void;
  /** the 3D atlas: with an id that entry is selected, without the category of mushrooms opens */
  openAtlas(id?: string): void;
  openCultures(): void;
  openPlants(): void;
  openFreq(): void;
  openLab(): void;
  openClaim(id: string, from: HTMLElement): void;
}

const mush: AtlasEntry[] = atlas.filter((e) => e.category === "pilz");
const byId = (id: string) => mush.find((e) => e.id === id);
const claimById = (id: string): Claim | undefined => claims.find((c) => c.id === id);
const rank = (e: AtlasEntry) => { const i = POPULAR.indexOf(e.id); return i < 0 ? 999 : i; };
const nf = (n: number) => n.toLocaleString("de-DE");
const SHORT: Record<string, string> = { claimed: "Behauptung · ungeprüft", hypothesis: "Hypothese", supported: "Belegt, Deutung offen", established: "Gesichert", historical: "Historisch belegt", unsupported: "Nicht belegt", refuted: "Widerlegt" };
const chipFor = (id?: string) => {
  const c = id ? claimById(id) : undefined;
  return c ? `<span class="pp-lvl" style="--c:var(--lvl-${c.level})" title="${esc(LEVEL_LABEL[c.level])}">${esc(SHORT[c.level] ?? LEVEL_LABEL[c.level])}</span>` : "";
};
const claimLine = (id?: string) => (id ? `<p class="pk-claimline">${chipFor(id)} <button class="pl-link" data-claim="${id}">Aussage und Quellen</button></p>` : `<p class="pk-claimline"><span class="pk-textbook">Lehrbuchwissen</span></p>`);
/** the whole words of a text: an association "Herz & Kreislauf" matches "Herz" but "Herzchakra" does not */
const wordsOf = (s: string) => s.split(/[^\p{L}]+/u).filter(Boolean);
const hasWord = (target: string, words: readonly string[]) => { const w = wordsOf(target); return words.some((x) => w.includes(x)); };
const entryLink = (e: AtlasEntry) => `<button class="pl-link" data-plant="${e.id}">${esc(e.name.replace(/\s*\(.*\)/, ""))} ${ico("arrow")}</button>`;

/**
 * The "Pilz Atlas" landing page: hero with search and "at a glance", nine categories, the invisible kingdom (a diagram with six
 * clickable parts), the life cycle of a mushroom, geometry and frequencies, mushrooms and the body (areas from the atlas associations),
 * compound groups, a world map, popular mushrooms, cultures, ecology, uses and research. Numbers come from the atlas or name their source;
 * every effect, pattern or frequency is a graded claim; nothing is an instruction (no amounts, no preparation, no identification help).
 */
export function initMushrooms(root: HTMLElement, api: MushroomsApi) {
  const scroll = root.querySelector<HTMLElement>(".pl-scroll")!;
  let filter = "alle"; // "alle", a group id or "region:<id>"
  let netSel = "", lifeSel = "", geoSel = "", healthSel = "", ecoSel = "", compSel = "ergo";
  const q$ = <T extends HTMLElement>(s: string) => scroll.querySelector<T>(s)!;
  const regionCount = (r: Region) => mush.filter((e) => ORIGIN[e.id]?.includes(r)).length;
  const regionsUsed = REGIONS.filter((r) => regionCount(r.id) > 0).length;
  const genera = new Set(mush.map((e) => e.latin.split(/\s+/)[0])).size;
  const stat = (icon: string, n: string, l: string) => `<div><i>${ico(icon)}</i><dt>${l}</dt><dd>${n}</dd></div>`;
  const claimCount = new Set([...mush.flatMap((e) => e.claims), ...STUDY_CLAIMS].filter((id) => claimById(id))).size;
  const groupsFilled = GROUPS.filter((g) => !g.soon && g.members.length).length;

  // ---- body areas: the mockup's six areas plus every body-page organ that the atlas associations mention
  interface Area { id: string; title: string; icon: string; words: string[] }
  const matches = (words: string[]) => mush.flatMap((e) => e.associations.filter((a) => hasWord(a.target, words)).map((a) => ({ e, a })));
  const organIcon: Record<string, string> = { lunge: "lungs", nieren: "kidney", leber: "cell", haut: "drop", hormone: "balance" };
  const areas: Area[] = [...HEALTH_AREAS];
  for (const o of BODY_ORGANS) {
    if (areas.some((a) => o.match.some((w) => a.words.includes(w)))) continue;
    if (matches(o.match).length) areas.push({ id: o.id, title: o.name, icon: organIcon[o.id] ?? "sparkle", words: o.match });
  }

  scroll.innerHTML = `
    <div class="pl-hero pk-hero">
      <div class="pl-hero-bg" data-slot="pilz-hero" data-fit="cover" data-eager="true"></div>
      ${hasAsset("pilz-hero") ? "" : `<div class="pl-hero-alt og-hero-alt" data-slot="tile-pilze" data-fit="cover" aria-hidden="true"></div>`}
      <div class="pl-hero-text">
        <nav class="og-crumbs" aria-label="Pfad"><button data-act="plants">Natur</button><i>›</i><span>Pilze</span><i>›</i><strong>Pilz Atlas</strong></nav>
        <h1>Pilz Atlas</h1>
        <p class="pk-tag">Die verborgene Welt unter unseren Füßen.</p>
        <p class="pl-lead">Entdecke die faszinierende Welt der Pilze: ihre Arten, Lebenszyklen, Netzwerke, Inhaltsstoffe, kulturelle Bedeutung und ihre zentrale Rolle für das Leben auf der Erde. Jede Aussage mit Quelle und Belegstufe.</p>
        <form class="pl-search" role="search" autocomplete="off">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/></svg>
          <input type="search" class="pl-q" placeholder="Pilzart, Inhaltsstoff, z. B. Reishi, Chaga …" aria-label="Pilze durchsuchen">
          <button type="submit" aria-label="Suchen"><span aria-hidden="true">→</span></button>
          <ul class="pl-sugg" role="listbox" hidden></ul>
        </form>
        <dl class="pk-stats">
          ${stat("mushroom", nf(KNOWN_SPECIES), `Pilzarten beschrieben (<a href="${STAT_SOURCE.url}" target="_blank" rel="noopener noreferrer">Kew 2023</a>)`)}
          ${stat("cell", String(mush.length), "Pilze im Atlas")}
          ${stat("family", String(genera), "Gattungen im Atlas")}
          ${stat("globe", String(regionsUsed), "Regionen im Atlas")}
          ${stat("scroll", String(claimCount), "Aussagen mit Belegstufe")}
          ${stat("network", `${groupsFilled} von ${GROUPS.length}`, "Kategorien mit Einträgen")}
        </dl>
      </div>
      <aside class="pk-glance" aria-label="Auf einen Blick">
        ${hasAsset("pilz-skizze") ? `<div class="pk-sketch" data-slot="pilz-skizze" data-fit="cover" aria-hidden="true"></div>` : ""}
        <h2>Auf einen Blick</h2>
        <ul>${GLANCE.map((g) => `<li><i>${ico(g.icon)}</i><span><strong>${esc(g.title)}</strong><small>${esc(g.sub)}</small></span></li>`).join("")}</ul>
        <p>${esc(GLANCE_NOTE)}</p>
      </aside>
    </div>

    <div class="pl-wrap">
      <div class="pk-warn" role="note">${ico("shield")}<p><strong>Wichtig:</strong> ${esc(WILD_WARNING)}</p></div>
      <section class="og-cats" aria-labelledby="pk-cat-h">
        <div class="pl-head"><div><h2 id="pk-cat-h">Pilz Kategorien</h2><p class="pl-sub">Entdecke die Vielfalt der Pilze nach Eigenschaften, Lebensweise und Verwendung.</p></div><button class="pl-all" data-allcats>Alle Pilze anzeigen <span aria-hidden="true">↓</span></button></div>
        <div class="pk-cat-row">${GROUPS.map((g) => `<button class="pk-cat${g.soon ? " soon" : ""}" data-group="${g.id}" ${g.soon ? 'title="in Vorbereitung"' : ""} aria-pressed="false">
          ${ph(g.slot, "pk-cat-img", g.icon, g.tint)}<span><strong>${esc(g.title)}</strong><small>${g.soon ? "in Vorbereitung" : esc(g.sub)}</small></span></button>`).join("")}</div>
      </section>

      <div class="pk-row pk-row1">
        <section class="pl-panel pk-net" aria-labelledby="pk-net-h">
          <h2 class="pl-h-sm" id="pk-net-h">Das unsichtbare Königreich</h2>
          <p class="pl-sub">Ein riesiges Netz verbindet Wälder, Pflanzen und das Leben unter der Erde.</p>
          <div class="pk-fig">
            <div class="pk-fig-art">${hasAsset("pilz-netz") ? `<div class="pk-fig-img" data-slot="pilz-netz" data-fit="cover" data-alt="Das Pilznetzwerk unter dem Wald"></div>` : myceliumSvg("pkn")}</div>
            <svg class="pk-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${NETWORK.map((p) => {
              const ax = p.side === "l" ? p.at[0] + 22 : p.at[0] - 0.5, ay = p.at[1] + 6;
              return `<g data-line="${p.id}"><line x1="${ax}" y1="${ay}" x2="${p.to[0]}" y2="${p.to[1]}"/><circle cx="${p.to[0]}" cy="${p.to[1]}" r="1"/></g>`;
            }).join("")}</svg>
            <ul class="pk-calls">${NETWORK.map((p) => `<li style="left:${p.at[0]}%;top:${p.at[1]}%"><button class="pk-call ${p.side}" data-net="${p.id}" aria-pressed="false"><i>${ico(p.icon)}</i><span><strong>${esc(p.title)}</strong><small>${esc(p.sub)}</small></span></button></li>`).join("")}</ul>
            <button class="pl-ghost pk-fig-btn" data-net-go>Das Pilznetzwerk erkunden <span aria-hidden="true">→</span></button>
          </div>
          <div class="pk-text pk-net-text" aria-live="polite"><p>${esc(NETWORK_INTRO)}</p></div>
        </section>

        <section class="pl-panel pk-cycle" aria-labelledby="pk-cyc-h">
          <h2 class="pl-h-sm" id="pk-cyc-h">Lebenszyklus eines Pilzes</h2>
          <p class="pl-sub">Von der Spore zum lebenden Netzwerk.</p>
          <div class="pk-ring">
            <div class="pk-ring-art">${hasAsset("pilz-zyklus") ? `<div class="pk-ring-img" data-slot="pilz-zyklus" data-fit="cover" data-alt="Ein Pilz in der Mitte des Lebenszyklus"></div>` : mushroomSvg("pkm")}</div>
            <svg class="pk-ring-arrows" viewBox="0 0 100 100" aria-hidden="true"><defs><marker id="pk-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 1L9 5L0 9z" fill="#F0D18B"/></marker></defs>${LIFECYCLE.map((s, i) => {
              const n = LIFECYCLE[(i + 1) % LIFECYCLE.length];
              const mx = (s.at[0] + n.at[0]) / 2, my = (s.at[1] + n.at[1]) / 2, cx = mx + (50 - mx) * -0.32, cy = my + (52 - my) * -0.32;
              const sh = (a: [number, number], b: [number, number]) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [a[0] + (dx / l) * 11, a[1] + (dy / l) * 8]; };
              const p0 = sh(s.at, [cx, cy]), p1 = sh(n.at, [cx, cy]);
              return `<path d="M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}" fill="none" stroke="#F0D18B" stroke-width=".5" stroke-dasharray="1.6 1.4" marker-end="url(#pk-arr)" opacity=".85"/>`;
            }).join("")}</svg>
            ${LIFECYCLE.map((s) => `<button class="pk-step" data-life="${s.id}" aria-pressed="false" style="left:${s.at[0]}%;top:${s.at[1]}%"><i>${ico(s.icon)}</i><span><strong>${esc(s.title)}</strong><small>${esc(s.sub)}</small></span></button>`).join("")}
          </div>
          <div class="pk-text pk-life-text" aria-live="polite"><p>Tippe auf eine Station des Kreislaufs.</p></div>
          <p class="pk-note">${esc(LIFECYCLE_NOTE)}</p>
        </section>
      </div>

      <div class="pk-row pk-row2">
        <section class="pl-panel pk-geo" aria-labelledby="pk-geo-h">
          <h2 class="pl-h-sm" id="pk-geo-h">Geometrie &amp; Frequenzen</h2>
          <p class="pl-sub">Pilze zeigen faszinierende Muster. Die Deutungen stehen als Behauptung mit Belegstufe.</p>
          <div class="pk-geo-row" role="group" aria-label="Thema wählen">${GEO.map((g) => `<button class="pk-geo-card" data-geo="${g.id}" aria-pressed="false">
            <div class="pk-geo-box">${hasAsset(g.slot) ? `<div class="pk-geo-img" data-slot="${g.slot}" data-fit="cover" aria-hidden="true"></div>` : g.id === "spirale" ? spiralSvg("pks") : g.id === "fraktal" ? fractalSvg("pkf") : g.id === "frequenz" ? `<div class="pk-wave"><span>432 Hz</span>${ico("wave")}</div>` : `<div class="pk-geo-ic">${ico("hex", "big")}</div>`}</div>
            <span><strong>${esc(g.title)}</strong><small>${esc(g.sub)}</small></span></button>`).join("")}</div>
          <div class="pk-text pk-geo-text" aria-live="polite"><p>Tippe auf ein Thema. Die „432 Hz“ in der Abbildung sind die Zahl der Behauptung, kein Messwert.</p></div>
          <button class="pl-ghost" data-freq>Mehr über Geometrie &amp; Frequenzen <span aria-hidden="true">→</span></button>
        </section>

        <section class="pl-panel pk-health" aria-labelledby="pk-health-h">
          <h2 class="pl-h-sm" id="pk-health-h">Pilze &amp; Gesundheit</h2>
          <p class="pl-sub">Was die Atlas-Einträge den Körperbereichen zuordnen. Das ist kein Wirkungsnachweis.</p>
          <div class="pk-health-grid">
            <div class="pk-body" aria-hidden="true">${hasAsset("pilz-koerper") ? `<div class="pk-body-img" data-slot="pilz-koerper" data-fit="cover"></div>` : hasAsset("body-front") ? `<div class="pk-body-img" data-slot="body-front" data-fit="cover"></div>` : figureSvg("pkb")}</div>
            <ul class="pk-areas" role="group" aria-label="Körperbereich wählen">${areas.map((a) => { const n = new Set(matches(a.words).map((m) => m.e.id)).size; return `<li><button data-area="${a.id}" aria-pressed="false"><i>${ico(a.icon)}</i><span><strong>${esc(a.title)}</strong><small>${n ? `${n} ${n === 1 ? "Pilz" : "Pilze"} im Atlas` : "noch keine Zuordnung"}</small></span></button></li>`; }).join("")}</ul>
          </div>
          <div class="pk-text pk-health-text" aria-live="polite"><p>Tippe auf einen Körperbereich. ${esc(HEALTH_NOTE)}</p></div>
          <button class="pl-ghost" data-allclaims>Alle Aussagen im Detail <span aria-hidden="true">→</span></button>
        </section>

        <section class="pl-panel pk-comp" aria-labelledby="pk-comp-h">
          <h2 class="pl-h-sm" id="pk-comp-h">Inhaltsstoffe &amp; Stoffgruppen</h2>
          <p class="pl-sub">Stoffgruppen der Pilze nach Lehrbuchwissen.</p>
          <div class="pk-tabs" role="group" aria-label="Stoffgruppe">${COMPOUND_TABS.map((t) => `<button data-ctab="${t.id}" aria-pressed="false">${esc(t.label)}</button>`).join("")}</div>
          <div class="pk-comp-card" aria-live="polite"></div>
          <ul class="pk-thumbs" role="group" aria-label="Stoff wählen">${COMPOUND_THUMBS.map((id) => { const c = COMPOUNDS.find((x) => x.id === id)!; return `<li><button data-comp="${c.id}" aria-pressed="false">${ph(c.slot, "pk-thumb-img", c.icon, "#d89a4a")}<span>${esc(c.title)}</span></button></li>`; }).join("")}</ul>
          <p class="pk-note">${esc(COMPOUND_NOTE)}</p>
        </section>
      </div>

      <div class="pk-row pk-row3">
        <section class="pl-world pk-world" aria-labelledby="pk-w-h">
          <div class="pl-world-text"><h2 id="pk-w-h">Pilze der Welt</h2><p>Verbreitung (Auswahl): Pilze des Atlas, deren Eintrag eine Region nennt. Die Zahl am Pin ist die Zahl der Einträge.</p><button class="pl-ghost" data-world>Weltkarte erkunden <span aria-hidden="true">→</span></button></div>
          <div class="pl-map" role="group" aria-label="Weltkarte mit Herkunftsregionen"><div class="pl-map-bg" data-slot="pilz-map" data-fit="cover"></div><canvas class="pl-map-cv" aria-hidden="true"></canvas>${REGIONS.map((r) => `<button class="pl-pin${((r.lon + 180) / 360) * 100 > 78 ? " edge" : ""}" data-region="${r.id}" style="left:${(((r.lon + 180) / 360) * 100).toFixed(1)}%;top:${(((78 - r.lat) / 136) * 100).toFixed(1)}%" aria-pressed="false"><b>${regionCount(r.id)}</b><span>${esc(r.name)}</span></button>`).join("")}</div>
        </section>
        <section class="pl-popular pk-popular" aria-labelledby="pk-pop-h">
          <div class="pl-head"><div><h2 id="pk-pop-h">Beliebte Pilze</h2><p class="pl-sub">Die bekanntesten Pilze des Atlas. Das Stichwort ist ein sachlicher Hinweis, keine Deutung.</p></div><div class="pl-head-r"><button class="pl-reset" hidden>Filter zurücksetzen</button><button class="pl-all" data-all>Im 3D-Atlas ansehen <span aria-hidden="true">→</span></button></div></div>
          <div class="pk-grid" tabindex="-1"></div>
        </section>
        <section class="pl-panel pk-cult" aria-labelledby="pk-cult-h">
          <h2 class="pl-h-sm" id="pk-cult-h">Pilze in Kulturen &amp; Traditionen</h2>
          <p class="pl-sub">Seit Jahrtausenden begleiten Pilze die Menschen.</p>
          <div class="pk-card-row pk-cult-row">${CULTURES.map((c) => `<button class="pk-pic" data-cult="${c.id}" aria-pressed="false">${ph(c.slot, "pk-pic-img", c.icon, "#9a7a4a")}<span><strong>${esc(c.title)}</strong><small>${esc(c.sub)}</small></span></button>`).join("")}</div>
        </section>
      </div>

      <div class="pk-row pk-row4">
        <section class="pl-panel pk-eco" aria-labelledby="pk-eco-h">
          <h2 class="pl-h-sm" id="pk-eco-h">Ökologische Bedeutung</h2>
          <p class="pl-sub">Pilze sind unverzichtbar für das Leben auf der Erde.</p>
          <ul class="pk-eco-row" role="group" aria-label="Thema wählen">${ECOLOGY.map((x) => `<li><button data-eco="${x.id}" aria-pressed="false"><i>${ico(x.icon)}</i><strong>${esc(x.title)}</strong><small>${esc(x.sub)}</small></button></li>`).join("")}</ul>
          <div class="pk-text pk-eco-text" aria-live="polite"><p>Tippe auf ein Thema.</p></div>
        </section>
        <section class="pl-panel pk-app" aria-labelledby="pk-app-h">
          <h2 class="pl-h-sm" id="pk-app-h">Anwendungen &amp; Rezepte</h2>
          <p class="pl-sub">Verwendung in Küche, Medizin und Alltag, ohne Mengen und ohne Anleitung.</p>
          <div class="pk-card-row">${APPLICATIONS.map((c) => `<button class="pk-pic" data-app="${c.id}" aria-pressed="false">${ph(c.slot, "pk-pic-img", c.icon, "#9a6a3a")}<span><strong>${esc(c.title)}</strong><small>${esc(c.sub)}</small></span></button>`).join("")}</div>
        </section>
        <section class="pl-panel pk-res" aria-labelledby="pk-res-h">
          <h2 class="pl-h-sm" id="pk-res-h">Forschung &amp; Zukunft</h2>
          <p class="pl-sub">Aktuelle Studien und offene Fragen.</p>
          <div class="pk-card-row">${RESEARCH.map((c) => `<button class="pk-pic" data-res="${c.id}" aria-pressed="false">${ph(c.slot, "pk-pic-img", c.icon, "#4a7aa8")}<span><strong>${esc(c.title)}</strong><small>${esc(c.sub)}</small></span></button>`).join("")}</div>
          <button class="pl-ghost" data-studies>Quellen anzeigen <span aria-hidden="true">→</span></button>
        </section>
      </div>

      <section class="pk-drawer" hidden aria-live="polite"><h3></h3><div class="pk-drawer-body"></div><div class="pk-drawer-actions"></div></section>

      <p class="pl-notice">${esc(MUSHROOMS_NOTICE)}</p>
    </div>`;

  // ---- search
  const form = q$<HTMLFormElement>(".pl-search");
  const input = q$<HTMLInputElement>(".pl-q");
  const sugg = q$<HTMLElement>(".pl-sugg");
  let shown: ReturnType<typeof searchItems> = [];
  function pick(it: { kind: "claim" | "atlas"; id: string }) {
    sugg.hidden = true; input.value = "";
    if (it.kind === "claim") api.openClaim(it.id, input);
    else if (byId(it.id)) api.openPlant(it.id);
    else api.openAtlas(it.id);
  }
  function renderSugg() {
    const q = input.value.trim().toLowerCase();
    const score = (it: ReturnType<typeof searchItems>[number]) => (it.kind === "atlas" ? 2 : 0) + (it.kind === "atlas" && byId(it.id) ? 2 : 0) + (it.title.toLowerCase().startsWith(q) ? 1 : 0);
    shown = searchItems(input.value, 40).sort((a, b) => score(b) - score(a)).slice(0, 6);
    if (!q) { sugg.hidden = true; return; }
    sugg.hidden = false;
    sugg.innerHTML = shown.length ? shown.map((it, i) => `<li role="option" data-i="${i}"><strong>${esc(it.title)}</strong><small>${esc(it.sub.replace("Encyclopedia", "Atlas").replace("Claim", "Aussage"))}</small></li>`).join("") : `<li class="none">Nichts gefunden. Dazu gibt es noch keinen Eintrag.</li>`;
  }
  input.addEventListener("input", renderSugg);
  input.addEventListener("blur", () => setTimeout(() => (sugg.hidden = true), 150));
  sugg.addEventListener("mousedown", (e) => { const li = (e.target as HTMLElement).closest<HTMLElement>("[data-i]"); if (li) { e.preventDefault(); pick(shown[Number(li.dataset.i)]); } });
  form.addEventListener("submit", (e) => { e.preventDefault(); renderSugg(); if (shown[0]) pick(shown[0]); });

  // ---- the grid of popular mushrooms, driven by the category or region filter
  const grid = q$<HTMLElement>(".pk-grid");
  function current(): { title: string; list: AtlasEntry[]; empty?: string } {
    if (filter.startsWith("region:")) {
      const r = REGIONS.find((x) => x.id === filter.slice(7))!;
      return { title: `Pilze aus ${r.name}`, list: mush.filter((e) => ORIGIN[e.id]?.includes(r.id)).sort((a, b) => rank(a) - rank(b)), empty: `Für ${r.name} ist im Atlas noch kein Pilz eingetragen.` };
    }
    const g = GROUPS.find((x) => x.id === filter);
    const base = g ? groupEntries(g.members, mush) : POPULAR.map(byId).filter((e): e is AtlasEntry => !!e);
    return { title: g ? g.title : "Beliebte Pilze", list: base.sort((a, b) => rank(a) - rank(b)), empty: g?.soon ? `${g.title} sind noch nicht im Atlas. Der Bereich ist in Vorbereitung.` : undefined };
  }
  function renderGrid() {
    const { title, list, empty } = current();
    q$(".pk-popular h2").textContent = title;
    q$<HTMLElement>(".pl-reset").hidden = filter === "alle";
    grid.innerHTML = list.length
      ? list.map((e) => `<button class="pk-card" data-plant="${e.id}">${itemImage(e, "pk-card-img", "✦")}<span><strong>${esc(e.name.replace(/\s*\(.*\)/, ""))}</strong><small>${esc(TAGLINE[e.id] ?? e.latin)}</small></span>${e.facts.some((f) => f.label === "Giftig") ? `<em class="pk-poison">giftig</em>` : ""}</button>`).join("")
      : `<p class="pl-none">${esc(empty ?? "Hier ist noch kein Eintrag.")}</p>`;
    mountSlots(grid);
    scroll.querySelectorAll<HTMLElement>("[data-group]").forEach((b) => { const o = b.dataset.group === filter; b.classList.toggle("on", o); b.setAttribute("aria-pressed", String(o)); });
    scroll.querySelectorAll<HTMLElement>("[data-region]").forEach((b) => b.setAttribute("aria-pressed", String(filter === `region:${b.dataset.region}`)));
  }

  // ---- the invisible kingdom
  function setNet(id: string) {
    netSel = netSel === id ? "" : id;
    const p = NETWORK.find((x) => x.id === netSel);
    const fig = q$<HTMLElement>(".pk-fig");
    if (p) fig.dataset.sel = p.id; else fig.removeAttribute("data-sel");
    scroll.querySelectorAll<HTMLElement>("[data-net]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.net === netSel)));
    scroll.querySelectorAll<SVGGElement>(".pk-lines [data-line]").forEach((g) => g.classList.toggle("on", g.dataset.line === netSel));
    const links = p?.atlas?.map(byId).filter((e): e is AtlasEntry => !!e).map(entryLink).join(" ") ?? "";
    q$(".pk-net-text").innerHTML = p
      ? `<h3>${esc(p.title)} <small>${esc(p.sub)}</small></h3><p>${esc(p.text)}</p>${links ? `<p class="pk-links">${links}</p>` : ""}${claimLine(p.claim)}${p.claim2 ? claimLine(p.claim2) : ""}`
      : `<p>${esc(NETWORK_INTRO)}</p>`;
  }

  function setLife(id: string) {
    lifeSel = lifeSel === id ? "" : id;
    const s = LIFECYCLE.find((x) => x.id === lifeSel);
    scroll.querySelectorAll<HTMLElement>("[data-life]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.life === lifeSel)));
    q$(".pk-life-text").innerHTML = s ? `<h3>${esc(s.title)} <small>${esc(s.sub)}</small></h3><p>${esc(s.text)}</p><p class="pk-claimline"><span class="pk-textbook">Lehrbuchwissen</span></p>` : "<p>Tippe auf eine Station des Kreislaufs.</p>";
  }

  function setGeo(id: string) {
    geoSel = geoSel === id ? "" : id;
    const g = GEO.find((x) => x.id === geoSel);
    scroll.querySelectorAll<HTMLElement>("[data-geo]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.geo === geoSel)));
    q$(".pk-geo-text").innerHTML = g ? `<h3>${esc(g.title)} <small>${esc(g.sub)}</small></h3><p>${esc(g.text)}</p>${claimLine(g.claim)}` : "<p>Tippe auf ein Thema. Die „432 Hz“ in der Abbildung sind die Zahl der Behauptung, kein Messwert.</p>";
  }

  function setArea(id: string) {
    healthSel = healthSel === id ? "" : id;
    const a = areas.find((x) => x.id === healthSel);
    scroll.querySelectorAll<HTMLElement>("[data-area]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.area === healthSel)));
    const box = q$(".pk-health-text");
    if (!a) { box.innerHTML = `<p>Tippe auf einen Körperbereich. ${esc(HEALTH_NOTE)}</p>`; return; }
    const hits = matches(a.words);
    box.innerHTML = `<h3>${esc(a.title)}</h3>` + (hits.length
      ? `<ul class="pk-hits">${hits.map(({ e, a: as }) => `<li>${entryLink(e)}<small>${esc(as.system)} · ${esc(as.target)} · ${esc(ORIGIN_LABEL[as.origin])}</small>${e.claims.map((c) => claimLine(c)).join("")}</li>`).join("")}</ul>`
      : `<p>Im Atlas ist dazu noch keine Zuordnung erfasst. Es steht hier nichts, was nicht aus einem Eintrag stammt.</p>`);
  }

  function setCompound(id: string) {
    compSel = id;
    const c = COMPOUNDS.find((x) => x.id === id)!;
    scroll.querySelectorAll<HTMLElement>("[data-ctab]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.ctab === c.tab)));
    scroll.querySelectorAll<HTMLElement>("[data-comp]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.comp === id)));
    const card = q$(".pk-comp-card");
    card.innerHTML = `${hasAsset(c.slot) ? `<div class="pk-comp-pic" data-slot="${c.slot}" data-fit="cover" aria-hidden="true"></div>` : ""}<h3>${esc(c.title)} <small>${esc(c.sub)}</small></h3><ul class="pk-bul">${c.bullets.map((b) => `<li>${ico("check")}${esc(b)}</li>`).join("")}</ul><p>${esc(c.text)}</p>${claimLine(c.claim)}`;
    mountSlots(card);
  }

  function setEco(id: string) {
    ecoSel = ecoSel === id ? "" : id;
    const x = ECOLOGY.find((e) => e.id === ecoSel);
    scroll.querySelectorAll<HTMLElement>("[data-eco]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.eco === ecoSel)));
    const box = q$(".pk-eco-text");
    box.innerHTML = x ? `${hasAsset(x.slot) ? `<div class="pk-eco-pic" data-slot="${x.slot}" data-fit="cover" aria-hidden="true"></div>` : ""}<h3>${esc(x.title)} <small>${esc(x.sub)}</small></h3><p>${esc(x.text)}</p>` : "<p>Tippe auf ein Thema.</p>";
    mountSlots(box);
  }

  // ---- the drawer under the grids (cultures, uses, research, all studies, all claims)
  const drawer = q$<HTMLElement>(".pk-drawer");
  let drawerKey = "";
  const smooth = (el: Element | null) => el?.scrollIntoView({ behavior: api.reduceMotion ? "auto" : "smooth", block: "start" });
  function openDrawer(key: string, title: string, body: string, actions = "") {
    if (drawerKey === key && !drawer.hidden) { closeDrawer(); return; }
    drawerKey = key; drawer.hidden = false;
    drawer.querySelector("h3")!.textContent = title;
    drawer.querySelector(".pk-drawer-body")!.innerHTML = body;
    drawer.querySelector(".pk-drawer-actions")!.innerHTML = `${actions}<button class="pl-ghost" data-close>Schließen</button>`;
    drawer.tabIndex = -1;
    smooth(drawer);
    drawer.focus({ preventScroll: true });
  }
  function closeDrawer() {
    drawerKey = ""; drawer.hidden = true;
    scroll.querySelectorAll<HTMLElement>("[data-cult], [data-app], [data-res]").forEach((b) => b.setAttribute("aria-pressed", "false"));
  }
  const mark = (el: HTMLElement | null) => { scroll.querySelectorAll<HTMLElement>("[data-cult], [data-app], [data-res]").forEach((b) => b.setAttribute("aria-pressed", String(b === el && !drawer.hidden))); };

  function cultureBody(id: string): string {
    const c = CULTURES.find((x) => x.id === id)!;
    const lines = c.entries.map(byId).filter((e): e is AtlasEntry => !!e).map((e) => `<li><strong>${esc(e.name.replace(/\s*\(.*\)/, ""))}</strong> ${esc(e.tradition)} ${entryLink(e)}</li>`).join("");
    return `<p>${esc(c.intro)}</p>${lines ? `<ul class="pk-quotes">${lines}</ul>` : ""}`;
  }
  function appBody(id: string): string {
    const a = APPLICATIONS.find((x) => x.id === id)!;
    let extra = "";
    if (a.lab) {
      const ids = new Set(mush.map((e) => e.id));
      const rec = RECIPES.filter((r) => r.ingredients.some((i) => ids.has(i.id)));
      extra = rec.length ? `<p>Rezepte der Werkbank mit Pilzen: ${rec.map((r) => `<strong>${esc(r.name)}</strong>`).join(", ")}.</p>` : `<p>Rezepte der Werkbank mit Pilzen folgen; bisher nennt keines der Rezepte einen Pilz des Atlas.</p>`;
    }
    return `<p>${esc(a.text)}</p>${extra}`;
  }
  function studiesBody(): string {
    const rows: { title: string; url: string; year?: number; from: string }[] = [];
    const seen = new Set<string>();
    const add = (title: string, url: string | undefined, year: number | undefined, from: string) => { if (url && !seen.has(url)) { seen.add(url); rows.push({ title, url, year, from }); } };
    for (const id of STUDY_CLAIMS) { const c = claimById(id); c?.sources.filter((s) => s.kind !== "editorial-input" && s.kind !== "interview").forEach((s) => add(s.title, s.url, s.year, `Quelle der Aussage „${c.short ?? c.id}“`)); }
    mush.forEach((e) => e.sources.forEach((s) => add(s.title, s.url, s.year, "Quelle der Atlas-Einträge")));
    add(STAT_SOURCE.label, STAT_SOURCE.url, 2023, "Quelle der Zahl der beschriebenen Arten");
    return rows.length ? `<ul class="pk-studies">${rows.map((r) => `<li><div><strong>${esc(r.title)}</strong><small>${r.year ? `Jahr ${r.year} · ` : ""}${esc(r.from)}, Source pending verification</small></div><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Ansehen ${ico("external")}</a></li>`).join("")}</ul>` : `<p>Noch keine Quellen mit Adresse erfasst.</p>`;
  }
  function allClaimsBody(): string {
    const ids = [...new Set([...mush.flatMap((e) => e.claims), ...STUDY_CLAIMS])];
    const list = ids.map(claimById).filter((c): c is Claim => !!c);
    return `<ul class="pk-claimlist">${list.map((c) => `<li><button data-claim="${c.id}"><span>${esc(c.short ?? c.statement)}</span>${chipFor(c.id)}</button></li>`).join("")}</ul>`;
  }

  // ---- clicks
  scroll.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) { api.openClaim(cl.dataset.claim!, cl); return; }
    if (t.closest("[data-close]")) { closeDrawer(); return; }
    const net = t.closest<HTMLElement>("[data-net]");
    if (net) { setNet(net.dataset.net!); return; }
    if (t.closest("[data-net-go]")) { if (netSel !== "netz") setNet("netz"); smooth(q$(".pk-net-text")); return; }
    const life = t.closest<HTMLElement>("[data-life]");
    if (life) { setLife(life.dataset.life!); return; }
    const geo = t.closest<HTMLElement>("[data-geo]");
    if (geo) { setGeo(geo.dataset.geo!); return; }
    const area = t.closest<HTMLElement>("[data-area]");
    if (area) { setArea(area.dataset.area!); return; }
    const ct = t.closest<HTMLElement>("[data-ctab]");
    if (ct) { const first = COMPOUNDS.find((c) => c.tab === ct.dataset.ctab)!; setCompound(first.id); return; }
    const cp = t.closest<HTMLElement>("[data-comp]");
    if (cp) { setCompound(cp.dataset.comp!); return; }
    const eco = t.closest<HTMLElement>("[data-eco]");
    if (eco) { setEco(eco.dataset.eco!); return; }
    const cult = t.closest<HTMLElement>("[data-cult]");
    if (cult) {
      const c = CULTURES.find((x) => x.id === cult.dataset.cult)!;
      openDrawer(`cult:${c.id}`, c.title, cultureBody(c.id), c.goto ? `<button class="pl-ghost" data-cultures>Alte Kulturen öffnen <span aria-hidden="true">→</span></button>` : "");
      mark(cult); return;
    }
    const app = t.closest<HTMLElement>("[data-app]");
    if (app) {
      const a = APPLICATIONS.find((x) => x.id === app.dataset.app)!;
      openDrawer(`app:${a.id}`, a.title, appBody(a.id), a.lab ? `<button class="pl-ghost" data-lab>Zur Werkbank <span aria-hidden="true">→</span></button>` : "");
      mark(app); return;
    }
    const res = t.closest<HTMLElement>("[data-res]");
    if (res) {
      const r = RESEARCH.find((x) => x.id === res.dataset.res)!;
      openDrawer(`res:${r.id}`, r.title, `<p>${esc(r.text)}</p>${r.claim ? claimLine(r.claim) : ""}`);
      mark(res); return;
    }
    if (t.closest("[data-studies]")) { openDrawer("studies", "Quellen", studiesBody()); mark(null); return; }
    if (t.closest("[data-allclaims]")) { openDrawer("claims", "Alle Aussagen zu Pilzen", allClaimsBody()); mark(null); return; }
    const grp = t.closest<HTMLElement>("[data-group]");
    if (grp) { filter = filter === grp.dataset.group ? "alle" : grp.dataset.group!; renderGrid(); smooth(q$(".pk-popular")); return; }
    const reg = t.closest<HTMLElement>("[data-region]");
    if (reg) { const f = `region:${reg.dataset.region}`; filter = filter === f ? "alle" : f; renderGrid(); smooth(q$(".pk-popular")); return; }
    const pl = t.closest<HTMLElement>("[data-plant]");
    if (pl) { api.openPlant(pl.dataset.plant!); return; }
    if (t.closest(".pl-reset")) { filter = "alle"; renderGrid(); return; }
    if (t.closest("[data-allcats]")) { filter = "alle"; renderGrid(); smooth(q$(".pk-popular")); return; }
    if (t.closest("[data-all]")) { api.openAtlas(); return; }
    if (t.closest("[data-world]")) { smooth(q$(".pl-map")); q$<HTMLElement>(".pl-pin").focus({ preventScroll: true }); return; }
    if (t.closest("[data-freq]")) { api.openFreq(); return; }
    if (t.closest("[data-lab]")) { api.openLab(); return; }
    if (t.closest("[data-cultures]")) { api.openCultures(); return; }
    if (t.closest('[data-act="plants"]')) api.openPlants();
  });

  // ---- world map drawn from the land dots (Natural Earth, public domain) unless a map picture exists
  const cv = q$<HTMLCanvasElement>(".pl-map-cv");
  const mapBox = q$<HTMLElement>(".pl-map");
  function drawMap() {
    q$<HTMLElement>(".pl-map-bg").hidden = !hasAsset("pilz-map");
    if (hasAsset("pilz-map")) { cv.hidden = true; return; }
    cv.hidden = false;
    const r = mapBox.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    const g = cv.getContext("2d")!;
    g.scale(dpr, dpr);
    g.clearRect(0, 0, r.width, r.height);
    const rad = Math.max(1.1, r.width / 440);
    for (const [la, lo] of dots as [number, number][]) {
      const lat = la / 10, lon = lo / 10;
      if (lat > 78 || lat < -58) continue;
      g.fillStyle = "rgba(226, 170, 96, 0.6)";
      g.fillRect(((lon + 180) / 360) * r.width - rad / 2, ((78 - lat) / 136) * r.height - rad / 2, rad, rad);
    }
  }
  new ResizeObserver(drawMap).observe(mapBox);

  mountSlots(scroll);
  renderGrid();
  setCompound(compSel);
  return {
    start() { requestAnimationFrame(drawMap); },
    stop() { sugg.hidden = true; },
  };
}
