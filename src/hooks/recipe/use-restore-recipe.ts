"use client"

import { restoreRecipe } from "@/actions/recipe"
import { createAdminRestoreHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type RestoreRecipeResult = AdminMutationResult & {
  recipe?: { name: string }
}

const recipeConfig = {
  entityName: "Recipe",
  queryKey: "recipes",
  displayNameFn: (recipe: unknown) => (recipe as { name: string }).name
}

export const useRestoreRecipe = createAdminRestoreHook<RestoreRecipeResult>(
  recipeConfig,
  restoreRecipe
)