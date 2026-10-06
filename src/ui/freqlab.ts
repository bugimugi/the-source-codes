import { FREQUENCIES } from "../data/home";

/**
 * Frequency lab: a plain sine tone with a live waveform. The tone never starts by itself; it begins on a click,
 * fades in, and is capped at a low volume. The labels are traditional attributions (not findings).
 */
export function initFreqLab(root: HTMLElement, reduceMotion: boolean) {
  const canvas = root.querySelector<HTMLCanvasElement>("canvas")!;
  const play = root.querySelector<HTMLButtonElement>(".fl-play")!;
  const hzEl = root.querySelector<HTMLElement>(".fl-hz")!;
  const labelEl = root.querySelector<HTMLElement>(".fl-label")!;
  const chips = [...root.querySelectorAll<HTMLButtonElement>(".fl-chip")];
  const ctx2d = canvas.getContext("2d")!;
  let hz = 432;
  let audio: AudioContext | null = null;
  let osc: OscillatorNode | null = null;
  let gain: GainNode | null = null;
  let analyser: AnalyserNode | null = null;
  let playing = false;
  let visible = true;
  let raf = 0;
  const buf = new Uint8Array(1024);

  function show() {
    hzEl.textContent = `${hz} Hz`;
    const f = FREQUENCIES.find((x) => x.hz === hz);
    labelEl.textContent = f ? `Überlieferte Zuschreibung: ${f.label} (nicht belegt)` : "";
    chips.forEach((c) => c.setAttribute("aria-pressed", String(Number(c.dataset.hz) === hz)));
    play.setAttribute("aria-pressed", String(playing));
    play.setAttribute("aria-label", playing ? "Ton stoppen" : "Ton abspielen");
    play.classList.toggle("is-playing", playing);
  }

  function start() {
    try {
      audio ??= new AudioContext();
      void audio.resume();
      osc = audio.createOscillator();
      gain = audio.createGain();
      analyser = audio.createAnalyser();
      analyser.fftSize = 2048;
      osc.type = "sine";
      osc.frequency.value = hz;
      gain.gain.value = 0;
      osc.connect(gain).connect(analyser).connect(audio.destination);
      osc.start();
      // fade in to a deliberately low level
      gain.gain.linearRampToValueAtTime(0.08, audio.currentTime + 0.6);
      playing = true;
    } catch (e) {
      console.warn("Audio nicht verfügbar", e);
      playing = false;
    }
  }

  function stop() {
    if (!audio || !osc || !gain) { playing = false; return; }
    const o = osc, g = gain, a = audio;
    g.gain.cancelScheduledValues(a.currentTime);
    g.gain.setTargetAtTime(0, a.currentTime, 0.12);
    setTimeout(() => { try { o.stop(); o.disconnect(); g.disconnect(); } catch { /* already stopped */ } }, 500);
    osc = gain = analyser = null;
    playing = false;
  }

  play.addEventListener("click", () => { playing ? stop() : start(); show(); loop(); });
  chips.forEach((c) => c.addEventListener("click", () => {
    hz = Number(c.dataset.hz);
    if (osc && audio) osc.frequency.setTargetAtTime(hz, audio.currentTime, 0.05);
    show();
  }));

  function draw(t: number) {
    const dpr = Math.min(devicePixelRatio, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx2d.clearRect(0, 0, w, h);
    const grad = ctx2d.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, "rgba(88,214,232,0)"); grad.addColorStop(0.15, "#58D6E8"); grad.addColorStop(0.85, "#F0D18B"); grad.addColorStop(1, "rgba(240,209,139,0)");
    ctx2d.strokeStyle = grad;
    ctx2d.lineWidth = 1.6;
    ctx2d.shadowColor = "rgba(88,214,232,0.6)";
    ctx2d.shadowBlur = 8;
    ctx2d.beginPath();
    const mid = h / 2;
    if (analyser) {
      analyser.getByteTimeDomainData(buf);
      for (let i = 0; i < buf.length; i++) {
        const x = (i / (buf.length - 1)) * w, y = mid + ((buf[i] - 128) / 128) * mid * 7;
        i ? ctx2d.lineTo(x, y) : ctx2d.moveTo(x, y);
      }
    } else {
      // idle: a gentle sine whose density follows the chosen frequency (visual only, not to scale)
      const cycles = 3 + (hz - 174) / 120;
      for (let x = 0; x <= w; x += 2) {
        const env = Math.sin((x / w) * Math.PI);
        const y = mid + Math.sin((x / w) * Math.PI * 2 * cycles + (reduceMotion ? 0 : t / 700)) * mid * 0.5 * env;
        x ? ctx2d.lineTo(x, y) : ctx2d.moveTo(x, y);
      }
    }
    ctx2d.stroke();
  }

  function loop() {
    cancelAnimationFrame(raf);
    const step = (t: number) => {
      if (!visible) return;
      draw(t);
      if (playing || !reduceMotion) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) loop(); else cancelAnimationFrame(raf); }).observe(root);
  document.addEventListener("visibilitychange", () => { if (document.hidden && playing) { stop(); show(); } });
  show();
  loop();
  return { stop: () => { if (playing) { stop(); show(); } } };
}
