"use client";

import { restoreUser } from "@/actions/user";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { createAdminDialogCallbacks, type AdminDialogHandlers, type AdminMutationResult } from "@/utils/mutations/mutations";

type RestoreUserResult = AdminMutationResult & {
  user?: { first_name: string; last_name: string }
}

type RestoreUserMutationOptions = UseMutationOptions<
  RestoreUserResult,
  Error,
  number
> & {
  adminHandlers?: Pick<AdminDialogHandlers, "closeRestoreDialog" | "resetRestoreId">
};

export function useRestoreUser(options?: RestoreUserMutationOptions) {
  const queryClient = useQueryClient();
  
  const adminCallbacks = options?.adminHandlers 
    ? createAdminDialogCallbacks(
        "restore", 
        "User", 
        {
          closeDeleteDialog: () => {},
          closeRestoreDialog: options.adminHandlers.closeRestoreDialog,
          resetDeleteId: () => {},
          resetRestoreId: options.adminHandlers.resetRestoreId
        },
        (user: unknown) => {
          const u = user as { first_name: string; last_name: string }
          return `${u.first_name} ${u.last_name}`
        }
      )
    : undefined;

  return useMutation({
    ...options,
    mutationFn: (id: number) => restoreUser(id),
    onSuccess: (result, id, context) => {
      // Always invalidate queries for consistency (core hook functionality)
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["users", "deleted"] });

      // Call admin callbacks first (standardized behavior)
      adminCallbacks?.onSuccess?.(result);

      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, id, context);
    },
    onError: (error, id, context) => {
      // Call admin callbacks first (standardized behavior)
      adminCallbacks?.onError?.(error);

      // Call custom onError if provided
      options?.onError?.(error, id, context);
    },
    onMutate: (id) => {
      // Call custom onMutate if provided
      return options?.onMutate?.(id);
    },
    onSettled: (result, error, id, context) => {
      // Call admin callbacks
      adminCallbacks?.onSettled?.();

      // Call custom onSettled if provided
      options?.onSettled?.(result, error, id, context);
    }
  });
}
