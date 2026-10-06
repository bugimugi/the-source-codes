import type { SlotName } from "../assets/registry";

/**
 * Organs of the body page. `text` is plain textbook anatomy in one sentence (no figures, no effects) and is marked on the
 * page as not yet reviewed by experts. `x`/`y` are the pin positions on `body-front` in percent of the picture (tune them
 * when the picture is replaced). `match` picks atlas associations whose target contains one of these WHOLE words ("Herz" must not match "Herzchakra").
 */
export interface OrganInfo {
  id: string;
  name: string;
  slot: SlotName;
  x: number;
  y: number;
  text: string;
  match: string[];
}

export const BODY_ORGANS: OrganInfo[] = [
  { id: "gehirn", name: "Gehirn", slot: "organ-brain", x: 50, y: 4.6, text: "Zentrale des Nervensystems im Schädel. Es verarbeitet Sinneseindrücke und steuert Bewegung, Denken und viele Körperfunktionen.", match: ["Gehirn", "Nervensystem"] },
  { id: "hormone", name: "Hormone & Drüsen", slot: "organ-endocrine", x: 50, y: 12.4, text: "Drüsen wie Hirnanhangdrüse und Schilddrüse geben Botenstoffe (Hormone) ins Blut ab, die Stoffwechsel, Wachstum und viele andere Vorgänge beeinflussen.", match: ["Hormone", "Schilddrüse"] },
  { id: "immunsystem", name: "Immunsystem", slot: "organ-immune", x: 60, y: 16.5, text: "Zusammenspiel aus Zellen, Organen und Lymphsystem, das den Körper gegen Krankheitserreger verteidigt.", match: ["Immunsystem", "Lymphsystem"] },
  { id: "lunge", name: "Lunge", slot: "organ-lungs", x: 42.5, y: 22, text: "Organ des Gasaustauschs: Sie nimmt Sauerstoff aus der Atemluft auf und gibt Kohlendioxid ab.", match: ["Lunge"] },
  { id: "herz", name: "Herz", slot: "organ-heart", x: 54, y: 25.2, text: "Muskelorgan, das das Blut durch den Kreislauf pumpt.", match: ["Herz"] },
  { id: "leber", name: "Leber", slot: "organ-liver", x: 46, y: 31.5, text: "Großes Stoffwechselorgan im rechten Oberbauch. Es verarbeitet Stoffe aus dem Blut und bildet Gallenflüssigkeit.", match: ["Leber"] },
  { id: "magen", name: "Magen", slot: "organ-stomach", x: 55.5, y: 33, text: "Hohlorgan, in dem Nahrung gesammelt und mit Magensaft vorverdaut wird.", match: ["Magen"] },
  { id: "nieren", name: "Nieren", slot: "organ-kidneys", x: 62, y: 36.5, text: "Paarige Organe, die das Blut filtern und Harn bilden. Die Position im Bild ist nur die ungefähre Region.", match: ["Nieren", "Harnwege"] },
  { id: "darm", name: "Darm", slot: "organ-intestines", x: 50, y: 41, text: "Dünn- und Dickdarm: Verdauung, Aufnahme von Nährstoffen und Wasser.", match: ["Darm"] },
  { id: "haut", name: "Haut", slot: "organ-skin", x: 71.5, y: 27, text: "Das größte Organ des Körpers: Schutzhülle, Sinnesorgan und Teil der Temperaturregulation.", match: ["Haut"] },
];
