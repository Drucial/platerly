"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { updateUser, type UpdateUserData } from "@/actions/user"
import { createAdminFormCallbacks, type AdminMutationResult } from "@/utils/mutations/mutations"

type UpdateUserResult = AdminMutationResult & {
  user?: { first_name: string; last_name: string }
}

type UpdateUserOptions = UseMutationOptions<
  UpdateUserResult,
  Error,
  { id: number; data: UpdateUserData }
> & {
  adminHandlers?: {
    closeSheet: () => void
    resetForm?: () => void
  }
}

export function useUpdateUser(options?: UpdateUserOptions) {
  const queryClient = useQueryClient()
  
  const adminCallbacks = options?.adminHandlers 
    ? createAdminFormCallbacks(
        "update", 
        "User", 
        options.adminHandlers,
        (user: unknown) => {
          const u = user as { first_name: string; last_name: string }
          return `${u.first_name} ${u.last_name}`
        }
      )
    : undefined

  return useMutation({
    ...options,
    mutationFn: ({ id, data }: { id: number; data: UpdateUserData }) => 
      updateUser(id, data),
    onSuccess: (result, variables, context) => {
      // Core hook functionality (cache management) always runs first
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] })
      
      // Call admin callbacks first (standardized behavior)
      adminCallbacks?.onSuccess?.(result)
      
      // Then call component-specific callback
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call admin callbacks first (standardized behavior)
      adminCallbacks?.onError?.(error)
      
      options?.onError?.(error, variables, context)
    },
    onSettled: (result, error, variables, context) => {
      // Call admin callbacks
      adminCallbacks?.onSettled?.()
      
      // Call custom onSettled if provided
      options?.onSettled?.(result, error, variables, context)
    }
  })
}