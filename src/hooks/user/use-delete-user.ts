"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { deleteUser } from "@/actions/user"
import { createAdminDialogCallbacks, type AdminDialogHandlers, type AdminMutationResult } from "@/utils/mutations/mutations"

type DeleteUserResult = AdminMutationResult & {
  user?: { first_name: string; last_name: string }
}

type DeleteUserMutationOptions = UseMutationOptions<
  DeleteUserResult,
  Error,
  number
> & {
  adminHandlers?: Pick<AdminDialogHandlers, "closeDeleteDialog" | "resetDeleteId">
}

export function useDeleteUser(options?: DeleteUserMutationOptions) {
  const queryClient = useQueryClient()
  
  const adminCallbacks = options?.adminHandlers 
    ? createAdminDialogCallbacks(
        "delete", 
        "User", 
        {
          closeDeleteDialog: options.adminHandlers.closeDeleteDialog,
          closeRestoreDialog: () => {},
          resetDeleteId: options.adminHandlers.resetDeleteId,
          resetRestoreId: () => {}
        },
        (user: unknown) => {
          const u = user as { first_name: string; last_name: string }
          return `${u.first_name} ${u.last_name}`
        }
      )
    : undefined

  return useMutation({
    ...options,
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: (result, id, context) => {
      // Always invalidate queries for consistency (core hook functionality)
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["user", id] })
      queryClient.invalidateQueries({ queryKey: ["users", "deleted"] })
      
      // Call admin callbacks first (standardized behavior)
      adminCallbacks?.onSuccess?.(result)
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, id, context)
    },
    onError: (error, id, context) => {
      // Call admin callbacks first (standardized behavior)
      adminCallbacks?.onError?.(error)
      
      // Call custom onError if provided
      options?.onError?.(error, id, context)
    },
    onMutate: (id) => {
      // Call custom onMutate if provided
      return options?.onMutate?.(id)
    },
    onSettled: (result, error, id, context) => {
      // Call admin callbacks
      adminCallbacks?.onSettled?.()
      
      // Call custom onSettled if provided
      options?.onSettled?.(result, error, id, context)
    }
  })
}