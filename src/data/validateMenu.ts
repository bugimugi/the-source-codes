import { MENU, MENU_UNIVERSE } from "./menu.ts";

/**
 * Checks the site menu: seven main points with consecutive numbers, unique ids, every point that is not marked "soon" lists at least
 * one page, a page is listed only once, and every entry opens a page or an atlas category. Returns blocking errors.
 */
export function validateMenu(): string[] {
  const errors: string[] = [];
  const at = (m: string) => errors.push(`Menü: ${m}`);
  if (MENU.length !== 7) at("es müssen sieben Hauptpunkte sein");
  const groups = new Set<string>(), items = new Set<string>(), views = new Set<string>();
  MENU.forEach((g, i) => {
    if (groups.has(g.id)) at(`doppelter Hauptpunkt "${g.id}"`);
    groups.add(g.id);
    if (g.nr !== String(i + 1).padStart(2, "0")) at(`${g.id}: Nummer "${g.nr}" passt nicht zur Reihenfolge`);
    if (!g.label.trim()) at(`${g.id}: Name fehlt`);
    if (g.soon && g.items.length) at(`${g.id}: als "bald" markiert, hat aber Einträge`);
    if (!g.soon && !g.items.length) at(`${g.id}: keine Einträge (oder als "bald" markieren)`);
    for (const it of g.items) {
      if (items.has(it.id)) at(`doppelter Eintrag "${it.id}"`);
      items.add(it.id);
      if (!it.label.trim()) at(`${it.id}: Name fehlt`);
      if (!it.view && !it.atlas) at(`${it.id}: öffnet weder eine Seite noch eine Atlas-Kategorie`);
      if (it.view) {
        if (views.has(it.view)) at(`Seite "${it.view}" steht mehrfach im Menü`);
        views.add(it.view);
      }
    }
  });
  if (!MENU_UNIVERSE.view) at("Universum öffnet keine Seite");
  else if (views.has(MENU_UNIVERSE.view)) at("Universum steht schon in einem Hauptpunkt");
  return errors;
}
