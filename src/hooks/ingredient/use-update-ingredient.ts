"use client"

import { updateIngredient, type UpdateIngredientData } from "@/actions/ingredient"
import { createAdminUpdateHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type UpdateIngredientResult = AdminMutationResult & {
  ingredient?: { name: string }
}

const ingredientConfig = {
  entityName: "Ingredient",
  queryKey: "ingredients",
  displayNameFn: (ingredient: unknown) => (ingredient as { name: string }).name
}

export const useUpdateIngredient = createAdminUpdateHook<UpdateIngredientResult, { id: number; data: UpdateIngredientData }>(
  ingredientConfig,
  ({ id, data }) => updateIngredient(id, data)
)