"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { restoreRecipe } from "@/actions/recipe"

type RestoreRecipeMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof restoreRecipe>>,
  Error,
  number
>

export function useRestoreRecipe(options?: RestoreRecipeMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => restoreRecipe(id),
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