/**
 * Types of the plant profile pages (src/ui/plantProfile.ts). A profile is the long version of one atlas entry; plants without a
 * profile get a short one generated from the atlas entry.
 *
 * Pilot rules: statements about effects are NOT written here but live as graded claims in content/claims/ (shown with their
 * level); no amounts or dosages for use; everything marked "Vorlage" comes from the operator's reference picture and is unchecked
 * (Source pending verification). Positions of the callouts are percentages of the plant picture: adjust them when the final picture
 * `plant-<id>-parts` exists. Picture names must exist in src/assets/registry.ts (checked by `npm run validate:data`).
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

export interface PlantProfile {
  id: string;
  /** "kraut": herb layout (Ashwagandha); "frucht": fruit and vegetable layout (Granatapfel) */
  layout: "kraut" | "frucht";
  /** which drawn placeholder stands in for the pictures */
  art: "herb" | "fruit";
  t: ProfileTexts;
  /** the category in the breadcrumb after the atlas name, e.g. "Früchte" */
  crumb: string;
  tags: string[];
  lead: string;
  /** "Themen in der Überlieferung" under the lead (neutral: no benefit statements) */
  bubbles: { label: string; icon: string }[];
  glance: { icon: string; label: string; value: string }[];
  parts: ProfilePart[];
  /** the part button that is pressed at the start; "gesamt"/the first one shows all callouts */
  startPart: string;
  traits: { icon: string; label: string; value: string }[];
  traitsNote: string;
  /** herb layout: photo gallery next to the traits */
  gallery: boolean;
  origin: { place: { title: string; text: string }; layers: MapLayer[]; note: string };
  sensory: { icon: string; label: string; value: string }[];
  /** stages of the growth cycle (herb: row of cards, fruit: cycle card) */
  stages: { label: string; time: string }[];
  nutrients?: { per: string; rows: NutrientRow[]; rich: string[]; richTitle: string; note: string };
  compounds: CompoundGroup[];
  effects: { label: string; icon: string; claim: string }[];
  frequency: { hz: number; hzNote: string; geometry: string; geometryNote: string; symbolics?: string; themes: string[]; claim: string; more?: number[]; pattern: "flower" | "seeds"; fxLabel: string };
  forms: { name: string; text: string; slot: string; icon: string }[];
  combos: { tab: string; intro?: string; items: ProfileCombo[] }[];
  history: { title: string; sub: string; text: string; slot: string; icon: string }[];
  historyNote: string;
  research: { title: string; year: number; url: string; claim: string; more?: boolean }[];
  network: { label: string; kind: "plant" | "organ" | "culture" | "claim" | "breath" | "info"; ref?: string; hint?: string }[];
  safety: string;
}
