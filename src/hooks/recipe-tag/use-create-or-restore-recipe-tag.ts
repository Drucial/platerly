"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { createOrRestoreRecipeTag, type CreateRecipeTagData } from "@/actions/recipe-tag"

type CreateOrRestoreRecipeTagMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof createOrRestoreRecipeTag>>,
  Error,
  CreateRecipeTagData
>

export function useCreateOrRestoreRecipeTag(options?: CreateOrRestoreRecipeTagMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (data: CreateRecipeTagData) => createOrRestoreRecipeTag(data),
    onSuccess: (result, variables, context) => {
      // Always refetch recipe tags immediately (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["recipe-tags"] })
      queryClient.refetchQueries({ queryKey: ["recipe", variables.recipe_id] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}