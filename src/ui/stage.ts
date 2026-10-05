import * as THREE from "three";
import gsap from "gsap";
import { claims } from "../data/claims";
import { KIND_LABEL, LEVEL_LABEL, type Claim } from "../data/types";
import { createStage, type StageScene } from "../gl/stages";
import { makeEnvironment } from "../gl/models";

/** Full-screen themed 3D stage for one claim, with a glass info panel on the side. */
export function initStage(
  root: HTMLElement,
  reduceMotion: boolean,
  openProof: (id: string, from: HTMLElement) => void,
) {
  const canvas = root.querySelector<HTMLCanvasElement>("canvas")!;
  const panel = root.querySelector<HTMLElement>(".stage-panel")!;
  const closeBtn = root.querySelector<HTMLButtonElement>(".stage-close")!;
  let renderer: THREE.WebGLRenderer | null = null;
  let env: THREE.Texture | null = null;
  let current: StageScene | null = null;
  let currentClaim: Claim | null = null;
  const pointer = new THREE.Vector2();
  const smooth = new THREE.Vector2();
  let opener: HTMLElement | null = null;
  let onClose: (() => void) | null = null;
  const byId = new Map(claims.map((c) => [c.id, c]));

  function resize() {
    if (!renderer || !current) return;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    current.camera.aspect = w / h;
    current.camera.updateProjectionMatrix();
  }
  addEventListener("resize", resize);
  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  });

  function renderPanel(c: Claim, s: StageScene) {
    panel.replaceChildren();
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.style.setProperty("--c", `var(--lvl-${c.level})`);
    badge.textContent = LEVEL_LABEL[c.level];
    const h = document.createElement("h2");
    h.textContent = c.statement;
    const why = document.createElement("p");
    why.textContent = c.rationale;
    const proof = document.createElement("button");
    proof.className = "enter";
    proof.textContent = `Beleg & Quellen (${c.sources.length}) ansehen`;
    proof.addEventListener("click", () => openProof(c.id, proof));
    const kinds = [...new Set(c.sources.map((x) => KIND_LABEL[x.kind]))].join(" · ");
    const kindLine = document.createElement("small");
    kindLine.textContent = `Quellenarten: ${kinds}`;
    const cap = document.createElement("p");
    cap.className = "stage-caption";
    cap.textContent = s.caption;
    panel.append(badge, h, why, proof, kindLine);
    if (s.controls) panel.append(s.controls);
    panel.append(cap);
    const rel = (c.related ?? []).map((id) => byId.get(id)).filter(Boolean) as Claim[];
    if (rel.length) {
      const hd = document.createElement("h3");
      hd.textContent = "Verbunden mit";
      const ul = document.createElement("ul");
      ul.className = "stage-related";
      for (const r of rel) {
        const li = document.createElement("li");
        const b = document.createElement("button");
        b.textContent = r.statement.length > 70 ? `${r.statement.slice(0, 68)}…` : r.statement;
        b.style.setProperty("--c", `var(--lvl-${r.level})`);
        b.addEventListener("click", () => show(r));
        li.append(b);
        ul.append(li);
      }
      panel.append(hd, ul);
    }
  }

  function show(c: Claim) {
    renderer ??= new THREE.WebGLRenderer({ canvas, antialias: true });
    if (!renderer) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    env ??= makeEnvironment(renderer);
    current?.dispose();
    current = createStage(c, { env, reduceMotion });
    currentClaim = c;
    resize();
    renderPanel(c, current);
    const clock = new THREE.Clock();
    let last = 0;
    renderer.setAnimationLoop(() => {
      const t = clock.getElapsedTime();
      smooth.lerp(pointer, 0.06);
      current!.update(reduceMotion ? 0 : t, t - last, smooth);
      last = t;
      renderer!.render(current!.scene, current!.camera);
    });
  }

  function open(c: Claim, from: HTMLElement, closed: () => void) {
    opener = from;
    onClose = closed;
    root.hidden = false;
    show(c);
    gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: reduceMotion ? 0 : 0.7 });
    gsap.fromTo(panel, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: reduceMotion ? 0 : 0.8, delay: 0.25, ease: "power3.out" });
    closeBtn.focus();
  }

  function close() {
    gsap.to(root, {
      opacity: 0,
      duration: reduceMotion ? 0 : 0.4,
      onComplete: () => {
        root.hidden = true;
        renderer?.setAnimationLoop(null);
        current?.dispose();
        current = null;
        currentClaim = null;
        onClose?.();
        opener?.focus();
      },
    });
  }

  closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    const overlay = document.getElementById("overlay");
    if (e.key === "Escape" && !root.hidden && overlay?.hidden) close();
  });

  return { open, close, current: () => currentClaim };
}
