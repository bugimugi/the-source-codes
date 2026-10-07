import { atlas } from "../data/atlas";
import { claims } from "../data/claims";
import { AREA_LABEL, CATEGORY_LABEL, LEVEL_LABEL, type AtlasCategory, type Claim } from "../data/types";
import { modeForHz, modeHz } from "../data/cymatics";
import { CATS, CAT_EMPTY, CLOSING, FREQ_NOTICE, ANALYZER_NOTE, HERO_CHIPS, HZ_LORE, HZ_MAX, HZ_MIN, HZ_NOTE_432, LEVEL_PILL, LEVEL_POS, ORBS, POWER, WORLD, noteText, type Power } from "../data/freqpage";
import { CHAKRAS } from "../data/chakras";
import { createTone } from "../audio/tone";
import { hasAsset, mountSlots } from "../assets/slots";
import { esc } from "./dossierParts";
import { ico } from "./icons";
import { itemImage } from "./landing";
import { sittingSvg } from "./crystalArt";
import { POWER_ART, amplitude, drawPlate, gaugeSvg, landscapeSvg, resonanceSvg, waveRingsSvg } from "./freqArt";

export interface FrequencyApi {
  reduceMotion: boolean;
  /** the interactive cymatics / geometry page */
  openFx(mode: "kymatik" | "geometrie"): void;
  openAtlas(id: string): void;
  openEnergy(): void;
  openAnatomy(): void;
  openMinerals(): void;
  openCultures(): void;
  openUniverse(): void;
  openClaim(id: string, from: HTMLElement): void;
}

const claimById = (id: string): Claim | undefined => claims.find((c) => c.id === id);
const SHORT: Record<string, string> = { claimed: "Behauptung · ungeprüft", hypothesis: "Hypothese", supported: "Belegt, Deutung offen", established: "Gesichert", historical: "Historisch dokumentiert", unsupported: "Nicht belegt", refuted: "Widerlegt" };
const NAME: Record<string, string> = { claimed: "Behauptung", hypothesis: "Hypothese", supported: "Belegt", established: "Gesichert", historical: "Historisch", unsupported: "Nicht belegt", refuted: "Widerlegt" };
const chipFor = (id?: string) => {
  const c = id ? claimById(id) : undefined;
  return c ? `<span class="pp-lvl" style="--c:var(--lvl-${c.level})" title="${esc(LEVEL_LABEL[c.level])}">${esc(SHORT[c.level] ?? LEVEL_LABEL[c.level])}</span>` : "";
};
const claimLines = (ids: string[]) => ids.filter((id) => claimById(id)).map((id) => `<p class="fq-claimline">${chipFor(id)} <button class="pl-link" data-claim="${id}">${esc(claimById(id)!.short ?? id)}</button></p>`).join("");
const barPct = (level: string) => Math.round(((LEVEL_POS[level] ?? 0) + 1) * 50);

interface Item { main?: string; id: string; cat: string; title: string; sub: string; claims: string[]; atlasId?: string; hz?: number; facts: { label: string; value: string }[]; color: string; hay: string }

function buildItems(): Item[] {
  const items: Item[] = [];
  const catOf = (c: AtlasCategory) => (c === "kristall" ? "kristall" : c === "obst" || c === "gemuese" ? "nahrung" : "pflanze");
  for (const e of atlas) {
    const ids = e.claims.filter((id) => claimById(id));
    items.push({ id: `a-${e.id}`, cat: catOf(e.category), title: e.name, sub: `${CATEGORY_LABEL[e.category]} · ${e.latin}`, claims: ids, atlasId: e.id, facts: e.facts.slice(0, 3), color: e.model.color, hay: `${e.name} ${e.latin}`.toLowerCase() });
  }
  for (const f of HZ_LORE) {
    const ids = ["freq-solfeggio", ...(f.hz === 432 ? ["freq-432-440-pilot", "mineral-quarz-frequenz"] : []), ...(f.hz === 528 ? ["kristall-solfeggio"] : [])];
    items.push({ main: "freq-solfeggio", id: `hz-${f.hz}`, cat: "klang", title: `${f.hz} Hz`, sub: `Klang · „${f.label}“ (überliefert)`, claims: ids, hz: f.hz, color: "#a05aff", facts: [{ label: "Nächster Ton", value: noteText(f.hz) }, { label: "Schwingungen", value: `${f.hz} Zyklen pro Sekunde` }], hay: `${f.hz} hz ${f.label}`.toLowerCase() });
  }
  items.push({ id: "k-chladni", cat: "klang", title: "Chladni-Figuren", sub: "Klang · Kymatik", claims: ["chladni"], color: "#58d6e8", facts: [{ label: "Prinzip", value: "Sand sammelt sich an den ruhenden Knotenlinien einer schwingenden Platte" }], hay: "chladni figuren kymatik klangfiguren" });
  for (const c of claims.filter((x) => x.id.startsWith("mineral-"))) items.push({ id: `m-${c.id}`, cat: "material", title: c.short ?? c.id, sub: `Material · ${AREA_LABEL[c.area]}`, claims: [c.id], color: "#c07bff", facts: [], hay: `${c.short} ${c.statement}`.toLowerCase() });
  return items;
}

/**
 * The main frequency page "Alles schwingt.": hero with six circles, a signal analyzer (here the evidence level of the real claims
 * instead of an invented index), "Die Kraft der Frequenz" with four small demos, the frequency explorer (tone, nearest note, Chladni
 * plate, lore with its claim) and "Frequenz in der realen Welt". Physical statements are textbook knowledge; effects are claims.
 */
export function initFrequency(root: HTMLElement, api: FrequencyApi) {
  const scroll = root.querySelector<HTMLElement>(".pl-scroll")!;
  const q$ = <T extends HTMLElement>(s: string) => scroll.querySelector<T>(s)!;
  const smooth = (el: Element | null) => el?.scrollIntoView({ behavior: api.reduceMotion ? "auto" : "smooth", block: "start" });
  const items = buildItems();
  const tone = createTone();
  let cat = "pflanze", sel = "a-rosmarin", hz = 432, openPower = "", openWorld = "";

  const orbImg = (o: (typeof ORBS)[number]) => (hasAsset(`freq-kugel-${o.id}`) ? `<div class="fq-orb-img" data-slot="freq-kugel-${o.id}" data-fit="cover"></div>` : `<div class="fq-orb-img og-ph" style="--tint:${o.tint}">${ico(o.icon, "big")}</div>`);
  const artOr = (slot: string, art: string, cls: string) => (hasAsset(slot) ? `<div class="${cls}" data-slot="${slot}" data-fit="cover" data-sizes="(max-width: 700px) 90vw, 24vw"></div>` : `<div class="${cls} fq-art">${art}</div>`);

  scroll.innerHTML = `
    <div class="pl-hero fq-hero">
      ${hasAsset("freq-hero") ? `<div class="pl-hero-bg" data-slot="freq-hero" data-fit="cover" data-eager="true"></div>` : `<div class="fq-sky" aria-hidden="true">${landscapeSvg("fqs")}</div>`}
      <div class="pl-hero-text">
        <p class="fq-eyebrow">Frequenz</p>
        <h1>Alles schwingt.</h1>
        <p class="pl-lead">Von der kleinsten Schwingung bis zu den größten Strukturen des Universums – Frequenz ist Bewegung, Information und die Sprache der Realität.</p>
        <div class="fq-cta"><button class="fq-btn" data-to="fq-analyzer">Frequenz erkunden <span aria-hidden="true">→</span></button></div>
        <ul class="fq-chips" aria-label="Themen">${HERO_CHIPS.map((c) => `<li><button data-chip="${c.id}">${esc(c.label)}</button></li>`).join("")}</ul>
      </div>
      <div class="fq-stage" role="group" aria-label="Bereiche der Schwingung">
        ${hasAsset("freq-hero") ? "" : `<div class="fq-fig" data-slot="body-front" data-fit="contain" data-eager="true" aria-hidden="true"></div>${waveRingsSvg()}`}
        ${ORBS.map((o) => `<button class="fq-orb" data-orb="${o.id}" style="left:${o.x}%;top:${o.y}%;--tint:${o.tint}" aria-pressed="false">${orbImg(o)}<span>${o.title.map((t) => `<b>${esc(t)}</b>`).join("")}</span></button>`).join("")}
      </div>
    </div>
    <div class="fq-info" hidden aria-live="polite"></div>

    <section class="fq-band fq-analyzer" id="fq-analyzer" aria-labelledby="fq-an-h">
      <div class="fq-an-l">
        <h2 id="fq-an-h">Signal Analyzer</h2>
        <p class="fq-an-lead">Analysiere und erlebe Frequenzen in Echtzeit.</p>
        <p class="fq-an-text">Untersuche Klänge, Frequenzen, natürliche Signale, Pflanzen, Materialien und mehr – und entdecke, wie sie mit deinem Körper und deiner Umgebung interagieren können. Gezeigt wird, was die Quellenlage dazu sagt.</p>
        <form class="fq-search" role="search" autocomplete="off"><i>${ico("target")}</i><input type="search" class="fq-an-input" placeholder="Was möchtest du analysieren?" aria-label="Was möchtest du analysieren?" /><button type="submit" aria-label="Analysieren">${ico("arrow")}</button><ul class="fq-sug" role="listbox" hidden></ul></form>
        <ul class="fq-cats" aria-label="Kategorie">${CATS.map((c) => `<li><button data-cat="${c.id}" aria-pressed="false">${ico(c.icon)}<span>${c.label}</span></button></li>`).join("")}</ul>
      </div>
      <div class="fq-gauge" aria-live="polite">
        ${gaugeSvg()}
        <div class="fq-gauge-mid"><b class="fq-g-name"></b><small>BELEGSTUFE</small></div>
        <span class="fq-g-pill"></span>
        <p class="fq-g-note"></p>
      </div>
      <div class="fq-card" aria-live="polite"></div>
      <p class="fq-an-foot">${esc(ANALYZER_NOTE)}</p>
    </section>

    <section class="fq-band fq-power" id="fq-power" aria-labelledby="fq-pw-h">
      <h2 id="fq-pw-h">Die Kraft der Frequenz</h2>
      <p class="pl-sub">Die richtige Frequenz kann Signale empfangen, Materie bewegen, Prozesse verändern und mit lebenden Systemen interagieren – und manches davon ist nur behauptet.</p>
      <ul class="fq-power-row">${POWER.map((p) => `<li class="fq-pcard" data-pcard="${p.id}">${artOr(p.slot, POWER_ART[p.id](), "fq-pimg")}<div class="fq-pbody"><h3>${esc(p.title)}</h3><p class="fq-psub">${esc(p.sub)}</p><p class="fq-ptext">${esc(p.text)}</p><button class="fq-btn ghost" data-power="${p.id}" aria-expanded="false">${esc(p.button)} <span aria-hidden="true">→</span></button></div></li>`).join("")}</ul>
      <div class="fq-drawer fq-power-text" hidden></div>
    </section>

    <section class="fq-band fq-explorer" id="fq-explorer" aria-labelledby="fq-ex-h">
      <div class="fq-ex-l">
        <h2 id="fq-ex-h">Frequenz Explorer</h2>
        <p class="fq-an-text">Erkunde bekannte Frequenzen, ihre überlieferte Wirkung und Beispiele aus Natur, Wissenschaft und Kultur.</p>
        <form class="fq-search fq-ex-search" role="search" autocomplete="off"><i>${ico("target")}</i><input type="search" class="fq-ex-input" placeholder="Frequenz suchen … (z. B. 432 Hz, 528 Hz)" aria-label="Frequenz in Hertz eingeben" /><button type="submit" aria-label="Frequenz anzeigen">${ico("arrow")}</button></form>
        <p class="fq-ex-msg" role="status" aria-live="polite"></p>
        <p class="fq-pop-h">Beliebte Frequenzen:</p>
        <ul class="fq-hzs" aria-label="Beliebte Frequenzen">${HZ_LORE.map((f) => `<li><button data-hz="${f.hz}" aria-pressed="false">${f.hz} Hz</button></li>`).join("")}</ul>
      </div>
      <div class="fq-ex-card">
        <div class="fq-ex-top"><div><h3 class="fq-ex-hz"></h3><p class="fq-ex-tag"></p></div>
          <div class="fq-ex-ctl"><button class="fq-play" aria-pressed="false" aria-label="Ton abspielen"><span></span></button><input type="range" class="fq-slider" min="${HZ_MIN}" max="${HZ_MAX}" step="1" value="${hz}" aria-label="Frequenz in Hertz" /></div></div>
        <div class="fq-ex-grid">
          <dl class="fq-boxes"><div><dt>Schwingungen</dt><dd class="fq-b-cyc"></dd></div><div><dt>Klang</dt><dd class="fq-b-note"></dd></div><div><dt>Kymatik</dt><dd class="fq-b-kym"></dd></div><div><dt>Wirkung (überliefert)</dt><dd class="fq-b-trad"></dd></div></dl>
          <div class="fq-plate-wrap"><canvas class="fq-plate" width="240" height="240" aria-label="Chladni-Muster der Platte (berechnetes Modell)"></canvas></div>
        </div>
        <p class="fq-ex-note"></p>
        <div class="fq-ex-claims"></div>
        <button class="fq-btn ghost fq-kym" data-fx>Kymatik visualisieren <span aria-hidden="true">→</span></button>
      </div>
    </section>

    <section class="fq-band fq-world" id="fq-world" aria-labelledby="fq-wd-h">
      <h2 id="fq-wd-h">Frequenz in der realen Welt</h2>
      <p class="pl-sub">Entdecke, wie Frequenzen in Natur, Technologie, Architektur, Geschichte und im Leben wirken.</p>
      <ul class="fq-world-row">${WORLD.map((w) => `<li><button data-world="${w.id}" aria-pressed="false">${hasAsset(w.slot) ? `<div class="fq-wimg" data-slot="${w.slot}" data-fit="cover"></div>` : `<div class="fq-wimg og-ph" style="--tint:${({ natur: "#3fae7a", koerper: "#e0507a", materialien: "#9a6aff", technologie: "#4a8aff", kulturen: "#d8a040", kosmos: "#7a5af0" } as Record<string, string>)[w.id]}">${ico(w.icon, "big")}</div>`}<span><strong>${esc(w.title)}</strong><small>${esc(w.sub)}</small></span></button></li>`).join("")}</ul>
      <div class="fq-drawer fq-world-text" hidden></div>
    </section>

    <section class="fq-closing" aria-label="Schlusswort">
      <div class="fq-close-bg">${hasAsset("freq-schluss") ? `<div class="fq-close-pic" data-slot="freq-schluss" data-fit="cover"></div>` : `<div class="fq-close-pic fq-art">${landscapeSvg("fqc")}<div class="fq-close-fig">${sittingSvg("fqf", CHAKRAS.map((c) => ({ id: c.id, color: c.color })).reverse(), [])}</div></div>`}</div>
      <div class="fq-close-text"><h2>${CLOSING.title.map(esc).join("<br>")}</h2><p>${esc(CLOSING.ask)}</p><small>${esc(CLOSING.note)}</small></div>
      <button class="fq-btn" data-fx>${esc(CLOSING.button)} <span aria-hidden="true">→</span></button>
    </section>
    <div class="pl-wrap"><p class="pl-notice">${esc(FREQ_NOTICE)}</p></div>`;

  // ---------------------------------------------------------------- signal analyzer
  const input = q$<HTMLInputElement>(".fq-an-input");
  const sug = q$<HTMLElement>(".fq-sug");
  const itemById = (id: string) => items.find((i) => i.id === id);
  /** the entry shown when a category is chosen: the mockup's defaults (Rosmarin, 432 Hz), else the first one that has a claim */
  const firstOf = (c: string) => (c === "pflanze" ? "a-rosmarin" : c === "klang" ? "hz-432" : (items.find((i) => i.cat === c && i.claims.length) ?? items.find((i) => i.cat === c))?.id ?? "");
  const bestClaim = (it: Item): Claim | undefined => (it.main ? claimById(it.main) : undefined) ?? it.claims.map(claimById).filter((c): c is Claim => !!c).sort((a, b) => (LEVEL_POS[b.level] ?? 0) - (LEVEL_POS[a.level] ?? 0))[0];

  function renderAnalyzer() {
    scroll.querySelectorAll<HTMLElement>("[data-cat]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cat === cat)));
    const it = itemById(sel);
    const card = q$(".fq-card"), needle = scroll.querySelector<SVGElement>(".fq-needle")!;
    if (!it || it.cat !== cat) {
      needle.style.transform = "rotate(0deg)";
      q$(".fq-g-name").textContent = "–"; q$(".fq-g-pill").textContent = ""; q$<HTMLElement>(".fq-g-pill").style.setProperty("--c", "#6a7a8a");
      q$(".fq-g-note").textContent = "";
      card.innerHTML = `<p class="fq-empty">${esc(CAT_EMPTY[cat] ?? "Zu dieser Kategorie gibt es noch keinen Eintrag.")}</p>`;
      return;
    }
    const best = bestClaim(it);
    const lvl = best?.level ?? "claimed";
    needle.style.transform = `rotate(${(LEVEL_POS[lvl] ?? 0) * 90}deg)`;
    q$(".fq-g-name").textContent = best ? NAME[lvl] : "Keine Aussage";
    const pill = q$<HTMLElement>(".fq-g-pill"); pill.textContent = best ? LEVEL_PILL[lvl] : "Keine Aussage veröffentlicht"; pill.style.setProperty("--c", best ? `var(--lvl-${lvl})` : "#6a7a8a");
    q$(".fq-g-note").textContent = best ? `„${best.statement}“` : "Zu diesem Eintrag gibt es noch keine veröffentlichte Aussage mit Belegstufe.";
    const e = it.atlasId ? atlas.find((x) => x.id === it.atlasId) : undefined;
    const pic = e ? itemImage(e, "fq-card-img") : `<div class="fq-card-img og-ph" style="--tint:${it.color}">${ico(it.cat === "klang" ? "sound" : "hex", "big")}</div>`;
    const cl = it.claims.map(claimById).filter((c): c is Claim => !!c).slice(0, 4);
    card.innerHTML = `<div class="fq-card-head">${pic}<div><h3>${esc(it.title)}</h3><p>${esc(it.sub)}</p></div></div>
      <ul class="fq-rows">${cl.map((c) => `<li><button data-claim="${c.id}"><i>${ico("book")}</i><span>${esc(c.short ?? c.id)}</span><em class="fq-bar" style="--c:var(--lvl-${c.level});--p:${barPct(c.level)}%"><u></u></em><small>${esc(NAME[c.level])}</small></button></li>`).join("") || `<li class="fq-none">Noch keine veröffentlichte Aussage.</li>`}</ul>
      ${it.facts.length ? `<ul class="fq-facts">${it.facts.map((f) => `<li><span>${esc(f.label)}</span><b>${esc(f.value)}</b></li>`).join("")}</ul>` : ""}
      <button class="fq-btn ghost" data-detail>${it.hz ? "Im Explorer öffnen" : it.atlasId ? "Details ansehen" : "Aussage ansehen"} <span aria-hidden="true">→</span></button>`;
    mountSlots(card);
  }
  function select(id: string) { const it = itemById(id); if (!it) return; sel = id; cat = it.cat; renderAnalyzer(); }
  function suggest() {
    const w = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const list = w.length ? items.filter((i) => w.every((x) => i.hay.includes(x))).slice(0, 7) : [];
    sug.hidden = !list.length;
    sug.innerHTML = list.map((i) => `<li role="option"><button type="button" data-pick="${i.id}"><strong>${esc(i.title)}</strong><small>${esc(i.sub)}</small></button></li>`).join("");
  }
  input.addEventListener("input", suggest);
  input.addEventListener("keydown", (e) => { if (e.key === "Escape") { sug.hidden = true; } });
  q$<HTMLFormElement>(".fq-search").addEventListener("submit", (e) => { e.preventDefault(); const first = sug.querySelector<HTMLElement>("[data-pick]"); if (first) { select(first.dataset.pick!); sug.hidden = true; input.value = ""; } else if (input.value.trim()) { q$(".fq-card").innerHTML = `<p class="fq-empty">Dazu gibt es im Atlas noch keinen Eintrag. Probiere eine Pflanze (z. B. Rosmarin), ein Lebensmittel, einen Kristall oder eine Frequenz wie 432.</p>`; } });
  document.addEventListener("click", (e) => { if (!(e.target as HTMLElement).closest(".fq-an-l .fq-search")) sug.hidden = true; });

  // ---------------------------------------------------------------- power cards
  function powerBody(p: Power): string {
    let demo = "";
    if (p.id === "radio") demo = `<div class="fq-demo"><label>Kondensator C <b class="fq-c-val"></b><input type="range" class="fq-c" min="40" max="400" step="1" value="180" /></label>
      <p>Spule L = 240 µH (festgehalten) → Eigenfrequenz <b class="fq-f-val"></b> <small class="fq-f-note"></small></p><p class="fq-small">Beispielrechnung nach f = 1 / (2π·√(L·C)); der Mittelwellen-Rundfunk liegt bei etwa 530–1700 kHz. Es ist eine Formel, kein Gerät.</p></div>`;
    else if (p.id === "resonanz") demo = `<div class="fq-demo"><div class="fq-res">${resonanceSvg(0.12, 1)}</div>
      <div class="fq-sliders"><label>Dämpfung <b class="fq-z-val"></b><input type="range" class="fq-z" min="0.04" max="0.6" step="0.01" value="0.12" /></label>
      <label>Anregung <b class="fq-r-val"></b><input type="range" class="fq-r" min="0.1" max="2" step="0.01" value="1" /></label></div><p class="fq-res-out"></p><p class="fq-small">Lehrbuchformel eines gedämpften, angetriebenen Oszillators: A = 1 / √((1 − r²)² + (2ζr)²).</p></div>`;
    else if (p.id === "levitation") demo = `<div class="fq-demo"><p>Ultraschall in Luft (Schallgeschwindigkeit ≈ 343 m/s). Tippe eine Frequenz:</p><ul class="fq-hzs small">${[20, 40, 100].map((k) => `<li><button data-lev="${k}" aria-pressed="${k === 40}">${k} kHz</button></li>`).join("")}</ul><p class="fq-lev-out"></p><p class="fq-small">Wellenlänge λ = c / f; in einer stehenden Welle liegen die Druckknoten λ/2 auseinander. Übliche Levitations-Aufbauten arbeiten bei etwa 40 kHz.</p></div>`;
    else demo = `<table class="fq-table"><caption>Schall nach Frequenz (Größenordnungen)</caption><tr><th>Hörschall</th><td>20 Hz – 20 kHz</td></tr><tr><th>Ultraschall</th><td>über 20 kHz</td></tr><tr><th>Bildgebung (Sonografie)</th><td>etwa 2–15 MHz</td></tr><tr><th>Fokussierter Ultraschall</th><td>etwa 0,2–1 MHz, Brennpunkt wenige Millimeter</td></tr></table>`;
    return `<h3>${esc(p.title)} <small>${esc(p.sub)}</small></h3><p>${esc(p.detail)}</p>${demo}${claimLines(p.claims)}<p class="fq-note">Lehrbuchwissen, Source pending verification.</p>`;
  }
  function wirePower(p: Power) {
    const box = q$(".fq-power-text");
    if (p.id === "radio") {
      const c = box.querySelector<HTMLInputElement>(".fq-c")!;
      const upd = () => { const C = Number(c.value) * 1e-12, f = 1 / (2 * Math.PI * Math.sqrt(240e-6 * C)); box.querySelector(".fq-c-val")!.textContent = `${c.value} pF`; box.querySelector(".fq-f-val")!.textContent = `${Math.round(f / 1000)} kHz`; box.querySelector(".fq-f-note")!.textContent = f >= 530e3 && f <= 1700e3 ? "(im Mittelwellenbereich)" : "(außerhalb des Mittelwellenbereichs)"; };
      c.addEventListener("input", upd); upd();
    } else if (p.id === "resonanz") {
      const z = box.querySelector<HTMLInputElement>(".fq-z")!, r = box.querySelector<HTMLInputElement>(".fq-r")!;
      const upd = () => {
        const zz = Number(z.value), rr = Number(r.value), a = amplitude(rr, zz);
        box.querySelector(".fq-res")!.innerHTML = resonanceSvg(zz, rr);
        box.querySelector(".fq-z-val")!.textContent = zz.toFixed(2); box.querySelector(".fq-r-val")!.textContent = `${rr.toFixed(2)} × Eigenfrequenz`;
        box.querySelector(".fq-res-out")!.textContent = `Der Ausschlag ist ${a.toFixed(1)}-mal so groß wie bei sehr langsamer Anregung${a > 10 ? " (die Kurve ist hier abgeschnitten)" : ""}.`;
      };
      z.addEventListener("input", upd); r.addEventListener("input", upd); upd();
    } else if (p.id === "levitation") {
      const upd = (k: number) => { const lam = 343 / (k * 1000); box.querySelectorAll<HTMLElement>("[data-lev]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.lev) === k))); box.querySelector(".fq-lev-out")!.textContent = `Bei ${k} kHz: Wellenlänge ${(lam * 1000).toFixed(1)} mm, Druckknoten alle ${((lam * 1000) / 2).toFixed(1)} mm. Schwebende Teilchen müssen kleiner sein als die halbe Wellenlänge.`; };
      box.querySelectorAll<HTMLElement>("[data-lev]").forEach((b) => b.addEventListener("click", () => upd(Number(b.dataset.lev)))); upd(40);
    }
  }
  function showPower(id: string) {
    const box = q$(".fq-power-text");
    scroll.querySelectorAll<HTMLElement>("[data-power]").forEach((b) => { const on = b.dataset.power === id && id !== openPower; b.setAttribute("aria-expanded", String(on)); });
    if (id === openPower) { openPower = ""; box.hidden = true; return; }
    openPower = id; const p = POWER.find((x) => x.id === id)!;
    box.hidden = false; box.innerHTML = powerBody(p); wirePower(p);
  }

  // ---------------------------------------------------------------- explorer
  const plate = q$<HTMLCanvasElement>(".fq-plate");
  function renderExplorer() {
    const lore = HZ_LORE.find((f) => f.hz === hz), md = modeForHz(hz);
    q$(".fq-ex-hz").textContent = `${hz} Hz`;
    q$(".fq-ex-tag").textContent = hz === 432 ? "Oft als natürliche Stimmung beschrieben." : lore ? `In der Klangheilkunde mit „${lore.label}“ verbunden.` : "Frei gewählte Frequenz.";
    q$(".fq-b-cyc").textContent = `${hz} Zyklen/Sekunde`;
    q$(".fq-b-note").textContent = `Nächster Ton: ${noteText(hz)}`;
    q$(".fq-b-kym").textContent = `Plattenmodell: Modus (${md.m}, ${md.n}), Modellfrequenz ${modeHz(md)} Hz`;
    q$(".fq-b-trad").innerHTML = lore ? `${esc(lore.trad)}` : "Keine überlieferte Zuschreibung bekannt.";
    q$(".fq-ex-note").textContent = hz === 432 ? HZ_NOTE_432 : lore ? "Die Zuschreibung stammt aus der modernen Klangheilkunde; eine Wirkung ist nicht belegt." : "";
    q$(".fq-ex-claims").innerHTML = lore ? claimLines(["freq-solfeggio", ...(hz === 432 ? ["freq-432-440-pilot"] : [])]) : "";
    q$<HTMLInputElement>(".fq-slider").value = String(hz);
    scroll.querySelectorAll<HTMLElement>("[data-hz]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.hz) === hz)));
    const play = q$(".fq-play"); play.setAttribute("aria-pressed", String(tone.playing)); play.setAttribute("aria-label", tone.playing ? "Ton stoppen" : "Ton abspielen"); play.classList.toggle("is-playing", tone.playing);
    drawPlate(plate, md.m, md.n);
    tone.setHz(hz);
  }
  const setHz = (v: number) => { hz = Math.min(HZ_MAX, Math.max(HZ_MIN, Math.round(v))); renderExplorer(); };
  q$<HTMLInputElement>(".fq-slider").addEventListener("input", (e) => setHz(Number((e.target as HTMLInputElement).value)));
  q$<HTMLFormElement>(".fq-ex-search").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = parseFloat(q$<HTMLInputElement>(".fq-ex-input").value.replace(",", "."));
    const msg = q$(".fq-ex-msg");
    if (!isFinite(v)) { msg.textContent = "Gib eine Zahl in Hertz ein, zum Beispiel 528."; return; }
    msg.textContent = v < HZ_MIN || v > HZ_MAX ? `Der Explorer spielt ${HZ_MIN} bis ${HZ_MAX} Hz; ${v} Hz liegt außerhalb.` : "";
    if (v >= HZ_MIN && v <= HZ_MAX) setHz(v);
  });
  const stopTone = () => { if (tone.playing) { tone.stop(); renderExplorer(); } };
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopTone(); });

  // ---------------------------------------------------------------- hero, world, clicks
  const info = q$(".fq-info");
  function showInfo(html: string) { info.hidden = !html; info.innerHTML = html; }
  function showOrb(id: string) {
    const o = ORBS.find((x) => x.id === id)!;
    scroll.querySelectorAll<HTMLElement>("[data-orb]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.orb === id)));
    showInfo(`<div class="fq-info-in"><h3>${o.title.map(esc).join(" · ")}</h3><p>${esc(o.text)}</p>${claimLines(o.claim ? [o.claim] : [])}${o.cat ? `<button class="fq-btn ghost" data-analyze="${o.cat}">Im Signal Analyzer ansehen <span aria-hidden="true">→</span></button>` : ""}<small>Lehrbuchwissen, Source pending verification.</small></div>`);
    smooth(info);
  }
  function showWorld(id: string) {
    const box = q$(".fq-world-text");
    scroll.querySelectorAll<HTMLElement>("[data-world]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.world === id && id !== openWorld)));
    if (id === openWorld) { openWorld = ""; box.hidden = true; return; }
    openWorld = id; const w = WORLD.find((x) => x.id === id)!;
    box.hidden = false;
    box.innerHTML = `<h3>${esc(w.title)} <small>${esc(w.sub)}</small></h3><p>${esc(w.text)}</p>${claimLines(w.claims)}<p><button class="fq-btn ghost" data-wlink="${w.link.act}">${esc(w.link.label)} <span aria-hidden="true">→</span></button></p><p class="fq-note">Lehrbuchwissen, Source pending verification.</p>`;
  }
  const WLINK: Record<string, () => void> = { energy: () => api.openEnergy(), anatomy: () => api.openAnatomy(), minerals: () => api.openMinerals(), cultures: () => api.openCultures(), universe: () => api.openUniverse() };

  scroll.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) { api.openClaim(cl.dataset.claim!, cl); return; }
    const to = t.closest<HTMLElement>("[data-to]");
    if (to) { smooth(q$(`#${to.dataset.to}`)); return; }
    const orb = t.closest<HTMLElement>("[data-orb]");
    if (orb) { showOrb(orb.dataset.orb!); return; }
    const ch = t.closest<HTMLElement>("[data-chip]");
    if (ch) {
      const c = HERO_CHIPS.find((x) => x.id === ch.dataset.chip)!, [kind, arg] = c.to.split(":");
      if (kind === "orb") showOrb(arg);
      else if (kind === "power") { if (openPower !== arg) showPower(arg); smooth(q$("#fq-power")); }
      else if (kind === "world") { if (openWorld !== arg) showWorld(arg); smooth(q$("#fq-world")); }
      else if (kind === "fx") { showInfo(`<div class="fq-info-in"><h3>${esc(c.label)}</h3><p>${esc(c.text)}</p><button class="fq-btn ghost" data-fx>Kymatik öffnen <span aria-hidden="true">→</span></button></div>`); smooth(info); }
      else { showInfo(`<div class="fq-info-in"><h3>${esc(c.label)}</h3><p>${esc(c.text)}</p></div>`); smooth(q$(`#${c.to}`)); }
      return;
    }
    const an = t.closest<HTMLElement>("[data-analyze]");
    if (an) { cat = an.dataset.analyze!; sel = firstOf(cat); renderAnalyzer(); smooth(q$("#fq-analyzer")); return; }
    const ct = t.closest<HTMLElement>("[data-cat]");
    if (ct) { cat = ct.dataset.cat!; sel = firstOf(cat); renderAnalyzer(); return; }
    const pk = t.closest<HTMLElement>("[data-pick]");
    if (pk) { select(pk.dataset.pick!); sug.hidden = true; input.value = ""; return; }
    if (t.closest("[data-detail]")) {
      const it = itemById(sel); if (!it) return;
      if (it.hz) { setHz(it.hz); smooth(q$("#fq-explorer")); } else if (it.atlasId) api.openAtlas(it.atlasId); else if (it.claims[0]) api.openClaim(it.claims[0], t);
      return;
    }
    const pw = t.closest<HTMLElement>("[data-power]");
    if (pw) { showPower(pw.dataset.power!); return; }
    if (t.closest(".fq-play")) { if (tone.playing) tone.stop(); else tone.start(hz); renderExplorer(); return; }
    const hb = t.closest<HTMLElement>("[data-hz]");
    if (hb) { setHz(Number(hb.dataset.hz)); q$(".fq-ex-msg").textContent = ""; return; }
    if (t.closest("[data-fx]")) { api.openFx("kymatik"); return; }
    const wd = t.closest<HTMLElement>("[data-world]");
    if (wd) { showWorld(wd.dataset.world!); return; }
    const wl = t.closest<HTMLElement>("[data-wlink]");
    if (wl) WLINK[wl.dataset.wlink!]?.();
  });

  mountSlots(scroll);
  renderAnalyzer();
  renderExplorer();
  return {
    start() { requestAnimationFrame(renderExplorer); },
    stop() { stopTone(); },
  };
}
