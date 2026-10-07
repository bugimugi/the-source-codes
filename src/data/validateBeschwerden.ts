import { COMPLAINTS, ORBS, RECS, SELF, STEPS, EXAMPLE, RED_FLAGS, CRISIS } from "./beschwerden.ts";

/**
 * Checks the complaints landing page: every claim id and picture name must exist, every complaint needs warning signs, a crisis-relevant
 * group must name the telephone counselling, the red-flag patterns must catch the usual emergency words, and the page must not offer
 * dosages or a ranking of probable causes. Returns blocking errors.
 */
export function validateBeschwerdenPage(claimIds: Set<string>, slotExists: (name: string) => boolean, atlasIds: Set<string>): string[] {
  const errors: string[] = [];
  const at = (m: string) => errors.push(`Beschwerden-Seite: ${m}`);
  const claim = (id: string | undefined, where: string) => { if (id && !claimIds.has(id)) at(`${where}: unbekannte oder nicht veröffentlichte Aussage "${id}"`); };
  const slot = (name: string, where: string) => { if (!slotExists(name)) at(`${where}: unbekannter Bildplatz "${name}" (registry.ts)`); };
  if (new Set(COMPLAINTS.map((c) => c.id)).size !== COMPLAINTS.length) at("doppelte Beschwerdegruppe");
  for (const c of COMPLAINTS) {
    if (!c.hidden) slot(`beschwerden-${c.id}`, `Gruppe ${c.id}`);
    if (c.flags.length < 4) at(`Gruppe ${c.id}: zu wenige Warnzeichen (mindestens vier)`);
    if (!c.terms.length) at(`Gruppe ${c.id}: keine Suchbegriffe`);
    claim(c.triggerClaim, `Gruppe ${c.id}`);
    for (const i of c.ideas) { claim(i.claim, `Gruppe ${c.id}, ${i.label}`); if (i.atlas && !atlasIds.has(i.atlas)) at(`Gruppe ${c.id}, ${i.label}: Atlas-Eintrag "${i.atlas}" fehlt`); if (i.kind === "studie" && !i.claim) at(`Gruppe ${c.id}, ${i.label}: „Studienlage“ braucht eine Aussage`); }
    if (c.crisis && !c.flags.some((f) => /0800 111 0 111/.test(f))) at(`Gruppe ${c.id}: Krisen-Gruppe ohne Telefonseelsorge in den Warnzeichen`);
    // no dosages: no "mg", "ml" or "x täglich" patterns in what people try
    for (const t of [c.what, ...c.triggers, ...c.ideas.map((i) => i.text)]) if (/\b\d+\s?(mg|µg|ml|g)\b|\d\s?x\s?täglich|mal täglich/i.test(t)) at(`Gruppe ${c.id}: Dosierungsangabe im Text („${t.slice(0, 40)}…“)`);
  }
  ORBS.forEach((o) => { slot(`beschwerden-kugel-${o.id}`, `Kugel ${o.id}`); claim(o.claim, `Kugel ${o.id}`); });
  RECS.forEach((r) => { slot(`beschwerden-empf-${r.id}`, `Ansatz ${r.id}`); r.claims.forEach((c) => claim(c, `Ansatz ${r.id}`)); r.atlas?.forEach((a) => { if (!atlasIds.has(a)) at(`Ansatz ${r.id}: Atlas-Eintrag "${a}" fehlt`); }); });
  if (SELF.length < 6 || STEPS.length !== 5) at("Selbsteinschätzung oder Schritte unvollständig");
  if (EXAMPLE.items.some((i) => /hoch|mittel|gering|%/i.test(`${i.short}`))) at("Beispiel: keine Einfluss-Stufen oder Prozentwerte erlaubt");
  for (const w of ["Brustschmerzen", "Atemnot", "Schlaganfall", "Blut im Stuhl", "Bewusstlos", "Allergischer Schock"]) if (!RED_FLAGS.some((r) => r.test(w))) at(`Notfall-Muster erkennt „${w}“ nicht`);
  if (!CRISIS.test("Ich will mich umbringen")) at("Krisen-Muster erkennt „umbringen“ nicht");
  slot("beschwerden-hero", "beschwerden-hero"); slot("beschwerden-analyse", "beschwerden-analyse");
  return errors;
}
