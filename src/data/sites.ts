import type { SlotName } from "../assets/registry";

/**
 * Places of the "Heilige Orte" page. Coordinates are rounded (about 1 km); the one-sentence descriptions are general
 * knowledge and not yet reviewed by experts (shown as such). No line, alignment or "energy" is stated for any place:
 * claims of that kind would be added as graded claims (`claimed`) with counter-evidence, never as plain text here.
 * `claims` are ids of existing library claims that really concern the place.
 */
export interface Site {
  id: string;
  name: string;
  place: string;
  kind: string;
  lat: number;
  lon: number;
  slot: SlotName;
  text: string;
  claims: string[];
}

export const SITES: Site[] = [
  { id: "giza", name: "Pyramiden von Gizeh", place: "Ägypten", kind: "Grabanlagen", lat: 29.98, lon: 31.13, slot: "site-giza", text: "Gruppe monumentaler Grabanlagen aus dem Alten Reich am Rand von Kairo, darunter die Cheops-Pyramide.", claims: [] },
  { id: "machu-picchu", name: "Machu Picchu", place: "Peru", kind: "Inka-Stadtanlage", lat: -13.16, lon: -72.55, slot: "site-machu-picchu", text: "Bergstadt der Inka in den Anden, im 15. Jahrhundert angelegt.", claims: [] },
  { id: "angkor-wat", name: "Angkor Wat", place: "Kambodscha", kind: "Tempelanlage", lat: 13.41, lon: 103.87, slot: "site-angkor-wat", text: "Größte Tempelanlage des Khmer-Reiches, im 12. Jahrhundert errichtet.", claims: [] },
  { id: "goebekli-tepe", name: "Göbekli Tepe", place: "Türkei (Südostanatolien)", kind: "Fundstätte", lat: 37.22, lon: 38.92, slot: "site-goebekli-tepe", text: "Anlage mit großen T-förmigen Steinpfeilern aus der Zeit vor der Landwirtschaft; eine der ältesten bekannten Monumentalanlagen.", claims: [] },
  { id: "hypogeum", name: "Hypogäum von Ħal-Saflieni", place: "Malta", kind: "Unterirdische Anlage", lat: 35.84, lon: 14.51, slot: "site-malta-hypogeum", text: "In den Fels gehauene prähistorische Anlage mit mehreren Ebenen.", claims: ["hal-saflieni-resonance", "cook-110hz"] },
  { id: "stonehenge", name: "Stonehenge", place: "England", kind: "Steinkreis", lat: 51.18, lon: -1.83, slot: "site-stonehenge", text: "Prähistorischer Steinkreis auf der Ebene von Salisbury.", claims: [] },
  { id: "istanbul-kuppeln", name: "Osmanische Kuppelmoscheen", place: "Istanbul, Türkei", kind: "Bauwerke", lat: 41.02, lon: 28.96, slot: "site-istanbul-mosque-dome", text: "Große Kuppelräume des 16. Jahrhunderts, unter anderem von dem Baumeister Sinan.", claims: [] },
];

export const SITES_NOTICE = "Die Kurztexte sind allgemein bekanntes Wissen und im Pilot noch nicht fachlich geprüft (Quellen: Source pending verification). Behauptungen über Energie, Linien oder Ausrichtungen zwischen Orten sind hier nicht aufgenommen; kämen sie, dann als „Behauptung (ungeprüft)“ mit Gegenbelegen.";
