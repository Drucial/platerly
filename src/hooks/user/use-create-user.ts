"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createUser, type CreateUserData } from "@/actions/user"

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserData) => createUser(data),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (error) => {
      console.error("Failed to create user:", error)
    },
  })
}