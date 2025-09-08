"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllUsers } from "@/actions/user"

export function useGetAllUsers(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}