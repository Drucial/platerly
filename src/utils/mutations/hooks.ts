import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { createDialogCallbacks, createFormCallbacks, type DialogHandlers, type MutationResult, type AdminMutationResult, createAdminDialogCallbacks, createAdminFormCallbacks } from "./mutations"

export type EntityConfig = {
  entityName: string
  queryKey: string
  displayNameFn?: (entity: unknown) => string
}

export type DeleteHookOptions<TResult extends MutationResult> = UseMutationOptions<
  TResult,
  Error,
  number
> & {
  dialogHandlers?: Pick<DialogHandlers, "closeDeleteDialog" | "resetDeleteId">
  notificationStyle?: "admin" | "user" | "none"
}

// Legacy type for backward compatibility
export type AdminDeleteHookOptions<TResult extends AdminMutationResult> = UseMutationOptions<
  TResult,
  Error,
  number
> & {
  adminHandlers?: Pick<DialogHandlers, "closeDeleteDialog" | "resetDeleteId">
}

export type RestoreHookOptions<TResult extends MutationResult> = UseMutationOptions<
  TResult,
  Error,
  number
> & {
  dialogHandlers?: Pick<DialogHandlers, "closeRestoreDialog" | "resetRestoreId">
  notificationStyle?: "admin" | "user" | "none"
}

// Legacy type for backward compatibility
export type AdminRestoreHookOptions<TResult extends AdminMutationResult> = UseMutationOptions<
  TResult,
  Error,
  number
> & {
  adminHandlers?: Pick<DialogHandlers, "closeRestoreDialog" | "resetRestoreId">
}

export type FormHookOptions<TResult extends MutationResult, TVariables = unknown> = UseMutationOptions<
  TResult,
  Error,
  TVariables
> & {
  formHandlers?: {
    closeSheet: () => void
    resetForm?: () => void
  }
  notificationStyle?: "admin" | "user" | "none"
}

// Legacy type for backward compatibility
export type AdminFormHookOptions<TResult extends AdminMutationResult, TVariables = unknown> = UseMutationOptions<
  TResult,
  Error,
  TVariables
> & {
  adminHandlers?: {
    closeSheet: () => void
    resetForm?: () => void
  }
}

export function createDeleteHook<TResult extends MutationResult>(
  config: EntityConfig,
  deleteFn: (id: number) => Promise<TResult>
) {
  return function useDelete(options?: DeleteHookOptions<TResult>) {
    const queryClient = useQueryClient()
    
    const callbacks = options?.dialogHandlers 
      ? createDialogCallbacks(
          "delete", 
          config.entityName, 
          {
            closeDeleteDialog: options.dialogHandlers.closeDeleteDialog,
            closeRestoreDialog: () => {},
            resetDeleteId: options.dialogHandlers.resetDeleteId,
            resetRestoreId: () => {}
          },
          config.displayNameFn,
          options.notificationStyle || "admin"
        )
      : undefined

    return useMutation({
      ...options,
      mutationFn: deleteFn,
      onSuccess: (result, id, context) => {
        // Always invalidate queries for consistency
        queryClient.invalidateQueries({ queryKey: [config.queryKey] })
        // Convert plural queryKey to singular for individual item queries
        const singularKey = config.queryKey.endsWith('s') ? config.queryKey.slice(0, -1) : config.queryKey
        queryClient.invalidateQueries({ queryKey: [singularKey, id] })
        // Invalidate deleted items query (standard pattern)
        queryClient.invalidateQueries({ queryKey: [config.queryKey, "deleted"] })
        
        // Call callbacks first
        callbacks?.onSuccess?.(result)
        
        // Call custom onSuccess if provided
        options?.onSuccess?.(result, id, context)
      },
      onError: (error, id, context) => {
        // Call callbacks first
        callbacks?.onError?.(error)
        
        // Call custom onError if provided
        options?.onError?.(error, id, context)
      },
      onSettled: (result, error, id, context) => {
        // Call callbacks
        callbacks?.onSettled?.()
        
        // Call custom onSettled if provided
        options?.onSettled?.(result, error, id, context)
      }
    })
  }
}

// Legacy wrapper for backward compatibility
export function createAdminDeleteHook<TResult extends AdminMutationResult>(
  config: EntityConfig,
  deleteFn: (id: number) => Promise<TResult>
) {
  const baseHook = createDeleteHook(config, deleteFn)
  return function useDelete(options?: AdminDeleteHookOptions<TResult>) {
    return baseHook({
      ...options,
      dialogHandlers: options?.adminHandlers ? {
        closeDeleteDialog: options.adminHandlers.closeDeleteDialog,
        resetDeleteId: options.adminHandlers.resetDeleteId
      } : undefined,
      notificationStyle: "admin"
    })
  }
}

export function createRestoreHook<TResult extends MutationResult>(
  config: EntityConfig,
  restoreFn: (id: number) => Promise<TResult>
) {
  return function useRestore(options?: RestoreHookOptions<TResult>) {
    const queryClient = useQueryClient()
    
    const callbacks = options?.dialogHandlers 
      ? createDialogCallbacks(
          "restore", 
          config.entityName, 
          {
            closeDeleteDialog: () => {},
            closeRestoreDialog: options.dialogHandlers.closeRestoreDialog,
            resetDeleteId: () => {},
            resetRestoreId: options.dialogHandlers.resetRestoreId
          },
          config.displayNameFn,
          options.notificationStyle || "admin"
        )
      : undefined

    return useMutation({
      ...options,
      mutationFn: restoreFn,
      onSuccess: (result, id, context) => {
        // Always invalidate queries for consistency
        queryClient.invalidateQueries({ queryKey: [config.queryKey] })
        // Convert plural queryKey to singular for individual item queries
        const singularKey = config.queryKey.endsWith('s') ? config.queryKey.slice(0, -1) : config.queryKey
        queryClient.invalidateQueries({ queryKey: [singularKey, id] })
        // Invalidate deleted items query (standard pattern)
        queryClient.invalidateQueries({ queryKey: [config.queryKey, "deleted"] })
        
        // Call callbacks first
        callbacks?.onSuccess?.(result)
        
        // Call custom onSuccess if provided
        options?.onSuccess?.(result, id, context)
      },
      onError: (error, id, context) => {
        // Call callbacks first
        callbacks?.onError?.(error)
        
        // Call custom onError if provided
        options?.onError?.(error, id, context)
      },
      onSettled: (result, error, id, context) => {
        // Call callbacks
        callbacks?.onSettled?.()
        
        // Call custom onSettled if provided
        options?.onSettled?.(result, error, id, context)
      }
    })
  }
}

// Legacy wrapper for backward compatibility
export function createAdminRestoreHook<TResult extends AdminMutationResult>(
  config: EntityConfig,
  restoreFn: (id: number) => Promise<TResult>
) {
  const baseHook = createRestoreHook(config, restoreFn)
  return function useRestore(options?: AdminRestoreHookOptions<TResult>) {
    return baseHook({
      ...options,
      dialogHandlers: options?.adminHandlers ? {
        closeRestoreDialog: options.adminHandlers.closeRestoreDialog,
        resetRestoreId: options.adminHandlers.resetRestoreId
      } : undefined,
      notificationStyle: "admin"
    })
  }
}

export function createCreateHook<TResult extends MutationResult, TVariables = unknown>(
  config: EntityConfig,
  createFn: (data: TVariables) => Promise<TResult>
) {
  return function useCreate(options?: FormHookOptions<TResult, TVariables>) {
    const queryClient = useQueryClient()
    
    const callbacks = options?.formHandlers 
      ? createFormCallbacks(
          "create", 
          config.entityName, 
          options.formHandlers,
          config.displayNameFn,
          options.notificationStyle || "admin"
        )
      : undefined

    return useMutation({
      ...options,
      mutationFn: createFn,
      onSuccess: (result, variables, context) => {
        // Always refetch list
        queryClient.refetchQueries({ queryKey: [config.queryKey] })
        
        // Call callbacks first
        callbacks?.onSuccess?.(result)
        
        // Call custom onSuccess if provided
        options?.onSuccess?.(result, variables, context)
      },
      onError: (error, variables, context) => {
        // Call callbacks first
        callbacks?.onError?.(error)
        
        // Call custom onError if provided
        options?.onError?.(error, variables, context)
      },
      onSettled: (result, error, variables, context) => {
        // Call callbacks
        callbacks?.onSettled?.()
        
        // Call custom onSettled if provided
        options?.onSettled?.(result, error, variables, context)
      }
    })
  }
}

// Legacy wrapper for backward compatibility
export function createAdminCreateHook<TResult extends AdminMutationResult, TVariables = unknown>(
  config: EntityConfig,
  createFn: (data: TVariables) => Promise<TResult>
) {
  const baseHook = createCreateHook(config, createFn)
  return function useCreate(options?: AdminFormHookOptions<TResult, TVariables>) {
    return baseHook({
      ...options,
      formHandlers: options?.adminHandlers,
      notificationStyle: "admin"
    })
  }
}

export function createUpdateHook<TResult extends MutationResult, TVariables = unknown>(
  config: EntityConfig,
  updateFn: (variables: TVariables) => Promise<TResult>
) {
  return function useUpdate(options?: FormHookOptions<TResult, TVariables>) {
    const queryClient = useQueryClient()
    
    const callbacks = options?.formHandlers 
      ? createFormCallbacks(
          "update", 
          config.entityName, 
          options.formHandlers,
          config.displayNameFn,
          options.notificationStyle || "admin"
        )
      : undefined

    return useMutation({
      ...options,
      mutationFn: updateFn,
      onSuccess: (result, variables, context) => {
        // Always invalidate queries
        queryClient.invalidateQueries({ queryKey: [config.queryKey] })
        
        // Call callbacks first
        callbacks?.onSuccess?.(result)
        
        // Call custom onSuccess if provided
        options?.onSuccess?.(result, variables, context)
      },
      onError: (error, variables, context) => {
        // Call callbacks first
        callbacks?.onError?.(error)
        
        // Call custom onError if provided
        options?.onError?.(error, variables, context)
      },
      onSettled: (result, error, variables, context) => {
        // Call callbacks
        callbacks?.onSettled?.()
        
        // Call custom onSettled if provided
        options?.onSettled?.(result, error, variables, context)
      }
    })
  }
}

// Legacy wrapper for backward compatibility
export function createAdminUpdateHook<TResult extends AdminMutationResult, TVariables = unknown>(
  config: EntityConfig,
  updateFn: (variables: TVariables) => Promise<TResult>
) {
  const baseHook = createUpdateHook(config, updateFn)
  return function useUpdate(options?: AdminFormHookOptions<TResult, TVariables>) {
    return baseHook({
      ...options,
      formHandlers: options?.adminHandlers,
      notificationStyle: "admin"
    })
  }
}