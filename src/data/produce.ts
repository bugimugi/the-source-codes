import type { AtlasEntry } from "./types";

/**
 * Data of the "Obst & Gemüse Atlas" landing page (src/ui/produce.ts), built after the user's reference picture (docs/MOCKUP-NOTES.md,
 * page 20). Numbers on the page are counted from the atlas (no placeholders from the mockup). The keyword under each popular plant is
 * a well-known ingredient (textbook knowledge, Source pending verification), never an effect. Season and cuisine lists are general
 * knowledge for Central Europe / the named regions (Source pending verification).
 */
export interface ProduceGroup {
  id: string;
  title: string;
  sub: string;
  /** picture slot of the category card (registry.ts) */
  slot: string;
  /** atlas ids; "category:<c>" adds a whole atlas category */
  members: string[];
  soon?: boolean;
  /** placeholder look until the picture exists: an icon on a tinted background */
  icon: string;
  tint: string;
}

export const GROUPS: ProduceGroup[] = [
  { id: "obst", title: "Obst", sub: "Süße Früchte", slot: "obst-cat-obst", members: ["category:obst"], icon: "berry", tint: "#c8352a" },
  { id: "beeren", title: "Beeren", sub: "Kleine Früchte", slot: "obst-cat-beeren", members: ["heidelbeere"], icon: "berry", tint: "#3a4a8a" },
  { id: "zitrus", title: "Zitrusfrüchte", sub: "Reich an Vitamin C", slot: "obst-cat-zitrus", members: ["zitrone"], icon: "sun", tint: "#e8c43a" },
  { id: "kernobst", title: "Kernobst", sub: "Apfel, Birne, Quitte", slot: "obst-cat-kernobst", members: ["apfel"], icon: "berry", tint: "#8fb23a" },
  { id: "steinobst", title: "Steinobst", sub: "Pfirsich, Kirsche, Pflaume", slot: "obst-cat-steinobst", members: ["kirsche"], icon: "berry", tint: "#e0703a" },
  { id: "tropen", title: "Tropenfrüchte", sub: "Exotische Vielfalt", slot: "obst-cat-tropen", members: ["avocado"], icon: "sun", tint: "#e8a23a" },
  { id: "gemuese", title: "Gemüse", sub: "Klassisches Gemüse", slot: "obst-cat-gemuese", members: ["category:gemuese"], icon: "leaf", tint: "#5a9a3a" },
  { id: "blatt", title: "Blattgemüse", sub: "Salate & Blätter", slot: "obst-cat-blatt", members: ["spinat"], icon: "leaf", tint: "#3f8a3a" },
  { id: "wurzel", title: "Wurzelgemüse", sub: "Rüben & Knollen", slot: "obst-cat-wurzel", members: ["karotte"], icon: "root", tint: "#e8731a" },
  { id: "huelsen", title: "Hülsenfrüchte", sub: "Bohnen, Linsen, Erbsen", slot: "obst-cat-huelsen", members: ["linsen"], icon: "seed", tint: "#b07a3a" },
  { id: "kohl", title: "Kohlgemüse", sub: "Kohl & Verwandte", slot: "obst-cat-kohl", members: ["brokkoli"], icon: "leaf", tint: "#6fa14a" },
  { id: "nachtschatten", title: "Nachtschattengewächse", sub: "Tomate, Paprika, Aubergine", slot: "obst-cat-nachtschatten", members: ["tomate"], icon: "berry", tint: "#d9261c" },
  { id: "kuerbis", title: "Kürbisgewächse", sub: "Kürbis, Gurke, Zucchini", slot: "obst-cat-kuerbis", members: ["kuerbis"], icon: "berry", tint: "#e0872a" },
  { id: "zwiebel", title: "Zwiebelgewächse", sub: "Zwiebel, Knoblauch, Lauch", slot: "obst-cat-zwiebel", members: ["knoblauch"], icon: "seed", tint: "#d9d2bd" },
  { id: "nuesse", title: "Nüsse & Samen", sub: "Nüsse, Kerne, Samen", slot: "obst-cat-nuesse", members: ["walnuss"], icon: "seed", tint: "#8a6b45" },
  { id: "sprossen", title: "Sprossen & Keimlinge", sub: "Frisch gekeimt", slot: "obst-cat-sprossen", members: [], soon: true, icon: "sprout", tint: "#9acd5a" },
];

/** every group together: the atlas categories plus the two roots that are used as vegetables and spices */
export const ALL_MEMBERS = ["category:obst", "category:gemuese", "kurkuma", "ingwer"];

/** order of the popular row */
export const POPULAR = ["granatapfel", "apfel", "avocado", "tomate", "karotte", "brokkoli", "spinat", "kurkuma", "ingwer", "knoblauch", "heidelbeere", "zitrone", "kirsche", "linsen", "kuerbis", "walnuss"];

/** a well-known ingredient under each plant (textbook, no effect) */
export const TAGLINE: Record<string, string> = {
  granatapfel: "Punicalagine", apfel: "Pektin & Polyphenole", avocado: "Einfach ungesättigte Fettsäuren", tomate: "Lycopin", karotte: "Beta-Carotin",
  brokkoli: "Glucosinolate", spinat: "Folat & Carotinoide", kurkuma: "Curcuminoide", ingwer: "Gingerole", knoblauch: "Alliin & Allicin",
  heidelbeere: "Anthocyane", zitrone: "Vitamin C & Citronensäure", kirsche: "Anthocyane", linsen: "Eiweiß & Ballaststoffe", kuerbis: "Carotinoide", walnuss: "Alpha-Linolensäure",
};

export const HERO_POINTS = [
  "Enthält Vitamine und Mineralstoffe",
  "Natürliche Pflanzenstoffe",
  "Nahrung für Körper & Geist",
  "Traditionelle Ernährung",
  "Vielfältige Kulturen",
  "Saisonal & regional",
];

export const NUTRIENT_CARDS: { id: string; title: string; sub: string; icon: string; text: string }[] = [
  { id: "vitamine", title: "Vitamine", sub: "A, B, C, D, E, K", icon: "flame", text: "Organische Stoffe, die der Körper in kleinen Mengen braucht und meist nicht selbst herstellen kann. Obst und Gemüse liefern z. B. Vitamin C, Provitamin A (Carotinoide) und Folat (Lehrbuchwissen, Source pending verification)." },
  { id: "mineral", title: "Mineralstoffe", sub: "Kalium, Magnesium", icon: "layers", text: "Anorganische Nährstoffe wie Kalium, Magnesium und Calcium. Hülsenfrüchte, Blattgemüse und Nüsse sind typische Quellen (Lehrbuchwissen, Source pending verification)." },
  { id: "antiox", title: "Antioxidantien", sub: "Polyphenole, Flavonoide", icon: "shield", text: "Sammelbegriff für Stoffe, die im Reagenzglas freie Radikale abfangen, z. B. Vitamin C und Polyphenole. Ein Nutzen im Körper ist damit nicht belegt (Lehrbuchwissen, Source pending verification)." },
  { id: "ballast", title: "Ballaststoffe", sub: "Verdauung & Darm", icon: "texture", text: "Unverdauliche pflanzliche Faserstoffe. Sie sättigen und werden zum Teil von Darmbakterien verwertet. Reichlich in Hülsenfrüchten, Vollkorn, Gemüse und Obst (Lehrbuchwissen, Source pending verification)." },
  { id: "sekundaer", title: "Sekundäre Pflanzenstoffe", sub: "Farb- & Schutzstoffe", icon: "cell", text: "Stoffe, die Pflanzen zur Abwehr und zur Farbgebung bilden, z. B. Carotinoide, Flavonoide und Glucosinolate (Lehrbuchwissen, Source pending verification)." },
  { id: "enzyme", title: "Enzyme", sub: "Eiweiße im Stoffwechsel", icon: "bolt", text: "Eiweiße, die Stoffwechselreaktionen beschleunigen. Pflanzliche Enzyme (z. B. Bromelain in der Ananas) werden bei der Verdauung weitgehend abgebaut (Lehrbuchwissen, Source pending verification)." },
];

/** body areas linked to the body page (organ id as used there; none: opens the page without an organ) */
export const BODY_ROWS: { name: string; icon: string; organ?: string }[] = [
  { name: "Immunsystem", icon: "shield", organ: "immunsystem" },
  { name: "Herz & Kreislauf", icon: "heart", organ: "herz" },
  { name: "Verdauung", icon: "texture", organ: "darm" },
  { name: "Gehirn & Nerven", icon: "brain", organ: "gehirn" },
  { name: "Haut & Alterung", icon: "drop", organ: "haut" },
  { name: "Augen & Sehkraft", icon: "target" },
  { name: "Hormone", icon: "balance", organ: "hormone" },
  { name: "Knochen & Muskeln", icon: "muscle" },
];

/** seasons in Central Europe: plain names and the atlas ids that exist for them */
export const SEASONS: { id: string; name: string; icon: string; items: string; ids: string[] }[] = [
  { id: "fruehling", name: "Frühling", icon: "sprout", items: "Spargel, Erdbeeren, Spinat", ids: ["spinat"] },
  { id: "sommer", name: "Sommer", icon: "sun", items: "Tomaten, Zucchini, Beeren", ids: ["tomate", "heidelbeere"] },
  { id: "herbst", name: "Herbst", icon: "leaf", items: "Kürbis, Äpfel, Trauben", ids: ["kuerbis", "apfel"] },
  { id: "winter", name: "Winter", icon: "layers", items: "Grünkohl, Rosenkohl, Zitrusfrüchte", ids: ["zitrone"] },
];

export const CUISINES: { id: string; name: string; sub: string; slot: string; ids: string[]; tint: string }[] = [
  { id: "mittelmeer", name: "Mittelmeer", sub: "Oliven, Tomaten, Auberginen", slot: "obst-kueche-mittelmeer", ids: ["tomate", "zitrone", "knoblauch"], tint: "#d9803a" },
  { id: "asien", name: "Asien", sub: "Reis, Ingwer, Pak Choi", slot: "obst-kueche-asien", ids: ["ingwer", "kurkuma"], tint: "#4f9a5a" },
  { id: "suedamerika", name: "Südamerika", sub: "Mais, Chili, Quinoa", slot: "obst-kueche-suedamerika", ids: ["kuerbis", "avocado"], tint: "#c9a02a" },
  { id: "afrika", name: "Afrika", sub: "Hirse, Okra, Maniok", slot: "obst-kueche-afrika", ids: [], tint: "#b5603a" },
  { id: "orient", name: "Orient", sub: "Granatapfel, Datteln, Kichererbsen", slot: "obst-kueche-orient", ids: ["granatapfel", "linsen"], tint: "#a8283a" },
];

export const RECIPE_CARDS: { id: string; name: string; sub: string; slot: string; icon: string; tint: string }[] = [
  { id: "smoothies", name: "Smoothies", sub: "Getränke aus Obst", slot: "obst-rezept-smoothies", icon: "cup", tint: "#c8352a" },
  { id: "salate", name: "Salate", sub: "Frisch & roh", slot: "obst-rezept-salate", icon: "leaf", tint: "#5a9a3a" },
  { id: "warm", name: "Warme Gerichte", sub: "Traditionell & modern", slot: "obst-rezept-warm", icon: "pot", tint: "#e0872a" },
];

export const PRODUCE_NOTICE = "Pilot: nicht fachlich geprüft. Zahlen auf dieser Seite werden aus dem Atlas gezählt; Stichworte, Jahreszeiten und Küchen sind Lehrbuchwissen und Allgemeinwissen (Source pending verification). Alle Zuordnungen zu Körperbereichen sind Überlieferung oder Lehrmeinung und kein Wirkungsnachweis; jedes Profil zeigt seine Belegstufen. Information, keine medizinische Beratung und keine Ernährungsempfehlung: Bei Beschwerden, Allergien, Schwangerschaft oder Medikamenten bitte ärztlich oder in der Apotheke nachfragen. Wildfrüchte und Pilze nur sammeln und essen, wenn eine Fachperson sie sicher bestimmt hat.";

/** the entries a group contains, in the order of the data */
export function groupEntries(members: string[], all: AtlasEntry[]): AtlasEntry[] {
  const out: AtlasEntry[] = [];
  const add = (e?: AtlasEntry) => { if (e && !out.includes(e)) out.push(e); };
  for (const m of members) {
    if (m.startsWith("category:")) all.filter((e) => e.category === m.slice(9)).forEach(add);
    else add(all.find((e) => e.id === m));
  }
  return out;
}
