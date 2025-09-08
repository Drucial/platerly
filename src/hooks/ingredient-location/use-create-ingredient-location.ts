"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { createIngredientLocation, type CreateIngredientLocationData } from "@/actions/ingredient-location"

type CreateIngredientLocationMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof createIngredientLocation>>,
  Error,
  CreateIngredientLocationData
>

export function useCreateIngredientLocation(options?: CreateIngredientLocationMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (data: CreateIngredientLocationData) => createIngredientLocation(data),
    onSuccess: (result, variables, context) => {
      // Always refetch ingredient locations list immediately (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["ingredient-locations"] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}