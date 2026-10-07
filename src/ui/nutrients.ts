import { GROUP_COLOR, GROUP_LABEL, INFO_CARDS, NUTRIENTS, NUTRIENT_NOTICE, type Nutrient, type NutrientGroup } from "../data/nutrients";
import { claims } from "../data/claims";
import { LEVEL_LABEL } from "../data/types";
import { mountSlots } from "../assets/slots";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const tokens = (t: string) => t.toLowerCase().split(/[\s/()\-&,.:;]+/).filter(Boolean);
const initials = (n: Nutrient) => n.name.replace(/-.*/, "").replace(/^Essenzielle /, "").split(" ").map((w) => w[0]).join("").slice(0, 3);

export interface NutrientsApi { openClaim(id: string, from: HTMLElement): void }

/**
 * Nutrients page: filterable cards, a detail drawer in the style of the "Akte" drawer, and four notes. Textbook level only;
 * no amounts, no dosing, no deficiency self-tests (see data/nutrients.ts). Published claims that name the nutrient are linked.
 */
export function initNutrients(root: HTMLElement, api: NutrientsApi) {
  const filter = root.querySelector<HTMLElement>(".nu-filter")!;
  const grid = root.querySelector<HTMLElement>(".nu-grid")!;
  const file = root.querySelector<HTMLElement>(".cu-file")!;
  const body = file.querySelector<HTMLElement>(".cu-file-body")!;
  const closeBtn = file.querySelector<HTMLButtonElement>(".cu-file-close")!;
  let group: NutrientGroup | null = null;
  let opener: HTMLElement | null = null;

  const groups = Object.keys(GROUP_LABEL) as NutrientGroup[];
  filter.innerHTML = `<button class="nu-chip" data-group="" aria-pressed="true">Alle</button>${groups.map((g) => `<button class="nu-chip" data-group="${g}" aria-pressed="false" style="--c:${GROUP_COLOR[g]}">${GROUP_LABEL[g]}</button>`).join("")}<button class="nu-chip" disabled>Sekundäre Pflanzenstoffe <span class="soon-tag inline">bald</span></button>`;
  root.querySelector<HTMLElement>(".nu-info")!.innerHTML = INFO_CARDS.map((c) => `<article class="cu-card"><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></article>`).join("");
  root.querySelector<HTMLElement>(".cu-notice")!.textContent = NUTRIENT_NOTICE;

  function renderGrid() {
    const list = NUTRIENTS.filter((n) => !group || n.group === group);
    grid.innerHTML = list.map((n) => `<button class="nu-card" data-nu="${n.id}" style="--c:${GROUP_COLOR[n.group]}"><span class="nu-disc">${n.slot ? `<span class="slot-host" data-slot="${n.slot}" data-fit="cover"></span>` : esc(initials(n))}</span><strong>${esc(n.name)}</strong><small>${GROUP_LABEL[n.group]}</small></button>`).join("");
    mountSlots(grid);
    filter.querySelectorAll<HTMLElement>("[data-group]").forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.group || null) === group)));
  }

  function related(n: Nutrient) {
    const word = n.name.toLowerCase().split(/[ -]/)[0] === "vitamin" ? n.name.toLowerCase() : n.name.toLowerCase().split(/[ -]/)[0];
    return claims.filter((c) => {
      const t = tokens(`${c.short ?? ""} ${c.statement}`).join(" ");
      return t.includes(word);
    }).slice(0, 4);
  }

  function open(n: Nutrient, from: HTMLElement | null) {
    if (file.hidden) opener = from;
    const rel = related(n);
    body.innerHTML = `
      <p class="cu-file-no" style="color:${GROUP_COLOR[n.group]}">${GROUP_LABEL[n.group]}</p>
      <h2 id="cu-file-title">${esc(n.name)}</h2>
      <p class="cu-tagline">${esc(n.what)}</p>
      <section class="cu-sec"><div class="nu-kv"><h3>Was tut es im Körper? (Lehrbuch)</h3><p>${esc(n.role)}</p></div>
        <div class="nu-kv"><h3>Wo steckt es drin?</h3><p>${esc(n.sources)}</p></div>
        ${n.deficiency ? `<div class="nu-kv"><h3>Klassisches Mangelbild (Lehrbuch)</h3><p>${esc(n.deficiency)} Ob bei dir ein Mangel vorliegt, kann nur eine Untersuchung klären.</p></div>` : ""}
        ${n.note ? `<p class="nu-warn">${esc(n.note)}</p>` : ""}
        <div class="nu-kv"><h3>Menge und Einnahme</h3><p>Dazu nennt die Seite keine Zahlen. Das gehört in ärztliche oder ernährungsfachliche Hände.</p></div></section>
      ${rel.length ? `<section class="cu-sec"><h3>Aussagen dazu in der Bibliothek</h3><ul class="nu-rel">${rel.map((c) => `<li><button data-claim="${esc(c.id)}"><strong>${esc(c.short ?? c.statement)}</strong><small>${esc(LEVEL_LABEL[c.level])}</small></button></li>`).join("")}</ul></section>` : ""}
      <p class="cu-small">${esc(NUTRIENT_NOTICE)}</p>`;
    file.hidden = false;
    file.scrollTop = 0;
    root.classList.add("file-open");
    closeBtn.focus();
  }
  function close() {
    if (file.hidden) return;
    file.hidden = true;
    root.classList.remove("file-open");
    opener?.focus();
  }

  root.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const g = t.closest<HTMLElement>("[data-group]");
    if (g) { group = (g.dataset.group || null) as NutrientGroup | null; renderGrid(); return; }
    const c = t.closest<HTMLElement>("[data-nu]");
    if (c) { open(NUTRIENTS.find((n) => n.id === c.dataset.nu)!, c); return; }
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) api.openClaim(cl.dataset.claim!, cl);
  });
  closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !file.hidden && !root.hidden) { e.stopPropagation(); close(); } });
  renderGrid();
  return { start() {}, stop: close };
}
