"use client"

import { updateIngredientType, type UpdateIngredientTypeData } from "@/actions/ingredient-type"
import { createAdminUpdateHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type UpdateIngredientTypeResult = AdminMutationResult & {
  type?: { name: string }
}

const ingredientTypeConfig = {
  entityName: "Ingredient Type",
  queryKey: "ingredient-types",
  displayNameFn: (type: unknown) => (type as { name: string }).name
}

export const useUpdateIngredientType = createAdminUpdateHook<UpdateIngredientTypeResult, { id: number; data: UpdateIngredientTypeData }>(
  ingredientTypeConfig,
  ({ id, data }) => updateIngredientType(id, data)
)