import type { SlotName } from "../assets/registry";

/**
 * Nutrients page. Plain textbook nutrition: what the substance is, what it does in general terms, and where it is found in
 * food. NO amounts, doses or deficiency self-tests; the page says that dosing and deficiency belong in medical or dietetic
 * hands. Texts are not yet reviewed by experts (shown as such). `deficiency` names only the classic textbook condition.
 */
export type NutrientGroup = "vitamin" | "mineral" | "spur" | "fett" | "amino";
export const GROUP_LABEL: Record<NutrientGroup, string> = { vitamin: "Vitamine", mineral: "Mineralstoffe", spur: "Spurenelemente", fett: "Fettsäuren", amino: "Aminosäuren" };
export const GROUP_COLOR: Record<NutrientGroup, string> = { vitamin: "#f2cf3e", mineral: "#58d6e8", spur: "#e0873a", fett: "#46c46f", amino: "#a46be0" };

export interface Nutrient {
  id: string;
  name: string;
  group: NutrientGroup;
  /** one-line what-is-it */
  what: string;
  /** general role, textbook level */
  role: string;
  /** typical food sources (no amounts) */
  sources: string;
  /** classic textbook deficiency disease, if there is a clear one */
  deficiency?: string;
  /** a safety note that belongs to this nutrient */
  note?: string;
  slot?: SlotName;
}

export const NUTRIENTS: Nutrient[] = [
  { id: "vit-a", name: "Vitamin A", group: "vitamin", what: "Fettlösliches Vitamin (Retinol); Vorstufen wie Beta-Carotin stecken in Pflanzen.", role: "Beteiligt am Sehvorgang, an Haut und Schleimhäuten und am Immunsystem.", sources: "Leber, Eier, Milchprodukte; als Vorstufe in Karotten, Süßkartoffeln, Spinat.", deficiency: "Nachtblindheit.", note: "Fettlösliche Vitamine können sich im Körper anreichern; hohe Zufuhren über Präparate gehören in ärztliche Begleitung, besonders in der Schwangerschaft." },
  { id: "vit-b12", name: "Vitamin B12", group: "vitamin", what: "Wasserlösliches Vitamin (Cobalamin).", role: "Beteiligt an Blutbildung, Zellteilung und Nervensystem.", sources: "Fast nur in tierischen Lebensmitteln: Fleisch, Fisch, Eier, Milchprodukte.", deficiency: "Bestimmte Blutarmut (perniziöse Anämie) und Nervenschäden.", note: "Wer sich rein pflanzlich ernährt, bespricht die Versorgung mit einer Ärztin oder einem Arzt bzw. einer Ernährungsfachkraft." },
  { id: "vit-c", name: "Vitamin C", group: "vitamin", what: "Wasserlösliches Vitamin (Ascorbinsäure).", role: "Wirkt als Antioxidans, wird für die Bildung von Kollagen gebraucht und verbessert die Aufnahme von pflanzlichem Eisen.", sources: "Paprika, Zitrusfrüchte, Beeren, Kohl, Kartoffeln.", deficiency: "Skorbut (früher bei Seefahrern häufig)." },
  { id: "vit-d", name: "Vitamin D", group: "vitamin", what: "Fettlösliches Vitamin; der Körper bildet es in der Haut unter UV-B-Licht selbst.", role: "Beteiligt am Calcium- und Knochenstoffwechsel.", sources: "Fetter Seefisch, Eigelb, einige angereicherte Lebensmittel; dazu die Bildung in der Haut durch Sonnenlicht.", deficiency: "Rachitis bei Kindern, Knochenerweichung (Osteomalazie) bei Erwachsenen.", note: "Ob Präparate sinnvoll sind, klärt man mit einer Ärztin oder einem Arzt; zu hohe Zufuhr kann schaden.", slot: "nutrient-vitamin-d" },
  { id: "vit-e", name: "Vitamin E", group: "vitamin", what: "Fettlösliches Vitamin (Tocopherole).", role: "Wirkt als Antioxidans und schützt Fettstoffe in Zellmembranen.", sources: "Pflanzenöle, Nüsse, Samen, Vollkorn." },
  { id: "vit-k", name: "Vitamin K", group: "vitamin", what: "Fettlösliches Vitamin.", role: "Beteiligt an der Blutgerinnung und am Knochenstoffwechsel.", sources: "Grünes Blattgemüse, Kohl, einige Pflanzenöle.", note: "Wer Gerinnungshemmer einnimmt, sollte Änderungen der Ernährung oder Präparate mit der Ärztin oder dem Arzt besprechen." },
  { id: "magnesium", name: "Magnesium", group: "mineral", what: "Mineralstoff (Mengenelement).", role: "Beteiligt an vielen Enzymreaktionen sowie an Muskel- und Nervenfunktion und am Energiestoffwechsel.", sources: "Vollkorn, Nüsse, Hülsenfrüchte, grünes Gemüse, magnesiumreiches Mineralwasser.", slot: "nutrient-magnesium" },
  { id: "calcium", name: "Calcium", group: "mineral", what: "Mineralstoff (Mengenelement), Hauptbaustoff von Knochen und Zähnen.", role: "Beteiligt an Knochenaufbau, Muskelkontraktion und Blutgerinnung.", sources: "Milchprodukte, Grünkohl, Mandeln, calciumreiche Mineralwässer.", deficiency: "Auf lange Sicht Knochenschwund (Osteoporose), zusammen mit weiteren Faktoren." },
  { id: "eisen", name: "Eisen", group: "spur", what: "Spurenelement.", role: "Zentraler Bestandteil des roten Blutfarbstoffs Hämoglobin, der Sauerstoff transportiert.", sources: "Fleisch, Hülsenfrüchte, Vollkorn, Hafer; Vitamin C verbessert die Aufnahme pflanzlichen Eisens.", deficiency: "Eisenmangel-Blutarmut.", note: "Eisenpräparate nur nach ärztlicher Abklärung: zu viel Eisen kann schaden." },
  { id: "zink", name: "Zink", group: "spur", what: "Spurenelement.", role: "Beteiligt an zahlreichen Enzymen, am Immunsystem und an der Wundheilung.", sources: "Fleisch, Käse, Nüsse, Vollkorn, Hülsenfrüchte." },
  { id: "jod", name: "Jod", group: "spur", what: "Spurenelement.", role: "Bestandteil der Schilddrüsenhormone.", sources: "Seefisch, jodiertes Speisesalz, Milchprodukte.", deficiency: "Kropf (Vergrößerung der Schilddrüse).", note: "Bei Schilddrüsenerkrankungen immer mit der behandelnden Ärztin oder dem Arzt abstimmen." },
  { id: "omega3", name: "Omega-3-Fettsäuren", group: "fett", what: "Mehrfach ungesättigte Fettsäuren (z. B. ALA, EPA, DHA).", role: "Baustein von Zellmembranen; DHA ist besonders in Gehirn und Netzhaut enthalten.", sources: "Fetter Meeresfisch (Lachs, Makrele, Hering), Leinöl, Walnüsse, Algenöl.", slot: "nutrient-omega3" },
  { id: "amino", name: "Essenzielle Aminosäuren", group: "amino", what: "Neun Aminosäuren, die der Körper nicht selbst herstellen kann.", role: "Bausteine der Eiweiße (Proteine), aus denen unter anderem Muskeln, Enzyme und Botenstoffe bestehen.", sources: "Fleisch, Fisch, Eier, Milchprodukte; pflanzlich Hülsenfrüchte, Soja und Getreide, am besten kombiniert.", note: "Bei einer ausgewogenen Ernährung ist ein Mangel in Mitteleuropa selten." },
];

export const NUTRIENT_NOTICE = "Informationsangebot – keine medizinische Beratung. Die Texte sind allgemeines Lehrbuchwissen und im Pilot noch nicht fachlich geprüft (Quellen: Source pending verification). Mengen und Dosierungen nennt diese Seite bewusst nicht: Sie hängen von Alter, Gesundheit und Medikamenten ab und gehören in die Hände von Ärztinnen, Ärzten oder Ernährungsfachkräften. Nahrungsergänzungsmittel ersetzen keine ausgewogene Ernährung.";

export const INFO_CARDS: { title: string; text: string }[] = [
  { title: "Wie wirken Nährstoffe?", text: "Der Körper braucht sie als Baustoffe, Treibstoff oder Helfer von Enzymen. Was ein Nährstoff im Körper tut, steht hier auf Lehrbuch-Niveau; Wirkversprechen gibt es nicht." },
  { title: "Wo stecken sie drin?", text: "Zuerst in Lebensmitteln. Eine abwechslungsreiche Ernährung mit Gemüse, Obst, Vollkorn, Hülsenfrüchten, Nüssen, Fisch und Milchprodukten deckt den Bedarf der meisten Menschen." },
  { title: "Einnahme und Menge", text: "Dazu nennt die Seite keine Zahlen. Bei Fragen zu Präparaten helfen Ärztinnen, Ärzte und Ernährungsfachkräfte, auch wegen möglicher Wechselwirkungen mit Medikamenten." },
  { title: "Und bei Mangel?", text: "Ein Mangel lässt sich nur durch eine Untersuchung feststellen. Wer Beschwerden hat, lässt sie ärztlich abklären und behandelt sich nicht selbst." },
];
