"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllImages } from "@/actions/image"

export function useGetAllImages(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["images"],
    queryFn: getAllImages,
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}