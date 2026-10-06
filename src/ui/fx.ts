import { initFxScene, type FxMode, type FxScene } from "../gl/fxscene";
import { FREQUENCIES } from "../data/home";
import { BASE_HZ, modeForHz, modeHz } from "../data/cymatics";
import { SHAPES, type ShapeId } from "../data/geometry";
import { createTone } from "../audio/tone";

const NOTICE = "Informationsangebot – keine medizinische Beratung. Die Darstellungen zeigen Mathematik und Physik; eine gesundheitliche Wirkung einzelner Frequenzen oder Formen ist hier nicht belegt.";

/**
 * The frequency page: cymatics (a vibrating plate whose pattern follows the chosen frequency) and geometry
 * (Platonic solids, Flower of Life). The tone only starts on a click and is capped at a low volume.
 */
export function initFx(root: HTMLElement, reduceMotion: boolean) {
  const canvas = root.querySelector<HTMLCanvasElement>("canvas")!;
  const panel = root.querySelector<HTMLElement>(".fx-panel")!;
  const modeBtns = [...root.querySelectorAll<HTMLButtonElement>("[data-fx-mode]")];
  const tone = createTone();

  let scene: FxScene | null = null;
  let mode: FxMode = "kymatik";
  let hz = 432;
  let shape: ShapeId = "tetra";
  let raf = 0;
  let scope: HTMLCanvasElement | null = null;
  const buf = new Uint8Array(1024);

  const hzLabel = (f: number) => FREQUENCIES.find((x) => x.hz === f)?.label;

  function render() {
    modeBtns.forEach((b) => b.setAttribute("aria-current", String(b.dataset.fxMode === mode)));
    panel.innerHTML = mode === "kymatik" ? kymatikHtml() : geometrieHtml();
    scope = panel.querySelector<HTMLCanvasElement>(".fx-scope");
    if (mode === "kymatik") syncKymatik();
  }

  function kymatikHtml() {
    return `
      <p class="fx-eyebrow">Alles ist Schwingung</p>
      <h2>Kymatik – Klangfiguren</h2>
      <div class="fx-readout"><output class="fx-hz" aria-live="polite"></output><span class="fx-mode"></span></div>
      <div class="fx-controls">
        <button class="fx-play" aria-pressed="false" aria-label="Ton abspielen"><span></span></button>
        <input class="fx-slider" type="range" min="20" max="1000" step="1" value="${hz}" aria-label="Frequenz in Hertz" />
      </div>
      <div class="fx-chips" role="group" aria-label="Frequenz wählen">${FREQUENCIES.map((f) => `<button class="fx-chip" data-hz="${f.hz}" aria-pressed="false"><strong>${f.hz}</strong><small>${f.label}</small></button>`).join("")}</div>
      <p class="fx-trad" hidden></p>
      <canvas class="fx-scope" aria-label="Wellenform"></canvas>
      <h3>Was du siehst</h3>
      <p>Auf einer schwingenden Platte sammelt sich Sand dort, wo sie ruhig bleibt – an den Knotenlinien. Je höher die Frequenz, desto feiner das Muster. Solche Klangfiguren sind nach Ernst Chladni benannt, der sie im späten 18. Jahrhundert beschrieben hat.</p>
      <p class="fx-small">Gerechnet wird eine ideale, quadratische Platte (vereinfachte Chladni-Formel, Eigenfrequenz ≈ ${BASE_HZ} Hz · (m² + n²)). Das ist ein Modell, keine Messung. Die Bewegung läuft in Zeitlupe. Die Namen unter den Zahlen sind überlieferte Zuschreibungen (Solfeggio-Lehre u. a.), keine Befunde.</p>
      <p class="fx-notice">${NOTICE}</p>`;
  }

  function geometrieHtml() {
    const s = SHAPES.find((x) => x.id === shape)!;
    const counts = s.v === null ? "" : `<dl class="fx-facts"><div><dt>Ecken</dt><dd>${s.v}</dd></div><div><dt>Kanten</dt><dd>${s.e}</dd></div><div><dt>Flächen</dt><dd>${s.f}</dd></div></dl>
      <p class="fx-small">Probe: Ecken − Kanten + Flächen = ${s.v! - s.e! + s.f!} (gilt für alle konvexen Vielflächner).</p>`;
    const trad = s.tradition
      ? `<p class="fx-trad"><span>Überlieferung</span> In Platons „Timaios“ wird dieser Körper dem Element „${s.tradition}“ zugeordnet. Das ist eine philosophische Deutung, keine Naturbeschreibung.</p>`
      : "";
    return `
      <p class="fx-eyebrow">Heilige Geometrie</p>
      <h2>${s.name}</h2>
      <div class="fx-chips shapes" role="group" aria-label="Form wählen">${SHAPES.map((x) => `<button class="fx-chip" data-shape="${x.id}" aria-pressed="${x.id === shape}"><strong>${x.name}</strong></button>`).join("")}</div>
      <p>${s.note}</p>
      ${counts}${trad}
      <h3>Was du siehst</h3>
      <p class="fx-small">Alles hier wird live im Browser berechnet: Linien und Punkte, keine Bilder. Ziehen zum Drehen, Mausrad zum Zoomen.</p>
      <p class="fx-notice">${NOTICE}</p>`;
  }

  function syncKymatik() {
    const md = modeForHz(hz);
    panel.querySelector<HTMLElement>(".fx-hz")!.textContent = `${hz} Hz`;
    panel.querySelector<HTMLElement>(".fx-mode")!.textContent = `Modus (${md.m}, ${md.n}) · Modellfrequenz ${modeHz(md)} Hz`;
    panel.querySelector<HTMLInputElement>(".fx-slider")!.value = String(hz);
    panel.querySelectorAll<HTMLButtonElement>(".fx-chip").forEach((c) => c.setAttribute("aria-pressed", String(Number(c.dataset.hz) === hz)));
    const t = panel.querySelector<HTMLElement>(".fx-trad")!;
    const l = hzLabel(hz);
    t.hidden = !l;
    if (l) t.innerHTML = `<span>Überlieferte Zuschreibung</span> „${l}“ – nicht belegt.`;
    const play = panel.querySelector<HTMLButtonElement>(".fx-play")!;
    play.setAttribute("aria-pressed", String(tone.playing));
    play.setAttribute("aria-label", tone.playing ? "Ton stoppen" : "Ton abspielen");
    play.classList.toggle("is-playing", tone.playing);
    scene?.setPlateMode(md);
    tone.setHz(hz);
  }

  panel.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    if (t.closest(".fx-play")) { tone.playing ? tone.stop() : tone.start(hz); syncKymatik(); return; }
    const chip = t.closest<HTMLElement>("[data-hz]");
    if (chip) { hz = Number(chip.dataset.hz); syncKymatik(); return; }
    const sh = t.closest<HTMLElement>("[data-shape]");
    if (sh) { shape = sh.dataset.shape as ShapeId; scene?.setShape(shape); render(); }
  });
  panel.addEventListener("input", (e) => {
    const t = e.target as HTMLInputElement;
    if (t.classList.contains("fx-slider")) { hz = Number(t.value); syncKymatik(); }
  });

  function drawScope(time: number) {
    if (!scope || mode !== "kymatik") return;
    const c = scope.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio, 2);
    const w = scope.clientWidth, h = scope.clientHeight;
    if (!w || !h) return;
    if (scope.width !== Math.round(w * dpr)) { scope.width = Math.round(w * dpr); scope.height = Math.round(h * dpr); }
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, h);
    const g = c.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, "rgba(88,214,232,0)"); g.addColorStop(0.15, "#58D6E8"); g.addColorStop(0.85, "#F0D18B"); g.addColorStop(1, "rgba(240,209,139,0)");
    c.strokeStyle = g; c.lineWidth = 1.6; c.shadowColor = "rgba(88,214,232,0.6)"; c.shadowBlur = 8;
    c.beginPath();
    const mid = h / 2, an = tone.analyser;
    if (an) {
      an.getByteTimeDomainData(buf);
      for (let i = 0; i < buf.length; i++) {
        const x = (i / (buf.length - 1)) * w, y = mid + ((buf[i] - 128) / 128) * mid * 7;
        i ? c.lineTo(x, y) : c.moveTo(x, y);
      }
    } else {
      // idle: density follows the frequency on a log scale (illustration, not to scale)
      const cycles = 2 + Math.log2(hz / 20) * 2.2;
      for (let x = 0; x <= w; x += 2) {
        const env = Math.sin((x / w) * Math.PI);
        const y = mid + Math.sin((x / w) * Math.PI * 2 * cycles + (reduceMotion ? 0 : time / 600)) * mid * 0.6 * env;
        x ? c.lineTo(x, y) : c.moveTo(x, y);
      }
    }
    c.stroke();
  }

  function loop(time: number) {
    drawScope(time);
    raf = requestAnimationFrame(loop);
  }

  modeBtns.forEach((b) => b.addEventListener("click", () => setMode(b.dataset.fxMode as FxMode)));
  function setMode(next: FxMode) {
    if (next !== "kymatik") tone.stop();
    mode = next;
    scene?.setMode(next);
    render();
  }
  document.addEventListener("visibilitychange", () => { if (document.hidden && tone.playing) { tone.stop(); if (mode === "kymatik") syncKymatik(); } });

  return {
    /** Open the page in the given mode (creates the WebGL scene on first use; throws if WebGL is missing). */
    start(next: FxMode = mode) {
      scene ??= initFxScene(canvas, reduceMotion);
      mode = next;
      scene.setMode(next);
      scene.setShape(shape);
      render();
      scene.start();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    },
    stop() {
      tone.stop();
      cancelAnimationFrame(raf);
      scene?.stop();
    },
    resize: () => scene?.resize(),
  };
}
