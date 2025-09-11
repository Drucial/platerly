"use client"

import { createCuisineType, type CreateCuisineTypeData } from "@/actions/cuisine-type"
import { createAdminCreateHook } from "@/utils/mutations/hooks"
import { createCreateHook } from "@/utils/mutations"
import type { AdminMutationResult, MutationResult } from "@/utils/mutations/mutations"

type CreateCuisineTypeResult = MutationResult & {
  cuisineType?: { id: number; name: string }
}

const cuisineTypeConfig = {
  entityName: "Cuisine Type",
  queryKey: "cuisine-types",
  displayNameFn: (type: unknown) => (type as { name: string }).name
}

// Flexible hook that can be used in both admin and user contexts
const baseCreateCuisineTypeHook = createCreateHook<CreateCuisineTypeResult, CreateCuisineTypeData>(
  cuisineTypeConfig,
  createCuisineType
)

// Default export for general use (uses "user" notification style)
export const useCreateCuisineType = (options?: { notificationStyle?: "admin" | "user" | "none" }) => {
  return baseCreateCuisineTypeHook({
    notificationStyle: options?.notificationStyle || "user"
  })
}

// Admin-specific variant with admin styling and handlers
export const useCreateCuisineTypeAdmin = createAdminCreateHook<AdminMutationResult & CreateCuisineTypeResult, CreateCuisineTypeData>(
  cuisineTypeConfig,
  createCuisineType
)