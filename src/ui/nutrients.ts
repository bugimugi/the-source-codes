import { GROUP_CHIP, GROUP_COLOR, GROUP_LABEL, GROUP_ORDER, NUTRIENTS, NUTRIENT_NOTICE, type Nutrient, type NutrientGroup } from "../data/nutrients";
import { CATEGORY_CARDS, DEFICIENCY_TEXT, HERO_CATS, INFO, INTAKE_NOTE, INTAKE_TIPS, NX_TABS, POPULAR, POPULAR_LABEL, SYSTEMS, TEAMWORK, WORK_TEXT, type BodySystem } from "../data/naehrpage";
import { claims } from "../data/claims";
import { LEVEL_LABEL } from "../data/types";
import { hasAsset, mountSlots } from "../assets/slots";
import { esc } from "./dossierParts";
import { ico } from "./icons";
import { ph } from "./landing";
import { landscapeSvg } from "./freqArt";

export interface NutrientsApi {
  reduceMotion: boolean;
  openClaim(id: string, from: HTMLElement): void;
  openProduce(): void;
  openBeschwerden(): void;
  openAnatomy(): void;
}

const byId = (id: string) => NUTRIENTS.find((n) => n.id === id)!;
const norm = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss");
const tokens = (t: string) => norm(t).split(/[\s/()\-&,.:;]+/).filter(Boolean);
/** its own picture, else the older nutrient motif, else the own (empty) slot that `ph` turns into a tinted card */
const picOf = (n: Nutrient) => (hasAsset(`naehrstoff-${n.id}`) ? `naehrstoff-${n.id}` : n.alt && hasAsset(n.alt) ? n.alt : `naehrstoff-${n.id}`);
const GROUP_ICON: Record<NutrientGroup, string> = { vitamin: "sun", mineral: "hex", amino: "atom", fett: "drop", spur: "leaf", enzym: "cell", pflanzenstoff: "berry", weitere: "sprout" };
const SYMBOL: Record<string, string> = { "vit-b": "B", magnesium: "Mg", calcium: "Ca", zink: "Zn", eisen: "Fe", jod: "I", selen: "Se", kalium: "K", "vit-d": "D", "vit-c": "C", "vit-a": "A", "vit-e": "E", "vit-k": "K", "vit-b12": "B12", q10: "Q10" };

/**
 * Nutrient landing page "Bausteine deines Lebens." (reference picture 30): hero with search and six group circles, seven group cards, an
 * interactive body (ten systems, the nutrients that take part in them, five tabs), a filterable carousel of all nutrients with a detail
 * drawer, and four info cards. Textbook level only; no amounts, no dosing, no deficiency self-tests (see data/nutrients.ts). Published
 * claims that name a nutrient appear under "Wirkung" with their evidence level.
 */
export function initNutrients(root: HTMLElement, api: NutrientsApi) {
  const scroll = root.querySelector<HTMLElement>(".pl-scroll")!;
  const file = root.querySelector<HTMLElement>(".cu-file")!;
  const body = file.querySelector<HTMLElement>(".cu-file-body")!;
  const closeBtn = file.querySelector<HTMLButtonElement>(".cu-file-close")!;
  const q$ = <T extends HTMLElement>(s: string) => scroll.querySelector<T>(s)!;
  const smooth = (el: Element | null) => el?.scrollIntoView({ behavior: api.reduceMotion ? "auto" : "smooth", block: "start" });
  let group: NutrientGroup | null = null;
  let sys = SYSTEMS[0], pick = sys.links[0][0], tab = "funktion";
  let opener: HTMLElement | null = null;

  const heroBg = hasAsset("naehrstoffe-hero")
    ? `<div class="pl-hero-bg" data-slot="naehrstoffe-hero" data-fit="cover" data-eager="true"></div>`
    : `<div class="nx-sky" aria-hidden="true">${landscapeSvg("nxs")}</div><div class="nx-fig" aria-hidden="true"><div data-slot="body-front" data-eager="true"></div></div>`;
  const bodyPic = hasAsset("naehrstoffe-koerper") ? "naehrstoffe-koerper" : "body-front";

  scroll.innerHTML = `
    <div class="pl-hero nx-hero">
      ${heroBg}
      <div class="pl-hero-text nx-text">
        <p class="nx-eyebrow">Nährstoffe · Vitamine · Mineralien · Aminosäuren</p>
        <h1>Bausteine<br>deines Lebens.</h1>
        <p class="pl-lead">Entdecke die wichtigsten Nährstoffe, ihre Aufgaben im Körper, natürliche Quellen und wie sie zusammenarbeiten – Grundwissen für Energie, Gesundheit und Wohlbefinden.</p>
        <form class="nx-search" role="search">
          <label class="nx-field">${ico("target")}<input type="search" placeholder="Suche nach Vitaminen, Mineralien, Aminosäuren …" aria-label="Nährstoff suchen" autocomplete="off"></label>
          <button class="nx-go" type="submit" aria-label="Suchen">${ico("arrow")}</button>
          <ul class="nx-results" hidden></ul>
        </form>
        <div class="nx-pop"><span>Beliebte Themen:</span>${POPULAR.map((id) => `<button data-nu="${id}">${esc(POPULAR_LABEL[id])}</button>`).join("")}<button data-jump="disc" aria-label="Alle Nährstoffe">…</button></div>
      </div>
      <ul class="nx-cats" aria-label="Gruppen">${HERO_CATS.map((c) => `<li><button data-group-go="${c.group}" style="--c:${GROUP_COLOR[c.group]}"><i>${ico(c.icon)}</i><span><b>${GROUP_LABEL[c.group]}</b><small>${esc(c.sub)}</small></span><em aria-hidden="true">→</em></button></li>`).join("")}</ul>
    </div>
    <ul class="nx-kats" aria-label="Nährstoffgruppen">${CATEGORY_CARDS.map((c) => {
      const own = `naehrstoffe-kat-${c.group}`, slot = hasAsset(own) ? own : c.alt && hasAsset(c.alt) ? c.alt : own;
      return `<li><button data-group-go="${c.group}" style="--c:${GROUP_COLOR[c.group]}"><span class="nx-img">${ph(slot, "nx-ph", c.icon, GROUP_COLOR[c.group])}</span><b>${GROUP_LABEL[c.group]}</b><small>${esc(c.sub)}</small></button></li>`;
    }).join("")}</ul>
    <section class="nx-body" aria-labelledby="nx-body-h">
      <div class="nx-box nx-explorer">
        <div class="nx-explorer-l">
          <h2 id="nx-body-h">Interaktiver Körper</h2>
          <p class="nx-sub">Klicke auf ein Organ oder System und entdecke, welche Nährstoffe daran beteiligt sind.</p>
          <ul class="nx-systems">${SYSTEMS.map((s) => `<li><button data-sys="${s.id}" aria-pressed="false">${ico(s.icon)}<span>${esc(s.name)}</span><em aria-hidden="true">›</em></button></li>`).join("")}</ul>
        </div>
        <div class="nx-figure">
          <div class="nx-figbox"><div class="nx-figpic" data-slot="${bodyPic}"></div>
          ${SYSTEMS.filter((s) => s.pin).map((s) => `<button class="nx-pin" data-sys="${s.id}" style="left:${s.pin!.x}%;top:${s.pin!.y}%" aria-label="${esc(s.name)}"><i></i></button>`).join("")}</div>
          <ul class="nx-callouts" aria-hidden="true">${SYSTEMS.filter((s) => s.pin).map((s) => `<li data-sys="${s.id}"><i>${ico(s.icon)}</i><span><b>${esc(s.name.split(" & ")[0])}</b><small>${esc(s.pin!.label)}</small></span></li>`).join("")}</ul>
        </div>
      </div>
      <aside class="nx-box nx-panel" aria-live="polite"></aside>
    </section>
    <section class="nx-disc" id="nx-disc" aria-labelledby="nx-disc-h">
      <header class="nx-disc-head"><div><h2 id="nx-disc-h">Nährstoffe entdecken</h2><p class="nx-sub">Wähle eine Kategorie und erkunde alle Nährstoffe im Detail.</p></div>
        <div class="nx-filter" role="group" aria-label="Gruppe wählen"><button data-group="" aria-pressed="true">Alle</button>${GROUP_ORDER.map((g) => `<button data-group="${g}" aria-pressed="false" style="--c:${GROUP_COLOR[g]}">${GROUP_CHIP[g]}</button>`).join("")}</div></header>
      <div class="nx-rail"><ul class="nx-cards"></ul><button class="nx-next" data-rail="1" aria-label="Weiter blättern">${ico("arrow")}</button></div>
    </section>
    <ul class="nx-info">${INFO.map((c) => `<li class="nx-box"><h3>${esc(c.title)}</h3><span class="nx-img wide">${ph(hasAsset(`naehrstoffe-info-${c.id}`) || !c.alt ? `naehrstoffe-info-${c.id}` : c.alt, "nx-ph", c.icon, "#58a8ff")}</span><p>${esc(c.text)}</p><button class="nx-outline" data-info="${c.id}">${esc(c.button)} <span aria-hidden="true">→</span></button></li>`).join("")}</ul>
    <div class="pl-wrap"><p class="pl-notice">${esc(NUTRIENT_NOTICE)}</p></div>`;

  // ---------------------------------------------------------------- claims that name a nutrient
  function related(n: Nutrient) {
    const words = [n.name, ...(n.aliases ?? [])].map((w) => norm(w.replace(/\s*\(.*\)/, "")));
    const keys = words.map((w) => (w.startsWith("vitamin ") ? w : w.split(/[ -]/)[0])).filter((w) => w.length > 2);
    return claims.filter((c) => c.status === "published" && keys.some((k) => tokens(`${c.short ?? ""} ${c.statement}`).join(" ").includes(k))).slice(0, 4);
  }
  const claimList = (n: Nutrient) => {
    const rel = related(n);
    return rel.length
      ? `<ul class="nx-claims">${rel.map((c) => `<li><button data-claim="${esc(c.id)}"><strong>${esc(c.short ?? c.statement)}</strong><span class="pp-lvl" style="--c:var(--lvl-${c.level})">${esc(LEVEL_LABEL[c.level])}</span></button></li>`).join("")}</ul>`
      : `<p>Zu diesem Nährstoff gibt es in der Bibliothek noch keine bewertete Aussage. Die Seite beschreibt nur, woran er im Körper beteiligt ist (Reiter „Funktion“); Wirkversprechen gibt es hier nicht.</p>`;
  };
  const deficiency = (n: Nutrient) => `<p>${n.deficiency ? `Klassisches Mangelbild (Lehrbuch): ${esc(n.deficiency)}` : "Ein eindeutiges klassisches Mangelbild nennt das Lehrbuch hier nicht."} Ob bei dir ein Mangel vorliegt, kann nur eine Untersuchung klären.</p>`;
  const intake = (n: Nutrient) => `${n.intake ? `<p>${esc(n.intake)}</p>` : ""}<p>${esc(INTAKE_NOTE)}</p>`;
  const symbol = (n: Nutrient) => (SYMBOL[n.id] ? `<b class="nx-sym">${SYMBOL[n.id]}</b>` : ico(GROUP_ICON[n.group]));

  // ---------------------------------------------------------------- body panel
  function renderPanel() {
    const n = byId(pick), why = sys.links.find(([id]) => id === pick)?.[1] ?? n.role;
    let text = "";
    switch (tab) {
      case "quellen": text = `<p>${esc(n.sources)}</p>`; break;
      case "wirkung": text = claimList(n); break;
      case "mangel": text = deficiency(n); break;
      case "einnahme": text = intake(n); break;
      default: text = `<p>${esc(why)}</p><p class="nx-muted">${esc(n.role)}</p>`;
    }
    q$(".nx-panel").innerHTML = `
      <header class="nx-panel-h"><i>${ico(sys.icon)}</i><div><h3>${esc(sys.name)}</h3><p>${esc(sys.text)}</p></div></header>
      <h4>Wichtige Nährstoffe</h4>
      <ul class="nx-chips">${sys.links.map(([id]) => { const x = byId(id); return `<li><button data-pick="${id}" aria-pressed="${id === pick}" style="--c:${GROUP_COLOR[x.group]}">${symbol(x)}<span>${esc(x.name.replace(/ \(.*\)/, "").replace(/-Fettsäuren$/, ""))}</span></button></li>`; }).join("")}</ul>
      <button class="nx-pick" data-nu="${n.id}" style="--c:${GROUP_COLOR[n.group]}">${symbol(n)}<span><b>${esc(n.name)}</b><small>${esc(why)}</small></span><em aria-hidden="true">→</em></button>
      <div class="nx-tabs" role="tablist" aria-label="Thema">${NX_TABS.map(([id, l]) => `<button role="tab" data-tab="${id}" aria-selected="${id === tab}" tabindex="${id === tab ? 0 : -1}">${l}</button>`).join("")}</div>
      <div class="nx-tabtext" role="tabpanel">${text}</div>
      ${n.note ? `<p class="nx-warn">${ico("shield")} ${esc(n.note)}</p>` : ""}
      <p class="nx-small">Lehrbuchwissen, im Pilot ungeprüft · Source pending verification · <button class="pl-link" data-act="anatomy">Zum Körper-Atlas</button></p>`;
    scroll.querySelectorAll<HTMLElement>("[data-sys]").forEach((b) => { if (b.tagName === "BUTTON") b.setAttribute("aria-pressed", String(b.dataset.sys === sys.id)); else b.classList.toggle("on", b.dataset.sys === sys.id); });
  }
  function selectSystem(s: BodySystem) {
    sys = s; pick = s.links[0][0]; renderPanel();
    // stacked layout: the panel sits below the figure, bring it into view
    if (matchMedia("(max-width: 1100px)").matches) smooth(q$(".nx-panel"));
  }

  // ---------------------------------------------------------------- carousel
  function renderCards() {
    const list = NUTRIENTS.filter((n) => !group || n.group === group);
    q$(".nx-cards").innerHTML = list.map((n) => `<li><button data-nu="${n.id}" style="--c:${GROUP_COLOR[n.group]}"><span class="nx-img">${ph(picOf(n), "nx-ph", GROUP_ICON[n.group], GROUP_COLOR[n.group])}</span><b>${esc(n.name)}</b><small>${esc(n.tags)}</small><em aria-hidden="true">${ico("plus")}</em></button></li>`).join("");
    q$(".nx-cards").scrollLeft = 0;
    scroll.querySelectorAll<HTMLElement>("[data-group]").forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.group || null) === group)));
    mountSlots(q$(".nx-cards"));
  }
  function setGroup(g: NutrientGroup | null, jump: boolean) { group = g; renderCards(); if (jump) smooth(q$("#nx-disc")); }

  // ---------------------------------------------------------------- drawer (nutrient detail and info texts)
  function show(html: string, from: HTMLElement | null) {
    if (file.hidden) opener = from;
    body.innerHTML = html;
    file.hidden = false;
    file.scrollTop = 0;
    root.classList.add("file-open");
    closeBtn.focus();
  }
  function openNutrient(n: Nutrient, from: HTMLElement | null) {
    const inSys = SYSTEMS.filter((s) => s.links.some(([id]) => id === n.id));
    show(`
      <p class="cu-file-no" style="color:${GROUP_COLOR[n.group]}">${GROUP_LABEL[n.group]}</p>
      <h2 id="cu-file-title">${esc(n.name)}</h2>
      <p class="cu-tagline">${esc(n.what)}</p>
      <section class="cu-sec"><div class="nu-kv"><h3>Funktion im Körper (Lehrbuch)</h3><p>${esc(n.role)}</p></div>
        ${inSys.length ? `<div class="nu-kv"><h3>Beteiligt an</h3><ul class="nx-in">${inSys.map((s) => `<li><b>${esc(s.name)}:</b> ${esc(s.links.find(([id]) => id === n.id)![1])}</li>`).join("")}</ul></div>` : ""}
        <div class="nu-kv"><h3>Natürliche Quellen</h3><p>${esc(n.sources)}</p></div>
        <div class="nu-kv"><h3>Mangel</h3>${deficiency(n)}</div>
        <div class="nu-kv"><h3>Einnahme & Aufnahme</h3>${intake(n)}</div>
        ${n.note ? `<p class="nu-warn">${esc(n.note)}</p>` : ""}</section>
      <section class="cu-sec"><h3>Aussagen dazu in der Bibliothek</h3>${claimList(n)}</section>
      <p class="cu-small">${esc(NUTRIENT_NOTICE)}</p>`, from);
  }
  function openInfo(id: string, from: HTMLElement) {
    if (id === "quellen") { api.openProduce(); return; }
    const c = INFO.find((i) => i.id === id)!;
    let html = "";
    if (id === "wirken") html = `${WORK_TEXT.map((t) => `<p>${esc(t)}</p>`).join("")}<ul class="nx-in">${TEAMWORK.map(([a, b]) => `<li><b>${esc(a)}:</b> ${esc(b)}</li>`).join("")}</ul>`;
    else if (id === "einnahme") html = `<ul class="nx-in">${INTAKE_TIPS.map((t) => `<li>${esc(t)}</li>`).join("")}</ul><p class="nu-warn">${esc(INTAKE_NOTE)}</p>`;
    else html = `${DEFICIENCY_TEXT.map((t) => `<p>${esc(t)}</p>`).join("")}<h3>Klassische Mangelbilder (Lehrbuch)</h3><ul class="nx-in">${NUTRIENTS.filter((n) => n.deficiency).map((n) => `<li><button class="pl-link" data-nu="${n.id}">${esc(n.name)}</button>: ${esc(n.deficiency!)}</li>`).join("")}</ul>
      <p><button class="nx-outline" data-act="beschwerden">Beschwerden &amp; Warnzeichen <span aria-hidden="true">→</span></button></p>`;
    show(`<p class="cu-file-no">Nährstoffe · Grundwissen</p><h2 id="cu-file-title">${esc(c.title)}</h2><section class="cu-sec nx-infotext">${html}</section><p class="cu-small">${esc(NUTRIENT_NOTICE)}</p>`, from);
  }
  function close() {
    if (file.hidden) return;
    file.hidden = true;
    root.classList.remove("file-open");
    opener?.focus();
  }

  // ---------------------------------------------------------------- search
  const input = q$<HTMLInputElement>(".nx-search input");
  const results = q$(".nx-results");
  const find = (q: string) => {
    const t = norm(q.trim());
    if (!t) return [];
    const score = (n: Nutrient) => {
      const names = [n.name, ...(n.aliases ?? [])].map(norm);
      if (names.some((x) => x === t)) return 3;
      if (names.some((x) => x.startsWith(t) || x.includes(` ${t}`) || x.includes(t))) return 2;
      return norm(`${n.tags} ${GROUP_LABEL[n.group]} ${n.sources}`).includes(t) ? 1 : 0;
    };
    return NUTRIENTS.map((n) => [n, score(n)] as const).filter(([, s]) => s).sort((a, b) => b[1] - a[1]).map(([n]) => n).slice(0, 6);
  };
  function renderResults() {
    const list = find(input.value);
    results.hidden = !input.value.trim();
    results.innerHTML = list.length
      ? list.map((n) => `<li><button type="button" data-nu="${n.id}"><b>${esc(n.name)}</b><small>${GROUP_LABEL[n.group]} · ${esc(n.tags)}</small></button></li>`).join("")
      : `<li class="nx-none">Nichts gefunden. Die Seite führt bisher ${NUTRIENTS.length} Nährstoffe.</li>`;
  }
  input.addEventListener("input", renderResults);
  q$(".nx-search").addEventListener("submit", (e) => {
    e.preventDefault();
    const first = find(input.value)[0];
    if (first) { results.hidden = true; openNutrient(first, input); }
    else renderResults();
  });
  input.addEventListener("keydown", (e) => { if (e.key === "Escape" && !results.hidden) { e.stopPropagation(); results.hidden = true; } });

  // ---------------------------------------------------------------- events
  root.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    if (!t.closest(".nx-search")) results.hidden = true;
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) { api.openClaim(cl.dataset.claim!, cl); return; }
    const pk = t.closest<HTMLElement>("[data-pick]");
    if (pk) { pick = pk.dataset.pick!; renderPanel(); return; }
    const nu = t.closest<HTMLElement>("[data-nu]");
    if (nu) { results.hidden = true; openNutrient(byId(nu.dataset.nu!), nu); return; }
    const sy = t.closest<HTMLElement>("[data-sys]");
    if (sy) { selectSystem(SYSTEMS.find((s) => s.id === sy.dataset.sys)!); return; }
    const tb = t.closest<HTMLElement>("[data-tab]");
    if (tb) { tab = tb.dataset.tab!; renderPanel(); scroll.querySelector<HTMLElement>(`[data-tab="${tab}"]`)?.focus(); return; }
    const gg = t.closest<HTMLElement>("[data-group-go]");
    if (gg) { setGroup(gg.dataset.groupGo as NutrientGroup, true); return; }
    const g = t.closest<HTMLElement>("[data-group]");
    if (g) { setGroup((g.dataset.group || null) as NutrientGroup | null, false); return; }
    if (t.closest("[data-jump]")) { setGroup(null, true); return; }
    if (t.closest("[data-rail]")) { const r = q$(".nx-cards"); r.scrollBy({ left: r.clientWidth * 0.8, behavior: api.reduceMotion ? "auto" : "smooth" }); return; }
    const inf = t.closest<HTMLElement>("[data-info]");
    if (inf) { openInfo(inf.dataset.info!, inf); return; }
    const ac = t.closest<HTMLElement>("[data-act]");
    if (ac?.dataset.act === "beschwerden") { close(); api.openBeschwerden(); }
    else if (ac?.dataset.act === "anatomy") api.openAnatomy();
  });
  // arrow keys move through the panel tabs like in a tab list
  scroll.addEventListener("keydown", (e) => {
    const k = e.key;
    if ((k !== "ArrowRight" && k !== "ArrowLeft") || !(e.target as HTMLElement).closest(".nx-tabs")) return;
    const i = NX_TABS.findIndex(([id]) => id === tab);
    tab = NX_TABS[(i + (k === "ArrowRight" ? 1 : NX_TABS.length - 1)) % NX_TABS.length][0];
    renderPanel();
    scroll.querySelector<HTMLElement>(`[data-tab="${tab}"]`)?.focus();
  });
  closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !file.hidden && !root.hidden) { e.stopPropagation(); close(); } });

  mountSlots(scroll);
  renderPanel();
  renderCards();
  return { start() {}, stop: close };
}
