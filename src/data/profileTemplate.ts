/**
 * The fixed structure of the plant profile TEMPLATE (rules: docs/PROFIL-TEMPLATE.md).
 *
 * Ashwagandha (layout "kraut") is the reference page for ALL plant-like atlas entries (categories kraut, blume, baum, obst, gemuese,
 * pilz; not kristall). `deriveProfile(entry, ctx)` (src/data/profileDerive.ts) fills a `PlantProfile` from the atlas entry, the
 * graded claims, the recipes and the organs; the renderer (src/ui/plantProfile.ts `fullHtml`) shows it. Hand-written profiles
 * (PROFILES in profiles.ts) always win. A section without data is NOT invented: it stays empty and shows the placeholder below.
 *
 * This file holds only STRUCTURE and FIXED LABELS, never content about a single plant. It has NO imports on purpose: Node loads it
 * directly (scripts/validate.ts, the gap report), so everything here is plain data and small pure functions.
 * Checked by validateProfileTemplate.ts (runs in `npm run validate:data`).
 */

// ------------------------------------------------------------------------------------------------------------------ which entries

/** Atlas categories that get the plant profile page. */
export const PLANT_LIKE: readonly string[] = ["kraut", "blume", "baum", "obst", "gemuese", "pilz"];
/** Atlas categories that are deliberately NOT plant-like (crystals have their own atlas page). Every atlas category must be in one of the two lists. */
export const NOT_PLANT_LIKE: readonly string[] = ["kristall"];
/** The category that gets the mushroom panel `pp-fungus` instead of the botanical traits `pp-traits`. */
export const MUSHROOM = "pilz";
export const isPlantLike = (category: string): boolean => PLANT_LIKE.includes(category);
export const isMushroom = (category: string): boolean => category === MUSHROOM;

/** The fixed look of every derived profile: the herb layout of the reference page, no drawing (a drawn herb must not stand in for an oak or a mushroom), no photo gallery. */
export const DERIVED = { layout: "kraut", art: "none", gallery: false } as const;

/** Maximum list lengths so that a derived page keeps the proportions of the reference page. */
export const LIMITS = { tags: 4, bubbles: 5, network: 9 } as const;

// ------------------------------------------------------------------------------------------------------------------ fixed texts

/** The headings and sub lines of a derived profile (same shape as ProfileTexts in profileTypes.ts). Neutral wording: no effect is hinted at. */
export interface TemplateTexts {
  parts: string; partsSub: string;
  traits: string;
  origin: string; originSub: string;
  effects: string; effectsSub: string;
  compounds: string; compoundsSub: string;
  freqSub: string;
  forms: string; formsSub: string;
  combos: string; combosSub: string;
  history: string; historySub: string;
  researchSub: string;
  networkSub: string;
}

export const TEXTS: TemplateTexts = {
  parts: "Die Pflanze", partsSub: "Bestandteile und ihre Verwendung.",
  traits: "Botanische Merkmale",
  origin: "Ursprung & Verbreitung", originSub: "Herkunft nach Lehrbuchwissen (Source pending verification).",
  effects: "Wirkung & Anwendungsbereiche", effectsSub: "Traditionell und erforscht, mit Belegstufe.",
  compounds: "Inhaltsstoffe", compoundsSub: "Bekannte Inhaltsstoffe laut Atlas-Eintrag.",
  freqSub: "Frequenz-Angaben sind Überlieferung und erscheinen nur mit Belegstufe.",
  forms: "Anwendungsformen", formsSub: "Rezepte der Werkbank, in denen dieser Eintrag vorkommt.",
  combos: "Kombinationen", combosSub: "Wird in der Überlieferung gemeinsam mit anderen Einträgen genannt.",
  history: "Geschichte & Kultur", historySub: "Verwendung im Laufe der Zeit.",
  researchSub: "Studien zu den Aussagen dieses Eintrags und die Quellen des Atlas-Eintrags.",
  networkSub: "Verbundene Einträge, Körperbereiche und Aussagen.",
};

/** Mushroom pages: only the first heading differs. */
export const TEXTS_MUSHROOM: TemplateTexts = { ...TEXTS, parts: "Der Pilz", partsSub: "Teile des Pilzes und ihre Verwendung." };

export const textsFor = (category: string): TemplateTexts => (isMushroom(category) ? TEXTS_MUSHROOM : TEXTS);

// ------------------------------------------------------------------------------------------------------------------ sections

export interface SectionDef {
  /** the id of the panel in the renderer (`panel("pp-...")`) */
  id: string;
  title: string;
  /** may be "" (the renderer has no sub line for this panel) */
  sub: string;
  /** which entries have the section: botanical traits only for plants, the mushroom panel only for mushrooms */
  appliesTo: "both" | "plant" | "mushroom";
  /** one sentence: from which data the section is built */
  source: string;
  /** one sentence: when the section counts as filled (otherwise it is a placeholder and stands in the list of missing content) */
  filledWhen: string;
  /** the dim placeholder text: honest, claims no content */
  placeholder: string;
  /** short name for the list of missing content */
  missingLabel: string;
  /** mushroom pages: other heading (only where it differs) */
  mushroomTitle?: string;
}

/** ALL sections of the page in page order (rows of the herb layout: a = plant + traits/fungus, b = origin, sensory, growth, c = compounds, effects, freq, d = forms, combos, e = history, research, network). */
export const SECTIONS: readonly SectionDef[] = [
  {
    id: "pp-plant", title: TEXTS.parts, mushroomTitle: TEXTS_MUSHROOM.parts, sub: TEXTS.partsSub, appliesTo: "both",
    source: "Nur Handprofil: Die Bildtafel mit beschrifteten Teilen braucht ein Bild und Positionen. Aus dem Atlas kommt nur der Fakt „Verwendete Teile“, er steht unter „Auf einen Blick“.",
    filledWhen: "Nie bei abgeleiteten Profilen (nur Handprofil).",
    placeholder: "Noch nicht erfasst: Die beschriftete Bildtafel mit den Teilen folgt.",
    missingLabel: "Teile (Bildtafel)",
  },
  {
    id: "pp-fungus", title: "Lebensraum, Aussehen & Verwechslung", sub: "Angaben aus dem Atlas-Eintrag. Diese Seite ersetzt keine Pilzberatung.", appliesTo: "mushroom",
    source: "Fakten des Atlas-Eintrags: Vorkommen, Aussehen, Giftig/Verwendung/Hinweis, Besonderheit/Namen; Verwechslung, sobald ein Fakt „Verwechslung“ existiert (siehe FUNGUS_FIELDS).",
    filledWhen: "Mindestens ein Pilz-Feld hat einen Wert; leere Felder zeigen ihren eigenen Platzhalter und stehen einzeln in der Fehlliste.",
    placeholder: "Noch nicht erfasst.",
    missingLabel: "Pilz-Felder",
  },
  {
    id: "pp-traits", title: TEXTS.traits, sub: "", appliesTo: "plant",
    source: "Atlas-Fakten mit Merkmals-Beschriftung (Besonderheit, Aussehen, Höhe, Blütezeit, Standort … laut FACT_ROUTES).",
    filledWhen: "Mindestens ein Atlas-Fakt mit Merkmals-Beschriftung ist vorhanden.",
    placeholder: "Noch nicht erfasst.",
    missingLabel: "Merkmale",
  },
  {
    id: "pp-origin", title: TEXTS.origin, sub: TEXTS.originSub, appliesTo: "both",
    source: "Atlas-Fakt Heimat, Herkunft oder Vorkommen und die Herkunftsregion in ORIGIN (src/data/plants.ts, Karte). Bei Pilzen geht „Vorkommen“ in das Pilz-Feld Lebensraum; hier zählen nur Heimat/Herkunft und ORIGIN.",
    filledWhen: "Ein Fakt Heimat/Herkunft/Vorkommen ist vorhanden (Pilze: nur Heimat/Herkunft) oder der Eintrag steht in ORIGIN.",
    placeholder: "Noch nicht erfasst: Herkunftsangabe und Karte fehlen.",
    missingLabel: "Herkunft & Karte",
  },
  {
    id: "pp-sensory", title: "Geschmack, Duft & Textur", sub: "", appliesTo: "both",
    source: "Atlas-Fakten Geschmack, Duft und Textur (bei keinem Eintrag vorhanden, bis ein Redakteur sie einträgt).",
    filledWhen: "Mindestens ein Fakt Geschmack, Duft oder Textur ist vorhanden.",
    placeholder: "Noch nicht erfasst.",
    missingLabel: "Geschmack, Duft, Textur",
  },
  {
    id: "pp-growth", title: "Wachstumszyklus", sub: "", appliesTo: "both",
    source: "Nur Handprofil: Die Stufen mit Zeiträumen und Bildern gibt es nicht als Atlas-Fakt.",
    filledWhen: "Nie bei abgeleiteten Profilen (nur Handprofil).",
    placeholder: "Noch nicht erfasst: Der Wachstumszyklus fehlt.",
    missingLabel: "Wachstumszyklus",
  },
  {
    id: "pp-compounds", title: TEXTS.compounds, sub: TEXTS.compoundsSub, appliesTo: "both",
    source: "Atlas-Fakten Inhaltsstoffe, Inhaltsstoff, Inhalt, Scharfstoffe, Farbstoff, Hauptbestandteil des ätherischen Öls (als eine Gruppe „Laut Atlas-Eintrag“, ohne Mengen).",
    filledWhen: "Mindestens ein Inhaltsstoff-Fakt ist vorhanden.",
    placeholder: "Noch nicht erfasst: Eine geprüfte Liste der Inhaltsstoffe fehlt.",
    missingLabel: "Inhaltsstoffe",
  },
  {
    id: "pp-effects", title: TEXTS.effects, sub: TEXTS.effectsSub, appliesTo: "both",
    source: "Die veröffentlichten Aussagen, die am Atlas-Eintrag eingetragen sind (claims); jede mit ihrer Belegstufe. Die Seite selbst behauptet keine Wirkung.",
    filledWhen: "Mindestens eine veröffentlichte Aussage ist am Eintrag eingetragen.",
    placeholder: "Noch keine Aussage zu diesem Eintrag erfasst.",
    missingLabel: "Aussagen (Wirkung)",
  },
  {
    id: "pp-freq", title: "Frequenzen & Geometrie", sub: TEXTS.freqSub, appliesTo: "both",
    source: "Nur Handprofil: Ein Hertz-Wert wird nie abgeleitet, er braucht eine Quelle und eine Aussage mit Belegstufe.",
    filledWhen: "Nie bei abgeleiteten Profilen (nur Handprofil).",
    placeholder: "Noch keine Frequenz-Angabe erfasst. Die Seite nennt keinen Wert ohne Quelle.",
    missingLabel: "Frequenz",
  },
  {
    id: "pp-forms", title: TEXTS.forms, sub: TEXTS.formsSub, appliesTo: "both",
    source: "Rezepte der Werkbank (src/data/recipes*.ts), in deren Zutaten die ID des Eintrags steht; nur Name und Herkunft des Rezepts, keine Mengen.",
    filledWhen: "Mindestens ein Rezept nennt die ID des Eintrags in seinen Zutaten.",
    placeholder: "Noch kein Rezept der Werkbank nennt diesen Eintrag.",
    missingLabel: "Anwendungsformen (Rezepte)",
  },
  {
    id: "pp-combos", title: TEXTS.combos, sub: TEXTS.combosSub, appliesTo: "both",
    source: "Die Kombinationen des Atlas-Eintrags (combinations) mit ihrer Herkunft (Überlieferung, modern, unklar).",
    filledWhen: "Mindestens eine Kombination ist am Eintrag eingetragen.",
    placeholder: "Noch keine Kombination erfasst.",
    missingLabel: "Kombinationen",
  },
  {
    id: "pp-history", title: TEXTS.history, sub: TEXTS.historySub, appliesTo: "both",
    source: "Nur Handprofil: Eine Zeitleiste braucht Datierungen. Der Kurztext des Atlas-Eintrags (tradition) steht im Kopf der Seite.",
    filledWhen: "Nie bei abgeleiteten Profilen (nur Handprofil).",
    placeholder: "Noch nicht erfasst: Die Zeitleiste fehlt.",
    missingLabel: "Geschichte (Zeitleiste)",
  },
  {
    id: "pp-research", title: "Forschung", sub: TEXTS.researchSub, appliesTo: "both",
    source: "Quellen mit Adresse aus den Aussagen des Eintrags (Studien) und die Quellen des Atlas-Eintrags (hinter „Alle Studien anzeigen“); alle als „Source pending verification“, solange nicht geprüft.",
    filledWhen: "Mindestens eine Quelle mit Adresse (url) ist vorhanden.",
    placeholder: "Noch keine Quelle mit Adresse erfasst.",
    missingLabel: "Forschung & Quellen",
  },
  {
    id: "pp-network", title: "Wissensnetz", sub: TEXTS.networkSub, appliesTo: "both",
    source: "Kombinationen mit anderen Einträgen, Zuordnungen zu Organen der Körper-Seite (nur ganze Wörter, wie auf der Körper-Seite), Aussagen des Eintrags und Kulturen aus den Zuordnungen.",
    filledWhen: "Mindestens ein Knoten ist vorhanden.",
    placeholder: "Noch keine Verknüpfung erfasst.",
    missingLabel: "Wissensnetz",
  },
];

/** The sections a profile of this category shows, in page order. */
export const sectionsFor = (category: string): readonly SectionDef[] =>
  SECTIONS.filter((s) => s.appliesTo === "both" || s.appliesTo === (isMushroom(category) ? "mushroom" : "plant"));

// ------------------------------------------------------------------------------------------------------------------ vocabulary of the atlas facts

export type FactTarget = "glance" | "traits" | "origin" | "sensory" | "compounds" | "safety";
export interface FactRoute { label: string; to: FactTarget; icon: string }

/**
 * The vocabulary of atlas facts (`facts[].label` in content/atlas/*.json) the template understands. To fill a section, an editor
 * adds a fact with exactly this label. A fact with another label is not lost: it appears under "Auf einen Blick" (GLANCE_FALLBACK_ICON).
 * Heimat and Herkunft appear under "Auf einen Blick" as well (label "Herkunft"). Giftig and Hinweis ALWAYS also go into the safety text
 * (composeSafety). Mushrooms: the labels of FUNGUS_FIELDS win over this table (factRoute).
 * Existing labels in the atlas today: Familie, Verwendete Teile, Heimat, Herkunft, Inhaltsstoffe, Inhaltsstoff, Inhalt, Scharfstoffe,
 * Farbstoff, Hauptbestandteil des ätherischen Öls, Besonderheit, Hinweis, Vorkommen, Verwendung, Giftig, Aussehen, Namen.
 * The trait and sense labels (Höhe … Textur) exist for the future; they are the same rows the reference page has.
 */
export const FACT_ROUTES: readonly FactRoute[] = [
  { label: "Familie", to: "glance", icon: "family" },
  { label: "Verwendete Teile", to: "glance", icon: "root" },
  { label: "Heimat", to: "origin", icon: "globe" },
  { label: "Herkunft", to: "origin", icon: "globe" },
  { label: "Vorkommen", to: "origin", icon: "globe" },
  { label: "Inhaltsstoffe", to: "compounds", icon: "flask" },
  { label: "Inhaltsstoff", to: "compounds", icon: "flask" },
  { label: "Inhalt", to: "compounds", icon: "flask" },
  { label: "Scharfstoffe", to: "compounds", icon: "flask" },
  { label: "Farbstoff", to: "compounds", icon: "flask" },
  { label: "Hauptbestandteil des ätherischen Öls", to: "compounds", icon: "flask" },
  { label: "Besonderheit", to: "traits", icon: "sparkle" },
  { label: "Aussehen", to: "traits", icon: "palette" },
  { label: "Höhe", to: "traits", icon: "ruler" },
  { label: "Blütezeit", to: "traits", icon: "flower" },
  { label: "Fruchtzeit", to: "traits", icon: "berry" },
  { label: "Erntezeit", to: "traits", icon: "sprout" },
  { label: "Standort", to: "traits", icon: "sun" },
  { label: "Boden", to: "traits", icon: "soil" },
  { label: "Klima", to: "traits", icon: "thermo" },
  { label: "Vermehrung", to: "traits", icon: "seed" },
  { label: "Lebensdauer", to: "traits", icon: "clock" },
  { label: "Geschmack", to: "sensory", icon: "tongue" },
  { label: "Duft", to: "sensory", icon: "nose" },
  { label: "Textur", to: "sensory", icon: "texture" },
  { label: "Giftig", to: "safety", icon: "shield" },
  { label: "Hinweis", to: "safety", icon: "shield" },
];

/** Icon of an atlas fact with an unknown label (shown under "Auf einen Blick"). */
export const GLANCE_FALLBACK_ICON = "leaf";
/** First row of "Auf einen Blick": always present, the value is the scientific name of the atlas entry. */
export const GLANCE_NAME = { icon: "dna", label: "Wissenschaftlicher Name" } as const;
/** The atlas fact labels that feed the safety text. */
export const SAFETY_FACTS = { poison: "Giftig", hint: "Hinweis" } as const;

/** Where an atlas fact goes. For mushrooms the fields of FUNGUS_FIELDS come first (`to: "fungus"`, `field` = the field id). */
export function factRoute(label: string, mushroom: boolean): { to: FactTarget | "fungus"; icon: string; field?: string } {
  if (mushroom) {
    const f = FUNGUS_FIELDS.find((d) => d.factLabels.includes(label));
    if (f) return { to: "fungus", icon: f.icon, field: f.id };
  }
  const r = FACT_ROUTES.find((x) => x.label === label);
  return r ? { to: r.to, icon: r.icon } : { to: "glance", icon: GLANCE_FALLBACK_ICON };
}

/**
 * Icons for the "Themen in der Überlieferung" bubbles: the first rule whose word is a WHOLE word of the association target wins
 * (same matching as `match` in src/data/body.ts). No rule: BUBBLE_FALLBACK_ICON. Only associations with origin "traditional" become bubbles.
 */
export const BUBBLE_ICONS: readonly { words: readonly string[]; icon: string }[] = [
  { words: ["Magen", "Darm", "Verdauung"], icon: "gut" },
  { words: ["Gehirn", "Nervensystem"], icon: "brain" },
  { words: ["Immunsystem"], icon: "shield" },
  { words: ["Lunge", "Atemwege"], icon: "lungs" },
  { words: ["Herz", "Kreislauf"], icon: "heart" },
  { words: ["Nieren", "Harnwege"], icon: "kidney" },
  { words: ["Haut"], icon: "drop" },
  { words: ["Knochen"], icon: "bone" },
  { words: ["Muskeln"], icon: "muscle" },
  { words: ["Hormone", "Schilddrüse"], icon: "balance" },
];
export const BUBBLE_FALLBACK_ICON = "sparkle";

/** Icon of a recipe card in "Anwendungsformen" by the vessel of the recipe (VesselKind in recipeTypes.ts). */
export const VESSEL_ICONS: Readonly<Record<string, string>> = {
  becher: "cup", topf: "pot", schale: "bowl", glas: "jar", dampf: "pot", moerser: "bowl", raeucher: "flame",
};
export const VESSEL_FALLBACK_ICON = "bowl";

// ------------------------------------------------------------------------------------------------------------------ mushrooms

export interface FungusFieldDef {
  id: string;
  label: string;
  /** a key of ICON in src/ui/icons.ts */
  icon: string;
  /** the atlas fact labels that feed the field, in display order. More than one label: one line per fact, "Label: text". */
  factLabels: readonly string[];
  /** shown when no fact exists; honest, claims no content */
  placeholder: string;
  /** safety-relevant: highlighted on the page, listed first in the list of missing content */
  safety?: boolean;
}

/**
 * The extra fields of the mushroom panel `pp-fungus`, in display order. Every atlas fact of a mushroom ends up in a field, in
 * "Auf einen Blick" (Familie, Verwendete Teile) or in the compounds, so nothing is lost. "Verwechslung" is a fact label that no
 * atlas entry has yet: until an editor adds it, the field shows its placeholder (a safety hint, not a claim).
 */
export const FUNGUS_FIELDS: readonly FungusFieldDef[] = [
  { id: "habitat", label: "Lebensraum", icon: "tree", factLabels: ["Vorkommen"], placeholder: "Noch nicht erfasst." },
  { id: "look", label: "Aussehen", icon: "palette", factLabels: ["Aussehen"], placeholder: "Noch nicht erfasst." },
  {
    id: "lookalikes", label: "Verwechslungsgefahr", icon: "shield", factLabels: ["Verwechslung"], safety: true,
    placeholder: "Noch nicht erfasst. Bis dahin gilt: keinen Wildpilz essen, den eine Fachperson nicht sicher bestimmt hat.",
  },
  { id: "use", label: "Verwendung & Giftigkeit", icon: "bowl", factLabels: ["Giftig", "Verwendung", "Hinweis"], placeholder: "Noch nicht erfasst." },
  { id: "notes", label: "Besonderheiten & Namen", icon: "sparkle", factLabels: ["Besonderheit", "Namen"], placeholder: "Noch nicht erfasst." },
];

/** The text of one mushroom field from the atlas facts, or null when none of its facts exists. Several facts: one line each, "Label: text". */
export function fungusValue(def: FungusFieldDef, facts: readonly { label: string; value: string }[]): string | null {
  const lines: string[] = [];
  for (const l of def.factLabels) {
    const f = facts.find((x) => x.label === l);
    const v = f ? f.value.trim() : "";
    if (v) lines.push(def.factLabels.length > 1 ? `${l}: ${v}` : v);
  }
  return lines.length ? lines.join("\n") : null;
}

// ------------------------------------------------------------------------------------------------------------------ safety

const GENERIC = "Information, keine medizinische Beratung. Pflanzen können Wechselwirkungen mit Medikamenten haben; bei Beschwerden, Schwangerschaft oder Medikamenten bitte ärztlich oder in der Apotheke nachfragen.";
const WILD = "Wildpflanzen und Pilze nur sammeln und essen, wenn eine Fachperson sie sicher bestimmt hat.";
/** NEW sentence (not in the short profile before): the one general safety sentence about poisonous look-alikes and safe identification. */
const MUSHROOM_EXTRA = "Viele essbare Pilze haben giftige Doppelgänger; Fotos und Bestimmungs-Apps ersetzen nicht die Bestimmung durch eine Fachperson.";

/**
 * The fixed safety sentences (no dosages, no promises of healing). `generic` and `wild` are word for word the two sentences of the
 * short profile (genericHtml in src/ui/plantProfile.ts). `mushroom` = `wild` + the one new sentence (MUSHROOM_EXTRA).
 * `poisonous` and `hint` only frame the atlas fact "Giftig" / "Hinweis", which is quoted word for word after them.
 */
export const SAFETY_TEXT = {
  generic: GENERIC,
  wild: WILD,
  mushroom: `${WILD} ${MUSHROOM_EXTRA}`,
  poisonous: "Laut Atlas-Eintrag giftig:",
  hint: "Hinweis aus dem Atlas-Eintrag:",
} as const;

const endSentence = (s: string): string => (/[.!?]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);

/**
 * The safety paragraph of a derived profile (`PlantProfile.safety`). Order: the poison statement first (when the atlas has the fact
 * "Giftig"), then the general sentence, then the wild-collecting sentence (mushrooms: the stronger mushroom sentences), then the
 * atlas fact "Hinweis". The sentence "keine medizinische Beratung" is always part of it.
 */
export function composeSafety(o: { mushroom: boolean; poison?: string | null; hint?: string | null }): string {
  const parts: string[] = [];
  if (o.poison && o.poison.trim()) parts.push(endSentence(`${SAFETY_TEXT.poisonous} ${o.poison}`));
  parts.push(SAFETY_TEXT.generic, o.mushroom ? SAFETY_TEXT.mushroom : SAFETY_TEXT.wild);
  if (o.hint && o.hint.trim()) parts.push(endSentence(`${SAFETY_TEXT.hint} ${o.hint}`));
  return parts.join(" ");
}

/**
 * A claim whose id ends with this suffix is a SAFETY statement (ashwagandha-safety, granatapfel-safety). The page shows it openly in the
 * safety section together with its studies, never behind a click or in the collapsed part of "Forschung".
 */
export const SAFETY_CLAIM_SUFFIX = "-safety";
export const isSafetyClaim = (claimId: string): boolean => claimId.endsWith(SAFETY_CLAIM_SUFFIX);

/** The tab names of "Kombinationen" by the origin of the pairing (a pairing is never labelled "traditional" when the atlas says otherwise). */
export const COMBO_TABS = { traditional: "Traditionelle Mischungen", modern: "Moderne Kombinationen", unknown: "Herkunft unklar" } as const;

/** Fixed short notes under the filled sections of a derived profile (status of the data, no content about a single plant). */
export const NOTES = {
  facts: "Angaben aus dem Atlas-Eintrag, nicht fachlich geprüft (Source pending verification).",
  region: "Grobe Darstellung der Region nach Lehrbuchwissen (Source pending verification).",
  compounds: "Angaben des Atlas-Eintrags ohne Mengen. Eine geprüfte Liste der Einzelstoffe fehlt noch (Source pending verification).",
  recipe: "Rezept der Werkbank",
} as const;

// ------------------------------------------------------------------------------------------------------------------ pictures

export interface ImageSlotRule {
  /** picture names; <id> is the atlas id */
  patterns: readonly string[];
  /** true: slotDef in src/assets/registry.ts accepts every id for these names (checked against the registry by validateProfileTemplate.ts) */
  dynamic: boolean;
  /** where the page uses them */
  uses: readonly string[];
  note: string;
}

/**
 * Which picture names the template knows for an entry. Only `dynamic` names work for every entry without touching the registry;
 * a name that is not registered cannot be filled (the slot warns "Unknown image slot" as soon as a file with that name exists).
 * Until the file exists, the page shows the neutral "Bild folgt" placeholder.
 */
export const IMAGE_SLOTS: readonly ImageSlotRule[] = [
  {
    patterns: ["atlas-<id>"], dynamic: true,
    uses: ["Kopf der Seite (Titelbild)", "Auf einen Blick (Bild)", "Wissensnetz (Mittelpunkt und Knoten anderer Einträge)"],
    note: "Das Atlas-Bild, das für jeden Eintrag vorgesehen ist (1000 x 1000, Motiv auf Schwarz).",
  },
  {
    patterns: ["nutrient-<id>"], dynamic: false,
    uses: ["Wissensnetz (Rückfall hinter atlas-<id>)"],
    note: "Nicht dynamisch: registry.ts kennt nur acht feste Namen (ashwagandha, kurkuma, ingwer, knoblauch, gruener-tee, magnesium, omega3, vitamin-d). Der Renderer fragt vorher hasAsset(); ein fehlender Name zeigt den Platzhalter.",
  },
  {
    patterns: ["plant-<id>-hero", "plant-<id>-sketch", "plant-<id>-parts", "plant-<id>-photo", "plant-<id>-origin", "plant-<id>-powder", "plant-<id>-bowl", "plant-<id>-stage-<n>", "plant-<id>-thumb-<teil>"], dynamic: false,
    uses: ["Handprofile (Ashwagandha, Granatapfel)"],
    note: "Nicht dynamisch: nur für Ashwagandha und Granatapfel in registry.ts angelegt. Abgeleitete Profile zeigen dafür Platzhalter. Sollen sie für jeden Eintrag gelten, braucht slotDef ein Muster dafür (offene Entscheidung).",
  },
];

// ------------------------------------------------------------------------------------------------------------------ pages of the template

/** Section ids of the required parts, in page order (the validator checks SECTIONS against this list). */
export const SECTION_ORDER: readonly string[] = [
  "pp-plant", "pp-fungus", "pp-traits", "pp-origin", "pp-sensory", "pp-growth", "pp-compounds", "pp-effects", "pp-freq", "pp-forms", "pp-combos", "pp-history", "pp-research", "pp-network",
];
