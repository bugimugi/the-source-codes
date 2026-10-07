import { BODY_ORGANS } from "./body.ts";
import { CELLS, CHAIN, FUNCTIONS, HEALTH, LIFE, LINKS, NAV, ORGAN_FACTS, SCIENCE, SYSTEMS } from "./anatomy.ts";

/**
 * Checks the body landing page against the rest of the knowledge base: every claim id and picture name must exist, organ ids must be
 * organs of the body atlas, scroll targets must be known, and every research card needs a source with an https link or a "pending" mark.
 * Returns blocking errors.
 */
export function validateAnatomyPage(claimIds: Set<string>, slotExists: (name: string) => boolean): string[] {
  const errors: string[] = [];
  const at = (m: string) => errors.push(`Körper-Seite: ${m}`);
  const claim = (id: string | undefined, where: string) => { if (id && !claimIds.has(id)) at(`${where}: unbekannte Aussage "${id}"`); };
  const slot = (name: string, where: string) => { if (!slotExists(name)) at(`${where}: unbekannter Bildplatz "${name}" (registry.ts)`); };
  const organs = new Set(BODY_ORGANS.map((o) => o.id));
  const organ = (id: string | undefined, where: string) => { if (id && !organs.has(id)) at(`${where}: unbekanntes Organ "${id}" (body.ts)`); };
  const unique = (ids: string[], what: string) => { if (new Set(ids).size !== ids.length) at(`doppelte ${what}`); };

  unique(SYSTEMS.map((s) => s.id), "Organsysteme");
  SYSTEMS.forEach((s) => { organ(s.organ, `System ${s.id}`); slot(`koerper-sys-${s.id}`, `System ${s.id}`); if (!s.organs.length) at(`System ${s.id}: keine Organe genannt`); });
  Object.keys(ORGAN_FACTS).forEach((id) => organ(id, "Organ-Fakten"));
  CHAIN.forEach((c) => slot(`koerper-kette-${c.id}`, `Stufe ${c.id}`));
  if (CHAIN.length !== 7) at(`die Kette hat ${CHAIN.length} statt 7 Stufen`);
  claim(CELLS.claim, "Zellen");
  LIFE.forEach((l) => slot(`koerper-leben-${l.id}`, `Lebensabschnitt ${l.id}`));
  FUNCTIONS.forEach((f) => { claim(f.claim, `Funktion ${f.id}`); slot(`koerper-funktion-${f.id}`, `Funktion ${f.id}`); });
  HEALTH.forEach((h) => { organ(h.link?.organ, `Gesundheit ${h.id}`); slot(`koerper-gesund-${h.id}`, `Gesundheit ${h.id}`); });
  LINKS.forEach((l) => slot(`koerper-link-${l.id}`, `Verbindung ${l.id}`));
  SCIENCE.forEach((s) => {
    slot(`koerper-forschung-${s.id}`, `Forschung ${s.id}`);
    if (s.source.url && !/^https:\/\//.test(s.source.url)) at(`Forschung ${s.id}: Link muss mit https:// beginnen`);
    if (!s.source.url && !/Source pending verification/.test(s.source.venue)) at(`Forschung ${s.id}: ohne Link muss die Quelle „Source pending verification“ tragen`);
  });
  const targets = new Set(["an-sys", "an-3d", "an-chain", "an-func", "an-health", "an-life", "an-science", "nutrients", "breath", "cultures"]);
  NAV.forEach((n) => { if (!targets.has(n.to)) at(`Navigation "${n.id}": unbekanntes Ziel "${n.to}"`); });
  for (const s of ["koerper-hero", "koerper-zelle", "koerper-hirn"]) slot(s, s);
  return errors;
}
