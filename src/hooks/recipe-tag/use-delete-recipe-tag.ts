"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { deleteRecipeTag } from "@/actions/recipe-tag"

type DeleteRecipeTagMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof deleteRecipeTag>>,
  Error,
  number
>

export function useDeleteRecipeTag(options?: DeleteRecipeTagMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: number) => deleteRecipeTag(id),
    onSuccess: (result, variables, context) => {
      // Always refetch recipes and recipe tags (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["recipes"] })
      queryClient.refetchQueries({ queryKey: ["recipe-tag", variables] })
      if (result.success && result.recipeTag) {
        queryClient.refetchQueries({ queryKey: ["recipe", result.recipeTag.recipe_id] })
        queryClient.refetchQueries({ queryKey: ["recipe-tags-by-recipe", result.recipeTag.recipe_id] })
      }
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}