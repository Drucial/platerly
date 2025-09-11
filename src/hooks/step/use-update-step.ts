"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { updateStep, type UpdateStepData } from "@/actions/step"
import { createFormCallbacks, type MutationResult } from "@/utils/mutations"

export type UpdateStepResult = MutationResult & {
  step?: { id: number; recipe_id: number; order: number; instruction?: string }
}

type UpdateStepOptions = UseMutationOptions<
  UpdateStepResult,
  Error,
  { id: number; data: UpdateStepData }
> & {
  formHandlers?: {
    closeSheet?: () => void
    resetForm?: () => void
  }
  notificationStyle?: "admin" | "user" | "none"
}

export function useUpdateStep(options?: UpdateStepOptions) {
  const queryClient = useQueryClient()
  
  const callbacks = options?.formHandlers 
    ? createFormCallbacks(
        "update", 
        "Step",
        options.formHandlers,
        (step: unknown) => {
          const s = step as { order: number; instruction?: string }
          return `Step ${s.order}${s.instruction ? ': ' + s.instruction.substring(0, 50) + '...' : ''}`
        },
        options.notificationStyle || "admin"
      )
    : undefined

  return useMutation({
    ...options,
    mutationFn: ({ id, data }: { id: number; data: UpdateStepData }) => updateStep(id, data),
    onSuccess: (result, variables, context) => {
      if (result.success && result.step) {
        // Invalidate recipe-scoped queries using the recipe_id from the result
        queryClient.invalidateQueries({ queryKey: ["steps-by-recipe", result.step.recipe_id] })
        queryClient.invalidateQueries({ queryKey: ["recipe", result.step.recipe_id] })
        queryClient.invalidateQueries({ queryKey: ["step", variables.id] })
        queryClient.invalidateQueries({ queryKey: ["recipes"] })
      }
      
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