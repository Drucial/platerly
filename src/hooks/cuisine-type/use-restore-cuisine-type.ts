"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { restoreCuisineType } from "@/actions/cuisine-type"

type RestoreCuisineTypeMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof restoreCuisineType>>,
  Error,
  number
>

export function useRestoreCuisineType(options?: RestoreCuisineTypeMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => restoreCuisineType(id),
    onSuccess: (result, variables, context) => {
      // Always refetch cuisine types list (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["cuisine-types"] })
      queryClient.refetchQueries({ queryKey: ["cuisine-type", variables] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}