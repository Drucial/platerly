"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { createStep, type CreateStepData } from "@/actions/step"
import { createFormCallbacks, type MutationResult } from "@/utils/mutations"

export type CreateStepResult = MutationResult & {
  step?: unknown
}

type CreateStepOptions = UseMutationOptions<
  CreateStepResult,
  Error,
  CreateStepData
> & {
  formHandlers?: {
    closeSheet?: () => void
    resetForm?: () => void
  }
  notificationStyle?: "admin" | "user" | "none"
}

export function useCreateStep(options?: CreateStepOptions) {
  const queryClient = useQueryClient()
  
  const callbacks = options?.formHandlers 
    ? createFormCallbacks(
        "create", 
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
    mutationFn: createStep,
    onSuccess: (result, variables, context) => {
      // Invalidate recipe-scoped queries
      queryClient.invalidateQueries({ queryKey: ["steps-by-recipe", variables.recipe_id] })
      queryClient.invalidateQueries({ queryKey: ["recipe", variables.recipe_id] })
      queryClient.invalidateQueries({ queryKey: ["recipes"] })
      
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