"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { createUser, type CreateUserData } from "@/actions/user"

type CreateUserMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof createUser>>,
  Error,
  CreateUserData
>

export function useCreateUser(options?: CreateUserMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (data: CreateUserData) => createUser(data),
    onSuccess: (result, variables, context) => {
      // Always refetch users list immediately (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["users"] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}