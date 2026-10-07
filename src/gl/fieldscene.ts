import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { glowTexture } from "./models";
import dots from "../data/landdots.json";

/**
 * Earth with its magnetic field, all computed. The field is the textbook dipole model: a field line crossing the equator at
 * L Earth radii follows r = L·cos²λ (λ = geomagnetic latitude). It is simplified (the real field is irregular), tilted by
 * about 11° against the rotation axis, and drawn only to show the shape. It does not show a flow of electricity.
 */
export function initFieldScene(canvas: HTMLCanvasElement, reduceMotion: boolean) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 1.2, 8.5);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.minDistance = 4;
  controls.maxDistance = 14;
  const glow = glowTexture();

  const earth = new THREE.Group();
  scene.add(earth);
  earth.add(new THREE.Mesh(new THREE.SphereGeometry(0.995, 48, 32), new THREE.ShaderMaterial({
    vertexShader: "varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",
    fragmentShader: "varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 2.4); gl_FragColor = vec4(vec3(0.012, 0.045, 0.065) + vec3(0.18, 0.62, 0.75) * f * 0.9, 1.0); }",
  })));
  const pos = new Float32Array(dots.length * 3);
  (dots as [number, number][]).forEach(([la, lo], i) => {
    const φ = (la / 10 * Math.PI) / 180, λ = (lo / 10 * Math.PI) / 180;
    pos.set([1.004 * Math.cos(φ) * Math.sin(λ), 1.004 * Math.sin(φ), 1.004 * Math.cos(φ) * Math.cos(λ)], i * 3);
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  earth.add(new THREE.Points(g, new THREE.PointsMaterial({ map: glow, size: 0.028, color: 0x58d6e8, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false })));

  // field lines
  const field = new THREE.Group();
  field.rotation.z = (11 * Math.PI) / 180;
  earth.add(field);
  const mat = (c: number, o: number) => new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false });
  const Ls = [1.5, 2, 2.7, 3.6];
  const mats: THREE.LineBasicMaterial[] = [];
  Ls.forEach((L, k) => {
    const m = mat(k % 2 ? 0xf0d18b : 0x58d6e8, 0.75 - k * 0.1);
    mats.push(m);
    const lamMax = Math.acos(Math.sqrt(1 / L)) * 0.995;
    for (let a = 0; a < 12; a++) {
      const φ = (a / 12) * Math.PI * 2;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const λ = -lamMax + (2 * lamMax * i) / 64;
        const r = L * Math.cos(λ) ** 2;
        pts.push(new THREE.Vector3(r * Math.cos(λ) * Math.cos(φ), r * Math.sin(λ), r * Math.cos(λ) * Math.sin(φ)));
      }
      field.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), m));
    }
  });
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0x58d6e8, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.18, depthWrite: false }));
  halo.scale.setScalar(9);
  scene.add(halo);

  let running = false;
  const clock = new THREE.Clock();
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  addEventListener("resize", resize);
  return {
    start() {
      if (running) return;
      running = true;
      clock.getDelta();
      resize();
      renderer.setAnimationLoop(() => {
        const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
        if (!reduceMotion) earth.rotation.y += dt * 0.12; // one turn in about a minute: much slower than the real day
        mats.forEach((m, i) => { m.opacity = (0.75 - i * 0.1) * (reduceMotion ? 1 : 0.85 + 0.15 * Math.sin(t * 1.2 + i)); });
        controls.update();
        renderer.render(scene, camera);
      });
    },
    stop() { running = false; renderer.setAnimationLoop(null); },
    resize,
  };
}
export type FieldScene = ReturnType<typeof initFieldScene>;
