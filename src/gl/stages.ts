import * as THREE from "three";
import gsap from "gsap";
import { atlas } from "../data/atlas";
import { buildModel, dot, glowTexture, hash, rng } from "./models";
import type { Area, Claim } from "../data/types";

/**
 * One themed 3D stage per knowledge area. Each stage is a small procedural scene
 * (no external assets) that can expose a caption and optional controls.
 */
export interface StageScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  caption: string;
  controls?: HTMLElement;
  update(t: number, dt: number, pointer: THREE.Vector2): void;
  dispose(): void;
}

export interface StageContext {
  env: THREE.Texture;
  reduceMotion: boolean;
}

const cam = (z = 7, y = 1.2) => {
  const c = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  c.position.set(0, y, z);
  c.lookAt(0, 0, 0);
  return c;
};

function starfield(count = 1600, radius = 40) {
  const r = rng(99);
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const v = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize().multiplyScalar(radius * (0.6 + r() * 0.5));
    pos.set([v.x, v.y, v.z], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ map: dot(), alphaTest: 0.04,  color: 0x9fb4ff, size: 0.08, transparent: true, opacity: 0.7, depthWrite: false }));
}

function sprite(color: number, scale: number, opacity = 0.7) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color, blending: THREE.AdditiveBlending, transparent: true, opacity, depthWrite: false }));
  s.scale.setScalar(scale);
  return s;
}

function dispose(scene: THREE.Scene) {
  scene.traverse((n) => {
    const m = n as THREE.Mesh;
    m.geometry?.dispose?.();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
    else mat?.dispose?.();
  });
}

function baseScene(ctx: StageContext, bg = 0x04050a) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(bg);
  scene.environment = ctx.env;
  scene.add(starfield());
  return scene;
}

// ---------------------------------------------------------------- biophysik: membrane field

function membraneStage(ctx: StageContext): StageScene {
  const scene = baseScene(ctx, 0x03070b);
  const camera = cam(14, 5.5);
  camera.lookAt(0, 0, 0);
  const COLS = 38, ROWS = 16, GAP = 0.4;
  const heads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.15, 8, 6), new THREE.MeshStandardMaterial({ color: 0xffb27a, roughness: 0.45, emissive: 0x401a08 }), COLS * ROWS * 2);
  scene.add(heads);
  const tails: number[] = [];
  const base: { x: number; z: number; y: number }[] = [];
  const channels = [-4.2, -1.4, 1.6, 4.4];
  let idx = 0;
  for (let c = 0; c < COLS; c++)
    for (let r = 0; r < ROWS; r++) {
      const x = (c - COLS / 2) * GAP, z = (r - ROWS / 2) * GAP;
      const skip = channels.some((cx) => Math.hypot(x - cx, z) < 0.55);
      for (const s of [1, -1]) {
        base.push({ x, z, y: s * 0.55 });
        if (!skip) tails.push(x, s * 0.5, z, x, s * 0.08, z);
        idx++;
      }
    }
  const tg = new THREE.BufferGeometry();
  tg.setAttribute("position", new THREE.Float32BufferAttribute(tails, 3));
  scene.add(new THREE.LineSegments(tg, new THREE.LineBasicMaterial({ color: 0xd9894a, transparent: true, opacity: 0.35 })));
  // channel proteins as glowing rings
  for (const cx of channels) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.07, 10, 28), new THREE.MeshStandardMaterial({ color: 0x5be3d1, emissive: 0x1f7e72, roughness: 0.3 }));
    ring.rotation.x = Math.PI / 2;
    ring.position.set(cx, 0, 0);
    scene.add(ring);
  }
  // ions: sodium (outside, above) and potassium (inside, below)
  const N = 520;
  const ions = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ map: dot(), alphaTest: 0.04,  size: 0.12, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  const ip = new Float32Array(N * 3), ic = new Float32Array(N * 3), seedA = new Float32Array(N);
  const r = rng(5);
  for (let i = 0; i < N; i++) {
    const up = i % 2 === 0;
    ip.set([(r() - 0.5) * 15, (up ? 1 : -1) * (0.9 + r() * 2.6), (r() - 0.5) * 6.5], i * 3);
    (up ? new THREE.Color(0x6fd8ff) : new THREE.Color(0xffd36b)).toArray(ic, i * 3);
    seedA[i] = r() * 100;
  }
  ions.geometry.setAttribute("position", new THREE.BufferAttribute(ip, 3));
  ions.geometry.setAttribute("color", new THREE.BufferAttribute(ic, 3));
  scene.add(ions);
  const dummy = new THREE.Object3D();
  const caption = "Schematisch, nicht maßstäblich · Lipid-Doppelschicht mit Ionenkanälen · Ruhepotenzial typischer Nervenzellen ≈ −70 mV (je nach Zelltyp etwa −40 bis −90 mV)";
  return {
    scene, camera, caption,
    update(t) {
      for (let i = 0; i < base.length; i++) {
        const b = base[i];
        // a travelling wave stands for an electrical signal moving along the membrane
        const wave = Math.exp(-Math.pow((b.x - ((t * 2.2) % 18 - 9)), 2) * 0.35);
        dummy.position.set(b.x, b.y + Math.sin(t * 1.4 + b.x * 0.9 + b.z) * 0.02 + Math.sign(b.y) * wave * 0.12, b.z);
        dummy.scale.setScalar(1 + wave * 0.35);
        dummy.updateMatrix();
        heads.setMatrixAt(i, dummy.matrix);
      }
      heads.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < N; i++) {
        const k = i * 3;
        const s = seedA[i];
        ip[k] += Math.sin(t * 0.8 + s) * 0.004;
        ip[k + 2] += Math.cos(t * 0.7 + s * 1.3) * 0.004;
        const cx = channels[i % channels.length];
        // every few ions pass through a channel
        if (i % 9 === 0) {
          const ph = (t * 0.25 + s) % 1;
          const dir = i % 2 === 0 ? 1 : -1;
          ip[k] = cx + Math.sin(s) * 0.15;
          ip[k + 2] = Math.cos(s) * 0.15;
          ip[k + 1] = dir * (2.4 - ph * 4.8);
        }
      }
      ions.geometry.attributes.position.needsUpdate = true;
      scene.rotation.y = Math.sin(t * 0.12) * 0.25;
    },
    dispose: () => dispose(scene),
  };
}

// ---------------------------------------------------------------- akustik: Chladni plate

function chladniStage(ctx: StageContext, claim: Claim): StageScene {
  const scene = baseScene(ctx, 0x04060d);
  const camera = cam(6.3, 5.4);
  camera.lookAt(0, 0, 0);
  const modes: [number, number][] = [[1, 2], [1, 3], [2, 3], [2, 4], [3, 4], [3, 5], [4, 5], [4, 6], [5, 6]];
  const state = { m: 2, n: 3 };
  const uniforms = { uM: { value: state.m }, uN: { value: state.n }, uTime: { value: 0 } };
  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(4.4, 4.4, 1, 1),
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
      fragmentShader: `varying vec2 vUv; uniform float uM,uN,uTime;
        void main(){
          float PI=3.14159265;
          float f=cos(uN*PI*vUv.x)*cos(uM*PI*vUv.y)-cos(uM*PI*vUv.x)*cos(uN*PI*vUv.y);
          float line=1.0-smoothstep(0.0,0.14,abs(f));
          vec3 base=mix(vec3(0.04,0.07,0.16),vec3(0.08,0.14,0.3),0.5+0.5*f);
          vec3 col=base+vec3(0.55,0.75,1.0)*line*0.65;
          vec2 e=min(vUv,1.0-vUv); float edge=1.0-smoothstep(0.0,0.012,min(e.x,e.y));
          col+=vec3(0.5,0.7,1.0)*edge*0.5;
          gl_FragColor=vec4(col,1.0);
        }`,
    }),
  );
  plate.rotation.x = -Math.PI / 2;
  scene.add(plate);
  // sand: particles drift toward the nodal lines where the plate does not move
  const N = 26000;
  const pos = new Float32Array(N * 3), uv = new Float32Array(N * 2);
  const r = rng(hash(claim.id));
  for (let i = 0; i < N; i++) { uv[i * 2] = r(); uv[i * 2 + 1] = r(); }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const sand = new THREE.Points(sg, new THREE.PointsMaterial({ map: dot(), alphaTest: 0.04,  color: 0xffe9b8, size: 0.022, transparent: true, opacity: 0.9, depthWrite: false }));
  scene.add(sand);
  const f = (x: number, y: number) => Math.cos(state.n * Math.PI * x) * Math.cos(state.m * Math.PI * y) - Math.cos(state.m * Math.PI * x) * Math.cos(state.n * Math.PI * y);
  const caption = "Chladni-Figuren (E. Chladni, 1787): Sand sammelt sich auf den ruhenden Knotenlinien einer schwingenden Platte. Die Muster hängen von der Schwingungsmode ab.";
  const controls = document.createElement("div");
  controls.className = "stage-controls";
  controls.innerHTML = `<label>Schwingungsmode <output></output><input type="range" min="0" max="${modes.length - 1}" step="1" value="2" aria-label="Schwingungsmode"></label>`;
  const out = controls.querySelector("output")!;
  const range = controls.querySelector("input")!;
  const apply = (i: number) => {
    const [m, n] = modes[i];
    out.textContent = ` (m, n) = (${m}, ${n})`;
    gsap.to(state, { m, n, duration: ctx.reduceMotion ? 0 : 1.2, ease: "power2.inOut", onUpdate() { uniforms.uM.value = state.m; uniforms.uN.value = state.n; } });
  };
  range.addEventListener("input", () => apply(+range.value));
  apply(2);
  return {
    scene, camera, caption, controls,
    update(t) {
      for (let i = 0; i < N; i++) {
        let x = uv[i * 2], y = uv[i * 2 + 1];
        const v = f(x, y);
        // move against the gradient of f^2 and jitter in proportion to |f|: sand settles where f is ~0
        const e = 0.002;
        const gx = (f(x + e, y) - v) / e, gy = (f(x, y + e) - v) / e;
        const a = Math.abs(v);
        x += -v * gx * 0.0009 + (r() - 0.5) * a * 0.012;
        y += -v * gy * 0.0009 + (r() - 0.5) * a * 0.012;
        if (x < 0 || x > 1) x = Math.min(1, Math.max(0, x));
        if (y < 0 || y > 1) y = Math.min(1, Math.max(0, y));
        uv[i * 2] = x; uv[i * 2 + 1] = y;
        pos[i * 3] = (x - 0.5) * 4.4;
        pos[i * 3 + 1] = 0.02 + a * 0.003;
        pos[i * 3 + 2] = (y - 0.5) * 4.4;
      }
      sg.attributes.position.needsUpdate = true;
      uniforms.uTime.value = t;
      scene.rotation.y = Math.sin(t * 0.15) * 0.18;
    },
    dispose: () => dispose(scene),
  };
}

// ---------------------------------------------------------------- kristalle: gem on a pedestal

function crystalStage(ctx: StageContext, claim: Claim): StageScene {
  const scene = baseScene(ctx, 0x06040c);
  const camera = cam(6.2, 1.4);
  const m = claim.id.match(/^crystal-(.+)-effects$/);
  const entry = atlas.find((e) => e.id === m?.[1]) ?? atlas.find((e) => e.category === "kristall")!;
  const model = buildModel(entry.model);
  const holder = new THREE.Group();
  holder.add(model);
  scene.add(holder);
  const tint = new THREE.Color(entry.model.color);
  const l1 = new THREE.PointLight(tint.clone().lerp(new THREE.Color(0xffffff), 0.4), 30, 20);
  l1.position.set(3, 3, 3);
  const l2 = new THREE.PointLight(0x7fa8ff, 18, 20);
  l2.position.set(-4, 1, -2);
  scene.add(l1, l2, new THREE.AmbientLight(0xffffff, 0.15));
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.2, 0.2, 64), new THREE.MeshStandardMaterial({ color: 0x15131c, metalness: 0.7, roughness: 0.25 }));
  pedestal.position.y = -1.75;
  scene.add(pedestal);
  const halo = sprite(tint.getHex(), 7, 0.35);
  halo.position.set(0, 0, -1.5);
  scene.add(halo);
  // sparkles
  const r = rng(hash(claim.id));
  const sp = new Float32Array(240 * 3);
  for (let i = 0; i < 240; i++) {
    const v = new THREE.Vector3(r() - 0.5, r() - 0.3, r() - 0.5).normalize().multiplyScalar(2.2 + r() * 2.2);
    sp.set([v.x, v.y, v.z], i * 3);
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  const sparkles = new THREE.Points(sg, new THREE.PointsMaterial({ map: dot(), alphaTest: 0.04,  color: 0xffffff, size: 0.05, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(sparkles);
  const facts = entry.facts.slice(0, 3).map((f) => `${f.label}: ${f.value}`).join(" · ");
  return {
    scene, camera,
    caption: `${entry.name} – ${facts}`,
    update(t, _dt, pointer) {
      holder.rotation.y = t * 0.35 + pointer.x * 0.6;
      holder.rotation.x = pointer.y * 0.25;
      holder.position.y = Math.sin(t * 0.9) * 0.06;
      sparkles.rotation.y = -t * 0.08;
      (sparkles.material as THREE.PointsMaterial).opacity = 0.55 + 0.35 * Math.sin(t * 2);
    },
    dispose: () => dispose(scene),
  };
}

// ---------------------------------------------------------------- pflanzen: growing plant

function plantStage(ctx: StageContext, claim: Claim): StageScene {
  const scene = baseScene(ctx, 0x030a06);
  const camera = cam(6.2, 1.1);
  const id = claim.id.includes("willow") ? "weide" : claim.id.includes("signature") ? "karotte" : claim.id.includes("kamille") ? "kamille" : claim.id.match(/^(.+?)-traditional-use$/)?.[1] ?? "kamille";
  const entry = atlas.find((e) => e.id === id) ?? atlas.find((e) => e.id === "kamille")!;
  const plant = buildModel(entry.model);
  const holder = new THREE.Group();
  holder.add(plant);
  scene.add(holder);
  scene.add(new THREE.AmbientLight(0xbfe8c0, 0.7));
  const sun = new THREE.DirectionalLight(0xfff2d0, 2.4);
  sun.position.set(3, 5, 4);
  scene.add(sun);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(2.6, 64), new THREE.MeshStandardMaterial({ color: 0x14231a, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2.2;
  scene.add(ground);
  const glow = sprite(0x7fe36b, 7, 0.22);
  glow.position.set(0, 0, -2);
  scene.add(glow);
  // pollen / spores drifting upwards
  const N = 360, p = new Float32Array(N * 3), r = rng(hash(claim.id));
  for (let i = 0; i < N; i++) p.set([(r() - 0.5) * 6, -2 + r() * 5, (r() - 0.5) * 4], i * 3);
  const pg = new THREE.BufferGeometry();
  pg.setAttribute("position", new THREE.BufferAttribute(p, 3));
  scene.add(new THREE.Points(pg, new THREE.PointsMaterial({ map: dot(), alphaTest: 0.04,  color: 0xf2f7a0, size: 0.04, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false })));
  const grow = { v: ctx.reduceMotion ? 1 : 0 };
  if (!ctx.reduceMotion) gsap.to(grow, { v: 1, duration: 3.2, ease: "power2.out" });
  const facts = entry.facts.slice(0, 2).map((f) => `${f.label}: ${f.value}`).join(" · ");
  return {
    scene, camera,
    caption: `${entry.name} (${entry.latin}) – ${facts}`,
    update(t, _dt, pointer) {
      const s = Math.max(0.001, grow.v);
      plant.scale.setScalar(s);
      plant.position.y = -2.1 * (1 - s) * 0 - 0.0;
      holder.rotation.y = t * 0.22 + pointer.x * 0.5;
      for (let i = 0; i < N; i++) {
        p[i * 3 + 1] += 0.004 + (i % 5) * 0.0007;
        p[i * 3] += Math.sin(t + i) * 0.0012;
        if (p[i * 3 + 1] > 3.2) p[i * 3 + 1] = -2.2;
      }
      pg.attributes.position.needsUpdate = true;
    },
    dispose: () => dispose(scene),
  };
}

// ---------------------------------------------------------------- ernährung & umwelt: Bohr atom

function atomStage(ctx: StageContext, claim: Claim): StageScene {
  const scene = baseScene(ctx, 0x0a0603);
  const camera = cam(8, 2);
  // fluoride claims show fluorine (Z=9, 10 neutrons, shells 2/7); everything else carbon-12 (shells 2/4)
  const fluor = claim.id.includes("fluoride");
  const Z = fluor ? 9 : 6, Nn = fluor ? 10 : 6, shells = fluor ? [2, 7] : [2, 4];
  const nucleus = new THREE.Group();
  const r = rng(hash(claim.id));
  const pm = new THREE.MeshStandardMaterial({ color: 0xff5a4a, roughness: 0.4, emissive: 0x4a0f08 });
  const nm = new THREE.MeshStandardMaterial({ color: 0x9fb0c8, roughness: 0.4, emissive: 0x141c28 });
  for (let i = 0; i < Z + Nn; i++) {
    const v = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize().multiplyScalar(0.12 + Math.cbrt(r()) * 0.34);
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 16), i < Z ? pm : nm);
    s.position.copy(v);
    nucleus.add(s);
  }
  scene.add(nucleus);
  scene.add(sprite(0xff8a5a, 3.2, 0.5));
  const electrons: { mesh: THREE.Mesh; radius: number; speed: number; phase: number; tilt: THREE.Euler }[] = [];
  shells.forEach((count, si) => {
    const radius = 1.5 + si * 1.15;
    const orbit = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.008, 6, 128), new THREE.MeshBasicMaterial({ color: 0xffc58a, transparent: true, opacity: 0.4 }));
    orbit.rotation.x = Math.PI / 2;
    const tilt = new THREE.Euler(0.4 + si * 0.5, si * 0.7, 0);
    const og = new THREE.Group();
    og.rotation.copy(tilt);
    og.add(orbit);
    scene.add(og);
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), new THREE.MeshBasicMaterial({ color: 0x6fd8ff }));
      mesh.add(sprite(0x6fd8ff, 0.7, 0.8));
      og.add(mesh);
      electrons.push({ mesh, radius, speed: 0.9 / (si + 1), phase: (i / count) * Math.PI * 2, tilt });
    }
  });
  const label = fluor ? "Fluor-19: 9 Protonen, 10 Neutronen, 9 Elektronen" : "Kohlenstoff-12: 6 Protonen, 6 Neutronen, 6 Elektronen";
  return {
    scene, camera,
    caption: `${label} · Bohr-Modell, stark vereinfacht und nicht maßstäblich · rot: Protonen, grau: Neutronen, blau: Elektronen`,
    update(t, _dt, pointer) {
      for (const e of electrons) {
        const a = e.phase + t * e.speed;
        e.mesh.position.set(Math.cos(a) * e.radius, 0, Math.sin(a) * e.radius);
      }
      nucleus.rotation.y = t * 0.5;
      scene.rotation.y = pointer.x * 0.5 + t * 0.05;
      scene.rotation.x = pointer.y * 0.2;
    },
    dispose: () => dispose(scene),
  };
}

// ---------------------------------------------------------------- medizingeschichte: floating archive

function pageTexture() {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 360;
  const g = c.getContext("2d")!;
  g.fillStyle = "#e9dcc0";
  g.fillRect(0, 0, 256, 360);
  const r = rng(4);
  g.fillStyle = "#6b5a3a";
  for (let y = 40; y < 320; y += 14) {
    const w = 120 + r() * 100;
    g.globalAlpha = 0.55;
    g.fillRect(24, y, w, 3);
  }
  g.globalAlpha = 1;
  g.fillStyle = "#3a2c14";
  g.fillRect(24, 22, 110, 6);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function archiveStage(ctx: StageContext, claim: Claim): StageScene {
  const scene = baseScene(ctx, 0x0a0406);
  const camera = cam(9, 2.5);
  const tex = pageTexture();
  const N = 64;
  const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, side: THREE.DoubleSide, emissive: 0x2a1f0c, emissiveIntensity: 0.35 });
  const pages: { m: THREE.Mesh; a: number; y: number; s: number }[] = [];
  const r = rng(hash(claim.id));
  for (let i = 0; i < N; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.26), mat);
    scene.add(m);
    pages.push({ m, a: (i / N) * Math.PI * 6, y: (i / N) * 7 - 3.5, s: 0.7 + r() * 0.5 });
  }
  const orb = sprite(0xff9a7a, 5, 0.55);
  scene.add(orb);
  scene.add(new THREE.AmbientLight(0xffffff, 0.8), new THREE.PointLight(0xffb08a, 40, 30));
  return {
    scene, camera,
    caption: "Ein Archiv aus schwebenden Seiten: Schriften, Berichte und Gutachten, auf denen die Aussagen dieses Bereichs beruhen.",
    update(t, _dt, pointer) {
      for (const p of pages) {
        const a = p.a + t * 0.18;
        const R = 3.2 + Math.sin(p.y * 1.3 + t * 0.4) * 0.5;
        p.m.position.set(Math.cos(a) * R, p.y + Math.sin(t * 0.6 + p.a) * 0.12, Math.sin(a) * R);
        p.m.rotation.set(Math.sin(t * 0.3 + p.a) * 0.25, -a + Math.PI / 2, Math.cos(t * 0.35 + p.a) * 0.2);
        p.m.scale.setScalar(p.s);
      }
      scene.rotation.y = pointer.x * 0.4;
    },
    dispose: () => dispose(scene),
  };
}

// ---------------------------------------------------------------- texte & tradition: geometric star pattern

function patternStage(ctx: StageContext, claim: Claim): StageScene {
  const scene = baseScene(ctx, 0x0a0803);
  const camera = cam(8.5, 0);
  const rings: THREE.Object3D[] = [];
  const gold = (o = 0.8) => new THREE.LineBasicMaterial({ color: 0xf2d36b, transparent: true, opacity: o, blending: THREE.AdditiveBlending });
  const poly = (n: number, step: number, radius: number, opacity: number) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= n; i++) {
      const a = ((i * step) / n) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
    }
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gold(opacity));
  };
  // layered {8/3}, {8/2} and {16/5} star polygons – the geometry of classical interlaced star patterns
  const spec: [number, number, number, number, number][] = [
    [8, 3, 3.4, 0.9, 0.12], [8, 3, 3.4, 0.9, -0.12], [8, 2, 2.4, 0.7, 0.2], [16, 5, 1.9, 0.6, -0.25], [8, 3, 1.2, 0.8, 0.3], [24, 7, 4.3, 0.35, 0.05],
  ];
  spec.forEach(([n, st, rad, op, speed], i) => {
    const l = poly(n, st, rad, op);
    l.rotation.z = (i % 2) * (Math.PI / n);
    l.userData.speed = speed;
    scene.add(l);
    rings.push(l);
  });
  for (const rad of [1.0, 2.0, 3.0, 4.0]) {
    const c = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.006, 6, 160), new THREE.MeshBasicMaterial({ color: 0xf2d36b, transparent: true, opacity: 0.28 }));
    scene.add(c);
  }
  const r = rng(hash(claim.id));
  const N = 420, p = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const a = r() * Math.PI * 2, rad = 0.4 + r() * 4.2;
    p.set([Math.cos(a) * rad, Math.sin(a) * rad, (r() - 0.5) * 1.2], i * 3);
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute("position", new THREE.BufferAttribute(p, 3));
  const dust = new THREE.Points(pg, new THREE.PointsMaterial({ map: dot(), alphaTest: 0.04,  color: 0xffe9a0, size: 0.04, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(dust);
  scene.add(sprite(0xf2d36b, 6, 0.28));
  return {
    scene, camera,
    caption: "Geometrische Sternmuster (Ornamentik) – eine neutrale Gestaltung zum Thema Schriften und Zahlen; sie ist kein Beleg für eine Aussage.",
    update(t, _dt, pointer) {
      rings.forEach((l) => (l.rotation.z += l.userData.speed * 0.004));
      dust.rotation.z = t * 0.03;
      scene.rotation.x = -pointer.y * 0.35;
      scene.rotation.y = pointer.x * 0.35;
    },
    dispose: () => dispose(scene),
  };
}

// ---------------------------------------------------------------- factory

export function createStage(claim: Claim, ctx: StageContext): StageScene {
  const area: Area = claim.area;
  switch (area) {
    case "biophysik": return membraneStage(ctx);
    case "akustik-architektur": return chladniStage(ctx, claim);
    case "kristalle-mineralien": return crystalStage(ctx, claim);
    case "pflanzenheilkunde": return plantStage(ctx, claim);
    case "ernaehrung-umwelt": return atomStage(ctx, claim);
    case "medizingeschichte": return archiveStage(ctx, claim);
    case "texte-tradition": return patternStage(ctx, claim);
  }
}
