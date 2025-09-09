"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { createRecipe, type CreateRecipeData } from "@/actions/recipe"

type CreateRecipeMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof createRecipe>>,
  Error,
  CreateRecipeData
>

export function useCreateRecipe(options?: CreateRecipeMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (data: CreateRecipeData) => createRecipe(data),
    onSuccess: (result, variables, context) => {
      // Always invalidate recipes cache (core hook functionality)
      queryClient.invalidateQueries({ queryKey: ["recipes"] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}