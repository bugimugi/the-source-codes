import { GROUP_ORDER, NUTRIENTS, NUTRIENT_NOTICE } from "./nutrients.ts";
import { CATEGORY_CARDS, DEFICIENCY_TEXT, HERO_CATS, INFO, INTAKE_NOTE, INTAKE_TIPS, PAGE_SLOTS, POPULAR, SYSTEMS, TEAMWORK, WORK_TEXT } from "./naehrpage.ts";

const DOSAGE = /\b\d+([.,]\d+)?\s?(mg|µg|mcg|ie|i\.e\.|g|kg|ml|l|tropfen|tabletten|kapseln|esslöffel|teelöffel|el|tl)\b|\b\d+\s?(x|mal)\s(täglich|am tag|pro tag)\b/i;
const PROMISE = /\b(heilt|heilen|kuriert|garantiert|beweist|bewiesen|wirkt nachweislich|hilft bei|beugt .* vor|schützt vor)\b/i;

/**
 * Checks the nutrient landing page: unique nutrient ids, every body system and chip points to an existing nutrient, every system has
 * five nutrients, picture names exist, and no text states a dosage, an intake plan or a promise of healing. Returns blocking errors.
 */
export function validateNaehrstoffePage(slotExists: (name: string) => boolean): string[] {
  const errors: string[] = [];
  const at = (m: string) => errors.push(`Nährstoff-Seite: ${m}`);
  const ids = new Set<string>();
  for (const n of NUTRIENTS) {
    if (ids.has(n.id)) at(`doppelte Kennung "${n.id}"`);
    ids.add(n.id);
    if (!slotExists(`naehrstoff-${n.id}`)) at(`Bildplatz "naehrstoff-${n.id}" fehlt (registry.ts)`);
    if (n.alt && !slotExists(n.alt)) at(`${n.id}: unbekannter Ersatz-Bildplatz "${n.alt}"`);
  }
  const known = (id: string, where: string) => { if (!ids.has(id)) at(`${where}: unbekannter Nährstoff "${id}"`); };
  GROUP_ORDER.forEach((g) => { if (!NUTRIENTS.some((n) => n.group === g)) at(`Gruppe "${g}" hat keinen Eintrag`); });
  if (CATEGORY_CARDS.length !== 7) at("es müssen sieben Gruppenkarten sein");
  if (HERO_CATS.length !== 6) at("es müssen sechs Kreise im Hero sein");
  POPULAR.forEach((id) => known(id, "Beliebte Themen"));
  if (SYSTEMS.length !== 10) at("es müssen zehn Körpersysteme sein");
  for (const s of SYSTEMS) {
    if (s.links.length !== 5) at(`${s.name}: genau fünf Nährstoffe erwartet`);
    if (new Set(s.links.map(([id]) => id)).size !== s.links.length) at(`${s.name}: doppelter Nährstoff`);
    s.links.forEach(([id]) => known(id, s.name));
  }
  PAGE_SLOTS.forEach((n) => { if (!slotExists(n)) at(`unbekannter Bildplatz "${n}" (registry.ts)`); });
  CATEGORY_CARDS.forEach((c) => { if (c.alt && !slotExists(c.alt)) at(`Gruppenkarte ${c.group}: unbekannter Bildplatz "${c.alt}"`); });
  INFO.forEach((c) => { if (c.alt && !slotExists(c.alt)) at(`Infokarte ${c.id}: unbekannter Bildplatz "${c.alt}"`); });

  const texts: [string, string][] = [["Hinweis", NUTRIENT_NOTICE], ["Einnahme", INTAKE_NOTE]];
  NUTRIENTS.forEach((n) => [n.what, n.role, n.sources, n.tags, n.deficiency, n.intake, n.note].forEach((t) => t && texts.push([n.id, t])));
  SYSTEMS.forEach((s) => { texts.push([s.id, s.text]); s.links.forEach(([id, t]) => texts.push([`${s.id}/${id}`, t])); });
  [...WORK_TEXT, ...INTAKE_TIPS, ...DEFICIENCY_TEXT, ...TEAMWORK.map(([, t]) => t), ...INFO.map((i) => i.text), ...CATEGORY_CARDS.map((c) => c.sub), ...HERO_CATS.map((c) => c.sub)].forEach((t) => texts.push(["Seite", t]));
  for (const [w, t] of texts) {
    if (DOSAGE.test(t)) at(`${w}: Mengen- oder Dosierungsangabe gefunden („${t.match(DOSAGE)![0]}“)`);
    if (PROMISE.test(t)) at(`${w}: Heilversprechen gefunden („${t.match(PROMISE)![0]}“)`);
  }
  return errors;
}
