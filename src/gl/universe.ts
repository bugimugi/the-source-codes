import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";
import { claims } from "../data/claims";
import { AREA_COLOR, AREA_ORDER, AREA_TAGLINE } from "../data/areas";
import { AREA_LABEL, LEVEL_LABEL, type Area, type Claim, type EvidenceLevel } from "../data/types";
import { dot, glowTexture, rng } from "./models";

const LEVEL_COLOR: Record<EvidenceLevel, number> = {
  claimed: 0xb9a4ff, established: 0x6ee7a8, supported: 0x9bd16b, hypothesis: 0xf2c76b,
  historical: 0x8fb7ff, unsupported: 0xff9f6b, refuted: 0xff6b7d,
};

/** Small 3D force layout inside one cluster. */
function layout(n: number, edges: [number, number][]) {
  if (n === 1) return [new THREE.Vector3()];
  const pos = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a), (Math.random() - 0.5) * 1.2, Math.sin(a)).multiplyScalar(1.6);
  });
  for (let it = 0; it < 300; it++) {
    const f = pos.map(() => new THREE.Vector3());
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++) {
        const d = pos[i].clone().sub(pos[j]);
        d.multiplyScalar(0.3 / Math.max(d.lengthSq(), 0.05));
        f[i].add(d); f[j].sub(d);
      }
    for (const [a, b] of edges) {
      const d = pos[b].clone().sub(pos[a]);
      const l = Math.max(d.length(), 1e-3);
      const pull = d.multiplyScalar(((l - 1.3) * 0.04) / l);
      f[a].add(pull); f[b].sub(pull);
    }
    pos.forEach((p, i) => p.add(f[i].addScaledVector(p, -0.12).multiplyScalar(0.5)));
  }
  return pos;
}

/** Clusters sit on a ring with alternating heights, so their names rarely overlap on screen. */
function ringLayout(n: number, radius: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + 0.4;
    return new THREE.Vector3(Math.cos(a) * radius, (i % 2 ? 1 : -1) * 5.5, Math.sin(a) * radius);
  });
}

const nebulaVert = /* glsl */ `
  attribute float aSize; attribute vec3 aColor; varying vec3 vColor;
  void main(){ vColor = aColor; vec4 mv = modelViewMatrix * vec4(position,1.0);
    gl_PointSize = aSize * (320.0 / -mv.z); gl_Position = projectionMatrix * mv; }`;
const nebulaFrag = /* glsl */ `
  varying vec3 vColor;
  void main(){ float d = length(gl_PointCoord - 0.5); if(d>0.5) discard;
    float a = pow(1.0 - d*2.0, 2.0) * 0.2; gl_FragColor = vec4(vColor, a); }`;

function makeNebula(color: number, count: number, radius: number, seed: number) {
  const r = rng(seed);
  const pos = new Float32Array(count * 3), col = new Float32Array(count * 3), size = new Float32Array(count);
  const base = new THREE.Color(color);
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    // flattened gaussian blob with two spiral-ish arms for a galactic look
    const arm = i % 2 ? 0.8 : -0.8;
    const rad = Math.pow(r(), 0.7) * radius;
    const ang = rad * 0.9 * arm + r() * 1.2;
    const h = (r() - 0.5) * radius * 0.28 * (1 - rad / radius + 0.2);
    pos.set([Math.cos(ang) * rad, h, Math.sin(ang) * rad], i * 3);
    c.copy(base).offsetHSL((r() - 0.5) * 0.08, 0, (r() - 0.5) * 0.15);
    c.multiplyScalar(0.55 + r() * 0.7);
    c.toArray(col, i * 3);
    size[i] = 0.5 + r() * 2.2;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
  g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  return new THREE.Points(g, new THREE.ShaderMaterial({ vertexShader: nebulaVert, fragmentShader: nebulaFrag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
}

export function initUniverse(
  canvas: HTMLCanvasElement,
  labelsRoot: HTMLElement,
  reduceMotion: boolean,
  onSelect: (claimId: string) => void,
) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x02030a);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02030a, 0.012);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);
  const HOME = new THREE.Vector3(0, 34, 58);
  camera.position.copy(HOME);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 2.5;
  controls.maxDistance = 80;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 0.25;

  // distant stars (parallax with the camera)
  const r = rng(77);
  const sp = new Float32Array(6000 * 3);
  for (let i = 0; i < 6000; i++) {
    const v = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize().multiplyScalar(90 + r() * 90);
    sp.set([v.x, v.y, v.z], i * 3);
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ map: dot(), alphaTest: 0.04, color: 0xbcd0ff, size: 0.9, sizeAttenuation: true, transparent: true, opacity: 0.85, fog: false })));

  // clusters
  const usedAreas = AREA_ORDER.filter((a) => claims.some((c) => c.area === a));
  const centers = new Map<Area, THREE.Vector3>();
  ringLayout(usedAreas.length, 28).forEach((p, i) => centers.set(usedAreas[i], p));
  const nebulae: THREE.Object3D[] = [];
  const areaLabels = new Map<Area, HTMLElement>();
  for (const a of usedAreas) {
    const c = centers.get(a)!;
    const neb = makeNebula(AREA_COLOR[a], 2600, 5.2, a.length * 97);
    neb.position.copy(c);
    // every galaxy is tilted differently so none of them is seen exactly edge-on
    const tr = rng(a.length * 31);
    neb.rotation.set((tr() - 0.5) * 1.1, 0, (tr() - 0.5) * 1.1);
    scene.add(neb);
    nebulae.push(neb);
    const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: AREA_COLOR[a], blending: THREE.AdditiveBlending, transparent: true, opacity: 0.55, depthWrite: false }));
    core.scale.setScalar(5);
    core.position.copy(c);
    scene.add(core);
    const btn = document.createElement("button");
    btn.className = "area-label";
    btn.style.setProperty("--c", `#${AREA_COLOR[a].toString(16).padStart(6, "0")}`);
    btn.innerHTML = `<strong>${AREA_LABEL[a]}</strong><small>${AREA_TAGLINE[a]}</small>`;
    btn.addEventListener("click", () => flyTo(c, 9));
    labelsRoot.append(btn);
    areaLabels.set(a, btn);
  }

  // nodes
  const idIndex = new Map(claims.map((c, i) => [c.id, i]));
  const nodePos: THREE.Vector3[] = new Array(claims.length);
  for (const a of usedAreas) {
    const members = claims.map((c, i) => ({ c, i })).filter((m) => m.c.area === a);
    const local = new Map(members.map((m, k) => [m.c.id, k]));
    const edges: [number, number][] = [];
    for (const { c } of members) for (const rel of c.related ?? []) if (local.has(rel) && local.get(c.id)! < local.get(rel)!) edges.push([local.get(c.id)!, local.get(rel)!]);
    const lp = layout(members.length, edges);
    members.forEach((m, k) => (nodePos[m.i] = lp[k].clone().multiplyScalar(0.85).add(centers.get(a)!)));
  }
  const nodes: THREE.Mesh[] = [];
  const glows: THREE.Sprite[] = [];
  const labels: HTMLElement[] = [];
  const tex = glowTexture();
  claims.forEach((c, i) => {
    const color = LEVEL_COLOR[c.level];
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 16), new THREE.MeshBasicMaterial({ color, transparent: true }));
    mesh.position.copy(nodePos[i]);
    mesh.userData.id = c.id;
    scene.add(mesh);
    nodes.push(mesh);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.85, depthWrite: false }));
    glow.scale.setScalar(1.3);
    glow.position.copy(nodePos[i]);
    scene.add(glow);
    glows.push(glow);
    const label = document.createElement("button");
    label.className = "node-label";
    label.style.setProperty("--c", `#${color.toString(16).padStart(6, "0")}`);
    label.textContent = c.short ?? (c.statement.length > 58 ? `${c.statement.slice(0, 56)}…` : c.statement);
    label.title = LEVEL_LABEL[c.level];
    label.addEventListener("click", () => focusNode(i));
    labelsRoot.append(label);
    labels.push(label);
  });

  // links between related claims; cross-cluster links arc through the void
  const seen = new Set<string>();
  const linePts: THREE.Vector3[] = [];
  for (const c of claims)
    for (const rel of c.related ?? []) {
      const j = idIndex.get(rel);
      if (j === undefined) continue;
      const i = idIndex.get(c.id)!;
      const key = [i, j].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      const a = nodePos[i], b = nodePos[j];
      const same = claims[i].area === claims[j].area;
      const ctrl = a.clone().add(b).multiplyScalar(0.5).multiplyScalar(same ? 1 : 0.55);
      const curve = new THREE.QuadraticBezierCurve3(a, ctrl, b);
      const pts = curve.getPoints(same ? 2 : 28);
      for (let k = 0; k < pts.length - 1; k++) linePts.push(pts[k], pts[k + 1]);
    }
  scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(linePts), new THREE.LineBasicMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false })));

  let visible: boolean[] = claims.map(() => true);
  const v = new THREE.Vector3();

  function flyTo(target: THREE.Vector3, dist: number, done?: () => void) {
    const dir = camera.position.clone().sub(controls.target).normalize();
    const end = target.clone().add(dir.multiplyScalar(dist));
    controls.autoRotate = false;
    controls.enabled = false;
    const d = reduceMotion ? 0 : 1.6;
    gsap.to(camera.position, { x: end.x, y: end.y, z: end.z, duration: d, ease: "power3.inOut" });
    gsap.to(controls.target, { x: target.x, y: target.y, z: target.z, duration: d, ease: "power3.inOut", onComplete: () => { controls.enabled = true; done?.(); } });
  }
  function focusNode(i: number) {
    if (!visible[i]) return;
    flyTo(nodePos[i], 3.6, () => onSelect(claims[i].id));
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  let downX = 0, downY = 0;
  const ray = new THREE.Raycaster();
  canvas.addEventListener("pointerdown", (e) => { downX = e.clientX; downY = e.clientY; });
  canvas.addEventListener("pointerup", (e) => {
    if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 6) return;
    const rect = canvas.getBoundingClientRect();
    ray.setFromCamera(new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1), camera);
    ray.params.Points = { threshold: 0.2 };
    const hit = ray.intersectObjects(nodes, false)[0];
    if (hit) focusNode(nodes.indexOf(hit.object as THREE.Mesh));
  });

  const t0 = performance.now();
  const frame = () => {
    const t = (performance.now() - t0) / 1000;
    controls.update();
    nebulae.forEach((n, i) => { if (!reduceMotion) n.rotateY(0.0004 * (i % 2 ? 1 : -1)); });
    nodes.forEach((m, i) => {
      const pulse = 1 + 0.12 * Math.sin(t * 2 + i);
      const on = visible[i];
      m.scale.setScalar(on ? pulse : 0.5);
      (m.material as THREE.MeshBasicMaterial).opacity = on ? 1 : 0.25;
      glows[i].scale.setScalar(on ? 1.3 * pulse : 0.5);
      (glows[i].material as THREE.SpriteMaterial).opacity = on ? 0.85 : 0.12;
    });
    renderer.render(scene, camera);
    // HTML labels: area names when far away, claim statements when close
    const w = canvas.clientWidth, h = canvas.clientHeight;
    for (const a of usedAreas) {
      const c = centers.get(a)!;
      const d = camera.position.distanceTo(c);
      v.copy(c).project(camera);
      const el = areaLabels.get(a)!;
      const op = v.z < 1 ? THREE.MathUtils.clamp((d - 8) / 7, 0, 1) : 0;
      // nearer galaxies draw larger and on top, distant ones smaller – overlapping names stay readable
      const sc = THREE.MathUtils.clamp(46 / d, 0.5, 1.15);
      el.style.transform = `translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px) translate(-50%, -50%) scale(${sc.toFixed(3)})`;
      el.style.zIndex = String(Math.round(1000 - d));
      el.style.opacity = String(op * THREE.MathUtils.clamp(sc + 0.15, 0.4, 1));
      el.style.pointerEvents = op > 0.2 ? "auto" : "none";
    }
    nodes.forEach((m, i) => {
      const d = camera.position.distanceTo(m.position);
      v.copy(m.position).project(camera);
      const near = THREE.MathUtils.clamp((13 - d) / 6, 0, 1);
      const op = v.z < 1 ? near * (visible[i] ? 1 : 0.1) : 0;
      labels[i].style.transform = `translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px) translate(-50%, 20px)`;
      labels[i].style.opacity = String(op);
      labels[i].style.pointerEvents = op > 0.3 ? "auto" : "none";
    });
  };

  addEventListener("resize", resize);
  return {
    start() { resize(); renderer.setAnimationLoop(frame); },
    stop() { renderer.setAnimationLoop(null); },
    resize,
    /** Arrival: the camera pulls back from the centre of the library into the overview. */
    intro() {
      controls.target.set(0, 0, 0);
      camera.position.set(0, 2, 7);
      controls.enabled = false;
      gsap.to(camera.position, { x: HOME.x, y: HOME.y, z: HOME.z, duration: reduceMotion ? 0 : 2.6, ease: "power3.out", onComplete: () => { controls.enabled = true; controls.autoRotate = !reduceMotion; } });
    },
    home() { controls.target.set(0, 0, 0); flyTo(new THREE.Vector3(), 64); },
    /** Dim every node that does not match; the universe stays intact for context. */
    setFilter(match: (c: Claim) => boolean) { visible = claims.map(match); },
    flyToArea(a: Area) { const c = centers.get(a); if (c) flyTo(c, 9); },
  };
}
