"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { createRecipeTag, type CreateRecipeTagData } from "@/actions/recipe-tag"

type CreateRecipeTagMutationOptions = UseMutationOptions<
  Awaited<ReturnType<typeof createRecipeTag>>,
  Error,
  CreateRecipeTagData
>

export function useCreateRecipeTag(options?: CreateRecipeTagMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (data: CreateRecipeTagData) => createRecipeTag(data),
    onSuccess: (result, variables, context) => {
      // Always refetch recipes and recipe tags (core hook functionality)
      queryClient.refetchQueries({ queryKey: ["recipes"] })
      queryClient.refetchQueries({ queryKey: ["recipe", variables.recipe_id] })
      queryClient.refetchQueries({ queryKey: ["recipe-tags-by-recipe", variables.recipe_id] })
      
      // Call custom onSuccess if provided (component-specific logic)
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      // Call custom onError if provided
      options?.onError?.(error, variables, context)
    },
  })
}