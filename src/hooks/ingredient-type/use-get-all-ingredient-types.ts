"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllIngredientTypes } from "@/actions/ingredient-type"

export function useGetAllIngredientTypes(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["ingredient-types"],
    queryFn: getAllIngredientTypes,
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes (types change less frequently)
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}