import { readdirSync, readFileSync } from "node:fs";
import type { AtlasEntry, Claim } from "../src/data/types.ts";

const read = <T>(dir: string): T[] => {
  const url = new URL(`../content/${dir}/`, import.meta.url);
  return readdirSync(url)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .map((f) => {
      try {
        return JSON.parse(readFileSync(new URL(f, url), "utf8")) as T;
      } catch (e) {
        console.error(`${dir}/${f}: ungültiges JSON – ${(e as Error).message}`);
        process.exit(1);
      }
    });
};

export const loadClaims = () => read<Claim>("claims");
export const loadAtlas = () => read<AtlasEntry>("atlas");
