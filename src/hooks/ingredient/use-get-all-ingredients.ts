"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllIngredients } from "@/actions/ingredient"

export function useGetAllIngredients(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["ingredients"],
    queryFn: getAllIngredients,
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}