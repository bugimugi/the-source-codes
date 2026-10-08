import { claims } from "../data/claims";
import { LEVEL_LABEL, type Claim } from "../data/types";
import { CHAKRAS, CHAKRA_HISTORY, type Chakra } from "../data/chakras";
import {
  BALANCE_NOTE, CARD_TAG, FOODS, FOOD_NOTE, HZ_LABEL, MED_KINDS, MED_NOTE, MED_SLOT, NATURE, PAGES, PAGE_NOTICE, SCENTS, SCENT_NOTE, SOUND_NOTE, STONES, STONE_NOTE, TABS, YOGA, YOGA_NOTE,
  hzLines, itemSlot, medSteps, pageOf, type ChakraPage, type ItemGroup, type PageItem,
} from "../data/chakrapage";
import { hasAsset, mountSlots } from "../assets/slots";
import { createTone } from "../audio/tone";
import { esc } from "./dossierParts";
import { ico } from "./icons";
import { ph } from "./landing";
import { figureSvg, lotusSvg } from "./chakrenArt";
import { landscapeSvg } from "./freqArt";

export interface ChakrenApi {
  reduceMotion: boolean;
  openCrystals(): void;
  openPlants(): void;
  openAtem(): void;
  openFreq(): void;
  openBeschwerden(): void;
  /** the computed 3D chakra page */
  openChakra3d(id: string): void;
  openAtlas(id: string): void;
  openClaim(id: string, from: HTMLElement): void;
}

const claimById = (id: string): Claim | undefined => claims.find((c) => c.id === id);
const SHORT: Record<string, string> = { claimed: "Behauptung · ungeprüft", hypothesis: "Hypothese", supported: "Belegt, Deutung offen", established: "Gesichert", historical: "Historisch dokumentiert", unsupported: "Nicht belegt", refuted: "Widerlegt" };
const chip = (id: string) => {
  const c = claimById(id);
  return c ? `<span class="pp-lvl" style="--c:var(--lvl-${c.level})" title="${esc(LEVEL_LABEL[c.level])}">${esc(SHORT[c.level] ?? LEVEL_LABEL[c.level])}</span>` : "";
};
const claimLine = (id: string) => (claimById(id) ? `<p class="ch-claimline">${chip(id)} <button class="pl-link" data-claim="${id}">${esc(claimById(id)!.short ?? id)}</button></p>` : "");
const SHORT_NAME: Record<string, string> = { wurzel: "Wurzel", sakral: "Sakral", solar: "Solarplexus", herz: "Herz", hals: "Hals", stirn: "Stirn", krone: "Krone" };
const POINTS = [...CHAKRAS].reverse().map((c) => ({ id: c.id, color: c.color }));
const GROUP_LABEL: Record<string, string> = { stein: "Heilstein", essen: "Ernährung", duft: "Duft", kraut: "Kraut", yoga: "Yoga", natur: "Natur" };
const LEVEL_TINT: Record<string, string> = { Anfänger: "#5fe3a8", Mittel: "#f0d18b", Fortgeschritten: "#ff8a6a", Meditation: "#a46be0", Entspannung: "#58d6e8", Atemübung: "#58d6e8" };

/**
 * The chakra landing page: hero with a seated figure and the seven points, an info card, a selector for the seven centres, nine tabs
 * (overview with stones, colours, food, scents, sound, meditation, yoga, nature and affirmations) and a tone player. Everything is shown as
 * tradition and textbook knowledge; assignments carry their evidence level, no effect is stated in the page's own voice.
 */
export function initChakren(root: HTMLElement, api: ChakrenApi) {
  const scroll = root.querySelector<HTMLElement>(".pl-scroll")!;
  const q$ = <T extends HTMLElement>(s: string) => scroll.querySelector<T>(s)!;
  const smooth = (el: Element | null) => el?.scrollIntoView({ behavior: api.reduceMotion ? "auto" : "smooth", block: "start" });
  const tone = createTone();
  let cur = "krone", tab = "uebersicht", hz = CHAKRAS.find((c) => c.id === cur)!.hz, affIdx = 0;
  let raf = 0, buf: Uint8Array<ArrayBuffer> | null = null;
  let timer = 0, tStep = -1, tRemain = 0, tPer = 0, tTotal = 0;

  const chakra = (): Chakra => CHAKRAS.find((c) => c.id === cur)!;
  const page = (): ChakraPage => pageOf(cur);

  scroll.innerHTML = `
    <div class="pl-hero ch-hero">
      ${hasAsset("chakren-hero") ? `<div class="pl-hero-bg" data-slot="chakren-hero" data-fit="cover" data-eager="true"></div>` : `<div class="ch-sky" aria-hidden="true">${landscapeSvg("chs")}</div>`}
      <div class="ch-fig${hasAsset("chakren-hero") ? " is-hidden" : ""}"></div>
      <div class="pl-hero-text ch-text"></div>
      <aside class="ch-card" aria-label="Steckbrief"></aside>
    </div>
    <nav class="ch-select" aria-label="Chakra wählen">
      <button class="ch-arrow" data-step="-1" aria-label="Vorheriges Chakra">‹</button>
      <ul>${CHAKRAS.map((c) => `<li><button data-chakra="${c.id}" aria-pressed="false" style="--c:${c.color}"><i>${lotusSvg(`sel-${c.id}`, c.color, c.petals, true)}</i><span><b>${SHORT_NAME[c.id]}</b><small>${esc(pageOf(c.id).short)}</small></span></button></li>`).join("")}</ul>
      <button class="ch-arrow" data-step="1" aria-label="Nächstes Chakra">›</button>
    </nav>
    <div class="ch-tabs" id="ch-tabs" role="tablist" aria-label="Themen des Chakras">${TABS.map(([id, l]) => `<button role="tab" data-tab="${id}" aria-selected="false">${l}</button>`).join("")}</div>
    <div class="ch-main" role="tabpanel"></div>
    <div class="ch-drawer" hidden aria-live="polite"></div>
    <section class="ch-more" aria-label="Weiter entdecken"><h2>Weiter entdecken</h2>
      <ul>
        <li><button data-act="crystals">${ico("hex")}<span>Kristall-Atlas</span></button></li>
        <li><button data-act="plants">${ico("leaf")}<span>Pflanzenatlas</span></button></li>
        <li><button data-act="atem">${ico("lungs")}<span>Atem &amp; Meditation</span></button></li>
        <li><button data-act="freq">${ico("sound")}<span>Frequenz &amp; Vibration</span></button></li>
        <li><button data-act="beschwerden">${ico("shield")}<span>Beschwerden &amp; Warnzeichen</span></button></li>
        <li><button data-act="three-d">${ico("atom")}<span>Chakren in 3D</span></button></li>
      </ul></section>
    <div class="pl-wrap"><p class="pl-notice">${esc(PAGE_NOTICE)}</p></div>`;

  // ---------------------------------------------------------------- pieces
  const tint = (g: ItemGroup | "kraut") => (g === "stein" ? chakra().color : g === "essen" ? "#7bd88f" : g === "duft" ? "#d9a8ff" : g === "yoga" ? "#f0d18b" : g === "natur" ? "#58d6e8" : "#7bd88f");
  const ICONS: Record<string, string> = { stein: "hex", essen: "berry", duft: "drop", kraut: "leaf", yoga: "stress", natur: "tree" };
  const imgFor = (g: ItemGroup | "kraut", key: string, it: PageItem | undefined, cls = "ch-tile-img") => {
    const slot = it?.atlas ? `atlas-${it.atlas}` : g === "kraut" ? `atlas-${it?.atlas ?? "x"}` : itemSlot(g, key);
    return ph(slot, cls, ICONS[g], tint(g));
  };
  const head = (icon: string, title: string, sub = "") => `<header class="ch-sec-h"><i>${ico(icon)}</i><div><h3>${esc(title)}</h3>${sub ? `<small>${esc(sub)}</small>` : ""}</div></header>`;
  const tiles = (g: ItemGroup | "kraut", keys: string[], dict: Record<string, PageItem>, detail: boolean) =>
    `<ul class="ch-tiles${detail ? " wide" : ""}">${keys.map((k, i) => `<li><button data-item="${g}:${i}" aria-pressed="false">${imgFor(g, k, dict[k])}<span><b>${esc(dict[k].name)}</b>${detail ? `<small>${esc(dict[k].note)}</small>` : ""}</span></button></li>`).join("")}</ul>`;

  const S = {
    stones(detail: boolean) {
      const p = page();
      return `<section class="ch-sec ch-stones">${head("hex", "Heilsteine & Kristalle", "Zuordnung der Überlieferung")}${tiles("stein", p.stones, STONES, detail)}
        <p class="ch-sec-foot"><button class="ch-link" data-act="crystals">Mehr im Kristallatlas <span aria-hidden="true">→</span></button></p>${detail ? `<p class="ch-note">${esc(STONE_NOTE)}</p>${claimLine("crystal-healing-general")}` : ""}</section>`;
    },
    colors(detail: boolean) {
      const p = page(), c = chakra();
      const sym = hasAsset(`chakren-symbol-${c.id}`) ? `<div class="ch-sym" data-slot="chakren-symbol-${c.id}" data-fit="contain"></div>` : `<div class="ch-sym">${lotusSvg(`col-${c.id}`, c.color, c.petals)}</div>`;
      return `<section class="ch-sec ch-colors">${head("palette", "Farben & Licht", "moderne Zuordnung")}
        <div class="ch-col-body"><ul class="ch-dots">${p.colors.map((d) => `<li><i style="background:${d.hex}"></i><span>${esc(d.name)}</span></li>`).join("")}</ul>${sym}</div>
        ${detail ? `<p class="ch-note">Die Regenbogenfarben der Chakren sind eine Ergänzung des 20. Jahrhunderts; die Texte der Überlieferung nennen andere Farben.</p>` : ""}${claimLine("chakra-zuordnungen-modern")}</section>`;
    },
    foods(detail: boolean) {
      const p = page();
      return `<section class="ch-sec ch-foods">${head("berry", "Ernährung", "Zuordnung nach Farbe")}${tiles("essen", p.foods, FOODS, detail)}
        <p class="ch-sec-foot"><button class="ch-link" data-act="plants">Mehr im Pflanzenatlas <span aria-hidden="true">→</span></button></p><p class="ch-note">${esc(FOOD_NOTE)}</p></section>`;
    },
    scents(detail: boolean) {
      const p = page();
      return `<section class="ch-sec ch-scents">${head("drop", "Ätherische Öle & Düfte", "Zuordnung der Überlieferung")}${tiles("duft", p.scents, SCENTS, detail)}<p class="ch-note">${esc(SCENT_NOTE)}</p></section>`;
    },
    sound(detail: boolean) {
      const p = page(), c = chakra(), lines = hzLines(c.hz);
      const label = (h: number) => (h === c.hz ? p.hzLabel : HZ_LABEL[h] ?? "");
      return `<section class="ch-sec ch-sound${detail ? " big" : ""}">${head("sound", "Frequenzen & Klang", "Zuschreibung, nicht belegt")}
        <div class="ch-sound-top"><div class="ch-hzbig"><p><b>${hz}</b><span>Hz</span></p><small>${esc(label(hz))}</small></div>
          <button class="ch-play" aria-pressed="false" aria-label="Ton abspielen"><span></span></button>
          <canvas class="ch-scope" width="320" height="64" aria-label="Wellenform des Tons"></canvas></div>
        <ul class="ch-hzlist" aria-label="Frequenzen">${lines.map((h) => `<li><button data-hz="${h}" aria-pressed="${h === hz}"><b>${h} Hz</b><span>${esc(label(h))}</span></button></li>`).join("")}</ul>
        <ul class="ch-sounds" aria-label="Weitere Klänge">${[["Chanting Om", "sound"], ["Tibetische Klangschalen", "bowl"], [p.natureSound, "tree"]].map(([n, ic]) => `<li><button disabled>${ico(ic)}<span>${esc(n)}</span><small>Aufnahme folgt</small></button></li>`).join("")}</ul>
        <p class="ch-note">${esc(SOUND_NOTE)}</p>${claimLine("freq-solfeggio")}
        <p class="ch-sec-foot"><button class="ch-link" data-act="freq">Zum Frequenz-Bereich <span aria-hidden="true">→</span></button></p></section>`;
    },
    meditation(detail: boolean) {
      const p = page();
      return `<section class="ch-sec ch-med">${head("flame", "Meditation & Atemübungen", "Vorstellungsübungen zum Lesen")}
        <ul class="ch-medlist">${p.meditations.map((m, i) => `<li><button data-med="${i}" aria-pressed="false">${ph(MED_SLOT(m.kind), "ch-med-img", MED_KINDS[m.kind].icon, MED_KINDS[m.kind].tint)}<span><b>${esc(m.title)}</b><small>${m.minutes} Min. · ${MED_KINDS[m.kind].label}</small></span><em aria-hidden="true">›</em></button></li>`).join("")}</ul>
        <p class="ch-sec-foot">${detail ? "" : `<button class="ch-link" data-tab-go="meditation">Alle Meditationen <span aria-hidden="true">→</span></button>`}<button class="ch-link" data-act="atem">Atem-Seite <span aria-hidden="true">→</span></button></p>${detail ? `<p class="ch-note">${esc(MED_NOTE)}</p>${claimLine("chakra-arbeit-heilung")}` : ""}</section>`;
    },
    yoga(detail: boolean) {
      const p = page();
      return `<section class="ch-sec ch-yoga">${head("stress", "Yoga & Bewegung", "Überlieferte Haltungen")}
        <ul class="ch-yogalist">${p.yoga.map((k, i) => { const y = YOGA[k]; return `<li><button data-item="yoga:${i}" aria-pressed="false">${ph(itemSlot("yoga", k), "ch-yoga-img", "stress", "#f0d18b")}<span><b>${esc(y.name)}</b><small>${esc(y.sanskrit)}</small><em style="--c:${LEVEL_TINT[y.level]}">${y.level}</em></span></button></li>`; }).join("")}</ul>
        <p class="ch-sec-foot">${detail ? "" : `<button class="ch-link" data-tab-go="meditation">Alle Übungen <span aria-hidden="true">→</span></button>`}</p><p class="ch-note">${esc(YOGA_NOTE)}</p></section>`;
    },
    nature(detail: boolean) {
      const p = page();
      return `<section class="ch-sec ch-nature">${head("tree", "Natur & Umgebung", "Orte der Überlieferung")}${tiles("natur", p.nature, NATURE, detail)}
        <p class="ch-sec-foot">${detail ? "" : `<button class="ch-link" data-tab-go="natur">Mehr entdecken <span aria-hidden="true">→</span></button>`}</p></section>`;
    },
    herbs() {
      const p = page();
      return `<section class="ch-sec ch-herbs">${head("shrub", "Kräuter & Pflanzen", "Zuordnung der Überlieferung")}
        <ul class="ch-herblist">${p.herbs.map((h, i) => `<li><button data-item="kraut:${i}" aria-pressed="false">${imgFor("kraut", h.name, h, "ch-herb-img")}<span><b>${esc(h.name)}</b><small>${h.atlas ? "im Pflanzenatlas" : "ohne Atlas-Eintrag"}</small></span></button></li>`).join("")}</ul>
        <p class="ch-note">Hier geht es um die Zuordnung in der Überlieferung. Wirkungen von Heilpflanzen stehen, wenn überhaupt, als Aussage mit Belegstufe im Pflanzenatlas.</p></section>`;
    },
    affirm(detail: boolean) {
      const p = page();
      if (!detail) return `<section class="ch-sec ch-aff">${head("sparkle", "Positive Affirmationen", "Sätze zum Wiederholen")}<blockquote>„${esc(p.affirmations[0])}“</blockquote><p class="ch-sec-foot"><button class="ch-link" data-tab-go="affirmationen">Weitere Affirmationen <span aria-hidden="true">→</span></button></p></section>`;
      return `<section class="ch-sec ch-aff big">${head("sparkle", "Positive Affirmationen", "Sätze zum Wiederholen")}<blockquote class="ch-aff-big">„${esc(p.affirmations[affIdx])}“</blockquote>
        <ul class="ch-afflist">${p.affirmations.map((a, i) => `<li><button data-aff="${i}" aria-pressed="${i === affIdx}">„${esc(a)}“</button></li>`).join("")}</ul>
        <p class="ch-note">Affirmationen sind Sätze zum Wiederholen und Ausprobieren. Sie sind keine Behandlung und keine Aussage über Wirkung.</p></section>`;
    },
  };

  function panel(): string {
    const p = page(), c = chakra();
    switch (tab) {
      case "bedeutung": {
        const sym = hasAsset(`chakren-symbol-${c.id}`) ? `<div class="ch-sym big" data-slot="chakren-symbol-${c.id}" data-fit="contain"></div>` : `<div class="ch-sym big">${lotusSvg(`mean-${c.id}`, c.color, c.petals)}</div>`;
        return `<section class="ch-sec ch-meaning">${head("scroll", `Bedeutung des ${c.name}`, c.sanskrit)}
          <div class="ch-m-grid">${sym}<div class="ch-m-text">${p.meaning.map((t) => `<p>${esc(t)}</p>`).join("")}
            <dl class="ch-dl"><div><dt>Sanskrit-Name</dt><dd>${esc(p.nameMeaning)}</dd></div><div><dt>Samen-Silbe (Bija)</dt><dd>${esc(c.syllable)}</dd></div><div><dt>Blütenblätter</dt><dd>${esc(c.petalsLabel)}</dd></div><div><dt>Element</dt><dd>${esc(p.card.element)}</dd></div><div><dt>Position</dt><dd>${esc(c.position)}</dd></div><div><dt>Themen</dt><dd>${esc(p.card.theme)}</dd></div></dl>
            <p class="ch-note">${esc(CHAKRA_HISTORY)}</p>${claimLine("chakra-modell")}</div></div></section>`;
      }
      case "balance":
        return `<section class="ch-sec ch-balance">${head("balance", "Symptome & Balance", "Beschreibungen der Überlieferung, keine Diagnose")}
          <div class="ch-b-grid">${([["Wenig ausgeprägt", p.under, "#58a8ff"], ["Stark ausgeprägt", p.over, "#ff8a6a"], ["Ausgeglichen", p.balanced, "#5fe3a8"]] as [string, string[], string][]).map(([t, l, col]) => `<div class="ch-b-card" style="--c:${col}"><h4>${t}</h4><ul>${l.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}</div>
          <p class="ch-body">${ico("pin")} Zugeordnete Körperregion: ${esc(p.bodyRegion)}</p>
          <p class="ch-warn">${ico("shield")} ${esc(BALANCE_NOTE)}</p>${claimLine("chakra-arbeit-heilung")}
          <p class="ch-sec-foot"><button class="ch-link" data-act="beschwerden">Beschwerden &amp; Warnzeichen <span aria-hidden="true">→</span></button></p></section>`;
      case "steine": return `<div class="ch-two">${S.stones(true)}${S.colors(true)}</div>`;
      case "ernaehrung": return `<div class="ch-two">${S.foods(true)}${S.scents(false)}</div>`;
      case "klang": return S.sound(true);
      case "meditation": return `<div class="ch-two">${S.meditation(true)}${S.yoga(true)}</div>`;
      case "natur": return `<div class="ch-two">${S.nature(true)}${S.herbs()}</div>${S.scents(true)}`;
      case "affirmationen": return S.affirm(true);
      default:
        return `<div class="ch-grid">${S.stones(false)}${S.colors(false)}${S.foods(false)}${S.scents(false)}${S.sound(false)}${S.meditation(false)}${S.yoga(false)}<div class="ch-stack">${S.nature(false)}${S.affirm(false)}</div></div>`;
    }
  }

  // ---------------------------------------------------------------- hero and card
  function renderHero() {
    const c = chakra(), p = page();
    q$(".ch-text").innerHTML = `
      <p class="ch-eyebrow">Chakren · Energiezentren</p>
      <h1>${esc(c.name)}</h1>
      <p class="ch-tagline">${esc(p.tagline)}</p>
      <p class="pl-lead">${esc(p.lead)}</p>
      <div class="ch-cta"><button class="mn-gold" data-act="guide">Geführte Meditation starten <span aria-hidden="true">→</span></button><button class="ch-ghost" data-act="three-d">${ico("atom")} In 3D ansehen</button></div>
      <ul class="ch-facts" aria-label="Kurzangaben"><li>${ico("sound")}<b>${c.hz} Hz</b><small>Frequenz (modern)</small></li><li>${ico("scroll")}<b>${esc(c.sanskrit)}</b><small>Sanskrit-Name</small></li><li>${ico("pin")}<b>${esc(p.posShort)}</b><small>Position</small></li><li>${ico("palette")}<b>${esc(p.colorShort)}</b><small>Farbe</small></li></ul>`;
    const sym = hasAsset(`chakren-symbol-${c.id}`) ? `<div class="ch-card-sym" data-slot="chakren-symbol-${c.id}" data-fit="contain"></div>` : `<div class="ch-card-sym">${lotusSvg(`card-${c.id}`, c.color, c.petals)}</div>`;
    const row = (icon: string, k: string, v: string) => `<div><dt>${ico(icon)}<span>${k}</span></dt><dd>${v}</dd></div>`;
    q$(".ch-card").innerHTML = `
      <div class="ch-card-top"><div><p class="ch-card-sk">${esc(c.sanskrit.toUpperCase())}</p><h2>${esc(c.name)}</h2><span class="ch-tag">${CARD_TAG}</span></div>${sym}</div>
      <p class="ch-card-text">${esc(p.card.text)}</p>
      <dl class="ch-card-rows">${row("flame", "Element", esc(p.card.element))}${row("palette", "Farbe", `${p.colors.map((d) => esc(d.name)).join(" / ")}`)}${row("pin", "Position", esc(p.card.position))}${row("hex", "Symbol", esc(p.card.symbol))}${row("sound", "Frequenz (modern zugeschrieben)", `ca. ${c.hz} Hz`)}${row("target", "Thema", esc(p.card.theme))}</dl>
      ${claimLine("chakra-modell")}`;
    if (!hasAsset("chakren-hero")) {
      q$(".ch-fig").innerHTML = figureSvg("chf", POINTS, cur);
    }
    scroll.style.setProperty("--ch", c.color);
    root.style.setProperty("--ch", c.color);
    mountSlots(q$(".ch-hero"));
  }

  // ---------------------------------------------------------------- tone and scope
  function drawScope(time: number) {
    const cv = scroll.querySelector<HTMLCanvasElement>(".ch-scope");
    if (!cv || !cv.isConnected) { raf = 0; return; }
    const c = cv.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio, 2), w = cv.clientWidth, h = cv.clientHeight;
    if (w && h) {
      if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, w, h);
      const g = c.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, "rgba(164,107,224,0)"); g.addColorStop(0.2, chakra().color); g.addColorStop(0.8, "#F0D18B"); g.addColorStop(1, "rgba(240,209,139,0)");
      c.strokeStyle = g; c.lineWidth = 1.7; c.shadowColor = chakra().color; c.shadowBlur = 8;
      c.beginPath();
      const mid = h / 2, an = tone.analyser;
      if (an) {
        buf ??= new Uint8Array(new ArrayBuffer(an.fftSize));
        an.getByteTimeDomainData(buf);
        for (let i = 0; i < buf.length; i++) { const x = (i / (buf.length - 1)) * w, y = mid + ((buf[i] - 128) / 128) * mid * 7; i ? c.lineTo(x, y) : c.moveTo(x, y); }
      } else {
        // idle: density follows the frequency on a log scale (illustration, not to scale)
        const cycles = 2 + Math.log2(hz / 20) * 2.2;
        for (let x = 0; x <= w; x += 2) { const env = Math.sin((x / w) * Math.PI), y = mid + Math.sin((x / w) * Math.PI * 2 * cycles + (api.reduceMotion ? 0 : time / 600)) * mid * 0.6 * env; x ? c.lineTo(x, y) : c.moveTo(x, y); }
      }
      c.stroke();
    }
    raf = !api.reduceMotion || tone.playing ? requestAnimationFrame(drawScope) : 0;
  }
  function startScope() { cancelAnimationFrame(raf); raf = 0; if (scroll.querySelector(".ch-scope")) raf = requestAnimationFrame(drawScope); }
  function stopTone() {
    if (tone.playing) tone.stop();
    scroll.querySelectorAll<HTMLElement>(".ch-play").forEach((b) => { b.setAttribute("aria-pressed", "false"); b.setAttribute("aria-label", "Ton abspielen"); });
  }

  // ---------------------------------------------------------------- guided reading
  function stopTimer() { clearInterval(timer); timer = 0; tStep = -1; }
  function showStep() {
    scroll.querySelectorAll<HTMLElement>(".ch-steps li").forEach((li, i) => li.classList.toggle("on", i === tStep));
    const lab = scroll.querySelector(".ch-timer");
    if (lab) lab.textContent = tStep < 0 ? "" : `Schritt ${tStep + 1} von ${tTotal} · ${Math.floor(tRemain / 60)}:${String(tRemain % 60).padStart(2, "0")}`;
  }
  function showGuide(i: number) {
    stopTimer();
    const p = page(), c = chakra(), m = p.meditations[i], steps = medSteps(m.kind, { name: c.name, pos: c.position, color: p.colors[0].name, syllable: c.syllable });
    tTotal = steps.length; tPer = Math.max(5, Math.round((m.minutes * 60) / steps.length));
    scroll.querySelectorAll<HTMLElement>("[data-med]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.med) === i)));
    openDrawer(`<h3>${esc(m.title)} <small>${m.minutes} Min. · ${MED_KINDS[m.kind].label} · ${esc(c.name)}</small></h3>
      <ol class="ch-steps">${steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
      <div class="ch-guide-ctl"><button class="ch-btn" data-timer aria-pressed="false">Mit Zeitgeber begleiten</button><span class="ch-timer" role="status" aria-live="polite"></span></div>
      <p class="ch-note">${esc(MED_NOTE)}</p>${claimLine("chakra-arbeit-heilung")}`);
  }
  function toggleTimer() {
    const btn = scroll.querySelector<HTMLElement>("[data-timer]");
    if (!btn) return;
    if (timer) { stopTimer(); btn.setAttribute("aria-pressed", "false"); btn.textContent = "Mit Zeitgeber begleiten"; showStep(); return; }
    tStep = 0; tRemain = tPer; btn.setAttribute("aria-pressed", "true"); btn.textContent = "Beenden"; showStep();
    timer = window.setInterval(() => {
      tRemain -= 1;
      if (tRemain <= 0) {
        tStep += 1;
        if (tStep >= tTotal) { stopTimer(); btn.setAttribute("aria-pressed", "false"); btn.textContent = "Mit Zeitgeber begleiten"; scroll.querySelector(".ch-timer")!.textContent = "Geschafft. Bewege dich langsam weiter."; scroll.querySelectorAll(".ch-steps li").forEach((li) => li.classList.remove("on")); return; }
        tRemain = tPer;
      }
      showStep();
    }, 1000);
  }

  // ---------------------------------------------------------------- drawer for items
  const drawer = q$(".ch-drawer");
  function openDrawer(html: string) { drawer.hidden = false; drawer.innerHTML = html; smooth(drawer); }
  function showItem(g: string, i: number) {
    const p = page();
    let it: PageItem | undefined, extra = "", claim = "chakra-zuordnungen-modern", y: (typeof YOGA)[string] | undefined;
    if (g === "stein") { it = STONES[p.stones[i]]; claim = "crystal-healing-general"; }
    else if (g === "essen") it = FOODS[p.foods[i]];
    else if (g === "duft") it = SCENTS[p.scents[i]];
    else if (g === "kraut") it = p.herbs[i];
    else if (g === "natur") it = NATURE[p.nature[i]];
    else if (g === "yoga") { y = YOGA[p.yoga[i]]; it = { name: y.name, note: `${y.sanskrit} · ${y.level}. ${y.note}`, caution: y.caution }; claim = "chakra-arbeit-heilung"; }
    if (!it) return;
    scroll.querySelectorAll<HTMLElement>("[data-item]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.item === `${g}:${i}`)));
    if (it.atlas) extra = `<p><button class="ch-btn ghost" data-atlas="${it.atlas}">Im Atlas öffnen <span aria-hidden="true">→</span></button></p>`;
    openDrawer(`<h3>${esc(it.name)} <small>${GROUP_LABEL[g] ?? ""} · ${esc(chakra().name)}</small></h3><p>${esc(it.note)}</p>${it.caution ? `<p class="ch-warn">${ico("shield")} ${esc(it.caution)}</p>` : ""}${extra}${claimLine(claim)}<p class="ch-note">Die Zuordnung stammt aus der Überlieferung, die Angabe zum Stoff ist Lehrbuchwissen. Source pending verification.</p>`);
  }

  // ---------------------------------------------------------------- render
  function renderMain(keepDrawer = false) {
    stopTimer(); stopTone();
    q$(".ch-main").innerHTML = panel();
    if (!keepDrawer) drawer.hidden = true;
    scroll.querySelectorAll<HTMLElement>("[data-tab]").forEach((b) => { const on = b.dataset.tab === tab; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; });
    mountSlots(q$(".ch-main"));
    startScope();
  }
  function renderAll() {
    scroll.querySelectorAll<HTMLElement>("[data-chakra]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.chakra === cur)));
    scroll.querySelector<HTMLElement>(`[data-chakra="${cur}"]`)?.scrollIntoView({ inline: "center", block: "nearest" });
    renderHero(); renderMain();
  }
  function select(id: string) {
    if (!CHAKRAS.some((c) => c.id === id)) return;
    cur = id; hz = chakra().hz; affIdx = 0;
    renderAll();
  }

  scroll.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) { api.openClaim(cl.dataset.claim!, cl); return; }
    const ch = t.closest<HTMLElement>("[data-chakra]");
    if (ch) { select(ch.dataset.chakra!); return; }
    const st = t.closest<HTMLElement>("[data-step]");
    if (st && st.classList.contains("ch-arrow")) { const i = CHAKRAS.findIndex((c) => c.id === cur) + Number(st.dataset.step); select(CHAKRAS[(i + CHAKRAS.length) % CHAKRAS.length].id); return; }
    const tb = t.closest<HTMLElement>("[data-tab]");
    if (tb) { tab = tb.dataset.tab!; renderMain(); return; }
    const tg = t.closest<HTMLElement>("[data-tab-go]");
    if (tg) { tab = tg.dataset.tabGo!; renderMain(); smooth(q$("#ch-tabs")); return; }
    const it = t.closest<HTMLElement>("[data-item]");
    if (it) { const [g, i] = it.dataset.item!.split(":"); showItem(g, Number(i)); return; }
    const at = t.closest<HTMLElement>("[data-atlas]");
    if (at) { api.openAtlas(at.dataset.atlas!); return; }
    const md = t.closest<HTMLElement>("[data-med]");
    if (md) { showGuide(Number(md.dataset.med)); return; }
    if (t.closest("[data-timer]")) { toggleTimer(); return; }
    const hzb = t.closest<HTMLElement>("[data-hz]");
    if (hzb) {
      hz = Number(hzb.dataset.hz);
      scroll.querySelectorAll<HTMLElement>("[data-hz]").forEach((b) => b.setAttribute("aria-pressed", String(b === hzb)));
      const c = chakra(), p = page();
      const big = scroll.querySelector<HTMLElement>(".ch-hzbig");
      if (big) { big.querySelector("b")!.textContent = String(hz); big.querySelector("small")!.textContent = hz === c.hz ? p.hzLabel : HZ_LABEL[hz] ?? ""; }
      if (tone.playing) tone.setHz(hz);
      return;
    }
    const pl = t.closest<HTMLElement>(".ch-play");
    if (pl) {
      if (tone.playing) { stopTone(); return; }
      if (tone.start(hz)) { pl.setAttribute("aria-pressed", "true"); pl.setAttribute("aria-label", "Ton anhalten"); startScope(); }
      return;
    }
    const af = t.closest<HTMLElement>("[data-aff]");
    if (af) { affIdx = Number(af.dataset.aff); renderMain(); return; }
    const ac = t.closest<HTMLElement>("[data-act]");
    if (ac) {
      switch (ac.dataset.act) {
        case "guide": tab = "meditation"; renderMain(); showGuide(0); break;
        case "three-d": api.openChakra3d(cur); break;
        case "crystals": api.openCrystals(); break;
        case "plants": api.openPlants(); break;
        case "atem": api.openAtem(); break;
        case "freq": api.openFreq(); break;
        case "beschwerden": api.openBeschwerden(); break;
      }
    }
  });
  // arrow keys move through the tabs like in a tab list
  q$(".ch-tabs").addEventListener("keydown", (e) => {
    const k = (e as KeyboardEvent).key;
    if (k !== "ArrowRight" && k !== "ArrowLeft") return;
    const i = TABS.findIndex(([id]) => id === tab), n = TABS[(i + (k === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length][0];
    tab = n; renderMain(); scroll.querySelector<HTMLElement>(`[data-tab="${n}"]`)?.focus();
  });

  mountSlots(scroll);
  renderAll();
  return {
    /** opens the page on one chakra */
    show(id?: string) { tab = "uebersicht"; if (id && CHAKRAS.some((c) => c.id === id)) select(id); else renderAll(); },
    start() { startScope(); },
    stop() { stopTimer(); stopTone(); cancelAnimationFrame(raf); raf = 0; },
  };
}
