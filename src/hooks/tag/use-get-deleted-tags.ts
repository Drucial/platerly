"use client"

import { useQuery } from "@tanstack/react-query"
import { getDeletedTags } from "@/actions/tag"

export function useGetDeletedTags(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["tags", "deleted"],
    queryFn: getDeletedTags,
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}