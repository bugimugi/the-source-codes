/**
 * Data of the landing page "Krankheiten & Beschwerden" (src/ui/beschwerden.ts), built after the user's reference picture
 * (docs/MOCKUP-NOTES.md, page 28). The page informs; it does not diagnose and does not give treatment instructions. What the mockup showed as an
 * "analysis" (probable causes with influence levels, chakra percentages, individual plan) is replaced by: general triggers without a ranking,
 * the traditional chakra themes without numbers, a self-assessment that only mirrors the user's own entries, and a note sheet for the talk with the
 * doctor or pharmacist. Every complaint carries warning signs; effects of remedies are claims with their evidence level (content/claims).
 * Textbook statements: Source pending verification.
 */
export interface Orb { id: string; title: string; lines: string[]; icon: string; tint: string; x: number; y: number; text: string; to: "atem" | "nutrients" | "plants" | "chakra" | "freq" | "crystals" | "selfcheck"; claim?: string }

/** the eight circles around the hero figure (x, y in percent of the stage) */
export const ORBS: Orb[] = [
  { id: "geist", title: "Geist", lines: ["Emotionen", "Stress"], icon: "brain", tint: "#58d6e8", x: 12, y: 8, to: "atem",
    text: "Gefühle, Gedanken und Körper hängen zusammen: Dauerstress belastet Schlaf, Herz-Kreislauf-System und Verdauung. Hilfen reichen von Pausen und Bewegung über Atem- und Achtsamkeitsübungen bis zur Psychotherapie." },
  { id: "atmung", title: "Atmung", lines: ["Nervensystem", "Ruhe"], icon: "lungs", tint: "#58d6e8", x: 8, y: 29, to: "atem", claim: "atem-langsam-hrv",
    text: "Die Atmung ist eine der wenigen Funktionen des vegetativen Nervensystems, die du bewusst beeinflussen kannst. Langsames Atmen geht in Studien mit höherer Herzratenvariabilität einher; was das für Beschwerden bedeutet, ist offen." },
  { id: "ernaehrung", title: "Ernährung", lines: ["Nährstoffe", "Darmgesundheit"], icon: "berry", tint: "#ff5a5a", x: 6, y: 50, to: "nutrients",
    text: "Der Körper braucht Energie, Eiweiß, Fette, Kohlenhydrate, Vitamine, Mineralstoffe und Wasser. Im Darm leben Billionen Mikroorganismen (Mikrobiom); die Forschung dazu ist im Fluss." },
  { id: "pflanzen", title: "Pflanzen", lines: ["Kräuter", "Naturstoffe"], icon: "leaf", tint: "#6fd45a", x: 10, y: 71, to: "plants", claim: "beschwerde-wechselwirkungen",
    text: "Heilpflanzen werden seit Jahrhunderten genutzt; manche Wirkstoffe sind erforscht, viele Anwendungen sind Überlieferung. Pflanzen sind Wirkstoffe und können Nebenwirkungen und Wechselwirkungen mit Medikamenten haben." },
  { id: "chakren", title: "Chakren", lines: ["Energiefluss", "Balance"], icon: "flower", tint: "#d86ae0", x: 72, y: 8, to: "chakra",
    text: "Chakren sind ein Modell aus der indischen Überlieferung: sieben Zentren mit Themen und Farben. Eine Messung von „Energiefluss“ oder „Balance“ der Chakren gibt es nicht; das Modell ist Kultur- und Ideengeschichte." },
  { id: "frequenzen", title: "Frequenzen", lines: ["Schwingung", "Heilung"], icon: "sound", tint: "#a05aff", x: 77, y: 29, to: "freq", claim: "freq-solfeggio",
    text: "Schall, Licht und Herzschlag haben Frequenzen, und Ultraschall wird in der Medizin genutzt. „Heilfrequenzen“ aus der Klangheilkunde (Solfeggio, 432 Hz) sind nicht belegt." },
  { id: "kristalle", title: "Mineralien & Kristalle", lines: ["Energieunterstützung"], icon: "hex", tint: "#8a7aff", x: 80, y: 50, to: "crystals", claim: "crystal-healing-general",
    text: "Mineralstoffe wie Magnesium und Zink sind Nährstoffe; ihren Bedarf deckt meist die Ernährung. Heilsteine und Kristalle sind Überlieferung: Für eine Wirkung über den Placebo-Effekt hinaus ist keine kontrollierte Studie bekannt." },
  { id: "lebensstil", title: "Lebensstil", lines: ["Schlaf · Bewegung", "Umgebung"], icon: "sun", tint: "#ffa43c", x: 75, y: 71, to: "selfcheck",
    text: "Schlaf, Bewegung, Ernährung, Stress, Alkohol, Nikotin, Umgebung und soziale Beziehungen beeinflussen die Gesundheit. Die Selbsteinschätzung weiter unten hilft dir, das für dich zu sortieren." },
];

export const SEARCH_TABS: [string, string][] = [["suche", "Beschwerde suchen"], ["analyse", "Persönliche Analyse"], ["az", "Alle Krankheiten A–Z"]];
export const EXAMPLES = ["Kopfschmerzen", "Schlaflosigkeit", "Blasenentzündung", "Angst", "Rückenschmerzen", "Hautprobleme", "Erkältung", "Verdauungsprobleme", "Stress"];

export interface Idea { label: string; kind: "alltag" | "tradition" | "studie"; text: string; claim?: string; atlas?: string }
export interface Complaint {
  id: string; title: string; sub: string; icon: string; tint: string; terms: string[]; hidden?: boolean;
  what: string; triggers: string[]; triggerClaim?: string; ideas: Idea[]; flags: string[]; crisis?: boolean;
}
export const KIND_LABEL: Record<Idea["kind"], string> = { alltag: "Alltag", tradition: "Überlieferung", studie: "Studienlage" };

/** the complaint groups; `hidden` ones are reachable by search and the A–Z index only */
export const COMPLAINTS: Complaint[] = [
  { id: "erkaeltung", title: "Erkältung", sub: "Schnupfen · Husten · Halsschmerzen", icon: "thermo", tint: "#8aa0c0", terms: ["Erkältung", "Schnupfen", "Husten", "Halsschmerzen", "Grippe", "Infekt"],
    what: "Eine Erkältung ist ein Infekt der oberen Atemwege, meist durch Viren. Sie geht in der Regel nach etwa einer bis zwei Wochen von selbst vorbei. Antibiotika wirken nicht gegen Viren.",
    triggers: ["Ansteckung über Tröpfchen und Hände", "Trockene Heizungsluft und viele Menschen auf engem Raum", "Wenig Schlaf und Dauerstress gehen mit mehr Infekten einher"],
    ideas: [{ label: "Ruhe und Flüssigkeit", kind: "alltag", text: "Schonen, genug trinken, Raumluft nicht zu trocken halten." }, { label: "Honig bei Husten", kind: "studie", text: "Honig lindert bei Kindern ab einem Jahr nächtlichen Husten etwas; für Säuglinge unter einem Jahr ist er gefährlich.", claim: "beschwerde-honig-husten" }, { label: "Kamille", kind: "tradition", text: "Als Tee oder zum Inhalieren seit langem als Hausmittel genutzt.", atlas: "kamille" }, { label: "Salbei", kind: "tradition", text: "Als Gurgeltee bei Halsschmerzen überliefert.", atlas: "salbei" }],
    flags: ["Atemnot, pfeifende Atmung oder Brustschmerzen", "Fieber über 39 °C oder länger als drei Tage", "Starke Halsschmerzen mit Schluckbeschwerden, Speichelfluss oder Schwellung", "Nackensteifigkeit oder starke Benommenheit", "Besserung und dann erneute deutliche Verschlechterung", "Säuglinge, Schwangere, ältere und chronisch kranke Menschen früher untersuchen lassen"] },
  { id: "kopf", title: "Kopfschmerzen", sub: "Migräne · Spannung · Nacken · Augen", icon: "brain", tint: "#d86a9a", terms: ["Kopfschmerzen", "Kopfschmerz", "Migräne", "Spannungskopfschmerz", "Nacken", "Nackenschmerzen"],
    what: "Die häufigsten Formen sind Spannungskopfschmerz und Migräne. Die meisten Kopfschmerzen haben keine gefährliche Ursache. Ein Kopfschmerztagebuch (wann, wie stark, was davor war) hilft der Ärztin, Auslöser zu erkennen.",
    triggers: ["Zu wenig getrunken oder gegessen (Fasten)", "Zu wenig oder unregelmäßiger Schlaf", "Stress und Verspannungen in Nacken und Kiefer", "Alkohol", "Lange Bildschirmarbeit ohne Pausen"], triggerClaim: "beschwerde-kopfschmerz-ausloeser",
    ideas: [{ label: "Regelmäßig trinken, essen, schlafen", kind: "alltag", text: "Feste Zeiten und Pausen nehmen manchen Auslöser weg." }, { label: "Entspannungs- und Atemübungen", kind: "studie", text: "Können Anspannung kurzfristig verringern; für Kopfschmerz selbst nicht gezeigt.", claim: "atem-angst" }, { label: "Pfefferminze", kind: "tradition", text: "Pfefferminzöl wird äußerlich seit langem auf die Schläfen aufgetragen (Überlieferung, nicht bewertet).", atlas: "pfefferminze" }],
    flags: ["Plötzlicher, noch nie erlebter, stärkster Kopfschmerz („wie ein Schlag“)", "Kopfschmerz mit Fieber und steifem Nacken", "Lähmung, Sprach- oder Sehstörung, hängender Mundwinkel, Verwirrtheit (Notruf 112)", "Nach einem Sturz oder Schlag auf den Kopf", "Neu aufgetreten nach dem 50. Lebensjahr oder von Woche zu Woche schlimmer", "Mehr als zehn Tage im Monat Kopfschmerzmittel nötig"] },
  { id: "magen", title: "Magen & Verdauung", sub: "Blähungen · Reizdarm · Durchfall · Verstopfung", icon: "gut", tint: "#e0705a", terms: ["Magen", "Verdauung", "Verdauungsprobleme", "Blähungen", "Reizdarm", "Durchfall", "Verstopfung", "Bauchschmerzen", "Übelkeit", "Sodbrennen"],
    what: "Verdauungsbeschwerden sind häufig und oft funktionell, also ohne erkennbare Schädigung eines Organs (zum Beispiel beim Reizdarmsyndrom). Ernährung, Stress, Bewegung und Schlaf beeinflussen die Verdauung.",
    triggers: ["Sehr fettreiche, süße oder unregelmäßige Mahlzeiten", "Stress und Anspannung (Darm-Hirn-Achse)", "Zu wenig Ballaststoffe und Flüssigkeit", "Alkohol, Nikotin und manche Medikamente"],
    ideas: [{ label: "Regelmäßig und in Ruhe essen", kind: "alltag", text: "Ballaststoffe, ausreichend Flüssigkeit und Bewegung unterstützen die Verdauung." }, { label: "Pfefferminzöl bei Reizdarm", kind: "studie", text: "Besserte in Studien die Beschwerden etwas; Eignung und Dosierung klärt die Apotheke.", claim: "beschwerde-pfefferminzoel-reizdarm" }, { label: "Kamille und Ingwer", kind: "tradition", text: "Als Tees bei Magen-Darm-Beschwerden und Übelkeit überliefert.", atlas: "ingwer" }],
    flags: ["Blut im Stuhl, schwarzer Stuhl oder Bluterbrechen (Notruf 112 bei viel Blut)", "Anhaltendes Erbrechen oder Durchfall länger als zwei bis drei Tage, Zeichen der Austrocknung", "Starke, zunehmende oder gürtelförmige Bauchschmerzen, harter Bauch, Fieber", "Ungewollter Gewichtsverlust, nächtliche Beschwerden", "Schluckbeschwerden oder Gefühl, dass Essen stecken bleibt", "Neu aufgetretene Beschwerden nach dem 50. Lebensjahr"] },
  { id: "schlaf", title: "Schlafprobleme", sub: "Einschlafstörung · Durchschlafen · Müdigkeit", icon: "moon", tint: "#7a6af0", terms: ["Schlaf", "Schlafprobleme", "Schlaflosigkeit", "Einschlafstörung", "Durchschlafstörung", "Müdigkeit", "Insomnie"],
    what: "Gelegentlich schlecht zu schlafen ist normal. Von einer Schlafstörung (Insomnie) spricht man, wenn es an mindestens drei Nächten pro Woche über mindestens drei Monate zu Problemen mit Folgen am Tag kommt.",
    triggers: ["Unregelmäßige Schlafzeiten, Licht und Bildschirme am Abend", "Koffein am Nachmittag, Alkohol am Abend", "Grübeln, Stress und Sorgen", "Körperliche Ursachen wie Schmerzen, Schlafapnoe oder Schilddrüsenerkrankungen"],
    ideas: [{ label: "Schlafhygiene", kind: "alltag", text: "Feste Zeiten, dunkles kühles Zimmer, Abendroutine, kein Koffein am Nachmittag." }, { label: "Verhaltenstherapie bei Schlafstörungen", kind: "studie", text: "Gilt bei anhaltenden Problemen als erste Wahl, vor Schlafmitteln.", claim: "beschwerde-schlaf-kvt" }, { label: "Baldrian", kind: "studie", text: "Traditionelles Mittel; der Nutzen ist unsicher.", claim: "beschwerde-baldrian-schlaf" }, { label: "Atemübung am Abend", kind: "alltag", text: "Ein ruhiger Rhythmus mit langem Ausatmen wird häufig genutzt; für den Schlaf selbst ist er kaum untersucht.", claim: "atem-478-schlaf" }],
    flags: ["Lautes Schnarchen mit Atemaussetzern und starker Tagesschläfrigkeit (Verdacht auf Schlafapnoe)", "Einschlafen am Steuer oder Sekundenschlaf", "Schlafprobleme mit anhaltend gedrückter Stimmung oder Ängsten", "Müdigkeit mit Fieber, Nachtschweiß oder Gewichtsverlust", "Schlafmittel oder Alkohol werden regelmäßig zum Einschlafen gebraucht"] },
  { id: "stress", title: "Stress & Angst", sub: "Nervosität · Panik · Erschöpfung", icon: "stress", tint: "#e0a030", terms: ["Stress", "Angst", "Panik", "Nervosität", "Erschöpfung", "Burnout", "Depression", "Sorgen"], crisis: true,
    what: "Stress ist eine normale Reaktion auf Belastung. Hält er an oder werden Ängste stark, kann das krank machen. Angststörungen und Depressionen sind häufig und werden ärztlich oder psychotherapeutisch behandelt; sie sind keine Charakterschwäche.",
    triggers: ["Dauerbelastung ohne Erholung (Arbeit, Pflege, Geldsorgen)", "Schlafmangel", "Alkohol, Nikotin und viel Koffein", "Einsamkeit und fehlende Unterstützung"],
    ideas: [{ label: "Pausen, Bewegung, Schlaf", kind: "alltag", text: "Erholung gezielt einplanen; Bewegung im Freien hilft vielen." }, { label: "Atemübungen", kind: "studie", text: "Können Anspannung und Angst kurzfristig verringern; kein Ersatz für Behandlung.", claim: "atem-angst" }, { label: "Achtsamkeit und Meditation", kind: "studie", text: "Mäßig belastbare Hinweise auf weniger Angst und depressive Symptome.", claim: "atem-achtsamkeit" }, { label: "Gespräch", kind: "alltag", text: "Mit Vertrauten sprechen; bei Bedarf Beratungsstellen, Hausarzt oder Psychotherapie." }],
    flags: ["Gedanken, sich das Leben zu nehmen: sofort Hilfe holen (Notruf 112 oder Telefonseelsorge 0800 111 0 111 / 0800 111 0 222, rund um die Uhr, kostenlos)", "Erste Panikattacke mit Brustschmerz oder Atemnot: kann ein Notfall sein (Notruf 112)", "Niedergeschlagenheit, Interessenverlust oder Angst länger als zwei Wochen", "Alkohol, Beruhigungs- oder Schlafmittel werden zur Bewältigung gebraucht", "Rückzug, Hoffnungslosigkeit oder Gedanken, nicht mehr zu können"] },
  { id: "haut", title: "Hautprobleme", sub: "Akne · Ekzeme · Psoriasis · Rötungen · Juckreiz", icon: "layers", tint: "#e0a070", terms: ["Haut", "Hautprobleme", "Akne", "Ekzem", "Neurodermitis", "Psoriasis", "Rötung", "Juckreiz", "Ausschlag"],
    what: "Die Haut zeigt Entzündungen, Allergien und Infektionen. Viele Hautkrankheiten (Neurodermitis, Psoriasis, Akne) sind chronisch und verlaufen in Schüben. Die Diagnose stellt die Hautärztin oder der Hautarzt.",
    triggers: ["Reizstoffe, Allergene, zu häufiges Waschen mit aggressiven Mitteln", "Stress und Schlafmangel (bei vielen Schüben bemerkt)", "Trockene Luft, Kälte, starkes Schwitzen", "Manche Medikamente und Kosmetika"],
    ideas: [{ label: "Schonende Pflege", kind: "alltag", text: "Milde Reinigung, rückfettende Pflege bei trockener Haut, Reizstoffe meiden; ein Tagebuch zeigt Auslöser." }, { label: "Sonnenschutz", kind: "alltag", text: "Gilt für alle; bei manchen Hautkrankheiten und Medikamenten besonders wichtig." }, { label: "Aloe vera, Ringelblume", kind: "tradition", text: "Als Pflanzen für die Haut überliefert (nicht bewertet); Kontaktallergien sind möglich.", atlas: "ringelblume" }],
    flags: ["Ausschlag mit Fieber oder schlechtem Allgemeinzustand", "Schwellung von Gesicht, Lippen oder Zunge oder Atemnot (Notruf 112)", "Blasen auf Haut und Schleimhaut oder sich schnell ausbreitende Rötung", "Einseitiger, brennender Schmerz mit Bläschen (Verdacht auf Gürtelrose)", "Muttermal oder Fleck, das wächst, blutet oder sich verändert", "Warme, schmerzhafte, eitrige Stellen"] },
  { id: "frauen", title: "Frauengesundheit", sub: "Zyklus · Hormone · Wechseljahre", icon: "family", tint: "#e0507a", terms: ["Frauengesundheit", "Zyklus", "Zyklusbeschwerden", "Regelschmerzen", "Wechseljahre", "Hormone", "Schwangerschaft"],
    what: "Zyklus, Schwangerschaft und Wechseljahre gehen mit hormonellen Veränderungen einher. Beschwerden sind häufig, aber nicht immer harmlos. Über hormonelle Behandlungen entscheiden Frauenärztin und Patientin gemeinsam.",
    triggers: ["Hormonschwankungen im Zyklus und in den Wechseljahren", "Stress, Schlafmangel und Untergewicht oder starkes Übergewicht", "Manche Medikamente (auch die Pille)", "Grunderkrankungen wie Schilddrüsenerkrankungen"],
    ideas: [{ label: "Zyklus-Tagebuch", kind: "alltag", text: "Zeigt Muster und hilft bei der Beratung." }, { label: "Bewegung, Schlaf, Wärme", kind: "alltag", text: "Werden bei Zyklus- und Wechseljahresbeschwerden häufig als angenehm erlebt." }, { label: "Heilpflanzen", kind: "tradition", text: "Viele Pflanzen sind für diesen Bereich überliefert, aber nicht bewertet; in Schwangerschaft und Stillzeit sind die meisten nicht ausreichend geprüft. Johanniskraut kann die Pille abschwächen.", claim: "beschwerde-wechselwirkungen" }],
    flags: ["Sehr starke oder anhaltende Blutungen, Blutungen nach den Wechseljahren", "Starke Unterbauchschmerzen, besonders mit Blutung, Schwindel oder bei möglicher Schwangerschaft (Notruf 112)", "Knoten oder Veränderungen an der Brust", "Fieber mit Unterleibsschmerzen oder ungewohntem Ausfluss", "Schwangere: vor jeder Pflanze, jedem Öl und jedem Präparat fragen"] },
  { id: "schmerz", title: "Chronische Schmerzen", sub: "Rücken · Gelenke · Muskeln · Nerven", icon: "muscle", tint: "#6a9ad0", terms: ["Schmerzen", "Chronische Schmerzen", "Rückenschmerzen", "Rücken", "Gelenkschmerzen", "Gelenke", "Muskelschmerzen", "Nervenschmerzen"],
    what: "Schmerzen gelten als chronisch, wenn sie länger als etwa drei Monate anhalten. Rückenschmerzen sind meist unspezifisch, das heißt ohne gefährliche Ursache; trotzdem können sie sehr belasten.",
    triggers: ["Wenig Bewegung und lange einseitige Haltung", "Stress, Schlafmangel und gedrückte Stimmung (verstärken Schmerz)", "Übergewicht und Rauchen", "Abnutzung, Entzündung oder Nervenschäden (ärztlich abzuklären)"],
    ideas: [{ label: "Aktiv bleiben", kind: "studie", text: "Leitlinien empfehlen Bewegung statt Schonung, dazu Wärme oder Massage.", claim: "beschwerde-rueckenschmerz-aktiv" }, { label: "Akupunktur", kind: "studie", text: "Kleiner Vorteil gegenüber Schein-Akupunktur; Deutung umstritten.", claim: "beschwerde-akupunktur-schmerz" }, { label: "Entspannung und Schlaf", kind: "alltag", text: "Verringern die Schmerzverstärkung; Atemübungen sind eine Möglichkeit.", claim: "atem-angst" }],
    flags: ["Lähmung, Taubheit im Gesäß- oder Genitalbereich oder Störungen von Blase und Darm (Notruf 112)", "Schmerz nach Unfall oder Sturz", "Schmerz mit Fieber, ungewolltem Gewichtsverlust oder nachts stärker", "Brustschmerz oder Druck mit Ausstrahlung in Arm, Kiefer oder Rücken (Notruf 112)", "Zunehmende Schwäche oder Gefühlsstörung in Armen oder Beinen", "Schmerzen, die länger als wenige Wochen nicht besser werden"] },
  { id: "harn", title: "Blasenentzündung", sub: "Harnwege", icon: "drop", tint: "#58b8e8", terms: ["Blasenentzündung", "Harnwegsinfekt", "Harnwege", "Blase"], hidden: true,
    what: "Eine Blasenentzündung (Harnwegsinfekt) ist bei Frauen häufig und meist unkompliziert, kann aber auf die Nieren übergehen. Antibiotika gibt es nur auf ärztliche Verordnung.",
    triggers: ["Kurze weibliche Harnröhre und Keime aus dem Darm", "Zu wenig Trinken, Auskühlen, Geschlechtsverkehr", "Wechseljahre, Diabetes und manche Medikamente"],
    ideas: [{ label: "Viel trinken, Wärme", kind: "alltag", text: "Häufig geraten und als angenehm erlebt; die Wirkung auf den Verlauf ist wenig untersucht." }, { label: "Cranberry zur Vorbeugung", kind: "studie", text: "Verringerte in Studien wiederkehrende Infekte etwas; nicht zur Behandlung geeignet.", claim: "beschwerde-cranberry-vorbeugung" }],
    flags: ["Fieber, Schüttelfrost oder Flankenschmerz (Verdacht auf Nierenbeteiligung)", "Blut im Urin", "Schwangerschaft, Männer und Kinder immer ärztlich abklären", "Keine Besserung nach zwei bis drei Tagen oder häufige Wiederkehr", "Übelkeit und Erbrechen mit Brennen beim Wasserlassen"] },
];
export const ALL_HINT = "Auf der Seite stehen bisher nur diese Beschwerdegruppen; viele Krankheiten fehlen noch (in Vorbereitung). Ein Verzeichnis ersetzt keine Diagnose.";

/** phrases in a search that point to a possible emergency; they are shown before anything else */
export const RED_FLAGS: RegExp[] = [/brustschmerz|brustenge|druck auf der brust|herzinfarkt/i, /atemnot|luftnot|keine luft|ringe nach luft/i, /schlaganfall|lähmung|hängender mundwinkel|sprachstörung|sehstörung/i, /bewusstlos|ohnmacht|krampfanfall/i, /blut (im|beim|im) (stuhl|erbrechen|urin|husten)|bluthusten|schwarzer stuhl|bluterbrechen/i, /vernichtungs|schlimmster kopfschmerz|stärkster kopfschmerz|nackensteif/i, /allergischer schock|anaphyla|zunge geschwollen|schwellung (von |im )?(gesicht|zunge|lippen)/i];
export const CRISIS: RegExp = /suizid|selbstmord|umbringen|nicht mehr leben|leben nehmen|sterben (will|möchte)|will nicht mehr/i;
export const EMERGENCY = {
  title: "Das kann ein Notfall sein",
  text: "Rufe bei akuten Beschwerden dieser Art sofort den Notruf 112 an und warte nicht auf eine Antwort von dieser Seite. Außerhalb der Sprechzeiten erreichst du den ärztlichen Bereitschaftsdienst in Deutschland unter 116 117.",
};
export const CRISIS_TEXT = "Wenn du daran denkst, dir das Leben zu nehmen: Du bist nicht allein. Ruf jetzt die Telefonseelsorge an (0800 111 0 111 oder 0800 111 0 222, rund um die Uhr, kostenlos) oder den Notruf 112. Sprich mit einer Person, der du vertraust.";

export const STEPS: { id: string; title: string; icon: string }[] = [
  { id: "beschwerden", title: "Beschwerden beschreiben", icon: "scroll" }, { id: "lifestyle", title: "Lifestyle & Gewohnheiten", icon: "sprout" },
  { id: "emotion", title: "Emotionale Verfassung", icon: "heart" }, { id: "umgebung", title: "Umgebung & Arbeit", icon: "globe" }, { id: "medizin", title: "Medizinischer Hintergrund", icon: "shield" },
];
export const SINCE = ["seit heute", "seit einigen Tagen", "seit Wochen", "seit Monaten", "seit Jahren"];

export interface SelfItem { id: string; label: string; icon: string; hint: string; tip: string }
/** the self-assessment: 1 = hardly any strain, 5 = strong strain; it only mirrors what the user enters */
export const SELF: SelfItem[] = [
  { id: "wasser", label: "Wasser", icon: "drop", hint: "zu wenig getrunken", tip: "Regelmäßig trinken; wie viel, hängt von Körper, Hitze und Erkrankungen ab (bei Herz- oder Nierenerkrankungen ärztlich abstimmen)." },
  { id: "schlaf", label: "Schlaf", icon: "moon", hint: "zu wenig oder unruhig geschlafen", tip: "Feste Zeiten und eine ruhige Abendroutine; bei anhaltenden Problemen Rat in der Arztpraxis." },
  { id: "ernaehrung", label: "Ernährung", icon: "berry", hint: "unausgewogen oder unregelmäßig", tip: "Regelmäßige Mahlzeiten mit viel Gemüse, Obst und Vollkorn sind die Grundlage der Empfehlungen der Fachgesellschaften." },
  { id: "bewegung", label: "Bewegung", icon: "muscle", hint: "zu wenig Bewegung", tip: "Die WHO empfiehlt Erwachsenen mindestens 150 Minuten mäßig intensive Bewegung pro Woche (Source pending verification)." },
  { id: "stress", label: "Stress", icon: "stress", hint: "stark angespannt", tip: "Pausen, Bewegung und Atemübungen sind übliche Wege; bei anhaltender Anspannung Gespräch und Hilfe suchen." },
  { id: "alkohol", label: "Alkohol", icon: "flask", hint: "oft oder viel", tip: "Weniger ist besser; Hilfe zum Reduzieren gibt es in der Hausarztpraxis und in Suchtberatungsstellen." },
  { id: "nikotin", label: "Nikotin", icon: "flame", hint: "Rauchen oder Dampfen", tip: "Rauchfrei zu werden lohnt sich in jedem Alter; Hilfe gibt es in der Hausarztpraxis und in Rauchstopp-Programmen." },
  { id: "umgebung", label: "Umgebung", icon: "globe", hint: "Lärm, schlechte Luft, Enge", tip: "Lüften, Ruhezeiten und Aufenthalte in der Natur helfen vielen; bei Schadstoffen am Arbeitsplatz den Betriebsarzt fragen." },
  { id: "sozial", label: "Soziale Verbindung", icon: "family", hint: "einsam oder isoliert", tip: "Kontakt zu anderen schützt die Gesundheit; Vereine, Gruppen und Beratungsstellen helfen beim Anknüpfen." },
];

export interface Check { id: string; label: string; note: string }
export const MEDICAL: Check[] = [
  { id: "meds", label: "Ich nehme regelmäßig Medikamente", note: "Pflanzen, Nahrungsergänzung und manche Lebensmittel können die Wirkung verändern. Bitte vor dem Ausprobieren in der Apotheke oder bei der Ärztin fragen; Medikamente nie auf eigene Faust absetzen." },
  { id: "schwanger", label: "Ich bin schwanger oder stille", note: "Viele Pflanzen, Öle und Präparate sind für Schwangerschaft und Stillzeit nicht ausreichend geprüft. Bitte vorher mit Frauenarzt, Hebamme oder Apotheke klären." },
  { id: "vorerkrankung", label: "Ich habe eine Vorerkrankung (z. B. Herz, Niere, Leber, Diabetes, Bluthochdruck)", note: "Trinkmengen, Atemübungen mit Anhalten, Nahrungsergänzung und Pflanzen sollten dann ärztlich abgestimmt werden." },
  { id: "allergie", label: "Ich habe Allergien", note: "Bei Pflanzen aus der Familie der Korbblütler (z. B. Kamille, Echinacea, Arnika) sind Kreuzallergien möglich; bei Hautreaktionen oder Atemnot abbrechen." },
  { id: "kind", label: "Es geht um ein Kind", note: "Kinder sind keine kleinen Erwachsenen: Bei Fieber, Trinkverweigerung oder Auffälligkeiten früh zur Kinderärztin. Honig nicht unter einem Jahr." },
];

export interface Zusammenhang { id: string; label: string; short: string; text: string }
export const EXAMPLE = {
  title: "Kopfschmerzen, Magenbeschwerden & Erschöpfung",
  note: "Beispiel, wie du Zusammenhänge sortieren kannst. Es ist keine Analyse deiner Angaben und keine Diagnose, und die Reihenfolge sagt nichts über die Wahrscheinlichkeit.",
  items: [
    { id: "wasser", label: "Flüssigkeitsmangel", short: "Lehrbuchwissen", text: "Zu wenig Flüssigkeit kann Kopfschmerz, Müdigkeit und Schwindel begünstigen; Durst ist ein später Hinweis." },
    { id: "schlaf", label: "Schlafmangel", short: "Lehrbuchwissen", text: "Zu wenig oder schlechter Schlaf senkt die Schmerzschwelle und begünstigt Kopfschmerz und Erschöpfung." },
    { id: "stress", label: "Stress", short: "Lehrbuchwissen", text: "Anhaltende Anspannung in Nacken und Kiefer führt zu Spannungskopfschmerz; Stress beeinflusst auch Magen und Darm (Darm-Hirn-Achse)." },
    { id: "alkohol", label: "Alkohol / Nikotin", short: "Lehrbuchwissen", text: "Alkohol kann Kopfschmerz auslösen und die Magenschleimhaut reizen; Rauchen begünstigt Magenbeschwerden." },
    { id: "ernaehrung", label: "Ernährung", short: "Lehrbuchwissen", text: "Unregelmäßiges Essen, Fasten sowie sehr fettreiche oder sehr süße Kost können Magenbeschwerden und Kopfschmerz begünstigen." },
    { id: "umwelt", label: "Umwelt (Kälte, Infekte, Luft)", short: "Lehrbuchwissen", text: "Infekte, Kälte, schlechte Luft oder Lärm belasten den Körper und können sich als Kopf- und Magenbeschwerden zeigen." },
  ] as Zusammenhang[],
  tips: ["Regelmäßig über den Tag trinken", "Feste Schlafzeiten einhalten", "Pausen und kurze Spaziergänge einplanen", "Regelmäßig essen, Alkohol und Nikotin reduzieren", "Wenn es nicht besser wird oder Warnzeichen auftreten: Arztpraxis"],
  chakra: "Chakra-Modelle ordnen jedem der sieben Zentren Themen zu (Liste rechts). Eine Zuordnung von Kopf-, Magen- oder Erschöpfungsbeschwerden zu bestimmten Chakren ist eine moderne Deutung ohne Beleg, und Messwerte oder Prozentangaben für Chakren gibt es nicht; die Prozentzahlen der Vorlage waren Platzhalter.",
  details: "So ist das Beispiel gebaut: Die sechs Punkte sind verbreitetes Lehrbuchwissen über Auslöser; für Kopfschmerzen steht die Aussage mit Belegstufe daneben. Die Seite wertet keine Eingaben aus und stellt keine Diagnose; was du unter „Deine Angaben“ einträgst, bleibt in deinem Browser und fließt in deinen Merkzettel.",
};
export const EXAMPLE_TABS: [string, string][] = [["uebersicht", "Übersicht"], ["ursachen", "Mögliche Ursachen"], ["empfehlungen", "Empfehlungen"], ["chakren", "Chakren & Energie"], ["details", "Details"]];

export interface Rec { id: string; title: string; icon: string; items: string[]; text: string; claims: string[]; atlas?: string[]; link?: { label: string; act: "plants" | "nutrients" | "atem" | "crystals" | "chakra" | "selfcheck" | "cultures" } }
/** the eight recommendation cards: topics people use, each with its evidence; there is no personal plan */
export const RECS: Rec[] = [
  { id: "pflanzen", title: "Pflanzen & Kräuter", icon: "leaf", items: ["Pfefferminze", "Kamille", "Ingwer", "Melisse"], atlas: ["pfefferminze", "kamille", "ingwer"], claims: ["beschwerde-pfefferminzoel-reizdarm", "beschwerde-honig-husten", "beschwerde-baldrian-schlaf"], link: { label: "Pflanzenatlas öffnen", act: "plants" },
    text: "Heilpflanzen werden seit Jahrhunderten bei Beschwerden genutzt. Für einzelne gibt es Studien, für viele nur Überlieferung; der Atlas zeigt jeweils die Belegstufe. Pflanzen sind Wirkstoffe: Sie können Nebenwirkungen haben und Medikamente beeinflussen." },
  { id: "ernaehrung", title: "Ernährung", icon: "berry", items: ["Leicht verdauliche Kost", "Weniger Zucker", "Mehr frische Lebensmittel", "Darmfreundliche Lebensmittel"], claims: [], link: { label: "Nährstoffe ansehen", act: "nutrients" },
    text: "Eine abwechslungsreiche Ernährung mit viel Gemüse, Obst und Vollkorn gilt in den Empfehlungen der Fachgesellschaften als Grundlage (Source pending verification). Bei Unverträglichkeiten, Untergewicht oder Erkrankungen gehört die Beratung in ärztliche oder ernährungsmedizinische Hand." },
  { id: "wasser", title: "Wasser & Detox", icon: "drop", items: ["Ausreichend trinken", "Mineralstoffe aus der Nahrung", "Kräutertees", "Schadstoffe meiden"], claims: ["koerper-detox"], link: { label: "Nährstoffe ansehen", act: "nutrients" },
    text: "Wie viel du trinken solltest, hängt von Körper, Hitze, Bewegung und Erkrankungen ab; bei Herz- oder Nierenerkrankungen gilt die ärztliche Vorgabe. Leber und Nieren entgiften dauerhaft von selbst; für „Detox“-Kuren ist keine überzeugende Evidenz bekannt." },
  { id: "atem", title: "Atemtechniken", icon: "lungs", items: ["Langsames Atmen", "4-7-8-Atmung", "Bauchatmung", "Beruhigung des Nervensystems"], claims: ["atem-langsam-hrv", "atem-angst"], link: { label: "Atem-Seite öffnen", act: "atem" },
    text: "Langsame Atemübungen werden zur Entspannung genutzt. Studien zeigen kleine Effekte auf Herzratenvariabilität und Anspannung; sie ersetzen keine Behandlung. Kräftige Atemtechniken mit Atemanhalten können gefährlich sein." },
  { id: "meditation", title: "Meditation & Geist", icon: "sprout", items: ["Achtsamkeit", "Dankbarkeit", "Gedanken beobachten", "Gedankenhygiene"], claims: ["atem-achtsamkeit"], link: { label: "Atem-Seite öffnen", act: "atem" },
    text: "Für Achtsamkeitsprogramme gibt es mäßig belastbare Hinweise auf weniger Angst, depressive Symptome und Schmerz. Bei seelischen Krisen kann Meditation belasten; dann Fachleute fragen." },
  { id: "kristalle", title: "Mineralien & Kristalle", icon: "hex", items: ["Magnesium", "Zink", "Amethyst (Überlieferung: Ruhe)", "Rosenquarz (Überlieferung: Herz)"], atlas: ["amethyst", "rosenquarz"], claims: ["crystal-healing-general"], link: { label: "Kristall-Atlas öffnen", act: "crystals" },
    text: "Magnesium und Zink sind Nährstoffe: Der Bedarf wird meist über die Nahrung gedeckt, Ergänzungen nur nach Rücksprache. Heilsteine wie Amethyst und Rosenquarz sind Überlieferung; für eine Wirkung über den Placebo-Effekt hinaus ist keine kontrollierte Studie bekannt." },
  { id: "koerperarbeit", title: "Akupunktur & Körperarbeit", icon: "balance", items: ["Akupressurpunkte", "Massage", "Wärme / Kälte", "Faszientraining"], claims: ["beschwerde-akupunktur-schmerz", "beschwerde-rueckenschmerz-aktiv"], link: { label: "Alte Kulturen ansehen", act: "cultures" },
    text: "Akupunktur stammt aus der traditionellen chinesischen Medizin; bei chronischen Schmerzen zeigt sich in Studien ein kleiner Vorteil, die Deutung über „Meridiane“ ist nicht belegt. Wärme, Massage und Bewegung werden bei Rückenschmerzen in Leitlinien genannt." },
  { id: "lebensstil", title: "Lebensstil-Anpassungen", icon: "sun", items: ["Mehr Schlaf", "Weniger Alkohol", "Natur & Tageslicht", "Digitale Balance"], claims: ["beschwerde-schlaf-kvt"], link: { label: "Selbsteinschätzung öffnen", act: "selfcheck" },
    text: "Schlaf, Bewegung, Ernährung, Alkohol, Nikotin, Stress und soziale Kontakte beeinflussen die Gesundheit stärker als einzelne Mittel. Kleine, feste Gewohnheiten halten länger als große Vorsätze." },
];

export const NOTES = {
  hinweise: { title: "Wichtige Hinweise", items: ["Die Inhalte ersetzen keine medizinische Diagnose oder Behandlung.", "Kläre Wechselwirkungen mit Medikamenten mit deiner Ärztin oder Apotheke.", "Bei schweren oder anhaltenden Beschwerden suche medizinische Hilfe auf."], button: "Mehr erfahren",
    more: "Diese Seite sammelt Wissen und trennt dabei Lehrbuchwissen, Überlieferung und Behauptungen. Jede Aussage über eine Wirkung trägt eine Belegstufe (von „nicht belegt“ bis „gesichert“) und eine Quelle; im Pilot sind alle Aussagen noch nicht von Fachleuten geprüft. Die Seite fragt nichts ab, was sie auswerten könnte: Was du einträgst, bleibt in deinem Browser. Bei Beschwerden ist die Hausarztpraxis die erste Anlaufstelle." },
  wechsel: { title: "Mögliche Wechselwirkungen", items: ["Einige Pflanzen, Nahrungsergänzungsmittel oder Methoden können mit Medikamenten interagieren.", "Bitte informiere dich und sprich bei Unsicherheiten mit medizinischem Fachpersonal."], button: "Beispiele ansehen" },
  arzt: { title: "Wann zum Arzt?", items: ["Bei starken, anhaltenden oder sich verschlimmernden Beschwerden, Fieber, Blut im Stuhl, Atemnot, Brustschmerzen oder anderen Warnzeichen solltest du unbedingt einen Arzt aufsuchen."], button: "Warnzeichen anzeigen" },
};
export interface Interaction { name: string; text: string }
export const INTERACTIONS: Interaction[] = [
  { name: "Johanniskraut", text: "Beschleunigt den Abbau vieler Medikamente und kann ihre Wirkung abschwächen (zum Beispiel hormonelle Verhütungsmittel, bestimmte Blutverdünner und Mittel nach Transplantationen); mit Antidepressiven kann es zu einem Serotonin-Überschuss kommen." },
  { name: "Grapefruitsaft", text: "Hemmt den Abbau mancher Medikamente und kann ihre Wirkung verstärken (zum Beispiel einige Cholesterinsenker und Blutdruckmittel)." },
  { name: "Vitamin-K-reiche Kost (Spinat, Brokkoli, Grünkohl)", text: "Verändert bei Therapie mit Marcumar-artigen Gerinnungshemmern die Gerinnung; gleichmäßig essen und Änderungen mit der Praxis besprechen." },
  { name: "Süßholz / Lakritze", text: "Größere Mengen über längere Zeit können Kalium senken und den Blutdruck erhöhen; wichtig bei Entwässerungs- und Herzmitteln." },
  { name: "Calcium, Magnesium, Eisen, Zink", text: "Können manche Antibiotika (zum Beispiel Tetracycline und Chinolone) im Darm binden; deshalb mit zeitlichem Abstand einnehmen und in der Apotheke fragen." },
  { name: "Ginkgo-, Knoblauch- und Fischölpräparate", text: "Können möglicherweise die Blutgerinnung leicht beeinflussen; vor Operationen und bei Blutverdünnern ansprechen." },
];
export const INTERACTION_NOTE = "Das ist eine Auswahl bekannter Beispiele (Aussage mit Belegstufe), kein Prüfwerkzeug und nicht vollständig. Ob etwas zu deinen Medikamenten passt, prüft die Apotheke. Medikamente nie ohne Rücksprache absetzen.";
export const WARN_GENERAL = {
  emergency: ["Anhaltender Druck oder Schmerz in der Brust, besonders mit Atemnot, Schweiß oder Ausstrahlung in Arm, Kiefer oder Rücken", "Plötzliche Lähmung, Taubheit, Sprach- oder Sehstörung, hängender Mundwinkel", "Schwere Atemnot, Bewusstlosigkeit, Krampfanfall", "Starke Blutungen oder Bluterbrechen", "Plötzlicher, stärkster Kopfschmerz", "Schwellung von Zunge oder Gesicht mit Atemnot (allergische Reaktion)"],
  soon: ["Fieber über 39 °C oder länger als drei Tage", "Blut im Stuhl oder Urin", "Ungewollter Gewichtsverlust", "Beschwerden, die sich verschlimmern oder länger als einige Wochen anhalten", "Neu auftretende starke Schmerzen", "Anhaltende Niedergeschlagenheit oder Angst"],
  text: "Bei Notfällen ruf den Notruf 112 an. Außerhalb der Sprechzeiten erreichst du den ärztlichen Bereitschaftsdienst in Deutschland unter 116 117. In einer seelischen Krise hilft die Telefonseelsorge (0800 111 0 111 oder 0800 111 0 222, rund um die Uhr, kostenlos).",
};
export const PLAN_NOTE = "Das ist kein Behandlungsplan, sondern ein Merkzettel für das Gespräch in der Praxis oder Apotheke. Er entsteht nur in deinem Browser und wird nirgends gespeichert oder gesendet.";
export const BESCHWERDEN_NOTICE = "Pilot: nicht fachlich geprüft. Informationsangebot – keine medizinische Beratung, keine Diagnose, keine Behandlungsanleitung. Medikamente nie ohne Rücksprache mit Ärztin oder Arzt absetzen oder ersetzen. Bei Notfällen: Notruf 112. Wirkungen von Pflanzen, Methoden und „Frequenzen“ sind als Aussagen mit Belegstufe gekennzeichnet; Texte zu Anatomie und Ursachen sind Lehrbuchwissen (Source pending verification).";
export const HERO = { eyebrow: "Wissen · Natur · Ganzheitlichkeit", title: "Beschwerden verstehen. Natürlich Lösungen finden.", lead: "Entdecke, wie Ernährung, Pflanzen, Lebensstil, Atem, Frequenzen und dein inneres Gleichgewicht deine Gesundheit beeinflussen – und finde natürliche Wege, dein Wohlbefinden zu unterstützen." };
