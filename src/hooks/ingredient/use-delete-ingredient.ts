"use client"

import { deleteIngredient } from "@/actions/ingredient"
import { createAdminDeleteHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type DeleteIngredientResult = AdminMutationResult & {
  ingredient?: { name: string }
}

const ingredientConfig = {
  entityName: "Ingredient",
  queryKey: "ingredients",
  displayNameFn: (ingredient: unknown) => (ingredient as { name: string }).name
}

export const useDeleteIngredient = createAdminDeleteHook<DeleteIngredientResult>(
  ingredientConfig,
  deleteIngredient
)