import type { AtlasEntry } from "./types";

/**
 * Data of the "Baum Atlas" landing page (src/ui/trees.ts), built after the user's reference picture (docs/MOCKUP-NOTES.md, page 21).
 * Numbers come from the atlas or from a named source (58,497 known tree species: Global Tree Assessment of BGCI, search excerpt);
 * the mockup's placeholder numbers are not used. Texts are textbook knowledge (Source pending verification); symbolic readings
 * (torus, golden ratio, fractals, mycorrhizal "communication") are graded claims in content/claims/ and shown with their level.
 */
export interface TreeGroup { id: string; title: string; sub: string; slot: string; members: string[]; soon?: boolean; icon: string; tint: string }

export const GROUPS: TreeGroup[] = [
  { id: "laub", title: "Laubbäume", sub: "Vielfältige Arten", slot: "baum-cat-laub", members: ["eiche", "ahorn", "buche", "weide", "ginkgo"], icon: "leaf", tint: "#5a9a3a" },
  { id: "nadel", title: "Nadelbäume", sub: "Immergrüne Stärke", slot: "baum-cat-nadel", members: ["zeder", "kiefer", "mammutbaum"], icon: "tree", tint: "#2f6b45" },
  { id: "obst", title: "Obstbäume", sub: "Früchte & Nahrung", slot: "baum-cat-obst", members: ["apfel", "kirsche", "granatapfel", "walnuss", "avocado", "zitrone", "olivenbaum"], icon: "berry", tint: "#c8352a" },
  { id: "blueten", title: "Blütenbäume", sub: "Blütenpracht", slot: "baum-cat-blueten", members: [], soon: true, icon: "flower", tint: "#d9789a" },
  { id: "tropen", title: "Tropische Bäume", sub: "Exotische Vielfalt", slot: "baum-cat-tropen", members: ["baobab", "avocado"], icon: "sun", tint: "#3f9a5a" },
  { id: "heil", title: "Heilbäume", sub: "Medizinische Nutzung", slot: "baum-cat-heil", members: ["weide", "ginkgo", "teebaum"], icon: "flask", tint: "#8aa34a" },
  { id: "berg", title: "Bergbäume", sub: "Extreme Lebensräume", slot: "baum-cat-berg", members: ["zeder", "kiefer", "mammutbaum"], icon: "ruler", tint: "#5a8aa3" },
  { id: "trocken", title: "Trockengebiete", sub: "Resiliente Arten", slot: "baum-cat-trocken", members: ["baobab", "olivenbaum"], icon: "sun", tint: "#c9a02a" },
  { id: "holz", title: "Nutzholzbäume", sub: "Holz & Materialien", slot: "baum-cat-holz", members: ["eiche", "buche", "kiefer", "zeder"], icon: "layers", tint: "#9a6a3a" },
];

/** every tree of the atlas (category "baum") plus the fruit trees that are listed under fruit */
export const ALL_MEMBERS = ["category:baum", "apfel", "kirsche", "granatapfel", "walnuss", "avocado", "zitrone"];

export const POPULAR = ["eiche", "ahorn", "olivenbaum", "buche", "zeder", "mammutbaum", "baobab", "ginkgo", "kiefer", "weide"];

/** a plain fact under each popular tree (no effect, no symbolism) */
export const TAGLINE: Record<string, string> = {
  eiche: "Hartes, langlebiges Holz", ahorn: "Herbstfärbung & Sirup", olivenbaum: "Mittelmeer, Öl & Frucht", buche: "Waldbaum Mitteleuropas", zeder: "Duftholz & Zapfen",
  mammutbaum: "Riesen der Erde", baobab: "Wasserspeicher-Stamm", ginkgo: "Lebendes Fossil", kiefer: "Harz & Nadeln", weide: "Biegsam, Rinde (Salicin)", teebaum: "Blätter für Teebaumöl",
  apfel: "Pektin & Polyphenole", kirsche: "Anthocyane", granatapfel: "Punicalagine", walnuss: "Alpha-Linolensäure", avocado: "Einfach ungesättigte Fettsäuren", zitrone: "Vitamin C & Citronensäure",
};

export const GLANCE: { icon: string; text: string }[] = [
  { icon: "sun", text: "Erzeugt Sauerstoff" },
  { icon: "cell", text: "Bindet CO₂" },
  { icon: "sound", text: "Reinigt die Luft" },
  { icon: "drop", text: "Speichert Wasser" },
  { icon: "soil", text: "Stabilisiert den Boden" },
  { icon: "tree", text: "Lebensraum für Tausende Arten" },
  { icon: "flask", text: "Wertvolle Inhaltsstoffe" },
  { icon: "layers", text: "Holz, Früchte, Harze, Öle" },
  { icon: "scroll", text: "Kulturelle & spirituelle Bedeutung" },
  { icon: "link", text: "Verbindet Ökosysteme" },
];
export const GLANCE_NOTE = "Allgemeine ökologische Zusammenhänge, Lehrbuchwissen (Source pending verification). „Reinigt die Luft“ meint u. a. das Ausfiltern von Staub.";

/** the living-system diagram: hotspots with their place on the picture (percent) and the flows they light up */
export interface SystemPart { id: string; title: string; sub: string; text: string; at: [number, number]; to: [number, number]; side: "l" | "r"; icon: string; flow: string; claim?: string }
export const SYSTEM: SystemPart[] = [
  { id: "sonne", title: "Sonnenlicht", sub: "Energie für die Photosynthese", icon: "sun", flow: "sun", at: [2, 8], to: [24, 18], side: "l", text: "Die Blätter fangen Licht ein. Die Lichtenergie treibt die Photosynthese an: Aus Kohlendioxid und Wasser entstehen Zucker und Sauerstoff (Lehrbuchwissen, Source pending verification)." },
  { id: "co2", title: "CO₂", sub: "Wird aufgenommen und in Zucker umgewandelt", icon: "cell", flow: "co2", at: [2, 36], to: [34, 30], side: "l", text: "Kohlendioxid gelangt über winzige Spaltöffnungen in die Blätter und wird zu Zucker verarbeitet. Daraus baut der Baum Holz, Blätter und Früchte (Lehrbuchwissen, Source pending verification)." },
  { id: "o2", title: "O₂", sub: "Sauerstoff wird an die Atmosphäre abgegeben", icon: "drop", flow: "o2", at: [2, 64], to: [30, 40], side: "l", text: "Sauerstoff entsteht bei der Photosynthese als Nebenprodukt und verlässt die Blätter über die Spaltöffnungen. Der Baum atmet aber auch selbst und verbraucht dabei Sauerstoff (Lehrbuchwissen, Source pending verification)." },
  { id: "blaetter", title: "Blätter", sub: "Photosynthese, Atmung & Verdunstung", icon: "leaf", flow: "leaves", at: [66, 6], to: [60, 22], side: "r", text: "In den Blättern läuft die Photosynthese. Über sie verdunstet der Baum auch Wasser, was den Wasserstrom im Stamm antreibt (Lehrbuchwissen, Source pending verification)." },
  { id: "stamm", title: "Stamm", sub: "Transport von Wasser, Nährstoffen und Signalen", icon: "stem", flow: "trunk", at: [66, 36], to: [52, 44], side: "r", text: "Im Stamm steigt Wasser mit Mineralstoffen nach oben (Xylem), und Zucker wird nach unten verteilt (Phloem). Auch elektrische und chemische Signale werden weitergeleitet (Lehrbuchwissen, Source pending verification)." },
  { id: "wurzeln", title: "Wurzeln", sub: "Aufnahme von Wasser und Mineralien", icon: "root", flow: "roots", at: [66, 60], to: [56, 66], side: "r", text: "Feine Wurzeln nehmen Wasser und Mineralstoffe auf und verankern den Baum. Das Wurzelwerk kann sehr weit reichen (Lehrbuchwissen, Source pending verification)." },
  { id: "boden", title: "Boden & Mykorrhiza", sub: "Austausch von Nährstoffen, Kommunikation im Netzwerk", icon: "link", flow: "soil", at: [58, 82], to: [48, 84], side: "r", claim: "baum-mykorrhiza", text: "Pilze an den Feinwurzeln tauschen Wasser und Mineralstoffe gegen Zucker (Mykorrhiza). Dass dieses Pilzgeflecht Bäume wie ein „Netzwerk“ verbindet und zwischen ihnen Kohlenstoff überträgt, ist gemessen worden; wie weit das reicht und ob Bäume dabei „kommunizieren“, ist umstritten (Aussage mit Belegstufe)." },
];

/** the energy-flow list; items with a claim are symbolic and carry their evidence level */
export const ENERGY: { id: string; title: string; sub?: string; icon: string; text: string; claim?: string }[] = [
  { id: "licht", title: "Lichtenergie", icon: "sun", text: "Licht ist die Energiequelle des Baums: Photosynthese wandelt es in chemische Energie (Zucker) um (Lehrbuchwissen, Source pending verification)." },
  { id: "signale", title: "Elektrische Signale", icon: "bolt", text: "Pflanzen leiten elektrische Signale (Aktionspotenziale) und chemische Botenstoffe weiter, z. B. nach Verletzungen. Bei Bäumen ist das weniger erforscht als bei Kräutern (Lehrbuchwissen, Source pending verification)." },
  { id: "wasser", title: "Wassertransport", icon: "drop", text: "Wasser steigt im Holz nach oben, getrieben von der Verdunstung an den Blättern (Kohäsions-Spannungs-Theorie, Lehrbuchwissen, Source pending verification)." },
  { id: "kreislauf", title: "Nährstoffkreislauf", icon: "soil", text: "Laub und Totholz werden von Pilzen und Bodenlebewesen zersetzt; die frei werdenden Nährstoffe nimmt der Baum wieder auf (Lehrbuchwissen, Source pending verification)." },
  { id: "torus", title: "Torus-Modell", sub: "symbolische Darstellung", icon: "hex", claim: "baum-torus", text: "Ein Bild aus der Energie- und Geometrie-Überlieferung: Energie fließt in einem Kreislauf durch den Baum und um ihn herum. Es ist eine symbolische Darstellung, keine Messung." },
  { id: "fraktal", title: "Fraktale Strukturen", sub: "in Ästen und Wurzeln", icon: "sprout", claim: "baum-fraktale", text: "Äste und Wurzeln verzweigen sich näherungsweise selbstähnlich; mathematische Fraktalmodelle beschreiben das gut, echte Bäume sind keine exakten Fraktale." },
  { id: "schnitt", title: "Goldener Schnitt", sub: "in der Natur", icon: "target", claim: "baum-goldener-schnitt", text: "Näherungen an den Goldenen Winkel finden sich in der Blattstellung vieler Pflanzen; dass ganze Bäume im Goldenen Schnitt gebaut sind, ist eine verbreitete Verallgemeinerung." },
];

export const LEVELS: { id: string; title: string; sub: string; icon: string; slot: string; text: string; level: string }[] = [
  { id: "wissenschaft", title: "Wissenschaftlich", sub: "Botanik, Ökologie, Physiologie", icon: "microscope", slot: "baum-ebene-wissenschaft", level: "Typische Belegstufe: gesichert bis Hypothese", text: "Messbare Aussagen über Aufbau, Stoffwechsel und Lebensräume. Sie stützen sich auf begutachtete Studien; offene Fragen (z. B. das Pilznetzwerk im Boden) werden als Hypothese gekennzeichnet." },
  { id: "traditionell", title: "Traditionell", sub: "Volksheilkunde, indigene Kulturen", icon: "scroll", slot: "baum-ebene-traditionell", level: "Typische Belegstufe: Überlieferung", text: "Überliefertes Wissen über Nutzung und Bedeutung von Bäumen, von Rinde und Harz bis zu Heilbäumen. Es wird als Überlieferung gezeigt, nicht als Wirkungsnachweis." },
  { id: "geometrisch", title: "Geometrisch", sub: "Fraktale, Symmetrie, Torus-Modelle", icon: "hex", slot: "baum-ebene-geometrisch", level: "Typische Belegstufe: Behauptung", text: "Mathematische Muster in Ästen und Blattstellung sind beschreibbar. Weitergehende Deutungen (Torus, Goldener Schnitt, Energiefelder) stehen als Behauptung mit Gegenbelegen." },
  { id: "spirituell", title: "Spirituell", sub: "Weltenbaum, Symbolik & Mythologie", icon: "stress", slot: "baum-ebene-spirituell", level: "Typische Belegstufe: Symbolik", text: "Der Baum als Weltenbaum, Lebensbaum oder heiliger Ort in Mythen und Religionen. Das ist Kulturgeschichte und Symbolik; sie sagt nichts über Messbares." },
];

export const OLDEST: { id: string; name: string; age: string; text: string }[] = [
  { id: "methusalem", name: "Methusalem-Kiefer", age: "> 4.800 Jahre", text: "Eine Grannen-Kiefer (Pinus longaeva) in den White Mountains, Kalifornien. Ihr Alter wird auf etwa 4.790 bis über 4.840 Jahre geschätzt; sie gilt als ältester bekannter Einzelbaum (Suchauszug, Source pending verification)." },
  { id: "olive", name: "Olivenbaum", age: "> 2.000 Jahre", text: "Der Olivenbaum von Vouves auf Kreta: Jahrringe belegen mindestens 2.000 Jahre, Schätzungen reichen bis etwa 3.000 bis 4.000 Jahre; das genaue Alter ist nicht bestimmbar (Suchauszug, Source pending verification)." },
  { id: "jomon", name: "Jōmon-Sugi", age: "> 2.000 Jahre", text: "Eine Japanische Sicheltanne auf der Insel Yakushima. Das Alter wird zwischen etwa 2.170 und bis zu 7.000 Jahren geschätzt und ist nicht durch Jahrringe gesichert (Suchauszug, Source pending verification)." },
  { id: "baobab", name: "Baobab", age: "> 1.000 Jahre", text: "Alte Affenbrotbäume in Afrika werden auf über 1.000 Jahre und teils deutlich mehr geschätzt (Angabe der Vorlage, Source pending verification)." },
  { id: "eiche", name: "Eiche", age: "> 1.000 Jahre", text: "Einzelne Eichen in Europa werden auf etwa 1.000 Jahre und mehr geschätzt (Angabe der Vorlage, Source pending verification)." },
];

export const ECO: { icon: string; title: string; sub: string }[] = [
  { icon: "sprout", title: "Vögel", sub: "Nistplatz & Nahrung" },
  { icon: "flower", title: "Insekten", sub: "Bestäubung & Zersetzung" },
  { icon: "cell", title: "Pilze", sub: "Symbiose & Nährstoffe" },
  { icon: "root", title: "Kleintiere", sub: "Lebensraum & Schutz" },
  { icon: "dna", title: "Mikroorganismen", sub: "Bodenleben & Gesundheit des Bodens" },
];
export const ECO_TEXT = "Ein einzelner alter Baum kann Lebensraum, Nahrungsquelle und Brutplatz für sehr viele Arten sein: Vögel nisten in Krone und Höhlen, Insekten leben in Rinde, Blüten und Totholz, Pilze zersetzen Holz oder gehen mit den Wurzeln eine Partnerschaft ein, und im Boden unter dem Baum lebt ein dichtes Netz aus Mikroorganismen (Lehrbuchwissen, Source pending verification).";

export const BENEFITS: { icon: string; title: string }[] = [
  { icon: "sound", title: "Bessere Luftqualität" },
  { icon: "thermo", title: "Kühlung des Klimas" },
  { icon: "cell", title: "CO₂-Bindung" },
  { icon: "drop", title: "Wasserkreislauf & Regenbildung" },
  { icon: "tree", title: "Biodiversität fördern" },
  { icon: "soil", title: "Bodenschutz & Erosionsschutz" },
  { icon: "berry", title: "Nahrung für Mensch & Tier" },
  { icon: "link", title: "Lebensräume schaffen" },
];

export const TOPICS: { id: string; title: string; sub: string; icon: string; slot: string; button: string; text: string }[] = [
  { id: "holz", title: "Holz & Nutzung", sub: "Vom Bauwerk bis zur Medizin.", icon: "layers", slot: "baum-holz", button: "Nutzung & Materialien", text: "Bäume liefern Bauholz, Möbelholz, Papier und Brennholz, Kork (Korkeiche), Harze, Gerbstoffe, Öle, Früchte und Nüsse. Einige Arzneistoffe stammen ursprünglich aus Bäumen, z. B. Salicin aus der Weidenrinde als Vorbild des Acetylsalicylsäure-Wirkstoffs; Ginkgo und Teebaum sind im Atlas verzeichnet (Lehrbuchwissen, Source pending verification). Das ist Information, keine Anwendungsempfehlung." },
  { id: "kultur", title: "Baum in Kulturen & Mythologie", sub: "Der Baum als Symbol in allen Kulturen der Welt.", icon: "scroll", slot: "baum-kultur", button: "Geschichte & Kultur", text: "In vielen Kulturen steht der Baum für Verbindung von Erde und Himmel: der Weltenbaum Yggdrasil der nordischen Mythologie, der Lebensbaum, der Bodhi-Baum im Buddhismus, die Eiche des Zeus in Dodona, der Ölzweig als Friedenssymbol. Das ist Symbolik und Kulturgeschichte (Source pending verification). Die Seite „Alte Kulturen“ vertieft einzelne Überlieferungen." },
  { id: "forschung", title: "Forschung & Zukunft", sub: "Aktuelle Studien und neue Erkenntnisse.", icon: "microscope", slot: "baum-forschung", button: "Forschung entdecken", text: "Die Global Tree Assessment (BGCI) zählt 58.497 bekannte Baumarten und schätzt rund 30 % als vom Aussterben bedroht ein. Weitere Forschungsfelder: Mykorrhiza-Netzwerke und Kohlenstoffübertragung (Simard 1997 und Folgearbeiten, in der Deutung umstritten), Wasserhaushalt bei Dürre und die Wirkung von Wäldern auf das Klima (Suchauszug, Source pending verification)." },
];

export const STAT_SOURCE = { label: "Global Tree Assessment (BGCI)", url: "https://www.bgci.org/our-work/projects-and-case-studies/global-tree-assessment/" };
export const KNOWN_SPECIES = 58497;

export const TREES_NOTICE = "Pilot: nicht fachlich geprüft. Zahlen auf dieser Seite werden aus dem Atlas gezählt oder nennen ihre Quelle; alle Texte sind Lehrbuchwissen und Allgemeinwissen (Source pending verification). Deutungen wie Torus-Modell, Goldener Schnitt oder „Kommunikation der Bäume“ stehen als Behauptung oder Hypothese mit Belegstufe. Information, keine medizinische Beratung: Bei Beschwerden oder Medikamenten bitte ärztlich oder in der Apotheke nachfragen. Früchte, Samen und Rinde wild wachsender Bäume nur verwenden, wenn eine Fachperson sie sicher bestimmt hat.";

/** the entries a group contains, in the order of the data */
export function groupEntries(members: string[], all: AtlasEntry[]): AtlasEntry[] {
  const out: AtlasEntry[] = [];
  const add = (e?: AtlasEntry) => { if (e && !out.includes(e)) out.push(e); };
  for (const m of members) {
    if (m.startsWith("category:")) all.filter((e) => e.category === m.slice(9)).forEach(add);
    else add(all.find((e) => e.id === m));
  }
  return out;
}
