"use client"

import { useQuery } from "@tanstack/react-query"
import { getIngredientLocationById } from "@/actions/ingredient-location"

export function useGetIngredientLocation(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["ingredient-locations", id],
    queryFn: () => getIngredientLocationById(id),
    enabled: options?.enabled !== false && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}