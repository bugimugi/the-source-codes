import { CULTURES_NOTICE, DOSSIERS, KIND_SECTION, KIND_TAG, PATTERNS, PATTERN_ANSWER, THEMES, type BlockKind, type Dossier, type FringeClaim, type Theme } from "../data/cultures";
import { LEVEL_LABEL } from "../data/types";
import { mountSlots } from "../assets/slots";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const ORDER: BlockKind[] = ["fund", "wissen", "glaube", "raetsel"];
const TAG_COLOR: Record<BlockKind, string> = { fund: "var(--lvl-historical)", wissen: "var(--lvl-historical)", glaube: "var(--gold-hi)", raetsel: "var(--cyan)" };

export interface CulturesApi { reduceMotion: boolean }

/**
 * "Alte Kulturen": a time journey of eight dossiers. Each dossier keeps four things apart: what is documented, what the
 * culture believed, what is open, and fringe claims. Claims start "redacted" (a black bar) and are revealed on click;
 * every one carries its evidence level and the counter-evidence. Works without WebGL.
 */
export function initCultures(root: HTMLElement, api: CulturesApi) {
  const stationsEl = root.querySelector<HTMLElement>(".cu-stations")!;
  const pathSvg = root.querySelector<SVGSVGElement>(".cu-pathsvg")!;
  const themesEl = root.querySelector<HTMLElement>(".cu-themes")!;
  const file = root.querySelector<HTMLElement>(".cu-file")!;
  const fileBody = file.querySelector<HTMLElement>(".cu-file-body")!;
  const closeBtn = file.querySelector<HTMLButtonElement>(".cu-file-close")!;
  let theme: Theme | null = null;
  let opener: HTMLElement | null = null;
  let openId: string | null = null;

  // ---- themes
  themesEl.innerHTML = THEMES.map((t) => `<button class="cu-theme" data-theme="${t.id}" aria-pressed="false"><div class="cu-theme-img" data-slot="${t.slot}" data-fit="cover" data-sizes="(max-width: 700px) 25vw, 12vw"></div><span>${esc(t.label)}</span></button>`).join("");

  // ---- stations
  const count = (d: Dossier, t: Theme) => d.blocks.filter((b) => b.themes.includes(t)).length;
  stationsEl.insertAdjacentHTML("beforeend", DOSSIERS.map((d, i) => `
    <article class="cu-st ${i % 2 ? "right" : "left"}" data-st="${d.id}">
      <div class="cu-st-bg" data-slot="${d.slot}" data-fit="cover" data-sizes="(max-width: 900px) 100vw, 50vw"></div>
      <i class="cu-node" aria-hidden="true"></i>
      <div class="cu-st-body">
        <span class="cu-nr">${d.nr}</span>
        <h3>${esc(d.name)}</h3>
        <p class="cu-period">${esc(d.period)}</p>
        <p class="cu-tags">${d.tags.map(esc).join(" · ")}</p>
        <p class="cu-hit" hidden></p>
        <button class="cu-open" data-open="${d.id}">Akte öffnen <span aria-hidden="true">→</span></button>
      </div>
    </article>`).join(""));

  // ---- patterns and more
  root.querySelector<HTMLElement>(".cu-pattern-grid")!.innerHTML = PATTERNS.map((p) => `<article class="cu-card"><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></article>`).join("");
  root.querySelector<HTMLElement>(".cu-answer")!.textContent = PATTERN_ANSWER;
  root.querySelector<HTMLElement>(".cu-notice")!.textContent = CULTURES_NOTICE;
  mountSlots(root);

  // ---- the winding path behind the stations
  function drawPath() {
    const box = stationsEl.getBoundingClientRect();
    if (!box.width) return;
    const pts = [...stationsEl.querySelectorAll<HTMLElement>(".cu-node")].map((n) => {
      const r = n.getBoundingClientRect();
      return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
    });
    pathSvg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    pathSvg.setAttribute("width", String(box.width));
    pathSvg.setAttribute("height", String(box.height));
    let dpath = `M ${pts[0].x} ${pts[0].y - 30}`;
    pts.forEach((p, i) => {
      const prev = i ? pts[i - 1] : { x: p.x, y: p.y - 30 };
      const dy = (p.y - prev.y) / 2;
      dpath += ` C ${prev.x} ${prev.y + dy}, ${p.x} ${p.y - dy}, ${p.x} ${p.y}`;
    });
    dpath += ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y + 30}`;
    pathSvg.querySelectorAll("path").forEach((el) => el.setAttribute("d", dpath));
  }
  new ResizeObserver(drawPath).observe(stationsEl);
  addEventListener("load", drawPath);

  // ---- theme filter: stations without entries for the theme dim, the others say how many entries match
  function applyTheme() {
    themesEl.querySelectorAll<HTMLElement>(".cu-theme").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.theme === theme)));
    stationsEl.querySelectorAll<HTMLElement>(".cu-st").forEach((el) => {
      const d = DOSSIERS.find((x) => x.id === el.dataset.st)!;
      const n = theme ? count(d, theme) : 0;
      el.classList.toggle("dim", !!theme && n === 0);
      const hit = el.querySelector<HTMLElement>(".cu-hit")!;
      hit.hidden = !theme || n === 0;
      if (theme && n) hit.textContent = `${n} ${n === 1 ? "Eintrag" : "Einträge"} zu „${THEMES.find((t) => t.id === theme)!.label}“`;
    });
  }

  // ---- the file (drawer)
  const claimHtml = (c: FringeClaim, from?: string) => `
    <div class="cu-claim">
      <button class="cu-redact" aria-expanded="false"><span class="cu-bar" aria-hidden="true"></span><span class="cu-redact-label">Behauptung · Schwärzung aufheben</span></button>
      <div class="cu-claim-body" hidden>
        <p class="cu-claim-text">${from ? `<small>${esc(from)}</small>` : ""}„${esc(c.text)}“</p>
        <span class="cu-level" style="--c:var(--lvl-${c.level})">${esc(LEVEL_LABEL[c.level])}</span>
        <p class="cu-counter"><strong>Einordnung und Gegenbelege:</strong> ${esc(c.counter)}</p>
      </div>
    </div>`;

  function renderFile(d: Dossier) {
    const sections = ORDER.map((k) => {
      const bl = d.blocks.filter((b) => b.kind === k);
      if (!bl.length) return "";
      return `<section class="cu-sec"><h3>${KIND_SECTION[k]}</h3>${bl.map((b) => `
        <article class="cu-block${theme && b.themes.includes(theme) ? " match" : ""}">
          <span class="cu-kind" style="--c:${TAG_COLOR[k]}">${KIND_TAG[k]}</span>
          <h4>${esc(b.title)}</h4><p>${esc(b.text)}</p>
        </article>`).join("")}</section>`;
    }).join("");
    const i = DOSSIERS.indexOf(d);
    const prev = DOSSIERS[i - 1], next = DOSSIERS[i + 1];
    fileBody.innerHTML = `
      <div class="cu-stamp" aria-hidden="true">Pilot · ungeprüft</div>
      <p class="cu-file-no">Akte ${d.nr} von ${DOSSIERS.length}</p>
      <h2 id="cu-file-title">${esc(d.name)}</h2>
      <dl class="cu-meta"><div><dt>Zeitraum</dt><dd>${esc(d.period)}</dd></div><div><dt>Region</dt><dd>${esc(d.region)}</dd></div></dl>
      <p class="cu-tagline">${esc(d.tagline)}</p>
      ${sections}
      ${d.claims.length ? `<section class="cu-sec"><h3>Behauptungen &amp; Gegenbelege</h3><p class="cu-small">Diese Aussagen kursieren, sind aber nicht oder nicht ausreichend belegt. Jede steht mit ihrer Belegstufe und den Gegenbelegen da.</p>${d.claims.map((c) => claimHtml(c)).join("")}</section>` : ""}
      <p class="cu-small">Quellen: Source pending verification. ${esc(CULTURES_NOTICE.split(".")[0])}.</p>
      <nav class="cu-file-nav">${prev ? `<button data-open="${prev.id}">← ${esc(prev.name)}</button>` : "<span></span>"}${next ? `<button data-open="${next.id}">${esc(next.name)} →</button>` : "<span></span>"}</nav>`;
  }

  function renderList(kind: "raetsel" | "claims") {
    if (kind === "raetsel") {
      fileBody.innerHTML = `
        <div class="cu-stamp" aria-hidden="true">Sammelakte</div>
        <p class="cu-file-no">Alle Akten</p>
        <h2 id="cu-file-title">Archäologische Rätsel</h2>
        <p class="cu-tagline">Was bis heute offen ist.</p>
        ${DOSSIERS.map((d) => { const r = d.blocks.filter((b) => b.kind === "raetsel"); return r.length ? `<section class="cu-sec"><h3>${esc(d.nr)} · ${esc(d.name)}</h3>${r.map((b) => `<article class="cu-block"><span class="cu-kind" style="--c:${TAG_COLOR.raetsel}">${KIND_TAG.raetsel}</span><h4>${esc(b.title)}</h4><p>${esc(b.text)}</p></article>`).join("")}<button class="cu-link" data-open="${d.id}">Zur Akte ${esc(d.nr)} →</button></section>` : ""; }).join("")}
        <p class="cu-small">Quellen: Source pending verification.</p>`;
    } else {
      fileBody.innerHTML = `
        <div class="cu-stamp" aria-hidden="true">Sammelakte</div>
        <p class="cu-file-no">Alle Akten</p>
        <h2 id="cu-file-title">Behauptungen &amp; Gegenbelege</h2>
        <p class="cu-tagline">Was kursiert, und was die Forschung dazu sagt.</p>
        <p class="cu-small">Die Behauptungen sind zunächst „geschwärzt“. Ein Klick deckt sie auf und zeigt Belegstufe und Gegenbelege. Keine davon wird als Tatsache dargestellt.</p>
        ${DOSSIERS.map((d) => d.claims.length ? `<section class="cu-sec"><h3>${esc(d.nr)} · ${esc(d.name)}</h3>${d.claims.map((c) => claimHtml(c)).join("")}<button class="cu-link" data-open="${d.id}">Zur Akte ${esc(d.nr)} →</button></section>` : "").join("")}
        <p class="cu-small">Quellen: Source pending verification.</p>`;
    }
  }

  function openFile(render: () => void, from: HTMLElement | null) {
    if (file.hidden) opener = from;
    render();
    file.hidden = false;
    file.scrollTop = 0;
    root.classList.add("file-open");
    closeBtn.focus();
  }
  function closeFile() {
    if (file.hidden) return;
    file.hidden = true;
    root.classList.remove("file-open");
    openId = null;
    opener?.focus();
  }
  function openDossier(id: string, from: HTMLElement | null) {
    const d = DOSSIERS.find((x) => x.id === id);
    if (!d) return;
    openId = id;
    openFile(() => renderFile(d), from);
  }

  root.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const op = t.closest<HTMLElement>("[data-open]");
    if (op) { openDossier(op.dataset.open!, op.closest(".cu-file") ? opener : op); return; }
    const th = t.closest<HTMLElement>(".cu-theme");
    if (th) { theme = theme === th.dataset.theme ? null : (th.dataset.theme as Theme); applyTheme(); return; }
    const red = t.closest<HTMLButtonElement>(".cu-redact");
    if (red) {
      const body = red.nextElementSibling as HTMLElement;
      const open = red.getAttribute("aria-expanded") !== "true";
      red.setAttribute("aria-expanded", String(open));
      body.hidden = !open;
      red.classList.toggle("open", open);
      if (open) { body.tabIndex = -1; body.focus({ preventScroll: true }); }
      return;
    }
    if (t.closest("[data-list]")) { const k = (t.closest("[data-list]") as HTMLElement).dataset.list as "raetsel" | "claims"; openFile(() => renderList(k), t.closest("button")); return; }
    if (t.closest("[data-scroll-to]")) { root.querySelector<HTMLElement>(`.${(t.closest("[data-scroll-to]") as HTMLElement).dataset.scrollTo}`)?.scrollIntoView({ behavior: api.reduceMotion ? "auto" : "smooth", block: "start" }); return; }
  });
  closeBtn.addEventListener("click", closeFile);
  // on the document: revealing a claim removes the focused button from the page, so focus can fall back to <body>
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !file.hidden && !root.hidden) { e.stopPropagation(); closeFile(); } });

  return {
    start() { requestAnimationFrame(drawPath); },
    stop() { closeFile(); },
    get openId() { return openId; },
  };
}
