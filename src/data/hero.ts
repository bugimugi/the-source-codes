import type { SlotName } from "../assets/registry.ts";

/**
 * The changing background of the home page hero (src/ui/heroBackground.ts). The pictures are the slots `hero-bg-<n>` (public/assets);
 * only those that exist are used, in this order. The old hero layers (world, figures, DNA …) stay in place underneath, unseen, so the
 * pins and the fly-in keep working. For now this is a trial: the final hero picture is still to be chosen.
 *
 *   enabled     false = the old hero composition is shown again, nothing else changes
 *   seconds     how long a picture stays
 *   fadeSeconds how long the cross-fade takes
 */
export const HERO_BACKGROUND = {
  enabled: true,
  seconds: 9,
  fadeSeconds: 1.8,
  slots: [
    "hero-bg-1", "hero-bg-2", "hero-bg-3", "hero-bg-4", "hero-bg-5", "hero-bg-6",
    "hero-bg-7", "hero-bg-8", "hero-bg-9", "hero-bg-10", "hero-bg-11", "hero-bg-12",
  ] as SlotName[],
};
