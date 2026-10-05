import gsap from "gsap";
import { claims } from "../data/claims";
import { KIND_LABEL, LEVEL_LABEL, type Claim, type Source } from "../data/types";

const levelColor = (l: Claim["level"]) => `var(--lvl-${l})`;

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: { className?: string; text?: string } = {},
  children: (Node | string)[] = [],
) {
  const node = document.createElement(tag);
  if (props.className) node.className = props.className;
  if (props.text) node.textContent = props.text;
  node.append(...children);
  return node;
}

function sourceNode(s: Source): HTMLElement {
  const box = el("div", { className: "src" });
  box.append(el("span", { className: "tag", text: KIND_LABEL[s.kind] }));
  box.append(el("strong", { text: s.title }));
  const meta = [s.author, s.year, s.citation].filter(Boolean).join(" · ");
  box.append(el("small", { text: meta }));
  if (s.note) box.append(el("small", { text: s.note }));
  if (!s.verified) {
    box.append(el("small", { className: "warn", text: "⚠ Zitat noch nicht gegen das Original geprüft" }));
  }
  if (s.url) {
    const a = el("a", { text: "Quelle öffnen" });
    a.href = s.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    box.append(el("small", {}, [a]));
  }
  return box;
}

export function initProofOverlay() {
  const overlay = document.getElementById("overlay") as HTMLElement;
  const sheet = overlay.querySelector<HTMLElement>(".sheet")!;
  const byId = new Map(claims.map((c) => [c.id, c]));
  let opener: HTMLElement | null = null;

  function render(c: Claim) {
    const close = el("button", { className: "close", text: "×" });
    close.setAttribute("aria-label", "Schließen");
    close.dataset.close = "";
    const badge = el("span", { className: "badge", text: LEVEL_LABEL[c.level] });
    badge.style.setProperty("--c", levelColor(c.level));
    const h2 = el("h2", { text: c.statement });
    h2.id = "sheet-title";
    sheet.replaceChildren(
      close,
      badge,
      h2,
      el("h3", { text: "Einordnung" }),
      el("p", { text: c.rationale }),
      el("h3", { text: `Quellen (${c.sources.length})` }),
      ...c.sources.map(sourceNode),
    );
  }

  function open(id: string, from: HTMLElement) {
    const c = byId.get(id);
    if (!c) return;
    opener = from;
    render(c);
    overlay.hidden = false;
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(sheet, { y: 24, scale: 0.97 }, { y: 0, scale: 1, duration: 0.4, ease: "power3.out" });
    sheet.focus();
  }

  function close() {
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        overlay.hidden = true;
        opener?.focus();
      },
    });
  }

  document.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const trigger = t.closest<HTMLElement>("[data-claim]");
    if (trigger) return open(trigger.dataset.claim!, trigger);
    if (!overlay.hidden && t.closest("[data-close]")) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) close();
  });

  return { open };
}
