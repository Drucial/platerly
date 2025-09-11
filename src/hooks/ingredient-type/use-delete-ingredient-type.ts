"use client"

import { deleteIngredientType } from "@/actions/ingredient-type"
import { createAdminDeleteHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type DeleteIngredientTypeResult = AdminMutationResult & {
  type?: { name: string }
}

const ingredientTypeConfig = {
  entityName: "Ingredient Type",
  queryKey: "ingredient-types",
  displayNameFn: (type: unknown) => (type as { name: string }).name
}

export const useDeleteIngredientType = createAdminDeleteHook<DeleteIngredientTypeResult>(
  ingredientTypeConfig,
  deleteIngredientType
)