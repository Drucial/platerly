"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteUser } from "@/actions/user"

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: (result, id) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] })
      // Invalidate the specific user query
      queryClient.invalidateQueries({ queryKey: ["user", id] })
      // Invalidate deleted users list if being used
      queryClient.invalidateQueries({ queryKey: ["users", "deleted"] })
    },
    onError: (error) => {
      console.error("Failed to delete user:", error)
    },
  })
}