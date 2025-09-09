"use client"

import { useQuery } from "@tanstack/react-query"
import { getRecipeTagsByRecipeId } from "@/actions/recipe-tag"

export function useGetRecipeTagsByRecipe(recipeId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["recipe-tags-by-recipe", recipeId],
    queryFn: () => getRecipeTagsByRecipeId(recipeId),
    enabled: options?.enabled !== false && !!recipeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}