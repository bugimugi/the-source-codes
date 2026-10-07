import type { EvidenceLevel } from "./types";

/**
 * Station "Erdung & Metalle". Three parts: the body as a "battery" (static charge, the real cell battery, the earthing claim),
 * metals and shapes as jewellery, and the pyramid with its golden tip. As everywhere: what physics describes, what tradition says
 * and what is merely claimed stay apart. Sources were seen as search excerpts only (Pilot): Source pending verification.
 * Scores for surfaces and shoes are example values of the editors for the picture, not measurements.
 */
export const EARTH_INTRO = "Der Körper gilt oft als Batterie, die sich im Alltag auflädt und sich barfuß auf Wiese, Sand oder im Wasser „erdet“. Metalle wie Gold, Kupfer, Zink oder Eisen trägt man als Schmuck, oft in geometrischen Formen. Und die Spitze der Pyramide soll aus Gold gewesen sein. Hier siehst du, was die Physik dazu beschreibt, was überliefert wird und was nur behauptet wird.";

export const EARTH_NOTICE = "Pilot: nicht fachlich geprüft. Die Darstellungen sind Vorstellungshilfen mit Beispielwerten, keine Messungen. Die Quellen wurden bisher nur als Suchauszüge gesehen: Source pending verification. Informationsangebot – keine medizinische Beratung. Erdungsprodukte, die an Steckdosen angeschlossen werden, nur als geprüfte Geräte verwenden und nie selbst bauen; bei Gewitter nie barfuß im Freien, auf nassem Boden oder im Wasser sein.";

export interface Surface { id: string; name: string; score: number; label: string; note: string; ground: string }
export interface Shoe { id: string; name: string; score: number; note: string }

/** how well the ground conducts, as a picture value 0..1 (qualitative; tables of soil resistivity span orders of magnitude) */
export const SURFACES: Surface[] = [
  { id: "wiese-nass", name: "Feuchte Wiese oder Erde", score: 0.9, label: "gut leitend", note: "Feuchter Boden leitet gut: Wasser mit gelösten Salzen trägt den Strom. Feuchter Ton liegt laut Tabellen bei wenigen bis wenigen Dutzend Ohmmetern.", ground: "#2f5d34" },
  { id: "wiese-trocken", name: "Trockene Wiese", score: 0.35, label: "mittel", note: "Trockener Boden leitet deutlich schlechter; je trockener, desto höher der Widerstand.", ground: "#6f7a3c" },
  { id: "sand-nass", name: "Nasser Sand (Strand)", score: 0.6, label: "mittel bis gut", note: "Nasser Sand liegt laut einer Tabelle bei etwa 130 bis 400 Ohmmetern; Salzwasser im Sand verbessert die Leitung.", ground: "#b99a62" },
  { id: "sand-trocken", name: "Trockener Sand", score: 0.15, label: "schlecht leitend", note: "Trockener Sand liegt laut einer Tabelle bei etwa 1.500 bis 4.200 Ohmmetern, also um ein Vielfaches höher.", ground: "#d6bd86" },
  { id: "meer", name: "Meerwasser (flach)", score: 1, label: "sehr gut leitend", note: "Salzwasser gehört zu den am besten leitenden natürlichen Stoffen. Bei Gewitter ist offenes Wasser gefährlich.", ground: "#1f6f8f" },
  { id: "suess", name: "Süßwasser (See, Bach)", score: 0.5, label: "mittel", note: "Süßwasser leitet schlechter als Meerwasser, weil es weniger gelöste Salze enthält.", ground: "#2f8aa0" },
  { id: "asphalt", name: "Asphalt", score: 0.05, label: "kaum leitend", note: "Asphalt ist ein schlechter Leiter.", ground: "#3a3c40" },
  { id: "parkett", name: "Holz- oder Parkettboden", score: 0.03, label: "isoliert", note: "Trockenes Holz isoliert.", ground: "#8a5f3a" },
  { id: "teppich", name: "Teppich (Kunstfaser)", score: 0.02, label: "isoliert", note: "Auf Kunstfaser-Teppich entsteht beim Gehen durch Reibung besonders leicht eine statische Aufladung.", ground: "#6a4a6e" },
];

export const SHOES: Shoe[] = [
  { id: "barfuss", name: "Barfuß", score: 1, note: "Die feuchte Haut leitet am besten." },
  { id: "leder", name: "Ledersohle", score: 0.25, note: "Leder leitet mäßig, feucht besser als trocken." },
  { id: "gummi", name: "Gummisohle (Turnschuh)", score: 0.02, note: "Gummi isoliert sehr stark: Wer in Gummisohlen über Teppich geht, bleibt geladen, bis er etwas Leitendes berührt." },
];

export interface Metal { id: string; name: string; color: string; hi: string; ms: number; role: string; facts: string[]; tradition: string }

/** electrical conductivity in MS/m at about 20 °C: textbook values (engineeringtoolbox.com, search excerpt) */
export const METALS: Metal[] = [
  {
    id: "gold", name: "Gold", color: "#d9a81f", hi: "#fff0a8", ms: 45,
    role: "Kein Baustein des Körpers.",
    facts: ["Chemisch sehr stabil, es läuft nicht an und korrodiert nicht. Deshalb steckt es in elektronischen Kontakten.", "Reines Gold löst selten Allergien aus; häufiger sind Legierungsmetalle wie Nickel.", "Goldsalze wurden früher als Arzneimittel gegen Rheuma verwendet. Das ist etwas anderes als Goldschmuck auf der Haut (aus dem Gedächtnis, Source pending verification)."],
    tradition: "Sonne, Unvergänglichkeit, Macht: in vielen Kulturen das Metall der Götter und Herrscher.",
  },
  {
    id: "silber", name: "Silber", color: "#bfc6d0", hi: "#ffffff", ms: 63,
    role: "Kein Baustein des Körpers.",
    facts: ["Leitet Strom von allen Metallen am besten.", "Silberionen hemmen viele Keime und werden in Wundauflagen genutzt.", "Silberschmuck läuft an (Silbersulfid), das lässt sich abpolieren.", "Silber zum Einnehmen („kolloidales Silber“) kann zu bleibender grau-blauer Hautverfärbung führen (Argyrie; aus dem Gedächtnis, Source pending verification)."],
    tradition: "Mond, Reinheit, Schutz: oft als Gegenstück zum Gold genannt.",
  },
  {
    id: "kupfer", name: "Kupfer", color: "#c4733f", hi: "#ffd0a8", ms: 59,
    role: "Ein lebenswichtiges Spurenelement, das in sehr kleinen Mengen über die Nahrung aufgenommen wird.",
    facts: ["Leitet Strom fast so gut wie Silber, deshalb sind Kabel aus Kupfer.", "Kupferoberflächen wirken auf viele Keime hemmend.", "Auf der Haut kann Kupfer grüne Spuren hinterlassen (Kupfersalze, harmlos).", "Kupferarmbänder: Eine Studie der Universität York (Richmond u. a. 2013, 70 Personen mit rheumatoider Arthritis, doppelblind, mit Placebo-Armbändern) fand keinen Unterschied zu Placebo bei Schmerz, Entzündung oder Beweglichkeit."],
    tradition: "Venus, Liebe und Ausgleich; in vielen Volksheilkunden als Armband bei Gelenkschmerzen getragen.",
  },
  {
    id: "zink", name: "Zink", color: "#9fb0bf", hi: "#eef6ff", ms: 16.6,
    role: "Ein lebenswichtiges Spurenelement für viele Enzyme; der Körper nimmt es über die Nahrung auf, nicht über Schmuck.",
    facts: ["Leitet Strom nur etwa ein Viertel so gut wie Silber.", "Zink ist mit Kupfer in Messing und schützt Eisen vor Rost (Verzinken).", "Zinkschmuck ist selten; Belege für eine Wirkung durch Hautkontakt habe ich nicht gefunden."],
    tradition: "In der Überlieferung kaum eine eigene Rolle; in der Ernährungslehre wichtig.",
  },
  {
    id: "eisen", name: "Eisen", color: "#6b6f78", hi: "#c3c7d0", ms: 9.93,
    role: "Ein lebenswichtiger Baustein im Blut (Hämoglobin) und in vielen Enzymen. Dort ist es gebunden, nicht als Metall.",
    facts: ["Leitet Strom nur etwa ein Sechstel so gut wie Silber.", "Eisen rostet an feuchter Luft, deshalb ist Schmuck meist aus Edelstahl.", "Der Körper regelt seinen Eisenhaushalt selbst; ein Eisenarmband liefert kein Eisen."],
    tradition: "Mars, Kraft und Schutz: Eisen galt vielerorts als Schutz gegen böse Geister (Überlieferung).",
  },
];

export interface Shape { id: string; name: string; tradition: string }
export const SHAPES: Shape[] = [
  { id: "kreis", name: "Kreis, Ring", tradition: "Ganzheit, Kreislauf, Ewigkeit: der Ring hat keinen Anfang und kein Ende (Überlieferung)." },
  { id: "dreieck", name: "Dreieck, Pyramide", tradition: "Die Spitze nach oben steht in vielen Überlieferungen für Feuer und Aufstieg, das Dreieck für Dreiheit (Überlieferung)." },
  { id: "quadrat", name: "Quadrat", tradition: "Erde, Stabilität, die vier Himmelsrichtungen (Überlieferung)." },
  { id: "spirale", name: "Spirale", tradition: "Wachstum und Wandlung; Spiralen finden sich in der Natur und in der Steinzeitkunst (Überlieferung)." },
  { id: "sechseck", name: "Sechseck", tradition: "Das Muster der Bienenwabe: Sechsecke füllen eine Fläche ohne Lücke und sparen Material (Naturbeobachtung)." },
  { id: "blume", name: "Blume des Lebens", tradition: "Sich überlappende Kreise, in der „Heiligen Geometrie“ ein viel genanntes Muster (Überlieferung, siehe die Seite Frequenz)." },
];

export interface EClaim { text: string; level: EvidenceLevel; counter: string }

export const CLAIM_BATTERY: EClaim = {
  text: "Der Körper lädt sich im Alltag auf wie eine Batterie. Barfuß auf Erde, Sand oder im Wasser nimmt er freie Elektronen aus der Erde auf, entlädt und erdet sich, und das senkt Entzündungen und verbessert Schlaf und Wohlbefinden.",
  level: "hypothesis",
  counter: "Zwei Teile sind zu trennen. Das Aufladen durch Reibung und das Ableiten über den Boden ist Physik, wird aber in Millisekunden erledigt und hat keine bekannte Gesundheitswirkung. Der gesundheitliche Nutzen ist eine Hypothese: Es gibt einzelne kleine Studien, oft von Anbietern von Erdungsprodukten finanziert (der Gründer eines solchen Unternehmens hat laut Suchauszug die frühe Forschung bezahlt), und unabhängige größere Untersuchungen fehlen. Bisher gibt es keinen anerkannten Mechanismus, wie aufgenommene Elektronen im Körper „freie Radikale“ neutralisieren sollen. Quellen: Suchauszüge, Source pending verification.",
};

export const CLAIM_METAL: EClaim = {
  text: "Metall am Körper (Gold, Kupfer, Zink, Eisen), besonders in geometrischer Form, verändert oder bündelt die Energie und die elektrischen Felder des Körpers und stärkt Gesundheit und Wohlbefinden.",
  level: "claimed",
  counter: "Ein Messverfahren für „die Energie des Körpers“, die ein Schmuckstück verändern könnte, habe ich nicht gefunden. Kontrollierte Studien mit Kupfer- und Magnetarmbändern fanden keinen Nutzen über Placebo hinaus (York 2013). Schmuck kann dagegen Kontaktallergien auslösen (häufig durch Nickel). Dass eine Form wie das Dreieck Energie „bündelt“, ist nicht belegt; die Formen stehen in der Überlieferung für Bedeutungen, nicht für Wirkungen. Quellen: Suchauszüge, Source pending verification.",
};

export const CLAIM_PYRAMID_TIP: EClaim = {
  text: "Die goldene Spitze der Pyramide sammelte oder bündelte Energie, wie eine Antenne oder ein Kondensator, und die Pyramide war ein Kraftwerk.",
  level: "claimed",
  counter: "Dafür gibt es keinen Beleg. Pyramiden sind Grabbauten; Reste von technischen Anlagen wurden nicht gefunden. Das Pyramidion der Cheops-Pyramide fehlt seit der Antike, und ob es Gold trug, ist nicht belegt. Quellen: Suchauszüge, Source pending verification.",
};

export const CLAIM_PYRAMID_POWER: EClaim = {
  text: "Die Pyramidenform selbst wirkt: Sie schärft Rasierklingen, konserviert Lebensmittel und lädt Wasser mit Energie auf.",
  level: "unsupported",
  counter: "In den 1950er-Jahren erhielt der tschechische Ingenieur Karel Drbal ein Patent auf eine Pyramide zum Nachschärfen von Klingen. Nach den Suchauszügen zeigten Versuche in den 1970er-Jahren (Alter 1973, Simmons 1973), dass pyramidenförmige Behälter organisches Material nicht besser konservieren als andere Formen und dass stumpfe Klingen nicht scharf werden. Auch die Fernsehsendung MythBusters fand 2005 keinen Effekt. Ein Patent ist kein Wirkungsnachweis. Quellen: Suchauszüge, Source pending verification.",
};

export interface Pyr { id: string; title: string; text: string }
export const PYRAMID_TABS: Pyr[] = [
  {
    id: "pyramidion", title: "Das Pyramidion",
    text: "Das Pyramidion ist der oberste Stein einer ägyptischen Pyramide oder eines Obelisken. Erhalten ist zum Beispiel das Pyramidion Amenemhats III. aus Dahshur (um 1850 v. Chr.): ein einziger Block aus schwarzem Basalt („schwarzer Granit“), rund 1,40 m hoch und etwa 4,5 Tonnen schwer, heute im Ägyptischen Museum in Kairo. Das Pyramidion der Cheops-Pyramide in Giza fehlt; ob und woraus es bestand, ist nicht sicher. Die Pyramide ist heute ein paar Meter niedriger als ursprünglich (Gedächtnis, Source pending verification).",
  },
  {
    id: "obelisk", title: "Hatshepsuts Obelisken",
    text: "Dokumentiert ist, dass Spitzen mit Gold-Silber-Legierung (Elektrum) überzogen wurden: Königin Hatschepsut ließ im 15. Jh. v. Chr. in Karnak zwei Obelisken errichten und schreibt laut Inschrift, es seien Obelisken „aus Elektrum“, deren Pyramidien sich mit dem Himmel vermischten (nach einer Wiedergabe der Inschrift im Suchauszug). Die Deutung, dass die Spitzen die ersten und letzten Sonnenstrahlen einfingen und den Sonnengott verkörperten, ist eine Interpretation.",
  },
  {
    id: "gold", title: "Warum Gold?",
    text: "Gold korrodiert nicht, bleibt also über Jahrtausende glänzend, und es spiegelt Sonnenlicht stark. Eine goldene Spitze wäre weithin sichtbar gewesen. Das ist eine plausible Erklärung, kein Beleg für die Absicht. Zur Cheops-Pyramide gibt es keine Funde von Gold am Pyramidion; ein Faktencheck nennt keinen physischen Rest (Suchauszug).",
  },
  {
    id: "blitz", title: "Eine Spitze als Blitzableiter",
    text: "Physikalisch belegt ist: Eine metallische Spitze auf einem hohen Bauwerk fängt Blitze, wenn sie leitend mit dem Boden verbunden ist. So funktioniert der Blitzableiter (Benjamin Franklin, 18. Jh.). Ob die Ägypter das beabsichtigten, ist nicht belegt; eine leitende Verbindung bis zum Boden ist in den Pyramiden nicht bekannt (Source pending verification).",
  },
];

export const EARTH_SOURCES: { label: string; url?: string }[] = [
  { label: "Chevalier u. a. 2012: Earthing – Health Implications of Reconnecting the Human Body to the Earth’s Surface Electrons (Journal of Environmental and Public Health)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3265077" },
  { label: "Dr. Weil: Is There Anything to „Earthing“? (kritische Einordnung)", url: "https://drweil.com/?p=107361" },
  { label: "AMS Glossary: Atmospheric electric field (Schönwetterfeld etwa 100 V pro Meter)", url: "https://glossary.ametsoc.org/wiki/atmospheric-electric-field/" },
  { label: "Altium: Overview of the Human Body Model in EMC (etwa 100 pF)", url: "https://resources.altium.com/de/p/overview-human-body-model-emc" },
  { label: "Animal Physiology (Univ. of Alberta): Resting Membrane Potential", url: "https://ua.pressbooks.pub/animalphysiology/chapter/resting-membrane-potential/" },
  { label: "Typical Values of Soil Resistivity (elek.com)", url: "https://elek.com/articles/typical-soil-resistivity-tables/" },
  { label: "Step voltage (itwissen.info): Schrittspannung bei Blitzeinschlag", url: "https://www.itwissen.info/en/step-voltage.html" },
  { label: "Richmond u. a. 2013: Copper Bracelets and Magnetic Wrist Straps for Rheumatoid Arthritis, PLoS ONE", url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0071529" },
  { label: "Universität York: Copper bracelets and magnetic wrist straps fail to help rheumatoid arthritis", url: "https://www.york.ac.uk/news-and-events/news/2013/research/copper-bracelets/" },
  { label: "Engineering Toolbox: Electrical Conductivity – Elements and other Materials", url: "https://engineeringtoolbox.com/conductors-d_1381.html" },
  { label: "Wikipedia: Pyramidion of Amenemhat III", url: "https://en.wikipedia.org/wiki/Pyramidion_of_Amenemhat_III" },
  { label: "Die Inschrift auf Hatschepsuts Obelisk (Wiedergabe)", url: "https://timetrips.co.uk/TKH-obelisk%20inscription.htm" },
  { label: "Faktencheck: Giza-Pyramiden mit weißem Kalkstein und goldener Spitze?", url: "https://uk.news.yahoo.com/fact-check-posts-claim-giza-020000417.html" },
  { label: "The Skeptic: Sharp Blades or Sharp Practice? Czechoslovakian pyramid power", url: "https://www.skeptic.org.uk/?p=50514" },
  { label: "Quellen nur als Suchauszüge gesehen, Originalseiten nicht geprüft (Source pending verification)" },
];
