"use client"

import { deleteCuisineType } from "@/actions/cuisine-type"
import { createAdminDeleteHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type DeleteCuisineTypeResult = AdminMutationResult & {
  type?: { name: string }
}

const cuisineTypeConfig = {
  entityName: "Cuisine Type",
  queryKey: "cuisine-types",
  displayNameFn: (type: unknown) => (type as { name: string }).name
}

export const useDeleteCuisineType = createAdminDeleteHook<DeleteCuisineTypeResult>(
  cuisineTypeConfig,
  deleteCuisineType
)