import { atlas } from "../data/atlas";
import { BODY_ORGANS, type OrganInfo } from "../data/body";
import { BUBBLES } from "../data/home";
import { CATEGORY_LABEL, ORIGIN_LABEL } from "../data/types";
import { searchItems } from "./search";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const tokens = (text: string) => text.split(/[\s/()\-&,.:;]+/).filter(Boolean);

export const ORGAN_NOTICE = "Informationsangebot – keine medizinische Beratung. Die Anatomie-Sätze sind allgemeines Lehrbuchwissen und im Pilot noch nicht fachlich geprüft.";

export const organById = (id: string) => BODY_ORGANS.find((o) => o.id === id);

/**
 * Detail block for one organ, shared by the home page and the body page. Three kinds of content, kept apart:
 * the textbook sentence, traditional attributions taken from the atlas (whole-word match, origin shown), and the operator's
 * draft pairing with plants / nutrients (labelled unverified, no effect named). Related claims open the proof overlay.
 */
export function organDetailHtml(o: OrganInfo): string {
  const rel = atlas.flatMap((e) => e.associations.filter((a) => tokens(a.target).some((t) => o.match.includes(t))).map((a) => ({ e, a })));
  // claims that mention the organ as a whole word (searchItems alone would also hit "Herzchakra" for "Herz")
  const word = o.name.split(/[ &]/)[0].toLowerCase();
  const claimHits = searchItems(word, 12).filter((h) => h.kind === "claim" && tokens(h.hay).includes(word)).slice(0, 4);
  const items = BUBBLES.filter((b) => b.organs.includes(o.id));
  return `
    <div class="bv-organ-img" data-slot="${o.slot}" data-eager="true"></div>
    <h2>${esc(o.name)}</h2>
    <p>${esc(o.text)}</p>
    ${items.length ? `<h3>Pflanzen &amp; Nährstoffe zu diesem Organ</h3>
      <ul class="nb-list">${items.map((b) => `<li><div class="nb-img" data-slot="${b.slot}"></div><span><strong>${esc(b.name)}</strong><small>${esc(b.kind)}</small></span></li>`).join("")}</ul>
      <p class="bv-small">Vorläufige Zuordnung (Platzhalter) – ungeprüft, ohne Quelle, kein Wirkbeleg. Sie wird durch bewertete Aussagen ersetzt.</p>` : ""}
    <h3>Überlieferte Zuordnungen</h3>
    ${rel.length ? `<ul class="bv-rel">${rel.map(({ e, a }) => `<li><button data-atlas="${e.id}"><strong>${esc(e.name)}</strong><small>${esc(CATEGORY_LABEL[e.category])} · ${esc(a.target)} · ${esc(ORIGIN_LABEL[a.origin])}</small></button></li>`).join("")}</ul>
      <p class="bv-small">Kulturelle Zuordnung nach dem jeweiligen System – kein Wirkbeleg.</p>`
      : `<p class="bv-small">Dazu gibt es noch keinen Eintrag im Atlas.</p>`}
    ${claimHits.length ? `<h3>Verwandte Aussagen</h3><ul class="bv-rel">${claimHits.map((h) => `<li><button data-claim="${esc(h.id)}"><strong>${esc(h.title)}</strong><small>${esc(h.sub)}</small></button></li>`).join("")}</ul>` : ""}
    <p class="bv-notice">${ORGAN_NOTICE}</p>`;
}
