import type { SlotName } from "../assets/registry";
import type { EvidenceLevel } from "./types";

/**
 * "Freie Energie der Erde" (replaces the DIY lab).
 *
 * The operator's thesis is that the Earth already produces energy and electricity for free, so that humanity would not have
 * to pay for electricity. The page keeps this thesis as a CLAIM (level "claimed") and sets next to it what is documented
 * and what speaks against it. Everything is written for the pilot and is NOT yet reviewed by experts: numbers are rounded
 * orders of magnitude, sources are "Source pending verification". Claims carry a level of the library's scale and the
 * counter-evidence; nothing on this page is stated as fact in the page's own voice unless it is textbook physics.
 *
 * Block kinds: fund = measured / documented physics, nutzung = how it is used today, grenze = why it is not simply "free",
 * raetsel = open questions.
 */
export type EBlockKind = "fund" | "nutzung" | "grenze" | "raetsel";
export const E_KIND_TAG: Record<EBlockKind, string> = { fund: "Dokumentiert", nutzung: "Nutzung heute", grenze: "Grenze", raetsel: "Offene Frage" };
export const E_KIND_SECTION: Record<EBlockKind, string> = { fund: "Physik & Messungen", nutzung: "Nutzung heute", grenze: "Warum es nicht einfach „kostenlos“ ist", raetsel: "Offene Fragen" };
export const E_KIND_COLOR: Record<EBlockKind, string> = { fund: "var(--lvl-historical)", nutzung: "var(--lvl-established)", grenze: "var(--lvl-hypothesis)", raetsel: "var(--cyan)" };

export interface EBlock { kind: EBlockKind; title: string; text: string }
export interface EClaim { text: string; level: Extract<EvidenceLevel, "claimed" | "hypothesis" | "unsupported" | "refuted">; counter: string }
export interface EDossier {
  id: string;
  name: string;
  sub: string;
  slot: SlotName;
  blocks: EBlock[];
  claims: EClaim[];
}

export const THESIS = {
  text: "Die Erde erzeugt bereits kostenlos Energie und Strom: durch Sonne, Wind, Wasser, Erdwärme, das Magnetfeld, die Erdrotation und mehr. Die Menschheit müsste keinen Cent für Strom ausgeben.",
  level: "claimed" as const,
  forPoints: [
    "Die Energiemengen sind gewaltig: Die Sonne strahlt auf die Erde ein Vielfaches des weltweiten Energieverbrauchs ein.",
    "Sonne, Wind, Wasser, Gezeiten und Erdwärme brauchen keinen Brennstoff. Als Rohstoff kosten sie nichts.",
    "Wind- und Solarstrom gehören vielerorts bereits zu den günstigsten Quellen für neuen Strom (Quelle: Source pending verification).",
  ],
  againstPoints: [
    "Strom ist nicht kostenlos: Anlagen müssen gebaut, betrieben, gewartet, gespeichert und über Netze verteilt werden. Der Rohstoff Sonne kostet nichts, die Solaranlage schon.",
    "Nicht jedes genannte Phänomen lässt sich nutzen: Erdbeben, Blitze, die Erdrotation und die Luftelektrizität liefern keine praktisch nutzbare Leistung (siehe die einzelnen Akten).",
    "Sonne und Wind schwanken. Ohne Speicher oder Ausgleich durch andere Quellen gibt es nicht zu jeder Zeit Strom.",
  ],
  note: "Das Wort „freie Energie“ hat zwei Bedeutungen. In Physik und Chemie ist die „freie Energie“ (Helmholtz, Gibbs) eine Rechengröße, die angibt, wie viel Arbeit ein System leisten kann. Umgangssprachlich ist damit oft kostenlose, unbegrenzte Energie gemeint. Energie aus dem Nichts (ein Perpetuum mobile) widerspricht dem Satz von der Energieerhaltung und wurde nie nachgewiesen.",
};

/** Orders of magnitude for the bar strip (rounded, logarithmic). `tw` = terawatt. */
export const SCALE: { label: string; tw: number; text: string; color: string }[] = [
  { label: "Sonnenstrahlung auf der Erde", tw: 170000, text: "ca. 170.000 TW trifft die Erde (Größenordnung)", color: "#f2cf3e" },
  { label: "Weltweiter Energieverbrauch", tw: 20, text: "ca. 20 TW Primärenergie der Menschheit (Größenordnung)", color: "#ecece8" },
  { label: "Wärmefluss aus dem Erdinneren", tw: 47, text: "ca. 47 TW insgesamt, nur zu einem winzigen Teil erreichbar", color: "#e0873a" },
  { label: "Gezeiten (Reibung im Meer)", tw: 3.7, text: "ca. 3,7 TW, davon nutzbar nur ein kleiner Teil an wenigen Küsten", color: "#58d6e8" },
];
export const SCALE_NOTE = "Alle Werte sind gerundete Größenordnungen aus dem Gedächtnis (Quellen: Source pending verification). Sie zeigen, dass der Rohstoff reichlich vorhanden ist. Wie viel davon mit welchem Aufwand nutzbar ist, sagen sie nicht.";

export const ATMOSPHERE: { id: string; name: string; km: string; text: string }[] = [
  { id: "tropo", name: "Troposphäre", km: "0 – ca. 12 km", text: "Hier spielt sich das Wetter ab: Wolken, Regen, Wind und Gewitter. Hier entstehen Blitze. Die Obergrenze liegt je nach Ort und Jahreszeit bei etwa 8 bis 15 Kilometern." },
  { id: "strato", name: "Stratosphäre", km: "ca. 12 – 50 km", text: "Enthält die Ozonschicht, die einen großen Teil der UV-Strahlung der Sonne aufnimmt. Über großen Gewittern sind kurze Leuchterscheinungen („Sprites“, „Jets“) beobachtet worden." },
  { id: "meso", name: "Mesosphäre", km: "ca. 50 – 85 km", text: "Die kälteste Schicht der Erdatmosphäre. Hier verglühen die meisten Sternschnuppen." },
  { id: "thermo", name: "Thermosphäre", km: "ca. 85 – 700 km", text: "Hier treffen geladene Teilchen des Sonnenwinds auf die Luft und erzeugen Polarlichter. Teile dieser Schicht sind elektrisch geladen (Ionosphäre)." },
  { id: "exo", name: "Exosphäre", km: "ab ca. 700 km", text: "Die äußerste Schicht, in der die Luft allmählich in den Weltraum übergeht." },
];

export const SOURCES: EDossier[] = [
  {
    id: "sonne", name: "Sonnenenergie", sub: "Licht · Wärme · Strahlung", slot: "energy-src-sonne",
    blocks: [
      { kind: "fund", title: "Die Energiequelle", text: "In der Sonne verschmelzen Wasserstoffkerne zu Helium und setzen dabei Energie frei. Am Rand der Erdatmosphäre kommen etwa 1361 Watt pro Quadratmeter an (Solarkonstante). Insgesamt trifft die Erde eine Leistung von einigen Hunderttausend Terawatt, mehrere tausend Mal so viel, wie die Menschheit insgesamt verbraucht." },
      { kind: "nutzung", title: "Solarzellen und Solarwärme", text: "Photovoltaik wandelt Sonnenlicht direkt in Strom, Solarthermie in Wärme. Solarkraftwerke bündeln das Licht mit Spiegeln, um Dampf zu erzeugen." },
      { kind: "grenze", title: "Nacht, Wetter, Speicher", text: "Nachts gibt es keinen Solarstrom, bei Bewölkung weniger. Für gleichmäßige Versorgung braucht es Speicher, Netze oder andere Quellen. Die Module selbst, ihre Installation und die Netze kosten Geld." },
      { kind: "raetsel", title: "Speicherung im großen Maßstab", text: "Wie sich Strom für Tage oder Jahreszeiten günstig speichern lässt, ist ein Forschungsfeld (Batterien, Wasserstoff, Pumpspeicher, Wärmespeicher)." },
    ],
    claims: [],
  },
  {
    id: "blitz", name: "Blitz & Gewitter", sub: "Elektrische Entladungen · Ladung", slot: "energy-src-blitz",
    blocks: [
      { kind: "fund", title: "Wie ein Blitz entsteht", text: "In Gewitterwolken trennen sich elektrische Ladungen: Eiskristalle und Graupel stoßen zusammen und laden sich unterschiedlich auf. Wie genau dies geschieht, wird bis heute erforscht. Zwischen Wolke und Boden bauen sich Spannungen von vielen Millionen Volt auf. Bei der Entladung fließen Ströme von etwa zehntausend Ampere und mehr. Weltweit gibt es nach Satellitendaten ungefähr 40 bis 50 Blitze pro Sekunde (Quellen: Source pending verification)." },
      { kind: "nutzung", title: "Blitzschutz statt Blitzernte", text: "Nutzbar ist der Blitz bisher nur als Gefahr, die man ableitet. Benjamin Franklin entwickelte in den 1750er-Jahren den Blitzableiter. Heute schützen Ableiter Gebäude, Masten und Windräder." },
      { kind: "grenze", title: "Kurz, unvorhersehbar, verteilt", text: "Ein Blitz dauert Bruchteile einer Sekunde, schlägt an kaum vorhersehbarer Stelle ein und gibt einen großen Teil seiner Energie als Hitze, Licht und Schall ab. Eine Anlage, die ihn auffängt und speichert, gibt es nicht. Selbst bei großzügiger Schätzung wäre die gesamte weltweite Blitzenergie nur ein kleiner Bruchteil des Strombedarfs." },
      { kind: "raetsel", title: "Forschung", text: "Wie die erste Ladungstrennung abläuft und warum Blitze ihren Weg wählen, wie sie es tun, ist nicht vollständig geklärt. Es gibt Versuche, Blitze mit Lasern zu führen." },
    ],
    claims: [
      { text: "Blitze könnten das Stromnetz der Welt versorgen.", level: "unsupported", counter: "Die Energie je Blitz ist begrenzt, kommt nur an wenigen Stellen und zu unvorhersehbaren Zeiten, und es gibt keine Technik, sie einzufangen. Rechnerisch wäre selbst bei vollständiger Nutzung nur ein kleiner Teil des Bedarfs gedeckt (grobe Abschätzung, Quelle: Source pending verification)." },
    ],
  },
  {
    id: "wasser", name: "Wasserenergie", sub: "Flüsse · Wasserfälle", slot: "energy-src-wasser",
    blocks: [
      { kind: "fund", title: "Die Sonne treibt den Kreislauf", text: "Sonnenwärme verdunstet Wasser, es regnet über dem Land ab und fließt als Flüsse zum Meer zurück. Wasser, das bergab fließt, setzt die Energie frei, die ihm beim Anheben durch die Sonne zugeführt wurde." },
      { kind: "nutzung", title: "Wasserkraftwerke", text: "Laufwasser-, Speicher- und Pumpspeicherkraftwerke wandeln den Höhenunterschied in Strom. Wasserkraft liefert grob ein Siebtel des weltweiten Stroms (gerundet, Quelle: Source pending verification). Pumpspeicher stellen den größten Teil der weltweit installierten Netzspeicher." },
      { kind: "grenze", title: "Eingriff und Aufwand", text: "Staudämme sind teuer, verändern Flüsse, Landschaft und Ökosysteme und erfordern teils Umsiedlungen. Gute Standorte sind in vielen Ländern bereits genutzt." },
    ],
    claims: [],
  },
  {
    id: "meer", name: "Meeresenergie", sub: "Wellen · Gezeiten · Strömungen", slot: "energy-src-meer",
    blocks: [
      { kind: "fund", title: "Mond, Sonne und Wind", text: "Die Gezeiten entstehen durch die Anziehung von Mond und Sonne und die Erdrotation. Wellen entstehen durch Wind. Meeresströmungen werden durch Wind, Temperatur- und Salzunterschiede angetrieben." },
      { kind: "nutzung", title: "Gezeitenkraftwerke", text: "Das Gezeitenkraftwerk La Rance in Frankreich läuft seit den 1960er-Jahren. Wellen- und Strömungskraftwerke gibt es bisher hauptsächlich als Pilotanlagen." },
      { kind: "grenze", title: "Salz, Sturm, Kosten", text: "Salzwasser korrodiert, Stürme zerstören Anlagen, und der Bau auf See ist teuer. Starke Gezeiten gibt es nur an wenigen Küsten." },
    ],
    claims: [],
  },
  {
    id: "wind", name: "Windenergie", sub: "Luftmassen · Bewegung", slot: "energy-src-wind",
    blocks: [
      { kind: "fund", title: "Wie Wind entsteht", text: "Die Sonne erwärmt die Erde ungleich. Warme Luft steigt auf, kalte strömt nach. Die Erdrotation lenkt die Strömung ab (Corioliskraft) und prägt die großen Windsysteme wie Passate und Westwinde." },
      { kind: "nutzung", title: "Windkraftanlagen", text: "Rotoren wandeln die Bewegung der Luft in Strom, an Land und auf See. In windreichen Regionen zählt Windstrom zu den günstigsten Quellen für neuen Strom (Quelle: Source pending verification)." },
      { kind: "grenze", title: "Schwankung und Standort", text: "Der Wind weht nicht immer. Anlagen brauchen geeignete Standorte, Netzanschluss und Ausgleich bei Flaute." },
    ],
    claims: [],
  },
  {
    id: "geothermie", name: "Geothermie", sub: "Vulkane · Erdwärme", slot: "energy-src-geothermie",
    blocks: [
      { kind: "fund", title: "Wärme aus dem Erdinneren", text: "Das Innere der Erde ist heiß. Die Wärme stammt aus der Zeit der Entstehung der Erde und vom Zerfall radioaktiver Elemente im Gestein. Der Wärmefluss zur Oberfläche beträgt insgesamt grob 40 bis 50 Terawatt, etwa das Doppelte des Energieverbrauchs der Menschheit (gerundet). Der größte Teil verteilt sich aber dünn über die gesamte Erdoberfläche." },
      { kind: "nutzung", title: "Heißwasser und Dampf", text: "Wo heißes Wasser oder Dampf nah an der Oberfläche liegt, wird es genutzt. Island heizt den größten Teil seiner Häuser so und gewinnt einen merklichen Teil seines Stroms aus Erdwärme; in Larderello in Italien wurde 1904 der erste Strom aus Erdwärme erzeugt. Wärmepumpen nutzen die gleichmäßige Wärme des oberen Bodens zum Heizen." },
      { kind: "grenze", title: "Nur an geeigneten Orten", text: "Tiefbohrungen sind teuer. Bei manchen Verfahren, die Gestein aufbrechen, sind kleine Erdbeben aufgetreten (zum Beispiel 2006 in Basel)." },
    ],
    claims: [
      { text: "Die Energie von Erdbeben lasse sich nutzen, um Strom zu erzeugen.", level: "unsupported", counter: "Erdbeben setzen ihre Energie in Sekunden frei, an unvorhersehbaren Orten und zerstörerisch. Es gibt keine Technik, sie aufzufangen oder zu speichern." },
      { text: "Die Wärme der Erde reiche aus, den gesamten Energiebedarf der Menschheit zu decken.", level: "hypothesis", counter: "Die gespeicherte Wärme ist riesig, aber technisch und wirtschaftlich erreichbar ist nur ein Teil, und er wird langsam nachgeliefert. Schätzungen des nutzbaren Anteils gehen weit auseinander (Quelle: Source pending verification)." },
    ],
  },
  {
    id: "magnetfeld", name: "Magnetfeld", sub: "Schutzschild · Energieflüsse", slot: "energy-src-magnetfeld",
    blocks: [
      { kind: "fund", title: "Ein Dynamo im Erdkern", text: "Das Erdmagnetfeld entsteht durch Strömungen im flüssigen äußeren Erdkern aus Eisen und Nickel (Geodynamo). Die Erdrotation beeinflusst diese Strömungen. An der Oberfläche ist das Feld schwach: etwa 25 bis 65 Mikrotesla." },
      { kind: "fund", title: "Schutzschild", text: "Das Feld lenkt einen großen Teil des Sonnenwinds ab. Wo geladene Teilchen in die obere Atmosphäre treffen, entstehen Polarlichter." },
      { kind: "nutzung", title: "Navigation", text: "Kompasse nutzen das Magnetfeld. Auch manche Tiere orientieren sich daran. Strom wird daraus nicht gewonnen." },
      { kind: "grenze", title: "Kein Kraftwerk", text: "Strom entsteht durch Änderung eines Magnetfelds oder durch Bewegung in ihm. Das Erdfeld ist schwach und ändert sich nur langsam. Bei starken Sonnenstürmen entstehen in langen Leitungen Störströme (zum Beispiel 1989 beim Stromausfall in Québec), die Netze schädigen, nicht versorgen." },
      { kind: "raetsel", title: "Umpolungen", text: "Das Magnetfeld hat sich in der Erdgeschichte mehrfach umgepolt. Wann und wie das wieder passiert, ist nicht vorhersagbar." },
    ],
    claims: [
      { text: "Das Erdmagnetfeld liefere nutzbaren Strom.", level: "unsupported", counter: "Für Induktion braucht man ein sich änderndes Feld oder Bewegung. Das Erdfeld ist schwach und beinahe konstant. Ein Kraftwerk, das daraus Leistung zieht, ist nicht bekannt." },
    ],
  },
];

export const TOPICS: EDossier[] = [
  {
    id: "atmosphaere", name: "Die Atmosphäre", sub: "Mehrere Ebenen, viel Energie", slot: "energy-topic-atmosphaere",
    blocks: [
      { kind: "fund", title: "Luftelektrizität", text: "Zwischen Erdboden und Ionosphäre besteht ein elektrisches Feld. Bei Schönwetter beträgt es nahe am Boden etwa 100 Volt pro Meter. Gewitter laden diesen „globalen Stromkreis“ auf (Konzept nach C. T. R. Wilson, frühes 20. Jahrhundert). Der Strom, der bei Schönwetter durch die Luft fließt, ist winzig: Größenordnung Pikoampere pro Quadratmeter." },
      { kind: "fund", title: "Schumann-Resonanzen", text: "Blitze regen Schwingungen im Hohlraum zwischen Erdoberfläche und Ionosphäre an. Die tiefste liegt bei etwa 7,8 Hertz. Sie sind messbar und werden zur Beobachtung von Gewitteraktivität genutzt." },
      { kind: "grenze", title: "Sehr wenig Energie pro Fläche", text: "Weil die Ströme so klein sind, liefern Antennen oder Ionisatoren für atmosphärische Elektrizität nur winzige Leistungen. Forschungsansätze zum Sammeln von Energie aus Luft oder Luftfeuchte liegen bisher im Mikrowatt-Bereich." },
      { kind: "raetsel", title: "Offene Forschung", text: "Wie die Atmosphäre elektrisch auf Gewitter, Wolkenkerne und kosmische Strahlung reagiert, wird weiter erforscht." },
    ],
    claims: [
      { text: "Atmosphärische Elektrizität könne Haushalte und Industrie kostenlos mit Strom versorgen.", level: "unsupported", counter: "Die verfügbare Leistung pro Fläche ist winzig, und Versuche haben bisher nur Mikrowatt-Größenordnungen gezeigt. Ein praktisch nutzbares System ist nicht dokumentiert (Quelle: Source pending verification)." },
    ],
  },
  {
    id: "gewitter", name: "Gewitter – die natürliche Batterie", sub: "Wolkenbildung · Ladung · Entladung", slot: "energy-topic-gewitter",
    blocks: [
      { kind: "fund", title: "Vom Aufwind zur Entladung", text: "Warme, feuchte Luft steigt in hohe Gewitterwolken auf. Eis und Wasser trennen dort Ladung: oben überwiegend positive, unten überwiegend negative. Das elektrische Feld wächst, bis die Luft durchschlägt und ein Blitz entsteht." },
      { kind: "fund", title: "Folgen für die Erde", text: "Blitze erzeugen Stickoxide, die Stickstoff in eine für Pflanzen verwertbare Form bringen (natürliche Düngung, Quelle: Source pending verification). Sie regen Schumann-Resonanzen an und entzünden Waldbrände." },
      { kind: "nutzung", title: "Schutz", text: "Bei Gewitter Schutz in Gebäuden oder Fahrzeugen suchen; freie Flächen, einzelne Bäume und Wasser meiden. Blitzableiter schützen Gebäude." },
      { kind: "grenze", title: "Keine Speicherbatterie", text: "Die Gewitterwolke wirkt wie ein Kondensator, der sich in Sekundenbruchteilen entlädt. Anders als eine Batterie lässt sie sich nicht gezielt laden, anzapfen oder entladen." },
    ],
    claims: [],
  },
  {
    id: "wasserkreislauf", name: "Wasserkreislauf", sub: "Bewegung erzeugt Energie", slot: "energy-topic-wasserkreislauf",
    blocks: [
      { kind: "fund", title: "Die Stationen", text: "Verdunstung, Kondensation (Wolken), Regen, Flüsse und Wasserfälle, Rückkehr ins Meer. Die Energie dafür liefert die Sonne." },
      { kind: "fund", title: "Energie im Wasser", text: "Hochgelegenes Wasser trägt Lageenergie, Strömungen tragen Bewegungsenergie, Wellen und Gezeiten tragen Bewegungsenergie aus Wind, Mond und Sonne." },
      { kind: "nutzung", title: "Pumpspeicher", text: "Pumpspeicherkraftwerke heben bei Stromüberschuss Wasser in ein höheres Becken und lassen es bei Bedarf wieder durch Turbinen laufen. Sie sind heute der wichtigste Speicher im Netz." },
      { kind: "grenze", title: "Die Sonne ist die Quelle", text: "Der Wasserkreislauf erzeugt keine Energie aus sich selbst. Er wird von der Sonne angetrieben und liefert Wasserkraft nur, weil Sonnenenergie das Wasser anhebt." },
    ],
    claims: [],
  },
  {
    id: "elektrokultur", name: "Elektrokultur", sub: "Verbindung von Himmel und Erde", slot: "energy-topic-elektrokultur",
    blocks: [
      { kind: "fund", title: "Eine alte Idee", text: "Schon im 18. Jahrhundert untersuchten Forscher, ob Elektrizität das Pflanzenwachstum beeinflusst. Der Finne Selim Lemström berichtete um 1900 von Mehrerträgen unter elektrisch geladenen Drähten. Spätere Versuche kamen zu uneinheitlichen Ergebnissen (Quelle: Source pending verification)." },
      { kind: "fund", title: "Pflanzen und Elektrizität", text: "Pflanzen nutzen selbst elektrische Signale, zum Beispiel die schnellen Reize der Venusfliegenfalle. Bodenbakterien in „mikrobiellen Brennstoffzellen“ erzeugen im Labor kleine Ströme. Zwei Metallelektroden im feuchten Boden (etwa Kupfer und Zink) bilden eine schwache Batterie." },
      { kind: "grenze", title: "Winzige Spannungen", text: "Die genannten Effekte liefern nur sehr kleine Leistungen. Ob und wie stark äußere elektrische Felder das Pflanzenwachstum im Garten verbessern, ist nicht gesichert." },
    ],
    claims: [
      { text: "Spiralen und Antennen aus Kupfer, die atmosphärische Energie „einfangen“, steigern Wachstum und Ertrag von Pflanzen.", level: "claimed", counter: "Kontrollierte Studien dazu fehlen mir; historische Versuche waren uneinheitlich. Bessere Erträge in Gartenberichten können viele andere Ursachen haben, etwa Standort, Wetter und Pflege. Nicht geprüft." },
    ],
  },
  {
    id: "erdrotation", name: "Erdrotation – ein riesiger Generator?", sub: "Rotation · Magnetfeld · Strömungen", slot: "energy-topic-erdrotation",
    blocks: [
      { kind: "fund", title: "Was die Rotation bewirkt", text: "Die Erde dreht sich einmal in etwa 24 Stunden. Die Rotation lenkt Winde und Meeresströmungen ab (Corioliskraft) und beeinflusst die Strömung im flüssigen Erdkern, die das Magnetfeld erzeugt. Wie genau, ist Gegenstand von Modellrechnungen." },
      { kind: "fund", title: "Eine gewaltige Energie", text: "Die Drehenergie der Erde ist riesig (Größenordnung 10²⁹ Joule). Die Gezeitenreibung bremst die Rotation: Ein Tag wird pro Jahrhundert etwa 2 Millisekunden länger." },
      { kind: "grenze", title: "Ein Rad ohne Anschluss", text: "Energie aus der Erdrotation ließe sich nur entnehmen, indem man sie bremst. Dafür gibt es keinen praktischen Weg. Das Magnetfeld dreht sich mit der Erde, ein darin ruhender Draht sieht kein sich änderndes Feld und liefert keinen Strom." },
    ],
    claims: [
      { text: "Die Erdrotation erzeugt direkt nutzbaren Strom.", level: "unsupported", counter: "Die Rotation treibt Strömungen im Erdkern an, die das Magnetfeld erzeugen, aber an der Oberfläche steht daraus keine Leistung zur Verfügung. Eine Technik, die der Erdrotation Strom entnimmt, ist nicht bekannt." },
    ],
  },
  {
    id: "erdung", name: "Erdung – Verbindung mit der Erde", sub: "Boden · Ladungsausgleich", slot: "energy-topic-erdung",
    blocks: [
      { kind: "fund", title: "Erdung in der Technik", text: "In der Elektrotechnik ist Erdung bewährter Schutz: Schutzleiter und Potentialausgleich leiten Fehlerströme ab und verhindern gefährliche Spannungen." },
      { kind: "fund", title: "Statische Aufladung", text: "Wer über Teppich geht, kann sich auf einige tausend Volt aufladen (Reibungselektrizität). Beim Berühren eines Leiters entlädt sich das als kleiner Funke. Barfuß auf feuchtem Boden gleicht sich diese Ladung aus." },
      { kind: "grenze", title: "Gefahr bei Blitz und Strom", text: "Bei Gewitter ist der Boden gefährlich. Selbstgebaute Erdungen an Elektroinstallationen können lebensgefährlich sein und gehören in die Hände von Elektrofachkräften." },
      { kind: "raetsel", title: "Gesundheitsstudien", text: "Zu „Earthing“ gibt es einzelne kleine Studien. Sie sind oft klein, schlecht verblindet oder von Anbietern beeinflusst. Größere unabhängige Untersuchungen fehlen nach meinem Kenntnisstand." },
    ],
    claims: [
      { text: "Der direkte Kontakt zur Erde (barfuß, Erdungsmatten) gleicht elektrische Ladungen im Körper aus und verbessert die Gesundheit.", level: "hypothesis", counter: "Ein Ladungsausgleich bei statischer Aufladung ist physikalisch erklärbar. Für einen gesundheitlichen Nutzen gibt es nur kleine Studien ohne belastbare, unabhängig wiederholte Ergebnisse. Eine anerkannte medizinische Wirkung ist nicht belegt. Kein Ersatz für ärztliche Behandlung (Quelle: Source pending verification)." },
    ],
  },
  {
    id: "schmuck", name: "Materie am Körper – Schmuck & Metalle", sub: "Gold · Silber · Kupfer · Edelsteine", slot: "energy-topic-schmuck",
    blocks: [
      { kind: "fund", title: "Leitfähigkeit", text: "Silber leitet Strom am besten, dann Kupfer, dann Gold. Gold ist chemisch sehr stabil und läuft nicht an. Deshalb wird es für Kontakte in der Elektronik verwendet." },
      { kind: "fund", title: "Metalle und Keime", text: "Silberionen und Kupferoberflächen wirken auf viele Keime hemmend und werden in Wundauflagen und Kontaktflächen untersucht und genutzt." },
      { kind: "fund", title: "Schmuck in den Kulturen", text: "Metallschmuck war und ist in vielen Kulturen Statussymbol, Amulett und Handelsgut. Welche Bedeutung ihm zugeschrieben wird, ist kulturelle Überlieferung." },
      { kind: "grenze", title: "Kontaktallergie", text: "Schmuck kann Kontaktallergien auslösen. Häufig ist Nickel der Auslöser." },
    ],
    claims: [
      { text: "Schmuck aus Gold, Silber oder Kupfer verändert elektrische Felder am Körper und stärkt Gesundheit und Energie.", level: "claimed", counter: "Für eine solche Wirkung gibt es keine Belege. Kontrollierte Studien zu Kupfer- und Magnetarmbändern, etwa bei Gelenkschmerzen, fanden keinen Nutzen über Placebo hinaus (Quelle: Source pending verification)." },
    ],
  },
  {
    id: "tesla", name: "Nikola Tesla & drahtlose Energie", sub: "Experimente · Visionen · Grenzen", slot: "energy-topic-tesla",
    blocks: [
      { kind: "fund", title: "Was dokumentiert ist", text: "Nikola Tesla (1856–1943) entwickelte den Wechselstrom-Induktionsmotor und baute in den 1890er-Jahren den Tesla-Transformator. 1899 experimentierte er in Colorado Springs mit hohen Spannungen und drahtloser Übertragung. Ab 1901 ließ er in Wardenclyffe (Long Island) einen Turm für drahtlose Telegrafie und Energieübertragung bauen. Der Turm ging nie in Betrieb, weil die Finanzierung versiegte; er wurde 1917 abgerissen." },
      { kind: "nutzung", title: "Drahtlose Energie heute", text: "Über kurze Entfernungen funktioniert drahtlose Energieübertragung: induktives Laden (zum Beispiel von Zahnbürsten und Smartphones) und RFID-Etiketten. Für große Entfernungen wird mit Mikrowellen und Lasern geforscht." },
      { kind: "fund", title: "Die Papiere", text: "Nach Teslas Tod 1943 wurden seine Unterlagen vom US-Amt für Fremdeigentum sichergestellt und von einem Ingenieur gesichtet, der darin keine Geheimwaffe sah (aus dem Gedächtnis, Quelle: Source pending verification)." },
      { kind: "grenze", title: "Verluste mit der Entfernung", text: "Drahtlos übertragene Energie verteilt sich in den Raum, und die Verluste wachsen schnell mit der Entfernung. Es wurde nie gezeigt, dass sich Energie über große Strecken wirtschaftlich ohne Leitung übertragen lässt. Auch ein solches System braucht eine Quelle, die die Energie erzeugt." },
      { kind: "raetsel", title: "Wie weit lässt sich das skalieren?", text: "Energie aus Solarkraftwerken im Weltraum per Mikrowelle zur Erde zu senden, wird erforscht. Eine wirtschaftliche Anlage existiert nicht." },
    ],
    claims: [
      { text: "Tesla hatte ein System für kostenlose Energie für alle, das unterdrückt wurde.", level: "unsupported", counter: "Ein funktionierendes System, das Energie aus dem Nichts oder kostenlos liefert, ist nicht dokumentiert. Wardenclyffe war ein Projekt für Telegrafie und Energieübertragung, das an Geld und technischen Grenzen scheiterte. Ein System braucht immer eine Energiequelle." },
      { text: "Boden und Atmosphäre lassen sich als Leiter nutzen, um Energie ohne Leitung über beliebige Entfernungen zu übertragen.", level: "unsupported", counter: "Dies war Teslas Idee, wurde aber nie über große Entfernungen und mit nutzbarem Wirkungsgrad gezeigt. Physikalisch bleiben große Verluste und hohe Spannungen ein Hindernis." },
    ],
  },
];

export const ENERGY_NOTICE = "Pilotversion: Alle Texte sind nicht fachlich geprüft. Zahlen sind gerundete Größenordnungen aus dem Gedächtnis; Quellen: Source pending verification. Behauptungen stehen als Behauptung mit ihrer Belegstufe und den Gegenbelegen da, nicht als Tatsache. Informationsangebot – keine Anleitung zum Bau von Anlagen und keine Beratung zu Elektroinstallationen: Arbeiten am Stromnetz gehören in die Hände von Elektrofachkräften.";
