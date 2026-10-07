/**
 * Data of the "Mineral Atlas" landing page (src/ui/minerals.ts), built after the user's reference picture (docs/MOCKUP-NOTES.md, page 22).
 * Quartz and its varieties are the featured minerals. All values are textbook knowledge (Source pending verification); statements about the
 * body, frequencies and healing stones are graded claims in content/claims/. The mockup's placeholder numbers are not used.
 */
export interface Mineral {
  id: string; // atlas id
  name: string;
  formula: string;
  tags: string[];
  text: string;
  props: { icon: string; label: string; value: string }[];
  system: string;
  habit: string;
  /** keys of FORMATION that apply */
  formed: string[];
  formedText: string;
  places: { name: string; note: string; lat: number; lon: number }[];
}

const COMMON = (color: string, transp: string, extra: Partial<Record<string, string>> = {}): Mineral["props"] => [
  { icon: "flask", label: "Chemische Formel", value: "SiO₂" },
  { icon: "ruler", label: "Härte (Mohs)", value: extra.hardness ?? "7" },
  { icon: "layers", label: "Dichte", value: extra.density ?? "2,65 g/cm³" },
  { icon: "hex", label: "Kristallsystem", value: extra.system ?? "Trigonal" },
  { icon: "palette", label: "Farbe", value: color },
  { icon: "sun", label: "Transparenz", value: transp },
  { icon: "soil", label: "Strichfarbe", value: "Weiß" },
  { icon: "cell", label: "Bruch", value: "Muschelig" },
  { icon: "link", label: "Spaltbarkeit", value: "Keine" },
  { icon: "sound", label: "Glanz", value: extra.luster ?? "Glasglanz (vitreous)" },
];

export const MINERALS: Mineral[] = [
  { id: "quarz", name: "Quarz", formula: "SiO₂", tags: ["Kristall", "Schmuckstein", "Häufig", "Vielseitig"], system: "Trigonal", habit: "Rhomboedrisch",
    text: "Quarz ist eines der häufigsten Minerale der Erde. Er ist bekannt für seine Härte, seine kristalline Schönheit und seine vielseitige Verwendung in Technologie, Schmuck und Wissenschaft.",
    props: COMMON("Farblos, weiß, verschiedene", "Transparent – transluzent"), formed: ["magma", "meta", "sedi", "hydro"],
    formedText: "Quarz entsteht in magmatischen, metamorphen und sedimentären Gesteinen und in Klüften aus heißen Lösungen.",
    places: [{ name: "Brasilien", note: "Hochwertige Kristalle", lat: -19.9, lon: -43.9 }, { name: "Madagaskar", note: "Große Kristallformationen", lat: -19, lon: 47 }, { name: "Schweiz", note: "Alpenquarz", lat: 46.6, lon: 8.3 }, { name: "USA", note: "Herkimer-„Diamanten“ (New York)", lat: 43, lon: -74.9 }] },
  { id: "amethyst", name: "Amethyst", formula: "SiO₂", tags: ["Kristall", "Schmuckstein", "Quarz-Varietät", "Violett"], system: "Trigonal", habit: "Rhomboedrisch",
    text: "Amethyst ist die violette Varietät des Quarzes. Die Farbe entsteht durch Eisen im Kristall und natürliche Strahlung. Er wächst oft in Hohlräumen (Geoden) vulkanischer Gesteine.",
    props: COMMON("Violett, hell bis tief", "Transparent bis durchscheinend"), formed: ["magma", "hydro"],
    formedText: "Amethyst wächst vor allem in Hohlräumen von Vulkangesteinen, in die kieselsäurehaltige Lösungen eindringen.",
    places: [{ name: "Brasilien", note: "Große Geoden", lat: -29.2, lon: -51.2 }, { name: "Uruguay", note: "Artigas, Amethyst-Geoden", lat: -30.4, lon: -56.5 }, { name: "Sambia", note: "Tiefviolette Kristalle", lat: -15.4, lon: 28.3 }] },
  { id: "rosenquarz", name: "Rosenquarz", formula: "SiO₂", tags: ["Schmuckstein", "Quarz-Varietät", "Rosa"], system: "Trigonal (meist massig)", habit: "Selten sichtbare Kristalle",
    text: "Rosenquarz ist die rosa Varietät des Quarzes. Er bildet meist derbe Massen statt Kristalle; die Ursache der Farbe (feine Einschlüsse oder Spurenelemente) wird noch diskutiert.",
    props: COMMON("Rosa", "Durchscheinend, oft trüb"), formed: ["magma", "hydro"],
    formedText: "Rosenquarz findet sich vor allem in Pegmatiten, den grobkörnigen Restschmelzen großer Granitkörper.",
    places: [{ name: "Brasilien", note: "Minas Gerais", lat: -18.5, lon: -44, }, { name: "Madagaskar", note: "Rosa Massen", lat: -19, lon: 47 }, { name: "Indien", note: "Rosenquarz-Vorkommen", lat: 20.6, lon: 79 }] },
  { id: "citrin", name: "Citrin", formula: "SiO₂", tags: ["Schmuckstein", "Quarz-Varietät", "Gelb"], system: "Trigonal", habit: "Rhomboedrisch",
    text: "Citrin ist die gelbe bis orangebraune Varietät des Quarzes (Farbe durch Eisen). Natürlicher Citrin ist selten; viele Handelssteine sind erhitzter Amethyst.",
    props: COMMON("Gelb bis orangebraun", "Transparent"), formed: ["magma", "hydro"],
    formedText: "Citrin entsteht in ähnlichen Umgebungen wie Amethyst, wenn Eisen im Quarz anders eingebaut wird.",
    places: [{ name: "Brasilien", note: "Hauptlieferant", lat: -15.8, lon: -47.9 }, { name: "Madagaskar", note: "Natürliche Citrine", lat: -19, lon: 47 }, { name: "Spanien", note: "Kleine Vorkommen", lat: 40.4, lon: -3.7 }] },
  { id: "rauchquarz", name: "Rauchquarz", formula: "SiO₂", tags: ["Schmuckstein", "Quarz-Varietät", "Braun"], system: "Trigonal", habit: "Rhomboedrisch",
    text: "Rauchquarz ist die graue bis braunschwarze Varietät des Quarzes. Die Farbe entsteht durch natürliche radioaktive Strahlung an Aluminium-Störstellen im Kristall.",
    props: COMMON("Grau bis braunschwarz", "Transparent bis durchscheinend"), formed: ["magma", "meta", "hydro"],
    formedText: "Rauchquarz bildet sich häufig in Granit und Klüften der Alpen, wo natürliche Strahlung auf den Quarz einwirkt.",
    places: [{ name: "Schweiz", note: "Alpenklüfte (Gotthard)", lat: 46.6, lon: 8.5 }, { name: "Schottland", note: "Cairngorm, Namensgeber", lat: 57.1, lon: -3.6 }, { name: "Brasilien", note: "Große Kristalle", lat: -18, lon: -44 }] },
  { id: "achat", name: "Achat", formula: "SiO₂", tags: ["Schmuckstein", "Quarz-Varietät", "Gebändert"], system: "Trigonal (kryptokristallin)", habit: "Keine sichtbaren Kristallflächen",
    text: "Achat ist ein gebänderter Chalcedon: winzige Quarzfasern, die lagenweise in Hohlräumen vulkanischer Gesteine wachsen. Er zeigt keine Kristallflächen, aber auffällige Farbbänder.",
    props: COMMON("Gebändert, vielfarbig", "Durchscheinend", { hardness: "6,5 – 7", density: "ca. 2,6 g/cm³", luster: "Wachs- bis Glasglanz" }), formed: ["magma", "hydro"],
    formedText: "Achat bildet sich in Gasblasen vulkanischer Gesteine, in denen Kieselsäurelösungen Schicht für Schicht auskristallisieren.",
    places: [{ name: "Brasilien", note: "Rio Grande do Sul", lat: -29.7, lon: -53.8 }, { name: "Deutschland", note: "Idar-Oberstein", lat: 49.7, lon: 7.3 }, { name: "Indien", note: "Gujarat", lat: 22.3, lon: 72 }] },
];

export const GROUP_ORDER = ["amethyst", "rosenquarz", "citrin", "quarz", "rauchquarz", "achat"];

export const NAV: { id: string; label: string; to: string; icon: string }[] = [
  { id: "elemente", label: "Elemente", to: "mn-elements", icon: "dna" },
  { id: "mineralien", label: "Mineralien", to: "mn-spot", icon: "hex" },
  { id: "spuren", label: "Spurenelemente", to: "mn-elements", icon: "cell" },
  { id: "kristalle", label: "Kristalle", to: "mn-journey", icon: "layers" },
  { id: "gesteine", label: "Gesteine", to: "mn-formation", icon: "soil" },
  { id: "vorkommen", label: "Vorkommen", to: "mn-map", icon: "globe" },
  { id: "anwendungen", label: "Anwendungen", to: "mn-apps", icon: "flask" },
  { id: "frequenzen", label: "Frequenzen", to: "mn-freq", icon: "sound" },
];

/** hero bubbles: element symbols around the earth, always drawn as live text on top of the picture (position in percent of the picture area) */
export const BUBBLES: { sym: string; at: [number, number]; size: number; color: string }[] = [
  { sym: "Si", at: [30, 19], size: 60, color: "#b9a8ff" }, { sym: "Cu", at: [55, 17], size: 54, color: "#58d6e8" }, { sym: "Fe", at: [12, 46], size: 58, color: "#ff6a5a" },
  { sym: "Mg", at: [62, 54], size: 58, color: "#5fe3a8" }, { sym: "Au", at: [26, 82], size: 62, color: "#f0d18b" }, { sym: "O", at: [58, 84], size: 58, color: "#58a8ff" },
];

export const JOURNEY: { id: string; title: string; sub?: string; text: string }[] = [
  { id: "atom", title: "Atom", text: "Der kleinste Baustein eines chemischen Elements: ein Kern aus Protonen und Neutronen, umgeben von Elektronen. Ein Siliziumatom hat 14 Protonen (Lehrbuchwissen, Source pending verification)." },
  { id: "molekuel", title: "Molekül", sub: "SiO₂", text: "Atome verbinden sich zu Verbindungen. In Quarz ist jedes Siliziumatom von vier Sauerstoffatomen umgeben (SiO₄-Tetraeder), die über ihre Ecken ein Netz bilden. Das Zahlenverhältnis Silizium zu Sauerstoff ist 1 : 2, daher SiO₂; einzelne SiO₂-Moleküle gibt es dort nicht (Lehrbuchwissen, Source pending verification)." },
  { id: "gitter", title: "Kristallgitter", text: "Eine regelmäßige, sich in drei Dimensionen wiederholende Anordnung der Bausteine. Im Quarz sind die Tetraeder schraubenförmig angeordnet, daher das trigonale Kristallsystem (Lehrbuchwissen, Source pending verification)." },
  { id: "kristall", title: "Kristall", text: "Wächst ein Gitter ungestört, etwa in einem Hohlraum, aus einer Lösung oder Schmelze, entstehen ebene Flächen und Kanten: der Kristall (Lehrbuchwissen, Source pending verification)." },
  { id: "mineral", title: "Mineral", text: "Ein Mineral ist ein natürlich entstandener, meist kristalliner Feststoff mit bestimmter chemischer Zusammensetzung und Kristallstruktur. Die Internationale Mineralogische Vereinigung (IMA) führt eine offizielle Liste der anerkannten Arten (Lehrbuchwissen, Source pending verification)." },
  { id: "gestein", title: "Gestein", text: "Gesteine bestehen aus einem oder mehreren Mineralen. Granit besteht z. B. aus Quarz, Feldspat und Glimmer (Lehrbuchwissen, Source pending verification)." },
  { id: "gebirge", title: "Gebirgskette", text: "Durch die Bewegung der Erdplatten werden Gesteine gefaltet, gehoben und abgetragen; so entstehen Gebirge, in denen Kristallklüfte zugänglich werden (Lehrbuchwissen, Source pending verification)." },
  { id: "planet", title: "Planet", text: "Die Erde besteht aus Mineralen: Kruste und Mantel überwiegend aus Silikaten, der Kern aus einer Eisen-Nickel-Legierung (Lehrbuchwissen, Source pending verification)." },
];

export const FORMATION: { id: string; title: string; example: string; icon: string; text: string }[] = [
  { id: "magma", title: "Magmatisch", example: "z. B. Granit", icon: "flame", text: "Aus erkaltender Schmelze: Im Granit kristallisiert Quarz als einer der letzten Bestandteile zwischen den anderen Mineralen." },
  { id: "meta", title: "Metamorph", example: "z. B. Gneis", icon: "layers", text: "Unter hohem Druck und hoher Temperatur wandeln sich Gesteine um, wobei Quarz neu wachsen und sich ausrichten kann." },
  { id: "sedi", title: "Sedimentär", example: "z. B. Sandstein", icon: "soil", text: "Quarz verwittert kaum. Als Sandkörner wird er von Wasser und Wind abgelagert und zu Sandstein verfestigt." },
  { id: "hydro", title: "Hydrothermal", example: "z. B. Kristallklüfte", icon: "drop", text: "Heiße, kieselsäurehaltige Lösungen scheiden in Spalten und Hohlräumen Quarz ab; hier wachsen die großen, freistehenden Kristalle." },
];
export const FORMATION_NOTE = "Lehrbuchwissen, Source pending verification.";

/** the body spots: the text always says that crystalline quartz is not absorbed; the claim carries the evidence level */
export const BODY: { id: string; title: string; sub: string; at: [number, number]; side: "l" | "r"; text: string }[] = [
  { id: "haut", title: "Haut", sub: "Elastizität", at: [2, 22], side: "l", text: "Silizium kommt in der Haut vor; ob zusätzliches Silizium die Elastizität verbessert, ist nicht belegt (die europäische Lebensmittelbehörde EFSA sah dafür keine ausreichenden Belege)." },
  { id: "haare", title: "Haare & Nägel", sub: "Struktur", at: [2, 62], side: "l", text: "Silizium wird in Haaren und Nägeln gefunden. Dass Einnahme Haare und Nägel stärkt, hat die EFSA als nicht ausreichend belegt eingestuft." },
  { id: "binde", title: "Bindegewebe", sub: "Festigkeit", at: [74, 18], side: "r", text: "Silizium ist im Bindegewebe nachgewiesen. Seine genaue Rolle ist Gegenstand der Forschung und nicht gesichert." },
  { id: "knochen", title: "Knochen", sub: "Stabilität", at: [74, 48], side: "r", text: "Beobachtungsstudien zeigen einen Zusammenhang zwischen Siliziumaufnahme und Knochendichte; ein ursächlicher Nutzen ist nicht bewiesen." },
  { id: "silizium", title: "Silizium im Körper", sub: "Aufnahme", at: [74, 76], side: "r", text: "Aufgenommen wird gelöstes Silizium (Orthokieselsäure) aus Nahrung und Wasser. Kristalliner Quarz ist wasserunlöslich und wird praktisch nicht aufgenommen: Ein Quarzkristall im Körper oder im Wasser liefert kein Silizium (Source pending verification)." },
];
export const BODY_INTRO = "Silizium (Si) aus gelösten Silizium-Verbindungen kommt in Bindegewebe, Knochen, Haut, Haaren und Nägeln vor. Die Rolle ist erforscht, aber nicht gesichert; Quarzkristalle selbst werden nicht aufgenommen.";

export const FREQ: { id: string; title: string; icon: string; text: string; claim?: string }[] = [
  { id: "muster", title: "Schwingungsmuster", icon: "hex", text: "Töne lassen Sand auf einer Platte Muster bilden (Kymatik). Auf der Frequenz-Seite kannst du das ausprobieren." },
  { id: "piezo", title: "Piezoelektrischer Effekt", icon: "bolt", claim: "mineral-piezo", text: "Quarz erzeugt bei Druck eine elektrische Spannung und schwingt umgekehrt unter Spannung mit sehr stabiler Frequenz. Pierre und Jacques Curie entdeckten den Effekt 1880. Schwingquarze steuern heute Uhren und Elektronik; in Armbanduhren schwingen sie typischerweise mit 32.768 Hz." },
  { id: "resonanz", title: "Resonanz in Natur & Technologie", icon: "sound", text: "Resonanz ist das Mitschwingen eines Körpers bei seiner Eigenfrequenz. Beim Quarz wird sie technisch genutzt: Filter, Oszillatoren und Quarz-Mikrowaagen messen kleinste Massenänderungen an der Frequenz (Lehrbuchwissen, Source pending verification)." },
];

export const APPS: { id: string; title: string; sub: string; icon: string; text: string; claim?: string }[] = [
  { id: "schmuck", title: "Schmuck", sub: "Edelsteine, Design", icon: "layers", text: "Quarz-Varietäten wie Amethyst, Citrin und Rauchquarz werden seit Jahrtausenden geschliffen und als Schmuckstein gefasst (Source pending verification)." },
  { id: "technik", title: "Technologie", sub: "Uhren, Elektronik", icon: "bolt", text: "Schwingquarze geben in Uhren und elektronischen Geräten den Takt vor (Lehrbuchwissen, Source pending verification)." },
  { id: "optik", title: "Optik", sub: "Linsen, Laser", icon: "target", text: "Hochreines Quarzglas (Kieselglas) ist durchlässig für ultraviolettes und infrarotes Licht und wird für Linsen, Laseroptik und Glasfasern verwendet (Lehrbuchwissen, Source pending verification)." },
  { id: "bau", title: "Bau & Architektur", sub: "Naturstein", icon: "soil", text: "Quarzreiche Gesteine wie Granit und Sandstein sind seit der Antike wichtige Baumaterialien; Quarzsand ist Rohstoff für Beton und Glas (Lehrbuchwissen, Source pending verification)." },
  { id: "heil", title: "Heilsteine", sub: "Traditionelle Anwendung", icon: "stress", claim: "crystal-healing-general", text: "In der Heilstein-Überlieferung wird Quarz Wirkungen zugeschrieben. Das ist Überlieferung und kein Wirkungsnachweis; die Aussage dazu zeigt ihre Belegstufe." },
  { id: "forschung", title: "Forschung", sub: "Materialwissenschaft", icon: "microscope", text: "Quarz dient als Modellkristall in Kristallographie und Materialwissenschaft; Quarz-Mikrowaagen und Druckmessgeräte nutzen den piezoelektrischen Effekt (Lehrbuchwissen, Source pending verification)." },
  { id: "elektronik", title: "Elektronik", sub: "Quarzoszillatoren", icon: "sound", text: "Jeder Computer, jedes Smartphone und jede Funkanlage enthält Quarzoszillatoren als Taktgeber; die Quarze sind heute meist künstlich gezüchtet (Lehrbuchwissen, Source pending verification)." },
  { id: "alltag", title: "Alltag", sub: "Glas, Werkzeuge", icon: "cup", text: "Fensterglas, Flaschen und Keramik bestehen großteils aus Quarzsand; in der Steinzeit war Quarz ein Rohstoff für Klingen und Schaber (Lehrbuchwissen, Source pending verification)." },
];

export const HISTORY: { id: string; title: string; sub: string; text: string }[] = [
  { id: "stein", title: "Steinzeit", sub: "Werkzeuge", text: "Quarz und quarzreiche Gesteine wie Feuerstein wurden in der Steinzeit zu Klingen, Schabern und Pfeilspitzen geschlagen, weil sie scharfe Kanten ergeben (Source pending verification)." },
  { id: "aegypten", title: "Altes Ägypten", sub: "Schmuck & Symbolik", text: "Im alten Ägypten wurden Quarz-Varietäten wie Amethyst und Karneol zu Schmuck und Amuletten verarbeitet (Source pending verification)." },
  { id: "antike", title: "Griechen & Römer", sub: "Schutz & Klarheit", text: "Die Griechen hielten Bergkristall für dauerhaft gefrorenes Eis (krýstallos, „Eis“) und gaben ihm den Namen. Amethyst („nicht trunken“) galt als Schutz vor Rausch. Das ist Überlieferung (Source pending verification)." },
  { id: "mittelalter", title: "Mittelalter", sub: "Heilkunde", text: "In der mittelalterlichen Steinheilkunde wurden Edelsteinen und Kristallen Wirkungen zugeschrieben; Bergkristall diente auch für Reliquiare und Linsen (Überlieferung, Source pending verification)." },
  { id: "moderne", title: "Moderne Zeit", sub: "Technologie & Forschung", text: "Seit dem 20. Jahrhundert steuern Schwingquarze Uhren und Elektronik; die Kristallographie nutzte Quarz, um die Röntgenbeugung zu erforschen (Source pending verification)." },
];

export const MINERAL_NOTICE = "Pilot: nicht fachlich geprüft. Zahlen auf dieser Seite werden aus Daten gezählt oder nennen ihre Quelle; Werte zu Elementen und Mineralen sind Lehrbuchwissen (Source pending verification). Aussagen zum Körper, zu Frequenzen und zu Heilsteinen stehen als Behauptung oder Hypothese mit Belegstufe. Information, keine medizinische Beratung: Mineralstoffe und Spurenelemente bitte nicht auf eigene Faust einnehmen, bei Beschwerden oder Medikamenten ärztlich oder in der Apotheke nachfragen. Kristalle und Pulver nicht verschlucken oder einatmen (Quarzstaub schädigt die Lunge).";
