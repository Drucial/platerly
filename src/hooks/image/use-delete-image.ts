"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { deleteImage } from "@/actions/image"

type DeleteImageMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof deleteImage>>,
  Error,
  number
>

export function useDeleteImage(options?: DeleteImageMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => deleteImage(id),
    onSuccess: (result, variables, context) => {
      // Always refetch images list (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["images"] })
      queryClient.refetchQueries({ queryKey: ["images", variables] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}