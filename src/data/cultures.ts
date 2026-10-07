import type { SlotName } from "../assets/registry";
import type { EvidenceLevel } from "./types";

/**
 * "Alte Kulturen": one dossier ("Akte") per station of the time journey.
 *
 * Everything here is written for the pilot and NOT yet reviewed by experts. Dates and numbers are rounded and follow the
 * common scholarly dating; sources are "Source pending verification" until an expert (archaeologist, Assyriologist,
 * Egyptologist …) has checked the dossier. The four kinds of blocks are kept apart on purpose:
 *   fund / wissen  – what excavations and texts document            -> label "Dokumentiert"
 *   glaube         – what the cultures believed (their own lore)    -> label "Überlieferung"
 *   raetsel        – what is open or unexplained                    -> label "Offene Frage"
 *   claims         – popular or fringe statements, each with a level from the library's scale and the counter-evidence
 */
export type Theme = "architektur" | "technologie" | "spiritualitaet" | "astronomie" | "gesellschaft" | "artefakte" | "mythen" | "verborgenes";

export const THEMES: { id: Theme; label: string; slot: SlotName }[] = [
  { id: "architektur", label: "Architektur", slot: "cult-theme-architektur" },
  { id: "technologie", label: "Technologie", slot: "cult-theme-technologie" },
  { id: "spiritualitaet", label: "Spiritualität", slot: "cult-theme-spiritualitaet" },
  { id: "astronomie", label: "Astronomie", slot: "cult-theme-astronomie" },
  { id: "gesellschaft", label: "Gesellschaft", slot: "cult-theme-gesellschaft" },
  { id: "artefakte", label: "Artefakte", slot: "cult-theme-artefakte" },
  { id: "mythen", label: "Mythen", slot: "cult-theme-mythen" },
  { id: "verborgenes", label: "Verborgenes Wissen", slot: "cult-theme-verborgenes" },
];

export type BlockKind = "fund" | "wissen" | "glaube" | "raetsel";
export const KIND_TAG: Record<BlockKind, string> = { fund: "Dokumentiert", wissen: "Dokumentiert", glaube: "Überlieferung", raetsel: "Offene Frage" };
export const KIND_SECTION: Record<BlockKind, string> = { fund: "Fundlage", wissen: "Technologie & Wissen", glaube: "Glaube & Spiritualität", raetsel: "Rätsel" };

export interface Block { kind: BlockKind; title: string; text: string; themes: Theme[] }
export interface FringeClaim { text: string; level: Extract<EvidenceLevel, "claimed" | "hypothesis" | "unsupported" | "refuted">; counter: string }
export interface Dossier {
  id: string;
  nr: string;
  name: string;
  period: string;
  region: string;
  tagline: string;
  tags: string[];
  slot: SlotName;
  blocks: Block[];
  claims: FringeClaim[];
}

export const DOSSIERS: Dossier[] = [
  {
    id: "goebekli-tepe", nr: "01", name: "Göbekli Tepe", period: "ab ca. 9600 v. Chr.", region: "Südostanatolien, Türkei",
    tagline: "Ein Heiligtum vor der Landwirtschaft?", tags: ["Ursprung", "Heiligtum", "Astronomie", "Symbolik", "Rätsel"], slot: "cult-01",
    blocks: [
      { kind: "fund", title: "Steinkreise auf dem Hügel", text: "Auf einem Hügel bei Şanlıurfa liegen Steinkreise mit T-förmigen Kalksteinpfeilern, die größten etwa fünf bis sechs Meter hoch und viele Tonnen schwer. Die Ausgrabungen begannen in den 1990er-Jahren unter Klaus Schmidt (Deutsches Archäologisches Institut). Nach gängiger Datierung entstanden die ältesten Anlagen um 9600 v. Chr.", themes: ["architektur", "artefakte"] },
      { kind: "fund", title: "Tiere in Stein", text: "Auf vielen Pfeilern sind Tiere eingemeißelt: Füchse, Schlangen, Eber, Geier, Skorpione. Einige Pfeiler tragen Arme und Hände und wirken wie stilisierte Gestalten.", themes: ["artefakte", "mythen"] },
      { kind: "wissen", title: "Wer baute es?", text: "Die Erbauer waren Jäger und Sammler. Es gibt keine Hinweise auf Keramik oder Metallwerkzeuge; bearbeitet wurde mit Feuerstein. Dass eine so große Gemeinschaftsleistung vor dem Ackerbau möglich war, verändert das Bild vom Beginn der Zivilisation.", themes: ["gesellschaft", "technologie"] },
      { kind: "glaube", title: "Ein Ort des Rituals?", text: "Viele Fachleute halten die Anlage für einen Kultplatz: für Zusammenkünfte, Feste oder Totenkult. Sicher ist das nicht, denn schriftliche Zeugnisse aus dieser Zeit gibt es nicht.", themes: ["spiritualitaet"] },
      { kind: "raetsel", title: "Warum wurde es zugeschüttet?", text: "Die Anlagen wurden später bewusst mit Schutt und Erde aufgefüllt. Der Grund ist unbekannt.", themes: ["verborgenes"] },
      { kind: "raetsel", title: "Was bedeuten die Zeichen?", text: "Die Symbole auf den Pfeilern wurden nicht entziffert. Ob sie eine Botschaft tragen oder nur Bilder sind, ist offen.", themes: ["verborgenes", "artefakte"] },
    ],
    claims: [
      { text: "Pfeiler 43 zeige eine Sternenkarte und halte einen Kometeneinschlag am Beginn der Jüngeren Dryaszeit fest.", level: "hypothesis", counter: "Die Deutung wurde 2017 veröffentlicht und wird von vielen Archäologen und Astronomen kritisch gesehen; die Tiere können auch andere Bedeutungen haben. Eine Einigung gibt es nicht." },
      { text: "Göbekli Tepe sei das Werk einer untergegangenen Hochkultur oder von Außerirdischen.", level: "unsupported", counter: "Es gibt keine Funde, die über Jäger-und-Sammler-Technik hinausweisen. Im Steinbruch der Anlage wurden unfertige Pfeiler dokumentiert, die zeigen, wie die Steine herausgearbeitet wurden." },
    ],
  },
  {
    id: "fruehe-kulturen", nr: "02", name: "Ältere Kulturen", period: "ca. 8000 – 2000 v. Chr.", region: "Naher Osten, Malta, Irland, England",
    tagline: "Steine, Siedlungen, Sternenlicht", tags: ["Frühe Siedlungen", "Megastrukturen", "Himmelsausrichtung"], slot: "cult-02",
    blocks: [
      { kind: "fund", title: "Jericho", text: "Eine der ältesten bekannten Siedlungen. In der Jungsteinzeit (rund 8000 v. Chr.) stand dort eine Mauer mit einem steinernen Turm.", themes: ["architektur", "gesellschaft"] },
      { kind: "fund", title: "Çatalhöyük", text: "In der Siedlung in Anatolien (ab rund 7400 v. Chr.) standen die Lehmziegelhäuser dicht an dicht und wurden über das Dach betreten. Wandmalereien und Skulpturen zeigen Tiere und Figuren.", themes: ["architektur", "artefakte"] },
      { kind: "fund", title: "Maltas Tempel", text: "Die Megalithtempel auf Malta, etwa Ġgantija, entstanden um 3600 v. Chr. und zählen zu den ältesten frei stehenden Steinbauten der Welt.", themes: ["architektur"] },
      { kind: "wissen", title: "Newgrange", text: "Der Ganggrabhügel in Irland (um 3200 v. Chr.) lässt zur Wintersonnenwende Sonnenlicht durch eine Öffnung bis in die Kammer fallen. Die Ausrichtung ist vermessen und dokumentiert.", themes: ["astronomie", "architektur"] },
      { kind: "wissen", title: "Stonehenge", text: "Die Steinsetzung in England wurde über viele Jahrhunderte ausgebaut (ab rund 3000 v. Chr.). Ihre Hauptachse weist auf den Sonnenaufgang zur Sommersonnenwende und den Sonnenuntergang zur Wintersonnenwende.", themes: ["astronomie", "architektur"] },
      { kind: "glaube", title: "Ahnen und Sonne", text: "Viele dieser Bauten verbinden Totenkult und Himmelsbeobachtung. Was die Menschen glaubten, kennen wir nur aus den Bauten, nicht aus Texten.", themes: ["spiritualitaet", "astronomie"] },
      { kind: "raetsel", title: "Wie kamen die Steine nach Stonehenge?", text: "Die kleineren „Blausteine“ stammen aus Wales, mehr als 200 Kilometer entfernt. Wie sie transportiert wurden, wird diskutiert.", themes: ["technologie", "verborgenes"] },
    ],
    claims: [
      { text: "Die Megalithbauten der Welt seien Zeichen einer gemeinsamen, untergegangenen Hochkultur (zum Beispiel „Atlantis“).", level: "unsupported", counter: "Die Bauten unterscheiden sich in Zeit, Bauweise und Zweck. Für eine gemeinsame Ursprungskultur gibt es keine Funde. Platons Atlantis-Erzählung ist ein Text, keine archäologische Quelle." },
    ],
  },
  {
    id: "aegypten", nr: "03", name: "Altes Ägypten", period: "ca. 3100 – 30 v. Chr.", region: "Nordostafrika, Niltal",
    tagline: "Das Land der Pyramiden", tags: ["Pyramiden", "Technologie", "Spiritualität", "Astronomie"], slot: "cult-03",
    blocks: [
      { kind: "fund", title: "Gizeh", text: "Die Cheops-Pyramide entstand um 2560 v. Chr. unter Pharao Cheops (4. Dynastie). Sie war ursprünglich rund 146 Meter hoch und ist das einzige noch erhaltene der sieben Weltwunder der Antike.", themes: ["architektur"] },
      { kind: "fund", title: "Die Arbeiter", text: "Bei Gizeh wurden eine Arbeitersiedlung mit Bäckereien und Gräbern der Arbeiter gefunden. 2013 entdeckte man in Wadi al-Jarf Papyri, darunter das Tagebuch eines Aufsehers namens Merer. Es beschreibt den Transport von Kalkstein für die Cheops-Pyramide.", themes: ["gesellschaft", "artefakte"] },
      { kind: "wissen", title: "Bau und Werkzeug", text: "Gebaut wurde mit Kupferwerkzeugen, Holzschlitten, Seilen, Rampen und Hebeln. Wie genau die Blöcke in die Höhe kamen, ist im Detail umstritten; mehrere Rampenmodelle werden diskutiert.", themes: ["technologie", "architektur"] },
      { kind: "wissen", title: "Himmel und Richtung", text: "Die großen Pyramiden sind erstaunlich genau nach den Himmelsrichtungen ausgerichtet. Wie die Baumeister das erreichten, ist Gegenstand der Forschung.", themes: ["astronomie", "technologie"] },
      { kind: "wissen", title: "Schrift und Medizin", text: "Die Ägypter schrieben mit Hieroglyphen auf Stein und Papyrus. Medizinische Papyri wie der Papyrus Ebers (um 1550 v. Chr.) beschreiben Untersuchungen und Mittel. Welche davon wirksam waren, bewertet die Medizingeschichte unterschiedlich.", themes: ["artefakte", "gesellschaft"] },
      { kind: "glaube", title: "Tod und Wiedergeburt", text: "Zentral war der Glaube an ein Leben nach dem Tod. Die Pyramidentexte (rund 2400 v. Chr.) gehören zu den ältesten bekannten religiösen Texten der Menschheit; die Sonne (Re) spielte eine große Rolle.", themes: ["spiritualitaet", "mythen"] },
      { kind: "raetsel", title: "Der verborgene Hohlraum", text: "2017 wurde mit kosmischer Myonen-Messung ein großer Hohlraum über der Großen Galerie der Cheops-Pyramide nachgewiesen (Projekt ScanPyramids). Wozu er diente, ist unbekannt.", themes: ["verborgenes", "architektur"] },
      { kind: "raetsel", title: "Die Schächte der Königskammer", text: "Zwei schmale Schächte führen von der Königskammer schräg nach außen. Ihr Zweck ist umstritten: Lüftung, Ritual oder Ausrichtung?", themes: ["verborgenes", "astronomie"] },
    ],
    claims: [
      { text: "Die Pyramiden waren Kraftwerke oder Energiequellen.", level: "unsupported", counter: "Für eine technische Nutzung gibt es keine Funde: keine Leitungen, keine Maschinenreste. Gräber, Opferkapellen und Texte belegen die Nutzung als Grabanlagen." },
      { text: "Außerirdische oder eine verlorene Hochkultur haben die Pyramiden gebaut.", level: "unsupported", counter: "Arbeitersiedlung, Papyri, Steinbrüche und unfertige Bauten sind dokumentiert. Die Entwicklung von der Stufenpyramide des Djoser über Meidum und die Knickpyramide bis Gizeh lässt sich über Jahrhunderte nachvollziehen." },
      { text: "Die Maße der Cheops-Pyramide enthielten verschlüsseltes Wissen, etwa die Zahl π oder die Erdmaße.", level: "claimed", counter: "Solche Verhältnisse lassen sich aus Neigungswinkel und Messverfahren erklären. Zahlenspiele finden bei fast jedem großen Bauwerk Treffer; dass es Absicht war, ist nicht belegt." },
    ],
  },
  {
    id: "sumer-babylon", nr: "04", name: "Sumer & Babylon", period: "ca. 4000 – 539 v. Chr.", region: "Mesopotamien, heutiger Irak",
    tagline: "Die Städte, die Zeit und Himmel zählten", tags: ["Götter", "Keilschrift", "Astronomie", "Städte", "Anunnaki"], slot: "cult-04",
    blocks: [
      { kind: "fund", title: "Uruk", text: "Eine der frühesten Großstädte der Welt (4. Jahrtausend v. Chr.). Dort entstanden um 3300 v. Chr. die ersten Keilschrifttafeln, zunächst für Buchhaltung: Waren und Zuteilungen.", themes: ["gesellschaft", "artefakte"] },
      { kind: "fund", title: "Zikkurate", text: "Stufentempel wie der Zikkurat von Ur (um 2100 v. Chr., König Ur-Nammu) bildeten die Mittelpunkte der Städte.", themes: ["architektur", "spiritualitaet"] },
      { kind: "wissen", title: "Zählen mit 60", text: "Das Sexagesimalsystem (Basis 60) stammt aus Mesopotamien. Es lebt bis heute in 60 Minuten pro Stunde und 360 Grad im Kreis fort.", themes: ["technologie", "astronomie"] },
      { kind: "wissen", title: "Mathematik und Himmel", text: "Babylonische Tontafeln zeigen Rechenverfahren, eine genaue Näherung für die Wurzel aus 2 (Tafel YBC 7289) und jahrhundertelange Himmelsbeobachtungen. Die Tafel Plimpton 322 (um 1800 v. Chr.) enthält Zahlentripel, die an den Satz des Pythagoras erinnern; ihre Deutung ist umstritten.", themes: ["astronomie", "artefakte", "technologie"] },
      { kind: "wissen", title: "Gesetze und Literatur", text: "Der Codex Hammurabi (um 1754 v. Chr.) ist eine der ältesten umfangreichen Gesetzessammlungen. Das Gilgamesch-Epos gilt als eines der ältesten Werke der Weltliteratur. Enheduanna (um 2300 v. Chr.) ist die älteste namentlich bekannte Autorin.", themes: ["gesellschaft", "artefakte"] },
      { kind: "glaube", title: "Die Götter", text: "Die Mesopotamier verehrten Götter für Himmel, Wasser, Liebe und Krieg (Anu, Enlil, Enki, Inanna). „Anunna“, später „Anunnaki“, heißt in sumerischen Texten eine Gruppe von Göttern. Mythen wie Enuma Elisch und Atrahasis erzählen von Schöpfung und Flut.", themes: ["spiritualitaet", "mythen"] },
      { kind: "raetsel", title: "Woher kamen die Sumerer?", text: "Die sumerische Sprache ist mit keiner anderen bekannten Sprache verwandt. Woher das Volk kam und wie es sich zu seinen Nachbarn verhielt, ist umstritten.", themes: ["verborgenes", "gesellschaft"] },
    ],
    claims: [
      { text: "Die Anunnaki waren Außerirdische vom Planeten Nibiru, die den Menschen erschufen (Zecharia Sitchin, 1976).", level: "unsupported", counter: "Assyriologen weisen Sitchins Übersetzungen zurück: In den Keilschrifttexten sind die Anunnaki Götter, keine Raumfahrer. „Nibiru“ bezeichnet in babylonischen Texten einen Himmelskörper im Zusammenhang mit Marduk (meist als Jupiter gedeutet), keinen Planeten auf langer Bahn." },
      { text: "Die „Bagdad-Batterie“ (Tongefäße mit Kupferzylinder und Eisenstab) beweise, dass man in der Antike Strom nutzte.", level: "hypothesis", counter: "Die Gefäße stammen vermutlich aus parthischer Zeit. Nachbauten liefern mit Säure geringe Spannungen, aber es gibt keine Hinweise auf Leitungen, Geräte oder eine Nutzung. Viele Fachleute sehen eher Behälter für Schriftrollen." },
    ],
  },
  {
    id: "indus", nr: "05", name: "Indus-Kultur", period: "ca. 2600 – 1900 v. Chr.", region: "Pakistan und Nordwestindien",
    tagline: "Städte aus dem Raster", tags: ["Städte", "Wassertechnik", "Planung", "Symbole"], slot: "cult-05",
    blocks: [
      { kind: "fund", title: "Mohenjo-daro und Harappa", text: "In der reifen Phase entstanden Städte mit rechtwinkligem Straßenraster, gebrannten Ziegeln und Entwässerung. In Mohenjo-daro liegt das „Große Bad“.", themes: ["architektur", "technologie"] },
      { kind: "wissen", title: "Wasser und Maß", text: "Viele Häuser hatten eigene Brunnen und Bäder; Abwasser floss durch gedeckte Kanäle. Die Ziegel folgen einheitlichen Maßen, und es wurden genormte Gewichte gefunden. In Lothal gibt es ein Becken, das oft als Hafenbecken gedeutet wird.", themes: ["technologie", "gesellschaft"] },
      { kind: "glaube", title: "Siegel mit Bildern", text: "Tausende Siegel zeigen Tiere und Figuren. Was sie religiös bedeuteten, ist unklar; Deutungen wie die des sogenannten Pashupati-Siegels sind Hypothesen.", themes: ["spiritualitaet", "artefakte"] },
      { kind: "raetsel", title: "Die ungelesene Schrift", text: "Die Zeichen der Indus-Schrift sind bis heute nicht entziffert.", themes: ["verborgenes", "artefakte"] },
      { kind: "raetsel", title: "Der Niedergang", text: "Um 1900 v. Chr. verlassen die Menschen die großen Städte. Diskutiert werden Klimawandel, veränderte Flussläufe und verschobene Handelswege.", themes: ["verborgenes", "gesellschaft"] },
    ],
    claims: [
      { text: "In Mohenjo-daro habe es eine Atomexplosion gegeben; Skelette seien radioaktiv.", level: "unsupported", counter: "Es gibt keine Messungen, die das stützen. Die Funde lassen sich mit Verlassen der Stadt, Ablagerungen und späteren Störungen erklären. Die Behauptung kursiert vor allem in Internet-Texten." },
    ],
  },
  {
    id: "china", nr: "06", name: "China", period: "ab ca. 1600 v. Chr.", region: "China",
    tagline: "Das Reich der Erfinder", tags: ["Bronze", "Schrift", "Erfindungen", "Dao"], slot: "cult-06",
    blocks: [
      { kind: "fund", title: "Die Shang-Zeit", text: "Aus der Shang-Zeit stammen Bronzegefäße von großer Gusskunst und Orakelknochen mit den ältesten bekannten chinesischen Schriftzeichen (rund 1200 v. Chr.).", themes: ["artefakte", "technologie"] },
      { kind: "fund", title: "Die Terrakotta-Armee", text: "Das Grab des ersten Kaisers Qin Shihuangdi (um 210 v. Chr.) enthält tausende lebensgroße Tonkrieger, deren Gesichter sich unterscheiden.", themes: ["artefakte", "gesellschaft"] },
      { kind: "wissen", title: "Erfindungen", text: "Aus China stammen nach Funden und Überlieferung unter anderem Papier, Buchdruck, Schießpulver und der Kompass; die Anfänge sind teils umstritten. Zhang Heng baute 132 n. Chr. ein Gerät, das Erdbeben anzeigen sollte (Seismoskop).", themes: ["technologie", "artefakte"] },
      { kind: "wissen", title: "Himmel und Kalender", text: "Chinesische Astronomen hielten Sonnenfinsternisse, Kometen und neue Sterne über Jahrhunderte schriftlich fest. Die Aufzeichnungen sind bis heute für die Forschung wertvoll.", themes: ["astronomie"] },
      { kind: "glaube", title: "Dao, Yin und Yang", text: "Im Daoismus und in der Naturphilosophie beschreiben Yin und Yang gegensätzliche, einander ergänzende Kräfte; „Qi“ steht für Lebensenergie. Das I Ging, ein Orakel- und Weisheitsbuch, ist mehr als 2000 Jahre alt.", themes: ["spiritualitaet", "mythen"] },
      { kind: "raetsel", title: "Das Grab des Kaisers", text: "Das Hauptgrab von Qin Shihuangdi wurde nicht geöffnet. Bodenmessungen fanden erhöhte Quecksilberwerte, was alten Beschreibungen von „Flüssen aus Quecksilber“ entspricht.", themes: ["verborgenes"] },
    ],
    claims: [
      { text: "Qi und Meridiane seien physikalisch messbare Energiebahnen im Körper.", level: "claimed", counter: "Für Meridiane wurde kein eigener anatomischer Aufbau nachgewiesen; Studien zur Akupunktur zeigen gemischte Ergebnisse. Als Konzept der Überlieferung ist es historisch gut belegt." },
    ],
  },
  {
    id: "mesoamerika", nr: "07", name: "Mesoamerika", period: "ca. 1500 v. Chr. – 1521 n. Chr.", region: "Mexiko und Mittelamerika",
    tagline: "Kalender, Sterne, Pyramiden", tags: ["Pyramiden", "Kalender", "Astronomie", "Götter"], slot: "cult-07",
    blocks: [
      { kind: "fund", title: "Olmeken, Maya, Azteken", text: "Ab rund 1500 v. Chr. entwickelten sich frühe Kulturen wie die Olmeken (bekannt für kolossale Steinköpfe), später Teotihuacán, die Maya-Stadtstaaten und das Reich der Azteken mit der Hauptstadt Tenochtitlan (gefallen 1521 n. Chr.).", themes: ["architektur", "artefakte"] },
      { kind: "wissen", title: "Die Kalender", text: "Die Maya führten mehrere Kalender gleichzeitig: den 260-Tage-Kalender (Tzolk’in), das 365-Tage-Jahr (Haab’) und die „Lange Zählung“ für große Zeiträume.", themes: ["astronomie", "technologie"] },
      { kind: "wissen", title: "Null und Venus", text: "Die Maya nutzten die Null als Zahlzeichen und beobachteten die Venus genau. Der Dresdner Codex enthält Venustafeln.", themes: ["astronomie", "technologie", "artefakte"] },
      { kind: "wissen", title: "Der Schatten der Schlange", text: "An der Pyramide des Kukulcán in Chichén Itzá entsteht zur Tagundnachtgleiche ein Schattenspiel, das an eine Schlange erinnert. Ob das Absicht war, ist umstritten.", themes: ["architektur", "astronomie"] },
      { kind: "glaube", title: "Götter, Zeit und Opfer", text: "Die Religion verband Kalender, Götter und Rituale. Menschenopfer sind für mehrere Kulturen dokumentiert. Der Popol Vuh der K’iche’-Maya erzählt von Schöpfung und Zwillingshelden.", themes: ["spiritualitaet", "mythen"] },
      { kind: "raetsel", title: "Der Zusammenbruch", text: "Um 800 bis 900 n. Chr. wurden viele Städte der klassischen Maya-Zeit verlassen. Diskutiert werden Dürren, Kriege und Übernutzung der Umwelt.", themes: ["verborgenes", "gesellschaft"] },
    ],
    claims: [
      { text: "Der Maya-Kalender sagte das Ende der Welt für den 21. Dezember 2012 voraus.", level: "refuted", counter: "An diesem Tag endete lediglich ein Zyklus der Langen Zählung. Kein bekannter Maya-Text sagt für dieses Datum ein Weltende voraus, und am Tag selbst geschah nichts." },
    ],
  },
  {
    id: "weitere", nr: "08", name: "Weitere Zivilisationen", period: "ca. 800 v. Chr. – 1533 n. Chr.", region: "Eurasien und Amerika",
    tagline: "Felsstädte, Rädergetriebe und Knotenschrift", tags: ["Petra", "Griechenland", "Rom", "Persien", "Kelten", "Wikinger", "Inka"], slot: "cult-08",
    blocks: [
      { kind: "fund", title: "Petra", text: "Die Hauptstadt der Nabatäer in Jordanien wurde in Sandstein gehauen. Mit Zisternen, Kanälen und Dämmen sammelten die Nabatäer Wasser in der Wüste; Handelswege für Weihrauch und Gewürze führten durch die Stadt.", themes: ["architektur", "technologie"] },
      { kind: "fund", title: "Der Antikythera-Mechanismus", text: "Das Gerät wurde um 100 v. Chr. gebaut und 1901 in einem Schiffswrack gefunden. Ein Getriebe aus Bronzerädern berechnete Mond-, Sonnen- und Kalenderzyklen.", themes: ["technologie", "artefakte", "astronomie"] },
      { kind: "wissen", title: "Rom und Persien", text: "Römische Ingenieure bauten Aquädukte, Straßen und Betonkuppeln wie das Pantheon. Die Perser legten Qanate an, unterirdische Kanäle, die Wasser über weite Strecken in Trockengebiete leiteten.", themes: ["technologie", "architektur"] },
      { kind: "wissen", title: "Die Inka", text: "Die Inka verwalteten ihr Reich ohne Schrift im üblichen Sinn, mit Knotenschnüren (Quipu). Sie bauten ein Straßennetz durch die Anden und fügten Steine ohne Mörtel passgenau zusammen.", themes: ["gesellschaft", "architektur", "artefakte"] },
      { kind: "wissen", title: "Wikinger und Kelten", text: "Wikingerschwerter mit der Inschrift „Ulfberht“ bestehen teils aus ungewöhnlich reinem Stahl; die Kelten waren hervorragende Metallhandwerker. Von den Kelten und ihren Druiden gibt es kaum eigene Schriftzeugnisse; vieles stammt aus römischen Berichten.", themes: ["technologie", "artefakte"] },
      { kind: "glaube", title: "Götter und Orakel", text: "Die Griechen befragten Orakel wie Delphi, die Kelten verehrten Naturorte, die Wikinger Götter wie Odin und Thor, die Inka die Sonne (Inti). Vielen Kulturen gemeinsam ist die enge Verbindung von Religion, Natur und Himmel.", themes: ["spiritualitaet", "mythen"] },
      { kind: "raetsel", title: "Wer waren die Nabatäer wirklich?", text: "Von den Nabatäern sind kaum eigene Texte erhalten. Wie sie Wasser, Handel und Religion organisierten, rekonstruieren Forschende vor allem aus Bauten und Inschriften.", themes: ["verborgenes", "gesellschaft"] },
      { kind: "raetsel", title: "Gab es weitere solche Geräte?", text: "Bisher ist kein zweites antikes Gerät von der Komplexität des Antikythera-Mechanismus gefunden worden. Wie weit das Wissen über Getriebe verbreitet war, ist offen.", themes: ["verborgenes", "technologie"] },
    ],
    claims: [
      { text: "Römischer Beton sei besser als heutiger und heile sich selbst.", level: "hypothesis", counter: "Untersuchungen deuten darauf hin, dass Kalkeinschlüsse kleine Risse schließen können. „Besser als heutiger Beton“ gilt höchstens für bestimmte Anwendungen wie Hafenbauten im Meerwasser; bewehrter moderner Beton ist deutlich belastbarer." },
    ],
  },
];

/** Patterns that recur across cultures. Neutral descriptions; the "or common knowledge?" question is answered with what is known. */
export const PATTERNS: { title: string; text: string }[] = [
  { title: "Pyramiden und Stufentempel", text: "Stufenbauten entstanden in Ägypten, Mesopotamien (Zikkurat), Mesoamerika und Nubien. Das kann Zufall, ähnliche Lösungen für ähnliche Aufgaben oder Austausch sein. Direkte Verbindungen zwischen Ägypten und Mesoamerika sind nicht belegt." },
  { title: "Der Blick zum Himmel", text: "Sonnenwende und Tagundnachtgleiche prägen Stonehenge, Newgrange, Gizeh und Chichén Itzá. Ackerbau und Kalender machten die Himmelsbeobachtung überlebenswichtig." },
  { title: "Die große Flut", text: "Flutmythen gibt es in Mesopotamien (Gilgamesch, Atrahasis), im Alten Testament und in vielen weiteren Kulturen. Erklärungen reichen von örtlichen Überschwemmungen bis zu gemeinsamen Erzählwegen." },
];
export const PATTERN_ANSWER = "Zufall oder gemeinsames Wissen? Ähnliche Probleme führen oft zu ähnlichen Lösungen. Gemeinsames Wissen müsste Spuren hinterlassen haben, etwa Handelswege oder Texte; solche Spuren fehlen für die großen weltweiten Verbindungen.";

export const CULTURES_NOTICE = "Pilotversion: Alle Texte sind nicht fachlich geprüft. Zeit- und Zahlenangaben sind gerundet und folgen der gängigen Einordnung; Quellen: Source pending verification. Behauptungen stehen immer als Behauptung mit ihrer Belegstufe und den Gegenbelegen da. Sie werden nicht als Tatsache dargestellt.";
