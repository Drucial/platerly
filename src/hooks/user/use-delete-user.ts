"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { deleteUser } from "@/actions/user"

type DeleteUserMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof deleteUser>>,
  Error,
  number
>

export function useDeleteUser(options?: DeleteUserMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: (result, id, context) => {
      // Always invalidate queries for consistency (core hook functionality)
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["user", id] })
      queryClient.invalidateQueries({ queryKey: ["users", "deleted"] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, id, context)
    },
    onError: (error, id, context) => {
      // Call custom onError if provided
      options?.onError?.(error, id, context)
    },
    onMutate: (id) => {
      // Call custom onMutate if provided
      return options?.onMutate?.(id)
    },
  })
}