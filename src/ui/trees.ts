import { atlas } from "../data/atlas";
import { claims } from "../data/claims";
import { LEVEL_LABEL, type AtlasEntry, type Claim } from "../data/types";
import { ORIGIN, REGIONS, type Region } from "../data/plants";
import { ALL_MEMBERS, BENEFITS, ECO, ECO_TEXT, ENERGY, GLANCE, GLANCE_NOTE, GROUPS, KNOWN_SPECIES, LEVELS, OLDEST, POPULAR, STAT_SOURCE, SYSTEM, TAGLINE, TOPICS, TREES_NOTICE, groupEntries } from "../data/trees";
import dots from "../data/landdots.json";
import { hasAsset, mountSlots } from "../assets/slots";
import { searchItems } from "./search";
import { esc } from "./dossierParts";
import { ico } from "./icons";
import { itemImage, ph } from "./landing";
import { torusSvg, treeSystemSvg } from "./plantArt";

export interface TreesApi {
  reduceMotion: boolean;
  /** the profile page of one entry (opened from this page, so "back" leads here) */
  openPlant(id: string): void;
  /** the 3D atlas: with an id that entry is selected, without the category of trees opens */
  openAtlas(id?: string): void;
  openCultures(): void;
  openPlants(): void;
  openClaim(id: string, from: HTMLElement): void;
}

const all: AtlasEntry[] = atlas.filter((e) => e.category !== "kristall");
const trees: AtlasEntry[] = groupEntries(ALL_MEMBERS, all);
const byId = (id: string) => trees.find((e) => e.id === id);
const claimById = (id: string): Claim | undefined => claims.find((c) => c.id === id);
const rank = (e: AtlasEntry) => { const i = POPULAR.indexOf(e.id); return i < 0 ? 999 : i; };
const nf = (n: number) => n.toLocaleString("de-DE");
const SHORT: Record<string, string> = { claimed: "Behauptung · ungeprüft", hypothesis: "Hypothese", supported: "Belegt, Deutung offen", established: "Gesichert" };
const chipFor = (id?: string) => {
  const c = id ? claimById(id) : undefined;
  return c ? `<span class="pp-lvl" style="--c:var(--lvl-${c.level})" title="${esc(LEVEL_LABEL[c.level])}">${esc(SHORT[c.level] ?? LEVEL_LABEL[c.level])}</span>` : "";
};

/**
 * The "Baum Atlas" landing page: hero with search and "at a glance", nine categories, the tree as a living system (a diagram with
 * seven clickable parts), energy flow and geometry with their evidence levels, four levels of knowledge, a world map, popular and
 * oldest trees, the tree as an ecosystem, what trees do for the earth and three topic cards. Numbers come from the atlas or name
 * their source; symbolic readings carry the evidence level of their claim.
 */
export function initTrees(root: HTMLElement, api: TreesApi) {
  const scroll = root.querySelector<HTMLElement>(".pl-scroll")!;
  let filter = "alle"; // "alle", a group id or "region:<id>"
  let sysSel = "";
  const q$ = <T extends HTMLElement>(s: string) => scroll.querySelector<T>(s)!;
  const regionCount = (r: Region) => trees.filter((e) => ORIGIN[e.id]?.includes(r)).length;
  const regionsUsed = REGIONS.filter((r) => regionCount(r.id) > 0).length;
  const stat = (n: string | number, l: string) => `<div><dd>${n}</dd><dt>${l}</dt></div>`;
  const treeCount = groupEntries(["category:baum"], all).length;

  scroll.innerHTML = `
    <div class="pl-hero bm-hero">
      <div class="pl-hero-bg" data-slot="baum-hero" data-fit="cover" data-eager="true"></div>
      ${hasAsset("baum-hero") ? "" : `<div class="pl-hero-alt og-hero-alt" data-slot="tile-baeume" data-fit="cover" aria-hidden="true"></div>`}
      <div class="pl-hero-text">
        <nav class="og-crumbs" aria-label="Pfad"><button data-act="plants">Natur</button><i>›</i><span>Bäume</span><i>›</i><strong>Baum Atlas</strong></nav>
        <h1>Baum Atlas</h1>
        <p class="bm-tag">Die lebende Architektur zwischen Erde und Himmel.</p>
        <p class="pl-lead">Entdecke die faszinierende Welt der Bäume. Ihre Arten, Lebenszyklen, Ökosysteme, Inhaltsstoffe, kulturelle Bedeutung und ihre zentrale Rolle für das Leben auf der Erde. Jede Aussage mit Quelle und Belegstufe.</p>
        <form class="pl-search" role="search" autocomplete="off">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/></svg>
          <input type="search" class="pl-q" placeholder="Baum, Art, Region, Holz, z. B. Eiche, Zeder …" aria-label="Bäume durchsuchen">
          <button type="submit" aria-label="Suchen"><span aria-hidden="true">→</span></button>
          <ul class="pl-sugg" role="listbox" hidden></ul>
        </form>
        <dl class="pl-stats">
          ${stat(nf(KNOWN_SPECIES), `Baumarten weltweit bekannt (<a href="${STAT_SOURCE.url}" target="_blank" rel="noopener noreferrer">BGCI</a>)`)}
          ${stat(treeCount, "Bäume im Atlas")}
          ${stat(regionsUsed, "Regionen der Erde")}
          ${stat(LEVELS.length, "Wissensebenen: Wissenschaft, Tradition, Geometrie, Symbolik")}
          <div class="wide"><dd>∞</dd><dt>Alles ist verbunden</dt></div>
        </dl>
      </div>
      <aside class="bm-glance" aria-label="Auf einen Blick">
        <h2>Auf einen Blick</h2>
        <ul>${GLANCE.map((g) => `<li><i>${ico(g.icon)}</i>${esc(g.text)}</li>`).join("")}</ul>
        <p>${esc(GLANCE_NOTE)}</p>
      </aside>
    </div>

    <div class="pl-wrap">
      <section class="og-cats" aria-labelledby="bm-cat-h">
        <div class="pl-head"><div><h2 id="bm-cat-h">Baum Kategorien</h2><p class="pl-sub">Entdecke die Vielfalt der Bäume nach Eigenschaften, Lebensräumen und Verwendung.</p></div><button class="pl-all" data-allcats>Alle Kategorien anzeigen <span aria-hidden="true">→</span></button></div>
        <div class="bm-cat-row">${GROUPS.map((g) => `<button class="bm-cat${g.soon ? " soon" : ""}" data-group="${g.id}" ${g.soon ? 'aria-disabled="true"' : ""} aria-pressed="false">
          ${ph(g.slot, "bm-cat-img", g.icon, g.tint)}<span><strong>${esc(g.title)}</strong><small>${g.soon ? "in Vorbereitung" : esc(g.sub)}</small></span></button>`).join("")}</div>
      </section>

      <div class="bm-grid2">
        <section class="pl-panel bm-system" aria-labelledby="bm-sys-h">
          <h2 class="pl-h-sm" id="bm-sys-h">Der Baum als lebendiges System</h2>
          <p class="pl-sub">Ein komplexer Kreislauf aus Licht, Wasser, Nährstoffen und Energie. Tippe auf einen Teil.</p>
          <div class="bm-fig">
            <div class="bm-fig-art">${hasAsset("baum-system") ? `<div class="bm-fig-img" data-slot="baum-system" data-fit="cover" data-alt="Der Baum als lebendiges System"></div>` : treeSystemSvg("bms")}</div>
            <svg class="bm-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${SYSTEM.map((p) => {
              const ax = p.side === "l" ? p.at[0] + 22 : p.at[0] - 0.5, ay = p.at[1] + 5;
              return `<g data-line="${p.id}"><line x1="${ax}" y1="${ay}" x2="${p.to[0]}" y2="${p.to[1]}"/><circle cx="${p.to[0]}" cy="${p.to[1]}" r="1"/></g>`;
            }).join("")}</svg>
            <ul class="bm-calls">${SYSTEM.map((p) => `<li style="left:${p.at[0]}%;top:${p.at[1]}%"><button class="bm-call ${p.side}" data-sys="${p.id}" aria-pressed="false"><i>${ico(p.icon)}</i><span><strong>${esc(p.title)}</strong><small>${esc(p.sub)}</small></span></button></li>`).join("")}</ul>
          </div>
          <div class="bm-sys-text" aria-live="polite"><p>Tippe auf Sonnenlicht, CO₂, Blätter, Stamm, Wurzeln oder den Boden: Das Bild hebt den Weg hervor, und hier steht die Erklärung.</p></div>
        </section>

        <div class="bm-stack">
          <section class="pl-panel bm-energy" aria-labelledby="bm-en-h">
            <h2 class="pl-h-sm" id="bm-en-h">Energiefluss &amp; Geometrie</h2>
            <p class="pl-sub">Der Baum als Verbindung zwischen Erde und Himmel.</p>
            <div class="bm-en-grid">
              <div class="bm-torus">${hasAsset("baum-torus") ? `<div class="bm-torus-img" data-slot="baum-torus" data-fit="cover" aria-hidden="true"></div>` : torusSvg("bmt")}</div>
              <ul class="bm-en-list" role="group" aria-label="Thema wählen">${ENERGY.map((x) => `<li><button data-en="${x.id}" aria-pressed="false"><i>${ico(x.icon)}</i><span><strong>${esc(x.title)}</strong>${x.sub ? `<small>${esc(x.sub)}</small>` : ""}</span></button></li>`).join("")}</ul>
            </div>
            <div class="bm-en-text" aria-live="polite"><p>Tippe auf ein Thema. Gemessenes (Licht, Wasser, Signale) steht neben Symbolischem (Torus, Goldener Schnitt), das seine Belegstufe zeigt.</p></div>
          </section>
          <section class="pl-panel bm-levels" aria-labelledby="bm-lv-h">
            <h2 class="pl-h-sm" id="bm-lv-h">Wissensebenen</h2>
            <p class="pl-sub">Verschiedene Perspektiven auf den Baum.</p>
            <div class="bm-lv-row" role="group" aria-label="Wissensebene">${LEVELS.map((l) => `<button class="bm-lv" data-level="${l.id}" aria-pressed="false">${ph(l.slot, "bm-lv-img", l.icon, "#58a8a3")}<span><strong>${esc(l.title)}</strong><small>${esc(l.sub)}</small></span></button>`).join("")}</div>
            <div class="bm-lv-text" aria-live="polite"><p>Jede Ebene hat ihre eigene Art von Aussagen. Tippe auf eine Ebene, um zu sehen, welche Belegstufe dort üblich ist.</p></div>
          </section>
        </div>
      </div>

      <div class="bm-grid3">
        <section class="pl-world bm-world" aria-labelledby="bm-w-h">
          <div class="pl-world-text"><h2 id="bm-w-h">Bäume der Welt</h2><p>Entdecke, welche Bäume in den verschiedenen Regionen wachsen.</p><button class="pl-ghost" data-world>Weltkarte erkunden <span aria-hidden="true">→</span></button></div>
          <div class="pl-map" role="group" aria-label="Weltkarte mit Herkunftsregionen"><div class="pl-map-bg" data-slot="baum-map" data-fit="cover"></div><canvas class="pl-map-cv" aria-hidden="true"></canvas>${REGIONS.map((r) => `<button class="pl-pin" data-region="${r.id}" style="left:${(((r.lon + 180) / 360) * 100).toFixed(1)}%;top:${(((78 - r.lat) / 136) * 100).toFixed(1)}%" aria-pressed="false"><b>${regionCount(r.id)}</b><span>${esc(r.name)}</span></button>`).join("")}</div>
        </section>
        <section class="pl-popular bm-popular" aria-labelledby="bm-pop-h">
          <div class="pl-head"><div><h2 id="bm-pop-h">Beliebte Bäume</h2><p class="pl-sub">Die bekanntesten und faszinierendsten Baumarten. Das Stichwort ist ein sachlicher Hinweis, keine Deutung.</p></div><div class="pl-head-r"><button class="pl-reset" hidden>Filter zurücksetzen</button><button class="pl-all" data-all>Alle Bäume anzeigen <span aria-hidden="true">→</span></button></div></div>
          <div class="bm-grid" tabindex="-1"></div>
        </section>
      </div>

      <div class="bm-grid4">
        <section class="pl-panel bm-oldest" aria-labelledby="bm-old-h">
          <h2 class="pl-h-sm" id="bm-old-h">Die ältesten Bäume der Welt</h2>
          <p class="pl-sub">Zeugen der Zeit, Jahrhunderte und Jahrtausende alt. Alter sind Schätzungen.</p>
          <div class="pl-row-wrap"><div class="bm-old-row" tabindex="-1">${OLDEST.map((o) => `<button class="bm-old" data-old="${o.id}" aria-pressed="false">${ph(`baum-old-${o.id}`, "bm-old-img", "tree", "#8a6a3a")}<span><strong>${esc(o.name)}</strong><small>${esc(o.age)}</small></span></button>`).join("")}</div><button class="pl-next" aria-label="Weiter"><span aria-hidden="true">›</span></button></div>
          <div class="bm-old-text" aria-live="polite"><p>Tippe auf einen Baum für die Einordnung des Alters.</p></div>
        </section>
        <section class="pl-panel bm-eco" aria-labelledby="bm-eco-h">
          ${ph("baum-oeko", "bm-eco-img", "tree", "#4a7a3a")}
          <div class="bm-eco-body">
            <h2 class="pl-h-sm" id="bm-eco-h">Ein Baum ist ein ganzes Ökosystem</h2>
            <p class="pl-sub">Lebensraum für unzählige Lebewesen.</p>
            <ul class="bm-eco-list">${ECO.map((x) => `<li><i>${ico(x.icon)}</i><span><strong>${esc(x.title)}</strong><small>${esc(x.sub)}</small></span></li>`).join("")}</ul>
            <button class="pl-ghost" data-eco aria-expanded="false">Ökosystem entdecken <span aria-hidden="true">→</span></button>
            <p class="bm-eco-text" hidden>${esc(ECO_TEXT)}</p>
          </div>
        </section>
      </div>

      <div class="bm-foot">
        <section class="pl-panel bm-benefits" aria-labelledby="bm-ben-h">
          <h2 class="pl-h-sm" id="bm-ben-h">Was der Baum für die Erde leistet</h2>
          <ul class="bm-ben-grid">${BENEFITS.map((b) => `<li><i>${ico(b.icon)}</i><span>${esc(b.title)}</span></li>`).join("")}</ul>
        </section>
        ${TOPICS.map((t) => `<section class="pl-panel bm-topic" aria-labelledby="bm-t-${t.id}"><h2 class="pl-h-sm" id="bm-t-${t.id}">${esc(t.title)}</h2><p class="pl-sub">${esc(t.sub)}</p><div class="bm-topic-box">${ph(t.slot, "bm-topic-img", t.icon, "#9a7a4a")}</div><button class="pl-ghost" data-topic="${t.id}" aria-expanded="false">${esc(t.button)} <span aria-hidden="true">→</span></button></section>`).join("")}
      </div>
      <section class="bm-drawer" hidden aria-live="polite"><h3></h3><p></p><div class="bm-drawer-actions"></div></section>

      <p class="pl-notice">${esc(TREES_NOTICE)}</p>
    </div>`;

  // ---- search
  const form = q$<HTMLFormElement>(".pl-search");
  const input = q$<HTMLInputElement>(".pl-q");
  const sugg = q$<HTMLElement>(".pl-sugg");
  let shown: ReturnType<typeof searchItems> = [];
  function pick(it: { kind: "claim" | "atlas"; id: string }) {
    sugg.hidden = true; input.value = "";
    if (it.kind === "claim") api.openClaim(it.id, input);
    else if (all.some((e) => e.id === it.id)) api.openPlant(it.id);
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

  // ---- the grid of popular trees, driven by the category or region filter
  const grid = q$<HTMLElement>(".bm-grid");
  function current(): { title: string; list: AtlasEntry[]; empty?: string } {
    if (filter.startsWith("region:")) {
      const r = REGIONS.find((x) => x.id === filter.slice(7))!;
      return { title: `Bäume aus ${r.name}`, list: trees.filter((e) => ORIGIN[e.id]?.includes(r.id)).sort((a, b) => rank(a) - rank(b)) };
    }
    const g = GROUPS.find((x) => x.id === filter);
    const base = g ? groupEntries(g.members, all) : POPULAR.map(byId).filter((e): e is AtlasEntry => !!e);
    return { title: g ? g.title : "Beliebte Bäume", list: base.sort((a, b) => rank(a) - rank(b)), empty: g?.soon ? `${g.title} sind noch nicht im Atlas. Der Bereich ist in Vorbereitung.` : undefined };
  }
  function renderGrid() {
    const { title, list, empty } = current();
    q$(".bm-popular h2").textContent = title;
    q$<HTMLElement>(".pl-reset").hidden = filter === "alle";
    grid.innerHTML = list.length
      ? list.map((e) => `<button class="bm-tree" data-plant="${e.id}">${itemImage(e, "bm-tree-img")}<span><strong>${esc(e.name)}</strong><small>${esc(TAGLINE[e.id] ?? e.latin)}</small></span></button>`).join("")
      : `<p class="pl-none">${esc(empty ?? "Hier ist noch kein Eintrag.")}</p>`;
    mountSlots(grid);
    scroll.querySelectorAll<HTMLElement>("[data-group]").forEach((b) => { const o = b.dataset.group === filter; b.classList.toggle("on", o); b.setAttribute("aria-pressed", String(o)); });
    scroll.querySelectorAll<HTMLElement>("[data-region]").forEach((b) => b.setAttribute("aria-pressed", String(filter === `region:${b.dataset.region}`)));
  }

  // ---- the living-system diagram
  function setSystem(id: string) {
    sysSel = sysSel === id ? "" : id;
    const p = SYSTEM.find((x) => x.id === sysSel);
    const fig = q$<HTMLElement>(".bm-fig");
    if (p) fig.dataset.sel = p.flow; else fig.removeAttribute("data-sel");
    scroll.querySelectorAll<HTMLElement>("[data-sys]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.sys === sysSel)));
    scroll.querySelectorAll<SVGGElement>(".bm-lines [data-line]").forEach((g) => g.classList.toggle("on", g.dataset.line === sysSel));
    const box = q$<HTMLElement>(".bm-sys-text");
    box.innerHTML = p
      ? `<h3>${esc(p.title)}</h3><p>${esc(p.text)}</p>${p.claim ? `<p class="bm-claimline">${chipFor(p.claim)} <button class="pl-link" data-claim="${p.claim}">Aussage und Quellen</button></p>` : ""}`
      : `<p>Tippe auf Sonnenlicht, CO₂, Blätter, Stamm, Wurzeln oder den Boden: Das Bild hebt den Weg hervor, und hier steht die Erklärung.</p>`;
  }

  function setEnergy(id: string) {
    const x = ENERGY.find((e) => e.id === id)!;
    scroll.querySelectorAll<HTMLElement>("[data-en]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.en === id)));
    q$(".bm-en-text").innerHTML = `<h3>${esc(x.title)}${x.sub ? ` <small>${esc(x.sub)}</small>` : ""}</h3><p>${esc(x.text)}</p>${x.claim ? `<p class="bm-claimline">${chipFor(x.claim)} <button class="pl-link" data-claim="${x.claim}">Aussage und Quellen</button></p>` : `<p class="bm-claimline"><span class="bm-textbook">Lehrbuchwissen</span></p>`}`;
  }

  // ---- clicks
  const smooth = (el: Element | null) => el?.scrollIntoView({ behavior: api.reduceMotion ? "auto" : "smooth", block: "start" });
  const drawer = q$<HTMLElement>(".bm-drawer");
  scroll.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) { api.openClaim(cl.dataset.claim!, cl); return; }
    const sys = t.closest<HTMLElement>("[data-sys]");
    if (sys) { setSystem(sys.dataset.sys!); return; }
    const en = t.closest<HTMLElement>("[data-en]");
    if (en) { setEnergy(en.dataset.en!); return; }
    const lv = t.closest<HTMLElement>("[data-level]");
    if (lv) {
      const l = LEVELS.find((x) => x.id === lv.dataset.level)!;
      scroll.querySelectorAll<HTMLElement>("[data-level]").forEach((b) => b.setAttribute("aria-pressed", String(b === lv)));
      q$(".bm-lv-text").innerHTML = `<h3>${esc(l.title)}</h3><p>${esc(l.text)}</p><p class="bm-claimline"><span class="bm-textbook">${esc(l.level)}</span></p>`;
      return;
    }
    const old = t.closest<HTMLElement>("[data-old]");
    if (old) {
      const o = OLDEST.find((x) => x.id === old.dataset.old)!;
      scroll.querySelectorAll<HTMLElement>("[data-old]").forEach((b) => b.setAttribute("aria-pressed", String(b === old)));
      q$(".bm-old-text").innerHTML = `<h3>${esc(o.name)} <small>${esc(o.age)}</small></h3><p>${esc(o.text)}</p>`;
      return;
    }
    const grp = t.closest<HTMLElement>("[data-group]");
    if (grp) { filter = filter === grp.dataset.group ? "alle" : grp.dataset.group!; renderGrid(); if (grp.getAttribute("aria-disabled") !== "true") smooth(q$(".bm-popular")); return; }
    const reg = t.closest<HTMLElement>("[data-region]");
    if (reg) { const f = `region:${reg.dataset.region}`; filter = filter === f ? "alle" : f; renderGrid(); smooth(q$(".bm-popular")); return; }
    const pl = t.closest<HTMLElement>("[data-plant]");
    if (pl) { api.openPlant(pl.dataset.plant!); return; }
    const tp = t.closest<HTMLElement>("[data-topic]");
    if (tp) {
      const x = TOPICS.find((k) => k.id === tp.dataset.topic)!;
      const open = tp.getAttribute("aria-expanded") !== "true";
      scroll.querySelectorAll<HTMLElement>("[data-topic]").forEach((b) => b.setAttribute("aria-expanded", String(b === tp && open)));
      drawer.hidden = !open;
      if (open) {
        drawer.querySelector("h3")!.textContent = x.title;
        drawer.querySelector("p")!.textContent = x.text;
        drawer.querySelector(".bm-drawer-actions")!.innerHTML = x.id === "kultur" ? `<button class="pl-ghost" data-cultures>Alte Kulturen öffnen <span aria-hidden="true">→</span></button>` : x.id === "forschung" ? `<a class="pl-ghost" href="${STAT_SOURCE.url}" target="_blank" rel="noopener noreferrer">${esc(STAT_SOURCE.label)} ${ico("external")}</a><button class="pl-ghost" data-claim="baum-gefaehrdung">Aussage und Quellen</button>` : "";
        smooth(drawer);
      }
      return;
    }
    if (t.closest("[data-eco]")) {
      const btn = t.closest<HTMLElement>("[data-eco]")!, txt = q$(".bm-eco-text"), open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open)); txt.hidden = !open;
      return;
    }
    if (t.closest(".pl-reset")) { filter = "alle"; renderGrid(); return; }
    if (t.closest("[data-allcats]")) { filter = "alle"; renderGrid(); smooth(q$(".bm-popular")); return; }
    if (t.closest("[data-all]")) { api.openAtlas(); return; }
    if (t.closest(".pl-next")) { const r = q$(".bm-old-row"); r.scrollBy({ left: r.clientWidth * 0.8, behavior: api.reduceMotion ? "auto" : "smooth" }); return; }
    if (t.closest("[data-world]")) { smooth(q$(".pl-map")); q$<HTMLElement>(".pl-pin").focus({ preventScroll: true }); return; }
    if (t.closest("[data-cultures]")) { api.openCultures(); return; }
    if (t.closest('[data-act="plants"]')) api.openPlants();
  });

  // ---- world map drawn from the land dots (Natural Earth, public domain) unless a map picture exists
  const cv = q$<HTMLCanvasElement>(".pl-map-cv");
  const mapBox = q$<HTMLElement>(".pl-map");
  function drawMap() {
    q$<HTMLElement>(".pl-map-bg").hidden = !hasAsset("baum-map");
    if (hasAsset("baum-map")) { cv.hidden = true; return; }
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
      g.fillStyle = "rgba(150, 200, 130, 0.62)";
      g.fillRect(((lon + 180) / 360) * r.width - rad / 2, ((78 - lat) / 136) * r.height - rad / 2, rad, rad);
    }
  }
  new ResizeObserver(drawMap).observe(mapBox);

  mountSlots(scroll);
  renderGrid();
  return {
    start() { requestAnimationFrame(drawMap); },
    stop() { sugg.hidden = true; },
  };
}
