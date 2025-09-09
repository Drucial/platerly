"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { restoreStep } from "@/actions/step"

type RestoreStepMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof restoreStep>>,
  Error,
  number
>

export function useRestoreStep(options?: RestoreStepMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => restoreStep(id),
    onSuccess: (result, variables, context) => {
      // Always refetch recipes and steps (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["recipes"] })
      queryClient.refetchQueries({ queryKey: ["step", variables] })
      if (result.success && result.step) {
        queryClient.refetchQueries({ queryKey: ["recipe", result.step.recipe_id] })
        queryClient.refetchQueries({ queryKey: ["steps-by-recipe", result.step.recipe_id] })
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