import { atlas } from "../data/atlas";
import { claims } from "../data/claims";
import { LEVEL_LABEL, type Claim } from "../data/types";
import { CHAKRAS } from "../data/chakras";
import {
  ALL_HINT, BESCHWERDEN_NOTICE, COMPLAINTS, CRISIS, CRISIS_TEXT, EMERGENCY, EXAMPLE, EXAMPLE_TABS, EXAMPLES, HERO, INTERACTIONS, INTERACTION_NOTE, KIND_LABEL, MEDICAL, NOTES, ORBS, PLAN_NOTE, RECS,
  RED_FLAGS, SEARCH_TABS, SELF, SINCE, STEPS, WARN_GENERAL, type Complaint, type Rec,
} from "../data/beschwerden";
import { hasAsset, mountSlots } from "../assets/slots";
import { searchItems } from "./search";
import { esc } from "./dossierParts";
import { ico } from "./icons";
import { ph } from "./landing";
import { sittingSvg } from "./crystalArt";
import { landscapeSvg } from "./freqArt";

export interface BeschwerdenApi {
  reduceMotion: boolean;
  openAtem(): void;
  openNutrients(): void;
  openPlants(): void;
  openChakra(): void;
  openFx(): void;
  openCrystals(): void;
  openCultures(): void;
  openAtlas(id: string): void;
  openClaim(id: string, from: HTMLElement): void;
}

const claimById = (id: string): Claim | undefined => claims.find((c) => c.id === id);
const SHORT: Record<string, string> = { claimed: "Behauptung · ungeprüft", hypothesis: "Hypothese", supported: "Belegt, Deutung offen", established: "Gesichert", historical: "Historisch dokumentiert", unsupported: "Nicht belegt", refuted: "Widerlegt" };
const chipFor = (id?: string) => {
  const c = id ? claimById(id) : undefined;
  return c ? `<span class="pp-lvl" style="--c:var(--lvl-${c.level})" title="${esc(LEVEL_LABEL[c.level])}">${esc(SHORT[c.level] ?? LEVEL_LABEL[c.level])}</span>` : "";
};
const claimLine = (id?: string) => (id && claimById(id) ? `<p class="be-claimline">${chipFor(id)} <button class="pl-link" data-claim="${id}">${esc(claimById(id)!.short ?? id)}</button></p>` : "");
const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss");
const CHAKRA_Y: Record<string, number> = { krone: 3, stirn: 8.5, hals: 14, herz: 25, solar: 34, sakral: 42, wurzel: 49 };

/**
 * The landing page "Krankheiten & Beschwerden". It informs, it does not diagnose: a search over the library (with warning signs first), eight
 * complaint groups with general triggers, remedies with their evidence level and warning signs, a self-assessment that only mirrors the user's
 * entries, eight topic cards and a note sheet for the talk with the doctor. Nothing entered leaves the browser or is stored.
 */
export function initBeschwerden(root: HTMLElement, api: BeschwerdenApi) {
  const scroll = root.querySelector<HTMLElement>(".pl-scroll")!;
  const q$ = <T extends HTMLElement>(s: string) => scroll.querySelector<T>(s)!;
  const smooth = (el: Element | null) => el?.scrollIntoView({ behavior: api.reduceMotion ? "auto" : "smooth", block: "start" });
  const shown = COMPLAINTS.filter((c) => !c.hidden);
  const state = { tab: "suche", complaint: "", step: "", rec: "", exTab: "uebersicht", picked: new Set<string>(), recPicked: new Set<string>(), med: new Set<string>(), text: "", since: SINCE[1], strength: 5, emotion: "", umgebung: "", self: {} as Record<string, number> };

  const orbImg = (o: (typeof ORBS)[number]) => (hasAsset(`beschwerden-kugel-${o.id}`) ? `<div class="be-orb-img" data-slot="beschwerden-kugel-${o.id}" data-fit="cover"></div>` : `<div class="be-orb-img og-ph" style="--tint:${o.tint}">${ico(o.icon, "big")}</div>`);
  const recImg = (r: Rec) => ph(`beschwerden-empf-${r.id}`, "be-r-img", r.icon, "#4a7a8a");

  scroll.innerHTML = `
    <div class="pl-hero be-hero">
      ${hasAsset("beschwerden-hero") ? `<div class="pl-hero-bg" data-slot="beschwerden-hero" data-fit="cover" data-eager="true"></div>` : `<div class="be-sky" aria-hidden="true">${landscapeSvg("bes")}</div>`}
      <div class="be-top">
        <div class="pl-hero-text">
          <p class="be-eyebrow">${esc(HERO.eyebrow)}</p>
          <h1>${esc(HERO.title)}</h1>
          <p class="pl-lead">${esc(HERO.lead)}</p>
        </div>
        <div class="be-stage" role="group" aria-label="Bereiche, die deine Gesundheit beeinflussen">
          ${hasAsset("beschwerden-hero") ? "" : `<div class="be-fig" aria-hidden="true"><div class="be-fig-img" data-slot="body-front" data-fit="contain" data-eager="true"></div>${CHAKRAS.map((c) => `<i class="be-chakra" style="top:${CHAKRA_Y[c.id]}%;--c:${c.color}"></i>`).join("")}</div>`}
          ${ORBS.map((o) => `<button class="be-orb" data-orb="${o.id}" style="left:${o.x}%;top:${o.y}%;--tint:${o.tint}" aria-pressed="false">${orbImg(o)}<span><b>${esc(o.title)}</b>${o.lines.map((l) => `<em>${esc(l)}</em>`).join("")}</span></button>`).join("")}
        </div>
      </div>
      <div class="be-search">
        <div class="be-stabs" role="tablist">${SEARCH_TABS.map(([id, l]) => `<button role="tab" data-stab="${id}" aria-selected="${id === state.tab}">${l}</button>`).join("")}</div>
        <div class="be-sline">
          <form class="be-form-search" role="search" autocomplete="off"><i>${ico("target")}</i><input type="search" class="be-input" placeholder="Beschreibe deine Beschwerden, Symptome oder stelle eine Frage …" aria-label="Beschwerde suchen" /><button type="submit" aria-label="Suchen">${ico("arrow")}</button></form>
          <button class="be-ctx" data-ctx><i>${ico("scroll")}</i><span>Detaillierte Analyse<br>mit Kontextfragen</span></button>
        </div>
        <div class="be-ex"><span>Beispiele:</span>${EXAMPLES.map((e) => `<button data-ex="${esc(e)}">${esc(e)}</button>`).join("")}<button data-ex-more aria-label="Weitere anzeigen">…</button></div>
      </div>
    </div>
    <div class="be-result" hidden aria-live="polite"></div>
    <div class="be-orbinfo" hidden aria-live="polite"></div>

    <section class="be-band be-common" id="be-common" aria-labelledby="be-c-h">
      <div class="be-head"><h2 id="be-c-h">Häufige Beschwerden</h2><button class="be-all" data-az>Alle Beschwerden anzeigen <span aria-hidden="true">→</span></button></div>
      <ul class="be-cards">${shown.map((c) => `<li><button data-complaint="${c.id}" aria-pressed="false">${ph(`beschwerden-${c.id}`, "be-c-img", c.icon, c.tint)}<span><strong>${esc(c.title)}</strong><small>${esc(c.sub)}</small></span></button></li>`).join("")}</ul>
      <div class="be-drawer be-complaint" hidden aria-live="polite"></div>
    </section>

    <section class="be-band be-analyse" id="be-analyse" aria-label="Analyse">
      <div class="be-in">
        <h2><b>1.</b> Deine Angaben<br>für eine präzise Analyse</h2><p class="be-in-sub">Je mehr Informationen du gibst, desto genauer und hilfreicher sind die Hinweise. Alles bleibt in deinem Browser.</p>
        <ul class="be-steps">${STEPS.map((s) => `<li><button data-step="${s.id}" aria-pressed="false">${ico(s.icon)}<span>${esc(s.title)}</span></button></li>`).join("")}</ul>
      </div>
      <div class="be-ex-an">
        <h2><b>2.</b> Beispiel: ${esc(EXAMPLE.title)}</h2>
        <div class="be-extabs" role="tablist">${EXAMPLE_TABS.map(([id, l]) => `<button role="tab" data-extab="${id}" aria-selected="${id === state.exTab}">${l}</button>`).join("")}</div>
        <div class="be-ex-body"></div>
      </div>
      <div class="be-chak">
        <h3>Chakren (Überlieferung)</h3>
        <div class="be-chak-grid"><div class="be-chak-fig">${sittingSvg("bec", [...CHAKRAS].reverse().map((c) => ({ id: c.id, color: c.color })), [...CHAKRAS].map((c) => c.id))}</div>
        <ul class="be-chak-list">${[...CHAKRAS].reverse().map((c) => `<li style="--c:${c.color}"><i></i><span><strong>${esc(c.name)}</strong><small>${esc(c.themes)}</small></span></li>`).join("")}</ul></div>
        <p class="be-chak-note">Themen der Überlieferung, ohne Messwerte. Die Prozentzahlen der Vorlage waren Platzhalter.</p>
        <button class="be-btn" data-chakra>Zur Chakren-Seite <span aria-hidden="true">→</span></button>
      </div>
      <div class="be-life" id="be-life">
        <h3>Lifestyle &amp; Umgebung</h3>
        <p class="be-life-sub">Deine Selbsteinschätzung: 1 = kaum belastet, 5 = stark belastet.</p>
        <ul class="be-sliders">${SELF.map((s) => `<li><i>${ico(s.icon)}</i><label for="be-s-${s.id}"><span>${esc(s.label)}</span><small>${esc(s.hint)}</small></label><input id="be-s-${s.id}" type="range" min="1" max="5" step="1" value="3" data-self="${s.id}" data-set="no" aria-label="${esc(s.label)}: ${esc(s.hint)}, 1 bis 5" /><output data-out="${s.id}">–</output></li>`).join("")}</ul>
        <button class="be-btn" data-life-details>Details ansehen <span aria-hidden="true">→</span></button>
      </div>
      <div class="be-drawer be-form" hidden></div>
      <div class="be-drawer be-life-text" hidden></div>
    </section>

    <section class="be-band be-recs" id="be-recs" aria-labelledby="be-r-h">
      <div class="be-head"><h2 id="be-r-h"><b>3.</b> Mögliche Ansätze</h2><button class="be-btn" data-plan>Merkzettel erstellen <span aria-hidden="true">→</span></button></div>
      <p class="pl-sub">Eine ganzheitliche Auswahl an Themen, die Menschen bei Beschwerden nutzen, jeweils mit dem, was dazu belegt ist. Es ist kein persönlicher Plan.</p>
      <ul class="be-rcards">${RECS.map((r) => `<li class="be-rcard" data-rcard="${r.id}"><button class="be-pin" data-pin="${r.id}" aria-pressed="false" aria-label="${esc(r.title)} auf den Merkzettel">${ico("check")}</button>${recImg(r)}<div class="be-rbody"><h3>${esc(r.title)}</h3><ul>${r.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul><button class="be-btn small" data-rec="${r.id}" aria-expanded="false">Details <span aria-hidden="true">→</span></button></div></li>`).join("")}</ul>
      <div class="be-drawer be-rec-text" hidden aria-live="polite"></div>
      <div class="be-drawer be-plan" hidden aria-live="polite"></div>
    </section>

    <section class="be-notes" aria-label="Hinweise">
      <div class="be-note">
        <h3>${ico("balance")} ${esc(NOTES.hinweise.title)}</h3><ul>${NOTES.hinweise.items.map((i) => `<li>${ico("check")}${esc(i)}</li>`).join("")}</ul>
        <button class="be-btn" data-note="hinweise" aria-expanded="false">${esc(NOTES.hinweise.button)} <span aria-hidden="true">→</span></button>
      </div>
      <div class="be-note warn">
        <h3>${ico("shield")} ${esc(NOTES.wechsel.title)}</h3><ul>${NOTES.wechsel.items.map((i) => `<li>${ico("check")}${esc(i)}</li>`).join("")}</ul>
        <button class="be-btn" data-note="wechsel" aria-expanded="false">${esc(NOTES.wechsel.button)} <span aria-hidden="true">→</span></button>
      </div>
      <div class="be-note urgent">
        <h3>${ico("bolt")} ${esc(NOTES.arzt.title)}</h3><ul>${NOTES.arzt.items.map((i) => `<li>${ico("check")}${esc(i)}</li>`).join("")}</ul>
        <button class="be-btn" data-note="arzt" aria-expanded="false">${esc(NOTES.arzt.button)} <span aria-hidden="true">→</span></button>
      </div>
      <div class="be-drawer be-note-text" hidden aria-live="polite"></div>
    </section>
    <div class="pl-wrap"><p class="pl-notice">${esc(BESCHWERDEN_NOTICE)}</p></div>`;

  // ---------------------------------------------------------------- helpers
  const press = (attr: string, id: string) => scroll.querySelectorAll<HTMLElement>(`[${attr}]`).forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute(attr) === id)));
  const resultBox = q$(".be-result");
  const showResult = (html: string) => { resultBox.hidden = !html; resultBox.innerHTML = html; };
  const flagBox = (kind: "emergency" | "crisis") => `<div class="be-alert ${kind}"><h3>${ico("bolt")} ${kind === "crisis" ? "Du bist nicht allein" : esc(EMERGENCY.title)}</h3><p>${esc(kind === "crisis" ? CRISIS_TEXT : EMERGENCY.text)}</p></div>`;
  const atlasLink = (id: string) => { const e = atlas.find((x) => x.id === id); return e ? `<button class="pl-link" data-atlas="${id}">${esc(e.name)} im Atlas</button>` : ""; };

  // ---------------------------------------------------------------- search, A–Z
  const input = q$<HTMLInputElement>(".be-input");
  function search(qRaw: string) {
    const q = qRaw.trim();
    if (!q) { showResult(""); return; }
    const nq = norm(q);
    const words = nq.split(/\s+/).filter((w) => w.length > 2);
    const emergency = RED_FLAGS.some((r) => r.test(q)), crisis = CRISIS.test(q);
    const rx = (t: string) => new RegExp(`(^|[^a-z0-9])${norm(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
    // a group matches when one of its terms starts a word of the query (not just sits inside a longer word) or the query is the start of a term
    const groups = emergency || crisis ? [] : COMPLAINTS.filter((c) => c.terms.some((t) => { const nt = norm(t); return rx(t).test(nq) || (nq.length >= 3 && nt.startsWith(nq)) || words.some((w) => w.length >= 5 && nt.startsWith(w)); }));
    const others = searchItems(q, 6);
    const html = `${crisis ? flagBox("crisis") : ""}${emergency ? flagBox("emergency") : ""}
      ${groups.length ? `<h3>Passende Beschwerdegruppen</h3><ul class="be-hits">${groups.map((c) => `<li><button data-complaint="${c.id}">${ico(c.icon)}<span><strong>${esc(c.title)}</strong><small>${esc(c.sub)}</small></span><em>Warnzeichen und Hintergründe</em></button></li>`).join("")}</ul>` : ""}
      ${others.length ? `<h3>Weitere Einträge in der Bibliothek</h3><ul class="be-hits">${others.map((o) => `<li><button ${o.kind === "claim" ? `data-claim="${esc(o.id)}"` : `data-atlas="${esc(o.id)}"`}>${ico(o.kind === "claim" ? "book" : "leaf")}<span><strong>${esc(o.title)}</strong><small>${esc(o.sub)}</small></span></button></li>`).join("")}</ul>` : ""}
      ${!groups.length && !others.length && !emergency && !crisis ? `<p class="be-none">Dazu gibt es in der Bibliothek noch keinen Eintrag. Bei Beschwerden ist die Hausarztpraxis die erste Anlaufstelle; außerhalb der Sprechzeiten hilft der ärztliche Bereitschaftsdienst (116 117).</p>` : ""}
      <p class="be-note-s">Die Suche zeigt Wissen aus dieser Bibliothek. Sie erkennt keine Krankheiten und stellt keine Diagnose.</p>`;
    showResult(html);
    smooth(resultBox);
  }
  function renderAz() {
    const entries = COMPLAINTS.flatMap((c) => c.terms.map((t) => ({ t, c }))).sort((a, b) => a.t.localeCompare(b.t, "de"));
    const letters = [...new Set(entries.map((e) => e.t[0].toUpperCase()))];
    showResult(`<h3>Alle Beschwerden von A bis Z</h3><p class="be-note-s">${esc(ALL_HINT)}</p>
      <ul class="be-letters">${letters.map((l) => `<li><a href="#be-az-${l}" data-letter="${l}">${l}</a></li>`).join("")}</ul>
      <ul class="be-az">${entries.map((e, i) => `${i === 0 || entries[i - 1].t[0].toUpperCase() !== e.t[0].toUpperCase() ? `<li class="be-az-l" id="be-az-${e.t[0].toUpperCase()}">${e.t[0].toUpperCase()}</li>` : ""}<li><button data-complaint="${e.c.id}">${esc(e.t)} <small>${esc(e.c.title)}</small></button></li>`).join("")}</ul>`);
  }
  function setTab(id: string) {
    state.tab = id;
    scroll.querySelectorAll<HTMLElement>("[data-stab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.stab === id)));
    if (id === "az") { renderAz(); smooth(resultBox); }
    else if (id === "analyse") { showResult(""); smooth(q$("#be-analyse")); }
    else { showResult(""); input.focus(); }
  }
  q$<HTMLFormElement>(".be-form-search").addEventListener("submit", (e) => { e.preventDefault(); if (state.tab !== "suche") setTab("suche"); search(input.value); });

  // ---------------------------------------------------------------- complaints
  function showComplaint(id: string, jump = true) {
    const c = COMPLAINTS.find((x) => x.id === id)!;
    state.complaint = id;
    press("data-complaint", id);
    const box = q$(".be-complaint");
    box.hidden = false;
    box.innerHTML = `<h3>${esc(c.title)} <small>${esc(c.sub)}</small></h3><p class="be-what">${esc(c.what)}</p>
      <div class="be-three">
        <section><h4>Häufig genannte Zusammenhänge</h4><ul>${c.triggers.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>${claimLine(c.triggerClaim)}<p class="be-note-s">Allgemeines Lehrbuchwissen, keine Reihenfolge und keine Diagnose.</p></section>
        <section><h4>Was Menschen häufig ausprobieren</h4><ul class="be-ideas">${c.ideas.map((i) => `<li><div><b>${esc(i.label)}</b> <em class="${i.kind}">${KIND_LABEL[i.kind]}</em></div><p>${esc(i.text)}</p>${claimLine(i.claim)}${i.atlas ? `<p>${atlasLink(i.atlas)}</p>` : ""}</li>`).join("")}</ul></section>
        <section class="be-flags"><h4>${ico("shield")} Warnzeichen: wann zur Ärztin oder zum Arzt</h4><ul>${c.flags.map((f) => `<li>${esc(f)}</li>`).join("")}</ul><p class="be-note-s">Im Zweifel lieber einmal zu früh fragen. Notruf 112; Bereitschaftsdienst 116 117.</p></section>
      </div>
      ${c.crisis ? flagBox("crisis") : ""}
      <p class="be-actions"><button class="be-btn small" data-take="${c.id}" aria-pressed="${state.picked.has(c.id)}">${state.picked.has(c.id) ? "Auf dem Merkzettel" : "Auf den Merkzettel"}</button></p>
      <p class="be-note-s">Allgemeine Information, keine medizinische Beratung. Source pending verification.</p>`;
    if (jump) smooth(q$("#be-common"));
  }

  // ---------------------------------------------------------------- the example and the forms
  const exBody = q$(".be-ex-body");
  function renderExample() {
    scroll.querySelectorAll<HTMLElement>("[data-extab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.extab === state.exTab)));
    const t = state.exTab, img = `<div class="be-ex-img"><div data-slot="organ-brain" data-fit="contain"></div><div data-slot="organ-stomach" data-fit="contain"></div></div>`;
    if (t === "uebersicht") exBody.innerHTML = `<div class="be-ex-grid">${hasAsset("beschwerden-analyse") ? `<div class="be-ex-img one"><div data-slot="beschwerden-analyse" data-fit="contain"></div></div>` : img}<div><h4>Häufig genannte Zusammenhänge</h4><ul class="be-zus">${EXAMPLE.items.map((i) => `<li><i></i><span>${esc(i.label)}</span><small>${esc(i.short)}</small></li>`).join("")}</ul>${claimLine("beschwerde-kopfschmerz-ausloeser")}<p class="be-note-s">${esc(EXAMPLE.note)}</p></div></div>`;
    else if (t === "ursachen") exBody.innerHTML = `<ul class="be-why">${EXAMPLE.items.map((i) => `<li><strong>${esc(i.label)}</strong><p>${esc(i.text)}</p></li>`).join("")}</ul><p class="be-note-s">Lehrbuchwissen, Source pending verification.</p>`;
    else if (t === "empfehlungen") exBody.innerHTML = `<h4>Was Menschen in so einer Lage häufig tun (Alltag, keine Behandlung)</h4><ul class="be-why plain">${EXAMPLE.tips.map((i) => `<li>${esc(i)}</li>`).join("")}</ul><p class="be-note-s">${esc(EXAMPLE.note)}</p>`;
    else if (t === "chakren") exBody.innerHTML = `<p class="be-why-p">${esc(EXAMPLE.chakra)}</p><p><button class="be-btn small" data-chakra>Zur Chakren-Seite <span aria-hidden="true">→</span></button></p>`;
    else exBody.innerHTML = `<p class="be-why-p">${esc(EXAMPLE.details)}</p>`;
    mountSlots(exBody);
  }
  const formBox = q$(".be-form");
  function showStep(id: string) {
    state.step = id; press("data-step", id);
    const note = (txt: string) => `<p class="be-note-s">${esc(txt)}</p>`;
    let body = "";
    if (id === "beschwerden") body = `<h3>Beschwerden beschreiben</h3><div class="be-fields"><label>Was beschäftigt dich? Beschreibe es in eigenen Worten.<textarea class="be-ta" data-f="text" rows="3" placeholder="z. B. Kopfschmerzen am Nachmittag, schlecht eingeschlafen …">${esc(state.text)}</textarea></label>
      <label>Seit wann?<select data-f="since">${SINCE.map((s) => `<option${s === state.since ? " selected" : ""}>${s}</option>`).join("")}</select></label>
      <label>Wie stark? <b class="be-strength">${state.strength}</b> von 10<input type="range" min="1" max="10" value="${state.strength}" data-f="strength" /></label></div>
      <p class="be-pick-h">Passende Gruppen (für den Merkzettel):</p><div class="be-pick">${shown.map((c) => `<button data-take="${c.id}" aria-pressed="${state.picked.has(c.id)}">${esc(c.title)}</button>`).join("")}</div>`;
    else if (id === "lifestyle") body = `<h3>Lifestyle &amp; Gewohnheiten</h3><p>Stelle im Feld „Lifestyle &amp; Umgebung“ die Regler für Wasser, Schlaf, Ernährung, Bewegung, Alkohol und Nikotin ein.</p><p><button class="be-btn small" data-goto-life>Zu den Reglern <span aria-hidden="true">→</span></button></p>`;
    else if (id === "emotion") body = `<h3>Emotionale Verfassung</h3><div class="be-fields"><label>Was belastet dich gerade?<textarea class="be-ta" data-f="emotion" rows="3">${esc(state.emotion)}</textarea></label></div><p>Die Regler „Stress“ und „Soziale Verbindung“ findest du im Feld „Lifestyle &amp; Umgebung“. <button class="pl-link" data-goto-life>Zu den Reglern</button></p>${note("Bei Gedanken, dir etwas anzutun, oder in einer akuten Krise: Telefonseelsorge 0800 111 0 111 oder 0800 111 0 222, Notruf 112.")}`;
    else if (id === "umgebung") body = `<h3>Umgebung &amp; Arbeit</h3><div class="be-fields"><label>Wie ist deine Umgebung, wie dein Arbeitsalltag (Lärm, Luft, Schichten, Druck)?<textarea class="be-ta" data-f="umgebung" rows="3">${esc(state.umgebung)}</textarea></label></div><p>Den Regler „Umgebung“ findest du im Feld „Lifestyle &amp; Umgebung“. <button class="pl-link" data-goto-life>Zu den Reglern</button></p>`;
    else body = `<h3>Medizinischer Hintergrund</h3><p>Setze ein Häkchen, was zutrifft. Es erscheint jeweils ein Hinweis.</p><ul class="be-med">${MEDICAL.map((m) => `<li><label><input type="checkbox" data-med="${m.id}" ${state.med.has(m.id) ? "checked" : ""}> ${esc(m.label)}</label><p class="be-med-note" ${state.med.has(m.id) ? "" : "hidden"}>${esc(m.note)}</p></li>`).join("")}</ul>`;
    formBox.hidden = false;
    formBox.innerHTML = `${body}${note("Diese Angaben werden nicht ausgewertet und nicht gespeichert; sie kommen nur in deinen Merkzettel.")}`;
  }
  formBox.addEventListener("input", (e) => {
    const t = e.target as HTMLInputElement, f = t.dataset.f;
    if (f === "text") state.text = t.value; else if (f === "emotion") state.emotion = t.value; else if (f === "umgebung") state.umgebung = t.value;
    else if (f === "since") state.since = t.value; else if (f === "strength") { state.strength = Number(t.value); formBox.querySelector(".be-strength")!.textContent = t.value; }
  });
  formBox.addEventListener("change", (e) => {
    const t = e.target as HTMLInputElement;
    if (t.dataset.med) { if (t.checked) state.med.add(t.dataset.med); else state.med.delete(t.dataset.med); (t.closest("li")!.querySelector(".be-med-note") as HTMLElement).hidden = !t.checked; }
  });

  // ---------------------------------------------------------------- self-assessment
  const lifeBox = q$(".be-life-text");
  scroll.querySelectorAll<HTMLInputElement>("[data-self]").forEach((r) => r.addEventListener("input", () => {
    const v = Number(r.value), id = r.dataset.self!;
    state.self[id] = v; r.dataset.set = "yes";
    r.style.setProperty("--p", `${((v - 1) / 4) * 100}%`); r.style.setProperty("--h", String(120 - (v - 1) * 30));
    scroll.querySelector<HTMLElement>(`[data-out="${id}"]`)!.textContent = `${v}/5`;
  }));
  function showLife() {
    const set = SELF.filter((s) => state.self[s.id]).sort((a, b) => state.self[b.id] - state.self[a.id]);
    lifeBox.hidden = false;
    if (!set.length) { lifeBox.innerHTML = `<h3>Deine Selbsteinschätzung</h3><p>Stelle zuerst die Regler ein. Es geht um deine eigene Einschätzung, nicht um eine Messung.</p>`; return; }
    const top = set.filter((s) => state.self[s.id] >= 4).slice(0, 3);
    lifeBox.innerHTML = `<h3>Deine Selbsteinschätzung <small>${top.length ? "Wo es sich lohnen kann, anzusetzen" : "Alles im grünen Bereich nach deiner Einschätzung"}</small></h3>
      ${top.length ? `<ul class="be-tips">${top.map((s) => `<li><i>${ico(s.icon)}</i><div><strong>${esc(s.label)} <small>${state.self[s.id]}/5</small></strong><p>${esc(s.tip)}</p></div></li>`).join("")}</ul>` : `<p>Keine deiner Angaben liegt bei 4 oder 5. Wenn du dich trotzdem nicht wohlfühlst, sprich mit deiner Hausarztpraxis.</p>`}
      <p class="be-note-s">Das ist keine Messung und keine Diagnose, sondern eine Spiegelung deiner Angaben. Beschwerden gehören in ärztliche Abklärung.</p>
      <p><button class="be-btn small" data-links="atem">Atem-Seite öffnen <span aria-hidden="true">→</span></button> <button class="be-btn small" data-links="nutrients">Nährstoffe ansehen <span aria-hidden="true">→</span></button></p>`;
  }

  // ---------------------------------------------------------------- recommendations, plan
  function showRec(id: string) {
    const r = RECS.find((x) => x.id === id)!, box = q$(".be-rec-text");
    const open = state.rec !== id;
    scroll.querySelectorAll<HTMLElement>("[data-rec]").forEach((b) => b.setAttribute("aria-expanded", String(b.dataset.rec === id && open)));
    state.rec = open ? id : "";
    if (!open) { box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = `<h3>${esc(r.title)}</h3><p>${esc(r.text)}</p>${r.claims.map(claimLine).join("")}${r.atlas ? `<p>${r.atlas.map(atlasLink).join(" · ")}</p>` : ""}${r.link ? `<p><button class="be-btn small" data-rlink="${r.link.act}">${esc(r.link.label)} <span aria-hidden="true">→</span></button></p>` : ""}<p class="be-note-s">Information, keine Behandlungsanleitung. Wechselwirkungen mit Medikamenten und Schwangerschaft vorher klären. Source pending verification.</p>`;
  }
  function planText(): string {
    const L: string[] = ["MERKZETTEL FÜR DAS GESPRÄCH (kein Behandlungsplan)", ""];
    const groups = [...state.picked].map((id) => COMPLAINTS.find((c) => c.id === id)?.title).filter(Boolean);
    L.push(`Beschwerden: ${state.text.trim() || "(nicht beschrieben)"}`);
    L.push(`Seit wann: ${state.since}; Stärke: ${state.strength} von 10`);
    if (groups.length) L.push(`Bereiche: ${groups.join(", ")}`);
    if (state.emotion.trim()) L.push(`Belastungen: ${state.emotion.trim()}`);
    if (state.umgebung.trim()) L.push(`Umgebung und Arbeit: ${state.umgebung.trim()}`);
    const self = SELF.filter((s) => state.self[s.id]).map((s) => `${s.label} ${state.self[s.id]}`);
    if (self.length) L.push(`Selbsteinschätzung (1 = kaum belastet, 5 = stark): ${self.join(", ")}`);
    if (state.med.size) L.push(`Hintergrund: ${[...state.med].map((id) => MEDICAL.find((m) => m.id === id)?.label).join("; ")}`);
    const recs = [...state.recPicked].map((id) => RECS.find((r) => r.id === id)?.title).filter(Boolean);
    if (recs.length) L.push(`Themen, die ich besprechen möchte: ${recs.join(", ")}`);
    L.push("", "Fragen an Ärztin, Arzt oder Apotheke:", "- Passt das zu meinen Medikamenten und meiner Vorgeschichte?", "- Auf welche Warnzeichen soll ich achten?", "- Wie lange kann ich abwarten, bevor ich mich wieder melde?");
    return L.join("\n");
  }
  function showPlan() {
    const box = q$(".be-plan"); box.hidden = false;
    box.innerHTML = `<h3>Dein Merkzettel</h3><pre class="be-pre">${esc(planText())}</pre><p><button class="be-btn small" data-copy>In die Zwischenablage kopieren</button> <span class="be-copied" role="status"></span></p><p class="be-note-s">${esc(PLAN_NOTE)}</p>`;
    smooth(box);
  }

  // ---------------------------------------------------------------- notes
  function showNote(id: string) {
    const box = q$(".be-note-text");
    scroll.querySelectorAll<HTMLElement>("[data-note]").forEach((b) => b.setAttribute("aria-expanded", String(b.dataset.note === id)));
    box.hidden = false;
    if (id === "hinweise") box.innerHTML = `<h3>Wie diese Seite arbeitet</h3><p>${esc(NOTES.hinweise.more)}</p>`;
    else if (id === "wechsel") box.innerHTML = `<h3>Beispiele bekannter Wechselwirkungen</h3><ul class="be-int">${INTERACTIONS.map((i) => `<li><strong>${esc(i.name)}</strong><p>${esc(i.text)}</p></li>`).join("")}</ul>${claimLine("beschwerde-wechselwirkungen")}<p class="be-note-s">${esc(INTERACTION_NOTE)}</p>`;
    else box.innerHTML = `<h3>Warnzeichen</h3><div class="be-two"><section class="be-flags"><h4>${ico("bolt")} Sofort: Notruf 112</h4><ul>${WARN_GENERAL.emergency.map((f) => `<li>${esc(f)}</li>`).join("")}</ul></section><section class="be-flags soft"><h4>${ico("shield")} Zeitnah zur Ärztin oder zum Arzt</h4><ul>${WARN_GENERAL.soon.map((f) => `<li>${esc(f)}</li>`).join("")}</ul></section></div><p>${esc(WARN_GENERAL.text)}</p><p class="be-note-s">Auswahl, nicht vollständig. Source pending verification.</p>`;
    smooth(box);
  }

  // ---------------------------------------------------------------- hero orbs and clicks
  const orbBox = q$(".be-orbinfo");
  function showOrb(id: string) {
    const o = ORBS.find((x) => x.id === id)!;
    press("data-orb", id);
    orbBox.hidden = false;
    orbBox.innerHTML = `<div class="be-orbinfo-in"><h3>${esc(o.title)} <small>${o.lines.map(esc).join(" · ")}</small></h3><p>${esc(o.text)}</p>${claimLine(o.claim)}<button class="be-btn small" data-orbgo="${o.to}">${o.to === "selfcheck" ? "Zur Selbsteinschätzung" : "Mehr dazu ansehen"} <span aria-hidden="true">→</span></button><small>Lehrbuchwissen und Aussagen mit Belegstufe, Source pending verification.</small></div>`;
    smooth(orbBox);
  }
  const go = (act: string) => {
    if (act === "atem") api.openAtem(); else if (act === "nutrients") api.openNutrients(); else if (act === "plants") api.openPlants(); else if (act === "chakra") api.openChakra();
    else if (act === "freq") api.openFx(); else if (act === "crystals") api.openCrystals(); else if (act === "cultures") api.openCultures(); else if (act === "selfcheck") smooth(q$("#be-life"));
  };

  scroll.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) { api.openClaim(cl.dataset.claim!, cl); return; }
    const at = t.closest<HTMLElement>("[data-atlas]");
    if (at) { api.openAtlas(at.dataset.atlas!); return; }
    const orb = t.closest<HTMLElement>("[data-orb]");
    if (orb) { showOrb(orb.dataset.orb!); return; }
    const og = t.closest<HTMLElement>("[data-orbgo]");
    if (og) { go(og.dataset.orbgo!); return; }
    const st = t.closest<HTMLElement>("[data-stab]");
    if (st) { setTab(st.dataset.stab!); return; }
    if (t.closest("[data-ctx]")) { setTab("analyse"); return; }
    const ex = t.closest<HTMLElement>("[data-ex]");
    if (ex) { input.value = ex.dataset.ex!; if (state.tab !== "suche") { state.tab = "suche"; scroll.querySelectorAll<HTMLElement>("[data-stab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.stab === "suche"))); } search(ex.dataset.ex!); return; }
    if (t.closest("[data-ex-more], [data-az]")) { setTab("az"); return; }
    const letter = t.closest<HTMLElement>("[data-letter]");
    if (letter) { e.preventDefault(); smooth(q$(`#be-az-${letter.dataset.letter}`)); return; }
    const cp = t.closest<HTMLElement>("[data-complaint]");
    if (cp) { showComplaint(cp.dataset.complaint!); return; }
    const tk = t.closest<HTMLElement>("[data-take]");
    if (tk) {
      const id = tk.dataset.take!;
      if (state.picked.has(id)) state.picked.delete(id); else state.picked.add(id);
      scroll.querySelectorAll<HTMLElement>(`[data-take="${id}"]`).forEach((b) => { const on = state.picked.has(id); b.setAttribute("aria-pressed", String(on)); if (b.classList.contains("small")) b.textContent = on ? "Auf dem Merkzettel" : "Auf den Merkzettel"; });
      return;
    }
    const sp = t.closest<HTMLElement>("[data-step]");
    if (sp) { showStep(sp.dataset.step!); smooth(formBox); return; }
    const ext = t.closest<HTMLElement>("[data-extab]");
    if (ext) { state.exTab = ext.dataset.extab!; renderExample(); return; }
    if (t.closest("[data-chakra]")) { api.openChakra(); return; }
    if (t.closest("[data-goto-life]")) { smooth(q$("#be-life")); return; }
    if (t.closest("[data-life-details]")) { showLife(); smooth(lifeBox); return; }
    const lk = t.closest<HTMLElement>("[data-links]");
    if (lk) { go(lk.dataset.links!); return; }
    const rc = t.closest<HTMLElement>("[data-rec]");
    if (rc) { showRec(rc.dataset.rec!); return; }
    const pin = t.closest<HTMLElement>("[data-pin]");
    if (pin) { const id = pin.dataset.pin!; if (state.recPicked.has(id)) state.recPicked.delete(id); else state.recPicked.add(id); pin.setAttribute("aria-pressed", String(state.recPicked.has(id))); return; }
    const rl = t.closest<HTMLElement>("[data-rlink]");
    if (rl) { go(rl.dataset.rlink!); return; }
    if (t.closest("[data-plan]")) { showPlan(); return; }
    if (t.closest("[data-copy]")) {
      const out = q$(".be-copied");
      navigator.clipboard?.writeText(planText()).then(() => { out.textContent = "Kopiert."; }, () => { out.textContent = "Kopieren war nicht möglich; markiere den Text und kopiere ihn von Hand."; });
      return;
    }
    const nt = t.closest<HTMLElement>("[data-note]");
    if (nt) showNote(nt.dataset.note!);
  });

  mountSlots(scroll);
  renderExample();
  return { start() { /* nothing runs in the background */ }, stop() { /* nothing to stop */ } };
}
