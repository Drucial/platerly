"use client"

import { deleteIngredientLocation } from "@/actions/ingredient-location"
import { createAdminDeleteHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type DeleteIngredientLocationResult = AdminMutationResult & {
  location?: { name: string }
}

const ingredientLocationConfig = {
  entityName: "Ingredient Location",
  queryKey: "ingredient-locations",
  displayNameFn: (location: unknown) => (location as { name: string }).name
}

export const useDeleteIngredientLocation = createAdminDeleteHook<DeleteIngredientLocationResult>(
  ingredientLocationConfig,
  deleteIngredientLocation
)