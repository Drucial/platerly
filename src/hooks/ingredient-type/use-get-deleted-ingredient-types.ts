"use client"

import { useQuery } from "@tanstack/react-query"
import { getDeletedIngredientTypes } from "@/actions/ingredient-type"

export function useGetDeletedIngredientTypes(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["ingredient-types", "deleted"],
    queryFn: getDeletedIngredientTypes,
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}