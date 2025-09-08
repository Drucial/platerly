"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { createImage, type CreateImageData } from "@/actions/image"

type CreateImageMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof createImage>>,
  Error,
  CreateImageData
>

export function useCreateImage(options?: CreateImageMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (data: CreateImageData) => createImage(data),
    onSuccess: (result, variables, context) => {
      // Always refetch images list immediately (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["images"] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}