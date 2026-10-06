import { atlas } from "../data/atlas";
import { BODY_ORGANS, type OrganInfo } from "../data/body";
import { CATEGORY_LABEL, ORIGIN_LABEL } from "../data/types";
import { mountSlots } from "../assets/slots";
import { searchItems } from "./search";

export interface BodyApi {
  openClaim(id: string, from: HTMLElement): void;
  openAtlas(category: null, id: string): void;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const NOTICE = "Informationsangebot – keine medizinische Beratung. Die Anatomie-Sätze sind allgemeines Lehrbuchwissen und im Pilot noch nicht fachlich geprüft.";

/**
 * The body page: the generated anatomy picture with a pin per organ, the organ systems as picture cards, and a detail
 * panel. Traditional attributions come from the atlas data (with their origin), never from this file.
 */
export function initBody(root: HTMLElement, api: BodyApi) {
  let current = BODY_ORGANS[0];

  root.querySelector<HTMLElement>(".bv-stage")!.insertAdjacentHTML("beforeend",
    BODY_ORGANS.map((o) => `<button class="bp" data-organ="${o.id}" style="left:${o.x}%;top:${o.y}%" aria-label="${esc(o.name)}"><span class="bp-ring"></span><span class="bp-label">${esc(o.name)}</span></button>`).join(""));
  root.querySelector<HTMLElement>(".bv-list")!.innerHTML = BODY_ORGANS.map((o) => `<li><button data-organ="${o.id}">${esc(o.name)}</button></li>`).join("");
  root.querySelector<HTMLElement>(".bv-systems-grid")!.innerHTML = BODY_ORGANS.map((o) =>
    `<button class="bv-card" data-organ="${o.id}"><div data-slot="${o.slot}" data-sizes="(max-width: 700px) 45vw, 18vw"></div><strong>${esc(o.name)}</strong></button>`).join("");
  const detail = root.querySelector<HTMLElement>(".bv-detail")!;

  const tokens = (text: string) => text.split(/[\s/()\-&,.:;]+/).filter(Boolean);
  function related(o: OrganInfo) {
    return atlas.flatMap((e) => e.associations.filter((a) => tokens(a.target).some((t) => o.match.includes(t))).map((a) => ({ e, a })));
  }

  function show(id: string) {
    current = BODY_ORGANS.find((o) => o.id === id) ?? current;
    const o = current;
    root.querySelectorAll<HTMLElement>("[data-organ]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.organ === o.id)));
    const rel = related(o);
    // claims that mention the organ as a whole word (searchItems alone would also hit "Herzchakra" for "Herz")
    const word = o.name.split(/[ &]/)[0].toLowerCase();
    const claimHits = searchItems(word, 12).filter((h) => h.kind === "claim" && tokens(h.hay).includes(word)).slice(0, 4);
    detail.innerHTML = `
      <div class="bv-organ-img" data-slot="${o.slot}" data-eager="true"></div>
      <h2>${esc(o.name)}</h2>
      <p>${esc(o.text)}</p>
      <h3>Überlieferte Zuordnungen</h3>
      ${rel.length ? `<ul class="bv-rel">${rel.map(({ e, a }) => `<li><button data-atlas="${e.id}"><strong>${esc(e.name)}</strong><small>${esc(CATEGORY_LABEL[e.category])} · ${esc(a.target)} · ${esc(ORIGIN_LABEL[a.origin])}</small></button></li>`).join("")}</ul>
        <p class="bv-small">Kulturelle Zuordnung nach dem jeweiligen System – kein Wirkbeleg.</p>`
        : `<p class="bv-small">Dazu gibt es noch keinen Eintrag im Atlas.</p>`}
      ${claimHits.length ? `<h3>Verwandte Aussagen</h3><ul class="bv-rel">${claimHits.map((h) => `<li><button data-claim="${esc(h.id)}"><strong>${esc(h.title)}</strong><small>${esc(h.sub)}</small></button></li>`).join("")}</ul>` : ""}
      <p class="bv-notice">${NOTICE}</p>`;
    mountSlots(detail);
  }

  root.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const org = t.closest<HTMLElement>("[data-organ]");
    if (org) { show(org.dataset.organ!); return; }
    const at = t.closest<HTMLElement>("[data-atlas]");
    if (at) { api.openAtlas(null, at.dataset.atlas!); return; }
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) api.openClaim(cl.dataset.claim!, cl);
  });

  mountSlots(root);
  show(current.id);
  return { show };
}
