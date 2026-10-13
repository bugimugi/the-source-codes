import { HERO_BACKGROUND } from "./hero.ts";

/**
 * Checks the changing hero background: every picture name exists in the registry, none is listed twice, and the times are sensible
 * (a picture stays 3 to 60 seconds, the fade is at least a second shorter). Returns blocking errors.
 */
export function validateHero(slotExists: (name: string) => boolean): string[] {
  const errors: string[] = [];
  const at = (m: string) => errors.push(`Hero-Hintergrund: ${m}`);
  const { seconds, fadeSeconds, slots } = HERO_BACKGROUND;
  if (!slots.length) at("keine Bilder eingetragen");
  if (new Set(slots).size !== slots.length) at("ein Bild steht doppelt in der Liste");
  for (const s of slots) if (!slotExists(s)) at(`Bildplatz "${s}" fehlt (registry.ts)`);
  if (!(seconds >= 3 && seconds <= 60)) at(`seconds=${seconds} liegt nicht zwischen 3 und 60`);
  if (!(fadeSeconds > 0 && fadeSeconds <= seconds - 1)) at(`fadeSeconds=${fadeSeconds} muss größer als 0 und mindestens 1 Sekunde kürzer als seconds sein`);
  return errors;
}
