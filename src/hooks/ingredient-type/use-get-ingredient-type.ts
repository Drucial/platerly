"use client"

import { useQuery } from "@tanstack/react-query"
import { getIngredientTypeById } from "@/actions/ingredient-type"

export function useGetIngredientType(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["ingredient-types", id],
    queryFn: () => getIngredientTypeById(id),
    enabled: options?.enabled !== false && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}