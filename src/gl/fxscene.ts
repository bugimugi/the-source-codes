import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";
import { glowTexture } from "./models";
import type { PlateMode } from "../data/cymatics";
import type { ShapeId } from "../data/geometry";

export type FxMode = "kymatik" | "geometrie";

const GOLD = 0xcbaa67, GOLD_HI = 0xf0d18b, CYAN = 0x58d6e8;

const PLATE_VERT = /* glsl */ `
  uniform vec2 uM1; uniform vec2 uM2; uniform float uMix; uniform float uSwing;
  varying vec2 vUv;
  const float PI = 3.14159265359;
  float amp(vec2 p, vec2 mn) { return cos(mn.x * PI * p.x) * cos(mn.y * PI * p.y) - cos(mn.y * PI * p.x) * cos(mn.x * PI * p.y); }
  void main() {
    vUv = uv;
    float a = mix(amp(uv, uM1), amp(uv, uM2), uMix);
    vec3 p = position;
    p.y += a * uSwing;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

// Nodal lines (where the plate stays still) collect the "sand"; the line width is kept constant on screen via fwidth().
const PLATE_FRAG = /* glsl */ `
  uniform vec2 uM1; uniform vec2 uM2; uniform float uMix; uniform float uSwing;
  varying vec2 vUv;
  const float PI = 3.14159265359;
  float amp(vec2 p, vec2 mn) { return cos(mn.x * PI * p.x) * cos(mn.y * PI * p.y) - cos(mn.y * PI * p.x) * cos(mn.x * PI * p.y); }
  float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  void main() {
    float a = mix(amp(vUv, uM1), amp(vUv, uM2), uMix);
    float d = abs(a) / max(fwidth(a), 1e-4);                 // distance to the nodal line in pixels
    float grain = hash(floor(vUv * 900.0));
    float band = exp(-(d / 7.0) * (d / 7.0));
    float sand = step(grain, band * 1.15) * (0.55 + 0.45 * hash(floor(vUv * 900.0) + 7.0));
    float core = exp(-(d / 1.8) * (d / 1.8));
    vec3 plate = mix(vec3(0.010, 0.030, 0.048), vec3(0.018, 0.050, 0.075), a * 0.5 + 0.5);
    vec3 col = plate + vec3(0.94, 0.82, 0.55) * sand + vec3(0.35, 0.84, 0.91) * core * 0.45;
    // soft vignette towards the plate edge
    vec2 q = abs(vUv - 0.5) * 2.0;
    col *= 1.0 - 0.35 * smoothstep(0.75, 1.0, max(q.x, q.y));
    gl_FragColor = vec4(col, 1.0);
  }
`;

/**
 * The 3D part of the frequency page. Everything is computed: a vibrating plate whose nodal lines are drawn in a
 * shader, the five Platonic solids, and the Flower of Life. No external models, no images.
 */
export function initFxScene(canvas: HTMLCanvasElement, reduceMotion: boolean) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 3;
  controls.maxDistance = 10;
  const glow = glowTexture();

  // ---- plate ------------------------------------------------------------------
  const small = matchMedia("(max-width: 700px)").matches;
  const seg = small ? 120 : 220;
  const plateGeo = new THREE.PlaneGeometry(4, 4, seg, seg).rotateX(-Math.PI / 2);
  const uniforms = {
    uM1: { value: new THREE.Vector2(2, 5) },
    uM2: { value: new THREE.Vector2(2, 5) },
    uMix: { value: 1 },
    uSwing: { value: 0 },
  };
  const plate = new THREE.Group();
  plate.add(new THREE.Mesh(plateGeo, new THREE.ShaderMaterial({ uniforms, vertexShader: PLATE_VERT, fragmentShader: PLATE_FRAG, side: THREE.DoubleSide })));
  const frame = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints([[-2, 0, -2], [2, 0, -2], [2, 0, 2], [-2, 0, 2]].map(([x, y, z]) => new THREE.Vector3(x, y, z))),
    new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.8 }),
  );
  plate.add(frame);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: CYAN, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.22, depthWrite: false }));
  halo.scale.setScalar(9);
  halo.position.y = -0.4;
  plate.add(halo);
  scene.add(plate);

  // ---- geometry ---------------------------------------------------------------
  const geo = new THREE.Group();
  geo.visible = false;
  scene.add(geo);
  let shapeObj: THREE.Object3D | null = null;
  let flat = false; // the Flower of Life is a flat pattern: it sways instead of spinning edge-on

  const lineMat = (color: number, opacity = 0.95) => new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });

  function solidGeometry(id: Exclude<ShapeId, "blume">): THREE.BufferGeometry {
    switch (id) {
      case "tetra": return new THREE.TetrahedronGeometry(1.9);
      case "wuerfel": return new THREE.BoxGeometry(2.2, 2.2, 2.2);
      case "okta": return new THREE.OctahedronGeometry(1.9);
      case "dodeka": return new THREE.DodecahedronGeometry(1.7);
      case "ikosa": return new THREE.IcosahedronGeometry(1.8);
    }
  }

  function buildSolid(id: Exclude<ShapeId, "blume">) {
    const g = new THREE.Group();
    const base = solidGeometry(id);
    g.add(new THREE.Mesh(base, new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })));
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(base), lineMat(GOLD_HI)));
    // vertices: de-duplicated corner points with a soft glow
    const pos = base.getAttribute("position");
    const seen = new Set<string>();
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      const key = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`;
      if (!seen.has(key)) { seen.add(key); pts.push(v); }
    }
    g.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(pts), new THREE.PointsMaterial({ map: glow, size: 0.42, color: GOLD_HI, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })));
    return g;
  }

  /** 19 equal circles on a hexagonal lattice (hex distance ≤ 2) plus the enclosing circle. */
  function buildFlower() {
    const g = new THREE.Group();
    const R = 0.62;
    const circle = (cx: number, cy: number, r: number, color: number, opacity: number) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < 96; i++) { const t = (i / 96) * Math.PI * 2; pts.push(new THREE.Vector3(cx + Math.cos(t) * r, cy + Math.sin(t) * r, 0)); }
      g.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), lineMat(color, opacity)));
    };
    for (let q = -2; q <= 2; q++) {
      for (let r = -2; r <= 2; r++) {
        if (Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)) > 2) continue;
        circle(R * (q + r / 2), R * ((Math.sqrt(3) / 2) * r), R, GOLD_HI, 0.8);
      }
    }
    circle(0, 0, R * 3, GOLD, 0.9);
    const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: CYAN, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.35, depthWrite: false }));
    core.scale.setScalar(4.5);
    g.add(core);
    return g;
  }

  function disposeTree(o: THREE.Object3D) {
    o.traverse((c) => {
      const m = c as THREE.Mesh;
      m.geometry?.dispose?.();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
    });
  }

  // ---- state ------------------------------------------------------------------
  let mode: FxMode = "kymatik";
  let running = false;
  let swing = 0;
  let tween: gsap.core.Tween | null = null;
  let target: PlateMode = { m: 2, n: 5 };
  const clock = new THREE.Clock();

  // camera spot per mode; on narrow (portrait) canvases it moves back so the plate / solid stays fully in view
  const camFor = (m: FxMode) => {
    const k = Math.max(1, 1.3 / Math.max(camera.aspect, 0.4));
    return m === "kymatik" ? new THREE.Vector3(0, 3.7, 5.0).multiplyScalar(k) : new THREE.Vector3(0, 0.4, 7 * k);
  };
  camera.position.copy(camFor("kymatik"));
  controls.target.set(0, 0, 0);

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  addEventListener("resize", resize);

  function frame_() {
    const dt = Math.min(clock.getDelta(), 0.05);
    if (mode === "kymatik") {
      // slow motion: the plate swings about once per two seconds, never at the real frequency
      swing += dt;
      uniforms.uSwing.value = reduceMotion ? 0 : Math.sin(swing * 3.2) * 0.07;
      controls.autoRotate = false;
    } else if (shapeObj && !reduceMotion) {
      if (flat) shapeObj.rotation.y = Math.sin(clock.elapsedTime * 0.35) * 0.28;
      else shapeObj.rotation.y += dt * 0.28;
    }
    controls.update();
    renderer.render(scene, camera);
  }

  return {
    start() {
      if (running) return;
      running = true;
      clock.getDelta();
      resize();
      gsap.killTweensOf(camera.position);
      camera.position.copy(camFor(mode));
      renderer.setAnimationLoop(frame_);
    },
    stop() { running = false; renderer.setAnimationLoop(null); },
    resize,
    setMode(next: FxMode) {
      if (next === mode) return;
      mode = next;
      plate.visible = next === "kymatik";
      geo.visible = next === "geometrie";
      controls.minDistance = next === "kymatik" ? 3 : 4;
      gsap.to(camera.position, { ...camFor(next), duration: reduceMotion ? 0 : 1.1, ease: "power2.inOut" });
    },
    /** Morph the plate pattern towards a new mode (smooth, ~0.8 s). */
    setPlateMode(md: PlateMode) {
      if (md.m === target.m && md.n === target.n) return;
      target = md;
      // finish a running morph first so the pattern never jumps backwards
      tween?.kill();
      uniforms.uM1.value.copy(uniforms.uM2.value);
      uniforms.uM2.value.set(md.m, md.n);
      uniforms.uMix.value = 0;
      tween = gsap.to(uniforms.uMix, { value: 1, duration: reduceMotion ? 0 : 0.8, ease: "power2.inOut" });
    },
    setShape(id: ShapeId) {
      if (shapeObj) { geo.remove(shapeObj); disposeTree(shapeObj); }
      flat = id === "blume";
      shapeObj = flat ? buildFlower() : buildSolid(id as Exclude<ShapeId, "blume">);
      shapeObj.rotation.x = flat ? 0 : 0.35;
      geo.add(shapeObj);
    },
    dispose() { this.stop(); renderer.dispose(); },
  };
}
export type FxScene = ReturnType<typeof initFxScene>;
