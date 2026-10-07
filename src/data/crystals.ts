import { MINERALS } from "./minerals.ts";

/**
 * Data of the "Kristalle & Heilsteine" landing page (src/ui/crystals.ts), built after the user's reference picture
 * (docs/MOCKUP-NOTES.md, page 24). The crystals are the entries of the atlas category "kristall". Property values are textbook
 * knowledge (Source pending verification). What the lore says about a stone (keywords, chakras, frequencies, water) is shown as
 * lore with the evidence level of its claim; the mockup's study titles are placeholders and are not used.
 */
export type SystemId = "trigonal" | "hexagonal" | "kubisch" | "tetragonal" | "orthorhombisch" | "monoklin" | "triklin";
export type Use = { id: string; kind: "dok" | "trad"; title: string; text: string };

export interface Crystal {
  id: string; // atlas id
  short: string;
  /** keywords of the modern stone lore (not a finding) */
  keywords: string;
  text: string;
  group: string;
  color: string;
  hardness: string;
  density: string;
  system: SystemId | null;
  systemLabel: string;
  transparency: string;
  luster: string;
  streak: string;
  cleavage: string;
  fracture: string;
  formula: string;
  formed: string[];
  formedText: string;
  /** shown in the category cards */
  raw: boolean;
  tumbled: boolean;
  colourful: boolean;
  uses: Use[];
  places: { name: string; note: string; lat: number; lon: number }[];
}

const q = (id: string) => MINERALS.find((m) => m.id === id)!;
const QUARTZ = { group: "Quarz (SiO₂)", hardness: "7", density: "2,65 g/cm³", system: "trigonal" as const, systemLabel: "Trigonal", luster: "Glasglanz", streak: "Weiß", cleavage: "Keine", fracture: "Muschelig", formula: "SiO₂" };

export const CRYSTALS: Crystal[] = [
  { id: "amethyst", short: "Amethyst", keywords: "Schutz · Klarheit · Spiritualität", ...QUARTZ, color: "Violett (hell bis dunkel)", transparency: "Transparent – transluzent", raw: true, tumbled: true, colourful: true,
    text: "Der Amethyst ist eine violette Quarz-Varietät, die seit Jahrtausenden für ihre Schönheit und ihre symbolische Bedeutung geschätzt wird. Er gilt als Stein der inneren Ruhe, Klarheit und spirituellen Entwicklung.",
    formed: q("amethyst").formed, formedText: q("amethyst").formedText, places: q("amethyst").places,
    uses: [{ id: "schmuck", kind: "dok", title: "Schmuckstein", text: "Geschliffen und gefasst seit der Antike; heute einer der bekanntesten Schmucksteine." }, { id: "geode", kind: "dok", title: "Sammlerstück", text: "Geoden und Kristallgruppen aus Brasilien und Uruguay sind beliebte Sammelstücke." }, { id: "meditation", kind: "trad", title: "Meditationsstein", text: "In der modernen Steinkunde als Stein der Ruhe und Klarheit beschrieben; eine Wirkung ist nicht belegt." }] },
  { id: "rosenquarz", short: "Rosenquarz", keywords: "Herz · Mitgefühl · Sanftheit", ...QUARTZ, color: "Rosa", transparency: "Durchscheinend, oft trüb", raw: false, tumbled: true, colourful: true,
    text: "Rosenquarz ist die rosa Varietät des Quarzes. Er bildet meist derbe Massen statt Kristalle; die Ursache der Farbe (feine Einschlüsse oder Spurenelemente) wird noch diskutiert. In der modernen Steinkunde gilt er als „Stein des Herzens“.",
    formed: q("rosenquarz").formed, formedText: q("rosenquarz").formedText, places: q("rosenquarz").places,
    uses: [{ id: "schmuck", kind: "dok", title: "Schmuck und Schliff", text: "Kugeln, Anhänger, Skulpturen und Trommelsteine." }, { id: "herz", kind: "trad", title: "„Herzstein“", text: "In der modernen Steinkunde dem Herzchakra zugeordnet; keine belegte Wirkung." }] },
  { id: "quarz", short: "Bergkristall", keywords: "Klarheit · Verstärkung · Reinheit", ...QUARTZ, color: "Farblos bis weiß", transparency: "Transparent – transluzent", raw: true, tumbled: true, colourful: false,
    text: "Bergkristall ist der klare, farblose Quarz. Der Name Kristall kommt vom griechischen krystallos („Eis“): Die Griechen hielten ihn für dauerhaft gefrorenes Eis. Er ist piezoelektrisch und steuert als Schwingquarz Uhren und Elektronik.",
    formed: q("quarz").formed, formedText: q("quarz").formedText, places: q("quarz").places,
    uses: [{ id: "technik", kind: "dok", title: "Schwingquarz", text: "Quarz erzeugt bei Druck Spannung und schwingt stabil: Taktgeber in Uhren und Elektronik." }, { id: "optik", kind: "dok", title: "Quarzglas und Optik", text: "Reiner Quarz ist durchlässig für UV und Infrarot und wird für Linsen und Glasfasern genutzt." }, { id: "klar", kind: "trad", title: "Meister-Heilstein", text: "In der modernen Steinkunde als „Verstärker“ genannt; nicht belegt." }] },
  { id: "citrin", short: "Citrin", keywords: "Freude · Fülle · Selbstvertrauen", ...QUARTZ, color: "Gelb bis orangebraun", transparency: "Transparent", raw: true, tumbled: true, colourful: true,
    text: "Citrin ist die gelbe bis orangebraune Varietät des Quarzes (Farbe durch Eisen). Natürlicher Citrin ist selten; viele Handelssteine sind erhitzter Amethyst. In der Steinkunde gilt er als Stein der Freude.",
    formed: q("citrin").formed, formedText: q("citrin").formedText, places: q("citrin").places,
    uses: [{ id: "schmuck", kind: "dok", title: "Schmuckstein", text: "Beliebt als goldgelber Schmuckstein, oft aus erhitztem Amethyst." }, { id: "fuelle", kind: "trad", title: "„Stein der Fülle“", text: "Moderne Zuschreibung; keine belegte Wirkung." }] },
  { id: "rauchquarz", short: "Rauchquarz", keywords: "Erdung · Schutz · Loslassen", ...QUARTZ, color: "Grau bis braunschwarz", transparency: "Transparent bis durchscheinend", raw: true, tumbled: true, colourful: false,
    text: "Rauchquarz ist die graue bis braunschwarze Varietät des Quarzes. Die Farbe entsteht durch natürliche radioaktive Strahlung an Aluminium-Störstellen. In der Steinkunde gilt er als Stein der Erdung.",
    formed: q("rauchquarz").formed, formedText: q("rauchquarz").formedText, places: q("rauchquarz").places,
    uses: [{ id: "schmuck", kind: "dok", title: "Schmuck und Sammlung", text: "Facettierte Schmucksteine und große Kristallstufen aus den Alpen." }, { id: "erdung", kind: "trad", title: "Erdungsstein", text: "Dem Wurzelchakra zugeordnet; keine belegte Wirkung." }] },
  { id: "achat", short: "Achat", keywords: "Stabilität · Ausgleich · Schutz", group: "Chalcedon (SiO₂)", color: "Gebändert, vielfarbig", hardness: "6,5 – 7", density: "ca. 2,6 g/cm³", system: "trigonal", systemLabel: "Trigonal (kryptokristallin)", transparency: "Durchscheinend", luster: "Wachs- bis Glasglanz", streak: "Weiß", cleavage: "Keine", fracture: "Muschelig bis splittrig", formula: "SiO₂", raw: false, tumbled: true, colourful: true,
    text: "Achat ist ein gebänderter Chalcedon: winzige Quarzfasern, die lagenweise in Hohlräumen vulkanischer Gesteine wachsen. Er zeigt keine Kristallflächen, aber auffällige Farbbänder.",
    formed: q("achat").formed, formedText: q("achat").formedText, places: q("achat").places,
    uses: [{ id: "schmuck", kind: "dok", title: "Schmuck, Gravur und Gefäße", text: "Seit der Antike geschliffen; Idar-Oberstein war Zentrum der Achatschleiferei." }, { id: "technik", kind: "dok", title: "Mörser und Lager", text: "Wegen der Härte und Glätte für Reibschalen und Präzisionslager genutzt." }] },
  { id: "fluorit", short: "Fluorit", keywords: "Ordnung · Konzentration · Struktur", group: "Fluorit (CaF₂, Halogenid)", color: "Farblos, grün, violett, blau, gelb", hardness: "4", density: "3,18 g/cm³", system: "kubisch", systemLabel: "Kubisch", transparency: "Transparent – durchscheinend", luster: "Glasglanz", streak: "Weiß", cleavage: "Vollkommen (oktaedrisch)", fracture: "Muschelig bis uneben", formula: "CaF₂", raw: true, tumbled: false, colourful: true,
    text: "Fluorit ist ein Calciumfluorid, das in vielen Farben und oft in würfeligen oder oktaedrischen Kristallen vorkommt. Viele Stücke leuchten unter UV-Licht; der Begriff Fluoreszenz geht auf ihn zurück.",
    formed: ["hydro", "magma"], formedText: "Fluorit wächst vor allem in hydrothermalen Gängen, wo heiße Lösungen fluorhaltige Minerale ausscheiden, und in Granit und Pegmatiten.",
    places: [{ name: "China", note: "Große Lagerstätten", lat: 29.5, lon: 114 }, { name: "Mexiko", note: "Farbige Kristalle", lat: 23.6, lon: -102.5 }, { name: "England", note: "Weardale, Derbyshire", lat: 54.7, lon: -2.2 }, { name: "Deutschland", note: "Harz und Schwarzwald", lat: 48.3, lon: 8.2 }, { name: "USA", note: "Illinois, Kentucky", lat: 37.5, lon: -88.2 }],
    uses: [{ id: "metall", kind: "dok", title: "Flussmittel und Chemie", text: "In der Metallurgie als Flussmittel; Rohstoff für Fluorchemie." }, { id: "optik", kind: "dok", title: "Optik", text: "Klare Fluoritkristalle werden für Linsen verwendet." }, { id: "ordnung", kind: "trad", title: "„Stein der Ordnung“", text: "Moderne Zuschreibung; keine belegte Wirkung." }] },
  { id: "granat", short: "Granat", keywords: "Energie · Leidenschaft · Erdung", group: "Granat-Gruppe (Silikate)", color: "Rot, braun, grün, orange (je nach Art)", hardness: "6,5 – 7,5", density: "3,5 – 4,3 g/cm³", system: "kubisch", systemLabel: "Kubisch", transparency: "Transparent – durchscheinend", luster: "Glas- bis Harzglanz", streak: "Weiß", cleavage: "Keine", fracture: "Muschelig bis uneben", formula: "X₃Y₂(SiO₄)₃", raw: true, tumbled: false, colourful: true,
    text: "Granate sind eine Gruppe von Silikat-Mineralen, die kubisch kristallisieren, oft als Rhombendodekaeder. Bekannt ist vor allem das tiefe Rot (der Name erinnert an die Samen des Granatapfels), es gibt sie aber in vielen Farben.",
    formed: ["meta", "magma"], formedText: "Granat entsteht vor allem in metamorphen Gesteinen unter hohem Druck und hoher Temperatur und kommt auch in Magmatiten vor.",
    places: [{ name: "Indien", note: "Almandin", lat: 20.6, lon: 79 }, { name: "Sri Lanka", note: "Edelsteinseifen", lat: 7.9, lon: 80.7 }, { name: "Madagaskar", note: "Verschiedene Arten", lat: -19, lon: 47 }, { name: "Tschechien", note: "Böhmischer Granat (Pyrop)", lat: 49.8, lon: 15.5 }, { name: "USA", note: "Gore Mountain (New York)", lat: 43.7, lon: -74 }],
    uses: [{ id: "schmuck", kind: "dok", title: "Schmuckstein", text: "Seit der Antike als roter Schmuckstein genutzt." }, { id: "schleif", kind: "dok", title: "Schleifmittel", text: "Granatsand dient als Strahl- und Schleifmittel, auch beim Wasserstrahlschneiden." }, { id: "energie", kind: "trad", title: "„Stein der Energie“", text: "Dem Wurzelchakra zugeordnet; keine belegte Wirkung." }] },
  { id: "lapislazuli", short: "Lapislazuli", keywords: "Wahrheit · Weisheit · Ausdruck", group: "Gestein (v. a. Lazurit)", color: "Tiefblau mit weißen und goldenen Einschlüssen", hardness: "5 – 5,5", density: "2,7 – 2,9 g/cm³", system: "kubisch", systemLabel: "Kubisch (Lazurit)", transparency: "Undurchsichtig", luster: "Glas- bis Fettglanz", streak: "Hellblau", cleavage: "Undeutlich", fracture: "Uneben", formula: "(Na,Ca)₈(AlSiO₄)₆(S,SO₄,Cl)₂", raw: false, tumbled: true, colourful: true,
    text: "Lapislazuli ist ein Gestein aus Lazurit mit weißen Calcit-Adern und goldglänzenden Pyrit-Einsprengseln. Seit Jahrtausenden wird er wegen seines tiefen Blaus gehandelt; gemahlen ergab er das Pigment Ultramarin.",
    formed: ["meta"], formedText: "Lapislazuli entsteht, wenn Kalkstein am Kontakt zu heißen Schmelzen umgewandelt wird (Kontaktmetamorphose).",
    places: [{ name: "Afghanistan", note: "Sar-i Sang, älteste Quelle", lat: 36.0, lon: 70.7 }, { name: "Chile", note: "Anden", lat: -30, lon: -70.7 }, { name: "Russland", note: "Baikal-Region", lat: 53.5, lon: 108 }, { name: "Myanmar", note: "Mogok-Region", lat: 22, lon: 96.5 }],
    uses: [{ id: "pigment", kind: "dok", title: "Pigment Ultramarin", text: "Gemahlener Lapislazuli war in der Malerei sehr wertvoll." }, { id: "schmuck", kind: "dok", title: "Schmuck und Einlagen", text: "Perlen, Skulpturen und Einlegearbeiten, schon im alten Orient." }, { id: "weisheit", kind: "trad", title: "„Stein der Weisheit“", text: "Moderne Zuschreibung (Stirn- und Halschakra); keine belegte Wirkung." }] },
  { id: "malachit", short: "Malachit", keywords: "Wandel · Herz · Schutz", group: "Malachit (Cu₂CO₃(OH)₂, Carbonat)", color: "Grün (gebändert)", hardness: "3,5 – 4", density: "3,6 – 4,05 g/cm³", system: "monoklin", systemLabel: "Monoklin", transparency: "Undurchsichtig bis durchscheinend", luster: "Seiden- bis Glasglanz", streak: "Hellgrün", cleavage: "Vollkommen (selten sichtbar)", fracture: "Muschelig bis uneben", formula: "Cu₂CO₃(OH)₂", raw: false, tumbled: true, colourful: true,
    text: "Malachit ist ein grünes Kupfercarbonat, das gebänderte, nierenförmige Krusten bildet. Er diente als Kupfererz und als grünes Pigment. Sein Staub ist gesundheitsschädlich: nicht schleifen ohne Schutz, nie ins Trinkwasser legen.",
    formed: ["hydro"], formedText: "Malachit entsteht in der Verwitterungszone von Kupferlagerstätten, wo Wasser und Kohlendioxid Kupfererze umwandeln.",
    places: [{ name: "DR Kongo", note: "Katanga", lat: -10.7, lon: 25.5 }, { name: "Russland", note: "Ural", lat: 57, lon: 60 }, { name: "Namibia", note: "Tsumeb", lat: -19.2, lon: 17.7 }, { name: "Australien", note: "Queensland", lat: -21, lon: 140 }, { name: "USA", note: "Arizona", lat: 33.4, lon: -109 }],
    uses: [{ id: "erz", kind: "dok", title: "Kupfererz und Pigment", text: "Früher als Kupfererz und gemahlen als grünes Pigment genutzt." }, { id: "kunst", kind: "dok", title: "Kunsthandwerk", text: "Platten, Dosen und Schmuck; berühmt sind die Säulen russischer Paläste." }, { id: "wandel", kind: "trad", title: "„Wandlungsstein“", text: "Dem Herzchakra zugeordnet; keine belegte Wirkung. Staub und Wasserkontakt meiden (Kupfer)." }] },
  { id: "obsidian", short: "Obsidian", keywords: "Schutz · Erdung · Selbsterkenntnis", group: "Vulkanisches Glas (amorph)", color: "Schwarz (auch braun, grau)", hardness: "5 – 5,5", density: "2,35 – 2,6 g/cm³", system: null, systemLabel: "Amorph (kein Kristall)", transparency: "Undurchsichtig – durchscheinend", luster: "Glasglanz", streak: "Weiß bis grau", cleavage: "Keine", fracture: "Muschelig, sehr scharfkantig", formula: "SiO₂ (ca. 70–75 %) + andere Oxide", raw: false, tumbled: true, colourful: false,
    text: "Obsidian ist vulkanisches Glas: schnell erkaltete Lava, die keine Kristalle bilden konnte. Er bricht muschelig mit extrem scharfen Kanten und war ein Werkstoff der Steinzeit. Streng genommen ist er kein Kristall.",
    formed: ["magma"], formedText: "Obsidian entsteht, wenn kieselsäurereiche Lava so schnell abkühlt, dass sich kein Kristallgitter bildet.",
    places: [{ name: "Mexiko", note: "Hidalgo, historische Quelle", lat: 20.2, lon: -98.7 }, { name: "USA", note: "Oregon, Yellowstone", lat: 44, lon: -121.3 }, { name: "Island", note: "Hrafntinnusker", lat: 63.9, lon: -19.2 }, { name: "Türkei", note: "Kappadokien", lat: 38.6, lon: 34.8 }, { name: "Italien", note: "Lipari", lat: 38.5, lon: 14.95 }],
    uses: [{ id: "klinge", kind: "dok", title: "Klingen und Spiegel", text: "Steinzeitliche Klingen und Pfeilspitzen; in Mesoamerika polierte Spiegel." }, { id: "schutz", kind: "trad", title: "Schutzstein", text: "Dem Wurzelchakra zugeordnet; keine belegte Wirkung." }] },
  { id: "pyrit", short: "Pyrit", keywords: "Selbstvertrauen · Wille · Schutz", group: "Pyrit (FeS₂, Sulfid)", color: "Messinggelb, metallisch", hardness: "6 – 6,5", density: "4,9 – 5,2 g/cm³", system: "kubisch", systemLabel: "Kubisch", transparency: "Undurchsichtig", luster: "Metallglanz", streak: "Grünlich- bis bräunlich-schwarz", cleavage: "Undeutlich", fracture: "Muschelig bis uneben", formula: "FeS₂", raw: true, tumbled: false, colourful: false,
    text: "Pyrit ist ein Eisensulfid mit messinggelbem Metallglanz, daher „Katzengold“. Er bildet oft Würfel und gibt beim Schlagen Funken (griechisch pyr, „Feuer“). Pyrit kann verwittern und Schwefelsäure bilden.",
    formed: ["hydro", "magma", "sedi"], formedText: "Pyrit entsteht in sehr verschiedenen Umgebungen: in hydrothermalen Gängen, in Magmatiten und in Sedimenten ohne viel Sauerstoff.",
    places: [{ name: "Peru", note: "Huanzala", lat: -9.9, lon: -76.3 }, { name: "Spanien", note: "Navajún (Würfel)", lat: 42.1, lon: -1.9 }, { name: "Italien", note: "Elba", lat: 42.78, lon: 10.27 }, { name: "USA", note: "Colorado", lat: 39, lon: -105.5 }, { name: "Russland", note: "Ural", lat: 57, lon: 60 }],
    uses: [{ id: "funken", kind: "dok", title: "Funken und Rohstoff", text: "Früher zum Feuerschlagen und in Radschlosswaffen; Rohstoff für Schwefel und Schwefelsäure." }, { id: "sammler", kind: "dok", title: "Sammlerstück", text: "Würfel und Sonnen aus Spanien und Peru." }, { id: "wille", kind: "trad", title: "„Stein des Willens“", text: "Dem Solarplexus zugeordnet; keine belegte Wirkung." }] },
  { id: "turmalin", short: "Schwarzer Turmalin", keywords: "Schutz · Erdung · Abgrenzung", group: "Turmalin-Gruppe (Borosilikat)", color: "Schwarz (Schörl); Turmaline sind auch bunt", hardness: "7 – 7,5", density: "3,0 – 3,2 g/cm³", system: "trigonal", systemLabel: "Trigonal", transparency: "Undurchsichtig (Schörl) bis transparent", luster: "Glasglanz", streak: "Weiß", cleavage: "Keine", fracture: "Uneben bis muschelig", formula: "komplexes Borosilikat", raw: true, tumbled: false, colourful: false,
    text: "Turmaline sind eine Gruppe komplexer Borosilikate in vielen Farben. Der schwarze Turmalin (Schörl) ist der häufigste. Turmaline sind piezo- und pyroelektrisch: Sie laden sich bei Druck oder Temperaturänderung elektrisch auf.",
    formed: ["magma", "meta"], formedText: "Turmalin kristallisiert vor allem in Pegmatiten und Graniten und kommt in metamorphen Gesteinen vor.",
    places: [{ name: "Brasilien", note: "Minas Gerais", lat: -18, lon: -42 }, { name: "Nigeria", note: "Pegmatite", lat: 9, lon: 8.7 }, { name: "Mosambik", note: "Verschiedene Farben", lat: -15.5, lon: 37 }, { name: "Afghanistan", note: "Nuristan", lat: 35.3, lon: 70.9 }, { name: "USA", note: "Maine, Kalifornien", lat: 44.5, lon: -70.5 }],
    uses: [{ id: "sensor", kind: "dok", title: "Sensoren und Schmuck", text: "Wegen der Piezoelektrizität früher in Drucksensoren; bunte Turmaline sind Schmucksteine." }, { id: "schutz", kind: "trad", title: "Schutzstein", text: "Dem Wurzelchakra zugeordnet; keine belegte Wirkung." }] },
  { id: "labradorit", short: "Labradorit", keywords: "Intuition · Wandel · Schutz", group: "Feldspat (Plagioklas)", color: "Grau mit blauem bis goldenem Farbenspiel", hardness: "6 – 6,5", density: "2,68 – 2,72 g/cm³", system: "triklin", systemLabel: "Triklin", transparency: "Durchscheinend", luster: "Glas- bis Perlmuttglanz", streak: "Weiß", cleavage: "Vollkommen (zwei Richtungen)", fracture: "Uneben bis muschelig", formula: "(Ca,Na)(Al,Si)₄O₈", raw: false, tumbled: true, colourful: true,
    text: "Labradorit ist ein Feldspat, der bei bestimmtem Lichteinfall blaue und goldene Farben zeigt (Labradoreszenz). Verursacht wird das Schillern durch feine Lamellen im Kristall, an denen Licht interferiert.",
    formed: ["magma"], formedText: "Labradorit bildet sich in dunklen Magmatiten wie Gabbro und Anorthosit, die aus langsam erkaltender Schmelze entstehen.",
    places: [{ name: "Kanada", note: "Labrador, Namensgeber", lat: 55.9, lon: -61.7 }, { name: "Finnland", note: "Ylämaa (Spektrolith)", lat: 60.6, lon: 27.6 }, { name: "Madagaskar", note: "Verschiedene Vorkommen", lat: -22, lon: 46.5 }, { name: "Norwegen", note: "Larvik", lat: 59.05, lon: 10 }, { name: "Ukraine", note: "Wolhynien", lat: 50.6, lon: 28.4 }],
    uses: [{ id: "bau", kind: "dok", title: "Schmuck und Fassaden", text: "Als Schmuckstein und als Naturstein für Fassaden und Arbeitsplatten." }, { id: "intuition", kind: "trad", title: "„Stein der Intuition“", text: "Stirn- und Kronenchakra zugeordnet; keine belegte Wirkung." }] },
];

export const crystalById = (id: string) => CRYSTALS.find((c) => c.id === id);

/** the ten category cards (a card without members is "in Vorbereitung") */
export interface Group { id: string; title: string; sub: string; slot: string; icon: string; tint: string; members?: (c: Crystal, hasChakra: boolean) => boolean; soon?: boolean }
export const GROUPS: Group[] = [
  { id: "alle", title: "Alle Kristalle", sub: "Alle Einträge des Atlas", slot: "kristall-cat-alle", icon: "hex", tint: "#b07cff", members: () => true },
  { id: "quarz", title: "Quarz-Gruppe", sub: "SiO₂ in vielen Varietäten", slot: "kristall-cat-quarz", icon: "hex", tint: "#c8c0d8", members: (c) => c.formula === "SiO₂" },
  { id: "edel", title: "Edelsteine", sub: "Schmucksteine", slot: "kristall-cat-edel", icon: "layers", tint: "#9a5cf0", members: (c) => ["amethyst", "citrin", "granat", "turmalin", "lapislazuli", "achat", "labradorit"].includes(c.id) },
  { id: "heil", title: "Heilsteine", sub: "Mit Heilstein-Überlieferung", slot: "kristall-cat-heil", icon: "heart", tint: "#3fbf7a", members: (_c, ch) => ch },
  { id: "roh", title: "Rohkristalle", sub: "Kristallflächen sichtbar", slot: "kristall-cat-roh", icon: "tree", tint: "#d8a6c0", members: (c) => c.raw },
  { id: "trommel", title: "Trommelsteine", sub: "Häufig geschliffen im Handel", slot: "kristall-cat-trommel", icon: "soil", tint: "#c98a4a", members: (c) => c.tumbled },
  { id: "selten", title: "Seltene Kristalle", sub: "in Vorbereitung", slot: "kristall-cat-selten", icon: "sparkle", tint: "#58d6e8", soon: true },
  { id: "meteor", title: "Meteoriten-Kristalle", sub: "in Vorbereitung", slot: "kristall-cat-meteor", icon: "globe", tint: "#8a8f9a", soon: true },
  { id: "farbe", title: "Farbkristalle", sub: "Nach Farbe geordnet", slot: "kristall-cat-farbe", icon: "palette", tint: "#4a6df0", members: (c) => c.colourful },
  { id: "sammler", title: "Sammlerstücke", sub: "in Vorbereitung", slot: "kristall-cat-sammler", icon: "scroll", tint: "#e8704a", soon: true },
];

/** the order of the popular row: the mockup's five first */
export const POPULAR = ["amethyst", "rosenquarz", "quarz", "citrin", "labradorit", "fluorit", "granat", "lapislazuli", "malachit", "obsidian", "pyrit", "turmalin", "rauchquarz", "achat"];

/** the seven crystal systems; the axis counts are the textbook symmetry (a cube has four three-fold axes) */
export const SYSTEMS: { id: SystemId; title: string; axes: string; text: string; examples: string }[] = [
  { id: "trigonal", title: "Trigonal", axes: "3-zählig", text: "Eine dreizählige Achse: Der Kristall sieht nach einer Drehung um 120° wieder gleich aus. Quarz kristallisiert trigonal, ebenso Turmalin und Calcit.", examples: "Quarz, Turmalin, Calcit" },
  { id: "hexagonal", title: "Hexagonal", axes: "6-zählig", text: "Eine sechszählige Achse: sechsseitige Prismen. Typisch für Beryll (Smaragd, Aquamarin) und Apatit.", examples: "Beryll, Apatit" },
  { id: "kubisch", title: "Kubisch", axes: "4 × 3-zählig", text: "Vier dreizählige Raumdiagonalen wie beim Würfel: Würfel, Oktaeder und Rhombendodekaeder. Pyrit, Fluorit und Granat sind kubisch.", examples: "Pyrit, Fluorit, Granat" },
  { id: "tetragonal", title: "Tetragonal", axes: "4-zählig", text: "Eine vierzählige Achse: quadratischer Querschnitt, in einer Richtung gestreckt oder gestaucht. Zirkon und Rutil sind tetragonal.", examples: "Zirkon, Rutil" },
  { id: "orthorhombisch", title: "Orthorhombisch", axes: "3 × 2-zählig", text: "Drei aufeinander senkrechte zweizählige Achsen mit ungleichen Längen: wie ein Quader. Topas, Olivin und Schwefel kristallisieren so.", examples: "Topas, Olivin, Schwefel" },
  { id: "monoklin", title: "Monoklin", axes: "2-zählig", text: "Eine zweizählige Achse, die anderen Achsen sind schief: wie ein geneigter Quader. Malachit, Gips und Orthoklas sind monoklin.", examples: "Malachit, Gips, Orthoklas" },
  { id: "triklin", title: "Triklin", axes: "1-zählig", text: "Keine Symmetrieachse: alle drei Achsen sind schief und ungleich. Labradorit und Disthen kristallisieren triklin.", examples: "Labradorit, Disthen" },
];

export const FORMATION: { id: string; title: string; sub: string; icon: string; text: string }[] = [
  { id: "magma", title: "Magmatisch", sub: "In magmatischen Gesteinen", icon: "flame", text: "Aus erkaltender Schmelze: Beim langsamen Abkühlen bilden sich große Kristalle, z. B. in Graniten und Pegmatiten. Bei sehr schneller Abkühlung entsteht Glas wie Obsidian." },
  { id: "hydro", title: "Hydrothermal", sub: "In heißen Lösungen", icon: "drop", text: "Heiße, mineralreiche Wasserlösungen scheiden in Spalten und Hohlräumen Kristalle ab; hier wachsen die großen, freistehenden Kristalle, etwa Bergkristall, Amethyst und Fluorit." },
  { id: "meta", title: "Metamorph", sub: "Durch Wärme und Druck", icon: "layers", text: "Unter hoher Temperatur und hohem Druck wandeln sich Gesteine um und neue Minerale wachsen, z. B. Granat und Lapislazuli." },
  { id: "sedi", title: "Sedimentär", sub: "In Sedimentgesteinen", icon: "soil", text: "Aus Ablagerungen und Lösungen in Sedimenten wachsen Kristalle wie Pyrit, Gips und Calcit; Quarz überdauert als Sand." },
];

export const APPS: { id: string; title: string; sub: string; icon: string; kind: "dok" | "trad"; text: string; claim?: string }[] = [
  { id: "meditation", title: "Meditation", sub: "Innere Ruhe", icon: "moon", kind: "trad", text: "Viele Menschen halten einen Stein in der Hand oder legen ihn vor sich, um sich zu sammeln. Das Ritual kann beruhigen; dass der Stein selbst wirkt, ist nicht belegt (Überlieferung)." },
  { id: "wohnraum", title: "Wohnraum", sub: "Harmonie", icon: "overview", kind: "trad", text: "Kristalle als Raumschmuck werden in der modernen Steinkunde als „harmonisierend“ beschrieben. Eine Wirkung auf den Raum ist nicht belegt; Gestaltung und Schönheit sind davon unberührt (Überlieferung)." },
  { id: "schmuck", title: "Schmuck", sub: "Schönheit", icon: "layers", kind: "dok", text: "Seit Jahrtausenden werden Kristalle geschliffen und getragen. Härte, Farbe und Glanz entscheiden, welche Steine sich als Schmuck eignen (dokumentiert, Source pending verification)." },
  { id: "heil", title: "Heilsteinpraxis", sub: "Energiearbeit", icon: "stress", kind: "trad", claim: "crystal-healing-general", text: "Steine werden bei Entspannungs- und „Energiearbeit“ aufgelegt. Für eine Wirkung über den Placebo-Effekt hinaus ist keine kontrollierte Studie bekannt; die Aussage dazu zeigt ihre Belegstufe. Das ersetzt keine ärztliche Behandlung." },
  { id: "wasser", title: "Wasser", sub: "Energetisierung", icon: "drop", kind: "trad", text: "„Edelsteinwasser“ ist eine moderne Überlieferung ohne Wirkungsnachweis. Achtung: Viele Steine sind nichts für Trinkwasser. Malachit (Kupfer), Pyrit und andere Sulfide oder metallhaltige Minerale können giftige Stoffe abgeben, manche Steine lösen sich. Im Zweifel keinen Stein ins Trinkwasser legen; wer es probiert, stellt den Stein nur neben das Glas oder in ein getrenntes, dichtes Gefäß." },
  { id: "garten", title: "Natur & Garten", sub: "Raumenergie", icon: "leaf", kind: "trad", text: "Steine im Garten sind vor allem Dekoration. Aussagen zu „Raumenergie“ sind Überlieferung ohne Beleg. Erzminerale wie Malachit und Pyrit gehören nicht ins Gemüsebeet, da sie Schwermetalle freisetzen können." },
  { id: "sammlung", title: "Sammlung", sub: "Mineralogie", icon: "microscope", kind: "dok", text: "Mineraliensammeln ist ein verbreitetes Hobby; Mineralienbörsen, Museen und Fundstellen zeigen die Vielfalt. Wichtig sind Fundort-Angaben und der Schutz geschützter Fundstellen (dokumentiert, Source pending verification)." },
  { id: "deko", title: "Dekoration", sub: "Ästhetik", icon: "palette", kind: "dok", text: "Kristallgruppen, Geoden und Skulpturen dienen seit der Antike als Zierde und Statussymbol. Die Wirkung auf den Raum ist ästhetisch (dokumentiert, Source pending verification)." },
];

export const FREQS: { id: string; hz: string; title: string; sub: string; text: string; claim: string }[] = [
  { id: "528", hz: "528 Hz", title: "Transformation", sub: "(Transformation)", claim: "kristall-solfeggio", text: "528 Hz gehört zu den „Solfeggio-Frequenzen“ der modernen Klangheilkunde (Zuordnung zum Solarplexus-Chakra). Dass dieser Ton transformiert oder dass Kristalle mit ihm in Resonanz stehen, ist nicht belegt." },
  { id: "432", hz: "432 Hz", title: "Harmonie", sub: "(Harmonie)", claim: "kristall-solfeggio", text: "432 Hz wird als „natürliche“ Stimmung des Kammertons beworben. Eine Wirkung auf den Körper oder eine Verbindung zu Kristallen ist nicht belegt (siehe auch die Aussage zu 432-Hz-Musik)." },
  { id: "963", hz: "963 Hz", title: "Spiritualität", sub: "(Spiritualität)", claim: "kristall-solfeggio", text: "963 Hz wird in der modernen Lehre dem Kronenchakra zugeordnet. Die Zahl ist eine Zuschreibung der Klangheilkunde; eine Wirkung oder Resonanz mit Kristallen ist nicht belegt." },
];
export const FREQ_FACT = "Gemessen und belegt ist die Schwingung von Schwingquarzen: Ein Quarzkristall in der Armbanduhr schwingt typischerweise mit 32.768 Hz, weil er unter elektrischer Spannung (Piezoeffekt) sehr stabil mitschwingt.";

export const HISTORY: { id: string; title: string; sub: string; text: string }[] = [
  { id: "aegypten", title: "Antikes Ägypten", sub: "Schutz, Macht und Spiritualität", text: "Lapislazuli, Karneol, Türkis und Amethyst sind in ägyptischen Funden als Schmuck und Amulette belegt. Welche Bedeutung die Steine hatten, ist teils aus Texten, teils aus Deutung bekannt (Source pending verification)." },
  { id: "antike", title: "Griechen & Römer", sub: "Schmuck, Heilung und Symbolik", text: "Der Name Amethyst (griech. amethystos, „nicht trunken“) beruht auf der Vorstellung, der Stein schütze vor Rausch (Überlieferung). Plinius der Ältere beschreibt im 37. Buch seiner Naturgeschichte (1. Jh.) Edelsteine und ihnen zugeschriebene Kräfte (Source pending verification)." },
  { id: "mittelalter", title: "Mittelalter", sub: "Schutzsteine und Alchemie", text: "In Steinbüchern (Lapidarien) wie dem „Liber lapidum“ des Marbod von Rennes (um 1090) werden rund sechzig Steine mit medizinischen, magischen und religiösen Eigenschaften beschrieben; ein Standardwerk für Jahrhunderte (Überlieferung, Source pending verification)." },
  { id: "moderne", title: "Moderne Zeit", sub: "Wissenschaft, Technologie und Esoterik", text: "Seit dem 20. Jahrhundert laufen zwei Linien nebeneinander: Wissenschaft und Technik (Röntgenbeugung an Kristallen 1912, Kristallstrukturen, Schwingquarze, Halbleiter) und die Esoterik (Heilstein-Lehren, Chakra-Zuordnungen). Für die Wirkungen der zweiten Linie gibt es keinen Beleg." },
];

export const THEMES: { id: string; title: string; sub: string; icon: string; to: "minerals" | "elements" | "geology" | "fx" | "cultures" | "science" }[] = [
  { id: "mineralien", title: "Mineralien", sub: "Die Bausteine", icon: "hex", to: "minerals" },
  { id: "elemente", title: "Elemente", sub: "Chemische Grunddaten", icon: "atom", to: "elements" },
  { id: "geologie", title: "Geologie", sub: "Entstehung", icon: "soil", to: "geology" },
  { id: "frequenzen", title: "Frequenzen", sub: "Schwingungen", icon: "sound", to: "fx" },
  { id: "kulturen", title: "Alte Kulturen", sub: "Symbolik", icon: "scroll", to: "cultures" },
  { id: "forschung", title: "Forschung", sub: "Aktuelle Studien", icon: "microscope", to: "science" },
];

export const STUDIES: { id: string; title: string; author: string; year: string; kind: string; note: string; claim?: string; url?: string }[] = [
  { id: "curie", title: "Piezoelektrischer Effekt bei Quarz", author: "Pierre und Jacques Curie", year: "1880", kind: "Entdeckung", note: "Quarz erzeugt bei Druck eine elektrische Spannung: die Grundlage der Schwingquarze.", claim: "mineral-piezo" },
  { id: "laue", title: "Beugung von Röntgenstrahlen an Kristallen", author: "Friedrich, Knipping und von Laue", year: "1912", kind: "Nobelpreis Physik 1914", note: "Zeigte die regelmäßige Gitterstruktur der Kristalle und begründete die Kristallstrukturanalyse.", url: "https://www.nobelprize.org/prizes/physics/1914/laue/facts/" },
  { id: "placebo", title: "Heilsteine und Placebo-Effekt", author: "C. C. French et al.", year: "2001", kind: "Tagungsbeitrag", note: "Berichtete ähnliche Empfindungen bei echten und gefälschten Kristallen (aus dem Gedächtnis, Original noch zu prüfen).", claim: "crystal-healing-general" },
];

export const KRISTALL_NOTICE = "Pilot: nicht fachlich geprüft. Eigenschaften der Kristalle sind Lehrbuchwissen (Source pending verification). Wirkungen, Chakra-Zuordnungen, Frequenzen und Anwendungen wie „Edelsteinwasser“ stehen als Überlieferung mit Belegstufe da; für Heilwirkungen von Kristallen gibt es keinen Nachweis über den Placebo-Effekt hinaus. Information, keine medizinische Beratung: Heilsteine ersetzen keine Behandlung. Manche Steine sind giftig (Malachit, Pyrit u. a.): nie verschlucken, nicht ins Trinkwasser legen, Staub nicht einatmen.";
