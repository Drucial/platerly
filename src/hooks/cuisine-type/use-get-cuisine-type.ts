"use client"

import { useQuery } from "@tanstack/react-query"
import { getCuisineTypeById } from "@/actions/cuisine-type"

export function useGetCuisineType(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["cuisine-type", id],
    queryFn: () => getCuisineTypeById(id),
    enabled: options?.enabled !== false && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}