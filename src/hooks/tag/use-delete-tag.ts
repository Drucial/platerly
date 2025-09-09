"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { deleteTag } from "@/actions/tag"

type DeleteTagMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof deleteTag>>,
  Error,
  number
>

export function useDeleteTag(options?: DeleteTagMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => deleteTag(id),
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