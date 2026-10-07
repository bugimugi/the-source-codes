export type Phase = "in" | "hold" | "out" | "rest";
export const PHASE_LABEL: Record<Phase, string> = { in: "Einatmen", hold: "Halten", out: "Ausatmen", rest: "Pause" };

export interface Pattern { id: string; name: string; steps: [Phase, number][]; note: string }

/**
 * Breathing rhythms for the timer. Only the counts are given; no effect is claimed anywhere on the page.
 * The attribution of 4-7-8 is marked as unverified.
 */
export const PATTERNS: Pattern[] = [
  { id: "478", name: "4-7-8", steps: [["in", 4], ["hold", 7], ["out", 8]], note: "Einatmen 4 · Halten 7 · Ausatmen 8 Sekunden. Der Rhythmus wurde durch Andrew Weil bekannt (Quelle: Source pending verification)." },
  { id: "box", name: "Box 4-4-4-4", steps: [["in", 4], ["hold", 4], ["out", 4], ["hold", 4]], note: "Vier gleich lange Phasen, wie die Seiten eines Quadrats." },
  { id: "55", name: "Gleichmäßig 5-5", steps: [["in", 5], ["out", 5]], note: "Ein ruhiger, gleichmäßiger Rhythmus mit etwa 6 Atemzügen pro Minute." },
];

export const ROUNDS = [3, 4, 6, 8];

/** Textbook anatomy of breathing – plain statements, marked on the page as not yet reviewed by experts. */
export const ANATOMY: { title: string; text: string }[] = [
  { title: "Atemzentrum", text: "Im Hirnstamm liegt das Atemzentrum. Es steuert die Atmung ohne dein Zutun – Tempo und Tiefe kannst du aber bewusst verändern." },
  { title: "Zwerchfell", text: "Das Zwerchfell, ein Muskel unter der Lunge, spannt sich beim Einatmen an und vergrößert den Brustraum. Beim Ausatmen entspannt es sich." },
  { title: "Atemwege", text: "Nase, Rachen, Luftröhre und Bronchien leiten die Luft zur Lunge. In der Nase wird sie angewärmt und befeuchtet." },
  { title: "Lungenbläschen", text: "In den Lungenbläschen (Alveolen) tritt Sauerstoff ins Blut über, und Kohlendioxid wird abgegeben." },
];

/** Traditions that work with the breath. Descriptions of the practice only, no effects. */
export const TRADITIONS: { title: string; origin: string; text: string }[] = [
  { title: "Pranayama", origin: "Yoga, Indien", text: "Atemlenkung als Teil der Yoga-Praxis. „Prana“ bezeichnet in dieser Tradition die Lebenskraft, die mit dem Atem verbunden gedacht wird." },
  { title: "Qigong", origin: "China", text: "Übungen, die Atmung, Bewegung und Aufmerksamkeit verbinden; „Qi“ steht in der chinesischen Überlieferung für Lebensenergie." },
  { title: "Atemachtsamkeit", origin: "Buddhismus (Anapanasati)", text: "Eine Meditation, bei der die Aufmerksamkeit beim Ein- und Ausatmen bleibt, ohne den Atem zu lenken." },
];
