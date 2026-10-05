import type { AtlasEntry } from "./types";

const modules = import.meta.glob<AtlasEntry>("../../content/atlas/*.json", { eager: true, import: "default" });

export const allAtlas: AtlasEntry[] = Object.entries(modules)
  .filter(([path]) => !path.split("/").pop()!.startsWith("_"))
  .map(([, e]) => e);

export const atlas: AtlasEntry[] = allAtlas.filter((e) => e.status === "published");
