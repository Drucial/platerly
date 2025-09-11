"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { createUser, type CreateUserData } from "@/actions/user"
import { createAdminFormCallbacks, type AdminMutationResult } from "@/utils/mutations/mutations"

type CreateUserResult = AdminMutationResult & {
  user?: { first_name: string; last_name: string }
  existingUser?: { first_name: string; last_name: string }
}

type CreateUserMutationOptions = UseMutationOptions<
  CreateUserResult,
  Error,
  CreateUserData
> & {
  adminHandlers?: {
    closeSheet: () => void
    resetForm?: () => void
  }
}

export function useCreateUser(options?: CreateUserMutationOptions) {
  const queryClient = useQueryClient()
  
  const adminCallbacks = options?.adminHandlers 
    ? createAdminFormCallbacks(
        "create", 
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
    mutationFn: (data: CreateUserData) => createUser(data),
    onSuccess: (result, variables, context) => {
      // Always refetch users list immediately (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["users"] })
      
      // Call admin callbacks first (standardized behavior)
      adminCallbacks?.onSuccess?.(result)
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call admin callbacks first (standardized behavior)
      adminCallbacks?.onError?.(error)
      
      // Call custom onError if provided
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