"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { updateIngredientLocation, type UpdateIngredientLocationData } from "@/actions/ingredient-location"

type UpdateIngredientLocationMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof updateIngredientLocation>>,
  Error,
  { id: number; data: UpdateIngredientLocationData }
>

export function useUpdateIngredientLocation(options?: UpdateIngredientLocationMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ id, data }: { id: number; data: UpdateIngredientLocationData }) => updateIngredientLocation(id, data),
    onSuccess: (result, variables, context) => {
      // Always refetch ingredient locations list and specific location (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["ingredient-locations"] })
      queryClient.refetchQueries({ queryKey: ["ingredient-locations", variables.id] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}