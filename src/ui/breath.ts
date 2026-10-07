import { ANATOMY, PATTERNS, PHASE_LABEL, ROUNDS, TRADITIONS, type Pattern, type Phase } from "../data/breath";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const NOTICE = "Informationsangebot – keine medizinische Beratung. Atemübungen ersetzen keine ärztliche Behandlung. Bei Schwindel oder Unwohlsein beenden und normal weiteratmen; bei Atemwegs- oder Herzerkrankungen oder in der Schwangerschaft vorher ärztlichen Rat einholen. Die Wissenstexte sind allgemeines Lehrbuchwissen und im Pilot noch nicht fachlich geprüft.";
const SMALL = 0.58; // ring size when the lungs are "empty"

export interface BreathApi { openBody(organ: string): void; reduceMotion: boolean }

/**
 * Breath page: an exercise timer (ring grows on the in-breath, holds, shrinks on the out-breath) plus textbook knowledge and
 * traditions. No WebGL needed. The timer never starts by itself, has no sound, and stops when the tab is hidden.
 */
export function initBreath(root: HTMLElement, api: BreathApi) {
  root.querySelector<HTMLElement>(".br-anatomy")!.innerHTML = ANATOMY.map((a) => `<article class="br-card"><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></article>`).join("");
  root.querySelector<HTMLElement>(".br-trad")!.innerHTML = TRADITIONS.map((t) => `<article class="br-card"><span class="br-badge">Überlieferung · ${esc(t.origin)}</span><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></article>`).join("");
  root.querySelector<HTMLElement>(".br-notice")!.textContent = NOTICE;

  const patternsEl = root.querySelector<HTMLElement>(".br-patterns")!;
  const roundsEl = root.querySelector<HTMLElement>(".br-rounds")!;
  const noteEl = root.querySelector<HTMLElement>(".br-note")!;
  const ring = root.querySelector<HTMLElement>(".br-ring")!;
  const phaseEl = root.querySelector<HTMLElement>(".br-phase")!;
  const countEl = root.querySelector<HTMLElement>(".br-count")!;
  const roundEl = root.querySelector<HTMLElement>(".br-round")!;
  const live = root.querySelector<HTMLElement>(".br-live")!;
  const start = root.querySelector<HTMLButtonElement>(".br-start")!;
  const arc = root.querySelector<SVGCircleElement>(".br-arc")!;
  const R = 46, C = 2 * Math.PI * R;
  arc.style.strokeDasharray = String(C);

  let pattern: Pattern = PATTERNS[0];
  let rounds = 4;
  let running = false;
  let raf = 0, t0 = 0;
  let lastKey = "";

  patternsEl.innerHTML = PATTERNS.map((p) => `<button class="br-chip" data-p="${p.id}" aria-pressed="${p === pattern}">${esc(p.name)}</button>`).join("");
  roundsEl.innerHTML = ROUNDS.map((n) => `<button class="br-chip" data-r="${n}" aria-pressed="${n === rounds}">${n}</button>`).join("");

  const cycle = () => pattern.steps.reduce((s, [, d]) => s + d, 0);
  function idle() {
    running = false;
    cancelAnimationFrame(raf);
    start.textContent = "Übung starten";
    start.setAttribute("aria-pressed", "false");
    patternsEl.querySelectorAll("button").forEach((b) => ((b as HTMLButtonElement).disabled = false));
    roundsEl.querySelectorAll("button").forEach((b) => ((b as HTMLButtonElement).disabled = false));
    noteEl.textContent = pattern.note;
    ring.style.setProperty("--s", String(SMALL));
    ring.dataset.phase = "idle";
    phaseEl.textContent = "Bereit";
    countEl.textContent = "·";
    roundEl.textContent = `${cycle()} s pro Atemzug · ${rounds} Runden`;
    arc.style.strokeDashoffset = String(C);
  }

  function frame(now: number) {
    if (!running) return;
    const el = (now - t0) / 1000;
    const total = cycle() * rounds;
    if (el >= total) { finish(); return; }
    const inCycle = el % cycle();
    const round = Math.floor(el / cycle()) + 1;
    let acc = 0, phase: Phase = "in", dur = 1, local = 0;
    for (const [ph, d] of pattern.steps) {
      if (inCycle < acc + d) { phase = ph; dur = d; local = inCycle - acc; break; }
      acc += d;
    }
    // ring size: in = grow, out = shrink, hold = keep what the lungs have (full after "in", empty after "out")
    let s: number;
    if (phase === "in") s = SMALL + (1 - SMALL) * ease(local / dur);
    else if (phase === "out") s = 1 - (1 - SMALL) * ease(local / dur);
    else s = lungsFull(inCycle) ? 1 : SMALL;
    if (!api.reduceMotion) ring.style.setProperty("--s", s.toFixed(3));
    ring.dataset.phase = phase;
    const key = `${round}-${phase}`;
    const secs = Math.max(1, Math.ceil(dur - local));
    phaseEl.textContent = PHASE_LABEL[phase];
    countEl.textContent = String(secs);
    roundEl.textContent = `Runde ${round} von ${rounds}`;
    arc.style.strokeDashoffset = String(C * (1 - el / total));
    if (key !== lastKey) { lastKey = key; live.textContent = PHASE_LABEL[phase]; }
    raf = requestAnimationFrame(frame);
  }
  const ease = (x: number) => (1 - Math.cos(Math.PI * Math.min(1, Math.max(0, x)))) / 2;
  /** In a hold phase the lungs are full if the last moving phase was "in", empty if it was "out". */
  function lungsFull(inCycle: number) {
    let a = 0, last: Phase = "out";
    for (const [ph, d] of pattern.steps) { if (inCycle < a + d) break; if (ph !== "hold") last = ph; a += d; }
    return last === "in";
  }

  function finish() {
    idle();
    phaseEl.textContent = "Geschafft";
    countEl.textContent = "✓";
    roundEl.textContent = "Atme jetzt wieder, wie es sich gut anfühlt.";
    live.textContent = "Übung beendet";
  }

  start.addEventListener("click", () => {
    if (running) { idle(); return; }
    running = true;
    lastKey = "";
    t0 = performance.now();
    start.textContent = "Beenden";
    start.setAttribute("aria-pressed", "true");
    patternsEl.querySelectorAll("button").forEach((b) => ((b as HTMLButtonElement).disabled = true));
    roundsEl.querySelectorAll("button").forEach((b) => ((b as HTMLButtonElement).disabled = true));
    raf = requestAnimationFrame(frame);
  });
  patternsEl.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>("[data-p]");
    if (!b || running) return;
    pattern = PATTERNS.find((p) => p.id === b.dataset.p) ?? pattern;
    patternsEl.querySelectorAll<HTMLElement>("[data-p]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    idle();
  });
  roundsEl.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>("[data-r]");
    if (!b || running) return;
    rounds = Number(b.dataset.r);
    roundsEl.querySelectorAll<HTMLElement>("[data-r]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    idle();
  });
  root.querySelector<HTMLElement>("[data-open-body]")!.addEventListener("click", () => api.openBody("lunge"));
  document.addEventListener("visibilitychange", () => { if (document.hidden && running) idle(); });
  idle();
  return { stop: () => { if (running) idle(); } };
}
