import { toast } from "sonner"

export type MutationResult<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  [key: string]: unknown
}

// Legacy alias for backward compatibility
export type AdminMutationResult<T = unknown> = MutationResult<T>

export type MutationCallbacks<TResult = MutationResult, TError = Error> = {
  onSuccess?: (result: TResult) => void
  onError?: (error: TError) => void
  onSettled?: () => void
}

// Legacy alias for backward compatibility  
export type AdminMutationCallbacks<TResult = MutationResult, TError = Error> = MutationCallbacks<TResult, TError>

export type MutationConfig = {
  entityName: string
  entityDisplayName?: (entity: unknown) => string
  onCloseDialog?: () => void
  onResetForm?: () => void
  customSuccessAction?: string
  notificationStyle?: "admin" | "user" | "none"
}

export function createMutationCallbacks<TResult extends MutationResult, TError = Error>(
  action: "create" | "update" | "delete" | "restore",
  config: MutationConfig,
  customCallbacks?: MutationCallbacks<TResult, TError>
): MutationCallbacks<TResult, TError> {
  const { entityName, entityDisplayName, onCloseDialog, onResetForm, customSuccessAction, notificationStyle = "admin" } = config
  
  const getDisplayName = (entity: unknown): string => {
    if (entityDisplayName && entity) {
      return entityDisplayName(entity)
    }
    return entityName
  }

  const getActionVerb = (action: string): { past: string; present: string } => {
    switch (action) {
      case "create":
        return { past: "created", present: "creating" }
      case "update":
        return { past: "updated", present: "updating" }
      case "delete":
        return { past: "deleted", present: "deleting" }
      case "restore":
        return { past: "restored", present: "restoring" }
      default:
        return { past: action, present: action }
    }
  }

  const actionVerb = getActionVerb(action)

  return {
    onSuccess: (result) => {
      if (result.success) {
        const entity = result.data || result[entityName.toLowerCase()]
        const displayName = getDisplayName(entity)
        const successAction = customSuccessAction || actionVerb.past
        
        if (notificationStyle !== "none") {
          const showDescription = notificationStyle === "admin"
          toast.success(`${entityName} ${successAction} successfully`, 
            showDescription ? { description: `${displayName} has been ${successAction}.` } : undefined
          )
        }
        
        // Handle form reset for create operations
        if (action === "create" && onResetForm) {
          onResetForm()
        }
        
        // Close dialogs
        if (onCloseDialog) {
          onCloseDialog()
        }
      } else {
        if (notificationStyle !== "none") {
          const showDescription = notificationStyle === "admin"
          toast.error(`Failed to ${actionVerb.past.replace("d", "")} ${entityName.toLowerCase()}`, 
            showDescription ? { description: result.error || "An unexpected error occurred." } : undefined
          )
        }
      }
      
      // Call custom success callback
      customCallbacks?.onSuccess?.(result)
    },
    
    onError: (error) => {
      const errorMessage = (error as Error).message || "An unexpected error occurred."
      
      if (notificationStyle !== "none") {
        const showDescription = notificationStyle === "admin"
        toast.error(`Error ${actionVerb.present} ${entityName.toLowerCase()}`, 
          showDescription ? { description: errorMessage } : undefined
        )
      }
      
      // Close dialogs on error as well
      if (onCloseDialog) {
        onCloseDialog()
      }
      
      // Call custom error callback
      customCallbacks?.onError?.(error)
    },
    
    onSettled: () => {
      // Call custom settled callback
      customCallbacks?.onSettled?.()
    }
  }
}

export type DialogHandlers = {
  closeDeleteDialog: () => void
  closeRestoreDialog: () => void
  closeSheet?: () => void
  resetDeleteId: () => void
  resetRestoreId: () => void
}

// Legacy alias for backward compatibility
export type AdminDialogHandlers = DialogHandlers

export function createDialogCallbacks<TResult extends MutationResult, TError = Error>(
  action: "delete" | "restore",
  entityName: string,
  handlers: Pick<DialogHandlers, "closeDeleteDialog" | "closeRestoreDialog" | "resetDeleteId" | "resetRestoreId">,
  entityDisplayName?: (entity: unknown) => string,
  notificationStyle: "admin" | "user" | "none" = "admin"
): MutationCallbacks<TResult, TError> {
  const config: MutationConfig = {
    entityName,
    entityDisplayName,
    notificationStyle,
    onCloseDialog: action === "delete" 
      ? () => {
          handlers.closeDeleteDialog()
          handlers.resetDeleteId()
        }
      : () => {
          handlers.closeRestoreDialog()
          handlers.resetRestoreId()
        }
  }
  
  return createMutationCallbacks(action, config)
}

// Legacy function for backward compatibility
export function createAdminDialogCallbacks(
  action: "delete" | "restore",
  entityName: string,
  handlers: Pick<AdminDialogHandlers, "closeDeleteDialog" | "closeRestoreDialog" | "resetDeleteId" | "resetRestoreId">,
  entityDisplayName?: (entity: unknown) => string
) {
  return createDialogCallbacks(action, entityName, handlers, entityDisplayName, "admin")
}

export function createFormCallbacks<TResult extends MutationResult, TError = Error>(
  action: "create" | "update", 
  entityName: string,
  handlers: { 
    closeSheet: () => void
    resetForm?: () => void 
  },
  entityDisplayName?: (entity: unknown) => string,
  notificationStyle: "admin" | "user" | "none" = "admin"
): MutationCallbacks<TResult, TError> {
  const config: MutationConfig = {
    entityName,
    entityDisplayName,
    notificationStyle,
    onCloseDialog: handlers.closeSheet,
    onResetForm: handlers.resetForm
  }
  
  return createMutationCallbacks(action, config)
}

// Legacy function for backward compatibility
export function createAdminFormCallbacks(
  action: "create" | "update", 
  entityName: string,
  handlers: { 
    closeSheet: () => void
    resetForm?: () => void 
  },
  entityDisplayName?: (entity: unknown) => string
) {
  return createFormCallbacks(action, entityName, handlers, entityDisplayName, "admin")
}