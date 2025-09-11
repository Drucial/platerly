"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { bulkUpdateSteps } from "@/actions/step"
import { createAdminMutationCallbacks, type AdminMutationResult } from "@/utils/mutations/mutations"

type BulkUpdateStepsResult = AdminMutationResult & {
  steps?: Array<{ id: number; order: number; instruction: string }>
}

type BulkUpdateStepsMutationOptions = UseMutationOptions<
  BulkUpdateStepsResult,
  Error,
  { recipeId: number; steps: Array<{ name: string; description: string; order: number }> }
> & {
  adminHandlers?: {
    closeSheet?: () => void
    resetForm?: () => void
  }
}

export function useBulkUpdateSteps(options?: BulkUpdateStepsMutationOptions) {
  const queryClient = useQueryClient()
  
  const adminCallbacks = options?.adminHandlers 
    ? createAdminMutationCallbacks(
        "update", 
        {
          entityName: "Steps",
          onCloseDialog: options.adminHandlers.closeSheet,
          onResetForm: options.adminHandlers.resetForm,
          customSuccessAction: "updated"
        },
        {
          onSuccess: options?.onSuccess,
          onError: options?.onError
        }
      )
    : undefined

  return useMutation({
    ...options,
    mutationFn: ({ recipeId, steps }: { recipeId: number; steps: Array<{ name: string; description: string; order: number }> }) => 
      bulkUpdateSteps(recipeId, steps),
    onSuccess: (result, variables, context) => {
      // Always refetch recipes and steps (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["recipes"] })
      queryClient.refetchQueries({ queryKey: ["recipe", variables.recipeId] })
      queryClient.refetchQueries({ queryKey: ["steps-by-recipe", variables.recipeId] })
      
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