"use client"

import { useQuery } from "@tanstack/react-query"
import { getRecipesByUserId } from "@/actions/recipe"

export function useGetRecipesByUser(userId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["recipes-by-user", userId],
    queryFn: () => getRecipesByUserId(userId),
    enabled: options?.enabled !== false && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}