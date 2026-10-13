import type { SlotName } from "../assets/registry.ts";

/**
 * Content of the "Wissensmatrix" (page behind the tab "Universum", src/ui/wissen.ts), after reference image 31: code rain, five
 * floating layers. Hover opens a layer (picture, two entries, a button), a click opens the page behind it. The entries are NOT
 * invented: plants and minerals come from the atlas (name, number of facts and sources are counted), organs from the body atlas,
 * cultures from the dossiers; only the two frequency entries are fixed (both are computed pages, no claim).
 */
export type LayerId = "koerper" | "pflanzen" | "mineralien" | "frequenzen" | "kulturen";
/** the page a layer leads to */
export type LayerTarget = "anatomy" | "plants" | "minerals" | "freq" | "cultures";

export type EntryRef =
  /** an organ of the body atlas (BODY_ORGANS) */
  | { type: "organ"; id: string }
  /** a plant: opens its profile page */
  | { type: "plant"; id: string }
  /** an atlas entry (crystals, minerals): opens the atlas on it */
  | { type: "atlas"; id: string }
  /** a dossier of the old cultures page */
  | { type: "culture"; id: string }
  /** one of the computed pages (cymatics, geometry) */
  | { type: "fx"; mode: "kymatik" | "geometrie"; title: string; tag: string; slot: SlotName };

export interface Layer {
  id: LayerId;
  nr: string;
  label: string;
  /** name of an icon in src/ui/icons.ts */
  icon: string;
  title: string;
  sub: string;
  /** picture of the layer (tile picture of the home page) */
  slot: SlotName;
  to: LayerTarget;
  cta: string;
  entries: [EntryRef, EntryRef];
}

export const LAYERS: Layer[] = [
  { id: "koerper", nr: "01", label: "Körper", icon: "dna", title: "Körper", sub: "Organe & Systeme", slot: "tile-koerper", to: "anatomy", cta: "Menschlicher Körper öffnen", entries: [{ type: "organ", id: "herz" }, { type: "organ", id: "gehirn" }] },
  { id: "pflanzen", nr: "02", label: "Pflanzen", icon: "leaf", title: "Pflanzen", sub: "Wissen in Verbindung", slot: "tile-pflanzen", to: "plants", cta: "Pflanzenatlas öffnen", entries: [{ type: "plant", id: "kamille" }, { type: "plant", id: "lavendel" }] },
  { id: "mineralien", nr: "03", label: "Mineralien", icon: "hex", title: "Mineralien", sub: "Elemente & Kristalle", slot: "tile-mineralien", to: "minerals", cta: "Mineralatlas öffnen", entries: [{ type: "atlas", id: "quarz" }, { type: "atlas", id: "amethyst" }] },
  {
    id: "frequenzen", nr: "04", label: "Frequenzen", icon: "sound", title: "Frequenzen", sub: "Klang, Frequenz & Resonanz", slot: "tile-frequenzen", to: "freq", cta: "Frequenz-Seite öffnen",
    entries: [
      { type: "fx", mode: "kymatik", title: "Kymatik", tag: "Klangfiguren · live berechnet", slot: "cymatics-1" },
      { type: "fx", mode: "geometrie", title: "Heilige Geometrie", tag: "Muster · live berechnet", slot: "tile-geometrie" },
    ],
  },
  { id: "kulturen", nr: "05", label: "Kulturen", icon: "target", title: "Kulturen", sub: "Wissen der Zivilisationen", slot: "tile-kulturen", to: "cultures", cta: "Alte Kulturen öffnen", entries: [{ type: "culture", id: "goebekli-tepe" }, { type: "culture", id: "aegypten" }] },
];

export const WISSEN_TEXT = {
  eyebrow: "The Source Codes · Wissensmatrix",
  titleLines: ["Hinter jedem", "Code liegt Wissen."],
  sub: "Bewege dich durch die Verbindungen.",
  placeholder: "Was möchtest du entdecken?",
  hintMouse: "Hover zum Entdecken · Klick zum Öffnen",
  hintTouch: "Tippen zum Entdecken · Nochmal tippen zum Öffnen",
  galaxyLink: "Alle Aussagen als Galaxien ansehen",
  galaxyNote: "Die 3D-Karte aller Aussagen mit Filter nach Fachgebiet und Belegstufe.",
};
