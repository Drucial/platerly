"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { restoreIngredientLocation } from "@/actions/ingredient-location"

type RestoreIngredientLocationMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof restoreIngredientLocation>>,
  Error,
  number
>

export function useRestoreIngredientLocation(options?: RestoreIngredientLocationMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => restoreIngredientLocation(id),
    onSuccess: (result, variables, context) => {
      // Always refetch ingredient locations lists (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["ingredient-locations"] })
      queryClient.refetchQueries({ queryKey: ["ingredient-locations", "deleted"] })
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