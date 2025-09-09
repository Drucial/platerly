"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { updateStep, type UpdateStepData } from "@/actions/step"

type UpdateStepMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof updateStep>>,
  Error,
  { id: number; data: UpdateStepData }
>

export function useUpdateStep(options?: UpdateStepMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ id, data }: { id: number; data: UpdateStepData }) => 
      updateStep(id, data),
    onSuccess: (result, variables, context) => {
      // Always refetch recipes, step, and steps list (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["recipes"] })
      queryClient.refetchQueries({ queryKey: ["step", variables.id] })
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