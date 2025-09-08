"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { createIngredientType, type CreateIngredientTypeData } from "@/actions/ingredient-type"

type CreateIngredientTypeMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof createIngredientType>>,
  Error,
  CreateIngredientTypeData
>

export function useCreateIngredientType(options?: CreateIngredientTypeMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (data: CreateIngredientTypeData) => createIngredientType(data),
    onSuccess: (result, variables, context) => {
      // Always refetch ingredient types list immediately (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["ingredient-types"] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}