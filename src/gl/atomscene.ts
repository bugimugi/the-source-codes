import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { glowTexture } from "./models";

export type AtomMode = "atom" | "dichte" | "orbital" | "isotope";
export type Orbital = "1s" | "2s" | "2p";

/** a small seeded generator: the electron clouds look the same every time */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/**
 * Point cloud of one hydrogen orbital: every point is a possible place of the electron, drawn with the probability |psi|^2
 * (radii in Bohr radii). 1s: radial density r^2 e^(-2r); 2s: r^2 (1 - r/2)^2 e^(-r) with a node at r = 2; 2p (z): r^4 e^(-r) cos^2(theta).
 * `sign` is the sign of the wave function (the two lobes of 2p, the two shells of 2s) and only colours the points.
 */
export function orbitalPoints(kind: Orbital, n: number, seed: number): { pos: Float32Array; sign: Int8Array } {
  const rand = rng(seed);
  const pos = new Float32Array(n * 3), sign = new Int8Array(n);
  // inverse-CDF table for the 2s radial density
  const M = 1500, dr = 30 / M, cdf = new Float64Array(M + 1);
  if (kind === "2s") for (let i = 1; i <= M; i++) { const r = i * dr, f = r * r * (1 - r / 2) ** 2 * Math.exp(-r); cdf[i] = cdf[i - 1] + f; }
  for (let i = 0; i < n; i++) {
    let r = 0, mu = 0, sg = 1;
    if (kind === "1s") {
      r = -0.5 * Math.log(rand() * rand() * rand() + 1e-12);
      mu = rand() * 2 - 1;
    } else if (kind === "2s") {
      const u = rand() * cdf[M];
      let lo = 0, hi = M;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (cdf[mid] < u) lo = mid + 1; else hi = mid; }
      r = lo * dr;
      sg = 1 - r / 2 >= 0 ? 1 : -1;
      mu = rand() * 2 - 1;
    } else {
      r = -Math.log(rand() * rand() * rand() * rand() * rand() + 1e-12);
      do { mu = rand() * 2 - 1; } while (rand() > mu * mu);
      sg = mu >= 0 ? 1 : -1;
    }
    const phi = rand() * Math.PI * 2, s = Math.sqrt(1 - mu * mu);
    pos.set([r * s * Math.cos(phi), r * mu, r * s * Math.sin(phi)], i * 3);
    sign[i] = sg;
  }
  return { pos, sign };
}

/** how far (in scene units) one Bohr radius reaches in the cloud views, so that every orbital fits the picture */
const SCALE: Record<Orbital, number> = { "1s": 0.9, "2s": 0.26, "2p": 0.3 };

/**
 * The hydrogen atom, computed (no models, no images): a Bohr model with the true 1 : 4 spacing of the first two orbits, the
 * electron cloud of the ground state, the orbitals 1s, 2s and 2p as probability clouds and the three isotopes side by side.
 * Drag rotates; the page's buttons switch mode, rotation, motion and zoom.
 */
export function initAtomScene(canvas: HTMLCanvasElement, reduceMotion: boolean) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const HOME = 11.2, CLOSE = 6.4;
  camera.position.set(0, 1.6, HOME);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableZoom = false; // the wheel scrolls the page; zoom is a button
  controls.enableDamping = true;
  controls.minPolarAngle = Math.PI * 0.2;
  controls.maxPolarAngle = Math.PI * 0.8;
  canvas.style.touchAction = "pan-y"; // a vertical swipe scrolls the page, a horizontal one turns the atom
  const glow = glowTexture();

  const mk = {
    glowSprite: (color: number, scale: number, opacity = 0.9) => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, blending: THREE.AdditiveBlending, transparent: true, opacity, depthWrite: false }));
      s.scale.setScalar(scale);
      return s;
    },
    ball: (r: number, color: number) => new THREE.Mesh(new THREE.SphereGeometry(r, 28, 18), new THREE.MeshBasicMaterial({ color })),
    ring: (r: number, color: number, opacity: number, tilt = 0) => {
      const g = new THREE.BufferGeometry().setFromPoints(Array.from({ length: 129 }, (_, k) => new THREE.Vector3(Math.cos((k / 128) * Math.PI * 2) * r, 0, Math.sin((k / 128) * Math.PI * 2) * r)));
      const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }));
      l.rotation.x = tilt;
      return l;
    },
  };
  const root = new THREE.Group();
  scene.add(root);

  // ---- 1) Bohr model: glass sphere, nucleus, two orbits (radii 1 : 4), electron on the first
  const gAtom = new THREE.Group();
  gAtom.add(
    new THREE.Mesh(new THREE.SphereGeometry(3.5, 48, 32), new THREE.MeshBasicMaterial({ color: 0x58a8ff, transparent: true, opacity: 0.1, side: THREE.BackSide, depthWrite: false })),
    new THREE.Mesh(new THREE.SphereGeometry(3.5, 48, 32), new THREE.MeshBasicMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0.05, depthWrite: false })),
    mk.glowSprite(0x58a8ff, 9.5, 0.45),
  );
  const nucleus = mk.ball(0.24, 0xff5a4a);
  const nucGlow = mk.glowSprite(0xff7a5a, 1.6);
  const tilt = 0.55;
  const orbit1 = mk.ring(0.8, 0xf0d18b, 0.9, tilt), orbit2 = mk.ring(3.2, 0xf0d18b, 0.28, tilt);
  const electron = mk.ball(0.1, 0xcfeaff);
  const elGlow = mk.glowSprite(0x7fc4ff, 0.8);
  electron.add(elGlow);
  gAtom.add(nucleus, nucGlow, orbit1, orbit2, electron);

  // ---- 2) / 3) the clouds (one points object, refilled for the chosen orbital)
  const N = 7000;
  const cloudGeo = new THREE.BufferGeometry();
  cloudGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  cloudGeo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  const cloud = new THREE.Points(cloudGeo, new THREE.PointsMaterial({ map: glow, size: 0.1, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
  const gCloud = new THREE.Group();
  const cloudNucleus = mk.ball(0.12, 0xff5a4a);
  gCloud.add(cloud, cloudNucleus, mk.glowSprite(0xff7a5a, 1.2, 0.7));
  const POS = new THREE.Color(0x58c8ff), NEG = new THREE.Color(0xffa24a), CORE = new THREE.Color(0x9fd8ff);
  let orbital: Orbital = "1s";
  function fillCloud(kind: Orbital, colourBySign: boolean) {
    const { pos, sign } = orbitalPoints(kind, N, kind === "1s" ? 11 : kind === "2s" ? 22 : 33);
    const sc = SCALE[kind], p = cloudGeo.getAttribute("position") as THREE.BufferAttribute, c = cloudGeo.getAttribute("color") as THREE.BufferAttribute;
    for (let i = 0; i < N; i++) {
      p.setXYZ(i, pos[i * 3] * sc, pos[i * 3 + 1] * sc, pos[i * 3 + 2] * sc);
      const col = colourBySign ? (sign[i] > 0 ? POS : NEG) : CORE;
      c.setXYZ(i, col.r, col.g, col.b);
    }
    p.needsUpdate = true; c.needsUpdate = true;
    cloud.material.size = kind === "1s" ? 0.12 : 0.1;
  }

  // ---- 4) the three isotopes
  const gIso = new THREE.Group();
  const ISO: { x: number; neutrons: number }[] = [{ x: -3.4, neutrons: 0 }, { x: 0, neutrons: 1 }, { x: 3.4, neutrons: 2 }];
  for (const { x, neutrons } of ISO) {
    const g = new THREE.Group();
    g.position.x = x;
    const parts: [number, number, number][] = neutrons === 0 ? [[0, 0, 0]] : neutrons === 1 ? [[-0.26, 0, 0], [0.26, 0, 0]] : [[0, 0.3, 0], [-0.27, -0.16, 0], [0.27, -0.16, 0]];
    parts.forEach((p, i) => { const b = mk.ball(0.28, i === 0 ? 0xff5a4a : 0xa9b4c2); b.position.set(...p); g.add(b); });
    g.add(mk.glowSprite(0xff9a7a, 2.2, 0.6), mk.ring(1.5, 0x58a8ff, 0.35, 0.4));
    const lab = document.createElement("canvas"); lab.width = 128; lab.height = 64;
    const cx = lab.getContext("2d")!; cx.fillStyle = "#ECE8DE"; cx.font = "600 44px Georgia, serif"; cx.textAlign = "center"; cx.textBaseline = "middle";
    cx.fillText(neutrons === 0 ? "¹H" : neutrons === 1 ? "²H" : "³H", 64, 34);
    const tex = new THREE.CanvasTexture(lab); tex.colorSpace = THREE.SRGBColorSpace;
    const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    label.scale.set(1.6, 0.8, 1); label.position.y = -2.7;
    g.add(label);
    gIso.add(g);
  }

  root.add(gAtom, gCloud, gIso);

  // ---- state
  let mode: AtomMode = "atom";
  let rotating = !reduceMotion, animating = false, zoomed = false, running = false, angle = 0.8;
  const clock = new THREE.Clock();
  function show() {
    gAtom.visible = mode === "atom";
    gCloud.visible = mode === "dichte" || mode === "orbital";
    gIso.visible = mode === "isotope";
    if (gCloud.visible) fillCloud(mode === "dichte" ? "1s" : orbital, mode === "orbital");
    cloudNucleus.visible = mode === "dichte" || orbital === "1s";
    renderOnce();
  }
  function renderOnce() { if (!running) { controls.update(); renderer.render(scene, camera); } }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderOnce();
  }
  new ResizeObserver(resize).observe(canvas);

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    if (animating) angle += dt * 2.6;
    electron.position.set(Math.cos(angle) * 0.8, 0, Math.sin(angle) * 0.8).applyAxisAngle(new THREE.Vector3(1, 0, 0), tilt);
    if (rotating && mode !== "isotope") root.rotation.y += dt * 0.28;
    if (animating) { const k = 1 + Math.sin(t * 2.2) * 0.035; gCloud.scale.setScalar(k); nucGlow.scale.setScalar(1.6 + Math.sin(t * 3) * 0.18); } else { gCloud.scale.setScalar(1); nucGlow.scale.setScalar(1.6); }
    controls.update();
    renderer.render(scene, camera);
  }

  const api = {
    start() {
      if (running) return;
      running = true;
      clock.getDelta();
      resize();
      renderer.setAnimationLoop(frame);
    },
    stop() { running = false; renderer.setAnimationLoop(null); },
    resize,
    setMode(m: AtomMode) { mode = m; if (m === "isotope") root.rotation.y = 0; show(); },
    setOrbital(o: Orbital) { orbital = o; show(); },
    setRotate(b: boolean) { rotating = b; },
    setAnimate(b: boolean) { animating = b; renderOnce(); },
    setZoom(z: boolean) {
      zoomed = z;
      const v = camera.position.clone().setLength(z ? CLOSE : HOME);
      gsap.to(camera.position, { x: v.x, y: v.y, z: v.z, duration: reduceMotion ? 0 : 0.8, ease: "power2.inOut", onUpdate: renderOnce });
    },
    dispose() { running = false; renderer.setAnimationLoop(null); controls.dispose(); renderer.dispose(); renderer.forceContextLoss(); },
    get zoomed() { return zoomed; },
    get mode() { return mode; },
  };
  show();
  return api;
}
export type AtomScene = ReturnType<typeof initAtomScene>;
