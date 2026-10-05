import { atlas } from "../data/atlas";
import { claims } from "../data/claims";
import { AREA_LABEL, CATEGORY_LABEL } from "../data/types";

interface Item { kind: "claim" | "atlas"; id: string; title: string; sub: string; hay: string }

const items: Item[] = [
  ...claims.map((c): Item => ({
    kind: "claim", id: c.id, title: c.short ?? c.statement, sub: `Claim · ${AREA_LABEL[c.area]}`,
    hay: `${c.short ?? ""} ${c.statement} ${c.rationale}`.toLowerCase(),
  })),
  ...atlas.map((e): Item => ({
    kind: "atlas", id: e.id, title: `${e.name} (${e.latin})`, sub: `Encyclopedia · ${CATEGORY_LABEL[e.category]}`,
    hay: `${e.name} ${e.latin} ${e.tradition} ${e.facts.map((f) => f.value).join(" ")} ${e.associations.map((a) => a.target).join(" ")}`.toLowerCase(),
  })),
];

/** Knowledge search over claims and atlas entries with keyboard support ("/" focuses the field). */
export function initSearch(input: HTMLInputElement, list: HTMLElement, onPick: (item: { kind: "claim" | "atlas"; id: string }) => void) {
  let shown: Item[] = [];
  let active = 0;

  function render() {
    list.replaceChildren();
    if (!input.value.trim()) { list.hidden = true; return; }
    list.hidden = false;
    if (!shown.length) {
      const li = document.createElement("li");
      li.className = "none";
      li.textContent = "Nothing found – this topic has no entry yet.";
      list.append(li);
      return;
    }
    shown.forEach((it, i) => {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", String(i === active));
      const s = document.createElement("strong"); s.textContent = it.title;
      const m = document.createElement("small"); m.textContent = it.sub;
      li.append(s, m);
      li.addEventListener("mousedown", (e) => { e.preventDefault(); pick(it); });
      list.append(li);
    });
  }

  function pick(it: Item) {
    input.value = "";
    list.hidden = true;
    input.blur();
    onPick(it);
  }

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    shown = q ? items.filter((i) => q.split(/\s+/).every((w) => i.hay.includes(w))).slice(0, 8) : [];
    active = 0;
    render();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { active = Math.min(active + 1, shown.length - 1); render(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { active = Math.max(active - 1, 0); render(); e.preventDefault(); }
    else if (e.key === "Enter" && shown[active]) pick(shown[active]);
    else if (e.key === "Escape") { input.value = ""; list.hidden = true; input.blur(); }
  });
  input.addEventListener("blur", () => setTimeout(() => (list.hidden = true), 120));
  input.addEventListener("focus", render);
  document.addEventListener("keydown", (e) => {
    const t = e.target as HTMLElement;
    if (e.key === "/" && !["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName)) { e.preventDefault(); input.focus(); }
  });
}
