import { atlas } from "../data/atlas";
import { claims } from "../data/claims";
import { BODY_ORGANS } from "../data/body";
import { createBodyStage } from "./bodyStage";
import { organById, organDetailHtml } from "./organDetail";
import { BANDS, CONDITIONS, DIY, FREQUENCIES, ORGANS, TILES } from "../data/home";
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
  openBody(organ?: string): void;
  openChakra(id?: string): void;
  openBreath(): void;
  openPlaces(id?: string): void;
  openCultures(): void;
  openNutrients(): void;
  openEnergy(): void;
  openLab(): void;
  openPlants(): void;
  openProduce(): void;
  openTrees(): void;
  openMinerals(): void;
  openCrystals(): void;
  openClaim(id: string, from: HTMLElement): void;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const glyph = (e: { category: string }) => (e.category === "kristall" ? "◆" : "✿"); // placeholder mark until the picture exists
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
      ${slot(t.slot, "tile-img", 'data-fit="cover" data-sizes="(max-width: 700px) 50vw, (max-width: 1200px) 25vw, 13vw"')}<span class="tile-text"><strong>${esc(t.title)}</strong><small>${esc(t.sub)}</small></span>${soon ? '<span class="soon-tag">bald</span>' : ""}</button>`;
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
        <ul class="organs" aria-label="Organe und Systeme">${ORGANS.map((o) => `<li><button data-organ="${esc(o)}" aria-pressed="false">${esc(o)}</button></li>`).join("")}</ul>
        <div class="body-main">
          <div class="body-stage" id="body-stage" role="group" aria-label="Anatomie: Organ anklicken"></div>
          <p class="body-hint" id="body-hint">Wähle ein Organ in der Liste oder direkt am Körper.</p>
          <div class="organ-card" id="organ-card" hidden aria-live="polite"></div>
        </div>
      </div>
      <p class="fine">Die Pflanzen und Nährstoffe, die nach einem Klick auf ein Organ erscheinen, sind vorläufige Platzhalter-Zuordnungen (ungeprüft, ohne Quelle) und keine Behandlungsempfehlungen. Sie werden durch bewertete Aussagen mit Quellen ersetzt.</p>
      <button class="cta ghost" data-act="body">Körper-Atlas öffnen <span aria-hidden="true">→</span></button>
    </section>

    <section class="sec" id="natur" aria-labelledby="h-plants">
      <div class="sec-head"><div><h2 id="h-plants">Pflanzen-Atlas</h2><p>Pflanzen, ihre Inhaltsstoffe und überlieferten Anwendungen – jeweils mit Quellen und Belegstufe.</p></div>
        <button class="link" data-act="plants">Alle Pflanzen <span aria-hidden="true">→</span></button></div>
      ${featured ? `<div class="plant-grid">
        <article class="plant-feature">
          ${slot(`atlas-${featured.id}` as `atlas-${string}`, "plant-img atlas-fallback", `style="--tint:${featured.model.color}" data-glyph="${glyph(featured)}"`)}
          <div class="plant-info">
            <h3>${esc(featured.name)}</h3><p class="latin">${esc(featured.latin)}</p>
            <ul class="facts">${featured.facts.slice(0, 3).map((f) => `<li><span>${esc(f.label)}</span> ${esc(f.value)}</li>`).join("")}</ul>
            ${featured.associations[0] ? `<p class="trad"><span>Überlieferung</span> ${esc(featured.associations[0].target)} · ${esc(featured.associations[0].system)}</p>` : ""}
            ${featuredClaim ? `<p><button class="status-btn" data-claim="${esc(featuredClaim.id)}" style="--c:var(--lvl-${featuredClaim.level})"><span class="status" style="--c:var(--lvl-${featuredClaim.level})">${statusOf(featuredClaim)}</span> Belege ansehen</button></p>` : ""}
            <button class="cta ghost small" data-act="atlas-entry" data-id="${featured.id}">Pflanze erkunden <span aria-hidden="true">→</span></button>
          </div>
        </article>
        <ul class="plant-list">${list.map((e) => `<li><button data-act="atlas-entry" data-id="${e.id}">${slot(`atlas-${e.id}` as `atlas-${string}`, "pl-img atlas-fallback", `style="--tint:${e.model.color}" data-glyph="${glyph(e)}"`)}<span><strong>${esc(e.name)}</strong><small>${esc(e.associations[0]?.target ?? CATEGORY_LABEL[e.category])}</small></span><i aria-hidden="true">›</i></button></li>`).join("")}</ul>
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

  <div class="bands">${BANDS.map((b) => `<section class="band" id="${b.id}">${slot(b.slot, "band-bg", 'data-fit="cover"')}<div><h2>${esc(b.title)}</h2><p>${esc(b.text)}</p>${"cultures" in b ? `<button class="cta ghost small" data-act="cultures">${esc(b.button)} <span aria-hidden="true">→</span></button>` : "places" in b ? `<button class="cta ghost small" data-act="places">${esc(b.button)} <span aria-hidden="true">→</span></button>` : "fx" in b ? `<button class="cta ghost small" data-act="fx" data-mode="${b.fx}">${esc(b.button)} <span aria-hidden="true">→</span></button>` : `<button class="cta ghost small" data-act="soon">${esc((b as { button: string }).button)} <span class="soon-tag inline">bald</span></button>`}</div></section>`).join("")}</div>

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
      else if (a.type === "body") api.openBody();
      else if (a.type === "chakra") api.openChakra();
      else if (a.type === "breath") api.openBreath();
      else if (a.type === "places") api.openPlaces();
      else if (a.type === "cultures") api.openCultures();
      else if (a.type === "nutrients") api.openNutrients();
      else if (a.type === "energy") api.openEnergy();
      else if (a.type === "lab") api.openLab();
      else if (a.type === "plants") api.openPlants();
      else if (a.type === "produce") api.openProduce();
      else if (a.type === "trees") api.openTrees();
      else if (a.type === "minerals") api.openMinerals();
      else if (a.type === "crystals") api.openCrystals();
      else say("Dieser Bereich folgt in einer späteren Phase.");
      return;
    }
    const act = t.closest<HTMLElement>("[data-act]");
    if (act) {
      const k = act.dataset.act;
      if (k === "universe") api.openUniverse();
      else if (k === "plants") api.openPlants();
      else if (k === "body") api.openBody();
      else if (k === "places") api.openPlaces();
      else if (k === "cultures") api.openCultures();
      else if (k === "fx") api.openFx(act.dataset.mode === "geometrie" ? "geometrie" : "kymatik");
      else if (k === "atlas-all") api.openAtlas(null);
      else if (k === "atlas-entry") api.openAtlas(null, act.dataset.id);
      else say("Dieser Bereich folgt in einer späteren Phase.");
      return;
    }
    const organ = t.closest<HTMLElement>(".organs [data-organ]");
    if (organ) {
      const id = BODY_ORGANS.find((o) => o.name.startsWith(organ.dataset.organ!))?.id;
      if (id) bodyStage.select(id); else say(`${organ.dataset.organ}: Dieser Bereich folgt in einer späteren Phase.`);
      return;
    }
    const oc = t.closest<HTMLElement>("[data-open-body]");
    if (oc) { api.openBody(oc.dataset.openBody); return; }
    const at = t.closest<HTMLElement>("[data-atlas]");
    if (at) { api.openAtlas(null, at.dataset.atlas!); return; }
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

  // body explorer: pins on the picture, a click zooms in and shows the organ card; plants / nutrients appear only then
  const card = document.getElementById("organ-card")!;
  const hint = document.getElementById("body-hint")!;
  const narrow = matchMedia("(max-width: 700px)");
  const bodyStage = createBodyStage(document.getElementById("body-stage")!, {
    reduceMotion,
    focus: (w, h) => [narrow.matches ? w / 2 : w * 0.26, h * 0.5],
    onSelect: (id) => {
      const o = id ? organById(id) : undefined;
      root.querySelectorAll<HTMLElement>(".organs [data-organ]").forEach((b) => b.setAttribute("aria-pressed", String(!!o && o.name.startsWith(b.dataset.organ!))));
      hint.hidden = !!o;
      card.hidden = !o;
      if (o) {
        card.innerHTML = organDetailHtml(o) + `<button class="cta ghost small" data-open-body="${o.id}">Auf der Körper-Seite ansehen <span aria-hidden="true">→</span></button>`;
        mountSlots(card);
        card.scrollTop = 0;
      }
    },
  });
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && bodyStage.current) bodyStage.select(null); });

  const lab = initFreqLab(document.getElementById("freqlab")!.closest(".lab") as HTMLElement, reduceMotion);
  return { stopAudio: lab.stop, say, scrollTo };
}
