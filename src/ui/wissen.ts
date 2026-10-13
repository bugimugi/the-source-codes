import gsap from "gsap";
import { atlas } from "../data/atlas";
import { BODY_ORGANS } from "../data/body";
import { DOSSIERS } from "../data/cultures";
import { LAYERS, WISSEN_TEXT, type EntryRef, type Layer, type LayerTarget } from "../data/wissen";
import { mountSlots, slotHtml } from "../assets/slots";
import type { SlotName } from "../assets/registry";
import { createCodeRain } from "./codeRain";
import { esc } from "./dossierParts";
import { ico } from "./icons";
import { initSearch } from "./search";

export interface WissenApi {
  reduceMotion: boolean;
  /** the landing page behind a layer */
  openTarget(to: LayerTarget): void;
  openOrgan(id: string): void;
  openPlant(id: string): void;
  openAtlas(id: string): void;
  openFx(mode: "kymatik" | "geometrie"): void;
  openCultures(): void;
  /** the old 3D map of all statements (galaxies) */
  openGalaxy(): void;
  openClaim(id: string, from: HTMLElement): void;
}

interface Resolved { title: string; tag: string; slot: SlotName | `atlas-${string}`; run: () => void }

/**
 * The "Wissensmatrix" (page behind the tab "Universum") after reference image 31: falling code, five floating layers; hovering one
 * opens it (picture, two entries from the real data, button), a click opens the page behind it. On touch screens the first tap
 * opens the layer, the second tap the page. Arrow keys move between the layers, Enter opens.
 */
export function initWissen(root: HTMLElement, api: WissenApi) {
  const touch = matchMedia("(hover: none)").matches;
  const T = WISSEN_TEXT;

  const resolve = (e: EntryRef): Resolved | null => {
    switch (e.type) {
      case "organ": {
        const o = BODY_ORGANS.find((x) => x.id === e.id);
        return o ? { title: o.name, tag: "Organ · Körper-Atlas", slot: o.slot, run: () => api.openOrgan(o.id) } : null;
      }
      case "plant":
      case "atlas": {
        const a = atlas.find((x) => x.id === e.id);
        if (!a) return null;
        const tag = `${e.type === "plant" ? "Profil" : "Eintrag"} · ${a.facts.length} Fakten · ${a.sources.length} Quellen`;
        return { title: a.name, tag, slot: `atlas-${a.id}`, run: () => (e.type === "plant" ? api.openPlant(a.id) : api.openAtlas(a.id)) };
      }
      case "culture": {
        const d = DOSSIERS.find((x) => x.id === e.id);
        return d ? { title: d.name, tag: `Akte ${d.nr} · ${d.period}`, slot: d.slot, run: () => api.openCultures() } : null;
      }
      case "fx":
        return { title: e.title, tag: e.tag, slot: e.slot, run: () => api.openFx(e.mode) };
    }
  };

  const layerHtml = (l: Layer, i: number): string => {
    const entries = l.entries.map(resolve).filter((x): x is Resolved => !!x);
    return `
    <div class="wm-layer" data-layer="${l.id}" style="--i:${i}">
      <button type="button" class="wm-label" aria-expanded="false" aria-controls="wm-plane-${l.id}">${ico(l.icon)}<span>${esc(l.label)}</span></button>
      <div class="wm-plane" id="wm-plane-${l.id}">
        <div class="wm-pic">${slotHtml(l.slot, { cover: true })}</div>
        <div class="wm-pin">
          <h2>${esc(l.title)}</h2>
          <p class="wm-psub">${esc(l.sub)}</p>
          <ul class="wm-entries">
            ${entries.map((e, k) => `<li><button type="button" class="wm-entry" data-k="${k}"><span class="wm-tw">${slotHtml(e.slot, { cover: true })}</span><span class="wm-et"><strong>${esc(e.title)}</strong><small>${esc(e.tag)}</small></span>${ico("arrow")}</button></li>`).join("")}
          </ul>
          <button type="button" class="wm-open">${esc(l.cta)} <span aria-hidden="true">→</span></button>
        </div>
      </div>
    </div>`;
  };

  root.insertAdjacentHTML("beforeend", `
  <div class="wm-body">
    <div class="wm-rain" aria-hidden="true"></div>
    <div class="wm-shade" aria-hidden="true"></div>
    <div class="wm-hero">
      <p class="wm-eyebrow">${esc(T.eyebrow)}</p>
      <h1>${T.titleLines.map(esc).join("<br>")}</h1>
      <p class="wm-sub">${esc(T.sub)}</p>
      <div class="wm-search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>
        <input type="search" placeholder="${esc(T.placeholder)}" aria-label="${esc(T.placeholder)}" autocomplete="off" />
        <ul class="search-results" role="listbox" hidden></ul>
      </div>
      <button type="button" class="wm-galaxy" title="${esc(T.galaxyNote)}">${esc(T.galaxyLink)} <span aria-hidden="true">→</span></button>
    </div>
    <div class="wm-stage" role="group" aria-label="Wissensebenen">${LAYERS.map(layerHtml).join("")}</div>
    <nav class="wm-index" aria-label="Wissensebenen">${LAYERS.map((l, i) => `<button type="button" class="wm-idx" data-i="${i}"><span>${l.nr}</span> ${esc(l.label)}</button>`).join("")}</nav>
    <p class="wm-hint">${ico("pin")}<span>${esc(touch ? T.hintTouch : T.hintMouse)}</span></p>
  </div>`);

  const q = <E extends HTMLElement>(sel: string) => root.querySelector<E>(sel)!;
  const body = q(".wm-body"), stage = q(".wm-stage"), rainHost = q(".wm-rain");
  const layers = [...root.querySelectorAll<HTMLElement>(".wm-layer")];
  const idx = [...root.querySelectorAll<HTMLElement>(".wm-idx")];
  const entryRuns = LAYERS.map((l) => l.entries.map(resolve).filter((x): x is Resolved => !!x).map((x) => x.run));
  mountSlots(root);

  const rain = createCodeRain(rainHost, { reduceMotion: api.reduceMotion });

  // ---- selection
  let active = -1;
  let settle = 0;

  function focusRain() {
    const plane = layers[active]?.querySelector<HTMLElement>(".wm-plane");
    if (!plane) return;
    const r = plane.getBoundingClientRect(), h = rainHost.getBoundingClientRect();
    if (!r.width) return; // the page is not on screen yet
    rain.focus(r.left + r.width / 2 - h.left, r.width / 2);
  }

  function select(i: number) {
    if (i === active || i < 0 || i >= layers.length) return;
    active = i;
    stage.style.setProperty("--a", String(i));
    layers.forEach((el, k) => {
      const on = k === i;
      el.classList.toggle("is-open", on);
      el.querySelector(".wm-label")!.setAttribute("aria-expanded", String(on));
      el.querySelector(".wm-pin")!.toggleAttribute("inert", !on);
    });
    idx.forEach((b, k) => (k === i ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current")));
    focusRain();
    clearTimeout(settle);
    settle = window.setTimeout(focusRain, 700); // after the layer has finished growing
  }

  const open = (i: number) => api.openTarget(LAYERS[i].to);

  // a click opens the page; on a touch screen the first tap only opens the layer
  function activate(i: number, e: Event) {
    const pe = e as PointerEvent;
    if (i !== active) { select(i); if (pe.pointerType === "touch" || touch) return; }
    open(i);
  }

  // hovering with a short delay, so sweeping across the layers does not make them flicker
  let intent = 0;
  const hover = (i: number) => { clearTimeout(intent); intent = window.setTimeout(() => select(i), 70); };
  const cancelHover = () => clearTimeout(intent);

  layers.forEach((el, i) => {
    el.addEventListener("pointerenter", (e) => { if ((e as PointerEvent).pointerType !== "touch") hover(i); });
    el.addEventListener("pointerleave", cancelHover);
    el.querySelector(".wm-label")!.addEventListener("focus", () => select(i));
    el.querySelector(".wm-label")!.addEventListener("click", (e) => { e.stopPropagation(); activate(i, e); });
    el.querySelector(".wm-plane")!.addEventListener("click", (e) => {
      const t = e.target as HTMLElement;
      if (t.closest(".wm-entry, .wm-open")) return;
      activate(i, e);
    });
    el.querySelector(".wm-open")!.addEventListener("click", (e) => { e.stopPropagation(); open(i); });
    el.querySelectorAll<HTMLElement>(".wm-entry").forEach((b) =>
      b.addEventListener("click", (e) => { e.stopPropagation(); entryRuns[i][Number(b.dataset.k)]?.(); }),
    );
  });
  idx.forEach((b, i) => {
    b.addEventListener("pointerenter", (e) => { if ((e as PointerEvent).pointerType !== "touch") hover(i); });
    b.addEventListener("pointerleave", cancelHover);
    b.addEventListener("focus", () => select(i));
    b.addEventListener("click", (e) => activate(i, e));
  });

  // arrow keys move between the layers like in a tab list
  body.addEventListener("keydown", (e) => {
    const t = e.target as HTMLElement;
    if (!t.matches(".wm-label, .wm-idx")) return;
    const k = e.key;
    if (k !== "ArrowRight" && k !== "ArrowLeft") return;
    e.preventDefault();
    const n = (active + (k === "ArrowRight" ? 1 : layers.length - 1)) % layers.length;
    select(n);
    (t.matches(".wm-idx") ? idx[n] : layers[n].querySelector<HTMLElement>(".wm-label")!).focus();
  });

  // ---- parallax to the mouse (the code layers and the stage move a little against each other)
  let pending = false;
  body.addEventListener("pointermove", (e) => {
    if (api.reduceMotion || (e as PointerEvent).pointerType === "touch" || pending) return;
    pending = true;
    const px = (e.clientX / innerWidth - 0.5) * 2, py = (e.clientY / innerHeight - 0.5) * 2;
    requestAnimationFrame(() => {
      pending = false;
      rain.parallax(px, py);
      stage.style.setProperty("--px", px.toFixed(3));
      stage.style.setProperty("--py", py.toFixed(3));
    });
  });

  // ---- search (same knowledge search as the menu on the home page)
  const input = q<HTMLInputElement>(".wm-search input");
  initSearch(input, q(".wm-search .search-results"), (it) => {
    if (it.kind === "claim") api.openClaim(it.id, input);
    else api.openAtlas(it.id);
  });
  q(".wm-galaxy").addEventListener("click", () => api.openGalaxy());

  new ResizeObserver(() => focusRain()).observe(stage);
  select(1); // like on the reference image: the plants layer is open

  return {
    start() { rain.start(); focusRain(); },
    stop() { rain.stop(); },
    /** entry from the home page: layers rise out of the code */
    intro() {
      if (api.reduceMotion) return;
      // the layers carry a tilt in CSS, so the rise runs through a CSS variable instead of an inline transform
      gsap.from(layers, { "--ty": "46px", opacity: 0, duration: 0.9, stagger: 0.09, ease: "power3.out", clearProps: "opacity,--ty" });
      gsap.from(root.querySelectorAll(".wm-hero > *"), { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, delay: 0.15, ease: "power2.out", clearProps: "opacity,transform" });
    },
    /** opens one layer without leaving the page */
    show(id: Layer["id"]) { select(LAYERS.findIndex((l) => l.id === id)); },
  };
}
