"use client"

import { useQuery } from "@tanstack/react-query"
import { getStepsByRecipeId } from "@/actions/step"

export function useGetStepsByRecipe(recipeId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["steps-by-recipe", recipeId],
    queryFn: () => getStepsByRecipeId(recipeId),
    enabled: options?.enabled !== false && !!recipeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}