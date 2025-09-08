"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { restoreUser } from "@/actions/user"

export function useRestoreUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => restoreUser(id),
    onSuccess: (result, id) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] })
      // Invalidate the specific user query
      queryClient.invalidateQueries({ queryKey: ["user", id] })
      // Invalidate deleted users list
      queryClient.invalidateQueries({ queryKey: ["users", "deleted"] })
    },
    onError: (error) => {
      console.error("Failed to restore user:", error)
    },
  })
}