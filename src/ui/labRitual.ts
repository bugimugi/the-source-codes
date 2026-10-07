import { atlas } from "../data/atlas";
import { CHAKRAS, type Chakra } from "../data/chakras";
import { claims } from "../data/claims";
import { LEVEL_LABEL } from "../data/types";
import { createTone } from "../audio/tone";
import { esc } from "./dossierParts";

/**
 * Ritual room: an illustration of how the tradition imagines healing stones, sound and chakras working together. It is a
 * model of an IDEA, not a measurement: the start state of the chakras is an arbitrary example, the speed of the "balancing"
 * is a time-lapse, and the radius of a stone is freely adjustable because there is no measured value. Which stone belongs to
 * which chakra, and which frequency to which chakra, comes from the library (src/data/chakras.ts, content/atlas) and is labelled
 * as modern doctrine there. The page says so, and shows the evidence next to the scene.
 */
const W = 800, H = 520;
const CX = 400, CY = 372;          // the seat of the person on the floor
const SX = 105, SY = 40;           // pixels per metre (floor is squashed to give depth)
const MAX_STONES = 4;
const START_LEVEL: Record<string, number> = { wurzel: 0.3, sakral: 0.72, solar: 0.42, herz: 0.28, hals: 0.78, stirn: 0.38, krone: 0.6 };
const ORB_Y: Record<string, number> = { krone: 118, stirn: 168, hals: 212, herz: 254, solar: 288, sakral: 318, wurzel: 346 };
const BALANCED = 0.8;
const FREQS = [...new Set([432, ...CHAKRAS.map((c) => c.hz)])].sort((a, b) => a - b);

interface Stone { id: string; name: string; color: string; chakras: Chakra[]; dist: number; angle: number }

const stoneDefs = atlas
  .filter((e) => e.category === "kristall")
  .map((e) => ({ id: e.id, name: e.name, color: e.model.color, chakras: e.associations.map((a) => CHAKRAS.find((c) => c.target === a.target)).filter((c): c is Chakra => !!c) }))
  .filter((s) => s.chakras.length);

export interface RitualApi { reduceMotion: boolean; openClaim(id: string, from: HTMLElement): void }

export function initRitual(root: HTMLElement, api: RitualApi) {
  const svg = root.querySelector<SVGSVGElement>(".rt-svg")!;
  const stoneBar = root.querySelector<HTMLElement>(".rt-palette")!;
  const placed = root.querySelector<HTMLElement>(".rt-placed")!;
  const freqBar = root.querySelector<HTMLElement>(".rt-freqs")!;
  const soundBtn = root.querySelector<HTMLButtonElement>(".rt-sound")!;
  const radiusIn = root.querySelector<HTMLInputElement>(".rt-radius")!;
  const radiusOut = root.querySelector<HTMLOutputElement>(".rt-radius-out")!;
  const resetBtn = root.querySelector<HTMLButtonElement>(".rt-reset")!;
  const state = root.querySelector<HTMLElement>(".rt-state")!;
  const evidence = root.querySelector<HTMLElement>(".rt-evidence")!;
  const tone = createTone();

  const levels: Record<string, number> = { ...START_LEVEL };
  const stones: Stone[] = [];
  let hz = 432;
  let radius = Number(radiusIn.value);
  let running = false, raf = 0, last = 0, t = 0;
  let dragging: Stone | null = null;

  // ---------------------------------------------------------------- static scene
  const ns = "http://www.w3.org/2000/svg";
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.innerHTML = `
    <defs>
      <radialGradient id="rt-floor" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#17313c"/><stop offset="1" stop-color="#050c12"/></radialGradient>
      <radialGradient id="rt-aura"><stop offset="0" stop-color="#58D6E8" stop-opacity="0.35"/><stop offset="1" stop-color="#58D6E8" stop-opacity="0"/></radialGradient>
      <filter id="rt-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <ellipse cx="${CX}" cy="${CY + 18}" rx="370" ry="118" fill="url(#rt-floor)" stroke="rgba(203,170,103,.25)"/>
    <g class="rt-grid" stroke="rgba(203,170,103,.12)" fill="none">${[1, 2, 3].map((m) => `<ellipse cx="${CX}" cy="${CY}" rx="${m * SX}" ry="${m * SY}"/>`).join("")}
      ${[1, 2, 3].map((m) => `<text x="${CX + m * SX + 4}" y="${CY + 4}" fill="rgba(203,170,103,.55)" stroke="none" font-size="11">${m} m</text>`).join("")}</g>
    <ellipse class="rt-auraEl" cx="${CX}" cy="236" rx="150" ry="215" fill="url(#rt-aura)"/>
    <g class="rt-ripples"></g>
    <g class="rt-rings"></g>
    <g class="rt-links" stroke="rgba(240,209,139,.4)" stroke-dasharray="4 5"></g>
    <g class="rt-fig">
      <ellipse cx="${CX}" cy="362" rx="118" ry="19" fill="#000" opacity=".35"/>
      <path d="M300 352 C312 322 362 318 400 336 C438 318 488 322 500 352 C482 374 424 372 400 362 C376 372 318 374 300 352 Z" fill="rgba(88,214,232,.1)" stroke="#58D6E8" stroke-opacity=".7" stroke-width="1.5"/>
      <path d="M352 214 C340 240 342 300 366 336 L434 336 C458 300 460 240 448 214 C432 204 368 204 352 214 Z" fill="rgba(88,214,232,.1)" stroke="#58D6E8" stroke-opacity=".7" stroke-width="1.5"/>
      <path d="M352 218 C330 262 322 306 340 342 M448 218 C470 262 478 306 460 342" fill="none" stroke="#58D6E8" stroke-opacity=".6" stroke-width="1.5"/>
      <circle cx="${CX}" cy="176" r="27" fill="rgba(88,214,232,.1)" stroke="#58D6E8" stroke-opacity=".7" stroke-width="1.5"/>
      <path d="M${CX} 203 L${CX} 346" stroke="rgba(240,209,139,.55)" stroke-width="1.2"/>
    </g>
    <g class="rt-orbs"></g>
    <g class="rt-stones"></g>`;
  const q = (sel: string) => svg.querySelector<SVGGElement>(sel)!;
  const orbsG = q(".rt-orbs"), stonesG = q(".rt-stones"), ringsG = q(".rt-rings"), linksG = q(".rt-links"), ripplesG = q(".rt-ripples");
  const auraEl = svg.querySelector<SVGEllipseElement>(".rt-auraEl")!;

  const orbEls = CHAKRAS.map((c) => {
    const g = document.createElementNS(ns, "g");
    g.innerHTML = `<circle class="halo" r="20" fill="${c.color}" opacity=".25" filter="url(#rt-blur)"/><circle class="core" r="10" fill="${c.color}"/><text class="lbl" x="22" y="4" font-size="11" fill="rgba(236,232,222,.75)">${esc(c.name.replace("chakra", "").replace("-Chakra", ""))}</text>`;
    orbsG.append(g);
    return { c, g, halo: g.querySelector<SVGCircleElement>(".halo")!, core: g.querySelector<SVGCircleElement>(".core")! };
  });

  // ---------------------------------------------------------------- controls
  stoneBar.innerHTML = stoneDefs.map((s) => `<button class="rt-chip" data-stone="${s.id}" aria-pressed="false" style="--c:${s.color === "#0b0b12" || s.color === "#15151a" ? "#8a8a96" : s.color}"><i></i>${esc(s.name.replace(/ \(.*\)/, ""))}</button>`).join("");
  freqBar.innerHTML = `<button class="rt-chip" data-hz="0" aria-pressed="true">kein Klang</button>${FREQS.map((f) => `<button class="rt-chip" data-hz="${f}" aria-pressed="false">${f} Hz</button>`).join("")}`;
  hz = 0;

  const toMeters = (e: PointerEvent) => {
    const r = svg.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W, y = ((e.clientY - r.top) / r.height) * H;
    return { X: (x - CX) / SX, Z: (y - CY) / SY };
  };
  const pos = (s: Stone) => ({ X: s.dist * Math.sin(s.angle), Z: s.dist * Math.cos(s.angle) });
  const screen = (X: number, Z: number) => ({ x: CX + X * SX, y: CY + Z * SY });

  function addStone(id: string) {
    const def = stoneDefs.find((s) => s.id === id)!;
    if (stones.length >= MAX_STONES) return;
    stones.push({ ...def, dist: 1.5, angle: ((stones.length * 70) % 360) * (Math.PI / 180) * (stones.length % 2 ? -1 : 1) });
    sync();
  }
  function removeStone(id: string) {
    const i = stones.findIndex((s) => s.id === id);
    if (i >= 0) stones.splice(i, 1);
    sync();
  }

  // ---------------------------------------------------------------- model
  /** How many "supports" each chakra currently gets: a stone within its radius counts 1, the matching frequency counts 1. */
  function support(): Record<string, number> {
    const out: Record<string, number> = {};
    for (const c of CHAKRAS) out[c.id] = 0;
    for (const s of stones) if (s.dist <= radius) for (const c of s.chakras) out[c.id] += 1;
    if (hz && tone.playing) for (const c of CHAKRAS) if (c.hz === hz) out[c.id] += 1;
    return out;
  }
  const average = () => CHAKRAS.reduce((a, c) => a + levels[c.id], 0) / CHAKRAS.length;
  const spread = () => { const m = average(); return Math.sqrt(CHAKRAS.reduce((a, c) => a + (levels[c.id] - m) ** 2, 0) / CHAKRAS.length); };

  // ---------------------------------------------------------------- drawing
  function draw() {
    // orbs
    for (const o of orbEls) {
      const l = levels[o.c.id];
      const wob = api.reduceMotion ? 0 : Math.sin(t * 3 + o.c.petals) * (1 - l) * 3.2;
      const r = 6 + 12 * l;
      o.core.setAttribute("r", r.toFixed(1));
      o.halo.setAttribute("r", (r * 2 + 4).toFixed(1));
      o.halo.setAttribute("opacity", (0.12 + 0.5 * l).toFixed(2));
      o.core.setAttribute("opacity", (0.45 + 0.55 * l).toFixed(2));
      o.g.setAttribute("transform", `translate(${(CX + wob).toFixed(1)} ${(ORB_Y[o.c.id] + (api.reduceMotion ? 0 : Math.cos(t * 2.3 + o.c.petals) * (1 - l) * 2)).toFixed(1)})`);
    }
    auraEl.setAttribute("opacity", (0.25 + 0.75 * average()).toFixed(2));
    auraEl.setAttribute("rx", (125 + 45 * average() - spread() * 40).toFixed(0));
    // stones, rings, links
    ringsG.replaceChildren(); linksG.replaceChildren(); stonesG.replaceChildren();
    for (const s of stones) {
      const { X, Z } = pos(s);
      const p = screen(X, Z), inside = s.dist <= radius, sc = 1 + Z * 0.1;
      const ring = document.createElementNS(ns, "ellipse");
      ring.setAttribute("cx", String(p.x)); ring.setAttribute("cy", String(p.y)); ring.setAttribute("rx", String(radius * SX)); ring.setAttribute("ry", String(radius * SY));
      ring.setAttribute("fill", s.color); ring.setAttribute("fill-opacity", inside ? "0.1" : "0.04"); ring.setAttribute("stroke", s.color === "#0b0b12" || s.color === "#15151a" ? "#8a8a96" : s.color);
      ring.setAttribute("stroke-opacity", inside ? "0.8" : "0.4"); ring.setAttribute("stroke-dasharray", "6 6");
      ringsG.append(ring);
      const link = document.createElementNS(ns, "line");
      link.setAttribute("x1", String(p.x)); link.setAttribute("y1", String(p.y)); link.setAttribute("x2", String(CX)); link.setAttribute("y2", String(CY));
      linksG.append(link);
      const mid = document.createElementNS(ns, "text");
      mid.setAttribute("x", String((p.x + CX) / 2)); mid.setAttribute("y", String((p.y + CY) / 2 - 6)); mid.setAttribute("text-anchor", "middle"); mid.setAttribute("font-size", "12");
      mid.setAttribute("fill", inside ? "#F0D18B" : "rgba(236,232,222,.6)"); mid.textContent = `${s.dist.toFixed(1).replace(".", ",")} m`;
      linksG.append(mid);
      const g = document.createElementNS(ns, "g");
      g.setAttribute("class", "rt-stone"); g.setAttribute("tabindex", "0"); g.setAttribute("role", "button");
      g.setAttribute("aria-label", `${s.name}, ${s.dist.toFixed(1).replace(".", ",")} Meter von der Person, ${inside ? "im" : "außerhalb des"} Radius. Pfeiltasten verschieben.`);
      g.dataset.stone = s.id;
      g.setAttribute("transform", `translate(${p.x} ${p.y}) scale(${sc})`);
      g.innerHTML = `<ellipse cx="0" cy="9" rx="13" ry="4" fill="#000" opacity=".4"/><polygon points="0,-15 12,-3 7,11 -7,11 -12,-3" fill="${s.color}" stroke="#ECE8DE" stroke-opacity=".7" stroke-width="1.2"/><polygon points="0,-15 12,-3 0,2 -12,-3" fill="#fff" opacity=".18"/>`;
      stonesG.append(g);
    }
    // sound ripples
    if (tone.playing && !api.reduceMotion && ripplesG.childElementCount === 0) {
      for (let i = 0; i < 3; i++) {
        const c = document.createElementNS(ns, "ellipse");
        c.setAttribute("class", "rt-ripple"); c.setAttribute("cx", String(CX)); c.setAttribute("cy", String(CY - 20)); c.setAttribute("rx", "60"); c.setAttribute("ry", "24");
        (c as SVGElement).style.animationDelay = `${i * 1.1}s`;
        ripplesG.append(c);
      }
    }
    if (!tone.playing && ripplesG.childElementCount) ripplesG.replaceChildren();
  }

  function describe() {
    const sup = support();
    const active = CHAKRAS.filter((c) => sup[c.id] > 0);
    const m = average(), sp = spread();
    const label = sp < 0.06 && m > 0.7 ? "ausgeglichen (Darstellung)" : sp > 0.18 ? "unausgeglichen (Beispielzustand)" : "auf dem Weg zum Ausgleich (Darstellung)";
    state.innerHTML = `<strong>${label}</strong>${active.length ? ` · gestützt in dieser Vorstellung: ${active.map((c) => esc(c.name)).join(", ")}` : " · nichts aktiv: Stein in den Radius legen oder Klang einschalten"}`;
    placed.innerHTML = stones.length
      ? stones.map((s) => `<li><span class="rt-dot" style="background:${s.color}"></span><div><strong>${esc(s.name)}</strong><small>${s.dist <= radius ? "im Radius" : "außerhalb des Radius"} · nach moderner Lehre: ${s.chakras.map((c) => esc(c.name)).join(", ")}</small></div>
          <label>Abstand <input type="range" min="0.5" max="3" step="0.1" value="${s.dist}" data-dist="${s.id}" aria-label="Abstand von ${esc(s.name)} in Metern"><output>${s.dist.toFixed(1).replace(".", ",")} m</output></label>
          <button class="rt-x" data-remove="${s.id}" aria-label="${esc(s.name)} entfernen">×</button></li>`).join("")
      : `<li class="rt-none">Noch kein Stein platziert. Wähle oben bis zu ${MAX_STONES} Steine; sie erscheinen vor der Person und lassen sich ziehen.</li>`;
  }

  function sync() {
    stoneBar.querySelectorAll<HTMLElement>("[data-stone]").forEach((b) => b.setAttribute("aria-pressed", String(stones.some((s) => s.id === b.dataset.stone))));
    stoneBar.querySelectorAll<HTMLButtonElement>("[data-stone]").forEach((b) => (b.disabled = stones.length >= MAX_STONES && !stones.some((s) => s.id === b.dataset.stone)));
    freqBar.querySelectorAll<HTMLElement>("[data-hz]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.hz) === hz)));
    soundBtn.setAttribute("aria-pressed", String(tone.playing));
    soundBtn.textContent = tone.playing ? "Klang ausschalten" : "Klang einschalten";
    soundBtn.disabled = !hz;
    radiusOut.textContent = `${radius.toFixed(1).replace(".", ",")} m`;
    describe(); draw();
    if (!running) loop();
  }

  // ---------------------------------------------------------------- simulation loop (only while there is something to animate)
  function step(dt: number) {
    const sup = support();
    let moving = false;
    for (const c of CHAKRAS) {
      const l = levels[c.id];
      if (sup[c.id] > 0 && l < BALANCED - 0.002) {
        const rate = (api.reduceMotion ? 8 : 0.07) * Math.sqrt(sup[c.id]);
        levels[c.id] = Math.min(BALANCED, l + (BALANCED - l) * rate * dt + 0.0004);
        moving = true;
      }
    }
    return moving;
  }
  function loop(now = performance.now()) {
    cancelAnimationFrame(raf);
    const dt = Math.min((now - (last || now)) / 1000, 0.1);
    last = now; t += dt;
    const moving = step(dt);
    draw();
    if (moving) describe();
    // keep running while visible and something moves (levels, sound ripples, imbalance wobble)
    const wobble = !api.reduceMotion && CHAKRAS.some((c) => levels[c.id] < 0.7);
    running = active && (moving || wobble);
    if (running) raf = requestAnimationFrame(loop); else last = 0;
  }
  let active = false;

  // ---------------------------------------------------------------- events
  root.addEventListener("click", (e) => {
    const t2 = e.target as HTMLElement;
    const st = t2.closest<HTMLElement>("[data-stone]");
    if (st && st.closest(".rt-palette")) { const id = st.dataset.stone!; if (stones.some((s) => s.id === id)) removeStone(id); else addStone(id); return; }
    const rm = t2.closest<HTMLElement>("[data-remove]");
    if (rm) { removeStone(rm.dataset.remove!); return; }
    const fq = t2.closest<HTMLElement>("[data-hz]");
    if (fq && fq.closest(".rt-freqs")) {
      hz = Number(fq.dataset.hz);
      if (!hz) tone.stop(); else if (tone.playing) tone.setHz(hz);
      sync(); return;
    }
    const cl = t2.closest<HTMLElement>("[data-claim]");
    if (cl) api.openClaim(cl.dataset.claim!, cl);
  });
  root.addEventListener("input", (e) => {
    const el = e.target as HTMLInputElement;
    if (el.dataset.dist) { const s = stones.find((x) => x.id === el.dataset.dist); if (s) { s.dist = Number(el.value); sync(); } }
  });
  radiusIn.addEventListener("input", () => { radius = Number(radiusIn.value); sync(); });
  soundBtn.addEventListener("click", () => {
    if (tone.playing) tone.stop(); else if (hz) tone.start(hz);
    sync();
  });
  resetBtn.addEventListener("click", () => { Object.assign(levels, START_LEVEL); sync(); });

  // dragging stones on the floor
  svg.addEventListener("pointerdown", (e) => {
    const g = (e.target as Element).closest<SVGGElement>(".rt-stone");
    if (!g) return;
    dragging = stones.find((s) => s.id === g.dataset.stone) ?? null;
    if (dragging) svg.setPointerCapture(e.pointerId);
  });
  svg.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const { X, Z } = toMeters(e);
    dragging.dist = Math.min(3, Math.max(0.5, Math.hypot(X, Z)));
    dragging.angle = Math.atan2(X, Z);
    sync();
  });
  svg.addEventListener("pointerup", () => { dragging = null; });
  svg.addEventListener("keydown", (e) => {
    const g = (e.target as Element).closest<SVGGElement>(".rt-stone");
    const s = g && stones.find((x) => x.id === g.dataset.stone);
    if (!s) return;
    const k = e.key;
    if (k === "ArrowUp") s.dist = Math.max(0.5, s.dist - 0.1);
    else if (k === "ArrowDown") s.dist = Math.min(3, s.dist + 0.1);
    else if (k === "ArrowLeft") s.angle += 0.17;
    else if (k === "ArrowRight") s.angle -= 0.17;
    else return;
    e.preventDefault();
    sync();
    svg.querySelector<SVGGElement>(`.rt-stone[data-stone="${s.id}"]`)?.focus();
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden && tone.playing) { tone.stop(); sync(); } });

  // ---------------------------------------------------------------- evidence next to the scene (library claims + plain statements)
  const claimIds = ["crystal-healing-general"];
  const link = (label: string, url: string) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
  evidence.innerHTML = `
    <div>
      <h3>Was du hier siehst</h3>
      <p>Eine <strong>Vorstellungshilfe</strong>: So denkt die moderne Chakren- und Kristalllehre den Vorgang. Der Startzustand der Chakren ist ein frei gewähltes Beispiel, der Ausgleich läuft im Zeitraffer, und der Radius der Steine ist frei einstellbar. Eine Quelle für „Amethyst wirkt in 1 bis 2 Metern Abstand“ oder für irgendeinen Wirkradius habe ich nicht gefunden.</p>
      <h3>Was untersucht wurde</h3>
      <ul>
        <li><strong>Kristalle:</strong> French u. a. (2001, Konferenzvortrag, 80 Freiwillige): echte Quarze und Plastiknachbildungen lösten gleich häufig Empfindungen wie Kribbeln oder Wärme aus. Das spricht für Erwartung statt Kristallwirkung.</li>
        <li><strong>Rosenquarz:</strong> Escolà-Gascón u. a. (2025, CNS Spectrums, 138 Erwachsene, zufällig verteilt): Die Angst sank nur bei Menschen, die an Kristallwirkung glauben, unabhängig davon, ob sie einen echten oder einen Placebo-Stein hielten.</li>
        <li><strong>Klang:</strong> Eine Beobachtungsstudie mit 62 Personen (Goldsby u. a. 2017) fand nach Klangschalen-Meditation weniger Anspannung, hatte aber keine Kontrollgruppe. Eine Übersichtsarbeit (Stanhope &amp; Weinstein 2020) fand nur vier Studien und sah keine Grundlage für eine Empfehlung.</li>
      </ul>
      <p class="rt-small">Alles aus Suchauszügen, Originale nicht geprüft: Source pending verification.</p>
    </div>
    <div>
      <h3>Woher die Idee kommt</h3>
      <ul>
        <li>Chakren stammen aus indischen Tantra-Texten (Sat-cakra-nirupana, 1577; 1919 von Woodroffe als „The Serpent Power“ übersetzt). Die heutige westliche Form mit sieben Chakren in Regenbogenfarben ist eine Synthese des 20. Jahrhunderts (u. a. Leadbeater 1927).</li>
        <li>Die „Solfeggio“-Zahlen (396, 417, 528, 639, 741, 852 Hz) leitete Joseph Puleo laut Suchauszug numerologisch aus der Bibel ab; veröffentlicht 1999. Aus gregorianischer Zeit gibt es keine Dokumentation dazu.</li>
        <li>Die moderne Kristallheilung entstand in den 1970er und 80er Jahren aus Theosophie und New Age. Ein anatomisches oder messbares Gegenstück der Chakren habe ich nicht gefunden.</li>
        <li>Ruhige Musik und Meditation können bei manchen Menschen Entspannung fördern. Das betrifft Ruhe und Aufmerksamkeit, nicht bestimmte Steine oder Hertz-Zahlen.</li>
      </ul>
      <div class="rt-claims">${claimIds.map((id) => claims.find((c) => c.id === id)).filter((c): c is NonNullable<typeof c> => !!c).map((c) => `<button data-claim="${esc(c.id)}"><strong>${esc(c.short ?? c.statement)}</strong><small>${esc(LEVEL_LABEL[c.level])} · Belege ansehen</small></button>`).join("")}</div>
      <p class="rt-small">Quellenhinweise: ${link("Wikipedia: Crystal healing", "https://en.wikipedia.org/wiki/Crystal_healing")} · ${link("PubMed 40855750 (Escolà-Gascón 2025)", "https://pubmed.ncbi.nlm.nih.gov/40855750/")} · ${link("Der Standard: Heilsteine", "https://derstandard.at/1362107829940/Heilsteine-Nicht-mehr-als-ein-Gluecksbringer")}</p>
    </div>
    <p class="rt-note">Informationsangebot – keine medizinische Beratung. Ein Stein, ein Ton oder ein Ritual ersetzt keine ärztliche Behandlung.</p>`;

  sync();
  return {
    start() { active = true; if (!running) loop(); },
    stop() { active = false; tone.stop(); cancelAnimationFrame(raf); running = false; last = 0; sync(); },
  };
}
