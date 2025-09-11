"use client"

import { createIngredientLocation, type CreateIngredientLocationData } from "@/actions/ingredient-location"
import { createAdminCreateHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type CreateIngredientLocationResult = AdminMutationResult & {
  location?: { name: string }
}

const ingredientLocationConfig = {
  entityName: "Ingredient Location",
  queryKey: "ingredient-locations",
  displayNameFn: (location: unknown) => (location as { name: string }).name
}

export const useCreateIngredientLocation = createAdminCreateHook<CreateIngredientLocationResult, CreateIngredientLocationData>(
  ingredientLocationConfig,
  createIngredientLocation
)