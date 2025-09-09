"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { restoreTag } from "@/actions/tag"

type RestoreTagMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof restoreTag>>,
  Error,
  number
>

export function useRestoreTag(options?: RestoreTagMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => restoreTag(id),
    onSuccess: (result, variables, context) => {
      // Always refetch tags list (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["tags"] })
      queryClient.refetchQueries({ queryKey: ["tag", variables] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}