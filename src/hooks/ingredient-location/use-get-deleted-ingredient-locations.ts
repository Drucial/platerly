"use client"

import { useQuery } from "@tanstack/react-query"
import { getDeletedIngredientLocations } from "@/actions/ingredient-location"

export function useGetDeletedIngredientLocations(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["ingredient-locations", "deleted"],
    queryFn: getDeletedIngredientLocations,
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}