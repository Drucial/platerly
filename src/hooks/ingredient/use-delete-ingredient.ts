"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { deleteIngredient } from "@/actions/ingredient"

type DeleteIngredientMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof deleteIngredient>>,
  Error,
  number
>

export function useDeleteIngredient(options?: DeleteIngredientMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => deleteIngredient(id),
    onSuccess: (result, variables, context) => {
      // Always refetch ingredients list (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["ingredients"] })
      queryClient.refetchQueries({ queryKey: ["ingredients", variables] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}