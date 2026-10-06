export type SolidId = "tetra" | "wuerfel" | "okta" | "dodeka" | "ikosa";
export type ShapeId = SolidId | "blume";

export interface Shape {
  id: ShapeId;
  name: string;
  /** vertices, edges, faces – plain counts (null for the flat pattern) */
  v: number | null; e: number | null; f: number | null;
  /** what the tradition says about it, with its origin */
  tradition: string;
  note: string;
}

/** The five Platonic solids and the Flower of Life. Counts are mathematics; the element names are tradition. */
export const SHAPES: Shape[] = [
  { id: "tetra", name: "Tetraeder", v: 4, e: 6, f: 4, tradition: "Feuer", note: "4 gleichseitige Dreiecke." },
  { id: "wuerfel", name: "Würfel", v: 8, e: 12, f: 6, tradition: "Erde", note: "6 Quadrate." },
  { id: "okta", name: "Oktaeder", v: 6, e: 12, f: 8, tradition: "Luft", note: "8 gleichseitige Dreiecke." },
  { id: "ikosa", name: "Ikosaeder", v: 12, e: 30, f: 20, tradition: "Wasser", note: "20 gleichseitige Dreiecke." },
  { id: "dodeka", name: "Dodekaeder", v: 20, e: 30, f: 12, tradition: "das Weltall (Himmelsstoff)", note: "12 regelmäßige Fünfecke." },
  { id: "blume", name: "Blume des Lebens", v: null, e: null, f: null, tradition: "", note: "19 gleich große, sich überschneidende Kreise auf einem Sechsecksraster, umschlossen von einem Außenkreis. Ein Muster, das in Ornamenten verschiedener Kulturen vorkommt; Bedeutungen, die ihm zugeschrieben werden, sind Überlieferung." },
];
