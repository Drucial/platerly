"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { updateImage, type UpdateImageData } from "@/actions/image"

type UpdateImageMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof updateImage>>,
  Error,
  { id: number; data: UpdateImageData }
>

export function useUpdateImage(options?: UpdateImageMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ id, data }: { id: number; data: UpdateImageData }) => updateImage(id, data),
    onSuccess: (result, variables, context) => {
      // Always refetch images list and specific image (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["images"] })
      queryClient.refetchQueries({ queryKey: ["images", variables.id] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}