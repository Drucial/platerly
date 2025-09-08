"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllIngredientLocations } from "@/actions/ingredient-location"

export function useGetAllIngredientLocations(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["ingredient-locations"],
    queryFn: getAllIngredientLocations,
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes (locations change less frequently)
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}