"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { deleteRecipe } from "@/actions/recipe"

type DeleteRecipeMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof deleteRecipe>>,
  Error,
  number
>

export function useDeleteRecipe(options?: DeleteRecipeMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => deleteRecipe(id),
    onSuccess: (result, variables, context) => {
      // Always invalidate recipes cache (core hook functionality)
      queryClient.invalidateQueries({ queryKey: ["recipes"] })
      queryClient.invalidateQueries({ queryKey: ["recipes", "deleted"] })
      queryClient.invalidateQueries({ queryKey: ["recipe", variables] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}