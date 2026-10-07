/**
 * Data of the breath landing page "Dein Atem verbindet alles." (src/ui/atem.ts), built after the user's reference picture
 * (docs/MOCKUP-NOTES.md, page 27). Textbook statements are marked "Source pending verification"; effects of breathing exercises are
 * claims with their evidence level (content/claims/atem-*.json), never statements in the site's own voice. The mockup's list of
 * "Positive Effekte" therefore shows what is claimed or studied, with the level of each claim.
 */
import type { Phase } from "./breath";

export const HERO = {
  eyebrow: "Atmen & Meditation",
  title: "Dein Atem verbindet alles.",
  lead: "Der Atem ist mehr als nur Sauerstoff. Er beeinflusst dein Nervensystem, deine Gedanken, deine Emotionen und jeden Bereich deines Körpers. Entdecke die Kraft deines Atems und lerne, sie bewusst zu nutzen.",
};

export interface Area { id: string; title: string; sub: string; icon: string; tint: string; text: string; claim?: string }
/** the five areas listed at the right of the hero; the text says what is known and what is only claimed */
export const AREAS: Area[] = [
  { id: "gehirn", title: "Gehirn", sub: "Klarheit · Fokus · Zirbeldrüse", icon: "brain", tint: "#58d6e8", claim: "atem-zirbeldruese",
    text: "Im Hirnstamm liegt das Atemzentrum, das die Atmung ohne dein Zutun steuert; bewusst kannst du Tempo und Tiefe verändern. Ob Atemübungen Klarheit und Fokus fördern, ist für die meisten Techniken nicht untersucht. Die Zirbeldrüse bildet Melatonin und wird über Licht gesteuert; dass Atmung sie „aktiviert“, ist eine Überlieferung ohne Beleg." },
  { id: "nerven", title: "Nervensystem", sub: "Ruhe · Balance · Stressreduktion", icon: "heart", tint: "#ff5a6a", claim: "atem-langsam-hrv",
    text: "Das vegetative Nervensystem hat zwei Gegenspieler: Der Sympathikus macht leistungsbereit, der Parasympathikus (mit dem Vagusnerv) fördert Ruhe und Erholung. Langsames Atmen mit etwa sechs Atemzügen pro Minute geht in Studien mit höherer Herzratenvariabilität einher." },
  { id: "atmung", title: "Atmung", sub: "Sauerstoff · Energie · Zellfunktion", icon: "lungs", tint: "#58d6e8",
    text: "In den Lungenbläschen tritt Sauerstoff ins Blut über und Kohlendioxid wird abgegeben. Die Zellen nutzen den Sauerstoff in den Mitochondrien, um aus Nährstoffen den Energieträger ATP zu gewinnen (Zellatmung). Lehrbuchwissen." },
  { id: "koerper", title: "Körper", sub: "Immunsystem · Regeneration", icon: "stress", tint: "#c8d0e0", claim: "atem-immun-wimhof",
    text: "Atmung, Herz und Kreislauf sind eng gekoppelt. Dass Atemübungen das Immunsystem „stärken“ oder die Regeneration beschleunigen, ist nicht belegt; es gibt eine kleine Studie zu einem Training aus Atmung, Kälte und Meditation (Aussage mit Belegstufe)." },
  { id: "geist", title: "Geist", sub: "Achtsamkeit · Emotionale Balance", icon: "flower", tint: "#b07cff", claim: "atem-achtsamkeit",
    text: "Viele Meditationsformen lenken die Aufmerksamkeit auf den Atem. Für Achtsamkeitsprogramme gibt es mäßig belastbare Hinweise auf weniger Angst, depressive Symptome und Schmerz; sie ersetzen keine Behandlung." },
];

export interface TopCard { id: string; title: string; sub: string; icon: string; tint: string; to: string }
export const TOP_CARDS: TopCard[] = [
  { id: "techniken", title: "Atemtechniken", sub: "Für jeden Zweck", icon: "target", tint: "#d89a4a", to: "at-technik" },
  { id: "nerven", title: "Nervensystem", sub: "Ruhe · Aktivierung · Balance", icon: "bolt", tint: "#4a8aff", to: "body:nerven" },
  { id: "wissen", title: "Wirkung & Wissenschaft", sub: "Was im Körper passiert", icon: "microscope", tint: "#7a6af0", to: "science" },
  { id: "tradition", title: "Traditionelles Wissen", sub: "Alte Kulturen & moderne Forschung", icon: "scroll", tint: "#c0a070", to: "more:tradition" },
];

export interface Effect { label: string; icon: string; claim?: string }
export interface Technique {
  id: string; goal: string; icon: string; title: string; sub: string; text: string; tags: string[];
  steps: { title: string; text: string }[]; pattern: [Phase, number][] | null; noTimer?: string;
  effects: Effect[]; details: [string, string][]; variants: string[]; warning?: string;
}

/** the eight goals of the technique finder, each with one technique; claims are linked, nothing is promised */
export const TECHNIQUES: Technique[] = [
  { id: "stress", goal: "Stress & Angst lösen", icon: "stress", title: "4-7-8 Atmung", sub: "Ruhe für Körper und Geist",
    text: "Diese einfache Technik beruht auf einem langen Ausatmen und einer Atempause. Sie wird häufig bei Stress und Einschlafproblemen genutzt; wie gut ihre Wirkung belegt ist, steht rechts bei den Aussagen.",
    tags: ["Beruhigung", "Stress", "Einschlafen"],
    steps: [{ title: "Einatmen", text: "4 Sekunden durch die Nase" }, { title: "Atem halten", text: "7 Sekunden" }, { title: "Ausatmen", text: "8 Sekunden durch den Mund" }, { title: "Wiederholen", text: "4–8 Runden, am Anfang lieber weniger" }],
    pattern: [["in", 4], ["hold", 7], ["out", 8]],
    effects: [{ label: "Beruhigt das Nervensystem", icon: "brain", claim: "atem-langsam-hrv" }, { label: "Verringert Anspannung und Angst", icon: "shield", claim: "atem-angst" }, { label: "Fördert besseren Schlaf", icon: "moon", claim: "atem-478-schlaf" }, { label: "Senkt den Blutdruck", icon: "heart", claim: "atem-blutdruck" }, { label: "Bringt den Geist zur Ruhe", icon: "sprout", claim: "atem-achtsamkeit" }, { label: "Unterstützt emotionale Balance", icon: "flower", claim: "atem-stimmung" }],
    details: [["Herkunft", "Durch Andrew Weil bekannt geworden, angelehnt an Atemlenkung aus dem Yoga (Source pending verification)."], ["Dauer", "19 Sekunden pro Atemzug; 4 Runden dauern etwa 1 Minute 16 Sekunden."], ["Haltung", "Aufrecht sitzen oder liegen, Schultern locker."], ["Vorsicht", "Bei Schwindel oder Unwohlsein beenden und normal weiteratmen. Bei Herz- oder Lungenerkrankungen und in der Schwangerschaft vorher ärztlich abklären, besonders vor dem langen Atemanhalten."]],
    variants: ["Einsteiger: 2-3-4 (alles halb so lang)", "Ohne Anhalten: nur 4 Sekunden ein, 8 Sekunden aus", "Im Liegen vor dem Einschlafen"] },
  { id: "schlaf", goal: "Besser schlafen", icon: "moon", title: "Langes Ausatmen 4-6", sub: "Ein ruhiger Abend-Rhythmus",
    text: "Das Ausatmen ist etwas länger als das Einatmen; gleichmäßig und ohne Anstrengung. Als Abendroutine verbreitet, für den Schlaf selbst gibt es zu diesem Rhythmus keine belastbaren Studien.",
    tags: ["Abendroutine", "Ruhe"],
    steps: [{ title: "Einatmen", text: "4 Sekunden durch die Nase" }, { title: "Ausatmen", text: "6 Sekunden, Lippen locker" }, { title: "Weiteratmen", text: "8–10 Atemzüge, dann normal atmen" }, { title: "Spüren", text: "Wie sich Brust und Bauch bewegen" }],
    pattern: [["in", 4], ["out", 6]],
    effects: [{ label: "Beruhigt das Nervensystem", icon: "brain", claim: "atem-langsam-hrv" }, { label: "Verringert Anspannung und Angst", icon: "shield", claim: "atem-angst" }, { label: "Wirkung auf den Schlaf", icon: "moon" }],
    details: [["Dauer", "10 Sekunden pro Atemzug; 6 Runden dauern 1 Minute."], ["Haltung", "Im Liegen oder bequemen Sitzen."], ["Hinweis", "Bei anhaltenden Schlafproblemen gehört die Abklärung in ärztliche Hand."]],
    variants: ["Sanfter: 3-5", "Mit der Hand auf dem Bauch"] },
  { id: "energie", goal: "Mehr Energie", icon: "bolt", title: "Wache Atmung 3-3", sub: "Kurz, gleichmäßig, aufrecht",
    text: "Kurze, gleichmäßige Atemzüge im aufrechten Sitzen oder beim Gehen. Es wird nichts angehalten und nicht schneller geatmet als bequem. Eine belegte Wirkung auf die Energie gibt es nicht.",
    tags: ["Aufrichten", "Wachheit"],
    steps: [{ title: "Aufrichten", text: "Aufrecht sitzen oder stehen, Schultern locker" }, { title: "Einatmen", text: "3 Sekunden durch die Nase" }, { title: "Ausatmen", text: "3 Sekunden, ohne zu pressen" }, { title: "Weiter", text: "1–2 Minuten, dann normal atmen" }],
    pattern: [["in", 3], ["out", 3]],
    effects: [{ label: "Wirkung auf die Energie", icon: "bolt" }],
    details: [["Dauer", "6 Sekunden pro Atemzug."], ["Vorsicht", "Nicht schneller oder tiefer atmen als angenehm; bei Schwindel oder Kribbeln aufhören."]], variants: ["Im Gehen: Schritte zählen (3 ein, 3 aus)"] },
  { id: "fokus", goal: "Fokus & Konzentration", icon: "target", title: "Box-Atmung 4-4-4-4", sub: "Vier gleich lange Phasen",
    text: "Einatmen, halten, ausatmen, halten, jeweils gleich lang, wie die Seiten eines Quadrats. Sie wird in Training und Ausbildung als Konzentrationsübung genannt; für eine Wirkung auf den Fokus gibt es keine veröffentlichte Aussage.",
    tags: ["Konzentration", "Gleichmaß"],
    steps: [{ title: "Einatmen", text: "4 Sekunden durch die Nase" }, { title: "Halten", text: "4 Sekunden" }, { title: "Ausatmen", text: "4 Sekunden" }, { title: "Halten", text: "4 Sekunden, dann von vorn" }],
    pattern: [["in", 4], ["hold", 4], ["out", 4], ["hold", 4]],
    effects: [{ label: "Wirkung auf den Fokus", icon: "target" }, { label: "Beruhigt das Nervensystem", icon: "brain", claim: "atem-langsam-hrv" }],
    details: [["Dauer", "16 Sekunden pro Durchgang."], ["Vorsicht", "Wie bei jeder Atempause: bei Schwindel beenden; bei Herz-/Lungenerkrankungen und in der Schwangerschaft vorher ärztlich abklären."]], variants: ["Einsteiger: 3-3-3-3", "Ohne Halten nach dem Ausatmen: 4-4-4"] },
  { id: "emotion", goal: "Emotionale Balance", icon: "heart", title: "Kohärente Atmung 5-5", sub: "Etwa sechs Atemzüge pro Minute",
    text: "Gleichmäßig fünf Sekunden ein und fünf Sekunden aus. Dieser Rhythmus liegt im Bereich, der in Studien zur Herzratenvariabilität am besten untersucht ist.",
    tags: ["Gleichmaß", "HRV"],
    steps: [{ title: "Einatmen", text: "5 Sekunden, weich und leise" }, { title: "Ausatmen", text: "5 Sekunden, ohne zu pressen" }, { title: "Weiter", text: "3–5 Minuten" }, { title: "Ausklingen", text: "Danach wieder wie gewohnt atmen" }],
    pattern: [["in", 5], ["out", 5]],
    effects: [{ label: "Erhöht die Herzratenvariabilität", icon: "heart", claim: "atem-langsam-hrv" }, { label: "Verbessert die Stimmung", icon: "flower", claim: "atem-stimmung" }, { label: "Verringert Anspannung und Angst", icon: "shield", claim: "atem-angst" }],
    details: [["Dauer", "10 Sekunden pro Atemzug; 6 Runden dauern 1 Minute."], ["Hinweis", "Im Bereich von etwa 6 Atemzügen pro Minute wird in der Forschung die Kopplung von Atmung und Herzschlag am stärksten."]], variants: ["Zyklisches Seufzen: zweimal kurz einatmen, lang ausatmen (Studie in der Aussage)"] },
  { id: "immun", goal: "Immunsystem stärken", icon: "shield", title: "Hier gibt es keine Übung", sub: "Die Vorlage nennt das Ziel, die Belege fehlen",
    text: "Für „Immunsystem stärken“ durch Atmen gibt es keine belastbaren Belege. Die bekannteste Studie betraf zwölf Männer, die Atmung, Kälte und Meditation trainiert hatten (Aussage rechts). Ein einfacher Atemrhythmus kann daraus nicht abgeleitet werden.",
    tags: ["Nicht belegt"], steps: [], pattern: null, noTimer: "Dazu gibt es keine belegte Atemübung, deshalb auch keinen Takt.",
    effects: [{ label: "Kleine Studie zu Atem- und Kältetraining", icon: "shield", claim: "atem-immun-wimhof" }],
    details: [["Einordnung", "Infekte beugt man mit Impfungen, Schlaf, Bewegung und Ernährung vor; bei häufigen oder schweren Infekten gehört die Abklärung in ärztliche Hand."]], variants: [],
    warning: "Nicht nachmachen: Starke Atmung mit langem Atemanhalten kann ohnmächtig machen." },
  { id: "kaelte", goal: "Kälte & Belastung", icon: "thermo", title: "Kälte- und Belastungsatmung", sub: "Keine Anleitung auf dieser Seite",
    text: "Techniken wie die Wim-Hof-Methode oder Tummo verbinden kräftiges Atmen, Atemanhalten und Kälte. Sie sind Überlieferung beziehungsweise ein kommerzielles Programm, mit Risiken (Ohnmacht). Deshalb steht hier keine Anleitung.",
    tags: ["Überlieferung", "Risiko"], steps: [], pattern: null, noTimer: "Dazu gibt es hier keine Anleitung und keinen Takt, weil die Übung gefährlich sein kann.",
    effects: [{ label: "Kleine Studie zu Atem- und Kältetraining", icon: "shield", claim: "atem-immun-wimhof" }],
    details: [["Risiko", "Nach kräftigem Atmen und langem Atemanhalten kann man ohne Vorwarnung bewusstlos werden. Es gab Todesfälle im und am Wasser."], ["Wenn überhaupt", "Nur mit geschulter Anleitung, sitzend oder liegend, nie im oder am Wasser, nie beim Fahren und nie im Stehen."]], variants: [],
    warning: "Nie im oder am Wasser, nie beim Fahren, nie im Stehen." },
  { id: "meditation", goal: "Meditation & Achtsamkeit", icon: "sprout", title: "Atembeobachtung", sub: "Den Atem wahrnehmen, ohne ihn zu lenken",
    text: "Du beobachtest, wie der Atem von allein kommt und geht, und kehrst sanft zum Atem zurück, wenn die Gedanken abschweifen. Es gibt keinen Takt. Die Praxis stammt aus buddhistischen Überlieferungen (Anapanasati).",
    tags: ["Achtsamkeit", "Überlieferung"],
    steps: [{ title: "Setzen", text: "Bequem und aufrecht, Augen leicht geschlossen" }, { title: "Beobachten", text: "Den Atem an der Nase oder am Bauch spüren" }, { title: "Bemerken", text: "Wenn die Gedanken wandern, es freundlich feststellen" }, { title: "Zurückkehren", text: "Die Aufmerksamkeit sanft zum Atem lenken" }],
    pattern: null, noTimer: "Hier gibt es keinen Takt: Der Atem bleibt, wie er ist.",
    effects: [{ label: "Weniger Angst, Depression und Schmerz (Meditationsprogramme)", icon: "sprout", claim: "atem-achtsamkeit" }, { label: "Verbessert die Stimmung", icon: "flower", claim: "atem-stimmung" }],
    details: [["Dauer", "Anfangs 5 bis 10 Minuten."], ["Hinweis", "Bei seelischen Krisen oder Traumafolgen kann Meditation belasten; dann Rat bei Fachleuten einholen."]], variants: ["Atem zählen bis 10, dann von vorn", "Im Gehen, Schritt für Schritt"] },
];

export const ROUNDS = [3, 4, 6, 8];
export const TABS: [string, string][] = [["wirkung", "Wirkung"], ["details", "Details"], ["studien", "Studien"], ["varianten", "Varianten"]];
export const EFFECT_NOTE = "Das sind Aussagen aus Studien oder Überlieferung, mit ihrer Belegstufe. Die Balken zeigen die Belegstufe, nicht die Stärke einer Wirkung. Atemübungen ersetzen keine Behandlung.";

export interface Spot { id: string; title: string; sub: string; icon: string; side: "l" | "r"; text: string; claim?: string }
/** the six labels around the lung picture; every text is textbook knowledge (Source pending verification) or marks an open question */
export const SPOTS: Spot[] = [
  { id: "gehirn", title: "Gehirn", sub: "Klarheit, Fokus, Zirbeldrüse", icon: "brain", side: "l", claim: "atem-zirbeldruese",
    text: "Das Atemzentrum im Hirnstamm misst den Kohlendioxidgehalt des Blutes und regelt Tempo und Tiefe der Atmung. Über die Großhirnrinde kannst du bewusst eingreifen, deshalb lässt sich der Atem lenken wie kaum eine andere Körperfunktion. Zur Zirbeldrüse (Melatonin) ist kein Einfluss der Atmung belegt." },
  { id: "nerven", title: "Nervensystem", sub: "Aktivierung & Entspannung, Sympathikus & Parasympathikus", icon: "bolt", side: "l", claim: "atem-langsam-hrv",
    text: "Der Sympathikus bereitet den Körper auf Leistung vor, der Parasympathikus auf Ruhe und Erholung. Beim Einatmen steigt der Herzschlag leicht, beim Ausatmen sinkt er (respiratorische Sinusarrhythmie, ein Zusammenspiel mit dem Vagusnerv). Ein längeres Ausatmen betont diese Ruhe-Phase." },
  { id: "hormone", title: "Hormone", sub: "Cortisol, Melatonin, Stressregulation", icon: "dropper", side: "l",
    text: "Cortisol gehört zur Stressreaktion, Melatonin zur Schlafsteuerung. Ob Atemübungen diese Hormone messbar verändern, ist unklar; die Studien sind uneinheitlich. Das Bild zeigt die Zusammenhänge, nicht eine belegte Wirkung." },
  { id: "atmung", title: "Atmung", sub: "Sauerstoffaufnahme, CO₂-Balance", icon: "lungs", side: "r",
    text: "Die Lunge nimmt Sauerstoff auf und gibt Kohlendioxid ab. Wer sehr schnell oder tief atmet, atmet zu viel Kohlendioxid aus (Hyperventilation); das kann Schwindel und Kribbeln auslösen, die Gefäße im Gehirn verengen sich. Deshalb sind kräftige Atemtechniken nicht harmlos." },
  { id: "herz", title: "Herz-Kreislauf", sub: "Herzfrequenz, Blutdruck, Herzratenvariabilität (HRV)", icon: "heart", side: "r", claim: "atem-blutdruck",
    text: "Atmung und Herzschlag sind gekoppelt; die Schwankung der Abstände zwischen den Herzschlägen heißt Herzratenvariabilität (HRV). Langsame, geführte Atemübungen senkten in Studien den Blutdruck leicht. Bluthochdruck gehört in ärztliche Behandlung." },
  { id: "zellen", title: "Zellen", sub: "Energieproduktion, Regeneration", icon: "cell", side: "r",
    text: "In den Mitochondrien der Zellen reagiert Sauerstoff mit Nährstoffen und liefert den Energieträger ATP (Zellatmung). Das ist der Grund, warum Sauerstoff lebensnotwendig ist. Dass bewusstes Atmen die Zellregeneration beschleunigt, ist nicht belegt." },
];
export const BODY_LEAD = "Jeder Atemzug ist ein Signal. Er beeinflusst dein Gehirn, dein Nervensystem, deine Hormone, deine Organe und sogar deine Zellen. Entdecke, wie Atmung deinen gesamten Körper reguliert.";
export const BODY_NOTE = "Atmung hängt eng mit Herz, Kreislauf und Nerven zusammen. Wie stark und wie nachweisbar Atemübungen etwas bewirken, ist von Technik zu Technik verschieden; die Kästen unterscheiden Lehrbuchwissen und Aussagen mit Belegstufe.";

export interface More { id: string; title: string; sub: string; icon: string; tint: string; text: string; claims: string[]; link?: { label: string; act: "breath" | "cultures" | "anatomy" | "sleep" } }
export const MORE: More[] = [
  { id: "meditation", title: "Meditation", sub: "Achtsamkeit · Bewusstsein · Geistesruhe", icon: "sprout", tint: "#d89a4a", claims: ["atem-achtsamkeit"], link: { label: "Atembeobachtung ansehen", act: "breath" },
    text: "Viele Meditationsformen nutzen den Atem als Anker der Aufmerksamkeit. Du lenkst ihn nicht, du bemerkst ihn. Für Achtsamkeitsprogramme gibt es mäßig belastbare Hinweise auf Wirkungen bei Angst, Depression und Schmerz." },
  { id: "tradition", title: "Traditionelle Techniken", sub: "Wim Hof · Tummo · Pranayama · Alte Kulturen", icon: "scroll", tint: "#9ab4c8", claims: ["atem-immun-wimhof"], link: { label: "Alte Kulturen ansehen", act: "cultures" },
    text: "Pranayama (Atemlenkung im Yoga), Qigong (China) und Anapanasati (buddhistische Atembeobachtung) sind alte Praktiken; „Prana“ und „Qi“ stehen dort für Lebenskraft, nicht für etwas Messbares. Tummo (tibetische Praxis der „inneren Wärme“) und die Wim-Hof-Methode (seit den 2000er Jahren verbreitet) verbinden kräftige Atmung mit Kälte; sie bergen Risiken (Ohnmacht), deshalb gibt es hier keine Anleitung." },
  { id: "nerven", title: "Nervensystem", sub: "Sympathikus · Parasympathikus · Balance", icon: "bolt", tint: "#6a7af0", claims: ["atem-langsam-hrv"], link: { label: "Zum menschlichen Körper", act: "anatomy" },
    text: "Das vegetative Nervensystem steuert Herz, Atmung und Verdauung ohne Willen. Sympathikus (Leistung) und Parasympathikus (Ruhe) arbeiten als Gegenspieler. Die Atmung ist eine der wenigen Funktionen daraus, die du bewusst beeinflussen kannst." },
  { id: "schlaf", title: "Besser schlafen", sub: "Atemübungen für einen erholsamen Schlaf", icon: "moon", tint: "#8a7ad0", claims: ["atem-478-schlaf"], link: { label: "Übung für den Abend wählen", act: "sleep" },
    text: "Ein ruhiger Abend-Rhythmus kann zur Entspannung beitragen; für den Schlaf selbst sind einzelne Atemrhythmen kaum untersucht (Aussage mit Belegstufe). Feste Zeiten, wenig Licht am Abend und Koffein am Nachmittag zu meiden gehören zur Schlafhygiene. Bei anhaltenden Problemen: ärztlicher Rat." },
];

export const CLOSING = { title: "Dein Atem ist ein Werkzeug.", text: "Er kann dich beruhigen, stärken, heilen und dein Bewusstsein erweitern.", button: "Die Welt des Atems betreten", note: "Leitgedanke der Seite, kein belegter Satz: „heilen“ und „Bewusstsein erweitern“ sind nicht belegt, Atemübungen ersetzen keine Behandlung." };
export const ATEM_NOTICE = "Pilot: nicht fachlich geprüft. Informationsangebot – keine medizinische Beratung. Atemübungen ersetzen keine ärztliche Behandlung. Bei Schwindel oder Unwohlsein beenden und normal weiteratmen; bei Atemwegs- oder Herzerkrankungen, Bluthochdruck oder in der Schwangerschaft vorher ärztlichen Rat einholen. Die Wissenstexte sind Lehrbuchwissen (Source pending verification), Wirkungen von Atemübungen sind als Aussagen mit Belegstufe gekennzeichnet.";
