import type { Area } from "./types";

/** Visual identity of each knowledge cluster in the universe view. */
export const AREA_ORDER: Area[] = [
  "biophysik",
  "akustik-architektur",
  "kristalle-mineralien",
  "pflanzenheilkunde",
  "ernaehrung-umwelt",
  "medizingeschichte",
  "texte-tradition",
];

export const AREA_COLOR: Record<Area, number> = {
  biophysik: 0x5be3d1,
  "akustik-architektur": 0x6fa8ff,
  "kristalle-mineralien": 0xc58bff,
  pflanzenheilkunde: 0x7fe36b,
  "ernaehrung-umwelt": 0xffb454,
  medizingeschichte: 0xff7a8a,
  "texte-tradition": 0xf2d36b,
};

export const AREA_TAGLINE: Record<Area, string> = {
  biophysik: "Membranen, Felder, Frequenzen",
  "akustik-architektur": "Klang, Resonanz, Räume",
  "kristalle-mineralien": "Gitter, Farben, Überlieferung",
  pflanzenheilkunde: "Pflanzen, Rituale, Monographien",
  "ernaehrung-umwelt": "Stoffe, Ernährung, Umwelt",
  medizingeschichte: "Reformen, Schulen, Archive",
  "texte-tradition": "Schriften, Zahlen, Deutungen",
};
