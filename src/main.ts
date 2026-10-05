import "./style.css";
import gsap from "gsap";
import { initParticles } from "./gl/particles";
import { initMatrix } from "./gl/matrix";
import { initProofOverlay } from "./ui/proofOverlay";
import { AREA_LABEL, LEVEL_LABEL, type Area, type EvidenceLevel } from "./data/types";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const particles = initParticles($<HTMLCanvasElement>("gl"), reduceMotion);
const overlay = initProofOverlay();

const matrixEl = $("matrix");
const enterBtn = $("enter-matrix");
const leaveBtn = $("leave-matrix");
let matrix: ReturnType<typeof initMatrix> | null = null;

for (const level of Object.keys(LEVEL_LABEL) as EvidenceLevel[]) {
  const li = document.createElement("li");
  li.style.setProperty("--c", `var(--lvl-${level})`);
  li.textContent = LEVEL_LABEL[level];
  $("legend").append(li);
}

let area: Area | null = null;
let query = "";
const applyFilter = () =>
  matrix?.setFilter(
    (c) => (!area || c.area === area) && (!query || c.statement.toLowerCase().includes(query)),
  );

const chipBox = $("areas");
const chips = (Object.keys(AREA_LABEL) as Area[]).map((a) => {
  const b = document.createElement("button");
  b.className = "chip";
  b.textContent = AREA_LABEL[a];
  b.setAttribute("aria-pressed", "false");
  b.addEventListener("click", () => {
    area = area === a ? null : a;
    chips.forEach((c, i) => c.setAttribute("aria-pressed", String((Object.keys(AREA_LABEL) as Area[])[i] === area)));
    applyFilter();
  });
  chipBox.append(b);
  return b;
});
$<HTMLInputElement>("search").addEventListener("input", (e) => {
  query = (e.target as HTMLInputElement).value.trim().toLowerCase();
  applyFilter();
});

function enterMatrix() {
  matrix ??= initMatrix($<HTMLCanvasElement>("matrix-gl"), $("matrix-labels"), (id) => overlay.open(id, leaveBtn));
  matrixEl.hidden = false;
  matrix.start();
  particles.pause();
  gsap.fromTo(matrixEl, { opacity: 0 }, { opacity: 1, duration: reduceMotion ? 0 : 0.6 });
  leaveBtn.focus();
}

function leaveMatrix() {
  gsap.to(matrixEl, {
    opacity: 0,
    duration: reduceMotion ? 0 : 0.4,
    onComplete: () => {
      matrixEl.hidden = true;
      matrix?.stop();
      particles.resume();
      enterBtn.focus();
    },
  });
}

enterBtn.addEventListener("click", enterMatrix);
leaveBtn.addEventListener("click", leaveMatrix);

if (!reduceMotion) {
  const tl = gsap.timeline({ delay: 0.3 });
  tl.from("h1 .line > span", { yPercent: 110, duration: 1.2, ease: "power4.out", stagger: 0.15 })
    .from("[data-reveal]:not(h1)", { opacity: 0, y: 18, duration: 0.9, ease: "power2.out", stagger: 0.18 }, "-=0.8");
  particles.assemble();
}
