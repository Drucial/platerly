"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { bulkCreateRecipeTags } from "@/actions/recipe-tag"

type BulkCreateRecipeTagsMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof bulkCreateRecipeTags>>,
  Error,
  { recipeId: number; tagIds: number[] }
>

export function useBulkCreateRecipeTags(options?: BulkCreateRecipeTagsMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ recipeId, tagIds }: { recipeId: number; tagIds: number[] }) => 
      bulkCreateRecipeTags(recipeId, tagIds),
    onSuccess: (result, variables, context) => {
      // Always refetch recipes and recipe tags (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["recipes"] })
      queryClient.refetchQueries({ queryKey: ["recipe", variables.recipeId] })
      queryClient.refetchQueries({ queryKey: ["recipe-tags-by-recipe", variables.recipeId] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}