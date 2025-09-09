"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { removeRecipeTagByIds } from "@/actions/recipe-tag"

type RemoveRecipeTagByIdsMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof removeRecipeTagByIds>>,
  Error,
  { recipeId: number; tagId: number }
>

export function useRemoveRecipeTagByIds(options?: RemoveRecipeTagByIdsMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ recipeId, tagId }: { recipeId: number; tagId: number }) => 
      removeRecipeTagByIds(recipeId, tagId),
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