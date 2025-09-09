"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { updateRecipe, type UpdateRecipeData } from "@/actions/recipe"

type UpdateRecipeMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof updateRecipe>>,
  Error,
  { id: number; data: UpdateRecipeData }
>

export function useUpdateRecipe(options?: UpdateRecipeMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ id, data }: { id: number; data: UpdateRecipeData }) => 
      updateRecipe(id, data),
    onSuccess: (result, variables, context) => {
      // Always invalidate recipes cache (core hook functionality)
      queryClient.invalidateQueries({ queryKey: ["recipes"] })
      queryClient.invalidateQueries({ queryKey: ["recipe", variables.id] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}