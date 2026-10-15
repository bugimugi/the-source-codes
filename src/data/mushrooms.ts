export { groupEntries } from "./trees.ts";

/**
 * Data of the "Pilz Atlas" landing page (src/ui/mushrooms.ts), built after the user's reference picture (docs/MOCKUP-NOTES.md, page 32).
 * Numbers come from the atlas or from a named source (about 155,000 formally described fungal species: Kew, State of the World's Plants
 * and Fungi 2023, search excerpt); the mockup's placeholder numbers ("2.500+ Pilzarten", "400+ Wirkstoffe", "50+ Gattungen") are not used.
 * Texts are textbook knowledge (Source pending verification). Everything about effects, patterns and frequencies is a graded claim in
 * content/claims/ and is shown with its evidence level; nothing here is an instruction (no amounts, no preparation, no identification help).
 * "Psychoaktive Pilze", "Schimmelpilze" and "Leuchtende Pilze" have no entry in the atlas yet and stay "in Vorbereitung"; psychoactive
 * mushrooms get no content at all (the fly agaric stands in the atlas with its poison warning).
 */
export interface MushroomGroup { id: string; title: string; sub: string; slot: string; members: string[]; soon?: boolean; icon: string; tint: string }

/** the members follow the facts of the atlas entries (Vorkommen, Verwendung, associations, tradition text) */
export const GROUPS: MushroomGroup[] = [
  { id: "heil", title: "Heilpilze", sub: "Überlieferte Heilkunde", slot: "pilz-cat-heil", members: ["reishi", "chaga", "kordyzeps", "shiitake"], icon: "mushroom", tint: "#b8432a" },
  { id: "speise", title: "Speisepilze", sub: "Nahrung & Genuss", slot: "pilz-cat-speise", members: ["steinpilz", "austernpilz", "shiitake", "igelstachelbart"], icon: "bowl", tint: "#c9a46a" },
  { id: "vital", title: "Vitalpilze", sub: "Moderne Pilzheilkunde", slot: "pilz-cat-vital", members: ["igelstachelbart"], icon: "sparkle", tint: "#d8c9a8" },
  { id: "psycho", title: "Psychoaktive Pilze", sub: "Kein Inhalt im Atlas", slot: "pilz-cat-psycho", members: [], soon: true, icon: "brain", tint: "#8a6ac8" },
  { id: "holz", title: "Holzzersetzer", sub: "Recycling & Kreislauf", slot: "pilz-cat-holz", members: ["reishi", "austernpilz", "shiitake", "igelstachelbart"], icon: "recycle", tint: "#9a6a3a" },
  { id: "boden", title: "Bodenpilze", sub: "Mykorrhiza & Netzwerke", slot: "pilz-cat-boden", members: ["steinpilz", "fliegenpilz"], icon: "network", tint: "#d89a4a" },
  { id: "schimmel", title: "Schimmel­pilze", sub: "Medizin & Biotechnologie", slot: "pilz-cat-schimmel", members: [], soon: true, icon: "cell", tint: "#5a9a6a" },
  { id: "selten", title: "Seltene Pilze", sub: "Selten und geschützt", slot: "pilz-cat-selten", members: ["igelstachelbart"], icon: "sprout", tint: "#a05ac8" },
  { id: "leucht", title: "Leuchtende Pilze", sub: "Biolumineszenz", slot: "pilz-cat-leucht", members: [], soon: true, icon: "sun", tint: "#4aa8e8" },
];

export const ALL_MEMBERS = ["category:pilz"];

export const POPULAR = ["reishi", "igelstachelbart", "chaga", "kordyzeps", "shiitake", "austernpilz", "steinpilz", "fliegenpilz"];

/** a plain fact under each popular mushroom (from its atlas entry; no effect, no symbolism) */
export const TAGLINE: Record<string, string> = {
  reishi: "Holzbewohner, Lingzhi", igelstachelbart: "Stacheln statt Lamellen", chaga: "Wächst an Birken", kordyzeps: "Parasit in Raupen", shiitake: "Speisepilz aus Ostasien",
  austernpilz: "Häufiger Kulturpilz", steinpilz: "Mykorrhiza-Speisepilz", fliegenpilz: "Giftig, nicht essen",
};

export const GLANCE: { icon: string; title: string; sub: string }[] = [
  { icon: "recycle", title: "Recycling-Experten", sub: "Zersetzen organisches Material" },
  { icon: "network", title: "Netzwerkbildner", sub: "Partner der Pflanzenwurzeln im Boden" },
  { icon: "flask", title: "Stoffe in Forschung", sub: "Gegenstand von Studien und Überlieferung" },
  { icon: "bowl", title: "Nahrung", sub: "Viele Arten essbar, manche giftig" },
  { icon: "hex", title: "Geometrische Strukturen", sub: "Verzweigte Netze und Muster" },
  { icon: "tree", title: "Ökologische Schlüsselrolle", sub: "Teil der Kreisläufe im Wald" },
  { icon: "scroll", title: "Kultur & Symbolik", sub: "In vielen Kulturen bekannt" },
];
export const GLANCE_NOTE = "Allgemeine biologische Zusammenhänge, Lehrbuchwissen (Source pending verification). Keine Wirkversprechen.";

/** "Das unsichtbare Königreich": hotspots on the picture (positions in percent of the picture) */
export interface NetPart { id: string; title: string; sub: string; text: string; icon: string; at: [number, number]; to: [number, number]; side: "l" | "r"; claim?: string; claim2?: string; atlas?: string[] }
export const NETWORK: NetPart[] = [
  { id: "pflanzen", title: "Pflanzen", sub: "Austausch von Nährstoffen", icon: "leaf", at: [2, 7], to: [27, 30], side: "l", text: "Mykorrhiza-Pilze nehmen Zucker aus den Wurzeln der Pflanzen auf und liefern dafür Wasser und Mineralstoffe, vor allem Phosphat. Die meisten Landpflanzen leben mit solchen Pilzen zusammen (Lehrbuchwissen, Source pending verification)." },
  { id: "mykorrhiza", title: "Mykorrhiza", sub: "Symbiose mit Pflanzen", icon: "link", at: [2, 38], to: [40, 52], side: "l", atlas: ["steinpilz", "fliegenpilz"], text: "Bei der Mykorrhiza umhüllen oder durchdringen Pilzfäden (Hyphen) die Feinwurzeln; beide Seiten haben einen Nutzen. Im Atlas gehören der Steinpilz und der Fliegenpilz zu den Mykorrhiza-Pilzen (Lehrbuchwissen, Source pending verification)." },
  { id: "naehrstoffe", title: "Nährstoffe", sub: "Recycling & Aufbereitung", icon: "recycle", at: [2, 69], to: [26, 72], side: "l", atlas: ["reishi", "austernpilz", "shiitake"], text: "Zersetzer-Pilze bauen totes Holz, Laub und andere organische Stoffe ab und machen die Nährstoffe wieder verfügbar. Im Atlas leben Reishi, Austernseitling und Shiitake an Holz (Lehrbuchwissen, Source pending verification)." },
  { id: "signal", title: "Signal­übertragung", sub: "Chemische & elektrische Kommunikation", icon: "bolt", at: [66, 7], to: [60, 54], side: "r", claim: "baum-mykorrhiza", claim2: "pilz-frequenz", text: "Ob Pilzgeflechte Signale zwischen Pflanzen weiterleiten, wird erforscht und ist nicht gesichert. Gemessen wurde u. a. die Übertragung von Kohlenstoff zwischen Bäumen (Simard 1997); Deutungen wie „Pflanzen kommunizieren“ gehen über die Messungen hinaus. Elektrische Impulse im Myzel einiger Arten wurden beschrieben, ihre Bedeutung ist umstritten (zweite Aussage)." },
  { id: "netz", title: "Netzwerk", sub: "Verbindet ganze Wälder („Wood Wide Web“)", icon: "network", at: [66, 38], to: [74, 66], side: "r", claim: "baum-mykorrhiza", text: "Der Begriff „Wood Wide Web“ beschreibt die Vorstellung eines Pilznetzes, das Bäume im Wald verbindet. Teile davon sind gemessen, das Ausmaß und die Bedeutung für ganze Wälder sind umstritten." },
  { id: "boden", title: "Bodenleben", sub: "Dichtes Netz aus Mikroorganismen", icon: "soil", at: [66, 69], to: [52, 86], side: "r", text: "Der Boden enthält ein dichtes Geflecht aus Pilzfäden, Bakterien und anderen Kleinstlebewesen. Pilze sind ein großer Teil dieses Bodenlebens (Lehrbuchwissen, Source pending verification)." },
];
/** a short warning shown near the top of the page (the long notice stands at the end) */
export const WILD_WARNING = "Wildpilze nur essen, wenn eine Pilzsachverständige oder ein Pilzsachverständiger sie bestimmt hat. Viele essbare Pilze haben giftige Doppelgänger; Fotos und Bestimmungs-Apps ersetzen die Bestimmung nicht. Diese Seite hilft nicht beim Bestimmen.";
export const NETWORK_INTRO = "Ein großes Netz unter unseren Füßen: Pilzfäden verbinden Pflanzen, Holz und Boden. Tippe auf einen Punkt.";

/** the life cycle of a mushroom in a ring (positions in percent of the box) */
export const LIFECYCLE: { id: string; title: string; sub: string; text: string; icon: string; at: [number, number] }[] = [
  { id: "spore", title: "Spore", sub: "Verbreitung", icon: "seed", at: [50, 5], text: "Pilze verbreiten sich über winzige Sporen, die Wind, Wasser oder Tiere tragen. Eine Spore besteht meist aus einer einzelnen Zelle und kann bei passenden Bedingungen auskeimen." },
  { id: "keimung", title: "Keimung", sub: "Wachstum", icon: "sprout", at: [90, 36], text: "Aus der Spore wächst ein feiner Pilzfaden, die Hyphe." },
  { id: "myzel", title: "Myzel", sub: "Netzwerkbildung", icon: "network", at: [76, 86], text: "Die Hyphen verzweigen sich zum Myzel, dem eigentlichen Pilzkörper im Boden oder im Holz. Der sichtbare Pilz ist meist nur der Fruchtkörper." },
  { id: "frucht", title: "Fruchtkörper", sub: "Sichtbares Organ", icon: "mushroom", at: [24, 86], text: "Bei passenden Bedingungen bildet das Myzel einen Fruchtkörper (Hut und Stiel, Konsole, Stachelbart …), der Sporen hervorbringt." },
  { id: "reifung", title: "Reifung", sub: "Sporenbildung", icon: "clock", at: [10, 36], text: "Der Fruchtkörper reift und entlässt Sporen, je nach Art an Lamellen, Röhren oder Stacheln. Der Kreislauf beginnt von vorn." },
];
export const LIFECYCLE_NOTE = "Vereinfachtes Schema (Lehrbuchwissen, Source pending verification); viele Arten haben andere Entwicklungswege.";

/** "Geometrie & Frequenzen": four cards; the readings carry the evidence level of their claim */
export const GEO: { id: string; title: string; sub: string; icon: string; slot: string; text: string; claim?: string }[] = [
  { id: "spirale", title: "Spiralen", sub: "in der Natur", icon: "spiral", slot: "pilz-geo-spirale", claim: "pilz-muster", text: "Spiralmuster werden bei Pflanzen und Pilzen beschrieben und lassen sich mathematisch darstellen. Eine Deutung als „Energiemuster“ ist eine Behauptung." },
  { id: "fraktal", title: "Fraktale", sub: "Wachstumsmuster", icon: "network", slot: "pilz-geo-fraktal", claim: "pilz-muster", text: "Das Myzel verzweigt sich netzartig. Fraktalmodelle werden genutzt, um solche Verzweigungen zu beschreiben; echte Pilzgeflechte sind keine exakten Fraktale." },
  { id: "frequenz", title: "Frequenzen", sub: "Schwingung & Resonanz", icon: "wave", slot: "pilz-geo-frequenz", claim: "pilz-frequenz", text: "Elektrische Impulse im Myzel einiger Arten wurden beschrieben. Dass Pilze bestimmte Frequenzen wie 432 Hz „haben“, ist eine Behauptung ohne Beleg." },
  { id: "geometrie", title: "Heilige Geometrie", sub: "Symmetrie & Harmonie", icon: "hex", slot: "pilz-geo-geometrie", claim: "pilz-muster", text: "Hutpilze sind meist radialsymmetrisch gebaut. „Heilige Geometrie“ ist eine Deutung aus der Überlieferung, keine Messung." },
];

/** body areas: an area lists the mushrooms whose atlas associations contain one of the WHOLE words (like the body page) */
export const HEALTH_AREAS: { id: string; title: string; icon: string; words: string[] }[] = [
  { id: "immun", title: "Immunsystem", icon: "shield", words: ["Immunsystem", "Lymphsystem"] },
  { id: "gehirn", title: "Gehirn & Nerven", icon: "brain", words: ["Gehirn", "Nervensystem"] },
  { id: "herz", title: "Herz & Kreislauf", icon: "heart", words: ["Herz", "Kreislauf"] },
  { id: "entz", title: "Entzündungsprozesse", icon: "flame", words: ["Entzündung", "Entzündungen"] },
  { id: "darm", title: "Darmgesundheit", icon: "gut", words: ["Darm", "Magen"] },
  { id: "zell", title: "Zellschutz", icon: "cell", words: ["Zellschutz"] },
];
export const HEALTH_NOTE = "Die Zuordnungen stammen aus den Atlas-Einträgen und sind Überlieferung oder moderne Lehre, kein Wirkungsnachweis. Jede Aussage trägt ihre Belegstufe. Keine Anwendungsempfehlung.";

export interface Compound { id: string; tab: string; title: string; sub: string; icon: string; slot: string; text: string; bullets: string[]; claim?: string }
export const COMPOUND_TABS: { id: string; label: string }[] = [
  { id: "beta", label: "Beta-Glucane" }, { id: "tri", label: "Triterpene" }, { id: "poly", label: "Polysaccharide" }, { id: "weitere", label: "Weitere" },
];
/** textbook descriptions of compound classes (no amounts, no effects of single mushrooms) */
export const COMPOUNDS: Compound[] = [
  { id: "beta", tab: "beta", title: "Beta-Glucane", sub: "Zuckerketten", icon: "link", slot: "pilz-stoff-beta", claim: "pilz-betaglucane", text: "Beta-Glucane sind lange Ketten aus Glucose-Bausteinen und Bestandteil der Zellwand vieler Pilze, Hefen und Getreide.", bullets: ["Zuckerketten (Polysaccharide)", "Bestandteil der Zellwand vieler Pilze", "Forschungsthema im Bereich Immunsystem (Stand der Redaktion, ungeprüft)"] },
  { id: "tri", tab: "tri", title: "Triterpene", sub: "Naturstoffgruppe", icon: "hex", slot: "pilz-stoff-tri", text: "Triterpene sind Naturstoffe aus 30 Kohlenstoffatomen. Beim Reishi werden unter anderem Ganoderinsäuren genannt (Lehrbuchwissen, nicht im Atlas-Eintrag).", bullets: ["Naturstoffe aus Isopren-Bausteinen", "Bei Reishi werden Ganoderinsäuren genannt (nicht im Atlas-Eintrag)", "Eine geprüfte Liste je Pilzart fehlt noch"] },
  { id: "poly", tab: "poly", title: "Polysaccharide", sub: "Vielfachzucker", icon: "network", slot: "pilz-stoff-poly", text: "Polysaccharide sind Ketten aus vielen Zuckerbausteinen. Die Zellwände der Pilze bestehen vor allem aus Chitin und Glucanen.", bullets: ["Zellwand: Chitin und Glucane", "Auch als Ballaststoff Teil der Nahrung", "Beta-Glucane sind eine Untergruppe"] },
  { id: "ergo", tab: "weitere", title: "Ergothionein", sub: "Schwefelhaltiger Stoff", icon: "flask", slot: "pilz-stoff-ergo", text: "Ergothionein ist ein schwefelhaltiger Abkömmling der Aminosäure Histidin. Pilze und manche Bakterien bilden ihn; Menschen nehmen ihn über die Nahrung auf, Pilze zählen zu den reichsten Quellen. Seine Bedeutung für den Menschen wird erforscht.", bullets: ["Wird von Pilzen und Bakterien gebildet", "Aufnahme über die Nahrung", "Bedeutung für den Menschen in Forschung"] },
  { id: "terp", tab: "weitere", title: "Terpene", sub: "Duft- und Aromastoffe", icon: "sparkle", slot: "pilz-stoff-terp", text: "Terpene sind eine große Gruppe von Naturstoffen aus Isopren-Bausteinen, die auch in Pilzen vorkommen. Viele sind Duft- und Aromastoffe.", bullets: ["Große Stoffgruppe aus Isopren-Bausteinen", "Viele Duft- und Aromastoffe", "Triterpene gehören dazu"] },
];
/** the picture buttons under the card */
export const COMPOUND_THUMBS = ["poly", "ergo", "tri", "terp"];
export const COMPOUND_NOTE = "Beschreibung von Stoffgruppen nach Lehrbuchwissen (Source pending verification), keine Mengen und keine Wirkung einzelner Pilze. Welche Stoffe ein Eintrag nennt, steht in seinem Profil unter „Inhaltsstoffe“; fehlt dort etwas, ist es noch nicht erfasst.";

/** "Pilze in Kulturen & Traditionen": the texts of the atlas entries are quoted word for word under the intro */
export const CULTURES: { id: string; title: string; sub: string; icon: string; slot: string; intro: string; entries: string[]; goto?: "cultures" }[] = [
  { id: "volk", title: "Rituale & Völkerkunde", sub: "Berichte aus Sibirien", icon: "scroll", slot: "pilz-kultur-volk", intro: "In der Völkerkunde werden rituelle Verwendungen des Fliegenpilzes beschrieben. Der Fliegenpilz ist giftig: nicht essen und nicht als Heilmittel verwenden.", entries: ["fliegenpilz"] },
  { id: "medizin", title: "Traditionelle Medizin", sub: "Asien, Europa, Russland", icon: "leaf", slot: "pilz-kultur-medizin", intro: "Aus der Überlieferung (Source pending verification), nicht als Wirkungsnachweis:", entries: ["reishi", "kordyzeps", "chaga", "shiitake"] },
  { id: "symbol", title: "Symbole & Volksglaube", sub: "Glückspilz & Lingzhi", icon: "sparkle", slot: "pilz-kultur-symbol", intro: "Pilze erscheinen als Glückssymbole in Märchen und Kunst:", entries: ["fliegenpilz", "reishi"] },
  { id: "forschung", title: "Moderne Forschung", sub: "Medizin & Biotechnologie", icon: "microscope", slot: "pilz-kultur-forschung", intro: "Heute untersuchen Labore Pilze als Quelle von Arzneistoffen, Enzymen und Werkstoffen (Lehrbuchwissen, Source pending verification). Mehr dazu unter „Forschung & Zukunft“.", entries: [], goto: "cultures" },
];

export const ECOLOGY: { id: string; title: string; sub: string; icon: string; slot: string; text: string }[] = [
  { id: "zersetzung", title: "Zersetzung", sub: "Recycling der Natur", icon: "recycle", slot: "pilz-oeko-zersetzung", text: "Zersetzer-Pilze bauen Holz, Laub und Tierreste ab. Ohne sie würden sich tote Pflanzenteile in den Wäldern anhäufen und die Nährstoffe blieben gebunden (Lehrbuchwissen, Source pending verification)." },
  { id: "boden", title: "Bodenaufbau", sub: "Gesunde Ökosysteme", icon: "soil", slot: "pilz-oeko-boden", text: "Pilzfäden durchziehen den Boden, halten Bodenteilchen zusammen und tragen zur Humusbildung bei (Lehrbuchwissen, Source pending verification)." },
  { id: "wachstum", title: "Pflanzen­wachstum", sub: "Mykorrhiza-Symbiose", icon: "sprout", slot: "pilz-oeko-wachstum", text: "Die meisten Landpflanzen wachsen mit Mykorrhiza-Pilzen. Die Pilze vergrößern die aufnehmende Fläche der Wurzeln (Lehrbuchwissen, Source pending verification)." },
  { id: "klima", title: "Klima & Kohlenstoff", sub: "Kohlenstoff im Boden", icon: "cell", slot: "pilz-oeko-klima", text: "Pilze sind am Kohlenstoffkreislauf beteiligt: Zersetzer setzen Kohlenstoff frei, Mykorrhiza-Pilze erhalten Zucker von Pflanzen. Wie viel Kohlenstoff sie im Boden festlegen, wird erforscht und ist offen (Hypothese, Source pending verification)." },
  { id: "bio", title: "Biodiversität", sub: "Lebensraum für viele Arten", icon: "tree", slot: "pilz-oeko-bio", text: "Pilze sind Nahrung und Lebensraum für Insekten, Schnecken und viele Kleinstlebewesen; Totholz mit Pilzen ist ein Hotspot der Vielfalt im Wald (Lehrbuchwissen, Source pending verification)." },
];

export const APPLICATIONS: { id: string; title: string; sub: string; icon: string; slot: string; text: string; lab?: boolean }[] = [
  { id: "kueche", title: "Kulinarische Rezepte", sub: "Speisepilze in der Küche", icon: "bowl", slot: "pilz-anw-kueche", lab: true, text: "Als Speisepilze stehen im Atlas der Steinpilz, der Austernseitling, der Shiitake und der Igelstachelbart. Wildpilze nur essen, wenn eine Pilzsachverständige oder ein Pilzsachverständiger sie bestimmt hat; Verwechslungen können lebensgefährlich sein." },
  { id: "medizin", title: "Medizinische Anwendungen", sub: "Überlieferung, keine Empfehlung", icon: "flask", slot: "pilz-anw-medizin", text: "Der Atlas nennt traditionelle Verwendungen als Überlieferung mit Belegstufe (siehe die Aussagen bei den Pilzen). Es gibt keine Anwendungsempfehlung und keine Mengen. Bei Beschwerden oder Medikamenten bitte ärztlich oder in der Apotheke nachfragen." },
  { id: "extrakt", title: "Extrakte & Tinkturen", sub: "Fertigpräparate", icon: "dropper", slot: "pilz-anw-extrakt", text: "Extrakte, Pulver und Tinkturen sind Fertigpräparate. Diese Seite nennt keine Mengen und keine Herstellung; Packungsbeilage und ärztlichen Rat beachten. Wechselwirkungen mit Medikamenten sind möglich." },
  { id: "ideen", title: "Kreative Ideen & mehr", sub: "folgt", icon: "sparkle", slot: "pilz-anw-ideen", text: "Dieser Bereich ist in Vorbereitung. Gedacht ist an Pilzmyzel als Werkstoff und weitere Verwendungen; Inhalte folgen, sobald es geprüfte Angaben gibt." },
];

export const RESEARCH: { id: string; title: string; sub: string; icon: string; slot: string; text: string; claim?: string }[] = [
  { id: "medizin", title: "Medizinische Anwendungen", sub: "Aus Pilzen zu Arzneistoffen", icon: "microscope", slot: "pilz-forsch-medizin", text: "Mehrere Arzneistoffe stammen ursprünglich aus Pilzen, das bekannteste Beispiel ist Penicillin aus dem Schimmelpilz Penicillium (entdeckt 1928 von Alexander Fleming). Ob und wie Heilpilze selbst wirken, wird in Studien untersucht; die Aussagen bei den einzelnen Pilzen zeigen die Belegstufe (Lehrbuchwissen, Source pending verification)." },
  { id: "neuro", title: "Neurologische Forschung", sub: "Igelstachelbart im Fokus", icon: "brain", slot: "pilz-forsch-neuro", claim: "igelstachelbart-cognition", text: "Zum Igelstachelbart und zum Nervenwachstum wird geforscht. Die Aussage im Atlas trägt die Belegstufe Hypothese; die Studienlage ist dünn." },
  { id: "biotech", title: "Biotechnologie & Innovationen", sub: "Myzel als Werkstoff", icon: "network", slot: "pilz-forsch-biotech", text: "Aus Pilzmyzel werden Verpackungs- und Dämmmaterialien entwickelt, und Pilze dienen als Produzenten von Enzymen und Arzneistoffen (Lehrbuchwissen, Source pending verification)." },
  { id: "nachhaltig", title: "Nachhaltige Lösungen", sub: "Pilze als Helfer", icon: "recycle", slot: "pilz-forsch-nachhaltig", text: "Die Mykoremediation untersucht, ob Pilze Schadstoffe im Boden abbauen oder Abfälle verwerten können. Vieles davon ist im Labor- oder Pilotmaßstab (Hypothese, Source pending verification)." },
];

/** claims whose sources feed "Alle Studien anzeigen" */
export const STUDY_CLAIMS = ["baum-mykorrhiza", "pilz-muster", "pilz-frequenz", "pilz-betaglucane", "reishi-traditional-use", "chaga-traditional-use", "kordyzeps-traditional-use", "igelstachelbart-cognition"];

export const STAT_SOURCE = { label: "Kew: State of the World's Plants and Fungi 2023", url: "https://www.kew.org/read-and-watch/sotwpf-2023-summary" };
export const KNOWN_SPECIES = 155000;

export const MUSHROOMS_NOTICE = "Pilot: nicht fachlich geprüft. Zahlen auf dieser Seite werden aus dem Atlas gezählt oder nennen ihre Quelle; alle Texte sind Lehrbuchwissen und Allgemeinwissen (Source pending verification). Deutungen wie „Pilznetzwerk kommuniziert“, Muster und Frequenzen stehen als Behauptung oder Hypothese mit Belegstufe. Information, keine medizinische Beratung: Bei Beschwerden oder Medikamenten bitte ärztlich oder in der Apotheke nachfragen. Wildpilze nur essen, wenn eine Pilzsachverständige oder ein Pilzsachverständiger sie bestimmt hat; viele essbare Pilze haben giftige Doppelgänger, und Fotos oder Bestimmungs-Apps ersetzen die Bestimmung nicht. Berauschende Pilze führt der Atlas nur mit Giftwarnung, ohne Anleitung.";
