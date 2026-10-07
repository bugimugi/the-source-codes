import { AREAS, MORE, SPOTS, TECHNIQUES, TOP_CARDS, ROUNDS } from "./atempage.ts";

/**
 * Checks the breath landing page against the rest of the knowledge base: every claim id and picture name must exist, techniques with a
 * timer need positive step lengths, techniques without a timer must say why, and the dangerous ones (breath holding after hard
 * breathing) must carry a warning and no steps. Returns blocking errors.
 */
export function validateAtemPage(claimIds: Set<string>, slotExists: (name: string) => boolean): string[] {
  const errors: string[] = [];
  const at = (m: string) => errors.push(`Atem-Seite: ${m}`);
  const claim = (id: string | undefined, where: string) => { if (id && !claimIds.has(id)) at(`${where}: unbekannte oder nicht veröffentlichte Aussage "${id}"`); };
  const slot = (name: string, where: string) => { if (!slotExists(name)) at(`${where}: unbekannter Bildplatz "${name}" (registry.ts)`); };
  AREAS.forEach((a) => claim(a.claim, `Bereich ${a.id}`));
  TOP_CARDS.forEach((c) => slot(`atem-karte-${c.id}`, `Karte ${c.id}`));
  MORE.forEach((m) => { slot(`atem-mehr-${m.id}`, `Bereich ${m.id}`); m.claims.forEach((c) => claim(c, `Bereich ${m.id}`)); });
  SPOTS.forEach((s) => claim(s.claim, `Körper ${s.id}`));
  if (new Set(TECHNIQUES.map((t) => t.id)).size !== TECHNIQUES.length) at("doppelte Technik");
  for (const t of TECHNIQUES) {
    t.effects.forEach((e) => claim(e.claim, `Technik ${t.id}`));
    if (t.pattern) {
      if (!t.pattern.length || t.pattern.some(([, d]) => !(d > 0 && d <= 12))) at(`Technik ${t.id}: Phasenlängen müssen zwischen 1 und 12 Sekunden liegen`);
      if (t.pattern.some(([p, d]) => p === "hold" && d > 8)) at(`Technik ${t.id}: Atemanhalten über 8 Sekunden`);
      if (!t.steps.length) at(`Technik ${t.id}: Takt ohne Schritte`);
    } else if (!t.noTimer) at(`Technik ${t.id}: ohne Takt braucht sie einen Hinweis (noTimer)`);
    if (!t.effects.length) at(`Technik ${t.id}: ohne Wirkungsliste`);
  }
  // techniques that combine hard breathing with breath holding are never given as a how-to
  for (const id of ["immun", "kaelte"]) { const t = TECHNIQUES.find((x) => x.id === id); if (t && (t.pattern || t.steps.length || !t.warning)) at(`Technik ${id}: gefährlich, darf keine Anleitung und keinen Takt haben und braucht eine Warnung`); }
  if (!ROUNDS.includes(4)) at("Runden: 4 fehlt");
  slot("atem-hero", "atem-hero"); slot("atem-schluss", "atem-schluss"); slot("atem-koerper", "atem-koerper");
  return errors;
}
