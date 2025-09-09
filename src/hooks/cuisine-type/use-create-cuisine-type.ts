"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { createCuisineType, type CreateCuisineTypeData } from "@/actions/cuisine-type"

type CreateCuisineTypeMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof createCuisineType>>,
  Error,
  CreateCuisineTypeData
>

export function useCreateCuisineType(options?: CreateCuisineTypeMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (data: CreateCuisineTypeData) => createCuisineType(data),
    onSuccess: (result, variables, context) => {
      // Always refetch cuisine types list immediately (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["cuisine-types"] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}