import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { partInfo, type PartInfo } from "../data/bodyparts";

export type BodyLayer = "bones" | "muscles";
export interface PickedPart extends PartInfo { mesh: string }

const FILE: Record<BodyLayer, string> = { bones: "skeleton", muscles: "muscles" };

/**
 * The interactive 3D body: real geometry of bones, discs, ligaments and muscles (BodyParts3D 4.0, CC BY 4.0, simplified in
 * scripts/build-body-models.mjs). Each layer is loaded the first time it is shown. Drag turns the body; zoom, reset and
 * transparency are buttons (the wheel keeps scrolling the page). A click on a part reports its name.
 */
export function initBodyScene(canvas: HTMLCanvasElement, reduceMotion: boolean, onPick: (p: PickedPart | null) => void) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.5 : 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.05, 40);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.minPolarAngle = Math.PI * 0.18;
  controls.maxPolarAngle = Math.PI * 0.82;
  canvas.style.touchAction = "pan-y";

  scene.add(new THREE.HemisphereLight(0xbfd9ff, 0x2a1840, 1.05));
  const key = new THREE.DirectionalLight(0xffffff, 1.9); key.position.set(1.6, 2.6, 2.8); scene.add(key);
  const rim = new THREE.DirectionalLight(0x58d6e8, 1.5); rim.position.set(-2.4, 1.4, -2.6); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffb26b, 0.55); fill.position.set(-1.8, 0.4, 2.2); scene.add(fill);

  const mats = {
    bone: new THREE.MeshStandardMaterial({ color: 0xe9dcc2, roughness: 0.55, metalness: 0, emissive: 0x1a1308 }),
    disc: new THREE.MeshStandardMaterial({ color: 0x7f93b4, roughness: 0.6 }),
    ligament: new THREE.MeshStandardMaterial({ color: 0x5b7be0, roughness: 0.5 }),
    tendon: new THREE.MeshStandardMaterial({ color: 0xe0924a, roughness: 0.5 }),
    muscle: new THREE.MeshStandardMaterial({ color: 0xc23a2c, roughness: 0.62, metalness: 0, emissive: 0x2a0806 }),
    pick: new THREE.MeshStandardMaterial({ color: 0xffe19a, roughness: 0.4, emissive: 0xf0b030, emissiveIntensity: 0.55 }),
  };
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);

  const groups: Partial<Record<BodyLayer, THREE.Group>> = {};
  const loading: Partial<Record<BodyLayer, Promise<void>>> = {};
  const visible: Record<BodyLayer, boolean> = { bones: false, muscles: false };
  let transparent = true, picked: THREE.Mesh | null = null, running = false, homeDist = 4, dist = 4, framed = false;
  const home = new THREE.Vector3();
  const target = new THREE.Vector3(0, 0.9, 0);

  function material(name: string, layer: BodyLayer): THREE.MeshStandardMaterial {
    if (layer === "muscles") return mats.muscle;
    if (/disk|symphysis/.test(name)) return mats.disc;
    if (/ligament|membrane|retinaculum/.test(name)) return mats.ligament;
    if (/tendon/.test(name)) return mats.tendon;
    return mats.bone;
  }
  function applyTransparency() {
    mats.muscle.transparent = transparent;
    mats.muscle.opacity = transparent ? 0.34 : 1;
    mats.muscle.depthWrite = !transparent;
    mats.muscle.needsUpdate = true;
    groups.muscles?.traverse((o) => { o.renderOrder = transparent ? 2 : 0; });
  }

  function frame3D() {
    // frame the whole body once, from the first layer that arrives
    const box = new THREE.Box3();
    for (const g of Object.values(groups)) if (g) box.expandByObject(g);
    if (box.isEmpty()) return;
    const size = box.getSize(new THREE.Vector3()), centre = box.getCenter(new THREE.Vector3());
    target.copy(centre);
    homeDist = (Math.max(size.y, size.x * 1.4) / 2 / Math.tan((camera.fov * Math.PI) / 360)) * 1.12;
    dist = homeDist;
    home.set(0.25, centre.y + size.y * 0.04, centre.z + homeDist).sub(centre).setLength(homeDist).add(centre);
    camera.position.copy(home);
    controls.target.copy(centre);
    controls.minDistance = homeDist * 0.28;
    controls.maxDistance = homeDist * 1.3;
    framed = true;
  }

  async function load(layer: BodyLayer): Promise<void> {
    if (loading[layer]) return loading[layer]!;
    loading[layer] = (async () => {
      const gltf = await loader.loadAsync(`/assets/models/${FILE[layer]}.glb`);
      const root = gltf.scene;
      root.updateMatrixWorld(true);
      root.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        // GLTFLoader strips ":" from node names; the original name ("knee:patella:isa:FJ3381") stays in userData.name
        const raw = (mesh.userData.name as string | undefined) ?? mesh.name;
        const c = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
        mesh.material = material(raw, layer);
        mesh.userData.part = { ...partInfo(raw, c.x), mesh: raw } satisfies PickedPart;
        mesh.userData.base = mesh.material;
      });
      root.visible = visible[layer];
      groups[layer] = root;
      scene.add(root);
      if (layer === "muscles") applyTransparency();
      if (!framed) frame3D();
    })();
    return loading[layer]!;
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);

  // ---- picking
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const meshes = () => { const list: THREE.Object3D[] = []; for (const g of Object.values(groups)) if (g?.visible) g.traverse((o) => { if ((o as THREE.Mesh).isMesh) list.push(o); }); return list; };
  function hit(e: PointerEvent): THREE.Mesh | null {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(meshes(), false);
    return (hits[0]?.object as THREE.Mesh) ?? null;
  }
  function setPicked(m: THREE.Mesh | null) {
    if (picked) picked.material = picked.userData.base;
    picked = m;
    if (m) m.material = mats.pick;
    onPick(m ? (m.userData.part as PickedPart) : null);
  }
  let down = { x: 0, y: 0 };
  canvas.addEventListener("pointerdown", (e) => { down = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener("pointerup", (e) => { if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) return; const m = hit(e); setPicked(m && m !== picked ? m : null); });
  let lastMove = 0;
  canvas.addEventListener("pointermove", (e) => { if (e.buttons || performance.now() - lastMove < 60) return; lastMove = performance.now(); canvas.style.cursor = hit(e) ? "pointer" : "grab"; });

  const clock = new THREE.Clock();
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    if (framed) {
      // ease the distance to the wanted value
      const cur = camera.position.distanceTo(controls.target);
      const next = cur + (dist - cur) * Math.min(1, dt * 7);
      camera.position.sub(controls.target).setLength(next).add(controls.target);
    }
    controls.update();
    renderer.render(scene, camera);
  }

  const api = {
    start() { if (running) return; running = true; clock.getDelta(); resize(); renderer.setAnimationLoop(frame); },
    stop() { running = false; renderer.setAnimationLoop(null); },
    resize,
    /** shows or hides a layer; the first time it is loaded (about 1.5 MB each) */
    async show(layer: BodyLayer, on: boolean) {
      visible[layer] = on;
      if (on) await load(layer);
      const g = groups[layer];
      if (g) g.visible = on;
      if (!on && picked && picked.userData.part && groups[layer]?.getObjectById(picked.id)) setPicked(null);
    },
    setTransparent(on: boolean) { transparent = on; applyTransparency(); },
    zoom(f: number) { dist = Math.min(Math.max(dist * f, controls.minDistance || 0.5), controls.maxDistance || 8); },
    reset() { dist = homeDist; if (framed) { controls.target.copy(target); camera.position.copy(home); } setPicked(null); },
    clearPick() { setPicked(null); },
    get loaded() { return { bones: !!groups.bones, muscles: !!groups.muscles }; },
    dispose() { running = false; renderer.setAnimationLoop(null); controls.dispose(); for (const m of Object.values(mats)) m.dispose(); renderer.dispose(); renderer.forceContextLoss(); },
  };
  void reduceMotion;
  return api;
}
export type BodyScene = ReturnType<typeof initBodyScene>;
