/**
 * Data of the main frequency page "Alles schwingt." (src/ui/frequency.ts), built after the user's reference picture
 * (docs/MOCKUP-NOTES.md, page 26). Physical statements are textbook knowledge (Source pending verification); effects that are
 * only claimed ("Heilfrequenzen", Solfeggio) are shown as lore with the evidence level of their claim. The mockup's "Signal Index"
 * (+68) and its effect scores are placeholders without a measurement; the page shows the evidence level of the real claims instead.
 */
import type { SlotName } from "../assets/registry";

export interface Orb { id: string; title: string[]; icon: string; tint: string; x: number; y: number; text: string; claim?: string; cat?: string }

/** the six circles around the figure of the hero (x, y = centre of the circle in percent of the stage) */
export const ORBS: Orb[] = [
  { id: "worte", title: ["Worte", "Gedanken", "Emotionen"], icon: "brain", tint: "#58d6e8", x: 30, y: 17, cat: "wort",
    text: "Die Stimme ist Schall: Die Grundfrequenz der Sprechstimme liegt bei Erwachsenen grob zwischen 85 und 255 Hz. Gehirnrhythmen im EEG liegen zwischen etwa 0,5 und über 30 Hz. Dass Worte oder Gedanken Wasser, Zellen oder Materie verändern, ist nicht belegt." },
  { id: "licht", title: ["Licht", "Sonne", "Farbfrequenzen"], icon: "sun", tint: "#ffa43c", x: 77, y: 13,
    text: "Licht ist eine elektromagnetische Welle. Sichtbares Licht hat Frequenzen von etwa 400 bis 790 Terahertz (Wellenlängen rund 750 bis 380 nm): Rot liegt am niedrigen, Violett am hohen Ende." },
  { id: "nahrung", title: ["Nahrung", "Pflanzen", "Getränke"], icon: "leaf", tint: "#6fd45a", x: 8, y: 46, cat: "nahrung", claim: "freq-pflanze-vibration",
    text: "Pflanzen nehmen Licht, Berührung und auch Schwingungen wahr; erste Laborstudien zeigen z. B. Abwehrreaktionen auf Vibrationen fressender Raupen. Dass Lebensmittel oder Getränke eine eigene „Frequenz“ tragen, die auf den Körper übergeht, ist nicht belegt." },
  { id: "klaenge", title: ["Klänge", "Musik", "Resonanz"], icon: "sound", tint: "#a05aff", x: 80, y: 47, cat: "klang",
    text: "Schall ist eine mechanische Schwingung. Hörbar sind etwa 20 bis 20.000 Hz. Ein Ton hat Frequenz, Lautstärke und Klangfarbe; Resonanz verstärkt ihn, wo ein Körper oder Raum seine Eigenfrequenz trifft." },
  { id: "materialien", title: ["Materialien", "Metalle", "Kristalle"], icon: "hex", tint: "#c07bff", x: 26, y: 80, cat: "material",
    text: "Jedes Bauteil hat Eigenfrequenzen, die von Form, Größe und Steifigkeit abhängen. Schwingquarze in Uhren schwingen mit sehr genau 32.768 Hz; Glocken und Stimmgabeln klingen je nach Metall und Form unterschiedlich." },
  { id: "umgebung", title: ["Umgebung", "Natur", "Orte", "Elektromagnetische Felder"], icon: "globe", tint: "#7ad0ff", x: 80, y: 80, claim: "freq-schumann",
    text: "Die Erde hat ein Magnetfeld, und zwischen Boden und Ionosphäre schwingt ein Hohlraum, den Blitze anregen (Schumann-Resonanzen, Grundton etwa 7,8 Hz). Radio, Mobilfunk und WLAN senden bei Megahertz bis Gigahertz." },
];

export const HERO_CHIPS: { id: string; label: string; to: string; text: string }[] = [
  { id: "klang", label: "Klang", to: "fq-explorer", text: "Klang ist Schall: Druckschwankungen der Luft. Im Frequenz Explorer kannst du Töne hören und ihre Muster sehen." },
  { id: "licht", label: "Licht", to: "orb:licht", text: "" },
  { id: "kymatik", label: "Kymatik", to: "fx", text: "Kymatik zeigt, wie Schwingungen Sand oder Wasser zu Mustern ordnen (Chladni-Figuren). Die Seite „Kymatik“ rechnet sie live." },
  { id: "resonanz", label: "Resonanz", to: "power:resonanz", text: "" },
  { id: "materie", label: "Materie", to: "world:materialien", text: "" },
  { id: "medizin", label: "Medizin", to: "power:medizin", text: "" },
  { id: "bewusstsein", label: "Bewusstsein", to: "orb:worte", text: "" },
];

/** categories of the signal analyzer; items come from the atlas, the claims and the frequency list */
export const CATS: { id: string; label: string; icon: string }[] = [
  { id: "pflanze", label: "Pflanze", icon: "sprout" }, { id: "nahrung", label: "Nahrung", icon: "berry" }, { id: "material", label: "Material", icon: "hex" },
  { id: "wort", label: "Wort", icon: "book" }, { id: "getraenk", label: "Getränk", icon: "drop" }, { id: "kristall", label: "Kristall", icon: "sparkle" }, { id: "klang", label: "Klang", icon: "sound" },
];
export const CAT_EMPTY: Record<string, string> = {
  wort: "Zu Worten und Gedanken gibt es noch keine veröffentlichte Aussage. Entwürfe (zum Beispiel zu Worten und Wasser) warten auf die Fachprüfung und sind deshalb nicht sichtbar.",
  getraenk: "Zu Getränken gibt es noch keine veröffentlichte Aussage. Der Bereich ist in Vorbereitung.",
};

/** how a level is placed on the gauge (−1 = refuted … 0 = claimed … +1 = established) and what the pill says */
export const LEVEL_POS: Record<string, number> = { refuted: -0.95, unsupported: -0.55, claimed: 0, hypothesis: 0.3, historical: 0.5, supported: 0.62, established: 0.95 };
export const LEVEL_PILL: Record<string, string> = { refuted: "Widerlegt", unsupported: "Nicht belegt", claimed: "Noch ungeprüft", hypothesis: "Erste Hinweise", historical: "Historisch dokumentiert", supported: "Belegt", established: "Gesichert" };
export const GAUGE_LABELS = ["Widerlegt", "Nicht belegt", "Behauptung", "Belegt", "Gesichert"];

export interface Power { id: string; title: string; sub: string; text: string; button: string; slot: SlotName; claims: string[]; detail: string; links?: { label: string; act: "fx" | "claim" }[] }
export const POWER: Power[] = [
  { id: "radio", title: "Wie beim Radio", sub: "Finde die Frequenz. Finde das Signal.", slot: "freq-kraft-radio", button: "Mehr erfahren", claims: ["freq-pflanze-vibration"],
    text: "Wie ein Radio nur den richtigen Sender wiedergibt, kann auch die Natur auf bestimmte Frequenzen „reagieren“.",
    detail: "Ein Radio enthält einen Schwingkreis aus Spule (L) und Kondensator (C). Er spricht am stärksten bei seiner Eigenfrequenz f = 1 / (2π·√(L·C)) an; am Abstimmknopf ändert man C und damit die Frequenz, alle anderen Sender werden schwächer. In der Natur gibt es dasselbe Prinzip: Im Innenohr spricht jede Stelle der Basilarmembran auf eine andere Tonhöhe an (Georg von Békésy, Nobelpreis 1961). Dass Pflanzen auf Vibrationen reagieren können, zeigt eine Laborstudie mit Raupenfraß (Aussage unten, erste Hinweise)." },
  { id: "resonanz", title: "Resonanz", sub: "Triff die Eigenfrequenz.", slot: "freq-kraft-resonanz", button: "Resonanz entdecken", claims: [],
    text: "Jedes System hat natürliche Resonanzfrequenzen. Trifft die richtige Frequenz, kann die Reaktion verstärkt werden – manchmal dramatisch.",
    detail: "Wird ein schwingungsfähiges System (Schaukel, Glas, Brücke, Schwingkreis) im Takt seiner Eigenfrequenz angeregt, schaukelt es sich auf; wie hoch, hängt von der Dämpfung ab. Je weniger Dämpfung, desto höher und schmaler der Resonanzgipfel. Ein oft genanntes Beispiel, die Tacoma-Narrows-Brücke (1940), gilt nach heutiger Analyse als selbsterregtes Flattern und nicht als einfache Resonanz. Die Kurve unten ist die Lehrbuchformel eines gedämpften Oszillators." },
  { id: "levitation", title: "Levitation", sub: "Schall kann Materie bewegen.", slot: "freq-kraft-levitation", button: "Beispiele ansehen", claims: ["acoustic-levitation-small", "acoustic-levitation"],
    text: "Mit gezielten Schallwellen (z. B. Ultraschall) können Objekte im Schallfeld stabilisiert und bewegt werden – von kleinen Partikeln bis zu größeren Objekten.",
    detail: "Im Labor halten stehende Ultraschallwellen kleine, leichte Teilchen (Wassertropfen, Styroporkügelchen, Insekten) in den Druckknoten in der Schwebe; die Knoten liegen eine halbe Wellenlänge auseinander. Die Kräfte sind schwach: Schwere Objekte lassen sich so nicht tragen. Die Erzählung, Stein-Blöcke seien in der Antike mit Schall bewegt worden, ist nicht belegt (Aussage unten). „Größere Objekte“ der Vorlage heißt in der Forschung: Tropfen, Kügelchen und Bauteile im Millimeter- bis Zentimeterbereich." },
  { id: "medizin", title: "Medizin & Heilung", sub: "Gezielte Frequenzen für Gesundheit.", slot: "freq-kraft-medizin", button: "Studien & Anwendungen", claims: ["freq-hifu", "rife"],
    text: "Frequenzbasierte Technologien wie fokussierter Ultraschall werden erforscht und in der Medizin eingesetzt, um z. B. Gewebe gezielt zu beeinflussen.",
    detail: "Fokussierter Ultraschall bündelt Schall (etwa 0,2–1 MHz) in einem Brennpunkt von wenigen Millimetern und erhitzt dort Gewebe, ohne zu schneiden; er wird in ärztlicher Hand z. B. beim essentiellen Tremor eingesetzt, weitere Einsatzgebiete werden untersucht. Ultraschall-Bildgebung (2–15 MHz) und Stoßwellen gegen Nierensteine nutzen ebenfalls Schall. Das sind Verfahren mit Geräten und ärztlicher Aufsicht, keine Selbstanwendung und nicht mit „Heilfrequenzen“ gleichzusetzen: Für die Rife-Geräte und für Solfeggio-Töne gibt es keine überzeugenden Belege (Aussagen unten). Keine medizinische Beratung." },
];

export interface Hz { hz: number; label: string; trad: string }
/** the nine popular frequencies of the explorer; tradition = what lore attributes to them (claim freq-solfeggio, not supported) */
export const HZ_LORE: Hz[] = [
  { hz: 174, label: "Befreiung", trad: "Spannung lösen, Sicherheit" },
  { hz: 285, label: "Heilung", trad: "Erneuerung von Gewebe" },
  { hz: 396, label: "Blockaden", trad: "Angst und Schuldgefühle lösen" },
  { hz: 417, label: "Veränderung", trad: "Wandel, Neubeginn" },
  { hz: 432, label: "Harmonie", trad: "Entspannung, Harmonie" },
  { hz: 528, label: "Transformation", trad: "Wandel; oft mit „DNA-Reparatur“ verbunden – nicht belegt" },
  { hz: 639, label: "Verbindung", trad: "Beziehungen, Zusammenhalt" },
  { hz: 741, label: "Intuition", trad: "Ausdruck, Reinigung, Intuition" },
  { hz: 852, label: "Erwachen", trad: "Intuition, Erwachen" },
];
export const HZ_MIN = 20, HZ_MAX = 1000;
export const HZ_NOTE_432 = "432 Hz wird oft als „natürliche Stimmung“ beschrieben. Messbar ist nur: Es liegt rund 32 Cent unter dem heutigen Kammerton a′ = 440 Hz. Eine heilende Wirkung ist nicht belegt; es gibt eine kleine Pilotstudie.";

const NOTES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
/** nearest note of the equal-tempered scale (a′ = 440 Hz) and the deviation in cents */
export function nearestNote(hz: number): { name: string; cents: number } {
  const n = 12 * Math.log2(hz / 440) + 69, r = Math.round(n);
  return { name: `${NOTES[((r % 12) + 12) % 12]}${Math.floor(r / 12) - 1}`, cents: Math.round((n - r) * 100) };
}
export const noteText = (hz: number) => { const n = nearestNote(hz); return `${n.name} (${n.cents > 0 ? "+" : n.cents < 0 ? "−" : "±"}${Math.abs(n.cents)} Cent)`; };

export interface World { id: string; title: string; sub: string; icon: string; slot: SlotName; text: string; claims: string[]; link: { label: string; act: "energy" | "anatomy" | "minerals" | "cultures" | "universe" } }
export const WORLD: World[] = [
  { id: "natur", title: "Natur & Elemente", sub: "Wasser · Wind · Donner · Vulkane · Erde · Magnetfelder", icon: "globe", slot: "freq-welt-natur", claims: ["freq-schumann"], link: { label: "Energie-Seite öffnen", act: "energy" },
    text: "Die Natur schwingt in allen Größenordnungen: Wellen und Donner, Vulkane (Infraschall unter 20 Hz), das Erdmagnetfeld und die Schumann-Resonanzen des Hohlraums zwischen Erde und Ionosphäre (Grundton etwa 7,8 Hz)." },
  { id: "koerper", title: "Körper & Gesundheit", sub: "Gehirnwellen · Zellkommunikation · Regeneration · Medizin", icon: "brain", slot: "freq-welt-koerper", claims: ["membrane-potential"], link: { label: "Zum menschlichen Körper", act: "anatomy" },
    text: "Das Herz schlägt in Ruhe etwa einmal pro Sekunde (≈ 1 Hz), die Atmung liegt bei 0,2–0,3 Hz. Gehirnrhythmen im EEG werden nach Frequenz benannt: Delta 0,5–4 Hz, Theta 4–8, Alpha 8–13, Beta 13–30, Gamma darüber. Zellen sind elektrisch geladen (Membranpotenzial)." },
  { id: "materialien", title: "Materialien & Struktur", sub: "Kristalle · Metalle · Formen · Resonanz · Kymatik", icon: "hex", slot: "freq-welt-materialien", claims: ["mineral-piezo", "chladni"], link: { label: "Mineral Atlas öffnen", act: "minerals" },
    text: "Kristalle haben eine geordnete Struktur und schwingen, wenn man sie anregt: Quarz erzeugt unter Druck Spannung und taktet Uhren. Ernst Chladni machte um 1787 sichtbar, wie Platten in Mustern schwingen." },
  { id: "technologie", title: "Technologie & Energie", sub: "Kommunikation · Energieübertragung · Resonanztechnologie", icon: "bolt", slot: "freq-welt-technologie", claims: [], link: { label: "Energie-Seite öffnen", act: "energy" },
    text: "Radio, Mobilfunk und WLAN übertragen Information auf Trägerfrequenzen (kHz bis GHz). Das Stromnetz schwingt in Europa mit 50 Hz. Induktives Laden und Schwingquarze nutzen Resonanz. Das sind gemessene, technisch genutzte Effekte." },
  { id: "kulturen", title: "Alte Kulturen", sub: "Pyramiden · Tempel · Megalithen · Frequenz & Architektur", icon: "scroll", slot: "freq-welt-kulturen", claims: ["acoustic-levitation"], link: { label: "Alte Kulturen öffnen", act: "cultures" },
    text: "Die Archäoakustik untersucht, wie alte Räume klingen (Nachhall, Resonanzen). Zu einzelnen Bauten gibt es Messungen; daraus eine Wirkung auf Menschen abzuleiten, ist offen. Erzählungen wie die Schall-Levitation von Steinen sind nicht belegt." },
  { id: "kosmos", title: "Kosmos", sub: "Planeten · Sterne · Galaxien · kosmische Schwingungen", icon: "atom", slot: "freq-welt-kosmos", claims: [], link: { label: "Zum Universum", act: "universe" },
    text: "Sterne schwingen: Die Sonne zeigt Oszillationen mit einer Periode von rund fünf Minuten (≈ 3 mHz). Die erste direkt gemessene Gravitationswelle (2015) lag mit etwa 35 bis 250 Hz im hörbaren Frequenzbereich." },
];

export const CLOSING = { title: ["Dein Körper empfängt", "ständig Informationen."], ask: "Die Frage ist: Welche Frequenz sendest du ihm?", button: "Die Frequenz-Welt betreten", note: "Leitgedanke der Seite, kein belegter Satz. Sinnesorgane nehmen ständig Reize auf; dass der Körper beliebige „Frequenzen“ empfängt und von ihnen gelenkt wird, ist nicht belegt." };
export const FREQ_NOTICE = "Pilot: nicht fachlich geprüft. Die physikalischen Aussagen sind Lehrbuchwissen (Source pending verification), Wirkungen von „Frequenzen“ sind überliefert oder behauptet und mit ihrer Belegstufe gekennzeichnet. Information, keine medizinische Beratung; fokussierter Ultraschall und andere Verfahren gehören in ärztliche Hand.";
export const ANALYZER_NOTE = "Die Vorlage zeigte hier einen „Signal Index“ (+68) mit Wirkwerten wie Stimmung +75. Ein solcher Wert wäre eine erfundene Messung. Die Anzeige zeigt stattdessen die Belegstufe der Aussagen; die Balken sind Belegstufen, keine Wirkstärken.";
