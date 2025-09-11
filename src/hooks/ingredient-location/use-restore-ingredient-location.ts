"use client"

import { restoreIngredientLocation } from "@/actions/ingredient-location"
import { createAdminRestoreHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type RestoreIngredientLocationResult = AdminMutationResult & {
  location?: { name: string }
}

const ingredientLocationConfig = {
  entityName: "Ingredient Location",
  queryKey: "ingredient-locations",
  displayNameFn: (location: unknown) => (location as { name: string }).name
}

export const useRestoreIngredientLocation = createAdminRestoreHook<RestoreIngredientLocationResult>(
  ingredientLocationConfig,
  restoreIngredientLocation
)