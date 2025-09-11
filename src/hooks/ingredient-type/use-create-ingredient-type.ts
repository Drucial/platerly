"use client"

import { createIngredientType, type CreateIngredientTypeData } from "@/actions/ingredient-type"
import { createAdminCreateHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type CreateIngredientTypeResult = AdminMutationResult & {
  type?: { name: string }
}

const ingredientTypeConfig = {
  entityName: "Ingredient Type",
  queryKey: "ingredient-types",
  displayNameFn: (type: unknown) => (type as { name: string }).name
}

export const useCreateIngredientType = createAdminCreateHook<CreateIngredientTypeResult, CreateIngredientTypeData>(
  ingredientTypeConfig,
  createIngredientType
)