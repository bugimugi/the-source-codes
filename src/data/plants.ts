import type { SlotName } from "../assets/registry";
import type { AtlasEntry } from "./types";

/**
 * Data of the plant atlas landing page. Everything the page shows as a number is counted from the atlas (no placeholder
 * figures from the mockup). Origin regions are textbook knowledge of the editors (Source pending verification). The topics
 * ("Was möchtest du unterstützen?") only list plants whose TRADITIONAL association points to that topic: no efficacy is claimed.
 */
export type Region = "europa" | "asien" | "afrika" | "nordamerika" | "suedamerika" | "ozeanien";

export const REGIONS: { id: Region; name: string; lat: number; lon: number }[] = [
  { id: "europa", name: "Europa", lat: 49, lon: 12 },
  { id: "asien", name: "Asien", lat: 40, lon: 88 },
  { id: "afrika", name: "Afrika", lat: 4, lon: 21 },
  { id: "nordamerika", name: "Nordamerika", lat: 44, lon: -100 },
  { id: "suedamerika", name: "Südamerika", lat: -14, lon: -60 },
  { id: "ozeanien", name: "Ozeanien", lat: -26, lon: 135 },
];

/** where the plant is native / first cultivated (textbook knowledge, not checked) */
export const ORIGIN: Record<string, Region[]> = {
  ashwagandha: ["asien"], rosmarin: ["europa"], kamille: ["europa"], kurkuma: ["asien"], ingwer: ["asien"], lavendel: ["europa"],
  pfefferminze: ["europa"], salbei: ["europa"], echinacea: ["nordamerika"], "aloe-vera": ["afrika"], teebaum: ["ozeanien"],
  brennnessel: ["europa"], ringelblume: ["europa"], weide: ["europa"], apfel: ["asien"], karotte: ["asien"], tomate: ["suedamerika"], walnuss: ["asien"],
};

export interface PlantGroup {
  id: string;
  title: string;
  sub: string;
  slot: SlotName;
  /** an existing image used until the specific one exists */
  fallbackSlot?: SlotName;
  /** ids in this group; "category:<c>" adds a whole atlas category */
  members: string[];
  soon?: boolean;
}

export const GROUPS: PlantGroup[] = [
  { id: "alle", title: "Alle Pflanzen", sub: "Entdecken", slot: "tile-pflanzen", members: ["category:kraut", "category:blume", "category:baum", "category:obst", "category:gemuese", "category:pilz"] },
  { id: "kraeuter", title: "Kräuter", sub: "Heilpflanzen", slot: "plants-cat-kraeuter", fallbackSlot: "tile-pflanzen", members: ["brennnessel", "pfefferminze", "kamille", "lavendel", "rosmarin", "salbei", "ashwagandha", "aloe-vera"] },
  { id: "blueten", title: "Blüten", sub: "Duftpflanzen", slot: "plants-cat-blueten", fallbackSlot: "tile-pflanzen", members: ["kamille", "lavendel", "ringelblume", "echinacea"] },
  { id: "baeume", title: "Bäume", sub: "Wälder & Rinde", slot: "tile-baeume", members: ["weide", "teebaum", "walnuss", "apfel"] },
  { id: "pilze", title: "Pilze", sub: "Medizinalpilze", slot: "tile-pilze", members: ["category:pilz"] },
  { id: "gewuerze", title: "Gewürze", sub: "Küche & Tradition", slot: "plants-cat-gewuerze", fallbackSlot: "tile-pflanzen", members: ["ingwer", "kurkuma", "rosmarin"] },
  { id: "fruechte", title: "Früchte", sub: "Nährstoffe", slot: "plants-cat-fruechte", fallbackSlot: "tile-gemuese-obst", members: ["apfel", "tomate", "walnuss"] },
  { id: "gemuese", title: "Gemüse", sub: "Nahrungspflanzen", slot: "plants-cat-gemuese", fallbackSlot: "tile-gemuese-obst", members: ["karotte", "tomate"] },
  { id: "algen", title: "Algen", sub: "Wasserpflanzen", slot: "plants-cat-algen", fallbackSlot: "tile-pflanzen", members: [], soon: true },
];

/** order of the "Beliebte Pflanzen" row and the "Beliebt:" chips of the search */
export const POPULAR = ["ashwagandha", "rosmarin", "kamille", "kurkuma", "ingwer", "lavendel", "pfefferminze", "salbei", "echinacea", "aloe-vera", "ringelblume", "weide"];
export const POPULAR_CHIPS = ["ashwagandha", "rosmarin", "kamille", "kurkuma", "lavendel", "ingwer"];

export interface Topic { id: string; label: string; icon: string; /** lower-case parts of an association target or system */ targets: string[] }

export const TOPICS: Topic[] = [
  { id: "schlaf", label: "Schlaf", icon: "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z", targets: ["nervensystem", "beruhig"] },
  { id: "stress", label: "Stress & Angst", icon: "M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM5 20c0-4 3-6 7-6s7 2 7 6M4 8l2 1M20 8l-2 1", targets: ["nervensystem", "beruhig"] },
  { id: "immun", label: "Immunsystem", icon: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z", targets: ["immun"] },
  { id: "kopf", label: "Kopfschmerzen", icon: "M12 3a6 6 0 0 0-6 6c0 3 2 4 2 7h8c0-3 2-4 2-7a6 6 0 0 0-6-6zM9 20h6M11 8l2 3-2 2", targets: ["schmerz"] },
  { id: "verdauung", label: "Verdauung", icon: "M8 4c4 0 4 4 0 4s-4 4 4 4 4 4 0 4M8 20h8", targets: ["magen", "darm", "verdau"] },
  { id: "entzuendung", label: "Entzündungen", icon: "M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z", targets: ["entzünd"] },
  { id: "kreislauf", label: "Kreislauf", icon: "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z", targets: ["kreislauf", "herz"] },
  { id: "konzentration", label: "Konzentration", icon: "M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M12 12m-6 0a6 6 0 1 0 12 0 6 6 0 1 0-12 0M12 3v3M12 18v3M3 12h3M18 12h3", targets: ["gehirn"] },
  { id: "haut", label: "Haut", icon: "M12 3c3 4 6 7 6 10a6 6 0 0 1-12 0c0-3 3-6 6-10z", targets: ["haut"] },
  { id: "hormone", label: "Hormone", icon: "M7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM9 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8.5 7.5l7 3M16 12l-6 5", targets: ["hormon"] },
  { id: "atemwege", label: "Atemwege", icon: "M9 5v8c0 3-2 5-4 5-1 0-1-3 0-7s3-6 4-6zM15 5v8c0 3 2 5 4 5 1 0 1-3 0-7s-3-6-4-6zM12 3v7", targets: ["lunge", "atem", "rachen"] },
  { id: "energie", label: "Energie", icon: "M13 2L5 14h6l-1 8 8-12h-6z", targets: ["tonikum", "niere"] },
];

/** the organ names of the panel and the id used on the body page (none: opens the body page without an organ) */
export const ORGAN_PANEL: { name: string; id?: string }[] = [
  { name: "Gehirn", id: "gehirn" }, { name: "Herz", id: "herz" }, { name: "Lunge", id: "lunge" }, { name: "Leber", id: "leber" },
  { name: "Magen", id: "magen" }, { name: "Darm", id: "darm" }, { name: "Immunsystem", id: "immunsystem" }, { name: "Hormone", id: "hormone" },
  { name: "Muskeln" }, { name: "Haut", id: "haut" }, { name: "Knochen" }, { name: "Nervensystem" },
];

export const QUOTE = "Die Natur ist die größte Bibliothek der Heilkunst.";

export const PLANTS_NOTICE = "Pilot: nicht fachlich geprüft. Alle Zuordnungen sind Überlieferung oder Lehrmeinung und kein Wirkungsnachweis; Herkunftsregionen sind Lehrbuchwissen (Source pending verification). Informationsangebot – keine medizinische Beratung. Pflanzen können Wechselwirkungen mit Medikamenten haben; bei Beschwerden, Schwangerschaft oder Medikamenten bitte ärztlich oder in der Apotheke nachfragen. Wildpflanzen und Pilze nur sammeln und essen, wenn eine Fachperson sie sicher bestimmt hat.";

/** the entries a group contains (in the order of the data) */
export function groupEntries(g: PlantGroup, all: AtlasEntry[]): AtlasEntry[] {
  const out: AtlasEntry[] = [];
  const add = (e?: AtlasEntry) => { if (e && !out.includes(e)) out.push(e); };
  for (const m of g.members) {
    if (m.startsWith("category:")) all.filter((e) => e.category === m.slice(9)).forEach(add);
    else add(all.find((e) => e.id === m));
  }
  return out;
}
