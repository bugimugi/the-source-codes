import "./style.css";
import gsap from "gsap";
import { initParticles } from "./gl/particles";
import { initProofOverlay } from "./ui/proofOverlay";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const particles = initParticles(document.getElementById("gl") as HTMLCanvasElement, reduceMotion);
initProofOverlay();

if (!reduceMotion) {
  const tl = gsap.timeline({ delay: 0.3 });
  tl.from("h1 .line > span", { yPercent: 110, duration: 1.2, ease: "power4.out", stagger: 0.15 })
    .from("[data-reveal]:not(h1)", { opacity: 0, y: 18, duration: 0.9, ease: "power2.out", stagger: 0.18 }, "-=0.8");
  particles.assemble();
}
