"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { deleteCuisineType } from "@/actions/cuisine-type"

type DeleteCuisineTypeMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof deleteCuisineType>>,
  Error,
  number
>

export function useDeleteCuisineType(options?: DeleteCuisineTypeMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => deleteCuisineType(id),
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