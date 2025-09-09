"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { reorderSteps } from "@/actions/step"

type ReorderStepsMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof reorderSteps>>,
  Error,
  { recipeId: number; stepOrders: { id: number; order: number }[] }
>

export function useReorderSteps(options?: ReorderStepsMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ recipeId, stepOrders }: { recipeId: number; stepOrders: { id: number; order: number }[] }) => 
      reorderSteps(recipeId, stepOrders),
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