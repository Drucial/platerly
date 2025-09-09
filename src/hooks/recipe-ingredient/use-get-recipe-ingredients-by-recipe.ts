"use client"

import { useQuery } from "@tanstack/react-query"
import { getRecipeIngredientsByRecipeId } from "@/actions/recipe-ingredient"

export function useGetRecipeIngredientsByRecipe(recipeId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["recipe-ingredients-by-recipe", recipeId],
    queryFn: () => getRecipeIngredientsByRecipeId(recipeId),
    enabled: options?.enabled !== false && !!recipeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}