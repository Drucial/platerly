"use client"

import { useQuery } from "@tanstack/react-query"
import { getIngredientById } from "@/actions/ingredient"

export function useGetIngredient(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["ingredients", id],
    queryFn: () => getIngredientById(id),
    enabled: options?.enabled !== false && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}