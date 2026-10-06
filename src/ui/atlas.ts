import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { atlas } from "../data/atlas";
import { claims } from "../data/claims";
import { CATEGORY_LABEL, LEVEL_LABEL, ORIGIN_LABEL, type AtlasCategory, type AtlasEntry } from "../data/types";
import { buildModel, disposeObject, glowTexture, makeEnvironment } from "../gl/models";
import { hasAsset, mountSlots } from "../assets/slots";
import { createDepthCard } from "./depthCard";

const CHAKRA_COLOR: Record<string, string> = {
  Wurzelchakra: "#e0453a", Sakralchakra: "#f08a3c", "Solarplexus-Chakra": "#f2cf3e", Herzchakra: "#46c46f",
  Halschakra: "#4aa8e8", Stirnchakra: "#5a63d6", Kronenchakra: "#a46be0",
};

/** The atlas: a guidebook of plants and gemstones with a 3D viewer and traditional associations. */
export function initAtlas(
  root: HTMLElement,
  reduceMotion: boolean,
  openProof: (id: string, from: HTMLElement) => void,
) {
  const canvas = root.querySelector<HTMLCanvasElement>("canvas")!;
  const listEl = root.querySelector<HTMLElement>(".atlas-list-items")!;
  const catEl = root.querySelector<HTMLElement>(".atlas-cats")!;
  const detail = root.querySelector<HTMLElement>(".atlas-detail")!;
  const title = root.querySelector<HTMLElement>(".atlas-title")!;
  const search = root.querySelector<HTMLInputElement>(".atlas-search")!;
  const targetSel = root.querySelector<HTMLSelectElement>(".atlas-target")!;
  const viewEl = root.querySelector<HTMLElement>(".atlas-view")!;
  const card = createDepthCard(viewEl, reduceMotion);
  let cardMode = false; // true while the selected entry is shown as a picture instead of the 3D model
  const claimById = new Map(claims.map((c) => [c.id, c]));
  const byId = new Map(atlas.map((e) => [e.id, e]));

  let category: AtlasCategory | null = null;
  let selected: AtlasEntry = atlas[0];
  let renderer: THREE.WebGLRenderer | null = null;
  let scene: THREE.Scene, camera: THREE.PerspectiveCamera, controls: OrbitControls, model: THREE.Object3D | null = null, halo: THREE.Sprite;

  // all traditional targets (organs, chakras, signatures) for the filter
  const targets = [...new Set(atlas.flatMap((e) => e.associations.map((a) => a.target)))].sort((a, b) => a.localeCompare(b, "de"));
  targetSel.append(new Option("Zuordnung (Organ, Chakra …)", ""));
  for (const t of targets) targetSel.append(new Option(t, t));

  // categories
  const cats = Object.keys(CATEGORY_LABEL) as AtlasCategory[];
  const catButtons = cats.filter((c) => atlas.some((e) => e.category === c)).map((c) => {
    const b = document.createElement("button");
    b.className = "chip";
    b.textContent = CATEGORY_LABEL[c];
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => {
      category = category === c ? null : c;
      catButtons.forEach((x) => x.setAttribute("aria-pressed", String(x === b && category === c)));
      renderList();
    });
    catEl.append(b);
    return b;
  });

  function matches(e: AtlasEntry) {
    const q = search.value.trim().toLowerCase();
    const t = targetSel.value;
    return (!category || e.category === category)
      && (!t || e.associations.some((a) => a.target === t))
      && (!q || `${e.name} ${e.latin} ${e.tradition} ${e.facts.map((f) => f.value).join(" ")}`.toLowerCase().includes(q));
  }

  function renderList() {
    listEl.replaceChildren();
    const items = atlas.filter(matches);
    for (const e of items) {
      const b = document.createElement("button");
      b.className = "atlas-item";
      b.setAttribute("aria-current", String(e.id === selected.id));
      const pic = hasAsset(`atlas-${e.id}`);
      b.innerHTML = pic
        ? `<span class="swatch thumb" style="--c:${e.model.color}"><div data-slot="atlas-${e.id}" data-fit="cover" data-sizes="48px"></div></span><span><strong></strong><small></small></span>`
        : `<span class="swatch" style="background:${e.model.color}"></span><span><strong></strong><small></small></span>`;
      b.querySelector("strong")!.textContent = e.name;
      b.querySelector("small")!.textContent = `${CATEGORY_LABEL[e.category]} · ${e.latin}`;
      b.addEventListener("click", () => select(e));
      listEl.append(b);
    }
    mountSlots(listEl);
    if (!items.length) {
      const p = document.createElement("p");
      p.className = "atlas-empty";
      p.textContent = "Keine Treffer.";
      listEl.append(p);
    }
  }

  function row(label: string, value: string) {
    const d = document.createElement("div");
    d.className = "fact";
    const a = document.createElement("span"); a.textContent = label;
    const b = document.createElement("strong"); b.textContent = value;
    d.append(a, b);
    return d;
  }

  function renderDetail(e: AtlasEntry) {
    detail.replaceChildren();
    const h = document.createElement("h2"); h.textContent = e.name;
    const lat = document.createElement("p"); lat.className = "latin"; lat.textContent = e.latin;
    detail.append(h, lat);

    const facts = document.createElement("section");
    facts.append(Object.assign(document.createElement("h3"), { textContent: "Fakten" }));
    for (const f of e.facts) facts.append(row(f.label, f.value));
    const unverified = e.sources.some((s) => !s.verified);
    if (unverified) {
      const w = document.createElement("small"); w.className = "warn";
      w.textContent = `⚠ Quellen noch nicht geprüft: ${e.sources.map((s) => s.title).join(", ")}`;
      facts.append(w);
    }
    detail.append(facts);

    const tr = document.createElement("section");
    tr.append(Object.assign(document.createElement("h3"), { textContent: "Überlieferung & Geschichte" }), Object.assign(document.createElement("p"), { textContent: e.tradition }));
    detail.append(tr);

    if (e.associations.length) {
      const sec = document.createElement("section");
      sec.append(Object.assign(document.createElement("h3"), { textContent: "Traditionelle Zuordnungen" }));
      for (const a of e.associations) {
        const d = document.createElement("div");
        d.className = "assoc";
        const dot = document.createElement("span");
        dot.className = "dot";
        dot.style.background = CHAKRA_COLOR[a.target] ?? "var(--accent)";
        const txt = document.createElement("span");
        txt.innerHTML = "<strong></strong> <em></em><small></small>";
        txt.querySelector("strong")!.textContent = a.target;
        txt.querySelector("em")!.textContent = `${a.system} · ${ORIGIN_LABEL[a.origin]}`;
        txt.querySelector("small")!.textContent = a.note ?? "";
        d.append(dot, txt);
        sec.append(d);
      }
      sec.append(Object.assign(document.createElement("small"), { className: "note", textContent: "Kulturelle Zuordnung nach dem jeweiligen System – kein Wirkbeleg." }));
      detail.append(sec);
    }

    // combinations: stored on one side, shown on both
    const combos = [
      ...e.combinations.map((c) => ({ id: c.with, note: c.note, origin: c.origin })),
      ...atlas.flatMap((o) => o.combinations.filter((c) => c.with === e.id).map((c) => ({ id: o.id, note: c.note, origin: c.origin }))),
    ];
    if (combos.length) {
      const sec = document.createElement("section");
      sec.append(Object.assign(document.createElement("h3"), { textContent: "Kombinationen" }));
      for (const c of combos) {
        const o = byId.get(c.id);
        if (!o) continue;
        const d = document.createElement("div");
        d.className = "combo";
        const b = document.createElement("button");
        b.textContent = o.name;
        b.addEventListener("click", () => select(o));
        d.append(b, Object.assign(document.createElement("small"), { textContent: ` ${c.note} (${ORIGIN_LABEL[c.origin]})` }));
        sec.append(d);
      }
      detail.append(sec);
    }

    const cl = e.claims.map((id) => claimById.get(id)).filter(Boolean);
    if (cl.length) {
      const sec = document.createElement("section");
      sec.append(Object.assign(document.createElement("h3"), { textContent: "Belegte Aussagen" }));
      for (const c of cl) {
        if (!c) continue;
        const b = document.createElement("button");
        b.className = "claim-chip";
        b.style.setProperty("--c", `var(--lvl-${c.level})`);
        b.innerHTML = "<em></em><span></span>";
        b.querySelector("em")!.textContent = LEVEL_LABEL[c.level];
        b.querySelector("span")!.textContent = c.statement;
        b.addEventListener("click", () => openProof(c.id, b));
        sec.append(b);
      }
      detail.append(sec);
    }
    detail.append(Object.assign(document.createElement("p"), { className: "note", textContent: "Informationsangebot – keine medizinische Beratung. Beschreibungen traditioneller Anwendung sind keine Anwendungsempfehlung." }));
  }

  function initGL() {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    scene = new THREE.Scene();
    scene.environment = makeEnvironment(renderer);
    camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 1.2, 8);
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 4;
    controls.maxDistance = 14;
    controls.autoRotate = !reduceMotion;
    controls.autoRotateSpeed = 1.2;
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 5, 4);
    const rim = new THREE.PointLight(0x7fa8ff, 18, 25);
    rim.position.set(-4, 2, -3);
    scene.add(key, rim);
    halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), blending: THREE.AdditiveBlending, transparent: true, opacity: 0.3, depthWrite: false }));
    halo.scale.setScalar(9);
    halo.position.z = -2;
    scene.add(halo);
  }

  function setModel(e: AtlasEntry) {
    if (model) { scene.remove(model); disposeObject(model); }
    model = buildModel(e.model);
    scene.add(model);
    // the halo takes the colour of the first chakra association (cultural colour code), else the model colour
    const first = e.associations.find((a) => CHAKRA_COLOR[a.target]);
    (halo.material as THREE.SpriteMaterial).color.set(first ? CHAKRA_COLOR[first.target] : e.model.color);
  }

  /** Picture (2.5D card) when a generated image exists for the entry, otherwise the procedural 3D model. */
  function applyEntry(e: AtlasEntry) {
    const first = e.associations.find((a) => CHAKRA_COLOR[a.target]);
    const color = first ? CHAKRA_COLOR[first.target] : e.model.color;
    const note = first ? ` · Leuchtfarbe = Farbe der traditionellen Zuordnung (${first.target})` : "";
    cardMode = hasAsset(`atlas-${e.id}`);
    canvas.style.visibility = cardMode ? "hidden" : "visible";
    if (cardMode) {
      card.show(e.id, color, `${e.name} · Illustration (mit KI erzeugt)${note}`);
      title.textContent = "";
    } else {
      card.hide();
      if (renderer) setModel(e);
      title.textContent = `${e.name}${note}`;
    }
  }

  function select(e: AtlasEntry) {
    selected = e;
    applyEntry(e);
    renderList();
    renderDetail(e);
    detail.scrollTop = 0;
  }

  search.addEventListener("input", renderList);
  targetSel.addEventListener("change", renderList);

  function resize() {
    if (!renderer) return;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  addEventListener("resize", resize);

  return {
    start() {
      if (!renderer) { initGL(); }
      resize();
      applyEntry(selected);
      renderList();
      renderDetail(selected);
      renderer!.setAnimationLoop(() => {
        if (cardMode) return; // a picture is shown: nothing to draw in 3D
        controls.update();
        renderer!.render(scene, camera);
      });
    },
    stop() { renderer?.setAnimationLoop(null); card.hide(); },
    /** Jump to a category (null = all); used by the home page tiles. */
    showCategory(c: AtlasCategory | null) {
      category = c;
      catButtons.forEach((b, i) => b.setAttribute("aria-pressed", String(c !== null && b.textContent === CATEGORY_LABEL[c])));
      renderList();
      const first = atlas.find((e) => !c || e.category === c);
      if (first) select(first);
    },
    select: (id: string) => { const e = byId.get(id); if (e) select(e); },
    resize,
  };
}
