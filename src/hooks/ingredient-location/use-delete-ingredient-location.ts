"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { deleteIngredientLocation } from "@/actions/ingredient-location"

type DeleteIngredientLocationMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof deleteIngredientLocation>>,
  Error,
  number
>

export function useDeleteIngredientLocation(options?: DeleteIngredientLocationMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => deleteIngredientLocation(id),
    onSuccess: (result, variables, context) => {
      // Always refetch ingredient locations list (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["ingredient-locations"] })
      queryClient.refetchQueries({ queryKey: ["ingredient-locations", variables] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}