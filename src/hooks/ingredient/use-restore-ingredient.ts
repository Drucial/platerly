"use client"

import { restoreIngredient } from "@/actions/ingredient"
import { createAdminRestoreHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type RestoreIngredientResult = AdminMutationResult & {
  ingredient?: { name: string }
}

const ingredientConfig = {
  entityName: "Ingredient",
  queryKey: "ingredients",
  displayNameFn: (ingredient: unknown) => (ingredient as { name: string }).name
}

export const useRestoreIngredient = createAdminRestoreHook<RestoreIngredientResult>(
  ingredientConfig,
  restoreIngredient
)