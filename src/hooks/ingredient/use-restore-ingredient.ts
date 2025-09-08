"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { restoreIngredient } from "@/actions/ingredient"

type RestoreIngredientMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof restoreIngredient>>,
  Error,
  number
>

export function useRestoreIngredient(options?: RestoreIngredientMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => restoreIngredient(id),
    onSuccess: (result, variables, context) => {
      // Always refetch ingredients lists (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["ingredients"] })
      queryClient.refetchQueries({ queryKey: ["ingredients", "deleted"] })
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