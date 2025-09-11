"use client"

import { createIngredient, type CreateIngredientData } from "@/actions/ingredient"
import { createAdminCreateHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type CreateIngredientResult = AdminMutationResult & {
  ingredient?: { name: string }
}

const ingredientConfig = {
  entityName: "Ingredient",
  queryKey: "ingredients",
  displayNameFn: (ingredient: unknown) => (ingredient as { name: string }).name
}

export const useCreateIngredient = createAdminCreateHook<CreateIngredientResult, CreateIngredientData>(
  ingredientConfig,
  createIngredient
)