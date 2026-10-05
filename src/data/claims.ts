import type { Claim } from "./types";

/**
 * Starter entries. Citations marked verified:false must be checked against
 * the original before publication. Interview material is added the same way
 * (kind: "interview") and is graded on its own merits.
 */
export const claims: Claim[] = [
  {
    id: "membrane-potential",
    area: "biophysik",
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
    related: ["warburg", "rife"],
  },
  {
    id: "warburg",
    area: "biophysik",
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
    related: ["membrane-potential", "rife"],
  },
  {
    id: "rife",
    area: "biophysik",
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
    area: "medizingeschichte",
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
    related: ["willow-bark"],
  },
  {
    id: "fluoride-pineal",
    area: "ernaehrung-umwelt",
    statement:
      "Fluorid wurde in verkalkten Zirbeldrüsen verstorbener Menschen nachgewiesen.",
    level: "hypothesis",
    rationale:
      "Es gibt eine Untersuchung an wenigen Präparaten älterer Verstorbener. Ob das Fluorid dort gesundheitliche Folgen hat, ist nicht gezeigt; die Studie ist zudem nicht breit repliziert.",
    sources: [
      {
        id: "luke-2001",
        kind: "peer-reviewed",
        title: "Fluoride deposition in the aged human pineal gland",
        author: "Jennifer Luke",
        year: 2001,
        citation: "Caries Res 35(2):125–128",
        verified: false,
      },
    ],
    related: ["fluoride-intuition"],
  },
  {
    id: "fluoride-intuition",
    area: "ernaehrung-umwelt",
    statement:
      "Fluorid in Zahnpasta schaltet über die Zirbeldrüse Intuition und höhere Kognition aus.",
    level: "unsupported",
    rationale:
      "Für einen solchen Mechanismus gibt es keinen Beleg. Weder ist ein Zusammenhang zwischen Zahnpasta-Fluorid und Zirbeldrüsen-Funktion gezeigt, noch ist „Intuition“ als messbare Größe definiert.",
    sources: [
      {
        id: "fluoride-claim",
        kind: "primary-text",
        title: "Verbreitete Behauptung – Primärquelle noch zu ermitteln",
        author: "unbekannt",
        citation: "Herkunft der Aussage wird recherchiert",
        verified: false,
      },
    ],
    related: ["fluoride-pineal"],
  },
  {
    id: "chladni",
    area: "akustik-architektur",
    statement:
      "Schwingungen ordnen Sand auf einer Platte zu Mustern (Chladni-Figuren) – Ausgangspunkt der Kymatik.",
    level: "historical",
    rationale:
      "Von Ernst Chladni 1787 beschrieben und bis heute reproduzierbar im Experiment. Das Phänomen betrifft Platten und Sand; Übertragungen auf Gebäude oder den Körper sind Deutungen.",
    sources: [
      {
        id: "chladni-1787",
        kind: "historical-document",
        title: "Entdeckungen über die Theorie des Klanges",
        author: "Ernst F. F. Chladni",
        year: 1787,
        citation: "Leipzig 1787",
        verified: false,
      },
    ],
    related: ["acoustic-levitation"],
  },
  {
    id: "acoustic-levitation",
    area: "akustik-architektur",
    statement:
      "Tonnenschwere Steine wurden in der Antike mit Schall zum Schweben gebracht.",
    level: "unsupported",
    rationale:
      "Im Labor lassen sich nur sehr kleine, leichte Objekte mit Ultraschall schweben lassen. Für Steinblöcke fehlen ein physikalischer Mechanismus und jede reproduzierbare Dokumentation; Berichte sind Erzählungen ohne Gegenprüfung.",
    sources: [
      {
        id: "levitation-reports",
        kind: "historical-document",
        title: "Berichte über Steinlevitation (u. a. Coral Castle, Tibet) – Quellenprüfung ausstehend",
        author: "diverse",
        citation: "Originalquellen noch zu sammeln",
        verified: false,
      },
    ],
    related: ["chladni"],
  },
  {
    id: "willow-bark",
    area: "pflanzenheilkunde",
    statement:
      "Weidenrinde enthält Salicin, aus dem später Acetylsalicylsäure (Aspirin) entwickelt wurde.",
    level: "historical",
    rationale:
      "Die pflanzliche Verwendung ist seit der Antike überliefert, die Synthese bei Bayer um 1897 gut dokumentiert. Das macht Weidenrinde nicht zum Ersatz für das Arzneimittel: Wirkstoffgehalt und Nebenwirkungen unterscheiden sich.",
    sources: [
      {
        id: "willow-history",
        kind: "historical-document",
        title: "Geschichte der Salicylate (Quellen noch einzutragen)",
        author: "diverse",
        citation: "Originalquellen noch zu sammeln",
        verified: false,
      },
    ],
    related: ["flexner"],
  },
];
