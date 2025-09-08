"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { createIngredient, type CreateIngredientData } from "@/actions/ingredient"

type CreateIngredientMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof createIngredient>>,
  Error,
  CreateIngredientData
>

export function useCreateIngredient(options?: CreateIngredientMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (data: CreateIngredientData) => createIngredient(data),
    onSuccess: (result, variables, context) => {
      // Always refetch ingredients list immediately (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["ingredients"] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}