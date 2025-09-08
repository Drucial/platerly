"use client"

import { useQuery } from "@tanstack/react-query"
import { getUserById } from "@/actions/user"

export function useGetUser(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: options?.enabled !== false && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}