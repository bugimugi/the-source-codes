import { MENU, MENU_UNIVERSE, type MenuItem } from "../data/menu";
import { esc } from "./dossierParts";

export interface SiteMenuApi {
  /** opens a page (or an atlas category); the page that is open now is closed first */
  open(item: MenuItem): void;
  /** back to the home page */
  home(): void;
  /** the "Methode" text */
  openMethod(): void;
}

const CHEV = `<svg class="sm-chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>`;
const BURGER = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`;

const byId = new Map<string, MenuItem>([...MENU.flatMap((g) => g.items), MENU_UNIVERSE].map((i) => [i.id, i]));
const itemBtn = (it: MenuItem, extra = "") => `<button type="button" class="sm-item${extra}" data-item="${it.id}">${esc(it.label)}</button>`;

/** the bar: seven main points with a list of their pages, a "Menü" button for narrow screens, on pages also the way to the Universum */
function barHtml(onHome: boolean): string {
  const groups = MENU.map((g) => {
    if (g.soon) return `<li class="sm-group is-soon"><span class="sm-top sm-soon" title="In Vorbereitung" aria-disabled="true">${esc(g.label)}</span></li>`;
    if (g.items.length === 1) return `<li class="sm-group" data-group="${g.id}">${itemBtn({ ...g.items[0], label: g.label }, " sm-top")}</li>`;
    return `<li class="sm-group" data-group="${g.id}"><button type="button" class="sm-top" aria-expanded="false" aria-haspopup="true">${esc(g.label)}${CHEV}</button><ul class="sm-drop">${g.items.map((it) => `<li>${itemBtn(it)}</li>`).join("")}</ul></li>`;
  }).join("");
  return `<button type="button" class="sm-burger" aria-label="Menü öffnen" aria-haspopup="dialog" aria-controls="sm-panel">${BURGER}<span>Menü</span></button>` +
    `<ul class="sm-bar">${groups}</ul>${onHome ? "" : itemBtn(MENU_UNIVERSE, " sm-cta")}`;
}

/** the full list for narrow screens: everything below each other */
function panelHtml(): string {
  const groups = MENU.map((g) =>
    `<section class="sm-pg"><h2><span>${g.nr}</span> ${esc(g.label)}${g.soon ? " <em>· in Vorbereitung</em>" : ""}</h2>` +
    (g.items.length ? `<ul>${g.items.map((it) => `<li>${itemBtn(it)}</li>`).join("")}</ul>` : "") + `</section>`).join("");
  return `<div class="sm-panel-head"><span>Menü</span><button type="button" class="sm-close" aria-label="Menü schließen">×</button></div>` +
    `<div class="sm-panel-body"><ul class="sm-pquick"><li><button type="button" class="sm-pbtn" data-action="home">Startseite</button></li><li>${itemBtn(MENU_UNIVERSE, " sm-pbtn")}</li></ul>` +
    `${groups}<button type="button" class="sm-pbtn sm-method" data-action="method">Methode</button></div>`;
}

/**
 * Builds the one menu into every `nav[data-tabs]` (the home bar and the header of each page), so the site has a single menu.
 * Dropdowns open on hover (CSS) and on click or keyboard (Enter, arrow keys, Escape). `setCurrent` marks the open page.
 */
export function initSiteMenu(hosts: HTMLElement[], api: SiteMenuApi) {
  for (const host of hosts) {
    host.classList.remove("tabs");
    host.classList.add("sm");
    host.setAttribute("aria-label", "Hauptmenü");
    host.innerHTML = barHtml(host.dataset.tabs === "hero");
  }

  const panel = document.createElement("div");
  panel.id = "sm-panel";
  panel.className = "sm-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-label", "Menü");
  panel.innerHTML = panelHtml();
  document.body.append(panel);

  let opener: HTMLElement | null = null;
  const closeAll = () => document.querySelectorAll(".sm-group.is-open").forEach((g) => { g.classList.remove("is-open"); g.querySelector(".sm-top")?.setAttribute("aria-expanded", "false"); });
  const toggle = (g: HTMLElement) => {
    const was = g.classList.contains("is-open");
    closeAll();
    if (!was) { g.classList.add("is-open"); g.querySelector(".sm-top")?.setAttribute("aria-expanded", "true"); }
  };
  const openPanel = (from: HTMLElement) => {
    opener = from;
    panel.hidden = false;
    document.documentElement.classList.add("sm-open");
    panel.querySelector<HTMLElement>(".sm-close")!.focus();
  };
  const closePanel = () => {
    if (panel.hidden) return;
    panel.hidden = true;
    document.documentElement.classList.remove("sm-open");
    opener?.focus();
  };

  document.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const item = t.closest<HTMLElement>(".sm-item[data-item]");
    if (item) {
      const it = byId.get(item.dataset.item!);
      closeAll(); closePanel();
      if (it) api.open(it);
      return;
    }
    const act = t.closest<HTMLElement>("#sm-panel [data-action]");
    if (act) {
      closePanel();
      if (act.dataset.action === "home") api.home(); else api.openMethod();
      return;
    }
    const top = t.closest<HTMLElement>(".sm-top[aria-expanded]");
    if (top) { toggle(top.parentElement as HTMLElement); return; }
    const burger = t.closest<HTMLElement>(".sm-burger");
    if (burger) { openPanel(burger); return; }
    if (t.closest(".sm-close")) { closePanel(); return; }
    if (!t.closest(".sm-group")) closeAll();
  });

  document.addEventListener("focusout", (e) => {
    const next = (e as FocusEvent).relatedTarget as HTMLElement | null;
    if (!next?.closest(".sm-group")) closeAll();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!panel.hidden) { closePanel(); return; }
      const open = document.querySelector<HTMLElement>(".sm-group.is-open");
      if (open) { closeAll(); open.querySelector<HTMLElement>(".sm-top")?.focus(); }
      return;
    }
    const t = e.target as HTMLElement;
    const group = t.closest<HTMLElement>(".sm-group");
    if (!group) return;
    if (t.matches("button.sm-top")) {
      const tops = [...group.parentElement!.querySelectorAll<HTMLElement>(":scope > .sm-group > button.sm-top")];
      if (e.key === "ArrowDown" && t.hasAttribute("aria-expanded")) {
        e.preventDefault();
        closeAll(); group.classList.add("is-open"); t.setAttribute("aria-expanded", "true");
        group.querySelector<HTMLElement>(".sm-drop .sm-item")?.focus();
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const i = tops.indexOf(t);
        tops[(i + (e.key === "ArrowRight" ? 1 : tops.length - 1)) % tops.length]?.focus();
      }
    } else if (t.matches(".sm-drop .sm-item")) {
      const items = [...group.querySelectorAll<HTMLElement>(".sm-drop .sm-item")];
      const i = items.indexOf(t);
      if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (i === 0) group.querySelector<HTMLElement>(".sm-top")!.focus(); else items[i - 1].focus(); }
    }
  });

  return {
    /** marks the page that is open; `plantFrom` = the landing page a plant profile was opened from */
    setCurrent(view: string, plantFrom?: string) {
      const key = view === "plant" ? `plant:${plantFrom ?? "plants"}` : view;
      const is = (it: MenuItem) => it.view === view || !!it.also?.includes(key);
      document.querySelectorAll<HTMLElement>(".sm-item[data-item]").forEach((b) => {
        const it = byId.get(b.dataset.item!);
        if (it && is(it)) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
      });
      document.querySelectorAll<HTMLElement>(".sm-group[data-group]").forEach((li) => {
        const g = MENU.find((x) => x.id === li.dataset.group);
        li.toggleAttribute("data-current", !!g?.items.some(is));
      });
      closeAll(); closePanel();
    },
    closeAll,
  };
}
