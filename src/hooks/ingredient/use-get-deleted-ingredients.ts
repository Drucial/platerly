"use client"

import { useQuery } from "@tanstack/react-query"
import { getDeletedIngredients } from "@/actions/ingredient"

export function useGetDeletedIngredients(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["ingredients", "deleted"],
    queryFn: getDeletedIngredients,
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}