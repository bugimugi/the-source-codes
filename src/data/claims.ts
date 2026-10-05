import type { Claim } from "./types";

/**
 * Content lives in content/claims/*.json (one file per claim, see CONTENT.md).
 * Drafts are loaded for validation tooling but never shown on the site.
 */
const modules = import.meta.glob<Claim>("../../content/claims/*.json", {
  eager: true,
  import: "default",
});

export const allClaims: Claim[] = Object.entries(modules)
  .filter(([path]) => !path.split("/").pop()!.startsWith("_"))
  .map(([, c]) => c);

export const claims: Claim[] = allClaims.filter((c) => c.status === "published");
