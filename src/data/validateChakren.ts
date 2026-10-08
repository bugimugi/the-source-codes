import { CHAKRAS } from "./chakras.ts";
import { FOODS, MED_KINDS, MED_SLOT, NATURE, PAGES, PAGE_CLAIMS, PAGE_NOTICE, SCENTS, SOLFEGGIO, STONES, TABS, YOGA, hzLines, itemSlot, medSteps, pageSlots } from "./chakrapage.ts";

const DOSAGE = /\b\d+([.,]\d+)?\s?(mg|µg|mcg|g|kg|ml|l|tropfen|tabletten|kapseln|esslöffel|teelöffel|el|tl)\b/i;
const PROMISE = /\b(heilt|heilen|kuriert|garantiert|beweist|bewiesen|wirkt nachweislich|hilft bei)\b/i;
const RISKY_YOGA = ["Kopfstand", "Schulterstand", "Pflug", "Kamel", "Fisch"];

/**
 * Checks the chakra landing page against the rest of the knowledge base: every chakra has a page, every item exists in its catalogue,
 * atlas links point to published entries, picture names and claim ids exist, frequencies come from the Solfeggio list, risky yoga poses
 * carry a caution, and no text states a dosage or a promise of healing. Returns blocking errors.
 */
export function validateChakrenPage(claimIds: Set<string>, atlasIds: Set<string>, slotExists: (name: string) => boolean): string[] {
  const errors: string[] = [];
  const at = (m: string) => errors.push(`Chakren-Seite: ${m}`);
  const slot = (name: string, where: string) => { if (!slotExists(name)) at(`${where}: unbekannter Bildplatz "${name}" (registry.ts)`); };
  const atlas = (id: string | undefined, where: string) => { if (id && !atlasIds.has(id)) at(`${where}: unbekannter oder nicht veröffentlichter Atlas-Eintrag "${id}"`); };

  PAGE_CLAIMS.forEach((id) => { if (!claimIds.has(id)) at(`unbekannte oder nicht veröffentlichte Aussage "${id}"`); });
  if (PAGES.length !== CHAKRAS.length) at("Anzahl der Seiten und Chakren verschieden");
  CHAKRAS.forEach((c, i) => { if (PAGES[i]?.id !== c.id) at(`Reihenfolge: an Stelle ${i + 1} fehlt "${c.id}"`); });
  if (TABS.length !== 9) at("es müssen neun Reiter sein");
  slot("chakren-hero", "chakren-hero");

  const texts: [string, string][] = [["Hinweis", PAGE_NOTICE]];
  const keep = (where: string, ...ts: (string | undefined)[]) => ts.forEach((t) => t && texts.push([where, t]));
  for (const p of PAGES) {
    const w = `Chakra ${p.id}`, c = CHAKRAS.find((x) => x.id === p.id);
    if (!c) { at(`${w}: unbekannte Chakra-Kennung`); continue; }
    slot(`chakren-symbol-${p.id}`, w);
    if (!SOLFEGGIO.includes(c.hz)) at(`${w}: ${c.hz} Hz steht nicht in der Solfeggio-Liste`);
    if (!hzLines(c.hz).includes(c.hz) || hzLines(c.hz).length < 2) at(`${w}: zu wenige Frequenzzeilen`);
    const need = (list: string[], dict: Record<string, unknown>, min: number, what: string) => {
      if (list.length < min) at(`${w}: ${what}: mindestens ${min} Einträge`);
      if (new Set(list).size !== list.length) at(`${w}: ${what}: doppelter Eintrag`);
      list.forEach((k) => { if (!dict[k]) at(`${w}: ${what} "${k}" fehlt im Katalog`); });
    };
    need(p.stones, STONES, 5, "Steine"); need(p.foods, FOODS, 5, "Speisen"); need(p.scents, SCENTS, 4, "Düfte"); need(p.yoga, YOGA, 4, "Yoga"); need(p.nature, NATURE, 3, "Natur");
    p.stones.forEach((k) => { atlas(STONES[k]?.atlas, `${w} Stein ${k}`); if (!STONES[k]?.atlas) slot(itemSlot("stein", k), `${w} Stein ${k}`); });
    p.foods.forEach((k) => { atlas(FOODS[k]?.atlas, `${w} Speise ${k}`); if (!FOODS[k]?.atlas) slot(itemSlot("essen", k), `${w} Speise ${k}`); });
    p.scents.forEach((k) => { atlas(SCENTS[k]?.atlas, `${w} Duft ${k}`); if (!SCENTS[k]?.atlas) slot(itemSlot("duft", k), `${w} Duft ${k}`); });
    p.yoga.forEach((k) => { slot(itemSlot("yoga", k), `${w} Yoga ${k}`); if (RISKY_YOGA.includes(k) && !YOGA[k]?.caution) at(`${w}: ${k} braucht einen Sicherheitshinweis`); });
    p.nature.forEach((k) => slot(itemSlot("natur", k), `${w} Natur ${k}`));
    p.herbs.forEach((h) => atlas(h.atlas, `${w} Kraut ${h.name}`));
    if (p.affirmations.length < 3) at(`${w}: mindestens drei Affirmationen`);
    if (p.meditations.length !== 4) at(`${w}: genau vier Meditationen`);
    p.meditations.forEach((m) => {
      if (!(m.minutes >= 5 && m.minutes <= 20)) at(`${w}: Meditation "${m.title}" muss zwischen 5 und 20 Minuten liegen`);
      slot(MED_SLOT(m.kind), `${w} Meditation ${m.title}`);
      const steps = medSteps(m.kind, { name: c.name, pos: c.position, color: p.colors[0].name, syllable: c.syllable });
      if (steps.length < 5) at(`${w}: Meditation "${m.title}" braucht mindestens fünf Schritte`);
      keep(`${w} Meditation`, ...steps);
    });
    if (p.colors.length !== 3) at(`${w}: drei Farben erwartet`);
    if (!p.under.length || !p.over.length || !p.balanced.length) at(`${w}: Balance-Listen unvollständig`);
    keep(w, p.lead, p.card.text, ...p.meaning, ...p.under, ...p.over, ...p.balanced, ...p.affirmations);
  }
  Object.keys(MED_KINDS).forEach((k) => slot(`chakren-med-${k}`, `Meditationsart ${k}`));
  pageSlots().forEach((s) => slot(s.name, "Bildplatz"));
  for (const [k, y] of Object.entries(YOGA)) { if (y.level === "Fortgeschritten" && !y.caution) at(`Yoga ${k}: fortgeschrittene Haltung braucht einen Hinweis`); keep(`Yoga ${k}`, y.note, y.caution); }
  for (const dict of [STONES, FOODS, SCENTS, NATURE]) for (const [k, it] of Object.entries(dict)) keep(k, it.note, it.caution);
  for (const [where, t] of texts) {
    if (DOSAGE.test(t)) at(`${where}: enthält eine Mengen- oder Dosierungsangabe ("${t.slice(0, 50)}")`);
    if (PROMISE.test(t)) at(`${where}: enthält ein Heilversprechen ("${t.slice(0, 50)}")`);
  }
  if (!/keine medizinische Beratung/i.test(PAGE_NOTICE) || !/Source pending verification/i.test(PAGE_NOTICE)) at("Hinweis: braucht „keine medizinische Beratung“ und „Source pending verification“");
  return errors;
}
