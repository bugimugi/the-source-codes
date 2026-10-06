import { atlas } from "../data/atlas";
import { claims } from "../data/claims";
import { BANDS, BUBBLES, CONDITIONS, DIY, FREQUENCIES, ORGANS, TILES } from "../data/home";
import { CATEGORY_LABEL, type AtlasCategory } from "../data/types";
import { mountSlots } from "../assets/slots";
import type { SlotName } from "../assets/registry";
import { searchItems } from "./search";
import { statusOf } from "./proofOverlay";
import { initFreqLab } from "./freqlab";

export interface HomeApi {
  openAtlas(category: AtlasCategory | null, id?: string): void;
  openUniverse(): void;
  openFx(mode: "kymatik" | "geometrie"): void;
  openClaim(id: string, from: HTMLElement): void;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const slot = (name: SlotName | `atlas-${string}`, cls = "", attrs = "") => `<div class="${cls}" data-slot="${name}" ${attrs}></div>`;

/** Builds the sections below the hero from data. Everything shown is derived from content/ or is clearly marked as upcoming. */
export function initHome(root: HTMLElement, api: HomeApi, reduceMotion: boolean) {
  const plants = atlas.filter((e) => ["kraut", "blume", "baum"].includes(e.category));
  const featured = atlas.find((e) => e.id === "kamille") ?? plants[0];
  const list = plants.filter((e) => e !== featured).slice(0, 5);
  const featuredClaim = featured?.claims.map((id) => claims.find((c) => c.id === id)).find(Boolean);

  const tile = (t: (typeof TILES)[number], i: number) => {
    const soon = t.action.type === "soon";
    return `<button class="tile${soon ? " is-soon" : ""}" data-tile="${i}" ${soon ? 'aria-disabled="true"' : ""}>
      ${slot(t.slot, "tile-img", 'data-fit="cover"')}<span class="tile-text"><strong>${esc(t.title)}</strong><small>${esc(t.sub)}</small></span>${soon ? '<span class="soon-tag">bald</span>' : ""}</button>`;
  };

  root.innerHTML = `
  <section class="sec" id="matrix-section" aria-labelledby="h-matrix">
    <div class="sec-head"><div><h2 id="h-matrix">Entdecke die Wissensmatrix</h2><p>Wähle einen Bereich und entdecke die Zusammenhänge.</p></div>
      <button class="link" data-act="universe">Gesamte Matrix anzeigen <span aria-hidden="true">→</span></button></div>
    <div class="tiles">${TILES.map(tile).join("")}</div>
  </section>

  <div class="split">
    <section class="sec" id="koerper" aria-labelledby="h-body">
      <h2 id="h-body">Der menschliche Körper</h2>
      <p>Entdecke, wie Pflanzen, Nährstoffe, Frequenzen und Lebensstil mit deinen Organen und Systemen zusammenhängen.</p>
      <div class="body-wrap">
        <ul class="organs" aria-label="Organe und Systeme">${ORGANS.map((o) => `<li><button data-organ="${esc(o)}">${esc(o)}</button></li>`).join("")}</ul>
        <div class="body-stage">
          <svg class="bubble-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${BUBBLES.map((b) => `<line x1="${b.x}" y1="${b.y}" x2="50" y2="50"/>`).join("")}</svg>
          ${slot("body-front", "body-img")}
          ${BUBBLES.map((b) => `<div class="bubble" style="left:${b.x}%;top:${b.y}%">${slot(b.slot, "bubble-img")}<span><strong>${esc(b.name)}</strong><small>${esc(b.kind)}</small></span></div>`).join("")}
        </div>
      </div>
      <p class="fine">Die Zuordnungen von Organen zu Pflanzen und Nährstoffen werden als bewertete Aussagen mit Quellen aufgebaut. Der interaktive Körper folgt.</p>
      <button class="cta ghost" data-act="soon">Körper-Atlas öffnen <span class="soon-tag inline">bald</span></button>
    </section>

    <section class="sec" id="natur" aria-labelledby="h-plants">
      <div class="sec-head"><div><h2 id="h-plants">Pflanzen-Atlas</h2><p>Pflanzen, ihre Inhaltsstoffe und überlieferten Anwendungen – jeweils mit Quellen und Belegstufe.</p></div>
        <button class="link" data-act="atlas-all">Alle Pflanzen <span aria-hidden="true">→</span></button></div>
      ${featured ? `<div class="plant-grid">
        <article class="plant-feature">
          ${slot(`atlas-${featured.id}` as `atlas-${string}`, "plant-img atlas-fallback", `style="--tint:${featured.model.color}"`)}
          <div class="plant-info">
            <h3>${esc(featured.name)}</h3><p class="latin">${esc(featured.latin)}</p>
            <ul class="facts">${featured.facts.slice(0, 3).map((f) => `<li><span>${esc(f.label)}</span> ${esc(f.value)}</li>`).join("")}</ul>
            ${featured.associations[0] ? `<p class="trad"><span>Überlieferung</span> ${esc(featured.associations[0].target)} · ${esc(featured.associations[0].system)}</p>` : ""}
            ${featuredClaim ? `<p><button class="status-btn" data-claim="${esc(featuredClaim.id)}" style="--c:var(--lvl-${featuredClaim.level})"><span class="status" style="--c:var(--lvl-${featuredClaim.level})">${statusOf(featuredClaim)}</span> Belege ansehen</button></p>` : ""}
            <button class="cta ghost small" data-act="atlas-entry" data-id="${featured.id}">Pflanze erkunden <span aria-hidden="true">→</span></button>
          </div>
        </article>
        <ul class="plant-list">${list.map((e) => `<li><button data-act="atlas-entry" data-id="${e.id}">${slot(`atlas-${e.id}` as `atlas-${string}`, "pl-img atlas-fallback", `style="--tint:${e.model.color}"`)}<span><strong>${esc(e.name)}</strong><small>${esc(e.associations[0]?.target ?? CATEGORY_LABEL[e.category])}</small></span><i aria-hidden="true">›</i></button></li>`).join("")}</ul>
      </div>` : ""}
    </section>
  </div>

  <div class="split">
    <section class="sec cond" id="beschwerden" aria-labelledby="h-cond">
      ${slot("condition-bg", "cond-bg", 'data-fit="cover"')}
      <div class="cond-body">
        <h2 id="h-cond">Condition Matrix</h2>
        <p>Finde Zusammenhänge zwischen Beschwerden, Pflanzen und überlieferten Anwendungen. Das ist Information und keine Behandlungsempfehlung.</p>
        <form class="cond-search" role="search"><input type="search" id="cond-q" placeholder="z. B. Kamille, Schlaf, Magen …" aria-label="Thema suchen" autocomplete="off"><button aria-label="Suchen">⌕</button></form>
        <div class="chips">${CONDITIONS.map((c) => `<button class="chip" data-cond="${esc(c)}">${esc(c)}</button>`).join("")}</div>
        <ul class="cond-results" id="cond-results" aria-live="polite"></ul>
        <p class="fine">Bei Beschwerden gehören Diagnose und Behandlung in ärztliche Hände. Wechselwirkungen mit Medikamenten sind möglich.</p>
      </div>
    </section>

    <section class="sec lab" id="frequenz" aria-labelledby="h-freq">
      <div class="sec-head"><div><h2 id="h-freq">Frequenz-Labor</h2><p>Höre, visualisiere und erforsche Frequenzen. Der Ton startet nur auf Klick, leise.</p></div></div>
      <div class="lab-grid">
        <div class="player" id="freqlab">
          <button class="fl-play" aria-pressed="false" aria-label="Ton abspielen"><span></span></button>
          <div><div class="fl-hz">432 Hz</div><div class="fl-label"></div></div>
          <canvas aria-hidden="true"></canvas>
        </div>
        ${slot("freq-orb", "orb")}
      </div>
      <div class="fl-chips">${FREQUENCIES.map((f) => `<button class="fl-chip" data-hz="${f.hz}" aria-pressed="false"><strong>${f.hz}</strong><small>${esc(f.label)}</small></button>`).join("")}</div>
      <p class="fine">Die Bezeichnungen sind überlieferte Zuschreibungen (Solfeggio-Lehre u. a.). Eine heilende Wirkung einzelner Frequenzen ist nicht belegt.</p>
      <button class="cta ghost small" data-act="fx" data-mode="kymatik">Kymatik in 3D öffnen <span aria-hidden="true">→</span></button>
    </section>
  </div>

  <div class="bands">${BANDS.map((b) => `<section class="band" id="${b.id}">${slot(b.slot, "band-bg", 'data-fit="cover"')}<div><h2>${esc(b.title)}</h2><p>${esc(b.text)}</p>${"fx" in b ? `<button class="cta ghost small" data-act="fx" data-mode="${b.fx}">${esc(b.button)} <span aria-hidden="true">→</span></button>` : `<button class="cta ghost small" data-act="soon">${esc(b.button)} <span class="soon-tag inline">bald</span></button>`}</div></section>`).join("")}</div>

  <div class="trio">
    <section class="sec" id="labor" aria-labelledby="h-diy"><h2 id="h-diy">DIY Labor</h2><p>Experimente, Rezepte und praktische Anwendungen.</p>
      <div class="diy">${DIY.map((d) => `<button data-act="soon" class="diy-card">${slot(d.slot, "diy-img", 'data-fit="cover"')}<strong>${esc(d.title)}</strong></button>`).join("")}</div></section>
    <section class="sec band-like" id="bibliothek" aria-labelledby="h-lib">${slot("library-bg", "band-bg", 'data-fit="cover"')}<div><h2 id="h-lib">Research Bibliothek</h2><p>Studien, historische Texte und Quellen, mit Belegstufe und Prüfstatus zu jeder Aussage.</p><button class="cta ghost small" data-act="universe">Bibliothek öffnen <span aria-hidden="true">→</span></button></div></section>
    <section class="sec band-like earth" id="verbunden" aria-labelledby="h-conn">${slot("connected-earth", "band-bg", 'data-fit="cover"')}<div><h2 id="h-conn">Alles ist verbunden</h2><p>„Natur, Mensch und Universum sind kein getrenntes System, sondern ein lebendiges Ganzes.“ – eine Leitidee, die wir Aussage für Aussage prüfen.</p><p class="motto">ENTDECKEN · VERSTEHEN · VERBINDEN · PRÜFEN · WEITERDENKEN</p></div></section>
  </div>`;

  // ---- behaviour
  const toast = document.getElementById("toast")!;
  let tt = 0;
  const say = (msg: string) => { toast.textContent = msg; toast.classList.add("show"); clearTimeout(tt); tt = window.setTimeout(() => toast.classList.remove("show"), 2600); };
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });

  root.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const tileEl = t.closest<HTMLElement>("[data-tile]");
    if (tileEl) {
      const a = TILES[Number(tileEl.dataset.tile)].action;
      if (a.type === "atlas") api.openAtlas(a.category);
      else if (a.type === "scroll") scrollTo(a.target);
      else if (a.type === "fx") api.openFx(a.mode);
      else say("Dieser Bereich folgt in einer späteren Phase.");
      return;
    }
    const act = t.closest<HTMLElement>("[data-act]");
    if (act) {
      const k = act.dataset.act;
      if (k === "universe") api.openUniverse();
      else if (k === "fx") api.openFx(act.dataset.mode === "geometrie" ? "geometrie" : "kymatik");
      else if (k === "atlas-all") api.openAtlas(null);
      else if (k === "atlas-entry") api.openAtlas(null, act.dataset.id);
      else say("Dieser Bereich folgt in einer späteren Phase.");
      return;
    }
    const organ = t.closest<HTMLElement>("[data-organ]");
    if (organ) { root.querySelectorAll(".organs button").forEach((b) => b.setAttribute("aria-pressed", String(b === organ))); say(`${organ.dataset.organ}: Der interaktive Körper-Atlas folgt.`); return; }
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) api.openClaim(cl.dataset.claim!, cl);
    const cond = t.closest<HTMLElement>("[data-cond]");
    if (cond) { (document.getElementById("cond-q") as HTMLInputElement).value = cond.dataset.cond!; runCondition(cond.dataset.cond!); }
  });

  const results = document.getElementById("cond-results")!;
  function runCondition(q: string) {
    results.replaceChildren();
    const hits = searchItems(q, 6);
    if (!hits.length) {
      const li = document.createElement("li");
      li.className = "none";
      li.textContent = "Dazu gibt es noch keinen Eintrag. Das Thema folgt; bis dahin gibt es hier keine Aussage.";
      results.append(li);
      return;
    }
    for (const h of hits) {
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.innerHTML = `<strong>${esc(h.title)}</strong><small>${esc(h.sub)}</small>`;
      b.addEventListener("click", () => (h.kind === "claim" ? api.openClaim(h.id, b) : api.openAtlas(null, h.id)));
      li.append(b);
      results.append(li);
    }
  }
  root.querySelector<HTMLFormElement>(".cond-search")!.addEventListener("submit", (e) => { e.preventDefault(); runCondition((document.getElementById("cond-q") as HTMLInputElement).value); });

  mountSlots(root);
  const lab = initFreqLab(document.getElementById("freqlab")!.closest(".lab") as HTMLElement, reduceMotion);
  return { stopAudio: lab.stop, say, scrollTo };
}
