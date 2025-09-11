"use client"

import { updateCuisineType, type UpdateCuisineTypeData } from "@/actions/cuisine-type"
import { createAdminUpdateHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type UpdateCuisineTypeResult = AdminMutationResult & {
  type?: { name: string }
}

const cuisineTypeConfig = {
  entityName: "Cuisine Type",
  queryKey: "cuisine-types",
  displayNameFn: (type: unknown) => (type as { name: string }).name
}

export const useUpdateCuisineType = createAdminUpdateHook<UpdateCuisineTypeResult, { id: number; data: UpdateCuisineTypeData }>(
  cuisineTypeConfig,
  ({ id, data }) => updateCuisineType(id, data)
)