"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { createRecipeIngredient, type CreateRecipeIngredientData } from "@/actions/recipe-ingredient"

type CreateRecipeIngredientMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof createRecipeIngredient>>,
  Error,
  CreateRecipeIngredientData
>

export function useCreateRecipeIngredient(options?: CreateRecipeIngredientMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (data: CreateRecipeIngredientData) => createRecipeIngredient(data),
    onSuccess: (result, variables, context) => {
      // Always refetch recipes and recipe ingredients (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["recipes"] })
      queryClient.refetchQueries({ queryKey: ["recipe", variables.recipe_id] })
      queryClient.refetchQueries({ queryKey: ["recipe-ingredients-by-recipe", variables.recipe_id] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}