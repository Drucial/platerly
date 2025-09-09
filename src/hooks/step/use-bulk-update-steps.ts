"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { bulkUpdateSteps } from "@/actions/step"

type BulkUpdateStepsMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof bulkUpdateSteps>>,
  Error,
  { recipeId: number; steps: Array<{ name: string; description: string; order: number }> }
>

export function useBulkUpdateSteps(options?: BulkUpdateStepsMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ recipeId, steps }: { recipeId: number; steps: Array<{ name: string; description: string; order: number }> }) => 
      bulkUpdateSteps(recipeId, steps),
    onSuccess: (result, variables, context) => {
      // Always refetch recipes and steps (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["recipes"] })
      queryClient.refetchQueries({ queryKey: ["recipe", variables.recipeId] })
      queryClient.refetchQueries({ queryKey: ["steps-by-recipe", variables.recipeId] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}