"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { updateUser, type UpdateUserData } from "@/actions/user"

type UpdateUserOptions = UseMutationOptions<
  Awaited<ReturnType<typeof updateUser>>,
  Error,
  { id: number; data: UpdateUserData }
>

export function useUpdateUser(options?: UpdateUserOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ id, data }: { id: number; data: UpdateUserData }) => 
      updateUser(id, data),
    onSuccess: (result, variables, context) => {
      // Core hook functionality (cache management) always runs first
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] })
      
      // Then call component-specific callback
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context)
    },
  })
}