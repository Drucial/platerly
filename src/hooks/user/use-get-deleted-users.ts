"use client"

import { useQuery } from "@tanstack/react-query"
import { getDeletedUsers } from "@/actions/user"

export function useGetDeletedUsers(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["users", "deleted"],
    queryFn: getDeletedUsers,
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}