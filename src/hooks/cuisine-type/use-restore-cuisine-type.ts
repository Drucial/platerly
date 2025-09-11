"use client"

import { restoreCuisineType } from "@/actions/cuisine-type"
import { createAdminRestoreHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type RestoreCuisineTypeResult = AdminMutationResult & {
  type?: { name: string }
}

const cuisineTypeConfig = {
  entityName: "Cuisine Type",
  queryKey: "cuisine-types",
  displayNameFn: (type: unknown) => (type as { name: string }).name
}

export const useRestoreCuisineType = createAdminRestoreHook<RestoreCuisineTypeResult>(
  cuisineTypeConfig,
  restoreCuisineType
)