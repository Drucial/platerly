"use client"

import { useQuery } from "@tanstack/react-query"
import { getRecipeTagById } from "@/actions/recipe-tag"

export function useGetRecipeTag(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["recipe-tag", id],
    queryFn: () => getRecipeTagById(id),
    enabled: options?.enabled !== false && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}