import type { Recipe } from "./recipeTypes.ts";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
/** wording that would turn a household recipe into a promise or a dosing instruction */
const PROMISE = /\b(heilt|heilen Sie|garantiert|wirkt sicher|ersetzt (die|das) (medikament|tablette)|statt (ihrer|der) medikament)/i;
const DOSING = /\b\d+\s*(mal|x)\s*(täglich|am tag|pro tag)\b/i;

/** Integrity rules for the recipe workbench: ids, ingredient references, safety text, honest evidence level, no promises or dosing. */
export function validateRecipes(recipes: Recipe[]): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const ids = new Set<string>();
  for (const r of recipes) {
    const at = (m: string) => `rezept/${r.id}: ${m}`;
    if (ids.has(r.id)) errors.push(at("doppelte ID"));
    ids.add(r.id);
    const ing = new Set<string>();
    for (const i of r.ingredients) {
      if (ing.has(i.id)) errors.push(at(`doppelte Zutat ${i.id}`));
      ing.add(i.id);
      if (i.amount <= 0 && !i.unit.trim()) errors.push(at(`Zutat ${i.id} ohne Menge und ohne Hinweis`));
      if (!/^#[0-9a-f]{6}$/i.test(i.color)) errors.push(at(`Zutat ${i.id}: Farbe muss #rrggbb sein`));
    }
    const added = new Set<string>();
    for (const [n, s] of r.steps.entries()) {
      for (const a of s.add ?? []) {
        if (!ing.has(a)) errors.push(at(`Schritt ${n + 1} nennt unbekannte Zutat ${a}`));
        added.add(a);
      }
      if (s.minutes !== undefined && (s.minutes <= 0 || s.minutes > 600)) errors.push(at(`Schritt ${n + 1}: unplausible Zeit`));
    }
    for (const i of r.ingredients) if (!added.has(i.id)) warnings.push(at(`Zutat ${i.id} kommt in keinem Schritt vor`));
    if (!r.safety.length) errors.push(at("Sicherheitshinweise fehlen"));
    if (!r.doctor.trim()) errors.push(at("„Wann zum Arzt“ fehlt"));
    if (!r.sources.length) errors.push(at("keine Quelle"));
    if (!r.sources.some((s) => /Source pending verification/i.test(s.label)) && !r.review?.reviewer) warnings.push(at("keine Quelle mit Prüfvermerk"));
    if (r.evidence.level === "established" || r.evidence.level === "supported" || r.evidence.level === "refuted")
      if (r.review?.state !== "confirmed" && r.review?.state !== "corrected") errors.push(at(`Belegstufe „${r.evidence.level}“ nur nach Fachprüfung`));
    if (r.review && (r.review.state === "confirmed" || r.review.state === "corrected") && (!r.review.reviewer?.trim() || !r.review.date || !ISO_DATE.test(r.review.date)))
      errors.push(at("Fachprüfung ohne Name (reviewer) oder Datum (YYYY-MM-DD)"));
    const text = [r.name, r.tradition, r.evidence.text, ...r.steps.map((s) => s.text), ...r.safety].join(" \n ");
    if (PROMISE.test(text)) errors.push(at("Heilversprechen im Text"));
    if (DOSING.test(text)) errors.push(at("Dosierungsangabe im Text (Pilot: keine Dosierungen)"));
  }
  return { errors, warnings };
}
