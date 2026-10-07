import { CAT_LABEL, FEATURED, TRACE, type Element } from "./elements.ts";

/**
 * Data of the element profile pages (src/ui/elementProfile.ts), built after the user's reference picture (docs/MOCKUP-NOTES.md, page 23).
 * Hydrogen is the complete template; every other element gets a short profile from the element table (name, number, mass, group, period).
 * All values are textbook knowledge (Source pending verification). Statements about health or the energy transition are graded claims.
 * The mockup's study titles are placeholders and are not used; the research list names sources that exist.
 */
export interface ElementFull {
  sym: string;
  name: string;
  alt: string;
  chips: string[];
  lead: string;
  /** hero data card */
  data: [string, string][];
  dataNote: string;
  detail: string;
  quick: string[];
  isotopes: { id: string; sym: string; name: string; sub: string; share: string; text: string; neutrons: number }[];
  config: { text: string; boxes: { label: string; n: number; filled: number }[]; levelNote: string };
  phys: { icon: string; label: string; value: string }[];
  safety: string;
  universe: { pct: string; text: string; note: string; more: string };
  earth: { intro: string; list: string[]; more: string };
  compounds: { id: string; name: string; formula: string; tags: string[]; sub: string; text: string }[];
  body: { id: string; icon: string; title: string; sub: string; text: string }[];
  bodyClaim: string;
  freq: { label: string; hz: string; hzExp: string; nm: string; text: string };
  resonance: { id: string; title: string; text: string }[];
  apps: { id: string; icon: string; title: string; sub: string; text: string; claim?: string }[];
  history: { id: string; title: string; sub: string; text: string }[];
  research: { id: string; title: string; author: string; year?: string; kind: string; url: string; note: string; claim?: string }[];
}

export const ELEMENT_NOTICE = "Pilot: nicht fachlich geprüft. Werte zu den Elementen sind Lehrbuchwissen (Source pending verification). Aussagen zu Gesundheit und Energiewende stehen als Hypothese oder Behauptung mit Belegstufe. Information, keine medizinische Beratung. Wasserstoff bildet mit Luft explosionsfähige Gemische: keine eigenen Versuche mit Wasserstoffgas, Elektrolyse-Experimente nur unter fachkundiger Anleitung.";

export const HYDROGEN: ElementFull = {
  sym: "H", name: "Wasserstoff", alt: "Hydrogen", chips: ["Nichtmetall", "Gas", "Element"],
  lead: "Wasserstoff ist das einfachste und häufigste Element im Universum. Er bildet die Grundlage für Sterne, Wasser, organische Moleküle und spielt eine zentrale Rolle in Energie, Leben und Technologie.",
  data: [
    ["Ordnungszahl", "1"], ["Atomsymbol", "H"], ["Atommasse", "1,008 u"], ["Gruppe", "1 (Nichtmetall)"], ["Periode", "1"], ["Aggregatzustand", "Gas (bei 25 °C)"],
    ["Schmelzpunkt", "−259,16 °C"], ["Siedepunkt", "−252,88 °C"], ["Dichte", "0,0000899 g/cm³"], ["Elektronegativität", "2,20"], ["Ionisierungsenergie", "13,598 eV"],
  ],
  dataNote: "Lehrbuchwerte, Source pending verification. Dichte bei 0 °C und 1 atm; Elektronegativität nach Pauling; Ionisierungsenergie ist die erste.",
  detail: "Wasserstoff ist das leichteste Element und der häufigste Bestandteil des Universums. Er kommt auf der Erde meist in gebundener Form vor, vor allem in Wasser (H₂O) und in organischen Verbindungen.",
  quick: [
    "Das einfachste Atom: ein Proton im Kern und ein Elektron in der Hülle.",
    "Rund 75 % der gewöhnlichen Materie des Universums (nach Masse) ist Wasserstoff.",
    "Als Gas (H₂) ist er das leichteste Gas, farblos, geruchlos und geschmacklos.",
    "Der Name kommt aus dem Griechischen (hydor „Wasser“, genes „erzeugend“); Lavoisier prägte ihn 1783.",
    "Hochentzündlich: Gemische mit Luft sind explosionsfähig.",
  ],
  isotopes: [
    { id: "protium", sym: "¹H", name: "Protium", sub: "Stabil", share: "99,9885 %", neutrons: 0, text: "Das häufigste Isotop: ein Proton, kein Neutron. Aus Protium besteht fast der gesamte Wasserstoff." },
    { id: "deuterium", sym: "²H", name: "Deuterium", sub: "Stabil", share: "0,0115 %", neutrons: 1, text: "Schwerer Wasserstoff: ein Proton und ein Neutron. Er ist stabil und kommt in Spuren in jedem Wasser vor; „schweres Wasser“ (D₂O) enthält ihn." },
    { id: "tritium", sym: "³H", name: "Tritium", sub: "Radioaktiv", share: "T½ = 12,3 Jahre", neutrons: 2, text: "Ein Proton und zwei Neutronen. Tritium ist radioaktiv (Beta-Zerfall zu Helium-3, Halbwertszeit rund 12,3 Jahre) und kommt in der Natur nur in winzigen Spuren vor." },
  ],
  config: {
    text: "1s¹", boxes: [{ label: "1s", n: 1, filled: 1 }, { label: "2s", n: 1, filled: 0 }, { label: "2p", n: 3, filled: 0 }],
    levelNote: "Die Energie des Niveaus n beträgt −13,598 eV geteilt durch n² (Bohr-Modell für Wasserstoff).",
  },
  phys: [
    { icon: "cup", label: "Aggregatzustand", value: "Gas (bei 25 °C)" }, { icon: "layers", label: "Dichte", value: "0,0000899 g/cm³" }, { icon: "thermo", label: "Schmelzpunkt", value: "−259,16 °C" }, { icon: "thermo", label: "Siedepunkt", value: "−252,88 °C" },
    { icon: "palette", label: "Farbe", value: "Farblos" }, { icon: "nose", label: "Geruch", value: "Geruchlos" }, { icon: "tongue", label: "Geschmack", value: "Geschmacklos" }, { icon: "flame", label: "Brennbarkeit", value: "Hochentzündlich" },
  ],
  safety: "Wasserstoff bildet mit Luft explosionsfähige Gemische (Knallgas) und ist als extrem entzündbares Gas eingestuft. Er wird nur von Fachleuten mit geeigneten Anlagen gehandhabt.",
  universe: {
    pct: "≈ 75 %", text: "der gesamten sichtbaren Materie im Universum besteht aus Wasserstoff.",
    note: "Gemeint ist der Massenanteil der gewöhnlichen Materie; nach der Zahl der Atome sind es noch mehr (über 90 %). Lehrbuchwissen, Source pending verification.",
    more: "Wasserstoff entstand in den ersten Minuten nach dem Urknall (Urknall-Nukleosynthese), zusammen mit Helium und Spuren von Lithium. In den Sternen verschmilzt Wasserstoff zu Helium und setzt dabei die Energie frei, die Sterne leuchten lässt, auch unsere Sonne. Schwerere Elemente entstanden später in Sternen und Sternexplosionen (Lehrbuchwissen, Source pending verification).",
  },
  earth: {
    intro: "Vor allem in gebundener Form:",
    list: ["Wasser (H₂O)", "Organische Verbindungen", "Mineralien (z. B. Hydroxide)", "Atmosphäre (geringe Mengen)"],
    more: "Fast aller Wasserstoff auf der Erde steckt in Verbindungen: im Wasser der Meere, Eisschilde und Wolken, in allen Lebewesen und in Erdgas und Erdöl. Mineralien binden ihn als Hydroxid (OH⁻) oder als Kristallwasser, etwa im Gips. Als freies Gas (H₂) kommt er in der Luft nur in winzigen Mengen vor (Größenordnung 0,5 ppm), weil er so leicht ist, dass er ins All entweicht, und er tritt etwas in Vulkangasen und Quellen auf (Lehrbuchwissen, Source pending verification).",
  },
  compounds: [
    { id: "wasser", name: "Wasser", formula: "H₂O", tags: ["Leben", "Klima", "Ökosysteme"], sub: "", text: "Ein Sauerstoffatom und zwei Wasserstoffatome, mit einem Bindungswinkel von rund 104,5°. Wasser ist Lösungsmittel des Lebens, speichert Wärme und prägt Klima und Ökosysteme (Lehrbuchwissen, Source pending verification)." },
    { id: "methan", name: "Methan", formula: "CH₄", tags: [], sub: "Energie", text: "Ein Kohlenstoffatom mit vier Wasserstoffatomen (Tetraeder). Methan ist der Hauptbestandteil von Erdgas und ein starkes Treibhausgas (Lehrbuchwissen, Source pending verification)." },
    { id: "ammoniak", name: "Ammoniak", formula: "NH₃", tags: [], sub: "Landwirtschaft", text: "Stickstoff mit drei Wasserstoffatomen. Ammoniak wird großtechnisch aus Wasserstoff und Stickstoff hergestellt (Haber-Bosch-Verfahren) und ist Grundstoff vieler Düngemittel (Lehrbuchwissen, Source pending verification)." },
    { id: "salzsaeure", name: "Salzsäure", formula: "HCl", tags: [], sub: "Industrie", text: "Chlorwasserstoff (HCl) in Wasser gelöst. Salzsäure ist eine starke Säure und eine wichtige Industriechemikalie; Magensaft enthält verdünnte Salzsäure (Lehrbuchwissen, Source pending verification)." },
  ],
  body: [
    { id: "wasser", icon: "drop", title: "Bestandteil des Wassers", sub: "(Zellfunktionen)", text: "Wasser (H₂O) macht beim Erwachsenen mehr als die Hälfte des Körpergewichts aus (je nach Alter, Geschlecht und Körperbau, Größenordnung 50 bis 60 %). Fast alle Vorgänge in den Zellen laufen in wässriger Lösung ab (Lehrbuchwissen, Source pending verification)." },
    { id: "ph", icon: "balance", title: "Säure-Basen-Haushalt", sub: "", text: "Der pH-Wert misst die Konzentration von Wasserstoff-Ionen (H⁺). Der Körper hält den pH-Wert des Blutes in einem engen Bereich um etwa 7,4 (Lehrbuchwissen, Source pending verification)." },
    { id: "organik", icon: "dna", title: "Bestandteil organischer Moleküle", sub: "(Proteine, Fette, DNA)", text: "Wasserstoff steckt in allen organischen Molekülen des Körpers: in Proteinen, Fetten, Kohlenhydraten und in der DNA, wo Wasserstoffbrücken die beiden Stränge zusammenhalten (Lehrbuchwissen, Source pending verification)." },
    { id: "energie", icon: "bolt", title: "Energiestoffwechsel", sub: "", text: "In der Atmungskette der Mitochondrien werden Wasserstoff-Ionen (Protonen) durch eine Membran gepumpt; ihr Rückfluss treibt die ATP-Synthase an, die den Energieträger ATP herstellt (Lehrbuchwissen, Source pending verification)." },
    { id: "redox", icon: "cell", title: "Redox-Reaktionen", sub: "(Wasserstoff-Überträger)", text: "Stoffe wie NAD⁺/NADH übertragen Wasserstoff und Elektronen zwischen Stoffwechselschritten (Lehrbuchwissen, Source pending verification)." },
  ],
  bodyClaim: "wasserstoff-h2-medizin",
  freq: {
    label: "Frequenz (Lyman-Alpha)", hz: "2,466", hzExp: "10¹⁵ Hz", nm: "121,6 nm – UV-Bereich",
    text: "Lyman-Alpha ist der Übergang des Elektrons von n = 2 nach n = 1: eine Spektrallinie im ultravioletten Bereich, nicht hörbar und nicht sichtbar. Ihre Frequenz folgt aus der Wellenlänge (ν = c / λ).",
  },
  resonance: [
    { id: "spektro", title: "Spektroskopie", text: "Die Spektrallinien des Wasserstoffs (Lyman-, Balmer-, Paschen-Serie) sind eindeutig und dienen seit dem 19. Jahrhundert dazu, Sterne und Gaswolken zu untersuchen. Die rote H-alpha-Linie macht Sternentstehungsgebiete sichtbar (Lehrbuchwissen, Source pending verification)." },
    { id: "material", title: "Materialforschung", text: "Die Kerne von Wasserstoffatomen (Protonen) schwingen im Magnetfeld mit einer Radiofrequenz mit: Kernspinresonanz (NMR). Sie wird in der Chemie zur Strukturbestimmung genutzt, und die Magnetresonanztomographie (MRT) bildet damit den Wasserstoff im Gewebe ab (Lehrbuchwissen, Source pending verification)." },
    { id: "energie", title: "Energieübertragung", text: "Ein Photon trägt die Energie E = h · ν. Beim Übergang n = 2 → 1 sind es rund 10,2 eV, bei n = 3 → 2 (H-alpha) rund 1,9 eV: Das ist die Differenz der Energieniveaus (berechnet aus E = −13,598 eV / n², Source pending verification)." },
    { id: "quanten", title: "Quantenphysik", text: "Das Wasserstoffatom ist das einfachste Atom und lässt sich in der Quantenmechanik exakt berechnen. Die Orbitale 1s, 2s, 2p … sind die stehenden Wellen des Elektrons; an Wasserstoff wurde die Quantenphysik der Atome getestet (Lehrbuchwissen, Source pending verification)." },
    { id: "technik", title: "Technologische Anwendungen", text: "Wasserstoff-Maser sind sehr genaue Uhren: Sie nutzen den Hyperfeinübergang des Wasserstoffs bei rund 1,42 GHz (die 21-cm-Linie, die auch in der Radioastronomie das Gas der Galaxien zeigt) (Lehrbuchwissen, Source pending verification)." },
  ],
  apps: [
    { id: "energie", icon: "bolt", title: "Saubere Energie", sub: "(Brennstoffzelle)", text: "In einer Brennstoffzelle reagieren Wasserstoff und Sauerstoff zu Wasser und liefern dabei Strom und Wärme. Am Ort der Nutzung entsteht nur Wasser; wie sauber der Strom insgesamt ist, hängt davon ab, wie der Wasserstoff hergestellt wurde (Lehrbuchwissen, Source pending verification)." },
    { id: "raumfahrt", icon: "rocket", title: "Raumfahrt", sub: "(Raketentreibstoff)", text: "Flüssiger Wasserstoff mit flüssigem Sauerstoff ist ein sehr effizienter Raketentreibstoff und wurde in Oberstufen von Trägerraketen und in den Haupttriebwerken des Space Shuttles genutzt. Er muss extrem kalt gelagert werden (Lehrbuchwissen, Source pending verification)." },
    { id: "industrie", icon: "factory", title: "Industrie", sub: "(Chemische Prozesse)", text: "Wasserstoff ist ein Grundstoff der Chemie: für Ammoniak (Dünger), in Raffinerien und zur Härtung von Fetten. Heute wird er überwiegend aus Erdgas gewonnen (Dampfreformierung) (Lehrbuchwissen, Source pending verification)." },
    { id: "metall", icon: "hammer", title: "Metallurgie", sub: "(Reduktion von Metallen)", text: "Wasserstoff kann Metalloxide zu Metall reduzieren, weil er den Sauerstoff als Wasser abführt. Für Eisenerz wird das als Alternative zur Kohle erprobt (Lehrbuchwissen, Source pending verification)." },
    { id: "mobil", icon: "car", title: "Mobilität", sub: "(Wasserstofffahrzeuge)", text: "Brennstoffzellenfahrzeuge tanken Wasserstoff und fahren elektrisch; es gibt sie als Autos, Busse und Züge. Ob sich das gegenüber Batterien durchsetzt, ist Gegenstand von Forschung und Politik (Source pending verification)." },
    { id: "zukunft", icon: "sprout", title: "Zukunftstechnologie", sub: "(Grüner Wasserstoff)", claim: "wasserstoff-gruen", text: "„Grüner“ Wasserstoff entsteht durch Elektrolyse von Wasser mit Strom aus erneuerbaren Quellen. Welche Rolle er in der Energiewende spielen wird, ist eine Erwartung und kein gesichertes Ergebnis; die Aussage dazu zeigt ihre Belegstufe." },
  ],
  history: [
    { id: "urzeit", title: "Urzeit", sub: "Feuer & Verbrennung", text: "Beim Verbrennen von Holz und Fett verbindet sich der darin gebundene Wasserstoff mit Sauerstoff zu Wasserdampf. Menschen nutzten Feuer seit Urzeiten; dass Wasserstoff ein eigener Stoff ist, wurde erst viel später erkannt (Einordnung, Source pending verification)." },
    { id: "alchemie", title: "Alchemie", sub: "Das Element des Lebens", text: "Beim Auflösen von Metallen in Säuren entsteht ein brennbares Gas: Wasserstoff. Das beobachteten schon Alchemisten und frühe Chemiker, oft wird Paracelsus im 16. Jahrhundert genannt (Überlieferung, Source pending verification). Als eigener Stoff wurde es erst 1766 beschrieben." },
    { id: "wissenschaft", title: "Moderne Wissenschaft", sub: "Entdeckung und Isolierung (1766)", text: "Henry Cavendish stellte 1766 das Gas aus Metallen und Säuren her und nannte es „brennbare Luft“. Antoine Lavoisier gab ihm 1783 den Namen hydrogène („Wasserbildner“), nachdem gezeigt war, dass Wasser entsteht, wenn es verbrennt (Source pending verification)." },
    { id: "raumfahrt", title: "Raumfahrt", sub: "Trägerraketen", text: "Seit den 1960er Jahren fliegt flüssiger Wasserstoff als Treibstoff in Raketen mit. Seine hohe Energie je Masse macht ihn für Oberstufen und Haupttriebwerke attraktiv (Source pending verification)." },
    { id: "zukunft", title: "Zukunft", sub: "Saubere Energie für die Welt", text: "Wasserstoff gilt als möglicher Speicher und Energieträger für erneuerbare Energie. Wie groß seine Rolle wird, hängt von Kosten, Infrastruktur und Politik ab; das sind Prognosen, keine Tatsachen (Source pending verification)." },
  ],
  research: [
    { id: "iea", title: "The Future of Hydrogen: Seizing Today's Opportunities", author: "Internationale Energieagentur (IEA)", year: "2019", kind: "Bericht", url: "https://www.iea.org/reports/the-future-of-hydrogen", note: "Bericht für die G20 zur Frage, wie sich Wasserstoff als sauberer Energieträger ausbauen ließe. Aus Suchauszügen, Original nicht geprüft.", claim: "wasserstoff-gruen" },
    { id: "h2med", title: "Molecular Hydrogen Therapy – A Review on Clinical Studies and Outcomes", author: "Autoren in der Quelle nachschlagen", year: "2023", kind: "Übersichtsarbeit (Molecules)", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10707987/", note: "Übersicht zu Studien mit molekularem Wasserstoff. Erste Ergebnisse gelten als vielversprechend, brauchen aber größere, strenge Studien. Aus Suchauszügen, Original nicht geprüft.", claim: "wasserstoff-h2-medizin" },
    { id: "erdwasser", title: "Scientists theorize new origin story for Earth's water", author: "American Geophysical Union (AGU), Pressemitteilung", kind: "Pressemitteilung zu einer Studie", url: "https://news.agu.org/press-release/scientists-theorize-new-origin-story-for-earths-water", note: "Eine Studie legt nahe, dass ein Teil des Wasserstoffs der Erde aus dem Gas des Sonnennebels stammt. Eine Pressemitteilung, keine Studie; Jahr und Originalarbeit nachschlagen. Aus Suchauszügen." },
  ],
};

/** the elements that have a complete profile; all others get the short one */
export const FULL: Record<string, ElementFull> = { H: HYDROGEN };

/** group (1-18) and period (1-7) from the table position; the f-block has no group */
export function groupPeriod(e: Element): { group: string; period: number } {
  const period = e.row === 9 ? 6 : e.row === 10 ? 7 : e.row;
  return { group: e.row >= 9 ? "f-Block (ohne Gruppennummer)" : String(e.col), period };
}

/** data card, text and chips of the short profile of an element */
export function shortProfile(e: Element) {
  const gp = groupPeriod(e);
  const f = FEATURED.find((x) => x.sym === e.sym);
  return {
    data: [["Ordnungszahl", String(e.z)], ["Atomsymbol", e.sym], ["Atommasse", `${e.mass} u`], ["Gruppe", gp.group.startsWith("f") ? "Lanthanoide/Actinoide (f-Block)" : gp.group], ["Periode", String(gp.period)], ["Kategorie", CAT_LABEL[e.cat]]] as [string, string][],
    chips: [CAT_LABEL[e.cat], ...(TRACE.includes(e.sym) ? ["Spurenelement (Lehrbuchliste)"] : [])],
    text: f?.text ?? `${e.name} (${e.sym}) hat die Ordnungszahl ${e.z}. Ein ausführlicher Steckbrief mit Texten und Quellen folgt; Wasserstoff ist die vollständige Vorlage.`,
  };
}
