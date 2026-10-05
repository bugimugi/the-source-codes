import * as THREE from "three";
import { claims } from "../data/claims";
import type { Claim } from "../data/types";
import { LEVEL_LABEL, type EvidenceLevel } from "../data/types";

const COLORS: Record<EvidenceLevel, number> = {
  established: 0x6ee7a8,
  supported: 0x9bd16b,
  hypothesis: 0xf2c76b,
  historical: 0x8fb7ff,
  unsupported: 0xff9f6b,
  refuted: 0xff6b7d,
};

/** Small 3D force layout: repulsion between all nodes, springs along edges, weak pull to center. */
function layout(ids: string[], edges: [number, number][]) {
  const n = ids.length;
  const pos = ids.map((_, i) => {
    const a = (i / n) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a), (Math.random() - 0.5) * 1.2, Math.sin(a)).multiplyScalar(2);
  });
  for (let it = 0; it < 400; it++) {
    const f = pos.map(() => new THREE.Vector3());
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++) {
        const d = pos[i].clone().sub(pos[j]);
        const l2 = Math.max(d.lengthSq(), 0.05);
        d.multiplyScalar(0.35 / l2);
        f[i].add(d);
        f[j].sub(d);
      }
    for (const [a, b] of edges) {
      const d = pos[b].clone().sub(pos[a]);
      const pull = d.multiplyScalar((d.length() - 1.6) * 0.04 / Math.max(d.length(), 1e-3));
      f[a].add(pull);
      f[b].sub(pull);
    }
    pos.forEach((p, i) => p.add(f[i].addScaledVector(p, -0.12).multiplyScalar(0.5)));
  }
  return pos;
}

export function initMatrix(
  canvas: HTMLCanvasElement,
  labelsRoot: HTMLElement,
  onSelect: (claimId: string) => void,
) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 9;
  const root = new THREE.Group();
  scene.add(root);

  const ids = claims.map((c) => c.id);
  const index = new Map(ids.map((id, i) => [id, i]));
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  for (const c of claims)
    for (const r of c.related ?? []) {
      const key = [c.id, r].sort().join("|");
      if (seen.has(key) || !index.has(r)) continue;
      seen.add(key);
      edges.push([index.get(c.id)!, index.get(r)!]);
    }

  const pos = layout(ids, edges);
  const nodes: THREE.Mesh[] = [];
  const labels: HTMLElement[] = [];

  claims.forEach((c, i) => {
    const color = COLORS[c.level];
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 24, 24),
      new THREE.MeshBasicMaterial({ color }),
    );
    mesh.position.copy(pos[i]);
    mesh.userData.id = c.id;
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 24, 24),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.14, depthWrite: false }),
    );
    mesh.add(halo);
    root.add(mesh);
    nodes.push(mesh);

    const label = document.createElement("button");
    label.className = "node-label";
    label.style.setProperty("--c", `#${color.toString(16).padStart(6, "0")}`);
    label.textContent = c.statement.length > 54 ? `${c.statement.slice(0, 52)}…` : c.statement;
    label.title = LEVEL_LABEL[c.level];
    label.addEventListener("click", () => onSelect(c.id));
    labelsRoot.append(label);
    labels.push(label);
  });

  const lineGeo = new THREE.BufferGeometry().setFromPoints(edges.flatMap(([a, b]) => [pos[a], pos[b]]));
  root.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0x7fe3d0, transparent: true, opacity: 0.35 })));

  // ambient dust for depth
  const dust = new Float32Array(1500 * 3).map(() => (Math.random() - 0.5) * 22);
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ size: 0.02, color: 0x7fe3d0, transparent: true, opacity: 0.4 })));

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w < 700 ? 12 : 9;
    camera.updateProjectionMatrix();
  }

  // drag to rotate, click to select
  let dragging = false, moved = 0, vx = 0, vy = 0, lx = 0, ly = 0;
  canvas.addEventListener("pointerdown", (e) => {
    dragging = true; moved = 0; lx = e.clientX; ly = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lx, dy = e.clientY - ly;
    lx = e.clientX; ly = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
    vx = dx * 0.005; vy = dy * 0.005;
  });
  const ray = new THREE.Raycaster();
  canvas.addEventListener("pointerup", (e) => {
    dragging = false;
    if (moved > 5) return;
    const r = canvas.getBoundingClientRect();
    ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
    const hit = ray.intersectObjects(nodes, false)[0];
    if (hit) onSelect(hit.object.userData.id);
  });

  let visible: boolean[] = claims.map(() => true);
  const v = new THREE.Vector3();
  const frame = () => {
    if (!dragging) { vx *= 0.95; vy *= 0.95; vx += 0.0004 * (Math.abs(vx) < 0.0004 ? 1 : 0); }
    root.rotation.y += vx;
    root.rotation.x = THREE.MathUtils.clamp(root.rotation.x + vy, -1.1, 1.1);
    renderer.render(scene, camera);
    root.updateMatrixWorld();
    nodes.forEach((m, i) => {
      v.setFromMatrixPosition(m.matrixWorld).project(camera);
      labels[i].style.transform = `translate(${((v.x + 1) / 2) * canvas.clientWidth}px, ${((1 - v.y) / 2) * canvas.clientHeight}px) translate(-50%, 22px)`;
      const depth = THREE.MathUtils.clamp(1.4 - v.z * 0.9, 0.25, 1);
      labels[i].style.opacity = String(visible[i] ? depth : 0.08);
      labels[i].style.pointerEvents = visible[i] ? "auto" : "none";
    });
  };

  addEventListener("resize", resize);
  return {
    /** Dim every node that does not match; edges stay for context. */
    setFilter(match: (c: Claim) => boolean) {
      visible = claims.map(match);
      nodes.forEach((m, i) => {
        m.scale.setScalar(visible[i] ? 1 : 0.45);
        (m.material as THREE.MeshBasicMaterial).opacity = visible[i] ? 1 : 0.25;
        (m.material as THREE.MeshBasicMaterial).transparent = true;
        m.children[0].visible = visible[i];
      });
    },
    start() { resize(); renderer.setAnimationLoop(frame); },
    stop() { renderer.setAnimationLoop(null); },
  };
}
