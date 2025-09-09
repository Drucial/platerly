"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { bulkCreateRecipeIngredients } from "@/actions/recipe-ingredient"

type BulkCreateRecipeIngredientsMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof bulkCreateRecipeIngredients>>,
  Error,
  { recipeId: number; ingredients: Array<{ ingredient_id: number; quantity?: number; unit?: string; notes?: string }> }
>

export function useBulkCreateRecipeIngredients(options?: BulkCreateRecipeIngredientsMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ recipeId, ingredients }: { recipeId: number; ingredients: Array<{ ingredient_id: number; quantity?: number; unit?: string; notes?: string }> }) => 
      bulkCreateRecipeIngredients(recipeId, ingredients),
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