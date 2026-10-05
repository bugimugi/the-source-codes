import * as THREE from "three";
import { ConvexGeometry } from "three/addons/geometries/ConvexGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import type { ModelSpec } from "../data/types";

/** Procedural 3D models for the atlas and the topic stages. No external assets. */

export function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Studio-like image-based lighting so glass, metal and polished stone look right. */
export function makeEnvironment(renderer: THREE.WebGLRenderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  return env;
}

let dotTex: THREE.CanvasTexture | null = null;
/** Round, soft-edged point sprite; PointsMaterial would otherwise draw squares. */
export function dot() {
  if (dotTex) return dotTex;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.5, "rgba(255,255,255,0.9)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  dotTex = new THREE.CanvasTexture(c);
  return dotTex;
}

export function glowTexture(inner = "rgba(255,255,255,1)", outer = "rgba(255,255,255,0)") {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.35, "rgba(255,255,255,0.35)");
  grad.addColorStop(1, outer);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ------------------------------------------------------------------ crystals

function gemMaterial(color: string, opts: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0,
    roughness: 0.06,
    transmission: 0.92,
    thickness: 1.4,
    ior: 1.55,
    clearcoat: 1,
    envMapIntensity: 1.3,
    attenuationColor: new THREE.Color(color),
    attenuationDistance: 2.2,
    ...opts,
  });
}

/** Hexagonal prism with pyramidal termination – quartz, amethyst, citrine. */
function hexCrystal(color: string, height: number, radius: number, tip: number, mat: THREE.Material) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.04, height, 6, 1), mat);
  const top = new THREE.Mesh(new THREE.ConeGeometry(radius, tip, 6, 1), mat);
  top.position.y = height / 2 + tip / 2;
  g.add(body, top);
  g.position.y = height / 2;
  const wrap = new THREE.Group();
  wrap.add(g);
  return wrap;
}

function quartzCluster(color: string) {
  const r = rng(hash(color));
  const mat = gemMaterial(color);
  const group = new THREE.Group();
  const main = hexCrystal(color, 2.6, 0.5, 0.75, mat);
  group.add(main);
  for (let i = 0; i < 7; i++) {
    const h = 0.9 + r() * 1.5;
    const c = hexCrystal(color, h, 0.2 + r() * 0.18, 0.3 + r() * 0.2, mat);
    const a = (i / 7) * Math.PI * 2 + r() * 0.5;
    c.position.set(Math.cos(a) * (0.55 + r() * 0.35), 0, Math.sin(a) * (0.55 + r() * 0.35));
    c.rotation.set((r() - 0.5) * 0.7, 0, (r() - 0.5) * 0.7);
    c.rotateY(a);
    group.add(c);
  }
  // matrix (host rock)
  const rock = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.15, 1),
    new THREE.MeshStandardMaterial({ color: "#4a4140", roughness: 0.95, flatShading: true }),
  );
  rock.scale.set(1.25, 0.32, 1.25);
  rock.position.y = 0.02;
  group.add(rock);
  group.position.y = -1.2;
  return group;
}

function fluorite(color: string, color2: string) {
  const g = new THREE.Group();
  const geo = new THREE.OctahedronGeometry(1.5);
  const mat = gemMaterial(color, { attenuationColor: new THREE.Color(color2), attenuationDistance: 1.2 });
  const m = new THREE.Mesh(geo, mat);
  g.add(m);
  g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: color2, transparent: true, opacity: 0.55 })));
  const small = new THREE.Mesh(new THREE.OctahedronGeometry(0.55), mat);
  small.position.set(1.5, -0.9, 0.5);
  g.add(small);
  g.rotation.set(0.3, 0.2, 0.15);
  return g;
}

function pyrite(color: string) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, metalness: 1, roughness: 0.22, envMapIntensity: 1.6 });
  const r = rng(7);
  const add = (s: number, x: number, y: number, z: number, ry: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), mat);
    m.position.set(x, y, z);
    m.rotation.set(0.1, ry, 0.05);
    g.add(m);
  };
  add(1.6, 0, 0, 0, 0.4);
  for (let i = 0; i < 5; i++) add(0.35 + r() * 0.5, (r() - 0.5) * 2.4, (r() - 0.5) * 1.4 - 0.4, (r() - 0.5) * 2.2, r());
  return g;
}

function garnet(color: string) {
  // rhombic dodecahedron: the typical garnet habit (cubic system)
  const pts: THREE.Vector3[] = [];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) pts.push(new THREE.Vector3(x, y, z));
  for (const s of [-2, 2]) pts.push(new THREE.Vector3(s, 0, 0), new THREE.Vector3(0, s, 0), new THREE.Vector3(0, 0, s));
  const geo = new ConvexGeometry(pts.map((p) => p.multiplyScalar(0.8)));
  const m = new THREE.Mesh(geo, gemMaterial(color, { transmission: 0.55, roughness: 0.12, thickness: 1.8, attenuationDistance: 0.9, flatShading: true }));
  const g = new THREE.Group();
  g.add(m);
  g.rotation.set(0.5, 0.6, 0);
  return g;
}

function tourmaline(color: string) {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhysicalMaterial({ color, roughness: 0.18, metalness: 0.15, clearcoat: 0.8, envMapIntensity: 1.2 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 3.2, 3, 8), mat);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.45, 3), mat);
  tip.position.y = 1.82;
  g.add(body, tip);
  // vertical striations along the prism, typical for tourmaline
  const lines = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.56, 0.61, 3.2, 3, 1)),
    new THREE.LineBasicMaterial({ color: "#555a66", transparent: true, opacity: 0.6 }),
  );
  g.add(lines);
  g.rotation.z = 0.35;
  return g;
}

function bandedTexture(base: string, dark: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = base;
  g.fillRect(0, 0, 512, 512);
  const r = rng(11);
  for (let i = 0; i < 46; i++) {
    g.strokeStyle = i % 2 ? dark : base;
    g.globalAlpha = 0.35 + r() * 0.5;
    g.lineWidth = 3 + r() * 10;
    g.beginPath();
    for (let x = 0; x <= 512; x += 16) {
      const y = 12 * i + 18 * Math.sin(x * 0.02 + i * 0.7) + 14 * Math.sin(x * 0.047 + i);
      if (x === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function malachite(color: string) {
  const g = new THREE.Group();
  const tex = bandedTexture(color, "#0b5a37");
  const mat = new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.28, clearcoat: 0.7, envMapIntensity: 1.1 });
  const r = rng(5);
  const specs: [number, number, number, number][] = [[0, 0, 0, 0.95], [0.95, -0.3, 0.2, 0.62], [-0.9, -0.35, 0.1, 0.55], [0.2, -0.55, 0.9, 0.6], [-0.3, 0.7, -0.4, 0.5], [0.55, 0.55, -0.5, 0.42]];
  for (const [x, y, z, s] of specs) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(s, 40, 32), mat);
    m.position.set(x, y, z);
    m.rotation.set(r() * 3, r() * 3, 0);
    g.add(m);
  }
  return g;
}

function displaced(geo: THREE.BufferGeometry, amp: number, freq: number, seed: number) {
  const r = rng(seed);
  const phase = [r() * 6, r() * 6, r() * 6];
  const p = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = v.clone().normalize();
    const d = Math.sin(n.x * freq + phase[0]) * Math.sin(n.y * freq + phase[1]) * Math.sin(n.z * freq + phase[2]);
    v.addScaledVector(n, d * amp);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

function lapis(color: string, gold: string) {
  const g = new THREE.Group();
  const geo = displaced(new THREE.IcosahedronGeometry(1.35, 5), 0.09, 3.2, 3);
  g.add(new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color, roughness: 0.38, clearcoat: 0.6, envMapIntensity: 1 })));
  // pyrite flecks – lapis lazuli typically contains golden pyrite inclusions
  const r = rng(9);
  const pts: number[] = [];
  const v = new THREE.Vector3();
  for (let i = 0; i < 260; i++) {
    v.set(r() - 0.5, r() - 0.5, r() - 0.5).normalize().multiplyScalar(1.4);
    pts.push(v.x, v.y, v.z);
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  g.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: gold, size: 0.045, sizeAttenuation: true, map: dot(), alphaTest: 0.05 })));
  return g;
}

function obsidian(color: string) {
  const geo = new THREE.IcosahedronGeometry(1.45, 1);
  const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color, roughness: 0.04, metalness: 0.2, clearcoat: 1, envMapIntensity: 1.8, flatShading: true }));
  m.scale.set(1, 1.25, 0.8);
  const g = new THREE.Group();
  g.add(m);
  return g;
}

// ------------------------------------------------------------------ plants

const Y = new THREE.Vector3(0, 1, 0);
const Z = new THREE.Vector3(0, 0, 1);

function leafSet(count: number, color: string) {
  const mesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, 10, 8),
    new THREE.MeshStandardMaterial({ color, roughness: 0.55, side: THREE.DoubleSide }),
    count,
  );
  mesh.count = 0;
  const dummy = new THREE.Object3D();
  const q = new THREE.Quaternion();
  const roll = new THREE.Quaternion();
  return {
    mesh,
    add(pos: THREE.Vector3, dir: THREE.Vector3, size: number, r: () => number, width = 0.28) {
      if (mesh.count >= count) return;
      q.setFromUnitVectors(Z, dir.clone().normalize());
      roll.setFromAxisAngle(dir.clone().normalize(), r() * Math.PI * 2);
      dummy.position.copy(pos).addScaledVector(dir.clone().normalize(), size * 0.9);
      dummy.quaternion.copy(roll).multiply(q);
      dummy.scale.set(size * width, size * 0.05, size);
      dummy.updateMatrix();
      mesh.setMatrixAt(mesh.count++, dummy.matrix);
    },
  };
}

function stem(points: THREE.Vector3[], radius: number, color = "#3e7d3a") {
  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.Mesh(
    new THREE.TubeGeometry(curve, 24, radius, 8),
    new THREE.MeshStandardMaterial({ color, roughness: 0.7 }),
  );
}

function flower(spec: ModelSpec) {
  const g = new THREE.Group();
  const r = rng(hash(spec.color));
  const pts = [new THREE.Vector3(0, -1.6, 0), new THREE.Vector3(0.12, -0.5, 0.05), new THREE.Vector3(-0.05, 0.6, 0), new THREE.Vector3(0, 1.3, 0)];
  g.add(stem(pts, 0.05));
  const leaves = leafSet(20, "#3f8a3f");
  for (let i = 0; i < 6; i++) {
    const a = r() * Math.PI * 2;
    leaves.add(new THREE.Vector3(0.05, -1.2 + i * 0.3, 0), new THREE.Vector3(Math.cos(a), 0.55, Math.sin(a)), 0.5, r, 0.22);
  }
  g.add(leaves.mesh);
  const head = new THREE.Group();
  head.position.set(0, 1.3, 0);
  const n = spec.petals ?? 12;
  const petalMat = new THREE.MeshStandardMaterial({ color: spec.color, roughness: 0.45, side: THREE.DoubleSide });
  for (let layer = 0; layer < 2; layer++) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + layer * (Math.PI / n);
      const p = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), petalMat);
      p.scale.set(0.11, 0.025, 0.5 - layer * 0.07);
      const dir = new THREE.Vector3(Math.cos(a), 0.18 + layer * 0.15, Math.sin(a)).normalize();
      p.position.copy(dir).multiplyScalar(0.5 - layer * 0.05);
      p.quaternion.setFromUnitVectors(Z, dir);
      head.add(p);
    }
  }
  const center = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 16), new THREE.MeshStandardMaterial({ color: spec.color2 ?? "#f2c200", roughness: 0.8 }));
  center.scale.y = 0.75;
  center.position.y = 0.04;
  head.add(center);
  head.rotation.x = -0.35;
  g.add(head);
  g.position.y = 0;
  return g;
}

function herb(spec: ModelSpec) {
  const g = new THREE.Group();
  const r = rng(hash(spec.color));
  const leaves = leafSet(520, spec.color);
  const bark = "#3e6b34";
  function branch(start: THREE.Vector3, dir: THREE.Vector3, len: number, depth: number) {
    const mid = start.clone().addScaledVector(dir, len * 0.5).add(new THREE.Vector3((r() - 0.5) * 0.1, 0, (r() - 0.5) * 0.1));
    const end = start.clone().addScaledVector(dir, len);
    g.add(stem([start, mid, end], 0.028 * (depth + 1) * 0.6 + 0.01, bark));
    const pairs = 3 + depth;
    for (let i = 1; i <= pairs; i++) {
      const p = start.clone().lerp(end, i / (pairs + 0.5));
      for (const s of [-1, 1]) {
        const side = new THREE.Vector3(-dir.z, 0, dir.x).normalize().multiplyScalar(s);
        if (side.lengthSq() < 0.01) side.set(s, 0, 0);
        leaves.add(p, dir.clone().multiplyScalar(0.55).add(side).add(new THREE.Vector3(0, 0.15, 0)), 0.36 - depth * 0.05, r, 0.42);
      }
    }
    leaves.add(end, dir, 0.3, r, 0.4);
    if (depth > 0) {
      const k = 2;
      for (let i = 0; i < k; i++) {
        const a = (i / k) * Math.PI * 2 + r();
        const nd = dir.clone().add(new THREE.Vector3(Math.cos(a) * 0.7, 0.1, Math.sin(a) * 0.7)).normalize();
        branch(end.clone(), nd, len * 0.62, depth - 1);
      }
    }
  }
  branch(new THREE.Vector3(0, -1.6, 0), new THREE.Vector3(0, 1, 0), 1.5, 2);
  g.add(leaves.mesh);
  return g;
}

function lavender(spec: ModelSpec) {
  const g = new THREE.Group();
  const r = rng(21);
  const blossom = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshStandardMaterial({ color: spec.color, roughness: 0.5 }), 900);
  blossom.count = 0;
  const leaves = leafSet(160, "#6c8f64");
  const d = new THREE.Object3D();
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + r() * 0.4;
    const lean = 0.12 + r() * 0.2;
    const base = new THREE.Vector3(Math.cos(a) * 0.08, -1.6, Math.sin(a) * 0.08);
    const tip = new THREE.Vector3(Math.cos(a) * lean * 1.6, 0.9 + r() * 0.5, Math.sin(a) * lean * 1.6);
    const mid = base.clone().lerp(tip, 0.5).add(new THREE.Vector3(Math.cos(a) * lean * 0.5, 0, Math.sin(a) * lean * 0.5));
    g.add(stem([base, mid, tip], 0.018, "#7da06f"));
    for (let k = 0; k < 4; k++) leaves.add(base.clone().lerp(tip, 0.1 + k * 0.1), new THREE.Vector3(Math.cos(a + 0.6), 0.9, Math.sin(a + 0.6)), 0.5, r, 0.05);
    // flower spike: whorls of small blossoms along the upper stem
    for (let w = 0; w < 9; w++) {
      const p = base.clone().lerp(tip, 0.62 + w * 0.045);
      p.x += Math.cos(a) * lean * 0.1;
      for (let j = 0; j < 8 && blossom.count < 900; j++) {
        const b = r() * Math.PI * 2;
        d.position.set(p.x + Math.cos(b) * 0.07, p.y + (r() - 0.5) * 0.03, p.z + Math.sin(b) * 0.07);
        d.scale.setScalar(0.8 + r() * 0.6);
        d.updateMatrix();
        blossom.setMatrixAt(blossom.count++, d.matrix);
      }
    }
  }
  g.add(blossom, leaves.mesh);
  return g;
}

function rhizome(spec: ModelSpec) {
  const g = new THREE.Group();
  const r = rng(3);
  const mat = new THREE.MeshStandardMaterial({ color: spec.color, roughness: 0.85 });
  const ring = new THREE.MeshStandardMaterial({ color: "#a98649", roughness: 0.9 });
  const seg: [number, number, number, number, number][] = [[-1.4, -0.5, 0, 0.5, 0.35], [-0.7, -0.35, 0.1, 0.6, 0.4], [0, -0.3, 0, 0.62, 0.42], [0.75, -0.4, -0.1, 0.55, 0.36], [1.4, -0.55, 0.05, 0.45, 0.3]];
  for (const [x, y, z, sx, sy] of seg) {
    const m = new THREE.Mesh(displaced(new THREE.SphereGeometry(1, 28, 20), 0.07, 5, Math.floor(r() * 100)), mat);
    m.scale.set(sx, sy, sy * 0.95);
    m.position.set(x, y, z);
    g.add(m);
    const t = new THREE.Mesh(new THREE.TorusGeometry(sy * 0.92, 0.012, 6, 28), ring);
    t.rotation.y = Math.PI / 2;
    t.position.set(x + sx * 0.4, y, z);
    t.scale.set(1, 1, 1);
    g.add(t);
  }
  const knob = new THREE.Mesh(displaced(new THREE.SphereGeometry(1, 20, 14), 0.06, 5, 8), mat);
  knob.scale.set(0.32, 0.4, 0.3);
  knob.position.set(-0.3, 0.05, 0.1);
  g.add(knob);
  // green shoots
  const leaves = leafSet(14, "#5e9b48");
  for (let i = 0; i < 2; i++) {
    const x = -0.5 + i * 1.1;
    g.add(stem([new THREE.Vector3(x, -0.1, 0), new THREE.Vector3(x + 0.05, 0.7, 0), new THREE.Vector3(x + 0.1, 1.5, 0.05)], 0.035, "#6aa650"));
    for (let k = 0; k < 6; k++) leaves.add(new THREE.Vector3(x + 0.05, 0.2 + k * 0.22, 0), new THREE.Vector3(k % 2 ? 1 : -1, 0.7, 0.1), 0.6, r, 0.12);
  }
  g.add(leaves.mesh);
  g.position.y = -0.2;
  return g;
}

function willow(spec: ModelSpec) {
  const g = new THREE.Group();
  const r = rng(13);
  const leaves = leafSet(1600, spec.color);
  const bark = "#5b4a38";
  g.add(stem([new THREE.Vector3(0, -1.7, 0), new THREE.Vector3(0.1, -0.7, 0), new THREE.Vector3(-0.05, 0.1, 0.05)], 0.16, bark));
  const crown: THREE.Vector3[] = [];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const end = new THREE.Vector3(Math.cos(a) * 1.0, 0.8 + r() * 0.3, Math.sin(a) * 1.0);
    g.add(stem([new THREE.Vector3(0, 0.1, 0), new THREE.Vector3(Math.cos(a) * 0.4, 0.6, Math.sin(a) * 0.4), end], 0.05, bark));
    crown.push(end);
  }
  for (const c of crown) {
    for (let s = 0; s < 9; s++) {
      const a = r() * Math.PI * 2;
      const o = c.clone().add(new THREE.Vector3(Math.cos(a) * 0.35, 0, Math.sin(a) * 0.35));
      const len = 1.3 + r() * 1.0;
      const pts = [o.clone(), o.clone().add(new THREE.Vector3(Math.cos(a) * 0.25, -len * 0.4, Math.sin(a) * 0.25)), o.clone().add(new THREE.Vector3(Math.cos(a) * 0.3, -len, Math.sin(a) * 0.3))];
      g.add(stem(pts, 0.008, "#7a8a50"));
      for (let k = 0; k < 16; k++) {
        const p = new THREE.Vector3().lerpVectors(pts[0], pts[2], k / 16);
        leaves.add(p, new THREE.Vector3((r() - 0.5) * 0.8, -0.6, (r() - 0.5) * 0.8), 0.2, r, 0.18);
      }
    }
  }
  g.add(leaves.mesh);
  g.scale.setScalar(0.95);
  return g;
}

function nut(spec: ModelSpec) {
  const g = new THREE.Group();
  const geo = displaced(new THREE.IcosahedronGeometry(1.25, 6), 0.1, 6.5, 17);
  const mat = new THREE.MeshStandardMaterial({ color: spec.color, roughness: 0.85, bumpScale: 1 });
  const m = new THREE.Mesh(geo, mat);
  m.scale.set(1, 1.08, 0.92);
  g.add(m);
  // seam between the two shell halves
  const seam = new THREE.Mesh(new THREE.TorusGeometry(1.27, 0.022, 8, 80), new THREE.MeshStandardMaterial({ color: "#5a4426", roughness: 1 }));
  seam.rotation.y = Math.PI / 2;
  seam.scale.set(1, 1.08, 1);
  g.add(seam);
  return g;
}

function carrot(spec: ModelSpec) {
  const g = new THREE.Group();
  const root = new THREE.Mesh(
    displaced(new THREE.ConeGeometry(0.55, 3, 40, 24), 0.018, 18, 4),
    new THREE.MeshStandardMaterial({ color: spec.color, roughness: 0.65 }),
  );
  root.rotation.x = Math.PI;
  root.position.y = -0.1;
  g.add(root);
  const ringMat = new THREE.MeshStandardMaterial({ color: "#c95f10", roughness: 0.8 });
  for (let i = 0; i < 9; i++) {
    const t = i / 9;
    const rr = 0.55 * (1 - t) * 0.98;
    if (rr < 0.05) continue;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(rr, 0.01, 6, 36), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.4 - t * 3 - 0.1;
    g.add(ring);
  }
  const r = rng(2);
  const leaves = leafSet(260, "#4fa343");
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const base = new THREE.Vector3(Math.cos(a) * 0.1, 1.38, Math.sin(a) * 0.1);
    const tip = new THREE.Vector3(Math.cos(a) * 0.55, 2.4 + r() * 0.3, Math.sin(a) * 0.55);
    g.add(stem([base, base.clone().lerp(tip, 0.5).add(new THREE.Vector3(0, 0.1, 0)), tip], 0.02, "#4f9040"));
    for (let k = 0; k < 14; k++) {
      const p = base.clone().lerp(tip, 0.3 + k * 0.05);
      leaves.add(p, new THREE.Vector3(Math.cos(a + (k % 2 ? 0.9 : -0.9)), 0.5, Math.sin(a + (k % 2 ? 0.9 : -0.9))), 0.28, r, 0.2);
    }
  }
  g.add(leaves.mesh);
  g.position.y = -0.4;
  return g;
}

function fruit(spec: ModelSpec) {
  const g = new THREE.Group();
  const tomato = spec.shape === "tomato";
  const geo = new THREE.SphereGeometry(1.25, 64, 48);
  const p = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = v.clone().normalize();
    // dimple at the stem end; tomato is flatter, apple slightly shouldered
    const top = Math.max(0, n.y - 0.55) / 0.45;
    v.y -= top * top * 0.42;
    if (!tomato) v.multiplyScalar(1 + 0.06 * Math.cos(n.y * 3));
    if (tomato) v.y *= 0.82;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  g.add(new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: spec.color, roughness: tomato ? 0.28 : 0.4, clearcoat: 0.6, clearcoatRoughness: 0.2, envMapIntensity: 1.1 })));
  const green = new THREE.MeshStandardMaterial({ color: "#3f7d2f", roughness: 0.7, side: THREE.DoubleSide });
  if (tomato) {
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const sep = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.7, 6), green);
      sep.position.set(Math.cos(a) * 0.32, 0.92, Math.sin(a) * 0.32);
      sep.rotation.set(Math.sin(a) * 1.15, 0, -Math.cos(a) * 1.15);
      g.add(sep);
    }
    g.add(stem([new THREE.Vector3(0, 0.85, 0), new THREE.Vector3(0.05, 1.2, 0), new THREE.Vector3(0.18, 1.45, 0)], 0.03, "#3f7d2f"));
  } else {
    g.add(stem([new THREE.Vector3(0, 0.55, 0), new THREE.Vector3(0.05, 1.1, 0), new THREE.Vector3(0.2, 1.55, 0)], 0.04, "#5a3f2a"));
    const leaves = leafSet(3, "#3f8a2f");
    leaves.add(new THREE.Vector3(0.12, 1.3, 0), new THREE.Vector3(1, 0.35, 0.3), 0.8, rng(1), 0.45);
    g.add(leaves.mesh);
  }
  return g;
}

export function buildModel(spec: ModelSpec): THREE.Group {
  const c = spec.color;
  switch (spec.kind) {
    case "quartz": return quartzCluster(c);
    case "fluorite": return fluorite(c, spec.color2 ?? "#a27be6");
    case "pyrite": return pyrite(c);
    case "garnet": return garnet(c);
    case "tourmaline": return tourmaline(c);
    case "malachite": return malachite(c);
    case "lapis": return lapis(c, spec.color2 ?? "#d4af37");
    case "obsidian": return obsidian(c);
    case "flower": return flower(spec);
    case "herb": return herb(spec);
    case "lavender": return lavender(spec);
    case "rhizome": return rhizome(spec);
    case "willow": return willow(spec);
    case "nut": return nut(spec);
    case "carrot": return carrot(spec);
    case "fruit": return fruit(spec);
  }
}

export function disposeObject(o: THREE.Object3D) {
  o.traverse((n) => {
    const m = n as THREE.Mesh;
    m.geometry?.dispose?.();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
    else mat?.dispose?.();
  });
}
