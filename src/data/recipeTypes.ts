import type { EvidenceLevel } from "./types.ts";

/**
 * Traditional recipes for the workbench. Rules (CLAUDE.md, Pilot):
 * - only recipes from documented traditions or household practice, with their origin; nothing invented, no psychoactive or toxic plants;
 * - no dosing for diseases and no promise of effect: `tradition` says what the recipe was traditionally used for, `evidence` says what is known;
 * - amounts are the amounts of the cited tradition for ONE portion (a cup, a bath ...), not a treatment instruction;
 * - sources only with a real title/URL; otherwise "Source pending verification".
 */
export type Origin = "oma" | "antike" | "kloster" | "ayurveda" | "tcm" | "indigen";

export const ORIGIN_LABEL: Record<Origin, string> = {
  oma: "Oma & Volksheilkunde",
  antike: "Antike",
  kloster: "Kloster & Mittelalter",
  ayurveda: "Ayurveda",
  tcm: "Chinesische Tradition",
  indigen: "Indigene Überlieferung",
};

export type VesselKind = "becher" | "topf" | "schale" | "glas" | "dampf" | "moerser" | "raeucher";

export const VESSEL_LABEL: Record<VesselKind, string> = {
  becher: "Becher", topf: "Topf", schale: "Schüssel", glas: "Glas", dampf: "Schüssel mit heißem Wasser", moerser: "Mörser", raeucher: "Räucherschale",
};

/** which part of the plant or product is used: this decides the icon and the label chip */
export type Part = "saft" | "schale" | "wurzel" | "blatt" | "bluete" | "same" | "rinde" | "frucht" | "pulver" | "fluessig" | "sonst";

export const PART_LABEL: Record<Part, string> = {
  saft: "Saft", schale: "Schale", wurzel: "Wurzel", blatt: "Blätter", bluete: "Blüten", same: "Samen", rinde: "Rinde", frucht: "Frucht", pulver: "Pulver", fluessig: "Flüssigkeit", sonst: "Zutat",
};

export interface Ingredient {
  id: string;
  name: string;
  part: Part;
  /** amount for the recipe's base portion; `unit` is free text ("g", "ml", "TL", "Stück"). 0 = "nach Bedarf", shown with `note` only */
  amount: number;
  unit: string;
  /** colour of the layer in the vessel */
  color: string;
  /** visual share in the vessel (default 1); water is large, spices tiny. Only drawing, never an amount. */
  vol?: number;
  /** preparation of the ingredient itself ("frisch gerieben", "unbehandelt, heiß abgewaschen") */
  note?: string;
  /** false: does not scale with the portion count (a pinch) */
  scales?: boolean;
}

export interface Step {
  text: string;
  /** ingredient ids that go into the vessel in this step */
  add?: string[];
  /** a waiting time in minutes (steeping, simmering, steaming ...) */
  minutes?: number;
  /** "mix" blends the layers into one colour in the picture */
  action?: "mix" | "heat" | "steep" | "cool" | "strain";
}

export interface RecipeSource { label: string; url?: string }

export interface Recipe {
  id: string;
  name: string;
  origin: Origin;
  /** where and when the tradition is documented ("Hildegard von Bingen, 12. Jh. (zugeschrieben)") */
  provenance: string;
  vessel: VesselKind;
  /** name of one portion: "1 Tasse", "1 Dampfbad" */
  portion: string;
  /** what it is traditionally used for, in neutral words (no healing promise) */
  tradition: string;
  ingredients: Ingredient[];
  steps: Step[];
  /** what is known: level + summary */
  evidence: { level: EvidenceLevel; text: string };
  /** safety notes, shown prominently */
  safety: string[];
  /** when to see a doctor instead */
  doctor: string;
  sources: RecipeSource[];
  /** search words for "Was hast du zuhause?" */
  keywords?: string[];
  /** expert review: absent = pending. A recipe is only released after a named person has checked it (CLAUDE.md, rule 2). */
  review?: { state: "pending" | "confirmed" | "corrected"; reviewer?: string; date?: string };
}

/** Sources marked "Suchauszug" were seen as search excerpts only; the original page was not opened (Pilot, to be checked by experts). */
export const NOT_OPENED = "Quellen nur als Suchauszüge gesehen, Originalseiten nicht geprüft (Source pending verification)";
export const OPERATOR_INPUT = "Angabe des Betreibers, ungeprüft (Source pending verification)";
