"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { updateIngredient, type UpdateIngredientData } from "@/actions/ingredient"

type UpdateIngredientMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof updateIngredient>>,
  Error,
  { id: number; data: UpdateIngredientData }
>

export function useUpdateIngredient(options?: UpdateIngredientMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ id, data }: { id: number; data: UpdateIngredientData }) => updateIngredient(id, data),
    onSuccess: (result, variables, context) => {
      // Always refetch ingredients list and specific ingredient (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["ingredients"] })
      queryClient.refetchQueries({ queryKey: ["ingredients", variables.id] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}