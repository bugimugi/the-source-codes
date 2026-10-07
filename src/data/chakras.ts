/**
 * The seven chakras as the tradition describes them. Everything here is cultural lore, shown as such:
 * "traditional" = from the Indian tantric texts (Sat-Cakra-Nirupana and later commentaries: location, element, seed syllable,
 * petal count); "modern" = additions of the 20th century (rainbow colours, Solfeggio frequencies, gemstone pairings).
 * None of it is evidence of an effect. Sources for the history: "Source pending verification" (see `history`).
 */
export interface Chakra {
  id: string;
  name: string;
  sanskrit: string;
  /** association target used in content/atlas (gemstones etc.) */
  target: string;
  color: string;
  position: string;
  element: string;
  /** seed syllable (bija) of the tradition */
  syllable: string;
  /** number of lotus petals in the tradition's description (crown: "thousand", drawn symbolically) */
  petals: number;
  petalsLabel: string;
  /** themes the tradition attaches to the centre (words, not claims) */
  themes: string;
  /** Solfeggio-style attribution, a modern New-Age mapping */
  hz: number;
}

export const CHAKRAS: Chakra[] = [
  { id: "wurzel", name: "Wurzelchakra", sanskrit: "Muladhara", target: "Wurzelchakra", color: "#e0453a", position: "Beckenboden, Ende der Wirbelsäule", element: "Erde", syllable: "LAM", petals: 4, petalsLabel: "4", themes: "Stabilität, Verwurzelung, Sicherheit", hz: 396 },
  { id: "sakral", name: "Sakralchakra", sanskrit: "Svadhisthana", target: "Sakralchakra", color: "#f08a3c", position: "Unterbauch, Kreuzbeinregion", element: "Wasser", syllable: "VAM", petals: 6, petalsLabel: "6", themes: "Fluss, Gefühl, Kreativität", hz: 417 },
  { id: "solar", name: "Solarplexus-Chakra", sanskrit: "Manipura", target: "Solarplexus-Chakra", color: "#f2cf3e", position: "Oberbauch, Magengrube", element: "Feuer", syllable: "RAM", petals: 10, petalsLabel: "10", themes: "Wille, Kraft, Selbstwert", hz: 528 },
  { id: "herz", name: "Herzchakra", sanskrit: "Anahata", target: "Herzchakra", color: "#46c46f", position: "Brustmitte", element: "Luft", syllable: "YAM", petals: 12, petalsLabel: "12", themes: "Mitgefühl, Verbundenheit, Liebe", hz: 639 },
  { id: "hals", name: "Halschakra", sanskrit: "Vishuddha", target: "Halschakra", color: "#4aa8e8", position: "Kehle", element: "Raum (Äther)", syllable: "HAM", petals: 16, petalsLabel: "16", themes: "Ausdruck, Stimme, Wahrhaftigkeit", hz: 741 },
  { id: "stirn", name: "Stirnchakra", sanskrit: "Ajna", target: "Stirnchakra", color: "#5a63d6", position: "zwischen den Augenbrauen", element: "Licht / Geist", syllable: "OM", petals: 2, petalsLabel: "2", themes: "Einsicht, Vorstellungskraft, Intuition", hz: 852 },
  { id: "krone", name: "Kronenchakra", sanskrit: "Sahasrara", target: "Kronenchakra", color: "#a46be0", position: "Scheitel", element: "jenseits der Elemente", syllable: "OM (Stille)", petals: 24, petalsLabel: "1000 („tausendblättrig“; hier symbolisch gezeichnet)", themes: "Bewusstsein, Einheit, Transzendenz", hz: 963 },
];

export const CHAKRA_HISTORY = "Das System der sieben Chakren geht auf indische tantrische Texte zurück und wurde im 20. Jahrhundert im Westen bekannt; die Regenbogenfarben, die Solfeggio-Frequenzen und die Edelstein-Zuordnungen sind moderne Ergänzungen. Quellenangaben: Source pending verification.";
