"use client"

import { updateIngredientLocation, type UpdateIngredientLocationData } from "@/actions/ingredient-location"
import { createAdminUpdateHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type UpdateIngredientLocationResult = AdminMutationResult & {
  location?: { name: string }
}

const ingredientLocationConfig = {
  entityName: "Ingredient Location",
  queryKey: "ingredient-locations",
  displayNameFn: (location: unknown) => (location as { name: string }).name
}

export const useUpdateIngredientLocation = createAdminUpdateHook<UpdateIngredientLocationResult, { id: number; data: UpdateIngredientLocationData }>(
  ingredientLocationConfig,
  ({ id, data }) => updateIngredientLocation(id, data)
)