import type { AtlasCategory } from "./types";
import type { SlotName } from "../assets/registry";

export type TileAction =
  | { type: "atlas"; category: AtlasCategory }
  | { type: "scroll"; target: string }
  | { type: "fx"; mode: "kymatik" | "geometrie" }
  | { type: "body" }
  | { type: "chakra" }
  | { type: "breath" }
  | { type: "places" }
  | { type: "cultures" }
  | { type: "nutrients" }
  | { type: "soon" };

export interface Tile { title: string; sub: string; slot: SlotName; action: TileAction }

/** The 16 tiles of the knowledge matrix. Subtitles are neutral descriptions, not effect claims. */
export const TILES: Tile[] = [
  { title: "Pflanzen", sub: "Heilpflanzen & Wildkräuter", slot: "tile-pflanzen", action: { type: "atlas", category: "kraut" } },
  { title: "Bäume", sub: "Arten & Eigenschaften", slot: "tile-baeume", action: { type: "atlas", category: "baum" } },
  { title: "Gemüse & Obst", sub: "Nährstoffe & Inhaltsstoffe", slot: "tile-gemuese-obst", action: { type: "atlas", category: "gemuese" } },
  { title: "Pilze & Mykologie", sub: "Arten & Inhaltsstoffe", slot: "tile-pilze", action: { type: "soon" } },
  { title: "Mineralien", sub: "Elemente & Spurenelemente", slot: "tile-mineralien", action: { type: "atlas", category: "kristall" } },
  { title: "Kristalle & Heilsteine", sub: "Eigenschaften & Überlieferung", slot: "tile-kristalle", action: { type: "atlas", category: "kristall" } },
  { title: "Menschlicher Körper", sub: "Organe & Systeme", slot: "tile-koerper", action: { type: "body" } },
  { title: "Nährstoffe", sub: "Vitamine, Mineralien, Aminosäuren", slot: "tile-naehrstoffe", action: { type: "nutrients" } },
  { title: "Krankheiten & Beschwerden", sub: "Von Schnupfen bis chronisch", slot: "tile-krankheiten", action: { type: "scroll", target: "beschwerden" } },
  { title: "Atem & Meditation", sub: "Atemtechniken & Nervensystem", slot: "tile-atem", action: { type: "breath" } },
  { title: "Frequenzen & Vibrationen", sub: "Klang, Frequenz & Resonanz", slot: "tile-frequenzen", action: { type: "fx", mode: "kymatik" } },
  { title: "Geometrie", sub: "Heilige Geometrie & Mathematik", slot: "tile-geometrie", action: { type: "fx", mode: "geometrie" } },
  { title: "Chakren", sub: "Energiezentren & Bewusstsein", slot: "tile-chakren", action: { type: "chakra" } },
  { title: "Alte Kulturen", sub: "Wissen der Zivilisationen", slot: "tile-kulturen", action: { type: "cultures" } },
  { title: "Heilige Orte", sub: "Orte besonderer Bedeutung", slot: "tile-orte", action: { type: "places" } },
  { title: "Lab & Experimente", sub: "Selbst ausprobieren", slot: "tile-lab", action: { type: "scroll", target: "labor" } },
];

export const ORGANS = ["Gehirn", "Herz", "Lunge", "Leber", "Magen", "Darm", "Immunsystem", "Hormone", "Knochen", "Muskeln", "Haut", "Nervensystem"];

/**
 * Plants and nutrients shown next to an organ after it was clicked. `organs` are ids from data/body.ts.
 * PLACEHOLDER PAIRING chosen by Claude to make the page work: the mockup only placed these items around the body and
 * names no organ. The page labels it "vorläufig, ungeprüft" and names no effect. The operator decides the real pairing
 * (each one then becomes a graded claim with sources). Kurkuma and Grüner Tee have no organ yet and are not shown.
 */
export const BUBBLES: { name: string; kind: string; slot: SlotName; organs: string[] }[] = [
  { name: "Ashwagandha", kind: "Heilpflanze", slot: "nutrient-ashwagandha", organs: ["gehirn"] },
  { name: "Kurkuma", kind: "Gewürzwurzel", slot: "nutrient-kurkuma", organs: [] },
  { name: "Ingwer", kind: "Gewürzwurzel", slot: "nutrient-ingwer", organs: ["magen", "darm"] },
  { name: "Knoblauch", kind: "Zwiebelgewächs", slot: "nutrient-knoblauch", organs: ["herz"] },
  { name: "Grüner Tee", kind: "Teepflanze", slot: "nutrient-gruener-tee", organs: [] },
  { name: "Magnesium", kind: "Mineralstoff", slot: "nutrient-magnesium", organs: ["gehirn"] },
  { name: "Omega-3", kind: "Fettsäure", slot: "nutrient-omega3", organs: ["gehirn"] },
  { name: "Vitamin D", kind: "Vitamin", slot: "nutrient-vitamin-d", organs: ["immunsystem"] },
];

export const CONDITIONS = ["Kopfschmerzen", "Schlafprobleme", "Schnupfen", "Bauchschmerzen", "Hauterkrankungen", "Immunsystem", "Stress & Angst", "Verdauungsprobleme", "Gelenkschmerzen", "Energie & Müdigkeit"];

/** Solfeggio-style labels. These are traditional attributions, not findings. */
export const FREQUENCIES: { hz: number; label: string }[] = [
  { hz: 174, label: "Befreiung" }, { hz: 285, label: "Heilung" }, { hz: 396, label: "Blockaden" }, { hz: 417, label: "Veränderung" },
  { hz: 432, label: "Harmonie" }, { hz: 528, label: "Transformation" }, { hz: 639, label: "Verbindung" }, { hz: 741, label: "Intuition" }, { hz: 852, label: "Erwachen" },
];

export const BANDS = [
  { id: "geometrie", title: "Heilige Geometrie", text: "Muster, die sich in Natur, Kunst und Architektur wiederholen: Blume des Lebens, Goldener Schnitt, Platonische Körper.", slot: "band-geometrie" as SlotName, button: "Geometrie erkunden", fx: "geometrie" as const },
  { id: "kulturen", title: "Alte Kulturen", text: "Tauche in das Wissen früherer Zivilisationen ein: Ägypten, Griechenland, Indien, China, Maya, Inka und mehr.", slot: "band-kulturen" as SlotName, button: "Kulturen erkunden", cultures: true as const },
  { id: "orte", title: "Heilige Orte", text: "Orte von besonderer historischer und kultureller Bedeutung: Giza, Machu Picchu, Angkor Wat, Stonehenge.", slot: "band-orte" as SlotName, button: "Orte entdecken", places: true as const },
];

export const DIY = [
  { title: "Pflanzenextrakte selbst herstellen", slot: "diy-extrakte" as SlotName },
  { title: "Wasser strukturieren", slot: "diy-wasser" as SlotName },
  { title: "Räuchern & Essenzen", slot: "diy-raeuchern" as SlotName },
  { title: "Mikroskopie erleben", slot: "diy-mikroskop" as SlotName },
];
