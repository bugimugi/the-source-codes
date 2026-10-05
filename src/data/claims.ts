import type { Claim } from "./types";

/**
 * Starter entries. Citations marked verified:false must be checked against
 * the original before publication. Interview material is added the same way
 * (kind: "interview") and is graded on its own merits.
 */
export const claims: Claim[] = [
  {
    id: "membrane-potential",
    statement:
      "Lebende Zellen halten ein elektrisches Membranpotenzial aufrecht – bei Nervenzellen in Ruhe etwa −70 mV.",
    level: "established",
    rationale:
      "Grundlage der Elektrophysiologie, vielfach gemessen und repliziert. Der Wert variiert je nach Zelltyp (grob −40 bis −90 mV).",
    sources: [
      {
        id: "hodgkin-huxley-1952",
        kind: "peer-reviewed",
        title:
          "A quantitative description of membrane current and its application to conduction and excitation in nerve",
        author: "A. L. Hodgkin, A. F. Huxley",
        year: 1952,
        citation: "J Physiol 117(4):500–544",
        verified: true,
      },
    ],
    related: ["warburg"],
  },
  {
    id: "warburg",
    statement:
      "Viele Tumorzellen bevorzugen die Glykolyse auch bei vorhandenem Sauerstoff (Warburg-Effekt).",
    level: "supported",
    rationale:
      "Der Stoffwechselbefund ist vielfach beobachtet. Ob er Ursache oder Folge der Krebsentstehung ist, ist Gegenstand aktueller Forschung – nicht entschieden.",
    sources: [
      {
        id: "warburg-1956",
        kind: "peer-reviewed",
        title: "On the origin of cancer cells",
        author: "Otto Warburg",
        year: 1956,
        citation: "Science 123(3191):309–314",
        verified: true,
      },
    ],
    related: ["membrane-potential"],
  },
  {
    id: "rife",
    statement:
      "Spezielle Frequenzgeräte (Rife) können Viren oder Krebszellen gezielt zerstören.",
    level: "unsupported",
    rationale:
      "Die Behauptungen stammen aus den 1930er-Jahren; unabhängige, kontrollierte Wirksamkeitsnachweise am Menschen fehlen. Historisch interessant, klinisch nicht belegt.",
    sources: [
      {
        id: "rife-history",
        kind: "historical-document",
        title: "Rife-Frequenzgeräte (Quellenlage wird recherchiert)",
        author: "Royal R. Rife",
        citation: "Primärquellen und Gegenprüfungen noch einzutragen",
        verified: false,
      },
    ],
  },
  {
    id: "flexner",
    statement:
      "Der Flexner-Report von 1910 veränderte die medizinische Ausbildung in den USA grundlegend und führte zur Schließung zahlreicher Schulen.",
    level: "historical",
    rationale:
      "Gut dokumentiertes Ereignis. Bewertung der Folgen (Standardisierung vs. Verdrängung alternativer Schulen) ist in der Geschichtswissenschaft umstritten.",
    sources: [
      {
        id: "flexner-1910",
        kind: "historical-document",
        title: "Medical Education in the United States and Canada",
        author: "Abraham Flexner",
        year: 1910,
        citation: "Carnegie Foundation for the Advancement of Teaching, Bulletin No. 4",
        verified: true,
      },
    ],
  },
];
