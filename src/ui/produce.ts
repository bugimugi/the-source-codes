import { atlas } from "../data/atlas";
import { CATEGORY_LABEL, type AtlasCategory, type AtlasEntry } from "../data/types";
import { ORIGIN, REGIONS, type Region } from "../data/plants";
import { ALL_MEMBERS, BODY_ROWS, CUISINES, GROUPS, HERO_POINTS, NUTRIENT_CARDS, POPULAR, PRODUCE_NOTICE, RECIPE_CARDS, SEASONS, TAGLINE, groupEntries } from "../data/produce";
import dots from "../data/landdots.json";
import { hasAsset, mountSlots } from "../assets/slots";
import { searchItems } from "./search";
import { esc } from "./dossierParts";
import { ico } from "./icons";

export interface ProduceApi {
  reduceMotion: boolean;
  /** the profile page of one entry (opened from this page, so "back" leads here) */
  openPlant(id: string): void;
  openAtlas(category: AtlasCategory | null, id?: string): void;
  openBody(organ?: string): void;
  openNutrients(): void;
  openLab(): void;
  openUniverse(): void;
  openPlants(): void;
  openClaim(id: string, from: HTMLElement): void;
}

const all: AtlasEntry[] = atlas.filter((e) => e.category !== "kristall");
const items: AtlasEntry[] = (() => {
  const out: AtlasEntry[] = [];
  for (const e of [...all.filter((x) => x.category === "obst"), ...all.filter((x) => x.category === "gemuese"), ...ALL_MEMBERS.filter((m) => !m.startsWith("category:")).map((id) => all.find((x) => x.id === id)!)]) if (e && !out.includes(e)) out.push(e);
  return out;
})();
const byId = (id: string) => items.find((e) => e.id === id);
const rank = (e: AtlasEntry) => { const i = POPULAR.indexOf(e.id); return i < 0 ? 999 : i; };
const count = (members: string[]) => groupEntries(members, all).length;

/** a picture slot when the file exists, else a tinted placeholder with an icon (same box) */
function ph(slot: string, cls: string, icon: string, tint: string): string {
  return hasAsset(slot)
    ? `<div class="${cls}" data-slot="${slot}" data-fit="cover" data-sizes="(max-width: 700px) 40vw, 14vw"></div>`
    : `<div class="${cls} og-ph" style="--tint:${tint}">${ico(icon, "big")}</div>`;
}

/** the card picture: own atlas image, else the glowing nutrient motif, else the glyph placeholder */
function itemImage(e: AtlasEntry): string {
  const own = `atlas-${e.id}`, nut = `nutrient-${e.id}`;
  const name = hasAsset(own) ? own : hasAsset(nut) ? nut : own;
  return `<div class="pl-card-img${hasAsset(name) ? "" : " atlas-fallback"}" data-slot="${name}" data-fit="cover" data-sizes="(max-width: 700px) 40vw, 12vw" style="--tint:${e.model.color}" data-glyph="✿"></div>`;
}

/**
 * The "Obst & Gemüse Atlas" landing page: search, 16 categories, popular entries, world regions with a map and a season calendar,
 * nutrients, body areas, cuisines, recipes and a small knowledge network. Everything counted comes from the atlas; every entry opens
 * its profile page. The page makes no health statements: keywords under the entries are ingredients, body areas link to the body page.
 */
export function initProduce(root: HTMLElement, api: ProduceApi) {
  const scroll = root.querySelector<HTMLElement>(".pl-scroll")!;
  let filter = "alle"; // "alle", a group id, "region:<id>", "kueche:<id>" or "saison:<id>"
  const q$ = <T extends HTMLElement>(s: string) => scroll.querySelector<T>(s)!;

  const regionCount = (r: Region) => items.filter((e) => ORIGIN[e.id]?.includes(r)).length;
  const regionsUsed = REGIONS.filter((r) => regionCount(r.id) > 0).length;
  const nuts = groupEntries(["walnuss"], all).length;
  const obstOnly = items.filter((e) => e.category === "obst").length - nuts;
  const stat = (n: string | number, l: string) => `<div><dd>${n}</dd><dt>${l}</dt></div>`;
  const month = new Date().getMonth();
  const nowSeason = month >= 2 && month <= 4 ? "fruehling" : month >= 5 && month <= 7 ? "sommer" : month >= 8 && month <= 10 ? "herbst" : "winter";

  scroll.innerHTML = `
    <div class="pl-hero og-hero">
      <div class="pl-hero-bg" data-slot="obst-hero" data-fit="cover" data-eager="true"></div>
      ${hasAsset("obst-hero") ? "" : `<div class="pl-hero-alt og-hero-alt" data-slot="tile-gemuese-obst" data-fit="cover" aria-hidden="true"></div>`}
      <div class="pl-hero-text">
        <nav class="og-crumbs" aria-label="Pfad"><button data-act="plants">Pflanzenatlas</button><i>›</i><strong>Obst &amp; Gemüse</strong></nav>
        <h1>Obst &amp; Gemüse<br>Atlas</h1>
        <p class="pl-lead">Entdecke die Vielfalt von Früchten, Gemüse und essbaren Pflanzen. Ihre Nährstoffe, überlieferten Anwendungen und ihre Rolle in verschiedenen Kulturen. Jede Aussage mit Quelle und Belegstufe.</p>
        <form class="pl-search" role="search" autocomplete="off">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/></svg>
          <input type="search" class="pl-q" placeholder="Obst, Gemüse, Nährstoffe, z. B. Apfel, Tomate …" aria-label="Obst und Gemüse durchsuchen">
          <button type="submit" aria-label="Suchen"><span aria-hidden="true">→</span></button>
          <ul class="pl-sugg" role="listbox" hidden></ul>
        </form>
        <dl class="pl-stats">
          ${stat(obstOnly, "Obst & Früchte im Atlas")}
          ${stat(count(["category:gemuese"]), "Gemüsearten im Atlas")}
          ${stat(count(["heidelbeere", "walnuss"]), "Beeren & Nüsse")}
          ${stat(count(["linsen"]), "Hülsenfrüchte")}
          <div class="wide"><dd>Weltweit</dd><dt>aus ${regionsUsed} Regionen der Erde</dt></div>
        </dl>
      </div>
      <aside class="pl-quote og-card" aria-label="Natürliche Nahrung">
        <div class="og-sketch" data-slot="obst-sketch" data-fit="cover" aria-hidden="true"></div>
        <h2>Natürliche Nahrung</h2>
        <p>Vielfalt aus aller Welt, geordnet nach Pflanzen, Inhaltsstoffen und Kulturen.</p>
        <ul>${HERO_POINTS.map((t) => `<li>${ico("check")}${esc(t)}</li>`).join("")}</ul>
      </aside>
    </div>

    <div class="pl-wrap">
      <section class="og-cats" aria-labelledby="og-cat-h">
        <div class="pl-head"><div><h2 id="og-cat-h">Obst &amp; Gemüse Kategorien</h2><p class="pl-sub">Entdecke die Vielfalt nach Gruppen, Eigenschaften und Verwendung.</p></div><button class="pl-all" data-allcats>Alle Kategorien anzeigen <span aria-hidden="true">→</span></button></div>
        <div class="og-cat-row">${GROUPS.map((g) => `<button class="pl-cat og-cat${g.soon ? " soon" : ""}" data-group="${g.id}" ${g.soon ? 'aria-disabled="true"' : ""} aria-pressed="false">
          ${ph(g.slot, "pl-cat-img", g.icon, g.tint)}
          <span><strong>${esc(g.title)}</strong><small>${g.soon ? "in Vorbereitung" : esc(g.sub)}</small></span></button>`).join("")}</div>
      </section>

      <section class="pl-popular" aria-labelledby="og-pop-h">
        <div class="pl-head"><div><h2 id="og-pop-h">Beliebte Obst &amp; Gemüse</h2><p class="pl-sub og-pop-sub">Das Stichwort unter dem Namen ist ein bekannter Inhaltsstoff, keine Wirkungsaussage.</p></div><div class="pl-head-r"><button class="pl-reset" hidden>Filter zurücksetzen</button><button class="pl-all" data-all>Alle anzeigen <span aria-hidden="true">→</span></button></div></div>
        <div class="pl-row-wrap"><div class="pl-row" tabindex="-1"></div><button class="pl-next" aria-label="Weiter"><span aria-hidden="true">›</span></button></div>
      </section>

      <section class="pl-world og-world" aria-labelledby="og-world-h">
        <div class="pl-world-text"><p class="pl-eyebrow">Obst &amp; Gemüse der Welt</p><h2 id="og-world-h">Globaler Anbau<br>&amp; Regionen</h2><p>Entdecke, welche Früchte und Gemüse in verschiedenen Regionen der Welt wachsen und wie sie dort traditionell verwendet werden.</p><button class="pl-ghost" data-world>Weltkarte erkunden <span aria-hidden="true">→</span></button></div>
        <div class="pl-map" role="group" aria-label="Weltkarte mit Herkunftsregionen"><div class="pl-map-bg" data-slot="obst-map" data-fit="cover"></div><canvas class="pl-map-cv" aria-hidden="true"></canvas>${REGIONS.map((r) => `<button class="pl-pin" data-region="${r.id}" style="left:${(((r.lon + 180) / 360) * 100).toFixed(1)}%;top:${(((78 - r.lat) / 136) * 100).toFixed(1)}%" aria-pressed="false"><b>${regionCount(r.id)}</b><span>${esc(r.name)}</span></button>`).join("")}</div>
        <aside class="pl-regions og-season" aria-label="Saisonkalender"><h3>Saisonkalender</h3><p class="og-season-q">Wann hat welches Obst &amp; Gemüse Saison?</p>
          <ul>${SEASONS.map((s) => `<li><button data-season="${s.id}" aria-pressed="false"${s.id === nowSeason ? ' aria-current="true"' : ""}>${ico(s.icon)}<span><strong>${esc(s.name)}${s.id === nowSeason ? " <em>jetzt</em>" : ""}</strong><small>${esc(s.items)}</small></span></button></li>`).join("")}</ul>
          <p>Saison in Mitteleuropa (Source pending verification). Ein Klick zeigt die Einträge des Atlas.</p></aside>
      </section>

      <div class="og-duo">
        <section class="pl-panel og-nutrients" aria-labelledby="og-nu-h">
          <h2 class="pl-h-sm" id="og-nu-h">Nährstoffe &amp; Gesundheit</h2>
          <p class="pl-sub">Die wichtigsten Nährstoffgruppen in Obst und Gemüse, auf Lehrbuchniveau.</p>
          <div class="og-nu-grid" role="group" aria-label="Nährstoffgruppe">${NUTRIENT_CARDS.map((n) => `<button class="og-nu" data-nu="${n.id}" aria-pressed="false"><i>${ico(n.icon)}</i><strong>${esc(n.title)}</strong><small>${esc(n.sub)}</small></button>`).join("")}</div>
          <p class="og-nu-text" aria-live="polite">Tippe auf eine Gruppe für eine kurze Erklärung.</p>
          <button class="pl-ghost" data-nutrients>Alle Nährstoffe erkunden <span aria-hidden="true">→</span></button>
        </section>
        <section class="pl-panel pl-body og-body" aria-labelledby="og-body-h">
          <div class="pl-body-text"><h2 class="pl-h-sm" id="og-body-h">Ernährung &amp; Körper</h2><p class="pl-sub">Welche Körperbereiche die Überlieferung mit Obst und Gemüse verbindet. Das ist keine Behandlungsempfehlung; jede Zuordnung zeigt ihre Belegstufe.</p>
            <ul class="pl-organs">${BODY_ROWS.map((o) => `<li><button data-organ="${o.organ ?? ""}">${ico(o.icon)}${esc(o.name)}</button></li>`).join("")}</ul>
            <button class="pl-ghost" data-body>Alle Zuordnungen im Körper-Atlas <span aria-hidden="true">→</span></button></div>
          <div class="pl-body-fig" data-slot="body-front" aria-hidden="true"></div>
        </section>
      </div>

      <div class="og-trio">
        <section class="pl-panel og-cuisines" aria-labelledby="og-cu-h">
          <h2 class="pl-h-sm" id="og-cu-h">Traditionelle Küche &amp; Kulturen</h2><p class="pl-sub">Obst und Gemüse in verschiedenen Küchen der Welt.</p>
          <div class="og-cu-row">${CUISINES.map((c) => `<button class="og-cu" data-kueche="${c.id}" aria-pressed="false">${ph(c.slot, "og-cu-img", "globe", c.tint)}<span><strong>${esc(c.name)}</strong><small>${esc(c.sub)}</small></span></button>`).join("")}</div>
          <button class="pl-ghost" data-cultures>Alte Kulturen entdecken <span aria-hidden="true">→</span></button>
        </section>
        <section class="pl-panel og-recipes" aria-labelledby="og-re-h">
          <h2 class="pl-h-sm" id="og-re-h">Rezepte &amp; Anwendungen</h2><p class="pl-sub">Küche und Alltag. Küchenrezepte folgen; die Werkbank zeigt überlieferte Hausmittel und Zubereitungen.</p>
          <div class="og-re-row">${RECIPE_CARDS.map((r) => `<div class="og-re">${ph(r.slot, "og-re-img", r.icon, r.tint)}<span><strong>${esc(r.name)}</strong><small>${esc(r.sub)} · folgt</small></span></div>`).join("")}</div>
          <button class="pl-ghost" data-lab>Zur Werkbank <span aria-hidden="true">→</span></button>
        </section>
        <section class="pl-panel og-network" aria-labelledby="og-net-h">
          <h2 class="pl-h-sm" id="og-net-h">Wissensnetz</h2><p class="pl-sub">Verbindungen zwischen Obst, Gemüse und ihren Inhaltsstoffen.</p>
          <div class="og-net" role="group" aria-label="Verbundene Einträge"></div>
          <button class="pl-ghost" data-library>Interaktives Wissensnetz öffnen <span aria-hidden="true">→</span></button>
        </section>
      </div>

      <p class="pl-notice">${esc(PRODUCE_NOTICE)}</p>
    </div>`;

  // ---- search (entries of this page first, then claims, other atlas entries last)
  const form = q$<HTMLFormElement>(".pl-search");
  const input = q$<HTMLInputElement>(".pl-q");
  const sugg = q$<HTMLElement>(".pl-sugg");
  let shown: ReturnType<typeof searchItems> = [];
  function pick(it: { kind: "claim" | "atlas"; id: string }) {
    sugg.hidden = true; input.value = "";
    if (it.kind === "claim") api.openClaim(it.id, input);
    else if (all.some((e) => e.id === it.id)) api.openPlant(it.id);
    else api.openAtlas(null, it.id);
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

  // ---- the popular row, driven by the category, region, cuisine or season filter
  const row = q$<HTMLElement>(".pl-row");
  const tagline = (e: AtlasEntry) => TAGLINE[e.id] ?? (e.facts.find((f) => f.label === "Familie")?.value.replace(/\s*\(.*\)/, "") ?? CATEGORY_LABEL[e.category]);
  function current(): { title: string; list: AtlasEntry[]; empty?: string } {
    if (filter.startsWith("region:")) {
      const r = REGIONS.find((x) => x.id === filter.slice(7))!;
      return { title: `Aus ${r.name}`, list: items.filter((e) => ORIGIN[e.id]?.includes(r.id)).sort((a, b) => rank(a) - rank(b)) };
    }
    if (filter.startsWith("kueche:")) {
      const c = CUISINES.find((x) => x.id === filter.slice(7))!;
      return { title: `Küche: ${c.name}`, list: c.ids.map(byId).filter((e): e is AtlasEntry => !!e), empty: `Typische Zutaten: ${c.sub}. Dazu sind im Atlas noch keine Einträge vorhanden.` };
    }
    if (filter.startsWith("saison:")) {
      const s = SEASONS.find((x) => x.id === filter.slice(7))!;
      return { title: `Saison: ${s.name}`, list: s.ids.map(byId).filter((e): e is AtlasEntry => !!e), empty: "Dazu gibt es noch keine Einträge." };
    }
    const g = GROUPS.find((x) => x.id === filter);
    const list = groupEntries(g ? g.members : ALL_MEMBERS, all).sort((a, b) => rank(a) - rank(b));
    return { title: g ? g.title : "Beliebte Obst & Gemüse", list, empty: g?.soon ? `${g.title} sind noch nicht im Atlas. Der Bereich ist in Vorbereitung.` : undefined };
  }
  function renderRow() {
    const { title, list, empty } = current();
    q$(".pl-popular h2").textContent = title;
    q$<HTMLElement>(".pl-reset").hidden = filter === "alle";
    row.innerHTML = list.length
      ? list.map((e) => `<button class="pl-card" data-plant="${e.id}">${itemImage(e)}<span><strong>${esc(e.name)}</strong><small>${esc(tagline(e))}</small></span></button>`).join("")
      : `<p class="pl-none">${esc(empty ?? "Hier ist noch kein Eintrag.")}</p>`;
    row.scrollLeft = 0;
    mountSlots(row);
    const on = (sel: string, attr: string, v: string) => scroll.querySelectorAll<HTMLElement>(sel).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset[attr] === v)));
    scroll.querySelectorAll<HTMLElement>("[data-group]").forEach((b) => { const o = b.dataset.group === filter; b.classList.toggle("on", o); b.setAttribute("aria-pressed", String(o)); });
    on("[data-region]", "region", filter.startsWith("region:") ? filter.slice(7) : "");
    on("[data-season]", "season", filter.startsWith("saison:") ? filter.slice(7) : "");
    on("[data-kueche]", "kueche", filter.startsWith("kueche:") ? filter.slice(7) : "");
    q$<HTMLElement>(".pl-next").hidden = list.length < 6;
  }

  // ---- the network: the popular entries on a ring, lines between entries that name each other as a combination
  const netIds = POPULAR.filter((id) => byId(id)).slice(0, 9);
  const pos = (i: number, n: number): [number, number] => { const a = -Math.PI / 2 + (i / n) * Math.PI * 2; return [Math.round(50 + 38 * Math.cos(a)), Math.round(50 + 36 * Math.sin(a))]; };
  const links: [number, number][] = [];
  netIds.forEach((id, i) => byId(id)!.combinations.forEach((c) => { const j = netIds.indexOf(c.with); if (j > i) links.push([i, j]); }));
  q$<HTMLElement>(".og-net").innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${links.map(([a, b]) => { const [x1, y1] = pos(a, netIds.length), [x2, y2] = pos(b, netIds.length); return `<line class="link" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; }).join("")}${netIds.map((_, i) => { const [x, y] = pos(i, netIds.length); return `<line x1="50" y1="50" x2="${x}" y2="${y}"/>`; }).join("")}</svg>
    <div class="og-node center"><span>Obst &amp;<br>Gemüse</span></div>
    ${netIds.map((id, i) => { const e = byId(id)!, [x, y] = pos(i, netIds.length); return `<button class="og-node" data-plant="${id}" style="left:${x}%;top:${y}%"><span class="og-node-img">${itemImage(e).replace("pl-card-img", "pl-card-img og-ni")}</span><em>${esc(e.name)}</em></button>`; }).join("")}`;

  // ---- clicks
  const smooth = (el: Element | null) => el?.scrollIntoView({ behavior: api.reduceMotion ? "auto" : "smooth", block: "start" });
  scroll.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const grp = t.closest<HTMLElement>("[data-group]");
    if (grp) { filter = filter === grp.dataset.group ? "alle" : grp.dataset.group!; renderRow(); if (grp.getAttribute("aria-disabled") !== "true") smooth(q$(".pl-popular")); return; }
    const reg = t.closest<HTMLElement>("[data-region]");
    if (reg) { const f = `region:${reg.dataset.region}`; filter = filter === f ? "alle" : f; renderRow(); smooth(q$(".pl-popular")); return; }
    const ses = t.closest<HTMLElement>("[data-season]");
    if (ses) { const f = `saison:${ses.dataset.season}`; filter = filter === f ? "alle" : f; renderRow(); smooth(q$(".pl-popular")); return; }
    const ku = t.closest<HTMLElement>("[data-kueche]");
    if (ku) { const f = `kueche:${ku.dataset.kueche}`; filter = filter === f ? "alle" : f; renderRow(); smooth(q$(".pl-popular")); return; }
    const pl = t.closest<HTMLElement>("[data-plant]");
    if (pl) { api.openPlant(pl.dataset.plant!); return; }
    const nu = t.closest<HTMLElement>("[data-nu]");
    if (nu) {
      const n = NUTRIENT_CARDS.find((x) => x.id === nu.dataset.nu)!;
      scroll.querySelectorAll<HTMLElement>("[data-nu]").forEach((b) => b.setAttribute("aria-pressed", String(b === nu)));
      q$(".og-nu-text").textContent = n.text;
      return;
    }
    if (t.closest(".pl-reset")) { filter = "alle"; renderRow(); return; }
    if (t.closest("[data-allcats]")) { filter = "alle"; renderRow(); smooth(q$(".pl-popular")); return; }
    if (t.closest("[data-all]")) { api.openAtlas("obst"); return; }
    if (t.closest(".pl-next")) { row.scrollBy({ left: row.clientWidth * 0.8, behavior: api.reduceMotion ? "auto" : "smooth" }); return; }
    if (t.closest("[data-world]")) { smooth(q$(".pl-map")); q$<HTMLElement>(".pl-pin").focus({ preventScroll: true }); return; }
    const og = t.closest<HTMLElement>("[data-organ]");
    if (og) { api.openBody(og.dataset.organ || undefined); return; }
    if (t.closest("[data-body]")) { api.openBody(); return; }
    if (t.closest("[data-nutrients]")) { api.openNutrients(); return; }
    if (t.closest("[data-cultures]")) { api.openPlants(); return; }
    if (t.closest("[data-lab]")) { api.openLab(); return; }
    if (t.closest("[data-library]")) { api.openUniverse(); return; }
    if (t.closest('[data-act="plants"]')) api.openPlants();
  });

  // ---- world map drawn from the land dots (Natural Earth, public domain) unless a map picture exists
  const cv = q$<HTMLCanvasElement>(".pl-map-cv");
  const mapBox = q$<HTMLElement>(".pl-map");
  function drawMap() {
    q$<HTMLElement>(".pl-map-bg").hidden = !hasAsset("obst-map");
    if (hasAsset("obst-map")) { cv.hidden = true; return; }
    cv.hidden = false;
    const r = mapBox.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    const g = cv.getContext("2d")!;
    g.scale(dpr, dpr);
    g.clearRect(0, 0, r.width, r.height);
    const rad = Math.max(1.1, r.width / 520);
    for (const [la, lo] of dots as [number, number][]) {
      const lat = la / 10, lon = lo / 10;
      if (lat > 78 || lat < -58) continue;
      g.fillStyle = "rgba(214, 186, 128, 0.62)";
      g.fillRect(((lon + 180) / 360) * r.width - rad / 2, ((78 - lat) / 136) * r.height - rad / 2, rad, rad);
    }
  }
  new ResizeObserver(drawMap).observe(mapBox);

  mountSlots(scroll);
  renderRow();
  return {
    start() { requestAnimationFrame(drawMap); },
    stop() { sugg.hidden = true; },
  };
}
