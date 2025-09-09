"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { deleteStep } from "@/actions/step"

type DeleteStepMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof deleteStep>>,
  Error,
  number
>

export function useDeleteStep(options?: DeleteStepMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => deleteStep(id),
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