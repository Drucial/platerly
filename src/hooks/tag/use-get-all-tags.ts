"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllTags } from "@/actions/tag"

export function useGetAllTags(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["tags"],
    queryFn: getAllTags,
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes (tags change less frequently)
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}