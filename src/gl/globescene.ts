import * as THREE from "three";
import gsap from "gsap";
import { glowTexture } from "./models";
import dots from "../data/landdots.json";
import { SITES } from "../data/sites";

const R = 2.2;
const ll = (lat: number, lon: number, r = R) => {
  const φ = (lat * Math.PI) / 180, λ = (lon * Math.PI) / 180;
  return new THREE.Vector3(r * Math.cos(φ) * Math.sin(λ), r * Math.sin(φ), r * Math.cos(φ) * Math.cos(λ));
};

/**
 * The globe of the places page, all computed: a dark sphere with a glowing rim, land as dots (Natural Earth, public domain,
 * see scripts/make-land-dots.ts), a faint graticule and one pin per place. Drag turns it, the wheel zooms, a click on a pin
 * selects it and the globe turns until the place faces the viewer. No lines between places (that would claim a connection).
 */
export function initGlobeScene(canvas: HTMLCanvasElement, reduceMotion: boolean, onPick: (id: string) => void) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const glow = glowTexture();
  const globe = new THREE.Group();
  scene.add(globe);

  // sphere with fresnel rim
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.995, 64, 48), new THREE.ShaderMaterial({
    vertexShader: "varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",
    fragmentShader: "varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 2.4); vec3 base = vec3(0.012, 0.045, 0.065); gl_FragColor = vec4(base + vec3(0.18, 0.62, 0.75) * f * 0.9, 1.0); }",
  })));

  // land dots
  const pos = new Float32Array(dots.length * 3);
  (dots as [number, number][]).forEach(([la, lo], i) => ll(la / 10, lo / 10, R * 1.004).toArray(pos, i * 3));
  const landGeo = new THREE.BufferGeometry();
  landGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  globe.add(new THREE.Points(landGeo, new THREE.PointsMaterial({ map: glow, size: 0.05, color: 0x58d6e8, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false })));

  // graticule every 30°
  const seg: number[] = [];
  const add = (a: THREE.Vector3, b: THREE.Vector3) => seg.push(a.x, a.y, a.z, b.x, b.y, b.z);
  for (let lat = -60; lat <= 60; lat += 30) for (let lon = 0; lon < 360; lon += 6) add(ll(lat, lon, R), ll(lat, lon + 6, R));
  for (let lon = 0; lon < 360; lon += 30) for (let lat = -84; lat < 84; lat += 6) add(ll(lat, lon, R), ll(lat + 6, lon, R));
  const gGeo = new THREE.BufferGeometry();
  gGeo.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
  globe.add(new THREE.LineSegments(gGeo, new THREE.LineBasicMaterial({ color: 0x58d6e8, transparent: true, opacity: 0.12 })));

  // atmosphere
  const atmo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0x58d6e8, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.32, depthWrite: false }));
  atmo.scale.setScalar(R * 3.1);
  scene.add(atmo);

  // pins
  const pins = SITES.map((s) => {
    const p = ll(s.lat, s.lon, R * 1.03);
    const g = new THREE.Group();
    g.position.copy(p);
    g.userData = { id: s.id, normal: p.clone().normalize() };
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 10), new THREE.MeshBasicMaterial({ color: 0xf0d18b }));
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0xf0d18b, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.9, depthWrite: false }));
    halo.scale.setScalar(0.3);
    g.add(halo, core);
    globe.add(g);
    return { g, core, halo, id: s.id, lat: s.lat, lon: s.lon };
  });

  // state: yaw/pitch of the globe (see derivation: lat φ -> rotation.x = φ, lon λ -> rotation.y = -λ brings a place to the front)
  let yaw = 0.5, pitch = 0.35, zoom = 8.2;
  let selected: string | null = null;
  let running = false;
  let dragging = false;
  let vYaw = 0;
  let last = { x: 0, y: 0, moved: 0 };
  const clock = new THREE.Clock();

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  addEventListener("resize", resize);

  function pickAt(clientX: number, clientY: number) {
    const r = canvas.getBoundingClientRect();
    let best: string | null = null, bd = 30;
    const wp = new THREE.Vector3(), cam = camera.position;
    for (const p of pins) {
      p.g.getWorldPosition(wp);
      // only pins on the near side (their normal, in world space, faces the camera)
      const n = p.g.userData.normal.clone().applyQuaternion(globe.quaternion);
      if (n.dot(cam.clone().normalize()) < 0.15) continue;
      const v = wp.clone().project(camera);
      const d = Math.hypot(((v.x + 1) / 2) * r.width - (clientX - r.left), ((1 - v.y) / 2) * r.height - (clientY - r.top));
      if (d < bd) { bd = d; best = p.id; }
    }
    return best;
  }
  canvas.addEventListener("pointerdown", (e) => { dragging = true; last = { x: e.clientX, y: e.clientY, moved: 0 }; vYaw = 0; canvas.setPointerCapture(e.pointerId); gsap.killTweensOf(state); });
  canvas.addEventListener("pointermove", (e) => {
    if (dragging) {
      const dx = e.clientX - last.x, dy = e.clientY - last.y;
      last.moved += Math.abs(dx) + Math.abs(dy);
      last.x = e.clientX; last.y = e.clientY;
      const k = 0.0058 * (zoom / 8);
      yaw += dx * k; pitch = Math.max(-1.25, Math.min(1.25, pitch + dy * k));
      vYaw = dx * k;
    } else canvas.style.cursor = pickAt(e.clientX, e.clientY) ? "pointer" : "grab";
  });
  canvas.addEventListener("pointerup", (e) => {
    dragging = false;
    if (last.moved < 6) { const id = pickAt(e.clientX, e.clientY); if (id) onPick(id); }
  });
  canvas.addEventListener("wheel", (e) => { e.preventDefault(); zoom = Math.max(5.2, Math.min(11, zoom + e.deltaY * 0.004)); }, { passive: false });

  // tween target helper (yaw is wrapped to the nearest equivalent angle so the globe takes the short way)
  const state = { t: 0 };
  function fly(lat: number, lon: number) {
    const ty0 = -(lon * Math.PI) / 180;
    const ty = ty0 + Math.round((yaw - ty0) / (Math.PI * 2)) * Math.PI * 2;
    const tp = (lat * Math.PI) / 180;
    const from = { yaw, pitch, zoom };
    gsap.killTweensOf(state);
    gsap.to(from, { yaw: ty, pitch: tp, zoom: 6.6, duration: reduceMotion ? 0 : 1.3, ease: "power2.inOut", onUpdate: () => { yaw = from.yaw; pitch = from.pitch; zoom = from.zoom; } });
    vYaw = 0;
  }

  return {
    start() {
      if (running) return;
      running = true;
      clock.getDelta();
      resize();
      renderer.setAnimationLoop(() => {
        const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
        if (!dragging) {
          if (!selected && !reduceMotion) yaw += dt * 0.07; // slow idle turn
          else if (Math.abs(vYaw) > 0.0001) { yaw += vYaw; vYaw *= 0.94; }
        }
        globe.rotation.set(pitch, yaw, 0, "XYZ");
        camera.position.set(0, 0, zoom * Math.max(1, 1.25 / camera.aspect)); // narrow canvases: step back so the whole globe fits
        pins.forEach((p, i) => {
          const sel = p.id === selected;
          const s = sel ? 1.8 : 1;
          p.g.scale.setScalar(p.g.scale.x + (s - p.g.scale.x) * 0.12);
          if (!reduceMotion) p.halo.scale.setScalar(0.3 + Math.sin(t * 2 + i) * 0.04 + (sel ? 0.1 : 0));
          // fade pins out towards the edge of the globe and behind it (no clipped halos at the limb)
          const facing = Math.max(0, Math.min(1, (p.g.userData.normal.clone().applyQuaternion(globe.quaternion).z - 0.08) * 5));
          (p.halo.material as THREE.SpriteMaterial).opacity = 0.9 * facing;
          (p.core.material as THREE.MeshBasicMaterial).transparent = true;
          (p.core.material as THREE.MeshBasicMaterial).opacity = facing;
        });
        renderer.render(scene, camera);
      });
    },
    stop() { running = false; renderer.setAnimationLoop(null); },
    resize,
    select(id: string | null) {
      selected = id;
      const p = pins.find((x) => x.id === id);
      if (p) fly(p.lat, p.lon);
      else {
        const zt = { z: zoom };
        gsap.killTweensOf(state);
        gsap.to(zt, { z: 8.2, duration: reduceMotion ? 0 : 0.8, onUpdate: () => { zoom = zt.z; } });
      }
    },
  };
}
export type GlobeScene = ReturnType<typeof initGlobeScene>;
