"use client"

import { createRecipe, type CreateRecipeData } from "@/actions/recipe"
import { createAdminCreateHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type CreateRecipeResult = AdminMutationResult & {
  recipe?: { name: string }
}

const recipeConfig = {
  entityName: "Recipe",
  queryKey: "recipes",
  displayNameFn: (recipe: unknown) => (recipe as { name: string }).name
}

export const useCreateRecipe = createAdminCreateHook<CreateRecipeResult, CreateRecipeData>(
  recipeConfig,
  createRecipe
)