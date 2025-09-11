"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { reorderSteps } from "@/actions/step"
import { createAdminMutationCallbacks, type AdminMutationResult } from "@/utils/mutations/mutations"

type ReorderStepsResult = AdminMutationResult & {
  steps?: Array<{ id: number; order: number }>
}

type ReorderStepsMutationOptions = UseMutationOptions<
  ReorderStepsResult,
  Error,
  { recipeId: number; stepOrders: { id: number; order: number }[] }
> & {
  adminHandlers?: {
    closeSheet?: () => void
    resetForm?: () => void
  }
}

export function useReorderSteps(options?: ReorderStepsMutationOptions) {
  const queryClient = useQueryClient()
  
  const adminCallbacks = options?.adminHandlers 
    ? createAdminMutationCallbacks(
        "update", 
        {
          entityName: "Steps",
          onCloseDialog: options.adminHandlers.closeSheet,
          onResetForm: options.adminHandlers.resetForm,
          customSuccessAction: "reordered"
        },
        {
          onSuccess: options?.onSuccess,
          onError: options?.onError
        }
      )
    : undefined

  return useMutation({
    ...options,
    mutationFn: ({ recipeId, stepOrders }: { recipeId: number; stepOrders: { id: number; order: number }[] }) => 
      reorderSteps(recipeId, stepOrders),
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