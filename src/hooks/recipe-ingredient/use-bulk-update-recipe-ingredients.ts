"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { bulkUpdateRecipeIngredients } from "@/actions/recipe-ingredient"

type BulkUpdateRecipeIngredientsMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof bulkUpdateRecipeIngredients>>,
  Error,
  { recipeId: number; ingredients: Array<{ ingredient_id: number; quantity?: number; unit?: string; notes?: string }> }
>

export function useBulkUpdateRecipeIngredients(options?: BulkUpdateRecipeIngredientsMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ recipeId, ingredients }: { recipeId: number; ingredients: Array<{ ingredient_id: number; quantity?: number; unit?: string; notes?: string }> }) => 
      bulkUpdateRecipeIngredients(recipeId, ingredients),
    onSuccess: (result, variables, context) => {
      // Always refetch recipes and recipe ingredients (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["recipes"] })
      queryClient.refetchQueries({ queryKey: ["recipe", variables.recipeId] })
      queryClient.refetchQueries({ queryKey: ["recipe-ingredients-by-recipe", variables.recipeId] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}