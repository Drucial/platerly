"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { updateRecipeIngredient, type UpdateRecipeIngredientData } from "@/actions/recipe-ingredient"

type UpdateRecipeIngredientMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof updateRecipeIngredient>>,
  Error,
  { id: number; data: UpdateRecipeIngredientData }
>

export function useUpdateRecipeIngredient(options?: UpdateRecipeIngredientMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ id, data }: { id: number; data: UpdateRecipeIngredientData }) => 
      updateRecipeIngredient(id, data),
    onSuccess: (result, variables, context) => {
      // Always refetch recipes and recipe ingredients (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["recipes"] })
      queryClient.refetchQueries({ queryKey: ["recipe-ingredient", variables.id] })
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