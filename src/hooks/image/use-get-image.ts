"use client"

import { useQuery } from "@tanstack/react-query"
import { getImageById } from "@/actions/image"

export function useGetImage(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["images", id],
    queryFn: () => getImageById(id),
    enabled: options?.enabled !== false && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}