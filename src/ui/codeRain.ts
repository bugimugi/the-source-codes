/**
 * Falling code ("matrix rain") for the Universum page: two stacked 2D canvases (a small, dim, slightly blurred layer far away and a larger,
 * brighter one close by), no WebGL. Glyphs come from pre-drawn sprite sheets, so a frame is only a few thousand drawImage calls.
 * The open knowledge layer pulls the streams next to it: they get brighter and bend towards it (focus()).
 * With reduced motion the rain stands still (one drawn frame, redrawn when the focus changes).
 */
const GLYPHS = "0101010101ABCDEFGHJKLMNPRSTUVYZ2345679ΘΛΨΩΣΔ∞≈∴";
const FONT = 'ui-monospace, "Cascadia Mono", Consolas, "DejaVu Sans Mono", monospace';
const GREEN = { fill: "#3ddc84", glow: "rgba(61,220,132,0.55)", blur: 0.35 };
const HEAD = { fill: "#e9fff0", glow: "#7dffb0", blur: 0.7 };
const GOLD = { fill: "#f0d18b", glow: "rgba(240,209,139,0.5)", blur: 0.35 };

interface Cfg { size: number; speed: [number, number]; trail: [number, number]; alpha: number; density: number; gold: number; maxDpr: number }
const FAR: Cfg = { size: 11, speed: [4, 9], trail: [16, 38], alpha: 0.55, density: 0.95, gold: 0.05, maxDpr: 1 };
const NEAR: Cfg = { size: 18, speed: [6, 15], trail: [14, 36], alpha: 1, density: 0.75, gold: 0.1, maxDpr: 1.5 };

interface Col { x: number; head: number; speed: number; len: number; gold: boolean; seed: number }
interface Plane {
  canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; cfg: Cfg; dpr: number; w: number; h: number;
  cols: Col[]; rows: number; colW: number; rowH: number;
  atlas: HTMLCanvasElement; cw: number; ch: number;
}

export interface CodeRain {
  start(): void;
  stop(): void;
  /** the open layer: centre and half width in CSS pixels relative to the rain; null = nothing open */
  focus(cx: number | null, halfWidth?: number): void;
  /** mouse parallax, both -1 … 1 */
  parallax(px: number, py: number): void;
  resize(): void;
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
function hash(a: number, b: number, c = 0): number {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}

function buildAtlas(cfg: Cfg, dpr: number): { atlas: HTMLCanvasElement; cw: number; ch: number } {
  const size = cfg.size * dpr;
  const pad = Math.ceil(size * 0.5);
  const cw = Math.ceil(size * 0.62) + pad * 2, ch = Math.ceil(size * 1.2) + pad * 2;
  const atlas = document.createElement("canvas");
  atlas.width = cw * GLYPHS.length; atlas.height = ch * 3;
  const g = atlas.getContext("2d")!;
  g.font = `700 ${size}px ${FONT}`;
  g.textAlign = "center"; g.textBaseline = "middle";
  [GREEN, HEAD, GOLD].forEach((tint, t) => {
    g.fillStyle = tint.fill; g.shadowColor = tint.glow; g.shadowBlur = size * tint.blur;
    for (let i = 0; i < GLYPHS.length; i++) g.fillText(GLYPHS[i], i * cw + cw / 2, t * ch + ch / 2);
  });
  return { atlas, cw, ch };
}

export function createCodeRain(host: HTMLElement, opts: { reduceMotion: boolean }): CodeRain {
  const mk = (cfg: Cfg, cls: string): Plane => {
    const canvas = document.createElement("canvas");
    canvas.className = `cr-canvas ${cls}`;
    host.append(canvas);
    return { canvas, ctx: canvas.getContext("2d")!, cfg, dpr: 1, w: 0, h: 0, cols: [], rows: 0, colW: 0, rowH: 0, atlas: canvas, cw: 0, ch: 0 };
  };
  const planes = [mk(FAR, "cr-far"), mk(NEAR, "cr-near")];

  let raf = 0, last = 0, running = false;
  let focusX: number | null = null, focusHalf = 160, focusAmt = 0, focusCx = 0;

  const reset = (p: Plane, c: Col, initial: boolean) => {
    c.speed = rnd(p.cfg.speed[0], p.cfg.speed[1]);
    c.len = Math.round(rnd(p.cfg.trail[0], p.cfg.trail[1]));
    c.gold = Math.random() < p.cfg.gold;
    const wait = rnd(0, p.rows * (1 / p.cfg.density - 1) * 1.4);
    c.head = initial ? rnd(-wait, p.rows + c.len) : -wait;
  };

  function layout(p: Plane) {
    const r = host.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    const big = w * h > 2_500_000;
    p.dpr = Math.min(window.devicePixelRatio || 1, big ? 1 : p.cfg.maxDpr);
    p.w = w; p.h = h;
    p.canvas.width = Math.round(w * p.dpr); p.canvas.height = Math.round(h * p.dpr);
    p.colW = p.cfg.size * 0.95; p.rowH = p.cfg.size * 1.25;
    p.rows = Math.ceil(h / p.rowH);
    const n = Math.ceil(w / p.colW);
    p.cols = Array.from({ length: n }, (_, i) => {
      const c: Col = { x: i * p.colW + p.colW / 2, head: 0, speed: 0, len: 0, gold: false, seed: (Math.random() * 1e9) | 0 };
      reset(p, c, true);
      return c;
    });
    Object.assign(p, buildAtlas(p.cfg, p.dpr));
  }

  function draw(p: Plane, t: number) {
    const { ctx, cfg, dpr, cols, rowH, h } = p;
    ctx.clearRect(0, 0, p.canvas.width, p.canvas.height);
    for (const c of cols) {
      const hr = Math.floor(c.head);
      if (hr < 0 && hr + c.len < 0) continue;
      // streams next to the open layer: brighter, and bent towards it in the middle of the screen
      const d = (c.x - focusCx) / (focusHalf * 1.15);
      const inf = focusAmt * Math.exp(-d * d);
      for (let k = 0; k < c.len; k++) {
        const row = hr - k;
        if (row < 0 || row >= p.rows) continue;
        const y = row * rowH + rowH / 2;
        const lift = Math.sin(Math.PI * Math.min(1, Math.max(0, y / h)));
        const x = c.x + (focusCx - c.x) * 0.38 * inf * Math.pow(lift, 1.4);
        const fade = Math.pow(1 - k / c.len, 1.8);
        const a = Math.min(1, cfg.alpha * fade * (1 + 1.2 * inf));
        if (a < 0.02) continue;
        const flick = (hash(c.seed, row) & 7) === 0 ? Math.floor(t * 3) : 0;
        const gi = hash(c.seed, row, flick) % GLYPHS.length;
        const tint = k === 0 ? 1 : c.gold ? 2 : 0;
        ctx.globalAlpha = a;
        ctx.drawImage(p.atlas, gi * p.cw, tint * p.ch, p.cw, p.ch, x * dpr - p.cw / 2, y * dpr - p.ch / 2, p.cw, p.ch);
      }
    }
    ctx.globalAlpha = 1;
  }

  function step(p: Plane, dt: number) {
    for (const c of p.cols) {
      const d = (c.x - focusCx) / (focusHalf * 1.15);
      c.head +=c.speed * (1 + 0.5 * focusAmt * Math.exp(-d * d)) * dt;
      if (c.head - c.len > p.rows) reset(p, c, false);
    }
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = (now - last) / 1000;
    if (dt < 1 / 32) return; // about 30 pictures per second are enough for falling code
    last = now;
    const target = focusX == null ? 0 : 1;
    focusAmt += (target - focusAmt) * Math.min(1, dt * 5);
    for (const p of planes) { step(p, Math.min(dt, 0.1)); draw(p, now / 1000); }
  }

  function still() {
    focusAmt = focusX == null ? 0 : 1;
    for (const p of planes) draw(p, 0);
  }

  function resize() {
    for (const p of planes) layout(p);
    if (!running || opts.reduceMotion) still();
  }

  new ResizeObserver(() => { if (host.clientWidth) resize(); }).observe(host);

  return {
    start() {
      if (running) return;
      running = true;
      if (!planes[0].cols.length) resize();
      if (opts.reduceMotion) { still(); return; }
      last = performance.now();
      raf = requestAnimationFrame(frame);
    },
    stop() { running = false; cancelAnimationFrame(raf); raf = 0; },
    focus(cx, halfWidth = 160) {
      focusX = cx;
      if (cx != null) { focusCx = cx; focusHalf = halfWidth; }
      if (opts.reduceMotion && running) still();
    },
    parallax(px, py) {
      planes[0].canvas.style.transform = `translate3d(${(px * 5).toFixed(1)}px, ${(py * 3).toFixed(1)}px, 0)`;
      planes[1].canvas.style.transform = `translate3d(${(px * 14).toFixed(1)}px, ${(py * 8).toFixed(1)}px, 0)`;
    },
    resize,
  };
}
