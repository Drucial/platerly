"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { createTag, type CreateTagData } from "@/actions/tag"

type CreateTagMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof createTag>>,
  Error,
  CreateTagData
>

export function useCreateTag(options?: CreateTagMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (data: CreateTagData) => createTag(data),
    onSuccess: (result, variables, context) => {
      // Always refetch tags list immediately (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["tags"] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}