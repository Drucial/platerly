"use client"

import { useQuery } from "@tanstack/react-query"
import { getTagById } from "@/actions/tag"

export function useGetTag(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["tag", id],
    queryFn: () => getTagById(id),
    enabled: options?.enabled !== false && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}