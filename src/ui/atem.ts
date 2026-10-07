import { claims } from "../data/claims";
import { LEVEL_LABEL, type Claim } from "../data/types";
import { ANATOMY, PHASE_LABEL, type Phase } from "../data/breath";
import { AREAS, ATEM_NOTICE, BODY_LEAD, BODY_NOTE, CLOSING, EFFECT_NOTE, HERO, MORE, ROUNDS, SPOTS, TABS, TECHNIQUES, TOP_CARDS, type Technique } from "../data/atempage";
import { LEVEL_POS } from "../data/freqpage";
import { hasAsset, mountSlots } from "../assets/slots";
import { esc } from "./dossierParts";
import { ico } from "./icons";
import { ph } from "./landing";
import { meditatorSvg } from "./atemArt";
import { landscapeSvg } from "./freqArt";

export interface AtemApi {
  reduceMotion: boolean;
  openBody(organ: string): void;
  openCultures(): void;
  openAnatomy(): void;
  /** the exercise room (timer with three rhythms) */
  openPractice(): void;
  openClaim(id: string, from: HTMLElement): void;
}

const claimById = (id: string): Claim | undefined => claims.find((c) => c.id === id);
const SHORT: Record<string, string> = { claimed: "Behauptung · ungeprüft", hypothesis: "Hypothese", supported: "Belegt, Deutung offen", established: "Gesichert", historical: "Historisch dokumentiert", unsupported: "Nicht belegt", refuted: "Widerlegt" };
const NAME: Record<string, string> = { claimed: "Behauptung", hypothesis: "Hypothese", supported: "Belegt", established: "Gesichert", historical: "Historisch", unsupported: "Nicht belegt", refuted: "Widerlegt" };
const chipFor = (id?: string) => {
  const c = id ? claimById(id) : undefined;
  return c ? `<span class="pp-lvl" style="--c:var(--lvl-${c.level})" title="${esc(LEVEL_LABEL[c.level])}">${esc(SHORT[c.level] ?? LEVEL_LABEL[c.level])}</span>` : "";
};
const claimLine = (id?: string) => (id && claimById(id) ? `<p class="at-claimline">${chipFor(id)} <button class="pl-link" data-claim="${id}">${esc(claimById(id)!.short ?? id)}</button></p>` : "");
const barPct = (level: string) => Math.round(((LEVEL_POS[level] ?? 0) + 1) * 50);
const PHASE_COLOR: Record<Phase, string> = { in: "#5ab8ff", hold: "#5fe3a8", out: "#58d6e8", rest: "#5fe3a8" };
const CX = 100, CY = 100, R = 84, CIRC = 2 * Math.PI * R;

/**
 * The breath landing page "Dein Atem verbindet alles.": hero with five areas, four entry cards, a technique finder with a timer
 * ("Jetzt mitatmen") and a panel of what is claimed or studied (with evidence levels), "Was beim Atmen im Körper passiert" with six
 * labels, four more areas and a closing band. No effect is stated in the page's own voice; dangerous techniques come without a how-to.
 */
export function initAtem(root: HTMLElement, api: AtemApi) {
  const scroll = root.querySelector<HTMLElement>(".pl-scroll")!;
  const q$ = <T extends HTMLElement>(s: string) => scroll.querySelector<T>(s)!;
  const smooth = (el: Element | null) => el?.scrollIntoView({ behavior: api.reduceMotion ? "auto" : "smooth", block: "start" });
  let techId = TECHNIQUES[0].id, tab = "wirkung", rounds = 4;
  let running = false, raf = 0, t0 = 0, lastKey = "";
  const tech = () => TECHNIQUES.find((t) => t.id === techId)!;
  const cyc = (t: Technique) => (t.pattern ? t.pattern.reduce((s, [, d]) => s + d, 0) : 0);

  const topImg = (id: string, icon: string, tint: string) => ph(`atem-karte-${id}`, "at-top-img", icon, tint);
  scroll.innerHTML = `
    <div class="pl-hero at-hero">
      ${hasAsset("atem-hero") ? `<div class="pl-hero-bg" data-slot="atem-hero" data-fit="cover" data-eager="true"></div>` : `<div class="at-sky" aria-hidden="true">${landscapeSvg("ats")}<div class="at-hero-fig">${meditatorSvg("ath")}</div></div>`}
      <div class="pl-hero-text">
        <p class="at-eyebrow">${esc(HERO.eyebrow)}</p>
        <h1>${esc(HERO.title)}</h1>
        <p class="pl-lead">${esc(HERO.lead)}</p>
        <div class="at-cta"><button class="mn-gold" data-to="at-technik">Atemtechniken entdecken <span aria-hidden="true">→</span></button><button class="at-video" aria-disabled="true"><i></i> Video ansehen <small>folgt</small></button></div>
        <p class="at-hint" role="status" aria-live="polite"></p>
      </div>
      <nav class="at-areas" aria-label="Bereiche, die der Atem berührt"><ul>${AREAS.map((a) => `<li><button data-area="${a.id}" aria-pressed="false" style="--tint:${a.tint}"><i>${ico(a.icon)}</i><span><strong>${esc(a.title)}</strong><small>${esc(a.sub)}</small></span></button></li>`).join("")}</ul></nav>
    </div>
    <div class="at-info" hidden aria-live="polite"></div>

    <section class="at-top" aria-label="Einstiege"><ul>${TOP_CARDS.map((c) => `<li><button data-top="${c.to}">${topImg(c.id, c.icon, c.tint)}<span><i>${ico(c.icon)}</i><b><strong>${esc(c.title)}</strong><small>${esc(c.sub)}</small></b></span></button></li>`).join("")}</ul></section>

    <section class="at-band at-finder" id="at-technik" aria-labelledby="at-f-h">
      <div class="at-goals">
        <h2 id="at-f-h">Finde die passende Atemtechnik</h2>
        <p class="pl-sub">Wähle dein Ziel und entdecke geeignete Atemübungen.</p>
        <ul class="at-goal-list">${TECHNIQUES.map((t) => `<li><button data-goal="${t.id}" aria-pressed="false">${ico(t.icon)}<span>${esc(t.goal)}</span></button></li>`).join("")}</ul>
      </div>
      <div class="at-tech" aria-live="polite">
        <div class="at-tech-text"></div>
        <div class="at-practice">
          <p class="at-mit">Jetzt mitatmen</p>
          <div class="at-ringwrap"><svg class="at-ring" viewBox="0 0 200 200" aria-hidden="true"><g class="at-segs"></g><circle class="at-dot" r="6" cx="${CX}" cy="${CY - R}"/></svg>
            <div class="at-ringfig">${meditatorSvg("atr")}</div>
            <div class="at-ringtext"><b class="at-count"></b><span class="at-phase"></span></div></div>
          <ul class="at-legend" aria-hidden="true"></ul>
          <p class="at-sub-note"></p>
        </div>
        <div class="at-startrow"><button class="at-start" aria-pressed="false"><i></i><span>Übung starten</span></button>
          <label class="at-rounds">Runden: <select aria-label="Runden">${ROUNDS.map((n) => `<option value="${n}"${n === rounds ? " selected" : ""}>${n}</option>`).join("")}</select></label></div>
        <div class="at-live" aria-live="polite"></div>
      </div>
      <div class="at-effects">
        <div class="at-tabs" role="tablist" aria-label="Informationen zur Technik">${TABS.map(([id, l]) => `<button role="tab" data-tab="${id}" aria-selected="${id === tab}">${l}</button>`).join("")}</div>
        <div class="at-tab-body" role="tabpanel"></div>
      </div>
    </section>

    <section class="at-band at-body" id="at-body" aria-labelledby="at-b-h">
      <div class="at-body-l">
        <h2 id="at-b-h">Was beim Atmen im Körper passiert</h2>
        <p class="at-body-lead">${esc(BODY_LEAD)}</p>
        <div class="at-btnrow"><button class="at-btn" data-body>Interaktive Körperansicht <span aria-hidden="true">→</span></button><button class="at-btn ghost" data-science aria-expanded="false">Was sagt die Forschung?</button></div>
        <p class="at-note">${esc(BODY_NOTE)}</p>
        <ul class="at-basics" aria-label="Grundlagen">${ANATOMY.map((a, i) => `<li><button data-basic="${i}" aria-pressed="false">${esc(a.title)}</button></li>`).join("")}</ul>
      </div>
      <div class="at-body-fig">
        <ul class="at-spots l">${SPOTS.filter((s) => s.side === "l").map((s) => spot(s)).join("")}</ul>
        <div class="at-lungs">${hasAsset("atem-koerper") ? `<div class="at-lung-pic" data-slot="atem-koerper" data-fit="contain"></div>` : `<div class="at-lung-pic" data-slot="organ-lungs" data-fit="contain"></div>`}</div>
        <ul class="at-spots r">${SPOTS.filter((s) => s.side === "r").map((s) => spot(s)).join("")}</ul>
      </div>
      <div class="at-drawer at-spot-text" hidden aria-live="polite"></div>
      <div class="at-drawer at-science" hidden></div>
    </section>

    <section class="at-band at-more" id="at-more" aria-labelledby="at-m-h">
      <h2 id="at-m-h">Weitere Bereiche entdecken</h2><p class="pl-sub">Vertiefe dein Wissen und erkunde verwandte Themen.</p>
      <ul class="at-more-row">${MORE.map((m) => `<li><button data-more="${m.id}" aria-pressed="false">${ph(`atem-mehr-${m.id}`, "at-more-img", m.icon, m.tint)}<span><b><strong>${esc(m.title)}</strong><small>${esc(m.sub)}</small></b><em aria-hidden="true">→</em></span></button></li>`).join("")}</ul>
      <div class="at-drawer at-more-text" hidden aria-live="polite"></div>
    </section>

    <section class="at-closing" aria-label="Schlusswort">
      <div class="at-close-bg">${hasAsset("atem-schluss") ? `<div class="at-close-pic" data-slot="atem-schluss" data-fit="cover"></div>` : `<div class="at-close-pic">${landscapeSvg("atc")}<div class="at-close-fig">${meditatorSvg("atf")}</div></div>`}</div>
      <div class="at-close-text"><h2>${esc(CLOSING.title)}</h2><p>${esc(CLOSING.text)}</p><small>${esc(CLOSING.note)}</small></div>
      <button class="at-btn big" data-practice>${esc(CLOSING.button)} <span aria-hidden="true">→</span></button>
    </section>
    <div class="pl-wrap"><p class="pl-notice">${esc(ATEM_NOTICE)}</p></div>`;

  function spot(s: (typeof SPOTS)[number]) {
    return `<li><button data-spot="${s.id}" aria-pressed="false"><i>${ico(s.icon)}</i><span><strong>${esc(s.title)}</strong><small>${esc(s.sub)}</small></span></button></li>`;
  }

  // ---------------------------------------------------------------- technique panel and ring
  const ringSegs = scroll.querySelector<SVGGElement>(".at-segs")!, dot = scroll.querySelector<SVGCircleElement>(".at-dot")!;
  const countEl = q$(".at-count"), phaseEl = q$(".at-phase"), startBtn = q$<HTMLButtonElement>(".at-start"), live = q$(".at-live");
  const roundSel = q$<HTMLSelectElement>(".at-rounds select");

  function buildRing(t: Technique) {
    ringSegs.innerHTML = "";
    if (!t.pattern) { ringSegs.innerHTML = `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="#3a4a60" stroke-opacity=".5" stroke-width="9"/>`; return; }
    const total = cyc(t); let acc = 0;
    t.pattern.forEach(([ph, d], i) => {
      const len = Math.max(2, (d / total) * CIRC - 5);
      ringSegs.insertAdjacentHTML("beforeend", `<circle class="at-seg" data-i="${i}" cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${PHASE_COLOR[ph]}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${len.toFixed(1)} ${(CIRC - len).toFixed(1)}" stroke-dashoffset="${(-(acc / total) * CIRC - 2.5).toFixed(1)}" transform="rotate(-90 ${CX} ${CY})"/>`);
      acc += d;
    });
  }
  function setDot(frac: number) {
    const a = -Math.PI / 2 + frac * 2 * Math.PI;
    dot.setAttribute("cx", (CX + R * Math.cos(a)).toFixed(1)); dot.setAttribute("cy", (CY + R * Math.sin(a)).toFixed(1));
  }
  function idle() {
    running = false; cancelAnimationFrame(raf);
    const t = tech();
    startBtn.setAttribute("aria-pressed", "false"); startBtn.querySelector("span")!.textContent = "Übung starten";
    startBtn.disabled = !t.pattern; roundSel.disabled = !t.pattern;
    q$(".at-practice").classList.toggle("is-off", !t.pattern);
    q$(".at-ringwrap").style.setProperty("--s", "0.9");
    q$(".at-ringwrap").dataset.phase = "idle";
    scroll.querySelectorAll<SVGElement>(".at-seg").forEach((s) => s.classList.remove("on"));
    setDot(0);
    countEl.textContent = t.pattern ? "·" : ""; phaseEl.textContent = t.pattern ? "Bereit" : "";
    q$(".at-sub-note").textContent = t.pattern ? `${cyc(t)} s pro Atemzug · ${rounds} Runden` : (t.noTimer ?? "");
  }
  const ease = (x: number) => (1 - Math.cos(Math.PI * Math.min(1, Math.max(0, x)))) / 2;
  function frame(now: number) {
    if (!running) return;
    const t = tech(), pat = t.pattern!, cycle = cyc(t), el = (now - t0) / 1000, total = cycle * rounds;
    if (el >= total) { finish(); return; }
    const inCycle = el % cycle, round = Math.floor(el / cycle) + 1;
    let acc = 0, idx = 0, local = 0, dur = 1;
    for (let i = 0; i < pat.length; i++) { if (inCycle < acc + pat[i][1]) { idx = i; dur = pat[i][1]; local = inCycle - acc; break; } acc += pat[i][1]; }
    const phase = pat[idx][0];
    // the figure grows on the in-breath, keeps its size while holding and shrinks on the out-breath
    let full = 0; { let a = 0, last: Phase = "out"; for (const [p, d] of pat) { if (inCycle < a + d) break; if (p !== "hold") last = p; a += d; } full = last === "in" ? 1 : 0; }
    const s = phase === "in" ? 0.9 + 0.12 * ease(local / dur) : phase === "out" ? 1.02 - 0.12 * ease(local / dur) : 0.9 + 0.12 * full;
    if (!api.reduceMotion) q$(".at-ringwrap").style.setProperty("--s", s.toFixed(3));
    q$(".at-ringwrap").dataset.phase = phase;
    scroll.querySelectorAll<SVGElement>(".at-seg").forEach((sg) => sg.classList.toggle("on", Number(sg.dataset.i) === idx));
    setDot(inCycle / cycle);
    countEl.textContent = String(Math.max(1, Math.ceil(dur - local))); phaseEl.textContent = PHASE_LABEL[phase];
    q$(".at-sub-note").textContent = `Runde ${round} von ${rounds}`;
    const key = `${round}-${idx}`; if (key !== lastKey) { lastKey = key; live.textContent = PHASE_LABEL[phase]; }
    raf = requestAnimationFrame(frame);
  }
  function finish() { idle(); phaseEl.textContent = "Geschafft"; countEl.textContent = "✓"; q$(".at-sub-note").textContent = "Atme jetzt wieder, wie es sich gut anfühlt."; live.textContent = "Übung beendet"; }
  startBtn.addEventListener("click", () => {
    if (running) { idle(); return; }
    if (!tech().pattern) return;
    running = true; lastKey = ""; t0 = performance.now();
    startBtn.setAttribute("aria-pressed", "true"); startBtn.querySelector("span")!.textContent = "Beenden"; roundSel.disabled = true;
    raf = requestAnimationFrame(frame);
  });
  roundSel.addEventListener("change", () => { rounds = Number(roundSel.value); idle(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden && running) idle(); });

  function tabBody(t: Technique): string {
    if (tab === "wirkung") {
      return `<h3>Was dazu gesagt und untersucht wird</h3><ul class="at-eff">${t.effects.map((e) => {
        const c = e.claim ? claimById(e.claim) : undefined;
        return `<li><button ${c ? `data-claim="${c.id}"` : "disabled"}><i>${ico(e.icon)}</i><span>${esc(e.label)}</span>${c ? `<em class="at-bar" style="--c:var(--lvl-${c.level});--p:${barPct(c.level)}%"><u></u></em><small style="color:var(--lvl-${c.level})">${esc(NAME[c.level])}</small>` : `<small class="none">keine Aussage</small>`}</button></li>`;
      }).join("")}</ul><p class="at-note">${esc(EFFECT_NOTE)}</p>`;
    }
    if (tab === "details") return `<h3>Details</h3><dl class="at-dl">${t.details.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>${t.warning ? `<p class="at-warn">${ico("shield")} ${esc(t.warning)}</p>` : ""}`;
    if (tab === "studien") {
      const seen = new Set<string>(), rows: string[] = [];
      for (const e of t.effects) {
        const c = e.claim ? claimById(e.claim) : undefined;
        for (const s of c?.sources ?? []) { if (s.kind === "editorial-input" || seen.has(s.id)) continue; seen.add(s.id); rows.push(`<li><i>${ico("book")}</i><div><strong>${esc(s.title)}</strong><small>${esc(s.author)}${s.year ? `, ${s.year}` : ""} · ${esc(s.citation)}</small></div>${chipFor(c!.id)}</li>`); }
      }
      return `<h3>Studien</h3>${rows.length ? `<ul class="at-papers">${rows.join("")}</ul>` : `<p class="at-none">Zu dieser Technik ist keine Studie als Quelle eingetragen.</p>`}<p class="at-note">Quellen aus Suchauszügen, die Originale sind nicht geprüft (Source pending verification).</p>`;
    }
    return `<h3>Varianten</h3>${t.variants.length ? `<ul class="at-var">${t.variants.map((v) => `<li>${esc(v)}</li>`).join("")}</ul>` : `<p class="at-none">Zu dieser Technik gibt es hier keine Varianten.</p>`}`;
  }
  function renderTech() {
    const t = tech();
    scroll.querySelectorAll<HTMLElement>("[data-goal]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.goal === techId)));
    q$(".at-tech-text").innerHTML = `<h3>${esc(t.title)}</h3><p class="at-tsub">${esc(t.sub)}</p><p class="at-ttext">${esc(t.text)}</p>
      <p class="at-used">Wird genutzt für: ${t.tags.map((x) => `<span>${esc(x)}</span>`).join("")}</p>
      ${t.steps.length ? `<div class="at-steps"><h4>Schritt für Schritt</h4><ol>${t.steps.map((s, i) => `<li><b>${i + 1}</b><span><strong>${esc(s.title)}</strong><small>${esc(s.text)}</small></span></li>`).join("")}</ol></div>` : `<p class="at-warn">${ico("shield")} ${esc(t.warning ?? "")}</p>`}`;
    q$(".at-legend").innerHTML = (t.pattern ?? []).map(([p, d]) => `<li style="--c:${PHASE_COLOR[p]}"><b>${d}</b><span>${PHASE_LABEL[p]}</span></li>`).join("");
    buildRing(t);
    scroll.querySelectorAll<HTMLElement>("[data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
    q$(".at-tab-body").innerHTML = tabBody(t);
    idle();
  }

  // ---------------------------------------------------------------- hero, body, more
  const info = q$(".at-info");
  function showArea(id: string) {
    const a = AREAS.find((x) => x.id === id)!;
    scroll.querySelectorAll<HTMLElement>("[data-area]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.area === id)));
    info.hidden = false;
    info.innerHTML = `<div class="at-info-in"><h3>${esc(a.title)} <small>${esc(a.sub)}</small></h3><p>${esc(a.text)}</p>${claimLine(a.claim)}<small>Lehrbuchwissen und Aussagen mit Belegstufe, Source pending verification.</small></div>`;
    smooth(info);
  }
  const spotBox = q$(".at-spot-text"), sciBox = q$(".at-science");
  const setPressed = (attr: string, id: string) => scroll.querySelectorAll<HTMLElement>(`[${attr}]`).forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute(attr) === id)));
  function showSpot(id: string) {
    const s = SPOTS.find((x) => x.id === id)!;
    setPressed("data-spot", id); setPressed("data-basic", "");
    spotBox.hidden = false; spotBox.innerHTML = `<h3>${esc(s.title)} <small>${esc(s.sub)}</small></h3><p>${esc(s.text)}</p>${claimLine(s.claim)}<p class="at-note">Lehrbuchwissen, Source pending verification.</p>`;
  }
  function showScience(toggle = true) {
    const open = toggle ? sciBox.hidden : true;
    q$("[data-science]").setAttribute("aria-expanded", String(open));
    sciBox.hidden = !open;
    if (!open) return;
    const ids = ["atem-langsam-hrv", "atem-angst", "atem-stimmung", "atem-blutdruck", "atem-achtsamkeit", "atem-478-schlaf", "atem-immun-wimhof", "atem-zirbeldruese"];
    sciBox.innerHTML = `<h3>Wirkung &amp; Wissenschaft <small>Aussagen mit Belegstufe</small></h3><ul class="at-sci">${ids.map((id) => claimById(id)).filter((c): c is Claim => !!c).map((c) => `<li><div>${chipFor(c.id)}<button class="pl-link" data-claim="${c.id}">${esc(c.short ?? c.id)}</button></div><p>${esc(c.statement)}</p></li>`).join("")}</ul><p class="at-note">Die Quellen stammen aus Suchauszügen und sind noch nicht geprüft. Atemübungen ersetzen keine Behandlung.</p>`;
  }
  function showMore(id: string) {
    const m = MORE.find((x) => x.id === id)!, box = q$(".at-more-text");
    setPressed("data-more", id);
    const link = m.link ? `<p><button class="at-btn ghost" data-mlink="${m.link.act}">${esc(m.link.label)} <span aria-hidden="true">→</span></button></p>` : "";
    box.hidden = false; box.innerHTML = `<h3>${esc(m.title)} <small>${esc(m.sub)}</small></h3><p>${esc(m.text)}</p>${m.claims.map(claimLine).join("")}${link}<p class="at-note">Überlieferung und Lehrbuchwissen, Source pending verification.</p>`;
  }

  scroll.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) { api.openClaim(cl.dataset.claim!, cl); return; }
    const to = t.closest<HTMLElement>("[data-to]");
    if (to) { smooth(q$(`#${to.dataset.to}`)); return; }
    if (t.closest(".at-video")) { q$(".at-hint").textContent = "Ein Video gibt es noch nicht. Die Übung „Jetzt mitatmen“ weiter unten läuft stattdessen."; return; }
    const ar = t.closest<HTMLElement>("[data-area]");
    if (ar) { showArea(ar.dataset.area!); return; }
    const tp = t.closest<HTMLElement>("[data-top]");
    if (tp) {
      const [k, arg] = tp.dataset.top!.split(":");
      if (k === "body") { showSpot(arg); smooth(q$("#at-body")); }
      else if (k === "science") { showScience(false); smooth(q$("#at-body")); }
      else if (k === "more") { showMore(arg); smooth(q$("#at-more")); }
      else smooth(q$(`#${k}`));
      return;
    }
    const g = t.closest<HTMLElement>("[data-goal]");
    if (g) { techId = g.dataset.goal!; tab = "wirkung"; renderTech(); return; }
    const tb = t.closest<HTMLElement>("[data-tab]");
    if (tb) { tab = tb.dataset.tab!; scroll.querySelectorAll<HTMLElement>("[data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b === tb))); q$(".at-tab-body").innerHTML = tabBody(tech()); return; }
    if (t.closest("[data-body]")) { api.openBody("lunge"); return; }
    if (t.closest("[data-science]")) { showScience(); return; }
    const sp = t.closest<HTMLElement>("[data-spot]");
    if (sp) { showSpot(sp.dataset.spot!); return; }
    const ba = t.closest<HTMLElement>("[data-basic]");
    if (ba) { const a = ANATOMY[Number(ba.dataset.basic)]; setPressed("data-spot", ""); setPressed("data-basic", ba.dataset.basic!); spotBox.hidden = false; spotBox.innerHTML = `<h3>${esc(a.title)} <small>Grundlage</small></h3><p>${esc(a.text)}</p><p class="at-note">Lehrbuchwissen, Source pending verification.</p>`; return; }
    const mo = t.closest<HTMLElement>("[data-more]");
    if (mo) { showMore(mo.dataset.more!); return; }
    const ml = t.closest<HTMLElement>("[data-mlink]");
    if (ml) {
      const k = ml.dataset.mlink;
      if (k === "breath") api.openPractice(); else if (k === "cultures") api.openCultures(); else if (k === "anatomy") api.openAnatomy();
      else if (k === "sleep") { techId = "schlaf"; tab = "wirkung"; renderTech(); smooth(q$("#at-technik")); }
      return;
    }
    if (t.closest("[data-practice]")) api.openPractice();
  });

  mountSlots(scroll);
  renderTech();
  return {
    start() { /* nothing runs in the background */ },
    stop() { if (running) idle(); },
  };
}
