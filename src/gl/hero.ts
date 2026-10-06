import * as THREE from "three";
import gsap from "gsap";
import { buildModel, dot, glowTexture, rng } from "./models";
import { hasAsset } from "../assets/slots";

/**
 * Cinematic hero: a translucent human (head in profile, torso frontal) drawn from light,
 * with a neural network, DNA, plants and a tree inside, in front of a layered world
 * (mountains, ancient architecture, planets, deep space). Fully procedural, no external assets.
 */

export interface HeroPin {
  id: string;
  label: string;
}

export interface HeroApi {
  pause(): void;
  resume(): void;
  /** Builds the ~3 second intro as a paused GSAP timeline the caller can extend. */
  buildIntro(): gsap.core.Timeline;
  /** Camera flight into the brain; resolves when the screen is covered. */
  transitionOut(): Promise<void>;
  resetCamera(): void;
  onPin(handler: (id: string) => void): void;
  resize(): void;
}

const GOLD = new THREE.Color("#CBAA67");
const GOLD_HI = new THREE.Color("#F0D18B");
const CYAN = new THREE.Color("#58D6E8");
const DEEP = new THREE.Color("#147A91");

// side profile of the head: y, front z, back z, half width
const HEAD_ROWS: [number, number, number, number][] = [
  [1.32, 0.03, -0.03, 0.06], [1.25, 0.2, -0.22, 0.28], [1.12, 0.42, -0.5, 0.46], [0.95, 0.58, -0.7, 0.58],
  [0.78, 0.66, -0.8, 0.63], [0.62, 0.7, -0.84, 0.64], [0.5, 0.66, -0.85, 0.62], [0.42, 0.8, -0.85, 0.5], [0.32, 0.97, -0.83, 0.34],
  [0.22, 0.8, -0.8, 0.46], [0.1, 0.78, -0.75, 0.52], [0.0, 0.74, -0.72, 0.5], [-0.1, 0.76, -0.68, 0.46], [-0.24, 0.64, -0.6, 0.4],
  [-0.4, 0.5, -0.5, 0.36], [-0.6, 0.3, -0.42, 0.31], [-0.95, 0.28, -0.42, 0.32], [-1.32, 0.34, -0.5, 0.4],
];
// frontal torso: y, half width (x), half depth (z)
const TORSO_ROWS: [number, number, number][] = [
  [-1.3, 0.4, 0.32], [-1.45, 0.7, 0.36], [-1.65, 1.3, 0.42], [-1.95, 1.8, 0.5], [-2.35, 2.1, 0.56], [-2.85, 2.25, 0.6], [-3.3, 2.3, 0.6],
];

const Y_MIN = -3.3;
const Y_MAX = 1.32;

interface Shared {
  uTime: { value: number };
  uReveal: { value: number };
  uPR: { value: number };
}

function surfaceRings(rows: { y: number; cx: number; cz: number; rx: number; rz: number }[], ringPts: number, pointCount: number, seed: number) {
  const r = rng(seed);
  const ringSeg: number[] = [];
  const merid: number[] = [];
  const grid: THREE.Vector3[][] = rows.map((row) =>
    Array.from({ length: ringPts }, (_, i) => {
      const t = (i / ringPts) * Math.PI * 2;
      return new THREE.Vector3(row.cx + Math.cos(t) * row.rx, row.y, row.cz + Math.sin(t) * row.rz);
    }),
  );
  grid.forEach((ring) => {
    for (let i = 0; i < ringPts; i++) {
      const a = ring[i], b = ring[(i + 1) % ringPts];
      ringSeg.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  });
  for (let i = 0; i < ringPts; i += Math.max(1, Math.floor(ringPts / 14))) {
    for (let k = 0; k < grid.length - 1; k++) {
      const a = grid[k][i], b = grid[k + 1][i];
      merid.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }
  // random surface samples with normals
  const pos = new Float32Array(pointCount * 3), nor = new Float32Array(pointCount * 3), seeds = new Float32Array(pointCount);
  for (let n = 0; n < pointCount; n++) {
    const f = r() * (rows.length - 1);
    const k = Math.floor(f), u = f - k;
    const A = rows[k], B = rows[Math.min(k + 1, rows.length - 1)];
    const y = A.y + (B.y - A.y) * u, cx = A.cx + (B.cx - A.cx) * u, cz = A.cz + (B.cz - A.cz) * u;
    const rx = A.rx + (B.rx - A.rx) * u, rz = A.rz + (B.rz - A.rz) * u;
    const t = r() * Math.PI * 2;
    pos.set([cx + Math.cos(t) * rx, y, cz + Math.sin(t) * rz], n * 3);
    const nx = Math.cos(t) / Math.max(rx, 0.02), nz = Math.sin(t) / Math.max(rz, 0.02);
    const l = Math.hypot(nx, nz) || 1;
    nor.set([nx / l, 0, nz / l], n * 3);
    seeds[n] = r();
  }
  return { ringSeg, merid, pos, nor, seeds };
}

function holoPoints(shared: Shared, reveal: { min: number; max: number }, color: THREE.Color, size: number, pos: Float32Array, nor: Float32Array, seeds: Float32Array) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aNormal", new THREE.BufferAttribute(nor, 3));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: { ...shared, uSize: { value: size }, uColor: { value: color }, uGold: { value: GOLD_HI }, uMinY: { value: reveal.min }, uMaxY: { value: reveal.max } },
    vertexShader: /* glsl */ `
      uniform float uTime, uSize, uPR; attribute vec3 aNormal; attribute float aSeed;
      varying float vF; varying float vY; varying float vS;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec3 n = normalize(normalMatrix * aNormal);
        vF = pow(1.0 - abs(dot(n, normalize(-mv.xyz))), 1.6);
        vY = position.y; vS = aSeed;
        float tw = 0.7 + 0.3 * sin(uTime * 1.4 + aSeed * 40.0);
        gl_PointSize = uSize * tw * (1.0 + vF * 0.9) * uPR / -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor, uGold; uniform float uReveal, uMinY, uMaxY;
      varying float vF; varying float vY; varying float vS;
      void main(){
        float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;
        float front = uMinY + uReveal * (uMaxY - uMinY);
        float m = step(vY, front);
        float live = step(0.001, uReveal) * (1.0 - step(0.999, uReveal));
        float edge = exp(-pow((vY - front) * 5.0, 2.0)) * live;
        float a = (0.08 + 0.92 * vF) * pow(1.0 - d * 2.0, 1.4) * m;
        vec3 c = mix(uColor, uGold, clamp(edge + step(0.62, vS) * 0.18, 0.0, 1.0));
        gl_FragColor = vec4(c, a * 0.9 + edge * 0.5 * m);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(g, mat);
}

function holoLines(shared: Shared, reveal: { min: number; max: number }, color: THREE.Color, alpha: number, seg: number[]) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
  return new THREE.LineSegments(g, new THREE.ShaderMaterial({
    uniforms: { ...shared, uColor: { value: color }, uGold: { value: GOLD_HI }, uAlpha: { value: alpha }, uMinY: { value: reveal.min }, uMaxY: { value: reveal.max } },
    vertexShader: "varying float vY; void main(){ vY = position.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: /* glsl */ `
      uniform vec3 uColor, uGold; uniform float uReveal, uMinY, uMaxY, uAlpha, uTime; varying float vY;
      void main(){
        float front = uMinY + uReveal * (uMaxY - uMinY);
        float m = step(vY, front);
        float live = step(0.001, uReveal) * (1.0 - step(0.999, uReveal));
        float edge = exp(-pow((vY - front) * 5.0, 2.0)) * live;
        gl_FragColor = vec4(mix(uColor, uGold, edge), (uAlpha + edge * 0.7) * m);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
}

function neuralNet(shared: Shared, center: THREE.Vector3, radii: THREE.Vector3, count: number, seed: number) {
  const r = rng(seed);
  const pts: THREE.Vector3[] = [];
  while (pts.length < count) {
    const p = new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1);
    // brain-like: a flattened ellipsoid with a slight cleft
    if (p.lengthSq() > 1 || p.y < -0.45) continue;
    pts.push(p.clone().multiply(radii).add(center));
  }
  const seg: number[] = [], t: number[] = [], sd: number[] = [];
  for (let i = 0; i < pts.length; i++) {
    const near = pts.map((q, j) => ({ j, d: q.distanceToSquared(pts[i]) })).filter((o) => o.j !== i).sort((a, b) => a.d - b.d).slice(0, 3);
    for (const o of near) {
      const a = pts[i], b = pts[o.j];
      seg.push(a.x, a.y, a.z, b.x, b.y, b.z);
      t.push(0, 1);
      const s = r();
      sd.push(s, s);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
  g.setAttribute("aT", new THREE.Float32BufferAttribute(t, 1));
  g.setAttribute("aSeed", new THREE.Float32BufferAttribute(sd, 1));
  const lines = new THREE.LineSegments(g, new THREE.ShaderMaterial({
    uniforms: { ...shared, uReveal: shared.uReveal, uMinY: { value: Y_MIN }, uMaxY: { value: Y_MAX } },
    vertexShader: "attribute float aT; attribute float aSeed; varying float vT; varying float vS; varying float vY; void main(){ vT=aT; vS=aSeed; vY=position.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: /* glsl */ `
      uniform float uTime, uReveal, uMinY, uMaxY; varying float vT; varying float vS; varying float vY;
      void main(){
        float front = uMinY + uReveal * (uMaxY - uMinY);
        float pulse = pow(max(0.0, sin((vT - uTime * 0.5 + vS * 6.0) * 6.2831)), 8.0);
        vec3 c = mix(vec3(0.35, 0.84, 0.91), vec3(1.0, 0.82, 0.45), pulse);
        gl_FragColor = vec4(c, (0.2 + pulse * 0.8) * step(vY, front));
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  const pg = new THREE.BufferGeometry().setFromPoints(pts);
  const nodes = new THREE.Points(pg, new THREE.PointsMaterial({ color: GOLD_HI, size: 0.05, map: dot(), alphaTest: 0.05, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  return { lines, nodes };
}

function dna(height: number, radius: number, turns: number, steps: number) {
  const g = new THREE.Group();
  const a: number[] = [], b: number[] = [], rungs: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, ang = t * turns * Math.PI * 2, y = (t - 0.5) * height;
    const p1 = [Math.cos(ang) * radius, y, Math.sin(ang) * radius], p2 = [Math.cos(ang + Math.PI) * radius, y, Math.sin(ang + Math.PI) * radius];
    a.push(...p1); b.push(...p2);
    if (i % 3 === 0) rungs.push(...p1, ...p2);
  }
  const mk = (arr: number[], color: THREE.Color, size: number) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({ color, size, map: dot(), alphaTest: 0.05, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  };
  g.add(mk(a, GOLD_HI, 0.07), mk(b, CYAN, 0.07));
  const rg = new THREE.BufferGeometry();
  rg.setAttribute("position", new THREE.Float32BufferAttribute(rungs, 3));
  g.add(new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })));
  return g;
}

function glowingTree(seed: number) {
  const r = rng(seed);
  const seg: number[] = [];
  const leaves: number[] = [];
  function branch(p: THREE.Vector3, d: THREE.Vector3, len: number, depth: number) {
    const e = p.clone().addScaledVector(d, len);
    seg.push(p.x, p.y, p.z, e.x, e.y, e.z);
    if (depth === 0) {
      for (let i = 0; i < 9; i++) leaves.push(e.x + (r() - 0.5) * 0.28, e.y + (r() - 0.5) * 0.22, e.z + (r() - 0.5) * 0.18);
      return;
    }
    const n = depth > 2 ? 2 : 3;
    for (let i = 0; i < n; i++) {
      const nd = d.clone().add(new THREE.Vector3((r() - 0.5) * 1.3, 0.25 + r() * 0.3, (r() - 0.5) * 0.5)).normalize();
      branch(e, nd, len * (0.66 + r() * 0.12), depth - 1);
    }
  }
  branch(new THREE.Vector3(0, -3.1, 0), new THREE.Vector3(0, 1, 0), 0.62, 5);
  const g = new THREE.Group();
  const lg = new THREE.BufferGeometry();
  lg.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
  g.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false })));
  const pg = new THREE.BufferGeometry();
  pg.setAttribute("position", new THREE.Float32BufferAttribute(leaves, 3));
  g.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: new THREE.Color("#7fe39a"), size: 0.07, map: dot(), alphaTest: 0.05, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.85 })));
  return g;
}

function ridge(width: number, depthZ: number, height: number, seed: number, top: string, bot: string, fade: { value: number }, y0: number) {
  const r = rng(seed);
  const n = 90;
  const ph = [r() * 9, r() * 9, r() * 9];
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  for (let i = 0; i <= n; i++) {
    const x = (i / n - 0.5) * width, u = i / n;
    const h = height * (0.35 + 0.35 * Math.sin(u * 7 + ph[0]) * Math.sin(u * 3.1 + ph[1]) + 0.3 * Math.abs(Math.sin(u * 17 + ph[2])) * (0.4 + 0.6 * Math.sin(u * 5)));
    pos.push(x, y0, depthZ, x, y0 + Math.max(h, 0.05), depthZ);
    uv.push(u, 0, u, 1);
    if (i < n) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return new THREE.Mesh(g, new THREE.ShaderMaterial({
    uniforms: { uTop: { value: new THREE.Color(top) }, uBot: { value: new THREE.Color(bot) }, uFade: fade },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: "varying vec2 vUv; uniform vec3 uTop, uBot; uniform float uFade; void main(){ vec3 c = mix(uBot, uTop, pow(vUv.y, 1.6)); c += vec3(0.30, 0.52, 0.60) * smoothstep(0.93, 1.0, vUv.y) * 0.35; gl_FragColor = vec4(c, uFade * 0.75 * smoothstep(0.0, 0.6, vUv.y)); }",
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
  }));
}

function temple(fade: { value: number }) {
  const s: number[] = [];
  const L = (x1: number, y1: number, x2: number, y2: number) => s.push(x1, y1, 0, x2, y2, 0);
  const W = 5.2, cols = 9, h = 2.0;
  for (let i = 0; i < 3; i++) L(-W / 2 - i * 0.18, -i * 0.12, W / 2 + i * 0.18, -i * 0.12);
  for (let c = 0; c < cols; c++) {
    const x = -W / 2 + (c / (cols - 1)) * W;
    L(x - 0.08, 0, x - 0.06, h); L(x + 0.08, 0, x + 0.06, h);
    L(x - 0.13, h, x + 0.13, h); L(x - 0.13, h + 0.06, x + 0.13, h + 0.06);
    for (let f = 0; f < 4; f++) L(x - 0.03 + f * 0.02, 0.1, x - 0.025 + f * 0.02, h - 0.1);
  }
  L(-W / 2 - 0.2, h + 0.1, W / 2 + 0.2, h + 0.1); L(-W / 2 - 0.2, h + 0.3, W / 2 + 0.2, h + 0.3);
  L(-W / 2 - 0.2, h + 0.3, 0, h + 1.3); L(W / 2 + 0.2, h + 0.3, 0, h + 1.3);
  L(-W / 2 + 0.6, h + 0.45, 0, h + 1.12); L(W / 2 - 0.6, h + 0.45, 0, h + 1.12);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(s, 3));
  const mat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const o = new THREE.LineSegments(g, mat);
  o.onBeforeRender = () => { mat.opacity = 0.2 * fade.value; };
  return o;
}

function pyramid(fade: { value: number }) {
  const s: number[] = [];
  const L = (a: number[], b: number[]) => s.push(...a, ...b);
  const B = 1.7, H = 1.9;
  const A = [-B, 0, 0], Bb = [B, 0, 0], C = [0, H, 0];
  L(A, Bb); L(A, C); L(Bb, C);
  for (let i = 1; i < 14; i++) {
    const t = i / 14, w = B * (1 - t);
    L([-w, H * t, 0], [w, H * t, 0]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(s, 3));
  const mat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const o = new THREE.LineSegments(g, mat);
  o.onBeforeRender = () => { mat.opacity = 0.35 * fade.value; };
  return o;
}

function planet(radius: number, base: string, accent: string, seed: number, fade: { value: number }) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, 64, 48),
    new THREE.ShaderMaterial({
      uniforms: { uBase: { value: new THREE.Color(base) }, uAcc: { value: new THREE.Color(accent) }, uSeed: { value: seed }, uFade: fade },
      vertexShader: "varying vec3 vN; varying vec3 vP; varying vec3 vV; void main(){ vN = normalize(normalMatrix * normal); vP = position; vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",
      fragmentShader: /* glsl */ `
        varying vec3 vN; varying vec3 vP; varying vec3 vV; uniform vec3 uBase, uAcc; uniform float uSeed, uFade;
        float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719)) + uSeed) * 43758.5453); }
        float n(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(mix(h(i), h(i + vec3(1,0,0)), f.x), mix(h(i + vec3(0,1,0)), h(i + vec3(1,1,0)), f.x), f.y),
                     mix(mix(h(i + vec3(0,0,1)), h(i + vec3(1,0,1)), f.x), mix(h(i + vec3(0,1,1)), h(i + vec3(1,1,1)), f.x), f.y), f.z); }
        void main(){
          vec3 p = normalize(vP);
          float bands = n(vec3(p.x * 2.0, p.y * 9.0, p.z * 2.0)) * 0.6 + n(p * 6.0) * 0.4;
          vec3 c = mix(uBase, uAcc, bands);
          float fres = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 2.5);
          float light = 0.25 + 0.75 * max(dot(normalize(vN), normalize(vec3(-0.5, 0.4, 0.8))), 0.0);
          gl_FragColor = vec4(c * light + vec3(0.35, 0.8, 0.95) * fres * 0.9, uFade);
        }`,
      transparent: true, depthWrite: true,
    }),
  );
}

function flowerOfLife(fade: { value: number }) {
  const s: number[] = [];
  const R = 1, seg = 64;
  const centers: [number, number][] = [[0, 0]];
  for (let ring = 1; ring <= 3; ring++)
    for (let k = 0; k < 6 * ring; k++) {
      const a = (k / (6 * ring)) * Math.PI * 2;
      centers.push([Math.cos(a) * R * ring, Math.sin(a) * R * ring]);
    }
  for (const [cx, cy] of centers)
    for (let i = 0; i < seg; i++) {
      const a = (i / seg) * Math.PI * 2, b = ((i + 1) / seg) * Math.PI * 2;
      s.push(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 0, cx + Math.cos(b) * R, cy + Math.sin(b) * R, 0);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(s, 3));
  const mat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const o = new THREE.LineSegments(g, mat);
  o.onBeforeRender = () => { mat.opacity = 0.09 * fade.value; };
  return o;
}

export function initHero(canvas: HTMLCanvasElement, pinsRoot: HTMLElement, pins: HeroPin[], reduceMotion: boolean): HeroApi {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  const dpr = Math.min(devicePixelRatio, innerWidth < 800 ? 1.5 : 1.75);
  renderer.setPixelRatio(dpr);
  // once the generated hero world exists, the canvas becomes a transparent layer on top of it
  const imageWorld = hasAsset("hero-world");
  renderer.setClearColor(0x02070b, imageWorld ? 0 : 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const mobile = innerWidth < 800;
  const q = mobile ? 0.5 : 1;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02070b, 0.018);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
  const CAM_HOME = new THREE.Vector3(0, -0.3, 9.4);
  const LOOK = new THREE.Vector3(0, -0.6, 0);
  camera.position.copy(CAM_HOME);
  camera.lookAt(LOOK);

  const shared: Shared = { uTime: { value: 0 }, uReveal: { value: reduceMotion ? 1 : 0 }, uPR: { value: dpr * (mobile ? 0.9 : 1) } };
  const fade = { value: reduceMotion ? 1 : 0 };
  const reveal = { min: Y_MIN, max: Y_MAX };

  // ---- the translucent human
  const human = new THREE.Group();
  human.scale.setScalar(1.3);
  human.position.set(0, -0.1, 0);
  scene.add(human);
  const headRows = (() => {
    const p1 = new THREE.CatmullRomCurve3(HEAD_ROWS.map(([y, zf, zb]) => new THREE.Vector3(zf, y, zb)));
    const p2 = new THREE.CatmullRomCurve3(HEAD_ROWS.map(([y, , , w]) => new THREE.Vector3(w, y, 0)));
    const N = 64;
    return Array.from({ length: N + 1 }, (_, i) => {
      const a = p1.getPoint(i / N), b = p2.getPoint(i / N);
      return { y: a.y, cx: 0, cz: (a.x + a.z) / 2, rx: Math.max(b.x, 0.015), rz: Math.max((a.x - a.z) / 2, 0.015) };
    });
  })();
  const head = new THREE.Group();
  head.rotation.y = -Math.PI / 2; // face looks left, towards the title
  human.add(head);
  const hs = surfaceRings(headRows, 56, Math.floor(15000 * q), 1);
  head.add(holoPoints(shared, reveal, CYAN, 9, hs.pos, hs.nor, hs.seeds));
  head.add(holoLines(shared, reveal, CYAN, 0.2, hs.ringSeg));
  head.add(holoLines(shared, reveal, CYAN, 0.16, hs.merid));

  const torsoRows = (() => {
    const c = new THREE.CatmullRomCurve3(TORSO_ROWS.map(([y, rx, rz]) => new THREE.Vector3(rx, y, rz)));
    const N = 40;
    return Array.from({ length: N + 1 }, (_, i) => {
      const p = c.getPoint(i / N);
      return { y: p.y, cx: 0, cz: 0, rx: p.x, rz: p.z };
    });
  })();
  const ts = surfaceRings(torsoRows, 64, Math.floor(7000 * q), 2);
  human.add(holoPoints(shared, reveal, CYAN, 8, ts.pos, ts.nor, ts.seeds));
  human.add(holoLines(shared, reveal, CYAN, 0.14, ts.ringSeg));
  human.add(holoLines(shared, reveal, CYAN, 0.1, ts.merid));
  // golden nerve pathways: from the brain stem down the neck, then branching out over shoulders and chest
  {
    const nr = rng(21), seg: number[] = [];
    for (let i = 0; i < 16; i++) {
      const side = i % 2 ? 1 : -1, spread = 0.3 + nr() * 1.7, w = () => (nr() - 0.5) * 0.22;
      const pts = [new THREE.Vector3(w(), 0.2 + nr() * 0.3, w()), new THREE.Vector3(side * 0.1 + w(), -0.4, w()), new THREE.Vector3(side * 0.16 + w(), -1.15, w()),
        new THREE.Vector3(side * spread * 0.5 + w(), -1.75, w() * 2), new THREE.Vector3(side * spread + w() * 2, -2.4 - nr() * 0.4, w() * 3), new THREE.Vector3(side * spread * 1.15 + w() * 3, -3.2, w() * 2)];
      const c = new THREE.CatmullRomCurve3(pts).getPoints(70);
      for (let k = 0; k < c.length - 1; k++) seg.push(c[k].x, c[k].y, c[k].z, c[k + 1].x, c[k + 1].y, c[k + 1].z);
    }
    human.add(holoLines(shared, reveal, GOLD, 0.32, seg));
  }

  // brain + neural network (inside the head, head-local coordinates)
  const brainC = new THREE.Vector3(0, 0.68, -0.08), brainR = new THREE.Vector3(0.42, 0.3, 0.58);
  const net = neuralNet(shared, brainC, brainR, Math.floor(130 * q + 40), 7);
  head.add(net.lines, net.nodes);
  // brain surface (folded cortex feel)
  {
    const r = rng(11), n = Math.floor(2600 * q), p = new Float32Array(n * 3), nr = new Float32Array(n * 3), sd = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const th = r() * Math.PI * 2, ph = Math.acos(r() * 1.5 - 0.6), fold = 1 + 0.07 * Math.sin(th * 9) * Math.sin(ph * 7);
      const x = Math.sin(ph) * Math.cos(th), y = Math.cos(ph), z = Math.sin(ph) * Math.sin(th);
      p.set([brainC.x + x * brainR.x * fold, brainC.y + y * brainR.y * fold, brainC.z + z * brainR.z * fold], i * 3);
      nr.set([x, y, z], i * 3);
      sd[i] = r();
    }
    head.add(holoPoints(shared, reveal, GOLD, 5.5, p, nr, sd));
  }

  // chest: a luminous tree
  const tree = glowingTree(5);
  human.add(tree);

  // plants growing from the brain
  const lotus: THREE.Group[] = [];
  const lights = new THREE.Group();
  scene.add(lights);
  lights.add(new THREE.AmbientLight(0xffe3d0, 0.8));
  const pl = new THREE.PointLight(0xff9fb8, 6, 5);
  pl.position.set(-0.2, 2.0, 1.0);
  lights.add(pl);
  [[-0.2, 1.62, 0.1, 0.4, "#ff86b4"], [0.35, 1.9, -0.2, 0.3, "#ffb26b"], [-0.7, 1.4, -0.1, 0.26, "#ff6fa0"]].forEach(([x, y, z, s, c]) => {
    const f = buildModel({ kind: "flower", color: c as string, color2: "#ffe08a", petals: 14 });
    f.scale.setScalar(s as number);
    f.position.set(x as number, y as number, z as number);
    f.rotation.set(-0.5, 0.6, 0.2);
    scene.add(f);
    lotus.push(f);
  });

  // DNA
  const dnaTop = dna(2.6, 0.26, 5, 140);
  dnaTop.position.set(-0.95, 2.4, -0.6);
  dnaTop.rotation.z = 0.12;
  scene.add(dnaTop);
  const dnaChest = dna(2.2, 0.24, 4, 110);
  dnaChest.position.set(2.0, -1.9, 0.3);
  dnaChest.rotation.z = -0.35;
  scene.add(dnaChest);

  // ---- the world behind
  const world = new THREE.Group();
  scene.add(world);
  world.visible = !imageWorld;
  world.add(Object.assign(ridge(46, -9, 3.0, 3, "#2a6a7c", "#02070b", fade, -3.6), { renderOrder: -3 }));
  world.add(Object.assign(ridge(40, -6.5, 2.2, 8, "#164453", "#02070b", fade, -3.6), { renderOrder: -2 }));
  world.add(Object.assign(ridge(34, -4.2, 1.4, 15, "#0b2530", "#02070b", fade, -3.6), { renderOrder: -1 }));
  const tmpl = temple(fade);
  tmpl.position.set(-8.6, -2.6, -6.4);
  tmpl.scale.setScalar(1.15);
  world.add(tmpl);
  const pyr = pyramid(fade);
  pyr.position.set(8.6, -2.1, -6.5);
  world.add(pyr);
  const p1 = planet(0.62, "#10394a", "#5aa7b8", 3, fade);
  p1.position.set(-2.8, 2.3, -9);
  const p2 = planet(0.5, "#3b2b12", "#cbaa67", 9, fade);
  p2.position.set(5.2, 2.4, -9);
  const p3 = planet(0.28, "#10303a", "#58d6e8", 5, fade);
  p3.position.set(-3.3, 0.9, -7);
  world.add(p1, p2, p3);
  const fol = flowerOfLife(fade);
  fol.position.set(0.3, 0.2, -3.4);
  fol.scale.setScalar(1.55);
  world.add(fol);
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.006, 6, 200), new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
  orbit.rotation.set(1.25, 0.25, 0.3);
  orbit.position.set(0.1, 0.4, -0.4);
  scene.add(orbit);

  // deep space: stars + dust + haze
  const sr = rng(77);
  const sp = new Float32Array(Math.floor(3500 * q) * 3);
  for (let i = 0; i < sp.length / 3; i++) {
    const v = new THREE.Vector3(sr() - 0.5, sr() * 0.9 - 0.2, sr() - 0.5).normalize().multiplyScalar(40 + sr() * 50);
    sp.set([v.x, v.y, Math.min(v.z, -12)], i * 3);
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xcfe3ff, size: 0.28, map: dot(), alphaTest: 0.03, transparent: true, opacity: reduceMotion ? 0.9 : 0, depthWrite: false, fog: false }));
  scene.add(stars);
  const dr = rng(33);
  const dust = new Float32Array(Math.floor(520 * q) * 3);
  for (let i = 0; i < dust.length / 3; i++) dust.set([(dr() - 0.5) * 18, (dr() - 0.5) * 10, -1 + dr() * 8], i * 3);
  const dg = new THREE.BufferGeometry();
  dg.setAttribute("position", new THREE.BufferAttribute(dust, 3));
  const dustPts = new THREE.Points(dg, new THREE.PointsMaterial({ color: GOLD_HI, size: 0.07, map: dot(), alphaTest: 0.03, transparent: true, opacity: reduceMotion ? 0.7 : 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(dustPts);
  const haze = (color: THREE.Color, x: number, y: number, z: number, s: number, o: number) => {
    const sp2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color, blending: THREE.AdditiveBlending, transparent: true, opacity: o, depthWrite: false }));
    sp2.scale.setScalar(s);
    sp2.position.set(x, y, z);
    scene.add(sp2);
    return sp2;
  };
  haze(DEEP, 0.4, 0.4, -6, 16, 0.22);
  haze(GOLD, -5.5, -1.8, -6, 9, 0.09);
  haze(new THREE.Color("#2a4aa8"), 5.5, 2.5, -8, 10, 0.1);
  const spark = haze(GOLD_HI, brainC.x, 0.6, 0.1, 0.0, 0);

  // ---- pins (hover: reveal label, click: proof overlay)
  const pinEls = pins.map((p) => {
    const b = document.createElement("button");
    b.className = "pin";
    b.dataset.pin = p.id;
    b.innerHTML = `<span class="pin-ring"></span><span class="pin-label">${p.label}</span>`;
    b.setAttribute("aria-label", `${p.label}: show evidence`);
    pinsRoot.append(b);
    return b;
  });
  const pinAnchors: Record<string, () => THREE.Vector3> = {
    neural: () => head.localToWorld(brainC.clone().add(new THREE.Vector3(0.05, 0.12, 0.3))),
    plants: () => lotus[0].getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.15, 0)),
    dna: () => dnaChest.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.2, 0.4, 0)),
    bioelectric: () => new THREE.Vector3(0.9, -1.7, 0.5),
  };
  let pinHandler: (id: string) => void = () => {};
  pinEls.forEach((b) => b.addEventListener("click", () => pinHandler(b.dataset.pin!)));

  // ---- interaction
  const mouse = new THREE.Vector2();
  const smooth = new THREE.Vector2();
  addEventListener("pointermove", (e) => mouse.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1));

  function resize() {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // wide screens: push the scene right so the title has room; phones: smaller figure in the upper half, text below
    CAM_HOME.z = w <= 800 ? 15 : 9.4;
    camera.setViewOffset(w, h, w > 1000 ? -w * 0.2 : 0, w <= 800 ? h * 0.2 : 0, w, h);
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener("resize", resize);

  const v = new THREE.Vector3();
  const t0 = performance.now();
  let flying = false;
  const frame = () => {
    const t = (performance.now() - t0) / 1000;
    shared.uTime.value = reduceMotion ? 0 : t;
    smooth.lerp(mouse, 0.04);
    if (!flying) {
      camera.position.set(CAM_HOME.x + smooth.x * 0.35, CAM_HOME.y - smooth.y * 0.22, CAM_HOME.z);
      camera.lookAt(LOOK);
    } else camera.lookAt(0, 0.7, 0);
    head.rotation.y = -Math.PI / 2 + smooth.x * 0.1;
    human.position.y = -0.1 + (reduceMotion ? 0 : Math.sin(t * 0.6) * 0.03);
    dnaTop.rotation.y = reduceMotion ? 0 : t * 0.35;
    dnaChest.rotation.y = reduceMotion ? 0 : -t * 0.3;
    fol.rotation.z = reduceMotion ? 0 : t * 0.01;
    orbit.rotation.z = 0.3 + (reduceMotion ? 0 : t * 0.05);
    world.position.x = -smooth.x * 0.18;
    lotus.forEach((f, i) => { f.rotation.y = 0.6 + (reduceMotion ? 0 : Math.sin(t * 0.5 + i) * 0.15); });
    tree.rotation.y = reduceMotion ? 0 : Math.sin(t * 0.3) * 0.12;
    const dp = dustPts.geometry.attributes.position as THREE.BufferAttribute;
    if (!reduceMotion) {
      for (let i = 0; i < dp.count; i++) {
        dp.setY(i, dp.getY(i) + 0.0018 + (i % 7) * 0.0003);
        if (dp.getY(i) > 5) dp.setY(i, -5);
      }
      dp.needsUpdate = true;
    }
    stars.rotation.y = reduceMotion ? 0 : t * 0.004;
    renderer.render(scene, camera);
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    pinEls.forEach((b) => {
      const pos = pinAnchors[b.dataset.pin!]?.();
      if (!pos) return;
      v.copy(pos).project(camera);
      b.style.transform = `translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px) translate(-50%, -50%)`;
    });
  };
  renderer.setAnimationLoop(frame);

  return {
    pause: () => renderer.setAnimationLoop(null),
    resume: () => renderer.setAnimationLoop(frame),
    resize,
    onPin: (h) => { pinHandler = h; },
    buildIntro() {
      const tl = gsap.timeline({ paused: true });
      // 0.0s: almost black; 0.4s: a small golden point of light
      tl.to(spark.material, { opacity: 0.9, duration: 0.5, ease: "power2.out" }, 0.4)
        .to(spark.scale, { x: 0.9, y: 0.9, duration: 0.6, ease: "power2.out" }, 0.4)
        // 0.8s: fine particles become visible
        .to([stars.material, dustPts.material], { opacity: (_i: number, tg: THREE.Material) => (tg === stars.material ? 0.9 : 0.7), duration: 0.8, ease: "power1.out" }, 0.8)
        // 1.2s: the head is drawn from lines of light (bottom up, with a golden scan edge)
        .to(shared.uReveal, { value: 1, duration: 1.1, ease: "power2.inOut" }, 1.2)
        .to(spark.material, { opacity: 0.0, duration: 0.6 }, 2.0)
        // 1.8s: the landscape appears through depth fade
        .to(fade, { value: 1, duration: 1.2, ease: "power1.inOut" }, 1.8);
      return tl;
    },
    resetCamera() {
      flying = false;
      camera.fov = 38;
      camera.updateProjectionMatrix();
    },
    transitionOut() {
      return new Promise<void>((resolve) => {
        flying = true;
        const target = { z: CAM_HOME.z, fov: 38, y: CAM_HOME.y, x: camera.position.x };
        const dur = reduceMotion ? 0.01 : 1.5;
        gsap.to(target, {
          z: 1.4, fov: 62, y: 0.7, x: 0, duration: dur, ease: "power3.in",
          onUpdate: () => { camera.position.set(target.x, target.y, target.z); camera.fov = target.fov; camera.updateProjectionMatrix(); },
          onComplete: resolve,
        });
      });
    },
  };
}
