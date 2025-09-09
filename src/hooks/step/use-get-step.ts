"use client"

import { useQuery } from "@tanstack/react-query"
import { getStepById } from "@/actions/step"

export function useGetStep(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["step", id],
    queryFn: () => getStepById(id),
    enabled: options?.enabled !== false && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}