import { LAYERS, type EntryRef } from "./wissen.ts";

const TARGETS = new Set(["anatomy", "plants", "minerals", "freq", "cultures"]);
const PROMISE = /\b(heilt|heilen|kuriert|garantiert|beweist|bewiesen|wirkt nachweislich|hilft bei)\b/i;

/**
 * Checks the knowledge matrix page (Universum): five layers with unique ids and consecutive numbers, every target is a known page,
 * every picture name exists, every entry points to an existing atlas entry, organ or dossier, and no text promises a healing effect.
 * Returns blocking errors.
 */
export function validateWissenPage(atlasIds: Set<string>, organIds: Set<string>, cultureIds: Set<string>, slotExists: (name: string) => boolean): string[] {
  const errors: string[] = [];
  const at = (m: string) => errors.push(`Universum-Seite: ${m}`);
  if (LAYERS.length !== 5) at("es müssen fünf Ebenen sein");
  const ids = new Set<string>();
  LAYERS.forEach((l, i) => {
    if (ids.has(l.id)) at(`doppelte Ebene "${l.id}"`);
    ids.add(l.id);
    if (l.nr !== String(i + 1).padStart(2, "0")) at(`${l.id}: Nummer "${l.nr}" passt nicht zur Reihenfolge`);
    if (!TARGETS.has(l.to)) at(`${l.id}: unbekanntes Ziel "${l.to}"`);
    if (!slotExists(l.slot)) at(`${l.id}: Bildplatz "${l.slot}" fehlt (registry.ts)`);
    for (const t of [l.label, l.title, l.sub, l.cta]) if (PROMISE.test(t)) at(`${l.id}: Heilversprechen im Text "${t}"`);
    l.entries.forEach((e: EntryRef) => {
      if (e.type === "organ" && !organIds.has(e.id)) at(`${l.id}: unbekanntes Organ "${e.id}"`);
      if ((e.type === "plant" || e.type === "atlas") && !atlasIds.has(e.id)) at(`${l.id}: unbekannter Atlas-Eintrag "${e.id}"`);
      if (e.type === "culture" && !cultureIds.has(e.id)) at(`${l.id}: unbekannte Kultur "${e.id}"`);
      if (e.type === "fx") {
        if (!slotExists(e.slot)) at(`${l.id}: Bildplatz "${e.slot}" fehlt (registry.ts)`);
        if (PROMISE.test(`${e.title} ${e.tag}`)) at(`${l.id}: Heilversprechen im Text "${e.title}"`);
      }
    });
  });
  return errors;
}
