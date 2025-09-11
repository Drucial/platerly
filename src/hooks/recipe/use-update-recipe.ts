"use client"

import { updateRecipe, type UpdateRecipeData } from "@/actions/recipe"
import { createAdminUpdateHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type UpdateRecipeResult = AdminMutationResult & {
  recipe?: { name: string }
}

const recipeConfig = {
  entityName: "Recipe",
  queryKey: "recipes",
  displayNameFn: (recipe: unknown) => (recipe as { name: string }).name
}

export const useUpdateRecipe = createAdminUpdateHook<UpdateRecipeResult, { id: number; data: UpdateRecipeData }>(
  recipeConfig,
  ({ id, data }) => updateRecipe(id, data)
)