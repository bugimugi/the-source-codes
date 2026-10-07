import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { glowTexture } from "./models";
import { CHAKRAS } from "../data/chakras";

const GOLD = 0xcbaa67;
const Y0 = -2.7, DY = 0.9; // vertical spacing of the seven centres

/**
 * The chakra column, all computed (no models, no images): a luminous channel, seven glowing centres, and for each a lotus
 * ring with the petal count of the tradition (the crown is drawn with 24 petals as a symbol). The selected centre grows
 * and turns faster, the others dim; the camera glides to it.
 */
export function initChakraScene(canvas: HTMLCanvasElement, reduceMotion: boolean, onPick: (id: string) => void) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.minDistance = 2.5;
  controls.maxDistance = 14;
  controls.minPolarAngle = Math.PI * 0.3;
  controls.maxPolarAngle = Math.PI * 0.7;
  const glow = glowTexture();
  const col = (i: number) => new THREE.Color(CHAKRAS[i].color);

  // channel
  const channel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, DY * 6 + 1.6, 12, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xf0d18b, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  channel.position.y = Y0 + DY * 3;
  scene.add(channel);

  // centres
  const nodes = CHAKRAS.map((c, i) => {
    const g = new THREE.Group();
    g.position.y = Y0 + DY * i;
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 16), new THREE.MeshBasicMaterial({ color: col(i) }));
    core.userData.id = c.id;
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: col(i), blending: THREE.AdditiveBlending, transparent: true, opacity: 0.8, depthWrite: false }));
    halo.scale.setScalar(1.1);
    // lotus: petals as thin ellipses (line loops) around the centre, plus an outer ring
    const lotus = new THREE.Group();
    const mat = new THREE.LineBasicMaterial({ color: col(i), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
    for (let p = 0; p < c.petals; p++) {
      const a = (p / c.petals) * Math.PI * 2;
      const pts: THREE.Vector3[] = [];
      for (let k = 0; k <= 24; k++) {
        const t = (k / 24) * Math.PI * 2;
        const r = 0.4, w = Math.min(0.13, (Math.PI * 2 * 0.36) / c.petals);
        pts.push(new THREE.Vector3(Math.cos(t) * w, 0, Math.sin(t) * r * 0.5 + r * 0.55).applyAxisAngle(new THREE.Vector3(0, 1, 0), a));
      }
      lotus.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }
    const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 64 }, (_, k) => new THREE.Vector3(Math.cos((k / 64) * Math.PI * 2) * 0.55, 0, Math.sin((k / 64) * Math.PI * 2) * 0.55))), mat);
    lotus.add(ring);
    lotus.rotation.x = 0.0; // petals lie flat, seen from the side: slight tilt for depth
    g.add(halo, lotus, core);
    scene.add(g);
    return { g, core, halo, lotus, mat };
  });

  // dust
  const N = 260;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const a = Math.sin(i * 12.9898) * 43758.5453, r = (a - Math.floor(a));
    const b = Math.sin(i * 78.233) * 12345.678, s = (b - Math.floor(b));
    const ang = r * Math.PI * 2, rad = 0.8 + s * 2.4;
    pos.set([Math.cos(ang) * rad, Y0 - 0.8 + ((i * 0.6180339) % 1) * (DY * 6 + 1.6), Math.sin(ang) * rad], i * 3);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ map: glow, size: 0.07, color: 0xf0d18b, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(dust);

  // state
  let selected = -1; // -1 = overview
  let running = false;
  const look = new THREE.Vector3(0, 0, 0);
  const camHome = () => new THREE.Vector3(0, 0.2, 11.8);
  camera.position.copy(camHome());
  controls.target.copy(look);
  const clock = new THREE.Clock();

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  addEventListener("resize", resize);

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let down = { x: 0, y: 0 };
  canvas.addEventListener("pointerdown", (e) => { down = { x: e.clientX, y: e.clientY }; });
  function pick(e: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    // generous hit area: the halo sprite is not raycast, so test against enlarged invisible spheres
    const hits = ray.intersectObjects(nodes.map((n) => n.core), false);
    if (hits.length) return hits[0].object.userData.id as string;
    // fallback: nearest node in screen space
    let best: string | null = null, bd = 34;
    nodes.forEach((n, i) => {
      const v = n.g.getWorldPosition(new THREE.Vector3()).project(camera);
      const d = Math.hypot(((v.x + 1) / 2) * r.width - (e.clientX - r.left), ((1 - v.y) / 2) * r.height - (e.clientY - r.top));
      if (d < bd) { bd = d; best = CHAKRAS[i].id; }
    });
    return best;
  }
  canvas.addEventListener("pointerup", (e) => {
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) return; // a drag, not a click
    const id = pick(e);
    if (id) onPick(id);
  });
  canvas.addEventListener("pointermove", (e) => { canvas.style.cursor = pick(e) ? "pointer" : "grab"; });

  const api = {
    start() {
      if (running) return;
      running = true;
      clock.getDelta();
      resize();
      renderer.setAnimationLoop(() => {
        const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
        nodes.forEach((n, i) => {
          const sel = i === selected, dim = selected >= 0 && !sel;
          const target = sel ? 1.7 : dim ? 0.75 : 1;
          n.g.scale.setScalar(n.g.scale.x + (target - n.g.scale.x) * 0.1);
          const op = dim ? 0.25 : 1;
          n.mat.opacity += (op * 0.85 - n.mat.opacity) * 0.1;
          (n.halo.material as THREE.SpriteMaterial).opacity += ((dim ? 0.25 : 0.8) - (n.halo.material as THREE.SpriteMaterial).opacity) * 0.1;
          if (!reduceMotion) {
            n.lotus.rotation.y += dt * (sel ? 0.9 : 0.25) * (i % 2 ? -1 : 1);
            n.halo.scale.setScalar(1.1 + Math.sin(t * 1.4 + i) * 0.08);
          }
          n.lotus.rotation.x = 1.15; // look slightly from above, like a flower seen at an angle
        });
        if (!reduceMotion) dust.rotation.y += dt * 0.03;
        controls.update();
        renderer.render(scene, camera);
      });
    },
    stop() { running = false; renderer.setAnimationLoop(null); },
    resize,
    /** Fly to a centre (index) or back to the overview (-1). */
    select(id: string | null) {
      selected = id ? CHAKRAS.findIndex((c) => c.id === id) : -1;
      const y = selected >= 0 ? Y0 + DY * selected : 0;
      const dist = selected >= 0 ? 5.6 : camHome().z;
      gsap.to(controls.target, { y, duration: reduceMotion ? 0 : 1, ease: "power2.inOut" });
      gsap.to(camera.position, { y: y + 0.3, z: dist, x: 0, duration: reduceMotion ? 0 : 1, ease: "power2.inOut" });
    },
  };
  return api;
}
export type ChakraScene = ReturnType<typeof initChakraScene>;
