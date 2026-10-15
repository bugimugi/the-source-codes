import {
  BUBBLE_FALLBACK_ICON, BUBBLE_ICONS, DERIVED, FACT_ROUTES, FUNGUS_FIELDS, GLANCE_FALLBACK_ICON, GLANCE_NAME, IMAGE_SLOTS, LIMITS, MUSHROOM,
  NOT_PLANT_LIKE, PLANT_LIKE, SAFETY_FACTS, SAFETY_TEXT, SECTION_ORDER, SECTIONS, TEXTS, TEXTS_MUSHROOM, VESSEL_FALLBACK_ICON, VESSEL_ICONS,
  composeSafety, factRoute, fungusValue, sectionsFor,
} from "./profileTemplate.ts";
import { VESSEL_LABEL } from "./recipeTypes.ts";
import { ICON } from "../ui/icons.ts";

/** every key of ProfileTexts (profileTypes.ts): a derived profile fills all of them */
const TEXT_KEYS = [
  "parts", "partsSub", "traits", "origin", "originSub", "effects", "effectsSub", "compounds", "compoundsSub", "freqSub",
  "forms", "formsSub", "combos", "combosSub", "history", "historySub", "researchSub", "networkSub",
];
/** fixed texts must stay free of dosages and promises of healing (CLAUDE.md, Schutzlinie 3) */
const DOSAGE = /\d+\s?(mg|g|kg|ml|l|µg|mcg|tropfen|kapseln?|tabletten?|tl|el|tassen?|esslöffel|teelöffel)\b/i;
const PROMISE = /\b(heilt|heilen|garantiert|wundermittel)\b/i;
const MAX_PLACEHOLDER = 160;

/**
 * Checks the plant profile template (profileTemplate.ts): the plant-like categories exist in the atlas and every atlas category is
 * either plant-like or deliberately not; the sections are complete, in page order, unique and carry source, placeholder and
 * list label; the mushroom fields have a known icon and no fact feeds two fields; the fact vocabulary, the icons and the fixed safety
 * texts hold together (safety wording present, no dosage, no promise of healing); the picture patterns agree with the registry.
 * `atlasCategories`: the categories that occur in content/atlas; `slotExists`: the registry lookup. Returns blocking errors.
 */
export function validateProfileTemplate(atlasCategories: ReadonlySet<string>, slotExists: (name: string) => boolean): string[] {
  const errors: string[] = [];
  const at = (m: string) => errors.push(`Profil-Vorlage: ${m}`);
  const icon = (name: string, where: string) => { if (!name || !Object.hasOwn(ICON, name)) at(`${where}: Icon "${name}" gibt es nicht in src/ui/icons.ts`); };
  const text = (value: string, where: string) => { if (!value || !value.trim()) at(`${where}: Text fehlt`); };
  const fixed: { where: string; value: string }[] = [];

  // ---- categories
  if (!PLANT_LIKE.length) at("PLANT_LIKE ist leer");
  if (new Set(PLANT_LIKE).size !== PLANT_LIKE.length) at("PLANT_LIKE enthält eine Kategorie doppelt");
  if (!PLANT_LIKE.includes(MUSHROOM)) at(`PLANT_LIKE enthält "${MUSHROOM}" nicht`);
  for (const c of PLANT_LIKE) {
    if (!atlasCategories.has(c)) at(`PLANT_LIKE: Kategorie "${c}" gibt es in content/atlas nicht`);
    if (NOT_PLANT_LIKE.includes(c)) at(`Kategorie "${c}" steht in PLANT_LIKE und in NOT_PLANT_LIKE`);
  }
  for (const c of atlasCategories) {
    if (!PLANT_LIKE.includes(c) && !NOT_PLANT_LIKE.includes(c)) at(`Atlas-Kategorie "${c}" ist weder in PLANT_LIKE noch in NOT_PLANT_LIKE: bitte entscheiden, ob sie die Pflanzenseite bekommt`);
  }
  if (DERIVED.layout !== "kraut") at('DERIVED.layout muss "kraut" sein (Ashwagandha ist die Vorlage)');
  if (DERIVED.art !== "none") at('DERIVED.art muss "none" sein (keine gezeichnete Ersatzpflanze für eine andere Art)');
  for (const [k, v] of Object.entries(LIMITS)) if (!Number.isInteger(v) || v < 1) at(`LIMITS.${k} muss eine ganze Zahl ab 1 sein`);

  // ---- headings
  for (const [name, t] of [["TEXTS", TEXTS], ["TEXTS_MUSHROOM", TEXTS_MUSHROOM]] as const) {
    for (const k of TEXT_KEYS) {
      const v = (t as unknown as Record<string, string | undefined>)[k];
      text(v ?? "", `${name}.${k}`);
      if (v) fixed.push({ where: `${name}.${k}`, value: v });
    }
  }

  // ---- sections
  if (!SECTIONS.length) at("SECTIONS ist leer");
  const ids = new Set<string>(), labels = new Set<string>();
  for (const s of SECTIONS) {
    const w = `Abschnitt ${s.id || "(ohne Id)"}`;
    if (!s.id.startsWith("pp-")) at(`${w}: die Id muss mit "pp-" beginnen`);
    if (ids.has(s.id)) at(`${w}: doppelt`);
    ids.add(s.id);
    text(s.title, `${w}: title`); text(s.source, `${w}: source`); text(s.filledWhen, `${w}: filledWhen`);
    text(s.placeholder, `${w}: placeholder`); text(s.missingLabel, `${w}: missingLabel`);
    if (s.placeholder.length > MAX_PLACEHOLDER) at(`${w}: placeholder ist länger als ${MAX_PLACEHOLDER} Zeichen (soll dezent bleiben)`);
    if (labels.has(s.missingLabel)) at(`${w}: missingLabel "${s.missingLabel}" gibt es schon`);
    labels.add(s.missingLabel);
    const expected = s.id === "pp-fungus" ? "mushroom" : s.id === "pp-traits" ? "plant" : "both";
    if (s.appliesTo !== expected) at(`${w}: appliesTo ist "${s.appliesTo}", erwartet "${expected}"`);
    fixed.push({ where: `${w}: placeholder`, value: s.placeholder });
  }
  if (SECTIONS.map((s) => s.id).join() !== SECTION_ORDER.join()) at(`SECTIONS müssen genau diese Abschnitte in dieser Seitenreihenfolge haben: ${SECTION_ORDER.join(", ")}`);
  const plantIds = sectionsFor("kraut").map((s) => s.id), fungusIds = sectionsFor(MUSHROOM).map((s) => s.id);
  if (plantIds.includes("pp-fungus")) at("Pflanzen dürfen das Pilz-Feld pp-fungus nicht bekommen");
  if (!fungusIds.includes("pp-fungus") || fungusIds.includes("pp-traits")) at("Pilze brauchen pp-fungus und dürfen pp-traits nicht bekommen");

  // ---- mushroom fields
  const fieldIds = new Set<string>(), factOwner = new Map<string, string>();
  for (const f of FUNGUS_FIELDS) {
    const w = `Pilz-Feld ${f.id || "(ohne Id)"}`;
    if (fieldIds.has(f.id)) at(`${w}: doppelt`);
    fieldIds.add(f.id);
    text(f.label, `${w}: label`); text(f.placeholder, `${w}: placeholder`);
    icon(f.icon, w);
    if (f.placeholder.length > MAX_PLACEHOLDER) at(`${w}: placeholder ist länger als ${MAX_PLACEHOLDER} Zeichen`);
    if (!f.factLabels.length || f.factLabels.some((l) => !l.trim())) at(`${w}: factLabels fehlen`);
    for (const l of f.factLabels) {
      const owner = factOwner.get(l);
      if (owner) at(`${w}: der Fakt "${l}" speist schon das Feld "${owner}"`);
      factOwner.set(l, f.id);
    }
    fixed.push({ where: `${w}: placeholder`, value: f.placeholder });
  }
  for (const need of ["habitat", "look", "lookalikes", "use"]) if (!fieldIds.has(need)) at(`Pilz-Feld "${need}" fehlt`);
  const look = FUNGUS_FIELDS.find((f) => f.id === "lookalikes");
  if (look) {
    if (!look.safety) at("Pilz-Feld lookalikes muss safety: true haben");
    if (!look.placeholder.includes("Fachperson")) at("Pilz-Feld lookalikes: der Platzhalter muss den Sicherheitshinweis (Fachperson) enthalten");
  }
  const use = FUNGUS_FIELDS.find((f) => f.id === "use");
  if (use && !use.factLabels.includes(SAFETY_FACTS.poison)) at(`Pilz-Feld use muss den Fakt "${SAFETY_FACTS.poison}" enthalten`);
  if (look && fungusValue(look, []) !== null) at("fungusValue ohne Fakten muss null sein");
  if (use && fungusValue(use, [{ label: "Verwendung", value: "b" }, { label: "Giftig", value: "a" }]) !== "Giftig: a\nVerwendung: b") at("fungusValue: mehrere Fakten müssen zeilenweise mit Beschriftung in der Reihenfolge von factLabels stehen");

  // ---- fact vocabulary and icons
  const targets = new Set(["glance", "traits", "origin", "sensory", "compounds", "safety"]);
  const routeLabels = new Set<string>();
  for (const r of FACT_ROUTES) {
    const w = `Fakt-Route "${r.label}"`;
    if (routeLabels.has(r.label)) at(`${w}: doppelt`);
    routeLabels.add(r.label);
    if (!targets.has(r.to)) at(`${w}: unbekanntes Ziel "${r.to}"`);
    icon(r.icon, w);
  }
  for (const l of [SAFETY_FACTS.poison, SAFETY_FACTS.hint]) {
    const r = FACT_ROUTES.find((x) => x.label === l);
    if (!r || r.to !== "safety") at(`Fakt "${l}" muss in FACT_ROUTES zur Sicherheit (safety) führen`);
  }
  if (factRoute("Familie", false).to !== "glance") at('factRoute("Familie") muss "glance" sein');
  if (factRoute("Unbekannter Fakt", false).to !== "glance") at("factRoute: ein unbekannter Fakt muss unter „Auf einen Blick“ landen");
  if (factRoute("Vorkommen", true).to !== "fungus") at("factRoute: bei Pilzen muss Vorkommen in ein Pilz-Feld gehen");
  icon(GLANCE_FALLBACK_ICON, "GLANCE_FALLBACK_ICON"); icon(GLANCE_NAME.icon, "GLANCE_NAME");
  icon(BUBBLE_FALLBACK_ICON, "BUBBLE_FALLBACK_ICON"); icon(VESSEL_FALLBACK_ICON, "VESSEL_FALLBACK_ICON");
  for (const b of BUBBLE_ICONS) {
    if (!b.words.length || b.words.some((x) => !x.trim())) at("BUBBLE_ICONS: eine Regel hat kein Wort");
    icon(b.icon, `BUBBLE_ICONS (${b.words.join("/")})`);
  }
  for (const v of Object.keys(VESSEL_LABEL)) if (!VESSEL_ICONS[v]) at(`VESSEL_ICONS: Gefäß "${v}" hat kein Icon`);
  for (const [v, i] of Object.entries(VESSEL_ICONS)) icon(i, `VESSEL_ICONS (${v})`);

  // ---- safety texts
  for (const [k, v] of Object.entries(SAFETY_TEXT)) { text(v, `SAFETY_TEXT.${k}`); fixed.push({ where: `SAFETY_TEXT.${k}`, value: v }); }
  if (!SAFETY_TEXT.generic.includes("keine medizinische Beratung")) at('SAFETY_TEXT.generic muss „keine medizinische Beratung“ enthalten');
  if (!SAFETY_TEXT.wild.includes("Fachperson")) at("SAFETY_TEXT.wild muss die Fachperson-Regel enthalten");
  if (!SAFETY_TEXT.mushroom.startsWith(SAFETY_TEXT.wild) || !SAFETY_TEXT.mushroom.includes("Pilz")) at("SAFETY_TEXT.mushroom muss mit dem Wildpflanzen-Satz beginnen und Pilze nennen");
  const plant = composeSafety({ mushroom: false }), fungus = composeSafety({ mushroom: true }), poison = composeSafety({ mushroom: true, poison: "Giftpilz", hint: "Nicht sammeln" });
  for (const [name, s] of [["Pflanze", plant], ["Pilz", fungus], ["giftiger Pilz mit Hinweis", poison]] as const) {
    if (!s.includes("keine medizinische Beratung")) at(`composeSafety (${name}) enthält „keine medizinische Beratung“ nicht`);
  }
  if (!fungus.includes(SAFETY_TEXT.mushroom)) at("composeSafety (Pilz) enthält den Pilz-Sicherheitstext nicht");
  if (!poison.startsWith(SAFETY_TEXT.poisonous) || !poison.includes("Giftpilz") || !poison.includes(SAFETY_TEXT.hint) || !poison.includes("Nicht sammeln")) at("composeSafety: Giftig-Fakt (zuerst) und Hinweis-Fakt müssen im Text stehen");
  for (const f of fixed) {
    if (DOSAGE.test(f.value)) at(`${f.where}: enthält eine Mengenangabe (keine Dosierungen)`);
    if (PROMISE.test(f.value)) at(`${f.where}: enthält ein Heilversprechen`);
  }

  // ---- picture patterns against the registry
  if (!IMAGE_SLOTS.length) at("IMAGE_SLOTS ist leer");
  for (const rule of IMAGE_SLOTS) {
    if (!rule.patterns.length || !rule.uses.length) at(`IMAGE_SLOTS (${rule.patterns[0] ?? "?"}): patterns und uses dürfen nicht leer sein`);
    text(rule.note, `IMAGE_SLOTS (${rule.patterns[0] ?? "?"}): note`);
    for (const p of rule.patterns) {
      if (!p.includes("<id>")) { at(`IMAGE_SLOTS "${p}": das Muster braucht <id>`); continue; }
      const known = slotExists(p.replace("<id>", "probe"));
      if (rule.dynamic && !known) at(`IMAGE_SLOTS "${p}": als dynamic eingetragen, aber registry.ts (slotDef) kennt das Muster nicht`);
      if (!rule.dynamic && known) at(`IMAGE_SLOTS "${p}": registry.ts (slotDef) nimmt das Muster jetzt für jede ID an, dynamic muss true sein`);
    }
  }
  return errors;
}
