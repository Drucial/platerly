"use client"

import { deleteRecipe } from "@/actions/recipe"
import { createAdminDeleteHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type DeleteRecipeResult = AdminMutationResult & {
  recipe?: { name: string }
}

const recipeConfig = {
  entityName: "Recipe",
  queryKey: "recipes",
  displayNameFn: (recipe: unknown) => (recipe as { name: string }).name
}

export const useDeleteRecipe = createAdminDeleteHook<DeleteRecipeResult>(
  recipeConfig,
  deleteRecipe
)