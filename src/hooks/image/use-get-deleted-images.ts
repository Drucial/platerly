"use client"

import { useQuery } from "@tanstack/react-query"
import { getDeletedImages } from "@/actions/image"

export function useGetDeletedImages(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["images", "deleted"],
    queryFn: getDeletedImages,
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}