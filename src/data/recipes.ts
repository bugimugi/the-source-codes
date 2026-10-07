import type { Recipe } from "./recipeTypes.ts";
import { RECIPES_ANTIKE } from "./recipesAntike.ts";
import { RECIPES_ASIEN } from "./recipesAsien.ts";
import { RECIPES_OMA } from "./recipesOma.ts";

export * from "./recipeTypes.ts";

/** The workbench list: household practice first, then monasteries, Asia, antiquity and indigenous traditions. */
export const RECIPES: Recipe[] = [...RECIPES_OMA, ...RECIPES_ASIEN, ...RECIPES_ANTIKE];
