"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { deleteIngredientType } from "@/actions/ingredient-type"

type DeleteIngredientTypeMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof deleteIngredientType>>,
  Error,
  number
>

export function useDeleteIngredientType(options?: DeleteIngredientTypeMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => deleteIngredientType(id),
    onSuccess: (result, variables, context) => {
      // Always refetch ingredient types list (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["ingredient-types"] })
      queryClient.refetchQueries({ queryKey: ["ingredient-types", variables] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}