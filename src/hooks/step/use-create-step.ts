"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { createStep, type CreateStepData } from "@/actions/step"

type CreateStepMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof createStep>>,
  Error,
  CreateStepData
>

export function useCreateStep(options?: CreateStepMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (data: CreateStepData) => createStep(data),
    onSuccess: (result, variables, context) => {
      // Always refetch recipes and steps (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["recipes"] })
      queryClient.refetchQueries({ queryKey: ["recipe", variables.recipe_id] })
      queryClient.refetchQueries({ queryKey: ["steps-by-recipe", variables.recipe_id] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}