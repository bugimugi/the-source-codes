import type { AtlasEntry } from "../data/types";
import { hasAsset } from "../assets/slots";
import { ico } from "./icons";

/** Small pieces shared by the landing pages of the plant, fruit and vegetable, and tree atlases. */

/** a picture slot when the file exists, else a tinted placeholder with an icon (same box; see `.og-ph` in produce.css) */
export function ph(slot: string, cls: string, icon: string, tint: string): string {
  return hasAsset(slot)
    ? `<div class="${cls}" data-slot="${slot}" data-fit="cover" data-sizes="(max-width: 700px) 40vw, 14vw"></div>`
    : `<div class="${cls} og-ph" style="--tint:${tint}">${ico(icon, "big")}</div>`;
}

/** the card picture of an atlas entry: its own image, else the glowing nutrient motif, else the glyph placeholder */
export function itemImage(e: AtlasEntry, cls = "pl-card-img"): string {
  const own = `atlas-${e.id}`, nut = `nutrient-${e.id}`;
  const name = hasAsset(own) ? own : hasAsset(nut) ? nut : own;
  return `<div class="${cls}${hasAsset(name) ? "" : " atlas-fallback"}" data-slot="${name}" data-fit="cover" data-sizes="(max-width: 700px) 40vw, 12vw" style="--tint:${e.model.color}" data-glyph="✿"></div>`;
}
