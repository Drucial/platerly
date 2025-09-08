"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { restoreImage } from "@/actions/image"

type RestoreImageMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof restoreImage>>,
  Error,
  number
>

export function useRestoreImage(options?: RestoreImageMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => restoreImage(id),
    onSuccess: (result, variables, context) => {
      // Always refetch images lists (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["images"] })
      queryClient.refetchQueries({ queryKey: ["images", "deleted"] })
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