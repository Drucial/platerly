"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { updateCuisineType, type UpdateCuisineTypeData } from "@/actions/cuisine-type"

type UpdateCuisineTypeMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof updateCuisineType>>,
  Error,
  { id: number; data: UpdateCuisineTypeData }
>

export function useUpdateCuisineType(options?: UpdateCuisineTypeMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ id, data }: { id: number; data: UpdateCuisineTypeData }) => 
      updateCuisineType(id, data),
    onSuccess: (result, variables, context) => {
      // Always refetch cuisine types list and specific cuisine type (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["cuisine-types"] })
      queryClient.refetchQueries({ queryKey: ["cuisine-type", variables.id] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}