import { BODY_ORGANS } from "../data/body";
import { mountSlots } from "../assets/slots";
import { createBodyStage } from "./bodyStage";
import { organById, organDetailHtml } from "./organDetail";

export interface BodyApi {
  openClaim(id: string, from: HTMLElement): void;
  openAtlas(category: null, id: string): void;
  reduceMotion: boolean;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/**
 * The body page: the generated anatomy picture with a pin per organ (click = zoom), the organ systems as picture cards,
 * and a detail panel (shared with the home page). Traditional attributions come from the atlas data, never from this file.
 */
export function initBody(root: HTMLElement, api: BodyApi) {
  const detail = root.querySelector<HTMLElement>(".bv-detail")!;
  root.querySelector<HTMLElement>(".bv-list")!.innerHTML = BODY_ORGANS.map((o) => `<li><button data-organ="${o.id}">${esc(o.name)}</button></li>`).join("");
  root.querySelector<HTMLElement>(".bv-systems-grid")!.innerHTML = BODY_ORGANS.map((o) =>
    `<button class="bv-card" data-organ="${o.id}"><div data-slot="${o.slot}" data-sizes="(max-width: 700px) 45vw, 18vw"></div><strong>${esc(o.name)}</strong></button>`).join("");

  function show(id: string) {
    const o = organById(id);
    if (!o) return;
    root.querySelectorAll<HTMLElement>(".bv-list [data-organ], .bv-card[data-organ]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.organ === o.id)));
    detail.innerHTML = organDetailHtml(o);
    mountSlots(detail);
  }

  const stage = createBodyStage(root.querySelector<HTMLElement>(".bv-stage")!, {
    reduceMotion: api.reduceMotion,
    onSelect: (id) => { if (id) show(id); },
  });

  root.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    if (t.closest(".bp, .bs-back")) return; // handled by the stage
    const org = t.closest<HTMLElement>("[data-organ]");
    if (org) { stage.select(org.dataset.organ!); if (org.classList.contains("bv-card")) root.querySelector(".bv-scroll")?.scrollTo({ top: 0, behavior: api.reduceMotion ? "auto" : "smooth" }); return; }
    const at = t.closest<HTMLElement>("[data-atlas]");
    if (at) { api.openAtlas(null, at.dataset.atlas!); return; }
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) api.openClaim(cl.dataset.claim!, cl);
  });

  mountSlots(root);
  show(BODY_ORGANS[0].id);
  return { show: (id: string) => stage.select(id) };
}
