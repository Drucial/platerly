"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllCuisineTypes } from "@/actions/cuisine-type"

export function useGetAllCuisineTypes(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["cuisine-types"],
    queryFn: getAllCuisineTypes,
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes (cuisine types change less frequently)
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}