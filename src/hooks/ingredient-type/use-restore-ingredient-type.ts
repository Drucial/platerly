"use client"

import { restoreIngredientType } from "@/actions/ingredient-type"
import { createAdminRestoreHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type RestoreIngredientTypeResult = AdminMutationResult & {
  type?: { name: string }
}

const ingredientTypeConfig = {
  entityName: "Ingredient Type",
  queryKey: "ingredient-types",
  displayNameFn: (type: unknown) => (type as { name: string }).name
}

export const useRestoreIngredientType = createAdminRestoreHook<RestoreIngredientTypeResult>(
  ingredientTypeConfig,
  restoreIngredientType
)