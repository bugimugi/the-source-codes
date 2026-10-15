/**
 * The one menu of the site (src/ui/siteMenu.ts): the same seven main points on the home page and on every page; hovering or clicking
 * a point lists its pages, a click on a page opens it. The points follow the learning path of the project instructions (CLAUDE.md,
 * "Zielbild: Menü und Lernweg"). Which page sits under which point is decided here and nowhere else.
 *
 * Pages that are reached from another page are not listed (cymatics and geometry from "Frequenz", the 3D chakras from "Chakren",
 * element profiles from "Mineralien"); they mark their parent as current via `also`.
 */
export type MenuView =
  | "anatomy" | "body" | "beschwerden"
  | "plants" | "produce" | "trees" | "mushrooms" | "minerals" | "crystals" | "nutrients" | "atlas"
  | "freq" | "chakren" | "atem" | "cultures" | "places" | "lab" | "breath" | "energy" | "universe";

export interface MenuItem {
  id: string;
  label: string;
  /** the page this entry opens */
  view?: MenuView;
  /** opens the atlas on this category instead of a page of its own */
  atlas?: "pilz";
  /** sub-pages that mark this entry as current (`plant:<landing page>` = a plant profile opened from that page) */
  also?: string[];
}

export interface MenuGroup {
  id: string;
  nr: string;
  label: string;
  items: MenuItem[];
  /** planned, but no page yet: shown greyed out */
  soon?: boolean;
}

export const MENU: MenuGroup[] = [
  {
    id: "koerper", nr: "01", label: "Der Körper",
    items: [
      { id: "anatomy", label: "Menschlicher Körper", view: "anatomy" },
      { id: "body", label: "Organe", view: "body" },
      { id: "beschwerden", label: "Beschwerden", view: "beschwerden" },
    ],
  },
  {
    id: "erde", nr: "02", label: "Gaben der Erde",
    items: [
      { id: "plants", label: "Pflanzen", view: "plants", also: ["plant:plants"] },
      { id: "trees", label: "Bäume", view: "trees", also: ["plant:trees"] },
      { id: "produce", label: "Obst & Gemüse", view: "produce", also: ["plant:produce"] },
      { id: "pilze", label: "Pilze", view: "mushrooms", also: ["plant:mushrooms"] },
      { id: "minerals", label: "Mineralien", view: "minerals", also: ["element"] },
      { id: "crystals", label: "Kristalle", view: "crystals" },
      { id: "nutrients", label: "Nährstoffe", view: "nutrients" },
      { id: "atlas", label: "Atlas (alle Einträge)", view: "atlas" },
    ],
  },
  {
    id: "schwingung", nr: "03", label: "Schwingung",
    items: [{ id: "freq", label: "Frequenz", view: "freq", also: ["fx"] }],
  },
  {
    id: "unsichtbar", nr: "04", label: "Das Unsichtbare",
    items: [
      { id: "chakren", label: "Chakren", view: "chakren", also: ["chakra"] },
      { id: "atem", label: "Atem", view: "atem" },
    ],
  },
  {
    id: "verloren", nr: "05", label: "Verlorenes Wissen",
    items: [
      { id: "cultures", label: "Alte Kulturen", view: "cultures" },
      { id: "places", label: "Heilige Orte", view: "places" },
    ],
  },
  {
    id: "rituale", nr: "06", label: "Rezepte & Rituale",
    items: [
      { id: "lab", label: "Rezepte & Rituale", view: "lab" },
      { id: "breath", label: "Atemübung", view: "breath" },
      { id: "energy", label: "Freie Energie der Erde", view: "energy" },
    ],
  },
  { id: "warum", nr: "07", label: "Warum wir hier sind", items: [], soon: true },
];

/** the library (the knowledge matrix); the old galaxy map marks it as current as well */
export const MENU_UNIVERSE: MenuItem = { id: "universe", label: "Universum", view: "universe", also: ["galaxy"] };
