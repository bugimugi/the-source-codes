/**
 * Data of the landing page "Der menschliche Körper" (src/ui/anatomy.ts), built after the user's reference picture
 * (docs/MOCKUP-NOTES.md, page 25). All statements are textbook knowledge (Source pending verification) unless they name a source;
 * the mockup's placeholder numbers ("78+ Organe", "100.000+ biochemische Prozesse") are not used. Health topics give general
 * orientation only: information, not medical advice.
 */
export interface BodySystem { id: string; title: string; sub: string; icon: string; tint: string; organs: string[]; text: string; organ?: string; layer?: "bones" | "muscles" }

export const SYSTEMS: BodySystem[] = [
  { id: "nerven", title: "Nervensystem", sub: "Steuerung & Wahrnehmung", icon: "brain", tint: "#7a6af0", organs: ["Gehirn", "Rückenmark", "Nerven"], organ: "gehirn",
    text: "Das Nervensystem nimmt Reize auf, verarbeitet sie und steuert Bewegung, Organe und Verhalten. Zentral sind Gehirn und Rückenmark, peripher die Nerven. Das Gehirn enthält rund 86 Milliarden Nervenzellen (Schätzung, Azevedo et al. 2009; Source pending verification)." },
  { id: "hormon", title: "Hormonsystem", sub: "Botenstoffe & Regulation", icon: "dropper", tint: "#f0902a", organs: ["Hirnanhangdrüse", "Schilddrüse", "Nebennieren", "Bauchspeicheldrüse"], organ: "hormone",
    text: "Hormone sind Botenstoffe, die Drüsen ins Blut abgeben. Sie regeln Stoffwechsel, Wachstum, Fortpflanzung und Stressreaktionen, meist langsamer und länger anhaltend als Nervensignale." },
  { id: "kreislauf", title: "Kreislaufsystem", sub: "Transport & Versorgung", icon: "heart", tint: "#d83a4a", organs: ["Herz", "Blutgefäße", "Blut"], organ: "herz",
    text: "Herz und Blutgefäße transportieren Blut mit Sauerstoff, Nährstoffen, Hormonen und Abfallstoffen. Man unterscheidet den kleinen Kreislauf (Herz–Lunge) und den großen Kreislauf (Herz–Körper)." },
  { id: "atmung", title: "Atmungssystem", sub: "Sauerstoff & Energie", icon: "lungs", tint: "#c06ae0", organs: ["Nase", "Luftröhre", "Bronchien", "Lunge"], organ: "lunge",
    text: "Nase, Luftröhre, Bronchien und Lunge nehmen Sauerstoff auf und geben Kohlendioxid ab. Der Gasaustausch geschieht in den Lungenbläschen (Alveolen)." },
  { id: "verdauung", title: "Verdauungssystem", sub: "Nährstoffe & Stoffwechsel", icon: "gut", tint: "#e0705a", organs: ["Mund", "Speiseröhre", "Magen", "Dünndarm", "Dickdarm", "Leber"], organ: "magen",
    text: "Mund, Speiseröhre, Magen, Dünn- und Dickdarm sowie Leber, Gallenblase und Bauchspeicheldrüse zerlegen Nahrung, nehmen Nährstoffe und Wasser auf und scheiden Unverdauliches aus." },
  { id: "muskel", title: "Muskelsystem", sub: "Bewegung & Kraft", icon: "muscle", tint: "#c8402e", organs: ["Skelettmuskeln", "Herzmuskel", "Glatte Muskulatur"], layer: "muscles",
    text: "Skelettmuskeln bewegen die Knochen, der Herzmuskel pumpt Blut, glatte Muskulatur arbeitet in Organen und Gefäßen. Der Mensch hat über 600 Skelettmuskeln (Größenordnung). Im 3D-Körper kannst du eine Auswahl davon sehen." },
  { id: "skelett", title: "Skelettsystem", sub: "Stabilität & Schutz", icon: "bone", tint: "#d8d0c0", organs: ["Knochen", "Gelenke", "Bänder", "Knorpel"], layer: "bones",
    text: "Das Skelett stützt den Körper, schützt Organe, bildet mit den Muskeln den Bewegungsapparat und speichert Mineralien. Erwachsene haben 206 Knochen. Im 3D-Körper kannst du das Skelett drehen und anklicken." },
  { id: "immun", title: "Immunsystem", sub: "Abwehr & Heilung", icon: "shield", tint: "#8a50e8", organs: ["Weiße Blutkörperchen", "Knochenmark", "Thymus", "Milz"], organ: "immunsystem",
    text: "Das Immunsystem erkennt und bekämpft Krankheitserreger und körperfremde Stoffe. Beteiligt sind weiße Blutkörperchen, Knochenmark, Thymus, Milz und Lymphknoten." },
  { id: "harn", title: "Harnsystem", sub: "Ausscheidung & Balance", icon: "kidney", tint: "#e07a5a", organs: ["Nieren", "Harnleiter", "Harnblase", "Harnröhre"], organ: "nieren",
    text: "Die Nieren filtern das Blut, regeln Wasser- und Salzhaushalt und scheiden Stoffwechselendprodukte mit dem Urin aus. Harnleiter, Blase und Harnröhre leiten ihn ab." },
  { id: "fortpflanzung", title: "Fortpflanzungssystem", sub: "Reproduktion & Hormone", icon: "family", tint: "#e0507a", organs: ["Keimdrüsen", "Geschlechtsorgane"],
    text: "Die Geschlechtsorgane ermöglichen die Fortpflanzung und bilden Geschlechtshormone. Bau und Funktion unterscheiden sich bei Frau und Mann; eine ausführliche Seite dazu gibt es noch nicht." },
  { id: "lymph", title: "Lymphatisches System", sub: "Abwehr & Flüssigkeitshaushalt", icon: "drop", tint: "#3fbf7a", organs: ["Lymphgefäße", "Lymphknoten", "Milz"], organ: "immunsystem",
    text: "Lymphgefäße und Lymphknoten leiten Gewebeflüssigkeit zurück ins Blut und filtern sie; sie gehören zur Abwehr. Viele Lehrbücher fassen Lymph- und Immunsystem zusammen; dann zählt man 11 statt 12 Organsysteme." },
  { id: "haut", title: "Hautsystem", sub: "Schutz & Sinneswahrnehmung", icon: "layers", tint: "#e0a070", organs: ["Haut", "Haare", "Nägel", "Drüsen"], organ: "haut",
    text: "Die Haut ist das größte Organ: Schutzhülle gegen Umwelt und Erreger, Sinnesorgan für Berührung, Temperatur und Schmerz und Teil der Temperaturregulation." },
];
export const SYSTEMS_NOTE = "Je nach Lehrbuch zählt man 11 oder 12 Organsysteme: Immun- und Lymphsystem werden oft zusammengefasst. Die Vorlage nannte „11“ und zeigte zwölf Karten.";

export const NAV: { id: string; label: string; to: string; icon: string }[] = [
  { id: "systeme", label: "Organsysteme", to: "an-sys", icon: "overview" }, { id: "organe", label: "Organe", to: "an-3d", icon: "heart" }, { id: "zellen", label: "Gewebe & Zellen", to: "an-chain", icon: "cell" },
  { id: "funktionen", label: "Funktionen", to: "an-func", icon: "balance" }, { id: "gesundheit", label: "Gesundheit", to: "an-health", icon: "shield" }, { id: "ernaehrung", label: "Ernährung", to: "nutrients", icon: "leaf" },
  { id: "geist", label: "Körper & Geist", to: "breath", icon: "brain" }, { id: "entwicklung", label: "Entwicklung", to: "an-life", icon: "sprout" }, { id: "medizin", label: "Alte Medizin", to: "cultures", icon: "scroll" }, { id: "forschung", label: "Forschung", to: "an-science", icon: "microscope" },
];

/** facts under an organ in the detail panel (textbook values, rounded) */
export const ORGAN_FACTS: Record<string, { title: string; lead?: string; stats: [string, string][] }> = {
  herz: { title: "Herz – das Kraftzentrum", lead: "Das Herz pumpt täglich etwa 7.000 Liter Blut durch den Körper und versorgt alle Organe mit Sauerstoff und Nährstoffen.",
    stats: [["ca. 100.000", "Schläge pro Tag"], ["ca. 7.000 L", "Blut pro Tag"], ["4", "Herzräume (2 Vorhöfe, 2 Kammern)"], ["Eigener", "elektrischer Impuls (Sinusknoten)"]] },
  gehirn: { title: "Gehirn – die Steuerzentrale", stats: [["ca. 1,4 kg", "Gewicht beim Erwachsenen"], ["ca. 86 Mrd.", "Nervenzellen (Schätzung)"], ["ca. 20 %", "des Ruheenergieumsatzes"]] },
  lunge: { title: "Lunge – der Gasaustausch", stats: [["12–20", "Atemzüge pro Minute in Ruhe"], ["ca. 300–500 Mio.", "Lungenbläschen"], ["2", "Lungenflügel"]] },
  leber: { title: "Leber – das Stoffwechselorgan", stats: [["ca. 1,5 kg", "Gewicht"], ["ca. 1,5 L", "Blut pro Minute"], ["Größte", "Drüse des Körpers"]] },
  magen: { title: "Magen – Sammelbecken der Nahrung", stats: [["ca. 1–1,5 L", "Fassungsvermögen"], ["pH 1–3", "Magensaft (sauer)"]] },
  nieren: { title: "Nieren – die Filter", stats: [["2", "Nieren"], ["ca. 1 Mio.", "Nephrone je Niere"], ["ca. 180 L", "Primärharn pro Tag, davon 1–2 L Urin"]] },
};

/** the topics of the heart panel (the mockup's seven list entries) */
export const HEART_TOPICS: { id: string; title: string; icon: string; text: string }[] = [
  { id: "ansicht", title: "3D-Ansicht", icon: "cell", text: "Das Bild zeigt das Herz vergrößert. Das 3D-Modell des Körpers enthält bisher nur Knochen und Muskeln (BodyParts3D); ein freies Modell für Herz und Organe liegt nicht vor." },
  { id: "aufbau", title: "Aufbau", icon: "layers", text: "Das Herz ist etwa faustgroß und wiegt beim Erwachsenen rund 250–350 g. Es hat vier Räume: zwei Vorhöfe und zwei Kammern, getrennt durch vier Herzklappen. Die Wand besteht aus Endokard, Herzmuskel (Myokard) und Epikard." },
  { id: "funktion", title: "Funktion", icon: "bolt", text: "Das rechte Herz pumpt sauerstoffarmes Blut zur Lunge (kleiner Kreislauf), das linke Herz sauerstoffreiches Blut in den Körper (großer Kreislauf). In Ruhe schlägt es etwa 60–80 Mal pro Minute und fördert rund 5 Liter pro Minute." },
  { id: "blutfluss", title: "Blutfluss", icon: "drop", text: "Körper → Hohlvenen → rechter Vorhof → rechte Kammer → Lungenarterie → Lunge → Lungenvenen → linker Vorhof → linke Kammer → Aorta → Körper. Die Herzklappen sorgen dafür, dass das Blut nur in eine Richtung fließt." },
  { id: "zellen", title: "Zellstruktur", icon: "cell", text: "Herzmuskelzellen (Kardiomyozyten) sind verzweigt und über Glanzstreifen elektrisch gekoppelt; sie enthalten sehr viele Mitochondrien. Schrittmacherzellen im Sinusknoten erzeugen den Taktgeber-Impuls." },
  { id: "krank", title: "Krankheiten", icon: "stress", text: "Herz-Kreislauf-Erkrankungen gehören weltweit zu den häufigsten Todesursachen, z. B. koronare Herzkrankheit, Herzinfarkt, Herzinsuffizienz und Rhythmusstörungen. Bei Verdacht auf Herzinfarkt (starker Druck oder Schmerz in der Brust, Atemnot, kalter Schweiß) sofort den Notruf 112 wählen." },
  { id: "forschung", title: "Forschung", icon: "microscope", text: "Forschungsfelder sind u. a. die Regeneration von Herzmuskelgewebe, Stammzell- und Gentherapien, Herzunterstützungssysteme und die Früherkennung per Bildgebung und Biomarkern (Überblick, Source pending verification)." },
];

export const CHAIN: { id: string; title: string; text: string; link?: { label: string; act: "element" | "cells" } }[] = [
  { id: "atome", title: "Atomare Bausteine", text: "Atome sind die kleinsten Bausteine der Materie. Im Körper sind vor allem Sauerstoff, Kohlenstoff, Wasserstoff und Stickstoff häufig.", link: { label: "Wasserstoff ansehen", act: "element" } },
  { id: "molekuele", title: "Moleküle", text: "Atome verbinden sich zu Molekülen wie Wasser, Zucker, Fetten, Proteinen und DNA." },
  { id: "zellen", title: "Zellen", text: "Die Zelle ist die kleinste lebende Einheit mit eigenem Stoffwechsel. Der Körper besteht aus vielen verschiedenen Zelltypen.", link: { label: "Zellen im Detail", act: "cells" } },
  { id: "gewebe", title: "Gewebe", text: "Gleichartige Zellen bilden Gewebe. Man unterscheidet vier Grundgewebe: Epithel-, Binde- und Stützgewebe, Muskelgewebe und Nervengewebe." },
  { id: "organe", title: "Organe", text: "Mehrere Gewebe bilden ein Organ mit einer bestimmten Aufgabe, zum Beispiel den Magen: Schleimhaut, Muskelschicht, Bindegewebe und Nerven." },
  { id: "organsysteme", title: "Organsysteme", text: "Organe arbeiten in Organsystemen zusammen, etwa die Lunge im Atmungssystem oder der Magen im Verdauungssystem." },
  { id: "koerper", title: "Menschlicher Körper", text: "Alle Organsysteme zusammen bilden den Organismus. Blut, Nerven und Hormone verbinden sie und halten das innere Gleichgewicht." },
];

export const CELLS = {
  text: "Schätzungen der Zahl menschlicher Zellen liegen bei etwa 30 bis 37 Billionen (Sender et al. 2016: rund 30; Bianconi et al. 2013: 37,2). Jede Zelle erfüllt spezialisierte Aufgaben und kommuniziert ständig mit ihrer Umgebung.",
  claim: "koerper-zellzahl",
  items: [
    { id: "typen", title: "Zelltypen", icon: "cell", text: "Es gibt mehr als 200 verschiedene Zelltypen, z. B. Nerven-, Muskel-, Blut-, Haut- und Drüsenzellen. Alle gehen aus derselben befruchteten Eizelle hervor und unterscheiden sich darin, welche Gene aktiv sind." },
    { id: "teilung", title: "Zellteilung", icon: "dna", text: "Körperzellen teilen sich durch Mitose in zwei gleiche Tochterzellen, Keimzellen entstehen durch Meiose. Manche Zellen, etwa rote Blutkörperchen und Darmzellen, werden ständig neu gebildet, andere (viele Nervenzellen) kaum." },
    { id: "kommunikation", title: "Zellkommunikation", icon: "link", text: "Zellen tauschen Signale über Botenstoffe und Rezeptoren aus und sind teils direkt über Kanäle (Gap Junctions) verbunden. So stimmen sie Wachstum, Stoffwechsel und Abwehr aufeinander ab." },
    { id: "stoffwechsel", title: "Zellstoffwechsel", icon: "flame", text: "In den Mitochondrien wird aus Nährstoffen und Sauerstoff der Energieträger ATP gebildet. Alle Aufbau- und Abbauvorgänge der Zelle zusammen heißen Stoffwechsel." },
  ],
};

export const LIFE: { id: string; title: string; sub: string; text: string }[] = [
  { id: "embryo", title: "Embryo", sub: "0–9 Monate (vor der Geburt)", text: "Aus der befruchteten Eizelle entstehen in den ersten acht Wochen die Organanlagen (Embryo), danach wachsen und reifen die Organe (Fötus). Die Schwangerschaft dauert rund neun Monate." },
  { id: "kindheit", title: "Kindheit", sub: "0–12 Jahre", text: "Schnelles Wachstum, Entwicklung von Bewegung, Sprache und Immunsystem; das Gehirn bildet in dieser Zeit besonders viele Verbindungen." },
  { id: "jugend", title: "Jugend", sub: "12–25 Jahre", text: "Die Pubertät bringt hormonelle Veränderungen und einen Wachstumsschub. Das Gehirn reift bis ins junge Erwachsenenalter weiter. Die Altersgrenzen sind Konvention." },
  { id: "erwachsen", title: "Erwachsensein", sub: "25–65 Jahre", text: "Der Körper ist ausgewachsen. Ab etwa 30 Jahren nehmen Muskel- und Knochenmasse langsam ab, bei geringer Bewegung schneller." },
  { id: "alter", title: "Älteres Alter", sub: "65+ Jahre", text: "Regeneration und Abwehr verlangsamen sich, das Risiko für chronische Erkrankungen steigt. Bewegung, Ernährung und Vorsorge hängen mit gesundem Altern zusammen." },
];

export const FUNCTIONS: { id: string; title: string; sub: string; icon: string; text: string; claim?: string }[] = [
  { id: "stoffwechsel", title: "Stoffwechsel", sub: "Energiegewinnung", icon: "flame", text: "Der Körper wandelt Nährstoffe in Energie und Baustoffe um. Der Grundumsatz ist die Energie, die er in Ruhe für Atmung, Herzschlag und Wärme braucht." },
  { id: "hormone", title: "Hormonregulation", sub: "Gleichgewicht", icon: "dropper", text: "Hormone halten Blutzucker, Salzhaushalt, Wachstum und viele andere Größen im Gleichgewicht, meist über Regelkreise mit Rückkopplung." },
  { id: "regeneration", title: "Regeneration", sub: "Heilung & Erneuerung", icon: "sprout", text: "Haut, Darmschleimhaut und Blut erneuern sich ständig, Wunden heilen durch Zellteilung und Narbenbildung. Das Gehirn und das Herz erneuern sich kaum." },
  { id: "wachstum", title: "Wachstum", sub: "Zellteilung", icon: "tree", text: "Wachstum beruht auf Zellteilung und Zellvergrößerung, gesteuert durch Wachstumshormon, Schilddrüsenhormone und Geschlechtshormone." },
  { id: "temperatur", title: "Temperaturregulation", sub: "Konstante Temperatur", icon: "thermo", text: "Der Körper hält seine Kerntemperatur bei rund 37 °C: Schwitzen und weite Gefäße kühlen, Zittern und enge Gefäße wärmen. Das Steuerzentrum liegt im Hypothalamus." },
  { id: "entgiftung", title: "Entgiftung", sub: "Ausscheidung", icon: "kidney", claim: "koerper-detox", text: "Leber und Nieren bauen Fremd- und Abfallstoffe ab und scheiden sie aus; das läuft dauerhaft und von selbst. Für „Detox“-Kuren, die darüber hinaus „entgiften“, ist keine überzeugende Evidenz bekannt (Aussage mit Belegstufe)." },
  { id: "sinne", title: "Sinneswahrnehmung", sub: "Verarbeitung", icon: "nose", text: "Sinnesorgane wandeln Reize (Licht, Schall, Duft, Druck) in Nervensignale um, die das Gehirn zu Wahrnehmungen verarbeitet." },
  { id: "homoeostase", title: "Homöostase", sub: "Innere Balance", icon: "balance", text: "Homöostase ist das Halten des inneren Milieus (Temperatur, pH-Wert, Blutzucker, Wasser) in engen Grenzen durch Regelkreise." },
];

export const HEALTH: { id: string; title: string; icon: string; tint: string; text: string; link?: { label: string; act: "nutrients" | "breath" | "organ"; organ?: string } }[] = [
  { id: "ernaehrung", title: "Ernährung", icon: "leaf", tint: "#5aa04a", text: "Der Körper braucht Energie, Eiweiß, Fette, Kohlenhydrate, Vitamine, Mineralstoffe und Wasser. Eine abwechslungsreiche Ernährung mit viel Gemüse, Obst und Vollkorn gilt in den Empfehlungen der Fachgesellschaften als Grundlage (Source pending verification).", link: { label: "Nährstoffe ansehen", act: "nutrients" } },
  { id: "bewegung", title: "Bewegung", icon: "muscle", tint: "#4a8ad0", text: "Die Weltgesundheitsorganisation empfiehlt Erwachsenen mindestens 150 bis 300 Minuten mäßig intensive Bewegung pro Woche (Leitlinie 2020; Source pending verification)." },
  { id: "schlaf", title: "Schlaf", icon: "moon", tint: "#7a6af0", text: "Als Richtwert für Erwachsene werden meist sieben bis neun Stunden Schlaf genannt. Im Schlaf laufen Erholung, Gedächtnisbildung und Hormonregulation ab (Source pending verification)." },
  { id: "stress", title: "Stressmanagement", icon: "stress", tint: "#e0a030", text: "Anhaltender Stress belastet Herz-Kreislauf-System und Psyche. Pausen, Bewegung und Atemübungen werden häufig genutzt; wie gut ihre Wirkung belegt ist, unterscheidet sich je nach Methode.", link: { label: "Atem-Seite öffnen", act: "breath" } },
  { id: "immun", title: "Immunsystem", icon: "shield", tint: "#8a50e8", text: "Impfungen, Schlaf, Bewegung und eine ausgewogene Ernährung hängen mit einer funktionierenden Abwehr zusammen. Bei häufigen oder schweren Infekten gehört die Abklärung zur Ärztin oder zum Arzt.", link: { label: "Im Körper-Atlas", act: "organ", organ: "immunsystem" } },
  { id: "darm", title: "Darmgesundheit", icon: "gut", tint: "#e0705a", text: "Im Darm leben Billionen Mikroorganismen (Mikrobiom). Eine ballaststoffreiche Ernährung wird mit einer vielfältigen Darmflora in Verbindung gebracht; die Forschung dazu ist im Fluss.", link: { label: "Im Körper-Atlas", act: "organ", organ: "darm" } },
  { id: "mental", title: "Mentale Gesundheit", icon: "brain", tint: "#5aa8c8", text: "Psychische Gesundheit gehört zur Gesundheit. Bei anhaltender Niedergeschlagenheit, Angst oder in einer Krise hilft ärztliche oder psychotherapeutische Unterstützung; die Telefonseelsorge in Deutschland ist rund um die Uhr kostenlos erreichbar (0800 111 0 111 oder 0800 111 0 222; Source pending verification)." },
  { id: "langlebigkeit", title: "Langlebigkeit", icon: "clock", tint: "#c8a040", text: "Wie lange und wie gesund man lebt, hängt von Genen, Lebensstil, Umwelt und medizinischer Versorgung ab. Die Altersforschung beschreibt „Kennzeichen des Alterns“ (López-Otín et al. 2013). Konkrete Anti-Aging-Versprechen sind meist nicht belegt." },
];

export const SCIENCE: { id: string; title: string; sub: string; icon: string; text: string; source: { author: string; year: string; title: string; venue: string; url?: string } }[] = [
  { id: "neuro", title: "Neurowissenschaft", sub: "Gehirn & Bewusstsein", icon: "brain", text: "Die Zählung der Zellen im Gehirn ergab rund 86 Milliarden Nervenzellen und etwa ebenso viele Nicht-Nervenzellen, ein skaliertes Primatengehirn. Wie Bewusstsein entsteht, ist weiterhin offen.", source: { author: "Azevedo et al.", year: "2009", title: "Equal numbers of neuronal and nonneuronal cells make the human brain an isometrically scaled-up primate brain", venue: "Journal of Comparative Neurology (Suchauszug, Source pending verification)" } },
  { id: "genetik", title: "Genetik", sub: "DNA & Vererbung", icon: "dna", text: "2022 wurde die erste lückenlose Sequenz eines menschlichen Genoms veröffentlicht (rund 3,05 Milliarden Basenpaare) und schloss Lücken, die frühere Referenzen offenließen.", source: { author: "Nurk et al. (T2T-Konsortium)", year: "2022", title: "The complete sequence of a human genome", venue: "Science 376, 44–53", url: "https://doi.org/10.1126/science.abj6987" } },
  { id: "mikrobiom", title: "Mikrobiom", sub: "Darm & Gesundheit", icon: "gut", text: "Das Human Microbiome Project beschrieb, welche Mikroorganismen gesunde Menschen an verschiedenen Körperstellen tragen und wie unterschiedlich sie zusammengesetzt sind.", source: { author: "Human Microbiome Project Consortium", year: "2012", title: "Structure, function and diversity of the healthy human microbiome", venue: "Nature 486, 207–214", url: "https://pubmed.ncbi.nlm.nih.gov/22699609/" } },
  { id: "regeneration", title: "Regenerative Medizin", sub: "Heilung & Zukunft", icon: "sprout", text: "Takahashi und Yamanaka zeigten, dass sich ausgereifte Körperzellen mit vier Faktoren in Stammzellen zurückprogrammieren lassen (iPS-Zellen). Daraus folgten Zellmodelle und Ansätze für Zelltherapien.", source: { author: "Takahashi & Yamanaka", year: "2006", title: "Induction of pluripotent stem cells from mouse embryonic and adult fibroblast cultures by defined factors", venue: "Cell 126, 663–676 (Suchauszug, Source pending verification)" } },
  { id: "langlebigkeit", title: "Langlebigkeitsforschung", sub: "Gesundes Altern", icon: "clock", text: "Ein viel zitierter Überblick ordnet neun „Kennzeichen des Alterns“ (z. B. Telomerverkürzung, Zellalterung, Stammzellerschöpfung). Ob und wie sich das Altern des Menschen gezielt verlangsamen lässt, ist offen.", source: { author: "López-Otín et al.", year: "2013", title: "The hallmarks of aging", venue: "Cell 153, 1194–1217", url: "https://pmc.ncbi.nlm.nih.gov/articles/3836174" } },
];

export const LINKS: { id: string; title: string; sub: string; icon: string; act: "nutrients" | "plants" | "minerals" | "fx" }[] = [
  { id: "naehrstoffe", title: "Nährstoffe", sub: "Ernährung", icon: "leaf", act: "nutrients" },
  { id: "pflanzen", title: "Heilpflanzen", sub: "Überlieferung & Inhaltsstoffe", icon: "sprout", act: "plants" },
  { id: "mineralien", title: "Mineralien", sub: "Spurenelemente", icon: "hex", act: "minerals" },
  { id: "frequenzen", title: "Frequenzen", sub: "Klang & Schwingung", icon: "sound", act: "fx" },
];

export const QUOTE = "Körper, Geist und Natur sind keine getrennten Systeme – sie sind Teil eines Ganzen.";
export const HERO_QUOTE = "Ein Meisterwerk der Natur.";
export const MODEL_NOTE = "Knochen, Bänder und Muskeln sind ein echtes 3D-Modell (BodyParts3D, CC BY 4.0); die Organe zeigt das Anatomie-Bild. Nerven und Gefäße gibt es bisher nicht, weil dafür kein frei lizenziertes Modell vorliegt.";
export const ANATOMY_NOTICE = "Pilot: nicht fachlich geprüft. Die Texte sind allgemeines Lehrbuchwissen (Source pending verification), Zahlen sind gerundete Richtwerte oder Schätzungen. Information, keine medizinische Beratung: Bei Beschwerden oder Notfällen (Notruf 112) ärztliche Hilfe suchen. Die deutschen Namen der 3D-Teile sind Lehrbuch-Nomenklatur und noch nicht von Fachleuten geprüft.";
