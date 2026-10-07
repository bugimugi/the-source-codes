import type { EvidenceLevel } from "./types";

/**
 * Fabric station. Two things are kept apart on purpose:
 * 1. `claim` – what the operator / the "energetic" tradition says about fabrics and body frequency. It is drawn as a symbolic
 *    meter without any number, because no measurement method exists (level "claimed", pilot). A figure is shown as claimed.
 * 2. `facts` – what textile science describes (moisture, drying, static, shedding). Words, not numbers, until a source is checked.
 */
export type FabricGroup = "natur" | "kunst" | "halb";

export const GROUP_LABEL: Record<FabricGroup, string> = { natur: "Naturfaser", halb: "Regeneratfaser (aus Zellulose)", kunst: "Kunstfaser (Erdöl)" };

export interface Fabric {
  id: string;
  name: string;
  group: FabricGroup;
  color: string;
  /** weave look of the garment on the mannequin */
  weave: "plain" | "slub" | "rib" | "knit" | "smooth";
  /** the claim, as a symbolic position on the meter: 0 = "gedämpft" … 1 = "angehoben" (NOT a measurement) */
  claim: number;
  /** the figure that circulates in follower circles for this fabric (text, with its uncertainty); undefined = none found */
  circulating?: string;
  /** what the tradition says, in its own words */
  claimText: string;
  /** what textile science describes */
  facts: { label: string; value: string }[];
  text: string;
}

const REGAIN = "Feuchteaufnahme bei 65 % Luftfeuchte (Richtwert)";
const SHED_NATURAL = "Naturfasern/Zellulose: bauen sich in der Umwelt ab";
const SHED_SYNTH = "gibt beim Waschen Kunststofffasern ab (Mikroplastik)";

export const FABRICS: Fabric[] = [
  {
    id: "baumwolle", name: "Baumwolle", group: "natur", color: "#e8e1cf", weave: "plain", claim: 0.6, circulating: "100 (Bio-Baumwolle; gleich dem Wert, der dort für den Menschen genannt wird)",
    claimText: "Bio-Baumwolle gilt in diesen Listen als neutral: gleich der „Signatur“ des Menschen, also weder senkend noch stark anhebend.",
    facts: [{ label: REGAIN, value: "ca. 8,5 %" }, { label: "Statische Aufladung", value: "gilt als eher gering" }, { label: "Abrieb beim Waschen", value: SHED_NATURAL }, { label: "Anbau", value: "Wasser- und Pestizidverbrauch werden gestritten; die Zahlen widersprechen sich je nach Quelle" }],
    text: "Samenhaar der Baumwollpflanze, die am meisten getragene Naturfaser.",
  },
  {
    id: "leinen", name: "Leinen", group: "natur", color: "#cdbf9c", weave: "slub", claim: 0.92, circulating: "5.000 (Einheit uneinheitlich: „MHz“ oder ohne)",
    claimText: "Steht in diesen Listen an der Spitze. Zusammen mit Wolle getragen sollen sich beide „aufheben“. Für einen solchen Stoffeffekt gibt es kein Messverfahren.",
    facts: [{ label: REGAIN, value: "ca. 12 %" }, { label: "Atmungsaktivität", value: "von Herstellern und Ratgebern als sehr gut beschrieben (Messstudie nicht gefunden)" }, { label: "Abrieb beim Waschen", value: SHED_NATURAL }],
    text: "Bastfaser aus dem Flachs, eine der ältesten Textilfasern.",
  },
  {
    id: "hanf", name: "Hanf", group: "natur", color: "#a8a07a", weave: "slub", claim: 0.85,
    claimText: "Gilt in der energetischen Lehre als „hoch schwingend“. Eine Zahl für Hanf habe ich in den Quellen nicht gefunden; die Aussage ist reine Behauptung.",
    facts: [{ label: REGAIN, value: "Wert nicht gefunden" }, { label: "Anbau", value: "Aussagen zu geringem Wasser- und Pestizidbedarf stammen vor allem von Interessenseiten und sind nicht belegt" }, { label: "Abrieb beim Waschen", value: SHED_NATURAL }],
    text: "Bastfaser der Hanfpflanze; robust, wird mit der Zeit weicher. Nutzhanf ist nicht berauschend.",
  },
  {
    id: "wolle", name: "Wolle", group: "natur", color: "#b9a690", weave: "knit", claim: 0.92, circulating: "5.000 (Einheit uneinheitlich)",
    claimText: "Steht in diesen Listen neben Leinen an der Spitze.",
    facts: [{ label: REGAIN, value: "ca. 16 % (Bereich in Listen: 13–18 %)" }, { label: "Statische Aufladung", value: "lädt sich eher positiv auf" }, { label: "Abrieb beim Waschen", value: SHED_NATURAL }],
    text: "Haar von Schafen u. a.; wärmt auch feucht.",
  },
  {
    id: "seide", name: "Seide", group: "natur", color: "#e6d9ef", weave: "smooth", claim: 0.12, circulating: "etwa 15",
    claimText: "Auffällig: Seide ist eine Naturfaser, steht in diesen Listen aber in der niedrigen Gruppe bei Polyester und Rayon. Das passt nicht zur einfachen Erzählung „Natur hoch, Kunst niedrig“.",
    facts: [{ label: REGAIN, value: "ca. 11 %" }, { label: "Statische Aufladung", value: "lädt sich eher positiv auf" }, { label: "Abrieb beim Waschen", value: SHED_NATURAL }],
    text: "Faden des Seidenspinners; glatt und leicht.",
  },
  {
    id: "viskose", name: "Viskose (Rayon)", group: "halb", color: "#d7c3b0", weave: "smooth", claim: 0.12, circulating: "etwa 15",
    claimText: "Obwohl aus Pflanzenzellulose gewonnen, steht Rayon in diesen Listen bei den niedrigen Werten.",
    facts: [{ label: "Herstellung", value: "Zellstoff wird chemisch gelöst und zu Fäden gesponnen" }, { label: REGAIN, value: "Wert in den Quellen nicht gefunden" }],
    text: "Regeneratfaser aus Zellstoff.",
  },
  {
    id: "polyester", name: "Polyester", group: "kunst", color: "#6f7f93", weave: "smooth", claim: 0.1, circulating: "etwa 15 („Kranker oder Sterbender“ liegt dort bei etwa 15)",
    claimText: "Gilt in der energetischen Lehre als „tote“ Frequenz, die die Eigenschwingung des Körpers dämpft („Frequenzsenke“). Unter 100 soll den Körper belasten. Das ist eine Behauptung.",
    facts: [{ label: REGAIN, value: "ca. 0,4 % (trocknet sehr schnell, Schweiß bleibt eher auf der Haut)" }, { label: "Statische Aufladung", value: "besonders in Kontakt mit Wolle, Nylon oder Seide spürbar" }, { label: "Abrieb beim Waschen", value: SHED_SYNTH }, { label: "Farbstoffe", value: "bestimmte Dispersionsfarbstoffe (v. a. in Polyester) können bei bereits Sensibilisierten Kontaktallergien auslösen" }],
    text: "Kunstfaser aus Erdöl (PET); die weltweit meistverwendete Faser.",
  },
  {
    id: "nylon", name: "Nylon (Polyamid)", group: "kunst", color: "#5d6f86", weave: "smooth", claim: 0.12, circulating: "niedrig, „bis 15“ (Einheit widersprüchlich: Hz oder MHz)",
    claimText: "Wird in diesen Listen wie Polyester als „niedrig“ eingeordnet (Behauptung).",
    facts: [{ label: REGAIN, value: "ca. 4,0–4,5 %" }, { label: "Statische Aufladung", value: "lädt sich eher positiv auf" }, { label: "Abrieb beim Waschen", value: SHED_SYNTH }],
    text: "Erste vollsynthetische Faser (1930er); sehr reißfest.",
  },
  {
    id: "acryl", name: "Acryl", group: "kunst", color: "#7a6a8a", weave: "knit", claim: 0.1,
    claimText: "Eine genaue Zahl habe ich in den Quellen nicht gefunden; Kunstfasern gelten dort insgesamt als „niedrig“ (Behauptung).",
    facts: [{ label: REGAIN, value: "ca. 1,5 %" }, { label: "Abrieb beim Waschen", value: `${SHED_SYNTH}. Eine Studie (Napper & Thompson 2016) schätzt über 700.000 Fasern aus einer 6-kg-Ladung Acryl` }],
    text: "Wollähnliche Kunstfaser aus Erdöl.",
  },
];

export const FABRIC_CLAIM = {
  text: "Kunstfasern wie Polyester dämpfen die Frequenz des Körpers, Naturfasern wie Baumwolle, Leinen und Hanf heben sie an.",
  level: "claimed" as EvidenceLevel,
  counter: "Für eine „Körperfrequenz“, die sich durch Kleidung messbar senken oder heben lässt, habe ich keinen Beleg gefunden. Die kursierenden Zahlen (Leinen und Wolle 5.000, Bio-Baumwolle 100, Polyester, Seide und Rayon etwa 15) werden einem Experiment um 2003 zugeschrieben und stammen aus Händler- und Blogseiten; laut diesen Quellen misst das benutzte Gerät keine physikalische Schwingung, die Ergebnisse wurden nicht begutachtet veröffentlicht und nicht wiederholt. Die Einheit ist uneinheitlich (MHz, Hz oder keine). Wörtlich als Frequenz genommen wären 5.000 MHz bereits 5 GHz, also WLAN-Bereich. Fachleute kritisieren den Gebrauch des Wortes „Frequenz“ in der Energiemedizin als Schlagwort. Belegt sind dagegen andere, messbare Unterschiede der Fasern (Feuchteaufnahme, Aufladung, Abrieb beim Waschen, Farbstoffe). Alles aus Suchauszügen, Originale nicht geprüft: Source pending verification.",
};

export const FABRIC_SOURCES: { label: string; url?: string }[] = [
  { label: "Branwyn: Good vibrations – what science really says about fabric frequencies (Händlerseite, ordnet das Messgerät ein)", url: "https://branwyn.com/blogs/in-the-wild/good-vibrations-what-science-really-says-about-fabric-frequencies" },
  { label: "Harriet Hall: Frequencies and Their Kindred Delusions, Science-Based Medicine, 2011", url: "https://sciencebasedmedicine.org/frequencies-and-their-kindred-delusions/" },
  { label: "Napper & Thompson 2016, Marine Pollution Bulletin (Mikroplastik beim Waschen); Pressemeldung Universität Plymouth", url: "https://www.plymouth.ac.uk/news/washing-clothes-releases-thousands-of-microplastic-particles-into-environment-study-shows" },
  { label: "Morton & Hearle: Physical Properties of Textile Fibres, 4. Aufl. 2008 (Feuchteaufnahme)", url: "https://shop.elsevier.com/books/physical-properties-of-textile-fibres/hearle/978-1-84569-220-9" },
  { label: "gesund.bund.de: Chemikalien in Kleidung (Dispersionsfarbstoffe)", url: "https://gesund.bund.de/chemikalien-in-kleidung" },
];

export const FABRIC_NOTICE = "Die Anzeige für die Frequenz ist keine Messung, sondern eine Darstellung der Behauptung, damit man sie sich vorstellen kann. Die kursierenden Zahlen stehen im Text, weil sie in den Quellen so genannt werden, nicht weil sie stimmen. Die Eigenschaften der Fasern sind Richtwerte aus Lehrmaterial; die Quellen wurden bisher nur als Suchauszüge gesehen: Source pending verification.";
