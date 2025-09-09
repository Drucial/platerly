"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { updateTag, type UpdateTagData } from "@/actions/tag"

type UpdateTagMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof updateTag>>,
  Error,
  { id: number; data: UpdateTagData }
>

export function useUpdateTag(options?: UpdateTagMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ id, data }: { id: number; data: UpdateTagData }) => 
      updateTag(id, data),
    onSuccess: (result, variables, context) => {
      // Always refetch tags list and specific tag (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["tags"] })
      queryClient.refetchQueries({ queryKey: ["tag", variables.id] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}