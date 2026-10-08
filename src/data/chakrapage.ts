/**
 * Content of the chakra landing page (src/ui/chakren.ts). Everything here is cultural lore or textbook knowledge, never a
 * promise of effect: the assignments of colours, foods, scents, stones and frequencies are modern additions (claim
 * `chakra-zuordnungen-modern`), the model itself has no measurable basis (`chakra-modell`), and working with chakras does not
 * demonstrably solve complaints (`chakra-arbeit-heilung`). Facts about stones, foods and plants are plain textbook keywords.
 * Sources: Source pending verification.
 */

export interface PageItem {
  name: string;
  /** textbook keyword or one plain sentence */
  note: string;
  /** atlas entry that opens from the item (content/atlas) */
  atlas?: string;
  /** safety hint shown with the item */
  caution?: string;
}
export interface YogaItem { name: string; sanskrit: string; level: "Anfänger" | "Mittel" | "Fortgeschritten" | "Meditation" | "Entspannung" | "Atemübung"; note: string; caution?: string }
export type MedKind = "erdung" | "weite" | "licht" | "klang" | "stille" | "reinigung";
export interface MedItem { title: string; minutes: number; kind: MedKind }
export interface ColorDot { name: string; hex: string }
export interface ChakraPage {
  /** same id as in src/data/chakras.ts */
  id: string;
  /** one word under the name in the selector */
  short: string;
  tagline: string;
  lead: string;
  posShort: string;
  colorShort: string;
  card: { text: string; element: string; position: string; symbol: string; theme: string };
  /** meaning of the Sanskrit name */
  nameMeaning: string;
  meaning: string[];
  bodyRegion: string;
  under: string[]; over: string[]; balanced: string[];
  stones: string[]; foods: string[]; scents: string[]; herbs: PageItem[];
  colors: ColorDot[];
  hzLabel: string;
  natureSound: string;
  yoga: string[]; nature: string[]; affirmations: string[];
  meditations: MedItem[];
}

/** claims linked from the page (chips and links) */
export const PAGE_CLAIMS = ["chakra-modell", "chakra-zuordnungen-modern", "chakra-arbeit-heilung", "crystal-healing-general", "freq-solfeggio"];

export const TABS: [string, string][] = [
  ["uebersicht", "Übersicht"], ["bedeutung", "Bedeutung"], ["balance", "Symptome & Balance"], ["steine", "Heilsteine & Kristalle"], ["ernaehrung", "Ernährung"],
  ["klang", "Frequenzen & Klang"], ["meditation", "Meditation & Yoga"], ["natur", "Natur & Kräuter"], ["affirmationen", "Affirmationen"],
];

/** Solfeggio-style attributions (modern, no evidence); the page shows a chakra's own value and the two below it */
export const SOLFEGGIO = [174, 285, 396, 417, 528, 639, 741, 852, 963];
export const HZ_LABEL: Record<number, string> = { 174: "Beruhigung", 285: "Erneuerung", 396: "Sicherheit", 417: "Wandel", 528: "Kraft", 639: "Verbindung", 741: "Ausdruck", 852: "Intuition", 963: "Spiritualität" };

export const SOUND_NOTE = "Der Ton ist ein reiner Sinuston, er startet nur auf Klick und bleibt leise. Dass bestimmte Frequenzen bestimmten Chakren oder Wirkungen entsprechen, ist eine moderne Zuschreibung (Solfeggio) und nicht belegt.";
export const MED_NOTE = "Einfache Vorstellungsübungen zum Lesen, keine Therapie. Bei Schwindel, Unruhe oder belastenden Gedanken beenden; bei seelischen Beschwerden fachliche Hilfe suchen.";
export const YOGA_NOTE = "Körperübungen ersetzen keine ärztliche Abklärung. Nichts erzwingen; bei Schmerz sofort lösen.";
export const SCENT_NOTE = "Ätherische Öle nicht einnehmen und nicht unverdünnt auf die Haut geben; Abstand zu Augen halten. Bei Schwangerschaft, Asthma, Kindern und Haustieren (besonders Katzen) vorher fachlich nachfragen.";
export const FOOD_NOTE = "Die Zuordnung nach Farbe ist eine moderne Überlieferung und keine Ernährungsempfehlung. Auf Allergien und Unverträglichkeiten achten; bei Fragen zur Ernährung berät ärztliches oder ernährungsfachliches Personal.";
export const STONE_NOTE = "Die Zuordnung von Steinen zu Chakren ist eine moderne Überlieferung. Eine Wirkung der Steine ist nicht belegt (Aussage „Kristallheilung“).";
export const BALANCE_NOTE = "Das sind Beschreibungen der Überlieferung, keine Diagnose. Körperliche oder seelische Beschwerden gehören in ärztliche oder therapeutische Abklärung; ein Chakra-Modell ersetzt sie nicht.";
export const PAGE_NOTICE = "Alles auf dieser Seite beschreibt eine kulturelle Überlieferung und Lehrbuchwissen; keine medizinische Beratung. Das Chakra-Modell ist nicht wissenschaftlich belegt, die Zuordnungen von Farben, Steinen, Düften, Speisen und Frequenzen stammen größtenteils aus dem 20. Jahrhundert. Quellen: Source pending verification, Texte im Pilot ungeprüft.";

/** quote shown in the info card: the tradition's own words are described, not asserted */
export const CARD_TAG = "ÜBERLIEFERTES WISSEN";

// ------------------------------------------------------------------ item catalogues (textbook keywords only)
export const STONES: Record<string, PageItem> = {
  Granat: { name: "Granat", note: "Mineralgruppe (Silikate), häufig rot", atlas: "granat" },
  "Roter Jaspis": { name: "Roter Jaspis", note: "Quarz-Varietät, rot durch Eisenoxid" },
  "Schwarzer Turmalin": { name: "Schwarzer Turmalin", note: "Schörl, ein Borosilikat", atlas: "turmalin" },
  Obsidian: { name: "Obsidian", note: "vulkanisches Glas", atlas: "obsidian" },
  Rauchquarz: { name: "Rauchquarz", note: "braun-grauer Quarz (SiO₂)", atlas: "rauchquarz" },
  Karneol: { name: "Karneol", note: "orange-roter Chalcedon (SiO₂)" },
  Orangenkalzit: { name: "Orangenkalzit", note: "orangefarbener Calcit (CaCO₃), weich" },
  Mondstein: { name: "Mondstein", note: "Feldspat mit bläulichem Schimmer" },
  Bernstein: { name: "Bernstein", note: "fossiles Baumharz, kein Mineral" },
  Achat: { name: "Achat", note: "gebänderter Chalcedon (SiO₂)", atlas: "achat" },
  Citrin: { name: "Citrin", note: "gelbe Quarz-Varietät (SiO₂)", atlas: "citrin" },
  Tigerauge: { name: "Tigerauge", note: "Quarz mit Fasereinschlüssen, goldbraun schimmernd" },
  Pyrit: { name: "Pyrit", note: "Eisensulfid (FeS₂), „Katzengold“", atlas: "pyrit" },
  Rosenquarz: { name: "Rosenquarz", note: "rosa Quarz (SiO₂)", atlas: "rosenquarz" },
  Malachit: { name: "Malachit", note: "grünes Kupfercarbonat", atlas: "malachit", caution: "Nicht für Kristallwasser geeignet; Staub beim Schleifen nicht einatmen." },
  "Grüner Aventurin": { name: "Grüner Aventurin", note: "Quarz mit Glimmer-Einschlüssen" },
  Rhodonit: { name: "Rhodonit", note: "rosa Mangansilikat" },
  Smaragd: { name: "Smaragd", note: "grüne Beryll-Varietät" },
  Lapislazuli: { name: "Lapislazuli", note: "blaues Gestein, vor allem aus Lazurit", atlas: "lapislazuli" },
  Aquamarin: { name: "Aquamarin", note: "blaue Beryll-Varietät" },
  Sodalith: { name: "Sodalith", note: "blaues Natrium-Aluminium-Silikat" },
  Türkis: { name: "Türkis", note: "Kupfer-Aluminium-Phosphat, himmelblau bis grünlich" },
  "Blauer Chalcedon": { name: "Blauer Chalcedon", note: "hellblaue Chalcedon-Varietät (SiO₂)" },
  Amethyst: { name: "Amethyst", note: "violette Quarz-Varietät (SiO₂)", atlas: "amethyst" },
  Fluorit: { name: "Fluorit", note: "Calciumfluorid (CaF₂), in vielen Farben", atlas: "fluorit" },
  Labradorit: { name: "Labradorit", note: "Feldspat mit schillerndem Farbspiel", atlas: "labradorit" },
  Bergkristall: { name: "Bergkristall", note: "farbloser Quarz (SiO₂)", atlas: "quarz" },
  Selenit: { name: "Selenit", note: "durchsichtiger Gips (CaSO₄·2H₂O), sehr weich", caution: "Löst sich in Wasser; nicht für Kristallwasser." },
  Lepidolith: { name: "Lepidolith", note: "Lithium-Glimmer, rosa bis violett" },
};

export const FOODS: Record<string, PageItem> = {
  "Rote Bete": { name: "Rote Bete", note: "Wurzelgemüse, roter Farbstoff Betanin" },
  Karotte: { name: "Karotte", note: "Wurzelgemüse, Carotinoide", atlas: "karotte" },
  Süßkartoffel: { name: "Süßkartoffel", note: "Knolle, Stärke; orange Sorten mit Beta-Carotin" },
  Linsen: { name: "Linsen", note: "Hülsenfrucht, Eiweiß und Ballaststoffe", atlas: "linsen" },
  Tomate: { name: "Tomate", note: "Frucht, roter Farbstoff Lycopin", atlas: "tomate" },
  Granatapfel: { name: "Granatapfel", note: "Frucht, rote Samen, Polyphenole", atlas: "granatapfel" },
  Orange: { name: "Orange", note: "Zitrusfrucht, Vitamin C" },
  Mango: { name: "Mango", note: "Steinfrucht, Carotinoide, Vitamin C" },
  Aprikose: { name: "Aprikose", note: "Steinfrucht, Carotinoide" },
  Kürbis: { name: "Kürbis", note: "Fruchtgemüse, Carotinoide", atlas: "kuerbis" },
  Zitrone: { name: "Zitrone", note: "Zitrusfrucht, Vitamin C, Zitronensäure", atlas: "zitrone" },
  Ingwer: { name: "Ingwer", note: "Wurzelstock, scharfe Gingerole", atlas: "ingwer" },
  Kurkuma: { name: "Kurkuma", note: "Wurzelstock, gelber Farbstoff Curcumin", atlas: "kurkuma" },
  Banane: { name: "Banane", note: "Frucht, Kalium, Stärke und Zucker" },
  Mais: { name: "Mais", note: "Getreide, Stärke, gelber Farbstoff Lutein" },
  Spinat: { name: "Spinat", note: "Blattgemüse, Chlorophyll, Folat, Eisen", atlas: "spinat" },
  Brokkoli: { name: "Brokkoli", note: "Kohlgemüse, Vitamin C und K", atlas: "brokkoli" },
  Avocado: { name: "Avocado", note: "Frucht, einfach ungesättigte Fettsäuren", atlas: "avocado" },
  Apfel: { name: "Apfel", note: "Kernobst, Pektin (Ballaststoff)", atlas: "apfel" },
  Grünkohl: { name: "Grünkohl", note: "Kohlgemüse, Vitamin K, Carotinoide" },
  Kiwi: { name: "Kiwi", note: "Frucht, Vitamin C" },
  Heidelbeeren: { name: "Heidelbeeren", note: "Beere, blauer Farbstoff Anthocyane", atlas: "heidelbeere" },
  Pflaume: { name: "Pflaume", note: "Steinfrucht, Anthocyane in der Schale" },
  Brombeeren: { name: "Brombeeren", note: "Beere, Anthocyane" },
  Kräutertee: { name: "Kräutertee", note: "Aufguss aus Kräutern, z. B. Kamille oder Pfefferminze" },
  Birne: { name: "Birne", note: "Kernobst, Ballaststoffe" },
  Trauben: { name: "Trauben", note: "Beere; blaue Sorten mit Anthocyanen in der Schale" },
  Aubergine: { name: "Aubergine", note: "Fruchtgemüse, Anthocyane in der Schale" },
  Rotkohl: { name: "Rotkohl", note: "Kohlgemüse, Anthocyane (rot bis blau je nach Säure)" },
  Süßkirsche: { name: "Süßkirsche", note: "Steinfrucht, Anthocyane", atlas: "kirsche" },
  Kokosnuss: { name: "Kokosnuss", note: "Steinfrucht, Fett (überwiegend gesättigt), Ballaststoffe" },
  Ananas: { name: "Ananas", note: "Frucht, Enzym Bromelain, Vitamin C" },
  Nüsse: { name: "Nüsse", note: "Samen, Fette und Eiweiß; häufiges Allergen", atlas: "walnuss", caution: "Nussallergie beachten." },
  "Lila Gemüse": { name: "Lila Gemüse", note: "z. B. Rotkohl, Aubergine, violette Karotten; Anthocyane" },
};

export const SCENTS: Record<string, PageItem> = {
  Zeder: { name: "Zeder", note: "holziger Duft des Zedernholzes" },
  Patchouli: { name: "Patchouli", note: "Blätter von Pogostemon cablin, erdiger Duft" },
  Vetiver: { name: "Vetiver", note: "Wurzel eines Grases, erdig-rauchiger Duft" },
  Myrrhe: { name: "Myrrhe", note: "Harz von Commiphora-Arten, balsamisch-herb" },
  Süßorange: { name: "Süßorange", note: "Schalenöl, frisch-fruchtig" },
  "Ylang-Ylang": { name: "Ylang-Ylang", note: "Blüten von Cananga odorata, süß-blumig" },
  Sandelholz: { name: "Sandelholz", note: "warm-holziger Duft; Santalum album gilt als gefährdet" },
  Jasmin: { name: "Jasmin", note: "Blüten, süß-blumig (meist als Absolue)" },
  Zitrone: { name: "Zitrone", note: "Schalenöl, frisch-säuerlich", atlas: "zitrone" },
  Ingwer: { name: "Ingwer", note: "Wurzelstock, würzig-scharf", atlas: "ingwer" },
  Rosmarin: { name: "Rosmarin", note: "Blätter, harzig-krautig", atlas: "rosmarin" },
  Rose: { name: "Rose", note: "Blüten von Rosa damascena, süß-blumig" },
  Geranie: { name: "Geranie", note: "Blätter von Pelargonium, rosig-grüner Duft" },
  Melisse: { name: "Melisse", note: "Blätter, zitronig" },
  Bergamotte: { name: "Bergamotte", note: "Schalenöl, zitrusartig-blumig", caution: "Kann die Haut lichtempfindlich machen." },
  Pfefferminze: { name: "Pfefferminze", note: "Blätter, mentholhaltig, kühl", atlas: "pfefferminze", caution: "Nicht im Gesicht von Säuglingen und Kleinkindern anwenden." },
  Eukalyptus: { name: "Eukalyptus", note: "Blätter, Cineol, frisch-kampferartig" },
  Kamille: { name: "Kamille", note: "Blüten, apfelig-krautig", atlas: "kamille" },
  Wacholder: { name: "Wacholder", note: "Beerenzapfen, harzig-frisch" },
  Lavendel: { name: "Lavendel", note: "Blüten, blumig-krautig", atlas: "lavendel" },
  Weihrauch: { name: "Weihrauch", note: "Harz von Boswellia-Arten, balsamisch-würzig; wird verräuchert" },
  Lotus: { name: "Lotus", note: "zarter Blütenduft; im Handel häufig nachgebildet" },
};

export const YOGA: Record<string, YogaItem> = {
  Berghaltung: { name: "Berghaltung", sanskrit: "Tadasana", level: "Anfänger", note: "Aufrechtes Stehen mit gleichmäßigem Stand" },
  Baum: { name: "Baum", sanskrit: "Vrksasana", level: "Anfänger", note: "Einbeinstand, Blick auf einen festen Punkt" },
  "Krieger I": { name: "Krieger I", sanskrit: "Virabhadrasana I", level: "Anfänger", note: "Ausfallschritt mit gestreckten Armen" },
  Girlande: { name: "Girlande", sanskrit: "Malasana", level: "Mittel", note: "Tiefe Hocke", caution: "Bei Knieproblemen weglassen oder unterstützen." },
  Schmetterling: { name: "Schmetterling", sanskrit: "Baddha Konasana", level: "Anfänger", note: "Sitz mit zusammengeführten Fußsohlen" },
  Taube: { name: "Taube", sanskrit: "Eka Pada Rajakapotasana", level: "Mittel", note: "Hüftöffner im Sitzen oder Liegen", caution: "Knie nicht erzwingen; bei Schmerz sofort lösen." },
  Göttin: { name: "Göttin", sanskrit: "Utkata Konasana", level: "Mittel", note: "Tiefer, breiter Stand" },
  Boot: { name: "Boot", sanskrit: "Navasana", level: "Mittel", note: "Balance auf den Sitzbeinen" },
  Drehsitz: { name: "Drehsitz", sanskrit: "Ardha Matsyendrasana", level: "Mittel", note: "Drehung der Wirbelsäule im Sitzen" },
  Sonnengruß: { name: "Sonnengruß", sanskrit: "Surya Namaskar", level: "Mittel", note: "Fließende Folge aus mehreren Haltungen" },
  Kobra: { name: "Kobra", sanskrit: "Bhujangasana", level: "Anfänger", note: "Sanfte Rückbeuge in Bauchlage" },
  Brücke: { name: "Brücke", sanskrit: "Setu Bandhasana", level: "Mittel", note: "Becken aus der Rückenlage anheben" },
  Kamel: { name: "Kamel", sanskrit: "Ustrasana", level: "Mittel", note: "Rückbeuge aus dem Kniestand", caution: "Nacken und Rücken nicht überstrecken; bei Beschwerden weglassen." },
  Fisch: { name: "Fisch", sanskrit: "Matsyasana", level: "Mittel", note: "Brustöffnung in Rückenlage", caution: "Nacken nicht überstrecken." },
  Schulterstand: { name: "Schulterstand", sanskrit: "Sarvangasana", level: "Fortgeschritten", note: "Umkehrhaltung auf den Schultern", caution: "Nur mit Anleitung. Bei Nacken- oder Rückenproblemen, Bluthochdruck, Augenerkrankungen, Schwangerschaft oder Schwindel vorher ärztlich klären." },
  Pflug: { name: "Pflug", sanskrit: "Halasana", level: "Fortgeschritten", note: "Beine hinter den Kopf gelegt", caution: "Nur mit Anleitung. Bei Nacken- oder Rückenproblemen, Bluthochdruck oder Schwangerschaft vorher ärztlich klären." },
  Löwenatem: { name: "Löwenatem", sanskrit: "Simhasana", level: "Anfänger", note: "Kräftiges Ausatmen mit herausgestreckter Zunge" },
  Kindhaltung: { name: "Kindhaltung", sanskrit: "Balasana", level: "Entspannung", note: "Ruhehaltung, Stirn am Boden" },
  "Sitzende Vorbeuge": { name: "Sitzende Vorbeuge", sanskrit: "Paschimottanasana", level: "Mittel", note: "Vorbeuge mit gestreckten Beinen" },
  Delfin: { name: "Delfin", sanskrit: "Ardha Pincha Mayurasana", level: "Mittel", note: "Auf die Unterarme gestützte Umkehr der Hüfte" },
  Wechselatmung: { name: "Wechselatmung", sanskrit: "Nadi Shodhana", level: "Atemübung", note: "Ruhige Atmung abwechselnd durch ein Nasenloch" },
  Kopfstand: { name: "Kopfstand", sanskrit: "Sirsasana", level: "Fortgeschritten", note: "Umkehrhaltung auf Kopf und Unterarmen", caution: "Nur mit Anleitung. Bei Nacken- oder Rückenproblemen, Bluthochdruck, Augenerkrankungen (z. B. Glaukom), Schwangerschaft oder Schwindel vorher ärztlich klären." },
  Lotussitz: { name: "Lotussitz", sanskrit: "Padmasana", level: "Meditation", note: "Gekreuzter Sitz mit Füßen auf den Oberschenkeln", caution: "Knie nicht erzwingen; ein einfacher Sitz tut es auch." },
  "Meditation im Sitzen": { name: "Meditation im Sitzen", sanskrit: "Sukhasana", level: "Meditation", note: "Einfacher Sitz, Wirbelsäule aufgerichtet" },
};

export const NATURE: Record<string, PageItem> = {
  Wald: { name: "Wald", note: "Bäume, Humus, Schatten und Stille" },
  Felsen: { name: "Felsen", note: "Stein und Erde unter den Füßen" },
  Garten: { name: "Garten", note: "Beete und Erde" },
  "Seen & Meer": { name: "Seen & Meer", note: "Weite Wasserflächen" },
  Wasserfälle: { name: "Wasserfälle", note: "Rauschendes Wasser" },
  Flussufer: { name: "Flussufer", note: "Fließendes Wasser" },
  Sonnenaufgang: { name: "Sonnenaufgang", note: "Morgenlicht im Freien" },
  Wiesen: { name: "Wiesen", note: "Offene Flächen im Sonnenlicht" },
  Weite: { name: "Weite", note: "Offene Landschaften mit weitem Blick" },
  Blumenwiesen: { name: "Blumenwiesen", note: "Blühende Wiesen" },
  Himmel: { name: "Himmel", note: "Wolken und freie Sicht nach oben" },
  Berggipfel: { name: "Berggipfel", note: "Klare Luft und Fernsicht" },
  Nachthimmel: { name: "Nachthimmel", note: "Sterne fernab von Stadtlicht" },
  Dämmerung: { name: "Dämmerung", note: "Übergang zwischen Tag und Nacht" },
  Berge: { name: "Berge", note: "Weite und klare Luft" },
  Sternenhimmel: { name: "Sternenhimmel", note: "Blick in den Nachthimmel" },
  "Stille Orte": { name: "Stille Orte", note: "Plätze ohne Lärm" },
};

// ------------------------------------------------------------------ the seven pages
const M = (title: string, minutes: number, kind: MedKind): MedItem => ({ title, minutes, kind });
const CLEAN = M("Chakra-Reinigung", 12, "reinigung");

export const PAGES: ChakraPage[] = [
  {
    id: "wurzel", short: "Stabilität", tagline: "Stabilität · Sicherheit · Verwurzelung",
    lead: "Finde Halt und Sicherheit. Das Wurzelchakra steht in der Überlieferung für Stabilität, Verwurzelung und das Gefühl, im Leben und im eigenen Körper angekommen zu sein.",
    posShort: "Beckenboden", colorShort: "Rot",
    card: { text: "Das Wurzelchakra liegt am Beckenboden, am unteren Ende der Wirbelsäule. In der Überlieferung steht es für Verbindung zur Erde, Grundvertrauen und Überleben.", element: "Erde", position: "Beckenboden", symbol: "Lotus mit 4 Blütenblättern", theme: "Stabilität, Sicherheit, Verwurzelung" },
    nameMeaning: "Muladhara: „Wurzelstütze“ (mula = Wurzel, adhara = Stütze)",
    meaning: ["Muladhara gilt in den tantrischen Texten als das unterste der Zentren, als Ort, an dem die „Schlangenkraft“ (Kundalini) ruht. Es wird mit der Erde als Element, dem Geruchssinn und der Silbe LAM verbunden.", "In der modernen Deutung stehen dafür Grundvertrauen, Sicherheit, Zugehörigkeit und der Bezug zum eigenen Körper."],
    bodyRegion: "Beckenboden, Füße und Beine (Zuordnung der Überlieferung)",
    under: ["Unsicherheit und Ängstlichkeit", "Gefühl, keinen Halt zu haben", "Schwierigkeit, im eigenen Körper anzukommen"],
    over: ["Starrheit und Festhalten", "Angst vor Veränderung", "Fixierung auf Besitz und Sicherheit"],
    balanced: ["Gefühl von Sicherheit", "Ruhe und fester Stand", "Verbundenheit mit dem Körper"],
    stones: ["Granat", "Roter Jaspis", "Schwarzer Turmalin", "Obsidian", "Rauchquarz"],
    foods: ["Rote Bete", "Karotte", "Süßkartoffel", "Linsen", "Tomate", "Granatapfel"],
    scents: ["Zeder", "Patchouli", "Vetiver", "Myrrhe"],
    herbs: [{ name: "Ingwer", note: "Zuordnung der Überlieferung", atlas: "ingwer" }, { name: "Brennnessel", note: "Zuordnung der Überlieferung", atlas: "brennnessel" }],
    colors: [{ name: "Rot", hex: "#e0453a" }, { name: "Braun", hex: "#8b5a3c" }, { name: "Schwarz", hex: "#2a2a30" }],
    hzLabel: "Sicherheit & Erdung", natureSound: "Naturklänge Wald",
    yoga: ["Berghaltung", "Baum", "Krieger I", "Girlande"], nature: ["Wald", "Felsen", "Garten"],
    affirmations: ["Ich bin sicher und fest im Leben verwurzelt.", "Ich darf Raum einnehmen.", "Mein Körper trägt mich."],
    meditations: [M("Erdung & Halt", 10, "erdung"), M("Licht im Becken", 12, "licht"), M("Klang der Silbe LAM", 8, "klang"), CLEAN],
  },
  {
    id: "sakral", short: "Kreativität", tagline: "Kreativität · Gefühl · Lebensfreude",
    lead: "Komm in den Fluss. Das Sakralchakra steht in der Überlieferung für Gefühl, Lebensfreude und schöpferische Kraft.",
    posShort: "Unterbauch", colorShort: "Orange",
    card: { text: "Das Sakralchakra liegt im Unterbauch, etwa eine Handbreit unter dem Nabel. In der Überlieferung steht es für Fließen, Gefühle, Beziehung und schöpferische Lust.", element: "Wasser", position: "Unterbauch", symbol: "Lotus mit 6 Blütenblättern", theme: "Kreativität, Gefühl, Lebensfreude" },
    nameMeaning: "Svadhisthana: „eigener Sitz“ (sva = das Eigene, adhisthana = Wohnstätte)",
    meaning: ["Svadhisthana wird in den Texten mit dem Element Wasser, dem Geschmackssinn und der Silbe VAM verbunden.", "Moderne Deutungen verknüpfen es mit Gefühlen, Genussfähigkeit, Kreativität und dem Umgang mit Nähe."],
    bodyRegion: "Unterbauch und Becken (Zuordnung der Überlieferung)",
    under: ["Gefühl von Leere oder Lustlosigkeit", "Hemmung, Gefühle auszudrücken", "wenig Spielfreude"],
    over: ["Gefühlsschwankungen", "Maßlosigkeit", "Abhängigkeit von äußeren Reizen"],
    balanced: ["Lebensfreude", "Kreativität", "Offenheit für Nähe"],
    stones: ["Karneol", "Orangenkalzit", "Mondstein", "Bernstein", "Achat"],
    foods: ["Orange", "Mango", "Aprikose", "Kürbis", "Karotte", "Süßkartoffel"],
    scents: ["Süßorange", "Ylang-Ylang", "Sandelholz", "Jasmin"],
    herbs: [{ name: "Ringelblume", note: "Zuordnung der Überlieferung", atlas: "ringelblume" }, { name: "Kamille", note: "Zuordnung der Überlieferung", atlas: "kamille" }],
    colors: [{ name: "Orange", hex: "#f08a3c" }, { name: "Koralle", hex: "#f27a6a" }, { name: "Gold", hex: "#f0d18b" }],
    hzLabel: "Wandel & Fluss", natureSound: "Naturklänge Wasser",
    yoga: ["Schmetterling", "Taube", "Göttin", "Girlande"], nature: ["Seen & Meer", "Wasserfälle", "Flussufer"],
    affirmations: ["Ich erlaube mir, Freude und Fluss zu erleben.", "Meine Gefühle dürfen sein.", "Ich bin offen für Neues."],
    meditations: [M("Fluss & Weite", 10, "weite"), M("Orangefarbenes Licht", 12, "licht"), M("Klang der Silbe VAM", 8, "klang"), CLEAN],
  },
  {
    id: "solar", short: "Selbstvertrauen", tagline: "Selbstvertrauen · Wille · Kraft",
    lead: "Finde deine Mitte. Das Solarplexus-Chakra steht in der Überlieferung für Willenskraft, Selbstvertrauen und Handlungsfreude.",
    posShort: "Oberbauch", colorShort: "Gelb",
    card: { text: "Das Solarplexus-Chakra liegt im Oberbauch, in der Magengrube. In der Überlieferung steht es für Willen, Selbstwert und das Gefühl, das eigene Leben zu gestalten.", element: "Feuer", position: "Oberbauch", symbol: "Lotus mit 10 Blütenblättern", theme: "Selbstvertrauen, Wille, Kraft" },
    nameMeaning: "Manipura: „Stadt der Juwelen“ (mani = Juwel, pura = Stadt)",
    meaning: ["Manipura wird mit dem Element Feuer, dem Sehsinn und der Silbe RAM verbunden und als „Sonne“ des Körpers beschrieben.", "Moderne Deutungen knüpfen daran Selbstwert, Entschlossenheit und Eigenverantwortung."],
    bodyRegion: "Oberbauch, Magengrube (Zuordnung der Überlieferung)",
    under: ["Zweifel an sich selbst", "Zögern und Unentschlossenheit", "Gefühl von Ohnmacht"],
    over: ["Dominanz und Kontrollbedürfnis", "Ungeduld", "Perfektionsdrang"],
    balanced: ["Selbstvertrauen", "Entscheidungsfreude", "innere Klarheit"],
    stones: ["Citrin", "Tigerauge", "Pyrit", "Bernstein", "Orangenkalzit"],
    foods: ["Zitrone", "Ingwer", "Kurkuma", "Banane", "Mais"],
    scents: ["Zitrone", "Ingwer", "Rosmarin", "Bergamotte"],
    herbs: [{ name: "Kamille", note: "Zuordnung der Überlieferung", atlas: "kamille" }, { name: "Kurkuma", note: "Zuordnung der Überlieferung", atlas: "kurkuma" }, { name: "Ingwer", note: "Zuordnung der Überlieferung", atlas: "ingwer" }],
    colors: [{ name: "Gelb", hex: "#f2cf3e" }, { name: "Gold", hex: "#f0d18b" }, { name: "Bernstein", hex: "#d98a2b" }],
    hzLabel: "Kraft & Wille", natureSound: "Naturklänge Feuer",
    yoga: ["Boot", "Drehsitz", "Sonnengruß", "Krieger I"], nature: ["Sonnenaufgang", "Wiesen", "Weite"],
    affirmations: ["Ich vertraue meiner Kraft und handle mit Klarheit.", "Ich darf Entscheidungen treffen.", "Ich bin genug."],
    meditations: [M("Die eigene Mitte", 10, "erdung"), M("Goldenes Licht", 12, "licht"), M("Klang der Silbe RAM", 8, "klang"), CLEAN],
  },
  {
    id: "herz", short: "Liebe", tagline: "Liebe · Mitgefühl · Verbundenheit",
    lead: "Öffne dich für Verbundenheit. Das Herzchakra steht in der Überlieferung für Mitgefühl, Liebe und den Ausgleich zwischen den oberen und den unteren Zentren.",
    posShort: "Brustmitte", colorShort: "Grün / Rosa",
    card: { text: "Das Herzchakra liegt in der Mitte der Brust, zwischen den drei oberen und den drei unteren Zentren. In der Überlieferung steht es für Liebe, Mitgefühl und Verbundenheit.", element: "Luft", position: "Brustmitte", symbol: "Lotus mit 12 Blütenblättern", theme: "Liebe, Mitgefühl, Verbundenheit" },
    nameMeaning: "Anahata: „unberührt“ oder „ungeschlagen“ (der Klang, der ohne Anschlag entsteht)",
    meaning: ["Anahata wird mit dem Element Luft, dem Tastsinn und der Silbe YAM verbunden. Es liegt in der Mitte des Systems und gilt als Ort des Ausgleichs.", "Moderne Deutungen verbinden es mit Liebe, Vergebung, Mitgefühl und dem Aufbau von Vertrauen in Beziehungen."],
    bodyRegion: "Brustraum, Arme und Hände (Zuordnung der Überlieferung)",
    under: ["Rückzug und Abgrenzung", "Schwierigkeit zu vertrauen", "Härte gegen sich selbst"],
    over: ["Selbstaufgabe", "Überfürsorglichkeit", "Klammern"],
    balanced: ["Mitgefühl", "Vertrauen", "Gelassenheit in Beziehungen"],
    stones: ["Rosenquarz", "Malachit", "Grüner Aventurin", "Rhodonit", "Smaragd"],
    foods: ["Spinat", "Brokkoli", "Avocado", "Apfel", "Grünkohl", "Kiwi"],
    scents: ["Rose", "Geranie", "Melisse", "Bergamotte"],
    herbs: [{ name: "Rose", note: "Zuordnung der Überlieferung" }, { name: "Melisse", note: "Zuordnung der Überlieferung" }, { name: "Weißdorn", note: "Zuordnung der Überlieferung" }],
    colors: [{ name: "Grün", hex: "#46c46f" }, { name: "Rosa", hex: "#f08fb6" }, { name: "Gold", hex: "#f0d18b" }],
    hzLabel: "Verbindung & Liebe", natureSound: "Naturklänge Vogelstimmen",
    yoga: ["Kobra", "Brücke", "Kamel", "Fisch"], nature: ["Blumenwiesen", "Wald", "Garten"],
    affirmations: ["Ich öffne mich für Liebe und Verbundenheit.", "Ich begegne mir selbst mit Mitgefühl.", "Ich darf geben und empfangen."],
    meditations: [M("Weite im Brustraum", 10, "weite"), M("Grünes Licht", 12, "licht"), M("Klang der Silbe YAM", 8, "klang"), CLEAN],
  },
  {
    id: "hals", short: "Ausdruck", tagline: "Ausdruck · Wahrheit · Kommunikation",
    lead: "Finde deine Stimme. Das Halschakra steht in der Überlieferung für Ausdruck, Wahrhaftigkeit und das Zuhören.",
    posShort: "Kehle", colorShort: "Hellblau",
    card: { text: "Das Halschakra liegt im Bereich der Kehle. In der Überlieferung steht es für Sprache, Ausdruck und die Fähigkeit, die eigene Wahrheit auszusprechen.", element: "Raum (Äther)", position: "Kehle", symbol: "Lotus mit 16 Blütenblättern", theme: "Ausdruck, Wahrheit, Kommunikation" },
    nameMeaning: "Vishuddha: „besonders rein“ (vi = sehr, shuddha = rein)",
    meaning: ["Vishuddha wird mit dem Element Raum (Äther), dem Hörsinn und der Silbe HAM verbunden.", "Moderne Deutungen verknüpfen es mit Stimme, ehrlicher Kommunikation und dem Zuhören."],
    bodyRegion: "Hals, Nacken, Schultern und Mund (Zuordnung der Überlieferung)",
    under: ["Scheu zu sprechen", "Schwierigkeit, Gedanken auszudrücken", "Zurückhalten der eigenen Meinung"],
    over: ["Vielrederei", "Unterbrechen und Belehren", "Schärfe im Ton"],
    balanced: ["klarer Ausdruck", "gutes Zuhören", "Stimmigkeit zwischen Wort und Haltung"],
    stones: ["Lapislazuli", "Aquamarin", "Sodalith", "Türkis", "Blauer Chalcedon"],
    foods: ["Heidelbeeren", "Pflaume", "Brombeeren", "Kräutertee", "Birne"],
    scents: ["Pfefferminze", "Eukalyptus", "Kamille", "Wacholder"],
    herbs: [{ name: "Salbei", note: "Zuordnung der Überlieferung", atlas: "salbei" }, { name: "Pfefferminze", note: "Zuordnung der Überlieferung", atlas: "pfefferminze" }, { name: "Kamille", note: "Zuordnung der Überlieferung", atlas: "kamille" }],
    colors: [{ name: "Hellblau", hex: "#4aa8e8" }, { name: "Türkis", hex: "#3cc7c0" }, { name: "Silber", hex: "#cfd6e0" }],
    hzLabel: "Ausdruck & Klarheit", natureSound: "Naturklänge Wind",
    yoga: ["Schulterstand", "Pflug", "Fisch", "Löwenatem"], nature: ["Himmel", "Berggipfel", "Seen & Meer"],
    affirmations: ["Ich drücke meine Wahrheit klar und freundlich aus.", "Meine Stimme darf gehört werden.", "Ich höre aufmerksam zu."],
    meditations: [M("Stille im Hals", 10, "stille"), M("Blaues Licht", 12, "licht"), M("Klang der Silbe HAM", 8, "klang"), CLEAN],
  },
  {
    id: "stirn", short: "Intuition", tagline: "Intuition · Einsicht · Vorstellungskraft",
    lead: "Schärfe deinen inneren Blick. Das Stirnchakra, auch „drittes Auge“ genannt, steht in der Überlieferung für Einsicht, Vorstellungskraft und Intuition.",
    posShort: "Zwischen den Augenbrauen", colorShort: "Indigo",
    card: { text: "Das Stirnchakra liegt zwischen den Augenbrauen. In der Überlieferung steht es für Einsicht, innere Bilder und das Erkennen von Zusammenhängen.", element: "Licht / Geist", position: "Zwischen den Augenbrauen", symbol: "Lotus mit 2 Blütenblättern", theme: "Intuition, Einsicht, Vorstellungskraft" },
    nameMeaning: "Ajna: „Befehl“ oder „Wahrnehmung“",
    meaning: ["Ajna wird mit dem Geist als Element und der Silbe OM verbunden. Der Lotus hat zwei Blütenblätter.", "Moderne Deutungen verknüpfen es mit Intuition, Vorstellungskraft und der Fähigkeit, Abstand zu gewinnen."],
    bodyRegion: "Stirn und Augen (Zuordnung der Überlieferung)",
    under: ["Zweifel an der eigenen Wahrnehmung", "Schwierigkeit, Entscheidungen zu überblicken", "wenig Vorstellungskraft"],
    over: ["Grübeln", "Tagträumen und Weltflucht", "Überanalyse"],
    balanced: ["Einsicht", "Vorstellungskraft", "Ruhe im Denken"],
    stones: ["Amethyst", "Fluorit", "Labradorit", "Lapislazuli", "Sodalith"],
    foods: ["Heidelbeeren", "Trauben", "Aubergine", "Rotkohl", "Brombeeren", "Süßkirsche"],
    scents: ["Lavendel", "Rosmarin", "Wacholder", "Weihrauch"],
    herbs: [{ name: "Rosmarin", note: "Zuordnung der Überlieferung", atlas: "rosmarin" }, { name: "Lavendel", note: "Zuordnung der Überlieferung", atlas: "lavendel" }],
    colors: [{ name: "Indigo", hex: "#5a63d6" }, { name: "Violett", hex: "#a46be0" }, { name: "Silber", hex: "#cfd6e0" }],
    hzLabel: "Intuition & Einsicht", natureSound: "Naturklänge Nacht",
    yoga: ["Kindhaltung", "Sitzende Vorbeuge", "Delfin", "Wechselatmung"], nature: ["Nachthimmel", "Dämmerung", "Berge"],
    affirmations: ["Ich vertraue meiner inneren Wahrnehmung.", "Ich sehe klar, was jetzt wichtig ist.", "Ich darf still werden und hinhören."],
    meditations: [M("Innere Stille", 10, "stille"), M("Indigo-Licht", 12, "licht"), M("Klang der Silbe OM", 8, "klang"), CLEAN],
  },
  {
    id: "krone", short: "Spiritualität", tagline: "Spiritualität · Bewusstsein · Einheit",
    lead: "Verbinde dich mit deinem höheren Bewusstsein und erlebe die tiefe Einheit mit dem Universum. Das Kronenchakra steht für Spiritualität, innere Weisheit und die Verbindung zu allem, was ist.",
    posShort: "Oberer Kopf", colorShort: "Violett / Weiß",
    card: { text: "Das Kronenchakra liegt am höchsten Punkt des Kopfes. In der Überlieferung ist es das Tor zum höheren Bewusstsein, zur universellen Weisheit und zur Einheit mit allem.", element: "Gedanke / Äther (in manchen Darstellungen: jenseits der Elemente)", position: "Scheitelpunkt", symbol: "1000-blättriger Lotus", theme: "Spiritualität, Bewusstsein, Einheit, höhere Weisheit" },
    nameMeaning: "Sahasrara: „tausendfach“ (sahasra = tausend)",
    meaning: ["Sahasrara gilt in den tantrischen Texten als höchstes Zentrum am Scheitel, dargestellt als „tausendblättriger Lotus“. Es steht dort für die Einung von individuellem Bewusstsein und Absolutem, nicht für ein Element.", "Moderne Deutungen verknüpfen es mit Sinnfragen, innerer Stille, Dankbarkeit und dem Gefühl der Verbundenheit mit allem."],
    bodyRegion: "Scheitel und Kopf (Zuordnung der Überlieferung)",
    under: ["Gefühl der Trennung", "Sinnleere", "starre Sicht auf die Welt"],
    over: ["Weltfremdheit", "Abgehobensein", "Flucht ins Geistige"],
    balanced: ["Gefühl von Verbundenheit", "innere Stille", "Offenheit"],
    stones: ["Amethyst", "Bergkristall", "Selenit", "Lepidolith", "Mondstein"],
    foods: ["Heidelbeeren", "Trauben", "Kokosnuss", "Ananas", "Nüsse", "Lila Gemüse"],
    scents: ["Weihrauch", "Lavendel", "Lotus", "Sandelholz"],
    herbs: [{ name: "Lavendel", note: "Zuordnung der Überlieferung", atlas: "lavendel" }, { name: "Salbei", note: "Zuordnung der Überlieferung", atlas: "salbei" }, { name: "Lotus", note: "Zuordnung der Überlieferung" }],
    colors: [{ name: "Violett", hex: "#a46be0" }, { name: "Weiß", hex: "#f4f1ff" }, { name: "Gold", hex: "#f0d18b" }],
    hzLabel: "Verbindung & Bewusstsein", natureSound: "Naturklänge Kosmos",
    yoga: ["Kopfstand", "Lotussitz", "Kindhaltung", "Meditation im Sitzen"], nature: ["Berge", "Sternenhimmel", "Stille Orte"],
    affirmations: ["Ich bin Teil des Universums und mit allem verbunden.", "Ich bin offen für Stille und Weite.", "Ich bin dankbar für das, was ist."],
    meditations: [M("Verbindung zum Universum", 10, "weite"), M("Licht & Bewusstsein", 15, "licht"), M("Innere Stille", 10, "stille"), CLEAN],
  },
];

export const pageOf = (id: string): ChakraPage => PAGES.find((p) => p.id === id) ?? PAGES[PAGES.length - 1];

/** the three Solfeggio-style values shown for a chakra: its own and the two below it */
export function hzLines(hz: number): number[] {
  const i = SOLFEGGIO.indexOf(hz);
  return i < 0 ? [hz] : SOLFEGGIO.slice(Math.max(0, i - 2), i + 1).reverse();
}

// ------------------------------------------------------------------ meditation texts (reading guides)
export interface MedCtx { name: string; pos: string; color: string; syllable: string }
const START = "Setze dich bequem hin, die Wirbelsäule aufgerichtet. Schließe die Augen oder senke den Blick.";
const END = "Atme noch einige Male ruhig. Spüre den Körper, öffne langsam die Augen und bewege dich ohne Eile.";

export function medSteps(kind: MedKind, c: MedCtx): string[] {
  const pos = c.pos;
  switch (kind) {
    case "erdung": return [START, "Spüre, wo dein Körper den Boden oder den Sitz berührt. Nimm das Gewicht wahr.", `Lenke die Aufmerksamkeit zur Stelle des ${c.name}: ${pos}.`, "Atme ruhig. Stelle dir mit jedem Ausatmen vor, wie das Gewicht sinkt und der Körper getragen wird.", "Bleibe einige Atemzüge bei diesem Gefühl von Halt.", END];
    case "weite": return [START, "Beobachte den Atem, ohne ihn zu verändern.", `Lenke die Aufmerksamkeit zu ${pos}.`, "Stelle dir vor, wie sich der Raum um diese Stelle weitet, mit jedem Einatmen ein wenig mehr.", "Lass die Vorstellung wachsen, bis sie den ganzen Körper und den Raum um dich umfasst.", END];
    case "licht": return [START, "Atme ruhig und gleichmäßig.", `Stelle dir an der Stelle ${pos} ein sanftes Licht in der Farbe ${c.color} vor.`, "Mit dem Einatmen wird das Licht ein wenig heller, mit dem Ausatmen weicher.", "Lass das Licht sich langsam im ganzen Körper ausbreiten.", END];
    case "klang": return [START, `Atme ein. Beim Ausatmen summe oder sprich die Silbe „${c.syllable}“ leise.`, `Spüre die Schwingung im Körper, besonders bei ${pos}.`, "Wiederhole die Silbe in deinem eigenen Tempo, einige Minuten lang.", "Lass die Silbe in Stille ausklingen und bleibe einen Moment still.", END];
    case "stille": return [START, "Beobachte die Gedanken wie vorbeiziehende Wolken, ohne ihnen zu folgen.", "Kehre bei jedem Abschweifen sanft zum Atem zurück.", `Lenke zwischendurch die Aufmerksamkeit zu ${pos}.`, "Bleibe in der Stille, solange es sich angenehm anfühlt.", END];
    case "reinigung": return [START, "Beginne am Beckenboden und stelle dir dort rotes Licht vor. Atme ruhig.", "Gehe Schritt für Schritt aufwärts: Unterbauch (orange), Oberbauch (gelb), Brustmitte (grün), Kehle (blau), zwischen den Augenbrauen (indigo).", "Stelle dir am Scheitel violettes oder weißes Licht vor.", "Stelle dir vor, wie das Licht die ganze Linie durchzieht und alles leicht und klar wirkt.", END];
  }
}
export const MED_KINDS: Record<MedKind, { icon: string; tint: string; label: string }> = {
  erdung: { icon: "root", tint: "#e0453a", label: "Erdung" }, weite: { icon: "globe", tint: "#7fb4ff", label: "Weite" }, licht: { icon: "sun", tint: "#f0d18b", label: "Licht" },
  klang: { icon: "sound", tint: "#58d6e8", label: "Klang" }, stille: { icon: "moon", tint: "#a46be0", label: "Stille" }, reinigung: { icon: "sparkle", tint: "#9ad8ff", label: "Vorstellung" },
};

// ------------------------------------------------------------------ picture slots
export const slug = (s: string) => s.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export type ItemGroup = "stein" | "essen" | "duft" | "yoga" | "natur";
export const itemSlot = (group: ItemGroup, key: string) => `chakren-${group}-${slug(key)}`;
export const MED_SLOT = (kind: MedKind) => `chakren-med-${kind}`;

/** every own picture slot of the page (items with an atlas entry use `atlas-<id>` instead) with the prompt core */
export function pageSlots(): { name: string; group: string; w: number; h: number; bg: "black" | "scene"; prompt: string }[] {
  const out = new Map<string, { name: string; group: string; w: number; h: number; bg: "black" | "scene"; prompt: string }>();
  const add = (name: string, group: string, w: number, h: number, bg: "black" | "scene", prompt: string) => { if (!out.has(name)) out.set(name, { name, group, w, h, bg, prompt }); };
  const used = (list: (p: ChakraPage) => string[]) => [...new Set(PAGES.flatMap(list))];
  for (const k of used((p) => p.stones)) if (!STONES[k].atlas) add(itemSlot("stein", k), "stein", 600, 600, "black", `one ${k} crystal (${STONES[k].note}), softly glowing, studio macro, on a pure black background, no text`);
  for (const k of used((p) => p.foods)) if (!FOODS[k].atlas) add(itemSlot("essen", k), "essen", 600, 600, "black", `${k} (${FOODS[k].note}), fresh, glowing in soft light, on a pure black background, no text`);
  for (const k of used((p) => p.scents)) if (!SCENTS[k].atlas) add(itemSlot("duft", k), "duft", 600, 600, "black", `${k} as an aromatic ingredient (${SCENTS[k].note}), with a small glass bottle, glowing in soft light, on a pure black background, no text`);
  for (const k of used((p) => p.yoga)) add(itemSlot("yoga", k), "yoga", 600, 600, "scene", `a person in the yoga pose ${YOGA[k].name} (${YOGA[k].sanskrit}) at sunset, dark cinematic, no text`);
  for (const k of used((p) => p.nature)) add(itemSlot("natur", k), "natur", 800, 500, "scene", `${k}: ${NATURE[k].note}, dark cinematic landscape, no text`);
  return [...out.values()];
}
