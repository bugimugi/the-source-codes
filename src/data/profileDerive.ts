import type { AtlasEntry, Claim } from "./types.ts";
import { CATEGORY_LABEL } from "./types.ts";
import type { Box, DeriveContext, FungusField, MapLayer, PlantProfile, ProfileCombo } from "./profileTypes.ts";
import { ORIGIN_LABEL as RECIPE_ORIGIN } from "./recipeTypes.ts";
import { REGIONS, type Region } from "./plants.ts";
import {
  BUBBLE_FALLBACK_ICON, BUBBLE_ICONS, COMBO_TABS, DERIVED, FUNGUS_FIELDS, GLANCE_NAME, LIMITS, NOTES, SAFETY_FACTS, VESSEL_FALLBACK_ICON, VESSEL_ICONS,
  composeSafety, factRoute, fungusValue, isMushroom, isPlantLike, isSafetyClaim, sectionsFor, textsFor,
} from "./profileTemplate.ts";

/**
 * Builds the plant profile of an atlas entry that has no hand-written profile (rules: docs/PROFIL-TEMPLATE.md). Pure: it reads only
 * the entry and the context, and it invents nothing. A section without data stays empty; the renderer shows its placeholder and
 * `missing` lists it (scripts/profile-missing.ts turns that into docs/FEHLENDE-INHALTE.md).
 */

/** rough boxes of the world regions (the map of a profile without its own origin layers) */
export const REGION_BOX: Record<Region, Box> = {
  europa: { lat0: 36, lon0: -10, lat1: 62, lon1: 40 }, asien: { lat0: 5, lon0: 60, lat1: 55, lon1: 140 }, afrika: { lat0: -34, lon0: -17, lat1: 35, lon1: 50 },
  nordamerika: { lat0: 15, lon0: -130, lat1: 60, lon1: -60 }, suedamerika: { lat0: -55, lon0: -80, lat1: 12, lon1: -35 }, ozeanien: { lat0: -45, lon0: 110, lat1: -10, lon1: 155 },
};

/** the words of a text, without punctuation: "Herz & Kreislauf" -> Herz, Kreislauf (an association "Herzchakra" must not match "Herz") */
const wordsOf = (s: string): string[] => s.split(/[^\p{L}]+/u).filter(Boolean);
const hasWord = (target: string, words: readonly string[]): boolean => {
  const w = wordsOf(target);
  return words.some((x) => w.includes(x));
};
/** the name without a trailing bracket: "Reishi (Glänzender Lackporling)" -> "Reishi" */
const short = (name: string): string => name.replace(/\s*\([^)]*\)\s*$/, "");
const unique = <T>(list: T[], key: (x: T) => string): T[] => {
  const seen = new Set<string>();
  return list.filter((x) => { const k = key(x); if (seen.has(k)) return false; seen.add(k); return true; });
};

const COMPOUND_LABELS = new Set(["Inhaltsstoffe", "Inhaltsstoff", "Inhalt"]);

/**
 * The short title of a claim for lists and network nodes: "Kamille – traditionelle Anwendung" -> "Traditionelle Anwendung" (the page is
 * already about the entry). Only a leading name that belongs to this entry is cut off; the full title stays in the claim itself.
 */
function claimLabel(c: Claim, e: AtlasEntry): string {
  const full = c.short ?? c.statement;
  const m = /^(.{1,60}?)\s[–-]\s(.+)$/.exec(full);
  if (!m) return full;
  const lead = m[1].toLowerCase(), hay = `${e.name} ${e.latin}`.toLowerCase();
  if (!hay.includes(lead)) return full;
  return m[2].charAt(0).toUpperCase() + m[2].slice(1);
}

export function deriveProfile(e: AtlasEntry, ctx: DeriveContext): PlantProfile {
  const mush = isMushroom(e.category);
  const fact = (label: string) => e.facts.find((f) => f.label === label && f.value.trim())?.value.trim() ?? "";

  // ---- sort the atlas facts by their route
  const glance: PlantProfile["glance"] = [{ icon: GLANCE_NAME.icon, label: GLANCE_NAME.label, value: e.latin }];
  const traits: PlantProfile["traits"] = [], sensory: PlantProfile["sensory"] = [], compoundLines: string[] = [];
  let originFact = "";
  for (const f of e.facts) {
    const value = f.value.trim();
    if (!value) continue;
    const r = factRoute(f.label, mush);
    if (r.to === "glance") glance.push({ icon: r.icon, label: f.label, value });
    else if (r.to === "traits") traits.push({ icon: r.icon, label: f.label, value });
    else if (r.to === "sensory") sensory.push({ icon: r.icon, label: f.label, value });
    else if (r.to === "compounds") compoundLines.push(COMPOUND_LABELS.has(f.label) ? value : `${f.label}: ${value}`);
    else if (r.to === "origin") {
      if (!originFact) originFact = value;
      glance.push({ icon: r.icon, label: f.label === "Heimat" || f.label === "Herkunft" ? "Herkunft" : f.label, value });
    }
    // "fungus" (mushroom fields) and "safety" (Giftig, Hinweis) are shown in their own place below
  }

  // ---- head of the page
  const family = fact("Familie").replace(/\s*\(.*\)/, "");
  const systems = unique(e.associations.map((a) => a.system), (s) => s).slice(0, 2);
  const tags = unique([CATEGORY_LABEL[e.category], ...(family ? [family] : []), ...systems], (s) => s).slice(0, LIMITS.tags);
  const bubbles = unique(
    e.associations.filter((a) => a.origin === "traditional").map((a) => ({ label: a.target, icon: BUBBLE_ICONS.find((b) => hasWord(a.target, b.words))?.icon ?? BUBBLE_FALLBACK_ICON })),
    (b) => b.label,
  ).slice(0, LIMITS.bubbles);

  // ---- origin (fact + region of the map)
  const regions = (ctx.origin[e.id] ?? []).filter((r): r is Region => r in REGION_BOX);
  const regionNames = regions.map((r) => REGIONS.find((x) => x.id === r)?.name ?? r);
  const originOnly = mush ? ["Heimat", "Herkunft"].map(fact).find(Boolean) ?? "" : originFact; // mushrooms: "Vorkommen" is the habitat field
  let origin: PlantProfile["origin"];
  if (originOnly || regions.length) {
    const layers: MapLayer[] = regions.length ? [{ label: "Herkunftsregion", color: "#f0a248", boxes: regions.map((r) => REGION_BOX[r]) }] : [];
    origin = {
      place: { title: regionNames.length ? regionNames.join(" · ") : "Herkunft", text: originOnly || `${mush ? "Verbreitung (Auswahl)" : "Herkunftsregion"} laut Lehrbuchwissen: ${regionNames.join(", ")}.` },
      layers,
      note: layers.length ? NOTES.region : NOTES.facts,
    };
  }

  // ---- compounds: the atlas facts as one group, without amounts
  const compounds: PlantProfile["compounds"] = compoundLines.length
    ? [{ tab: "Laut Atlas-Eintrag", items: [{ title: "Laut Atlas-Eintrag", text: "", bullets: compoundLines, bulletsNote: NOTES.compounds }] }]
    : [];

  // ---- effects: the published claims of the entry, each with its level (the page itself claims nothing); safety claims go to the safety section
  const entryClaims = e.claims.map((id) => ctx.claims.find((c) => c.id === id)).filter((c): c is Claim => !!c);
  const effects: PlantProfile["effects"] = entryClaims.filter((c) => !isSafetyClaim(c.id)).map((c) => ({ label: claimLabel(c, e), icon: "target", claim: c.id }));

  // ---- forms: recipes of the workbench that name the entry (name and origin only, no amounts)
  const forms: PlantProfile["forms"] = ctx.recipes
    .filter((r) => r.ingredients.some((i) => i.id === e.id))
    .map((r) => ({ name: r.name, text: `${NOTES.recipe}, ${RECIPE_ORIGIN[r.origin]}`, icon: VESSEL_ICONS[r.vessel] ?? VESSEL_FALLBACK_ICON, recipe: r.id }));

  // ---- combinations, both directions (a pairing is shown on both sides)
  type Pair = { other: AtlasEntry; note: string; origin: "traditional" | "modern" | "unknown" };
  const pairs: Pair[] = [];
  for (const c of e.combinations) { const other = ctx.entries.find((x) => x.id === c.with); if (other) pairs.push({ other, note: c.note, origin: c.origin }); }
  for (const x of ctx.entries) {
    if (x.id === e.id || pairs.some((p) => p.other.id === x.id)) continue;
    const back = x.combinations.find((c) => c.with === e.id);
    if (back) pairs.push({ other: x, note: back.note, origin: back.origin });
  }
  const combos: PlantProfile["combos"] = (["traditional", "modern", "unknown"] as const)
    .map((o) => ({
      tab: COMBO_TABS[o],
      items: pairs.filter((p) => p.origin === o).map((p): ProfileCombo => ({ title: `${short(e.name)} + ${short(p.other.name)}`, sub: p.note, ids: [e.id, p.other.id], slot: `atlas-${p.other.id}` })),
    }))
    .filter((g) => g.items.length);

  // ---- research: sources with an address from the claims (studies), then the sources of the atlas entry
  const research: PlantProfile["research"] = [];
  const seenUrl = new Set<string>();
  const add = (row: PlantProfile["research"][number]) => { if (!seenUrl.has(row.url)) { seenUrl.add(row.url); research.push(row); } };
  for (const c of entryClaims) {
    for (const s of c.sources) {
      if (!s.url || s.kind === "editorial-input" || s.kind === "interview") continue;
      add({ title: s.title, year: s.year ?? 0, url: s.url, claim: c.id, from: "claim" });
    }
  }
  const hasClaimStudies = research.some((r) => r.claim && !isSafetyClaim(r.claim));
  for (const s of e.sources) if (s.url) add({ title: s.title, year: s.year ?? 0, url: s.url, from: "atlas", more: hasClaimStudies });

  // ---- knowledge network: pairings, body areas, claims, traditions (round robin up to the limit)
  const organs = unique(
    e.associations.flatMap((a) => ctx.organs.filter((o) => hasWord(a.target, o.match))),
    (o) => o.id,
  ).map((o) => ({ label: o.name, kind: "organ" as const, ref: o.id }));
  const groups: PlantProfile["network"][] = [
    pairs.map((p) => ({ label: short(p.other.name), kind: "plant" as const, ref: p.other.id })),
    organs,
    entryClaims.map((c) => ({ label: claimLabel(c, e), kind: "claim" as const, ref: c.id })),
    unique(e.associations.filter((a) => a.origin === "traditional"), (a) => a.system).map((a) => ({
      label: a.system, kind: "info" as const,
      hint: `Zuordnung laut Atlas-Eintrag: ${a.system} ordnet ${short(e.name)} dem Bereich „${a.target}“ zu. Das ist Überlieferung, kein Wirkungsnachweis.`,
    })),
  ];
  const network: PlantProfile["network"] = [];
  for (let i = 0; network.length < LIMITS.network && groups.some((g) => i < g.length); i++) {
    for (const g of groups) if (i < g.length && network.length < LIMITS.network) network.push(g[i]);
  }

  // ---- mushrooms: the extra fields
  const fungus: FungusField[] | undefined = mush
    ? FUNGUS_FIELDS.map((d) => ({ id: d.id, label: d.label, icon: d.icon, value: fungusValue(d, e.facts), ...(d.safety ? { safety: true } : {}) }))
    : undefined;

  // ---- which sections are placeholders
  const isEmpty: Record<string, boolean> = {
    "pp-plant": true, "pp-fungus": !!fungus && fungus.every((f) => f.value === null), "pp-traits": !traits.length, "pp-origin": !origin, "pp-sensory": !sensory.length,
    "pp-growth": true, "pp-compounds": !compounds.length, "pp-effects": !effects.length, "pp-freq": true, "pp-forms": !forms.length, "pp-combos": !combos.length,
    "pp-history": true, "pp-research": !research.some((r) => !(r.claim && isSafetyClaim(r.claim))), "pp-network": !network.length,
  };
  const missing = sectionsFor(e.category).filter((s) => isEmpty[s.id]).map((s) => s.id);

  const poison = fact(SAFETY_FACTS.poison);
  return {
    id: e.id,
    layout: DERIVED.layout,
    art: DERIVED.art,
    derived: true,
    missing,
    ...(fungus ? { fungus } : {}),
    poisonous: !!poison,
    t: textsFor(e.category),
    crumb: CATEGORY_LABEL[e.category],
    tags,
    lead: e.tradition.trim(),
    bubbles,
    glance,
    parts: [],
    startPart: "",
    traits: mush ? [] : traits,
    traitsNote: !mush && traits.length ? NOTES.facts : "",
    gallery: DERIVED.gallery,
    ...(origin ? { origin } : {}),
    sensory,
    stages: [],
    compounds,
    effects,
    forms,
    combos,
    history: [],
    historyNote: "",
    research,
    network,
    safety: composeSafety({ mushroom: mush, poison, hint: fact(SAFETY_FACTS.hint) }),
  };
}

/** The profile a page shows: the hand-written one if there is one, else the derived one for plant-like entries, else null (short profile / other page). */
export function profileFor(e: AtlasEntry, ctx: DeriveContext, hand: Readonly<Record<string, PlantProfile>>): PlantProfile | null {
  if (hand[e.id]) return hand[e.id];
  return isPlantLike(e.category) ? deriveProfile(e, ctx) : null;
}
