"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { restoreIngredientType } from "@/actions/ingredient-type"

type RestoreIngredientTypeMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof restoreIngredientType>>,
  Error,
  number
>

export function useRestoreIngredientType(options?: RestoreIngredientTypeMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => restoreIngredientType(id),
    onSuccess: (result, variables, context) => {
      // Always refetch ingredient types lists (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["ingredient-types"] })
      queryClient.refetchQueries({ queryKey: ["ingredient-types", "deleted"] })
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