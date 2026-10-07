import type { PlantProfile } from "./profileTypes.ts";

/**
 * Checks the plant profiles against the rest of the knowledge base: every claim id, atlas id and picture name a profile
 * uses must exist, part ids must be unique and callout positions must lie inside the picture. Returns blocking errors.
 */
export function validateProfiles(
  profiles: PlantProfile[],
  claimIds: Set<string>,
  atlasIds: Set<string>,
  slotExists: (name: string) => boolean,
): string[] {
  const errors: string[] = [];
  for (const p of profiles) {
    const at = (m: string) => errors.push(`Profil ${p.id}: ${m}`);
    if (!atlasIds.has(p.id)) at("kein Atlas-Eintrag mit dieser ID");
    const claim = (id: string, where: string) => { if (!claimIds.has(id)) at(`${where}: unbekannte Aussage "${id}"`); };
    const atlas = (id: string, where: string) => { if (!atlasIds.has(id)) at(`${where}: unbekannter Atlas-Eintrag "${id}"`); };
    const slot = (name: string | undefined, where: string) => { if (name && !slotExists(name)) at(`${where}: unbekannter Bildplatz "${name}" (registry.ts)`); };
    p.effects.forEach((e) => claim(e.claim, "Wirkung"));
    claim(p.frequency.claim, "Frequenz");
    p.research.forEach((r) => claim(r.claim, "Forschung"));
    p.network.forEach((n) => { if (n.kind === "plant") atlas(n.ref ?? "", "Wissensnetz"); if (n.kind === "claim") claim(n.ref ?? "", "Wissensnetz"); });
    p.combos.forEach((c) => c.items.forEach((i) => { i.ids.forEach((id) => atlas(id, "Kombination")); slot(i.slot, "Kombination"); }));
    p.forms.forEach((f) => slot(f.slot, "Anwendungsform"));
    p.history.forEach((h) => slot(h.slot, "Geschichte"));
    p.compounds.forEach((g) => g.items.forEach((i) => slot(i.slot, "Inhaltsstoff")));
    const ids = new Set<string>();
    for (const part of p.parts) {
      if (ids.has(part.id)) at(`Teil "${part.id}" doppelt`);
      ids.add(part.id);
      for (const pt of [part.callout?.at, part.callout?.to, part.ring]) if (pt && (pt[0] < 0 || pt[0] > 100 || pt[1] < 0 || pt[1] > 100)) at(`Teil "${part.id}": Position außerhalb des Bildes`);
    }
    if (!ids.has(p.startPart)) at(`startPart "${p.startPart}" ist kein Teil`);
    p.stages.forEach((_, i) => slot(`plant-${p.id}-stage-${i + 1}`, `Wachstumsstufe ${i + 1}`));
    for (const s of ["hero", "sketch", "parts", "origin"]) slot(`plant-${p.id}-${s}`, s);
    if (p.layout === "frucht") slot(`plant-${p.id}-bowl`, "Schale");
    if (p.layout === "kraut") slot(`plant-${p.id}-powder`, "Pulver");
    if (p.nutrients && p.nutrients.rows.some((r) => r.share !== undefined && (r.share < 0 || r.share > 1))) at("Nährstoff-Balken muss zwischen 0 und 1 liegen");
  }
  return errors;
}
