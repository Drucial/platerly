"use client"

import { useQuery } from "@tanstack/react-query"
import { getRecipeById } from "@/actions/recipe"

export function useGetRecipe(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["recipe", id],
    queryFn: () => getRecipeById(id),
    enabled: options?.enabled !== false && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}