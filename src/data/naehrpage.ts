import type { NutrientGroup } from "./nutrients";

/**
 * The nutrient landing page "Bausteine deines Lebens." (reference picture 30, docs/MOCKUP-NOTES.md). Texts are textbook level and
 * not yet reviewed (pilot). Body systems list the nutrients that take part in them, each with a one-line "why" in the textbook's
 * words ("beteiligt an"); no effect, no amount and no advice is stated in the page's own voice.
 */

/** the six circles at the right of the hero */
export const HERO_CATS: { group: NutrientGroup; sub: string; icon: string }[] = [
  { group: "vitamin", sub: "Funktionen, Quellen, Aufgaben", icon: "sun" },
  { group: "mineral", sub: "Essenzielle Mineralstoffe", icon: "hex" },
  { group: "amino", sub: "Proteine & Bausteine", icon: "atom" },
  { group: "fett", sub: "Omega-3, Omega-6, Omega-9", icon: "drop" },
  { group: "spur", sub: "Kleine Menge, große Wirkung", icon: "leaf" },
  { group: "enzym", sub: "Helfer lebenswichtiger Prozesse", icon: "cell" },
];

/** the seven picture cards below the hero */
export const CATEGORY_CARDS: { group: NutrientGroup; sub: string; icon: string; alt?: string }[] = [
  { group: "vitamin", sub: "Energie & Immunsystem", icon: "sun", alt: "nutrient-vitamin-d" },
  { group: "mineral", sub: "Stabilität & Regulation", icon: "hex", alt: "nutrient-magnesium" },
  { group: "amino", sub: "Proteine & Aufbau", icon: "atom" },
  { group: "fett", sub: "Zellmembranen & Gehirn", icon: "drop", alt: "nutrient-omega3" },
  { group: "spur", sub: "Kleine Menge, große Wirkung", icon: "leaf" },
  { group: "enzym", sub: "Stoffwechsel & Verdauung", icon: "cell" },
  { group: "pflanzenstoff", sub: "Farbe, Duft & Schutz der Pflanze", icon: "berry" },
];

/** quick chips under the search */
export const POPULAR = ["vit-d", "magnesium", "omega3", "protein", "eisen", "zink", "vit-b12"];
export const POPULAR_LABEL: Record<string, string> = { "vit-d": "Vitamin D", magnesium: "Magnesium", omega3: "Omega-3", protein: "Protein", eisen: "Eisen", zink: "Zink", "vit-b12": "B12" };

export interface BodySystem {
  id: string;
  name: string;
  icon: string;
  /** what the system does (textbook) */
  text: string;
  /** nutrient id → why it belongs here (textbook, "beteiligt an") */
  links: [string, string][];
  /** pin on the body picture (`body-front`, percent; from data/body.ts) and the callout text */
  pin?: { x: number; y: number; label: string };
}

export const SYSTEMS: BodySystem[] = [
  {
    id: "gehirn", name: "Gehirn & Nervensystem", icon: "brain", text: "Steuert Denken, Gedächtnis, Stimmung und Bewegung und leitet Signale durch den ganzen Körper.",
    pin: { x: 50, y: 4.6, label: "B-Vitamine, Omega-3, Magnesium …" },
    links: [
      ["omega3", "Omega-3-Fettsäuren (EPA und DHA) sind wichtige Bestandteile von Zellmembranen, besonders im Gehirn und Nervensystem. DHA ist an der Signalübertragung zwischen Nervenzellen beteiligt und trägt zu einer normalen Gehirnfunktion bei."],
      ["vit-b", "B1, B6 und B12 sind am Stoffwechsel der Nervenzellen und an der Bildung von Botenstoffen beteiligt."],
      ["magnesium", "Beteiligt an der Erregungsleitung von Nerven und Muskeln."],
      ["cholin", "Ausgangsstoff des Botenstoffs Acetylcholin, mit dem Nervenzellen Signale weitergeben."],
      ["vit-d", "Vitamin-D-Rezeptoren kommen auch im Gehirn vor; welche Rolle das spielt, wird erforscht."],
    ],
  },
  {
    id: "herz", name: "Herz & Kreislauf", icon: "heart", text: "Das Herz pumpt Blut durch die Gefäße und versorgt jede Zelle mit Sauerstoff.",
    pin: { x: 54, y: 25.2, label: "Coenzym Q10, Magnesium, Kalium …" },
    links: [
      ["q10", "Steckt besonders reichlich im Herzmuskel, der sehr viel Energie verbraucht. Ob Präparate dem Herzen nützen, ist eine offene Forschungsfrage."],
      ["magnesium", "Beteiligt an der elektrischen Erregung der Muskelzellen, auch im Herzmuskel."],
      ["kalium", "Wichtig für den regelmäßigen Herzschlag; zu wenig und zu viel stören den Herzrhythmus."],
      ["omega3", "EPA und DHA werden seit Jahrzehnten im Zusammenhang mit der Herzfunktion untersucht."],
      ["eisen", "Als Teil des Hämoglobins transportiert es den Sauerstoff im Blut."],
    ],
  },
  {
    id: "immun", name: "Immunsystem", icon: "shield", text: "Zellen, Organe und Lymphsystem verteidigen den Körper gegen Krankheitserreger.",
    pin: { x: 60, y: 16.5, label: "Vitamin C, D, Zink …" },
    links: [
      ["vit-c", "Wird von Immunzellen in hoher Konzentration aufgenommen und ist an ihrer Funktion beteiligt."],
      ["vit-d", "Beteiligt an der Steuerung von Immunzellen."],
      ["zink", "Wird für Entwicklung und Funktion von Immunzellen gebraucht."],
      ["selen", "Bestandteil schützender Enzyme, auch in Immunzellen."],
      ["vit-a", "Hält Haut und Schleimhäute intakt, die erste Barriere gegen Erreger."],
    ],
  },
  {
    id: "knochen", name: "Knochen & Gelenke", icon: "bone", text: "Das Skelett trägt den Körper und ist zugleich ein Speicher für Mineralstoffe.",
    links: [
      ["calcium", "Hauptbaustoff von Knochen und Zähnen."],
      ["vit-d", "Fördert die Aufnahme von Calcium aus dem Darm und seinen Einbau in den Knochen."],
      ["vit-k", "Beteiligt an Eiweißen, die Calcium im Knochen binden."],
      ["magnesium", "Ein großer Teil des Magnesiums im Körper ist im Knochen gespeichert."],
      ["protein", "Das Eiweiß Kollagen bildet das Grundgerüst des Knochens."],
    ],
  },
  {
    id: "muskeln", name: "Muskeln", icon: "muscle", text: "Muskeln bewegen den Körper, halten ihn aufrecht und erzeugen Wärme.",
    links: [
      ["protein", "Muskeln bestehen zu einem großen Teil aus Eiweiß."],
      ["amino", "Liefern die Bausteine für den Aufbau von Muskeleiweiß."],
      ["calcium", "Löst in der Muskelzelle die Kontraktion aus."],
      ["magnesium", "Beteiligt an der Entspannung der Muskelfaser nach der Kontraktion."],
      ["kalium", "Wichtig für die elektrische Erregbarkeit der Muskelzellen."],
    ],
  },
  {
    id: "verdauung", name: "Verdauungssystem", icon: "gut", text: "Zerlegt die Nahrung und nimmt Nährstoffe und Wasser ins Blut auf.",
    pin: { x: 50, y: 41, label: "Probiotika, Enzyme, Ballaststoffe …" },
    links: [
      ["probiotika", "Ergänzen die Darmbakterien; die Wirkung hängt vom Stamm ab und wird erforscht."],
      ["enzyme", "Zerlegen Kohlenhydrate, Fette und Eiweiße in aufnehmbare Bausteine."],
      ["ballaststoffe", "Geben dem Darminhalt Volumen und dienen Darmbakterien als Nahrung."],
      ["polyphenole", "Ein großer Teil erreicht den Dickdarm und wird dort von Bakterien umgebaut."],
      ["vit-b12", "Braucht für die Aufnahme einen Stoff aus dem Magen (Intrinsic Factor) und wird im letzten Abschnitt des Dünndarms aufgenommen."],
    ],
  },
  {
    id: "haut", name: "Haut, Haare & Nägel", icon: "layers", text: "Die Haut ist Schutzhülle und Sinnesorgan; Haare und Nägel wachsen aus ihr.",
    links: [
      ["vit-c", "Wird für die Bildung von Kollagen gebraucht, das der Haut Festigkeit gibt."],
      ["zink", "Beteiligt an Zellteilung und Wundheilung."],
      ["vit-a", "Beteiligt an der Erneuerung von Haut und Schleimhäuten."],
      ["vit-b", "Biotin und Riboflavin sind an Haut und Haaren beteiligt; ein klassischer Biotinmangel zeigt sich an Haut und Haaren."],
      ["selen", "Wird für normales Wachstum von Haaren und Nägeln gebraucht."],
    ],
  },
  {
    id: "hormone", name: "Hormonsystem", icon: "flask", text: "Drüsen wie die Schilddrüse geben Botenstoffe ins Blut ab, die Stoffwechsel und Wachstum steuern.",
    links: [
      ["jod", "Bestandteil der Schilddrüsenhormone."],
      ["selen", "Beteiligt an der Aktivierung der Schilddrüsenhormone."],
      ["zink", "Beteiligt an Bildung und Speicherung mehrerer Hormone, z. B. Insulin."],
      ["vit-d", "Wirkt im Körper selbst ähnlich wie ein Hormon."],
      ["vit-b", "Vitamin B6 ist an der Regulierung der Hormontätigkeit beteiligt."],
    ],
  },
  {
    id: "augen", name: "Augen & Sehen", icon: "target", text: "Die Netzhaut wandelt Licht in Nervensignale um.",
    links: [
      ["vit-a", "Baustein des Sehfarbstoffs Rhodopsin, der das Sehen im Dämmerlicht ermöglicht."],
      ["carotinoide", "Lutein und Zeaxanthin sammeln sich im gelben Fleck der Netzhaut."],
      ["omega3", "DHA ist ein Hauptbaustein der Netzhaut."],
      ["zink", "Beteiligt am Vitamin-A-Stoffwechsel im Auge."],
      ["vit-b", "Riboflavin (B2) wird für die normale Sehkraft gebraucht."],
    ],
  },
  {
    id: "zellen", name: "Zellen & Energie", icon: "bolt", text: "Jede Zelle gewinnt in ihren Mitochondrien Energie aus der Nahrung.",
    links: [
      ["vit-b", "Helfer der Enzyme, die Energie aus Kohlenhydraten, Fetten und Eiweißen freisetzen."],
      ["q10", "Teil der Atmungskette in den Mitochondrien."],
      ["magnesium", "Wird von Enzymen gebraucht, die mit dem Energieträger ATP arbeiten."],
      ["eisen", "Bringt Sauerstoff zu den Zellen und ist Teil der Atmungskette."],
      ["jod", "Schilddrüsenhormone steuern den Grundumsatz der Zellen."],
    ],
  },
];

export const NX_TABS: [string, string][] = [["funktion", "Funktion"], ["quellen", "Quellen"], ["wirkung", "Wirkung"], ["mangel", "Mangel"], ["einnahme", "Einnahme"]];

export interface InfoCard { id: string; title: string; text: string; button: string; icon: string; alt?: string }
export const INFO: InfoCard[] = [
  { id: "wirken", title: "Wie Nährstoffe wirken", text: "Verstehe, wie Vitamine, Mineralien und Co-Faktoren auf Zellebene zusammenarbeiten und an welchen Vorgängen im Körper sie beteiligt sind.", button: "Mehr erfahren", icon: "cell" },
  { id: "quellen", title: "Natürliche Quellen", text: "Entdecke, in welchen Lebensmitteln die verschiedenen Nährstoffe enthalten sind und wie sie in eine abwechslungsreiche Ernährung passen.", button: "Lebensmittel entdecken", icon: "berry", alt: "tile-gemuese-obst" },
  { id: "einnahme", title: "Einnahme & Bioverfügbarkeit", text: "Lerne, wie der Körper Nährstoffe aufnimmt, welche Kombinationen die Aufnahme verbessern oder hemmen und warum Mengen in fachkundige Hände gehören.", button: "Tipps zur Einnahme", icon: "cup" },
  { id: "mangel", title: "Mangelerscheinungen", text: "Erfahre, welche klassischen Mangelbilder das Lehrbuch kennt und warum nur eine Untersuchung zeigt, ob ein Mangel vorliegt.", button: "Mehr erfahren", icon: "shield" },
];

/** texts of the drawers behind "Mehr erfahren" / "Tipps zur Einnahme" (textbook) */
export const TEAMWORK: [string, string][] = [
  ["Vitamin D und Kalzium", "Vitamin D fördert die Aufnahme von Calcium aus dem Darm."],
  ["Vitamin C und Eisen", "Vitamin C verbessert die Aufnahme von Eisen aus pflanzlichen Lebensmitteln."],
  ["B12 und Folat", "Beide werden gemeinsam für die Bildung roter Blutkörperchen gebraucht."],
  ["Vitamin K und Kalzium", "Vitamin K wird für Eiweiße gebraucht, die Calcium im Knochen binden."],
  ["Zink und Vitamin A", "Zink ist am Transport und Stoffwechsel von Vitamin A beteiligt."],
  ["Jod und Selen", "Jod ist Baustein der Schilddrüsenhormone, Selen ist an ihrer Aktivierung beteiligt."],
];
export const WORK_TEXT = [
  "Nährstoffe übernehmen im Körper drei Arten von Aufgaben: Sie sind Baustoffe (etwa Eiweiß für Muskeln, Calcium für Knochen), Energielieferanten (Kohlenhydrate, Fette, Eiweiß) oder Helfer. Viele Vitamine und Spurenelemente arbeiten als Co-Faktoren: Ohne sie können bestimmte Enzyme ihre Arbeit nicht tun.",
  "Kaum ein Nährstoff arbeitet allein. Einige Beispiele für Zusammenarbeit aus dem Lehrbuch:",
];
export const INTAKE_TIPS = [
  "Fettlösliche Vitamine (A, D, E, K) und Carotinoide werden mit etwas Fett aus der Mahlzeit besser aufgenommen.",
  "Vitamin C in derselben Mahlzeit verbessert die Aufnahme von pflanzlichem Eisen; Kaffee und schwarzer Tee zur Mahlzeit können sie hemmen.",
  "Phytinsäure aus Vollkorn und Hülsenfrüchten bindet Eisen, Zink und Magnesium; Einweichen, Keimen und Sauerteig bauen sie teilweise ab.",
  "Wasserlösliche Vitamine (C, B-Gruppe) gehen beim Kochen zum Teil ins Wasser über; kurzes Dünsten erhält mehr davon.",
  "Aus gegarten und zerkleinerten Tomaten und Karotten nimmt der Körper mehr Carotinoide auf als aus rohen.",
  "Manche Medikamente beeinflussen die Aufnahme von Nährstoffen, und Präparate können die Wirkung von Medikamenten verändern: Die Apotheke prüft Wechselwirkungen.",
];
export const INTAKE_NOTE = "Mengen und Einnahmepläne nennt diese Seite nicht. Wer Nahrungsergänzungsmittel erwägt, bespricht das mit einer Ärztin, einem Arzt oder einer Ernährungsfachkraft.";
export const DEFICIENCY_TEXT = [
  "Ein Mangel lässt sich nur durch eine ärztliche Untersuchung feststellen, oft mit einer Blutuntersuchung. Müdigkeit, Haarausfall oder Muskelkrämpfe haben viele mögliche Ursachen; wer Beschwerden hat, lässt sie abklären und behandelt sich nicht selbst.",
  "Häufiger betroffen sein können laut Lehrbuch z. B. Menschen, die sich rein pflanzlich ernähren (Vitamin B12), ältere Menschen und Menschen mit wenig Sonnenlicht (Vitamin D), Schwangere (Folat, Jod, Eisen) und Menschen mit Darm- oder Nierenerkrankungen.",
];

/** pictures of the page; prompts for docs/ASSET-LIST.md come from registry.ts */
export const PAGE_SLOTS = ["naehrstoffe-hero", "naehrstoffe-koerper", ...CATEGORY_CARDS.map((c) => `naehrstoffe-kat-${c.group}`), ...INFO.map((i) => `naehrstoffe-info-${i.id}`)];
