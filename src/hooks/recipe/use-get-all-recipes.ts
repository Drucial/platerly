"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllRecipes } from "@/actions/recipe"

export function useGetAllRecipes(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: getAllRecipes,
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}