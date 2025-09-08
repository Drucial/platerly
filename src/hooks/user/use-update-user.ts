"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateUser, type UpdateUserData } from "@/actions/user"

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserData }) => 
      updateUser(id, data),
    onSuccess: (result, variables) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] })
      // Invalidate and refetch the specific user
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] })
    },
    onError: (error) => {
      console.error("Failed to update user:", error)
    },
  })
}