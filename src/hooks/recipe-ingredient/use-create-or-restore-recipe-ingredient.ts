"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { createOrRestoreRecipeIngredient, type CreateRecipeIngredientData } from "@/actions/recipe-ingredient"

type CreateOrRestoreRecipeIngredientMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof createOrRestoreRecipeIngredient>>,
  Error,
  CreateRecipeIngredientData
>

export function useCreateOrRestoreRecipeIngredient(options?: CreateOrRestoreRecipeIngredientMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (data: CreateRecipeIngredientData) => createOrRestoreRecipeIngredient(data),
    onSuccess: (result, variables, context) => {
      // Always refetch recipe ingredients immediately (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["recipe-ingredients"] })
      queryClient.refetchQueries({ queryKey: ["recipe", variables.recipe_id] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}