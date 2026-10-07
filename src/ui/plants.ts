import { atlas } from "../data/atlas";
import { CATEGORY_LABEL, type AtlasCategory, type AtlasEntry } from "../data/types";
import { GROUPS, ORGAN_PANEL, ORIGIN, PLANTS_NOTICE, POPULAR, POPULAR_CHIPS, QUOTE, REGIONS, TOPICS, groupEntries, type Region, type Topic } from "../data/plants";
import { RECIPES } from "../data/recipes";
import dots from "../data/landdots.json";
import { hasAsset, mountSlots } from "../assets/slots";
import type { SlotName } from "../assets/registry";
import { searchItems } from "./search";
import { esc } from "./dossierParts";

export interface PlantsApi {
  reduceMotion: boolean;
  openAtlas(category: AtlasCategory | null, id?: string): void;
  /** the profile page of one plant */
  openPlant(id: string): void;
  openBody(organ?: string): void;
  openCultures(): void;
  openLab(): void;
  openUniverse(): void;
  openClaim(id: string, from: HTMLElement): void;
}

const plants: AtlasEntry[] = atlas.filter((e) => e.category !== "kristall");
const byId = (id: string) => plants.find((e) => e.id === id);
const rank = (e: AtlasEntry) => { const i = POPULAR.indexOf(e.id); return i < 0 ? 999 : i; };
const latinShort = (e: AtlasEntry) => e.latin.replace(/\s*\(.*\)/, "");
const shortTarget = (t: string) => t.replace(/\s*\(.*\)/, "");

/** two small tags under a plant: the traditional associations, or the plant family when there is none */
function tags(e: AtlasEntry): string {
  const t = [...new Set(e.associations.map((a) => shortTarget(a.target)))].slice(0, 2);
  if (t.length) return t.join(" · ");
  const fam = e.facts.find((f) => f.label === "Familie")?.value.replace(/\s*\(.*\)/, "");
  return fam ?? CATEGORY_LABEL[e.category];
}

/** picture of a plant: its own atlas image, else the matching glowing nutrient motif, else the glyph placeholder */
function plantImage(e: AtlasEntry): string {
  const own = `atlas-${e.id}`, nut = `nutrient-${e.id}`;
  const name = hasAsset(own) ? own : hasAsset(nut) ? nut : own;
  return `<div class="pl-card-img${hasAsset(name) ? "" : " atlas-fallback"}" data-slot="${name}" data-fit="cover" data-sizes="(max-width: 700px) 40vw, 12vw" style="--tint:${e.model.color}" data-glyph="✿"></div>`;
}

/** The plant atlas landing page: search, categories, popular plants, regions with a map, topics, body, cultures, discoveries. */
export function initPlants(root: HTMLElement, api: PlantsApi) {
  const scroll = root.querySelector<HTMLElement>(".pl-scroll")!;
  let filter = "alle";            // a group id or "region:<id>"
  let topic: string | null = null;

  const regionCount = (r: Region) => plants.filter((e) => ORIGIN[e.id]?.includes(r)).length;
  const regionsUsed = REGIONS.filter((r) => regionCount(r.id) > 0).length;
  const plantClaims = new Set(plants.flatMap((e) => e.claims));
  const stat = (n: string | number, l: string) => `<div><dd>${n}</dd><dt>${l}</dt></div>`;

  scroll.innerHTML = `
    <div class="pl-hero">
      <div class="pl-hero-bg" data-slot="plants-hero" data-fit="cover" data-eager="true"></div>
      ${hasAsset("plants-hero") ? "" : `<div class="pl-hero-alt" data-slot="hero-lotus" aria-hidden="true"></div><div class="pl-hero-alt" data-slot="hero-bokeh" data-fit="cover" aria-hidden="true"></div>`}
      <svg class="pl-hero-art" viewBox="0 0 600 400" aria-hidden="true"><g fill="none" stroke="#CBAA67" stroke-opacity=".22" stroke-width="1.4"><path d="M420 380C400 300 410 220 450 140c40 80 50 160 20 240"/><path d="M450 140c-30 60-30 160-20 240M450 140c30 60 40 160 20 240"/><path d="M300 380c-10-80 10-150 60-210 20 70 10 150-20 210"/><path d="M360 170c-30 60-40 130-60 210"/><path d="M520 380c10-60 40-110 80-140"/></g></svg>
      <div class="pl-hero-text">
        <p class="fx-eyebrow">Natur · Pflanzenatlas</p>
        <h1>Pflanzen<br>Atlas</h1>
        <p class="pl-lead">Tauche ein in die faszinierende Welt der Pflanzen. Entdecke ihre Eigenschaften, überlieferten Anwendungen und ihre Rolle in verschiedenen Kulturen. Jede Aussage mit Quelle und Belegstufe.</p>
        <form class="pl-search" role="search" autocomplete="off">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/></svg>
          <input type="search" class="pl-q" placeholder="Pflanzen, Überlieferungen, Beschwerden, Inhaltsstoffe …" aria-label="Pflanzen und Wissen durchsuchen">
          <button type="submit" aria-label="Suchen"><span aria-hidden="true">→</span></button>
          <ul class="pl-sugg" role="listbox" hidden></ul>
        </form>
        <p class="pl-pop"><span>Beliebt:</span>${POPULAR_CHIPS.map((id) => byId(id)).filter((e): e is AtlasEntry => !!e).map((e) => `<button data-plant="${e.id}">${esc(e.name.replace(/^Echte[rn]? /, ""))}</button>`).join("")}</p>
        <dl class="pl-stats">
          ${stat(plants.length, "Pflanzen & Pilze im Atlas")}
          ${stat(plants.reduce((a, e) => a + e.associations.length, 0), "Zuordnungen der Überlieferung")}
          ${stat(plantClaims.size, "Bewertete Aussagen")}
          <div class="wide"><dd>Weltweit</dd><dt>aus ${regionsUsed} Regionen der Erde</dt></div>
        </dl>
      </div>
      <aside class="pl-quote" aria-label="Leitgedanke"><p>„${esc(QUOTE)}“</p><svg viewBox="0 0 60 60" aria-hidden="true"><path d="M30 54C30 36 36 22 50 10c0 18-8 32-20 44zM30 54C28 40 20 30 8 24c2 14 10 24 22 30z" fill="none" stroke="#5b4630" stroke-width="1.4"/></svg></aside>
    </div>

    <div class="pl-wrap">
      <section class="pl-cats" aria-label="Kategorien"><div class="pl-cat-row">${GROUPS.map((g) => {
        const slot = hasAsset(g.slot) ? g.slot : g.fallbackSlot ?? g.slot;
        return `<button class="pl-cat${g.id === "alle" ? " on" : ""}${g.soon ? " soon" : ""}" data-group="${g.id}" ${g.soon ? 'aria-disabled="true"' : ""} aria-pressed="${g.id === "alle"}">
          <div class="pl-cat-img" data-slot="${slot}" data-fit="cover" data-sizes="(max-width: 700px) 30vw, 12vw"></div>
          <span><strong>${esc(g.title)}</strong><small>${g.soon ? "in Vorbereitung" : esc(g.sub)}</small></span>${g.id === "alle" ? '<i aria-hidden="true">→</i>' : ""}</button>`;
      }).join("")}</div></section>

      <section class="pl-popular" aria-labelledby="pl-pop-h">
        <div class="pl-head"><h2 id="pl-pop-h">Beliebte Pflanzen</h2><div class="pl-head-r"><button class="pl-reset" hidden>Filter zurücksetzen</button><button class="pl-all" data-all>Alle Pflanzen anzeigen <span aria-hidden="true">→</span></button></div></div>
        <div class="pl-row-wrap"><div class="pl-row" tabindex="-1"></div><button class="pl-next" aria-label="Weiter"><span aria-hidden="true">›</span></button></div>
      </section>

      <section class="pl-world" aria-labelledby="pl-world-h">
        <div class="pl-world-text"><p class="pl-eyebrow">Pflanzen der Welt</p><h2 id="pl-world-h">Von den Bergen<br>bis zum Ozean</h2><p>Entdecke Pflanzen aus allen Regionen der Erde und erfahre, wie sie in unterschiedlichen Kulturen verwendet werden.</p><button class="pl-ghost" data-world>Weltkarte erkunden <span aria-hidden="true">→</span></button></div>
        <div class="pl-map" role="group" aria-label="Weltkarte mit Herkunftsregionen"><div class="pl-map-bg" data-slot="plants-map" data-fit="cover"></div><canvas class="pl-map-cv" aria-hidden="true"></canvas>${REGIONS.map((r) => `<button class="pl-pin" data-region="${r.id}" style="left:${(((r.lon + 180) / 360) * 100).toFixed(1)}%;top:${(((78 - r.lat) / 136) * 100).toFixed(1)}%" aria-pressed="false"><b>${regionCount(r.id)}</b><span>${esc(r.name)}</span></button>`).join("")}</div>
        <aside class="pl-regions"><h3>Pflanzen nach Region</h3><ul>${REGIONS.map((r) => `<li><button data-region="${r.id}" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c0-6 2-10 7-14-1 6-3 10-7 14zM12 21c0-5-2-8-7-10 0 5 3 8 7 10z"/></svg><span>${esc(r.name)}</span><em>${regionCount(r.id)}</em></button></li>`).join("")}</ul><p>Herkunftsregion nach Lehrbuchwissen (Source pending verification).</p></aside>
      </section>

      <div class="pl-triple">
        <section class="pl-panel pl-topic" aria-labelledby="pl-topic-h">
          <p class="pl-eyebrow">Nach Thema suchen</p><h2 id="pl-topic-h">Was interessiert dich?</h2>
          <p class="pl-sub">Finde Pflanzen, denen die Überlieferung ein Thema zuordnet, und erkunde ihre Belege. Das ist Information und keine Behandlungsempfehlung.</p>
          <div class="pl-topics" role="group" aria-label="Thema wählen">${TOPICS.map((t) => `<button data-topic="${t.id}" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${t.icon}"/></svg>${esc(t.label)}</button>`).join("")}</div>
          <div class="pl-topic-res" aria-live="polite"></div>
        </section>
        <section class="pl-panel pl-body" aria-labelledby="pl-body-h">
          <div class="pl-body-text"><h2 id="pl-body-h" class="pl-h-sm">Der menschliche Körper</h2><p class="pl-sub">Entdecke, welche Pflanzen die Überlieferung mit welchem Körperbereich verbindet.</p>
            <ul class="pl-organs">${ORGAN_PANEL.map((o) => `<li><button data-organ="${o.id ?? ""}"><i aria-hidden="true"></i>${esc(o.name)}</button></li>`).join("")}</ul>
            <button class="pl-ghost" data-body>Körper-Atlas öffnen <span aria-hidden="true">→</span></button></div>
          <div class="pl-body-fig" data-slot="body-front" aria-hidden="true"></div>
        </section>
        <section class="pl-panel pl-know" aria-labelledby="pl-know-h">
          <h2 id="pl-know-h" class="pl-h-sm">Wissen aus aller Welt</h2><p class="pl-sub">Traditionelle Anwendungen, altes Wissen und moderne Forschung, vereint an einem Ort.</p>
          <div class="pl-know-img" data-slot="tile-kulturen" data-fit="cover"></div><button class="pl-ghost" data-cultures>Kulturen entdecken <span aria-hidden="true">→</span></button>
        </section>
      </div>

      <section class="pl-disc" aria-labelledby="pl-disc-h">
        <div class="pl-head"><div><h2 id="pl-disc-h">Aktuelle Entdeckungen</h2><p class="pl-sub">Gruppen, Rezepte und Kulturen, die du im Atlas weiterverfolgen kannst.</p></div><button class="pl-all" data-library>Zur Bibliothek <span aria-hidden="true">→</span></button></div>
        <div class="pl-disc-grid"></div>
      </section>
      <p class="pl-notice"></p>
    </div>`;

  const q$ = <T extends Element>(s: string) => scroll.querySelector<T>(s)!;
  q$(".pl-notice").textContent = PLANTS_NOTICE;

  // ---- discoveries (links to what exists)
  const pilzCount = plants.filter((e) => e.category === "pilz").length;
  const spice = groupEntries(GROUPS.find((g) => g.id === "gewuerze")!, plants).length;
  const DISC: { title: string; sub: string; slot: SlotName; act: string }[] = [
    { title: "Gewürze & Wurzeln im Vergleich", sub: `${spice} Pflanzen · Küche & Überlieferung`, slot: "tile-pflanzen", act: "group:gewuerze" },
    { title: "Medizinalpilze und ihre Überlieferung", sub: `${pilzCount} Pilze · Tradition · Forschung`, slot: "tile-pilze", act: "category:pilz" },
    { title: "Alte Hausmittel neu entdeckt", sub: `${RECIPES.length} Rezepte · Zubereitung & Herkunft`, slot: "diy-extrakte", act: "lab" },
    { title: "Alte Kulturen und ihre Pflanzen", sub: "Geschichte · Rituale · Bedeutung", slot: "tile-kulturen", act: "cultures" },
  ];
  q$(".pl-disc-grid").innerHTML = DISC.map((d) => `<button class="pl-dcard" data-disc="${d.act}"><div class="pl-dcard-img" data-slot="${d.slot}" data-fit="cover" data-sizes="(max-width: 700px) 90vw, 24vw"></div><span><strong>${esc(d.title)}</strong><small>${esc(d.sub)}</small></span><i aria-hidden="true">→</i></button>`).join("");

  // ---- the "popular" row, driven by the category or region filter
  const row = q$<HTMLElement>(".pl-row");
  function current(): { title: string; list: AtlasEntry[] } {
    if (filter.startsWith("region:")) {
      const r = REGIONS.find((x) => x.id === filter.slice(7))!;
      return { title: `Pflanzen aus ${r.name}`, list: plants.filter((e) => ORIGIN[e.id]?.includes(r.id)).sort((a, b) => rank(a) - rank(b)) };
    }
    const g = GROUPS.find((x) => x.id === filter)!;
    const list = groupEntries(g, plants).sort((a, b) => rank(a) - rank(b));
    return { title: g.id === "alle" ? "Beliebte Pflanzen" : g.title, list };
  }
  function renderRow() {
    const { title, list } = current();
    q$(".pl-popular h2").textContent = title;
    q$<HTMLElement>(".pl-reset").hidden = filter === "alle";
    row.innerHTML = list.length
      ? list.map((e) => `<button class="pl-card" data-plant="${e.id}">${plantImage(e)}<span><strong>${esc(e.name)}</strong><small>${esc(tags(e))}</small></span></button>`).join("")
      : `<p class="pl-none">${filter === "algen" ? "Algen sind noch nicht im Atlas. Der Bereich ist in Vorbereitung." : "Hier ist noch keine Pflanze eingetragen."}</p>`;
    row.scrollLeft = 0;
    mountSlots(row);
    scroll.querySelectorAll<HTMLElement>("[data-group]").forEach((b) => { const on = b.dataset.group === filter; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); });
    scroll.querySelectorAll<HTMLElement>("[data-region]").forEach((b) => b.setAttribute("aria-pressed", String(filter === `region:${b.dataset.region}`)));
    q$<HTMLElement>(".pl-next").hidden = list.length < 5;
  }

  // ---- topics: plants whose traditional association points to the topic
  function renderTopic() {
    scroll.querySelectorAll<HTMLElement>("[data-topic]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.topic === topic)));
    const out = q$<HTMLElement>(".pl-topic-res");
    if (!topic) { out.innerHTML = ""; return; }
    const t = TOPICS.find((x) => x.id === topic) as Topic;
    const hits = plants.flatMap((e) => e.associations.filter((a) => t.targets.some((k) => `${a.target} ${a.system}`.toLowerCase().includes(k))).map((a) => ({ e, a })));
    const seen = new Set<string>();
    const uniq = hits.filter(({ e }) => (seen.has(e.id) ? false : (seen.add(e.id), true)));
    out.innerHTML = uniq.length
      ? `<p class="pl-res-h">Überlieferte Zuordnung zu „${esc(t.label)}“:</p><ul>${uniq.map(({ e, a }) => `<li><button data-plant="${e.id}"><strong>${esc(e.name)}</strong><small>${esc(a.system)} · ${esc(a.target)}</small></button></li>`).join("")}</ul><p class="pl-res-n">Das ist Überlieferung oder Lehrmeinung, kein Wirkungsnachweis. Jede Pflanze zeigt im Atlas ihre Belegstufe.</p>`
      : `<p class="pl-res-h">Für „${esc(t.label)}“ ist im Atlas noch keine Pflanze eingetragen.</p><p class="pl-res-n">Der Atlas wächst; es werden nur Zuordnungen mit Herkunftsangabe aufgenommen.</p>`;
  }

  // ---- search
  const form = q$<HTMLFormElement>(".pl-search");
  const input = q$<HTMLInputElement>(".pl-q");
  const sugg = q$<HTMLElement>(".pl-sugg");
  let shown: ReturnType<typeof searchItems> = [];
  function pick(it: { kind: "claim" | "atlas"; id: string }) {
    sugg.hidden = true; input.value = "";
    if (it.kind === "atlas") { if (byId(it.id)) api.openPlant(it.id); else api.openAtlas(null, it.id); } else api.openClaim(it.id, input);
  }
  function renderSugg() {
    // plants first: the page is about the atlas, claims follow
    // plants first (this page is about plants), then other atlas entries such as crystals, then claims; a title that starts with the query wins
    const q = input.value.trim().toLowerCase();
    const score = (it: ReturnType<typeof searchItems>[number]) => (it.kind === "atlas" ? 2 : 0) + (it.kind === "atlas" && byId(it.id) ? 2 : 0) + (it.title.toLowerCase().startsWith(q) ? 1 : 0);
    shown = searchItems(input.value, 40).sort((a, b) => score(b) - score(a)).slice(0, 6);
    if (!input.value.trim()) { sugg.hidden = true; return; }
    sugg.hidden = false;
    sugg.innerHTML = shown.length ? shown.map((it, i) => `<li role="option" data-i="${i}"><strong>${esc(it.title)}</strong><small>${esc(it.sub.replace("Encyclopedia", "Atlas").replace("Claim", "Aussage"))}</small></li>`).join("") : `<li class="none">Nichts gefunden. Dazu gibt es noch keinen Eintrag.</li>`;
  }
  input.addEventListener("input", renderSugg);
  input.addEventListener("blur", () => setTimeout(() => (sugg.hidden = true), 150));
  sugg.addEventListener("mousedown", (e) => { const li = (e.target as HTMLElement).closest<HTMLElement>("[data-i]"); if (li) { e.preventDefault(); pick(shown[Number(li.dataset.i)]); } });
  form.addEventListener("submit", (e) => { e.preventDefault(); renderSugg(); if (shown[0]) pick(shown[0]); });

  // ---- clicks
  const smooth = (el: Element | null) => el?.scrollIntoView({ behavior: api.reduceMotion ? "auto" : "smooth", block: "start" });
  scroll.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const grp = t.closest<HTMLElement>("[data-group]");
    if (grp) {
      if (grp.getAttribute("aria-disabled") === "true") { filter = grp.dataset.group!; renderRow(); return; }
      filter = grp.dataset.group!; renderRow(); smooth(q$(".pl-popular")); return;
    }
    const reg = t.closest<HTMLElement>("[data-region]");
    if (reg) { const f = `region:${reg.dataset.region}`; filter = filter === f ? "alle" : f; renderRow(); if (reg.closest(".pl-regions, .pl-map")) smooth(q$(".pl-popular")); return; }
    const pl = t.closest<HTMLElement>("[data-plant]");
    if (pl) { api.openPlant(pl.dataset.plant!); return; }
    if (t.closest(".pl-reset")) { filter = "alle"; renderRow(); return; }
    if (t.closest("[data-all]")) { api.openAtlas(null); return; }
    if (t.closest(".pl-next")) { row.scrollBy({ left: row.clientWidth * 0.8, behavior: api.reduceMotion ? "auto" : "smooth" }); return; }
    if (t.closest("[data-world]")) { smooth(q$(".pl-regions")); q$<HTMLElement>(".pl-regions button").focus({ preventScroll: true }); return; }
    const tp = t.closest<HTMLElement>("[data-topic]");
    if (tp) { topic = topic === tp.dataset.topic ? null : tp.dataset.topic!; renderTopic(); return; }
    const og = t.closest<HTMLElement>("[data-organ]");
    if (og) { api.openBody(og.dataset.organ || undefined); return; }
    if (t.closest("[data-body]")) { api.openBody(); return; }
    if (t.closest("[data-cultures]")) { api.openCultures(); return; }
    if (t.closest("[data-library]")) { api.openUniverse(); return; }
    const ds = t.closest<HTMLElement>("[data-disc]");
    if (ds) {
      const a = ds.dataset.disc!;
      if (a.startsWith("group:")) { filter = a.slice(6); renderRow(); smooth(q$(".pl-popular")); }
      else if (a.startsWith("category:")) api.openAtlas(a.slice(9) as AtlasCategory);
      else if (a === "lab") api.openLab();
      else api.openCultures();
    }
  });

  // ---- world map drawn from the land dots (Natural Earth, public domain) unless a map picture exists
  const cv = q$<HTMLCanvasElement>(".pl-map-cv");
  const mapBox = q$<HTMLElement>(".pl-map");
  function drawMap() {
    q$<HTMLElement>(".pl-map-bg").hidden = !hasAsset("plants-map");
    if (hasAsset("plants-map")) { cv.hidden = true; return; }
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
      const x = ((lon + 180) / 360) * r.width, y = ((78 - lat) / 136) * r.height;
      g.fillStyle = "rgba(214, 186, 128, 0.62)";
      g.fillRect(x - rad / 2, y - rad / 2, rad, rad);
    }
  }
  new ResizeObserver(drawMap).observe(mapBox);

  mountSlots(scroll);
  renderRow(); renderTopic();
  return {
    /** `group`: open with this category selected (e.g. "fruechte" from the tile "Gemüse & Obst") */
    start(group?: string) {
      if (group && GROUPS.some((g) => g.id === group && !g.soon)) { filter = group; renderRow(); }
      requestAnimationFrame(() => { drawMap(); if (group) smooth(q$(".pl-popular")); });
    },
    stop() { sugg.hidden = true; },
  };
}
