import type { AtlasEntry, Claim } from "./types.ts";
import type { Recipe } from "./recipeTypes.ts";

/**
 * Types of the plant profile pages (src/ui/plantProfile.ts). A profile is the long version of one atlas entry. There are two kinds:
 *  - written by hand (src/data/profiles.ts: Ashwagandha, Granatapfel), they always win;
 *  - DERIVED by `deriveProfile(entry, ctx)` (src/data/profileDerive.ts) from the atlas entry for every other plant-like entry
 *    (categories kraut, blume, baum, obst, gemuese, pilz). The fixed structure, labels and placeholders of that template live in
 *    src/data/profileTemplate.ts; the rules in docs/PROFIL-TEMPLATE.md.
 *
 * Pilot rules: statements about effects are NOT written here but live as graded claims in content/claims/ (shown with their
 * level); no amounts or dosages for use; everything marked "Vorlage" comes from the operator's reference picture and is unchecked
 * (Source pending verification). Positions of the callouts are percentages of the plant picture: adjust them when the final picture
 * `plant-<id>-parts` exists. Picture names must exist in src/assets/registry.ts (checked by `npm run validate:data`).
 *
 * WHAT MAY BE EMPTY (derived profiles): nothing is invented, so a section without data stays empty and the renderer shows the
 * placeholder of that section (SECTIONS[].placeholder in profileTemplate.ts):
 *  - empty array: bubbles, parts, traits, sensory, stages, compounds, effects, forms, combos, history, research, network
 *  - empty string: startPart (when parts is empty), lead, traitsNote, historyNote
 *  - missing optional object: origin, frequency, nutrients, fungus
 *  - never empty: id, layout, art, t, crumb, tags (at least the category), glance (at least the scientific name), safety
 * Hand-written profiles fill everything; they do not set `derived` or `missing`.
 */
export interface Box { lat0: number; lon0: number; lat1: number; lon1: number }

export interface ProfilePart {
  id: string;
  label: string;
  icon: string;
  title: string;
  text: string;
  /** callout text position and the point it links to, in percent of the picture */
  callout?: { at: [number, number]; to: [number, number]; side: "l" | "r"; short: string };
  /** a ring on the picture for parts without a callout (percent) */
  ring?: [number, number];
}

export interface ProfileCompound {
  title: string;
  /** a short label under the picture/thumbnail when the group has several items */
  thumb?: string;
  formula?: string;
  mass?: string;
  text: string;
  /** may be empty (derived profiles put the atlas fact as one bullet) */
  bullets: string[];
  bulletsNote?: string;
  /** picture of the structure or of the substance's source (slot name) */
  slot?: string;
}
export interface CompoundGroup { tab: string; items: ProfileCompound[] }

export interface NutrientRow {
  label: string;
  value: string;
  /** share of the EU reference value (0 – 1) for a bar; no bar when the reference is not defined */
  share?: number;
}

export interface MapLayer { label: string; color: string; boxes: Box[] }

export interface ProfileCombo { title: string; sub: string; ids: string[]; slot?: string }

export interface ProfileTexts {
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

/**
 * One field of the mushroom panel (`pp-fungus`). The definitions (id, label, icon, which atlas facts feed it) are FUNGUS_FIELDS in
 * profileTemplate.ts; the profile carries the filled-in result.
 */
export interface FungusField {
  /** id from FUNGUS_FIELDS: habitat, look, lookalikes, use, notes */
  id: string;
  label: string;
  icon: string;
  /** text from the atlas facts (several facts: one line each, "Fact label: text"); null = not recorded yet, the page shows the field's placeholder */
  value: string | null;
  /** safety-relevant field (look-alikes): highlighted on the page and listed first in the gap list */
  safety?: boolean;
}

export interface PlantProfile {
  id: string;
  /** "kraut": herb layout (Ashwagandha, and the template of all derived profiles); "frucht": fruit and vegetable layout (Granatapfel) */
  layout: "kraut" | "frucht";
  /**
   * which drawn placeholder stands in for the pictures. "none": no drawing, the neutral "Bild folgt" glyph of the short profile
   * (derived profiles: a drawn herb or fruit must not stand in for another species, e.g. an oak or a mushroom).
   */
  art: "herb" | "fruit" | "none";
  /** true: built by deriveProfile() from the atlas entry, not written by hand */
  derived?: boolean;
  /** derived only: ids of the sections (SECTIONS in profileTemplate.ts, "pp-...") that are placeholders; feeds the list of missing content */
  missing?: string[];
  /** mushrooms (category "pilz") only: the fields of the mushroom panel, in FUNGUS_FIELDS order */
  fungus?: FungusField[];
  /** the atlas entry has the fact "Giftig": the page shows a poison badge */
  poisonous?: boolean;
  t: ProfileTexts;
  /** the category in the breadcrumb after the atlas name, e.g. "Früchte" */
  crumb: string;
  tags: string[];
  /** may be "" (no tradition text in the atlas entry): the renderer shows nothing or the placeholder */
  lead: string;
  /** "Themen in der Überlieferung" under the lead (neutral: no benefit statements); may be empty */
  bubbles: { label: string; icon: string }[];
  glance: { icon: string; label: string; value: string }[];
  /** may be empty: the figure with callouts needs a picture and positions, so derived profiles never have parts */
  parts: ProfilePart[];
  /** the part button that is pressed at the start; "gesamt"/the first one shows all callouts; "" when parts is empty */
  startPart: string;
  /** may be empty */
  traits: { icon: string; label: string; value: string }[];
  /** may be "" */
  traitsNote: string;
  /** herb layout: photo gallery next to the traits */
  gallery: boolean;
  /** optional: absent = no origin data (no fact Heimat/Herkunft, no region in ORIGIN) */
  origin?: { place: { title: string; text: string }; layers: MapLayer[]; note: string };
  /** may be empty */
  sensory: { icon: string; label: string; value: string }[];
  /** stages of the growth cycle (herb: row of cards, fruit: cycle card); may be empty */
  stages: { label: string; time: string }[];
  nutrients?: { per: string; rows: NutrientRow[]; rich: string[]; richTitle: string; note: string };
  /** may be empty */
  compounds: CompoundGroup[];
  /** may be empty */
  effects: { label: string; icon: string; claim: string }[];
  /** optional: absent = no frequency given; a Hz value is never derived or invented (it needs a source) */
  frequency?: { hz: number; hzNote: string; geometry: string; geometryNote: string; symbolics?: string; themes: string[]; claim: string; more?: number[]; pattern: "flower" | "seeds"; fxLabel: string };
  /** may be empty; derived profiles list the recipes that name the entry (no amounts), `slot` empty = drawn icon */
  forms: { name: string; text: string; slot?: string; icon: string; /** id of the recipe in src/data/recipes*.ts */ recipe?: string }[];
  /** may be empty */
  combos: { tab: string; intro?: string; items: ProfileCombo[] }[];
  /** may be empty; `slot` empty = drawn icon */
  history: { title: string; sub: string; text: string; slot?: string; icon: string }[];
  /** may be "" */
  historyNote: string;
  /** may be empty. `claim`: the claim the study belongs to (absent for atlas sources); `from`: where the row comes from */
  research: { title: string; year: number; url: string; claim?: string; more?: boolean; from?: "claim" | "atlas" }[];
  /** may be empty */
  network: { label: string; kind: "plant" | "organ" | "culture" | "claim" | "breath" | "info"; ref?: string; hint?: string }[];
  safety: string;
}

/**
 * Everything `deriveProfile` may read besides the atlas entry itself (all of it already filtered to published items).
 * The caller fills it once from the existing data modules; the function itself stays pure and testable.
 */
export interface DeriveContext {
  /** all published atlas entries (combinations, network) */
  entries: readonly AtlasEntry[];
  /** all published claims (effects, research) */
  claims: readonly Claim[];
  /** all recipes; a recipe belongs to an entry when one of its ingredient ids equals the atlas id */
  recipes: readonly Recipe[];
  /** origin regions per atlas id (ORIGIN in src/data/plants.ts); a missing id means "unknown" */
  origin: Readonly<Record<string, readonly string[]>>;
  /** the organs of the body page (BODY_ORGANS in src/data/body.ts); an association belongs to an organ when its target contains one of the WHOLE words in `match` */
  organs: readonly { id: string; name: string; match: readonly string[] }[];
}

/** The contract of src/data/profileDerive.ts: a pure function, no side effects; `missing` and `fungus` are filled from SECTIONS and FUNGUS_FIELDS. */
export type DeriveProfile = (entry: AtlasEntry, ctx: DeriveContext) => PlantProfile;
