"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { restoreRecipeIngredient } from "@/actions/recipe-ingredient"

type RestoreRecipeIngredientMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof restoreRecipeIngredient>>,
  Error,
  number
>

export function useRestoreRecipeIngredient(options?: RestoreRecipeIngredientMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => restoreRecipeIngredient(id),
    onSuccess: (result, variables, context) => {
      // Always refetch recipes and recipe ingredients (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["recipes"] })
      queryClient.refetchQueries({ queryKey: ["recipe-ingredient", variables] })
      if (result.success && result.recipeIngredient) {
        queryClient.refetchQueries({ queryKey: ["recipe", result.recipeIngredient.recipe_id] })
        queryClient.refetchQueries({ queryKey: ["recipe-ingredients-by-recipe", result.recipeIngredient.recipe_id] })
      }
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}