"use client"

import { useQuery } from "@tanstack/react-query"
import { getDeletedCuisineTypes } from "@/actions/cuisine-type"

export function useGetDeletedCuisineTypes(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["cuisine-types", "deleted"],
    queryFn: getDeletedCuisineTypes,
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}