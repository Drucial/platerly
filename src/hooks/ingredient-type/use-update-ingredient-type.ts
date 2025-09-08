"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { updateIngredientType, type UpdateIngredientTypeData } from "@/actions/ingredient-type"

type UpdateIngredientTypeMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof updateIngredientType>>,
  Error,
  { id: number; data: UpdateIngredientTypeData }
>

export function useUpdateIngredientType(options?: UpdateIngredientTypeMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ id, data }: { id: number; data: UpdateIngredientTypeData }) => updateIngredientType(id, data),
    onSuccess: (result, variables, context) => {
      // Always refetch ingredient types list and specific type (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["ingredient-types"] })
      queryClient.refetchQueries({ queryKey: ["ingredient-types", variables.id] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}