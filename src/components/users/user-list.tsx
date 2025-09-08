"use client"

import { useGetAllUsers } from "@/hooks/user/use-get-all-users"
import { useDeleteUser } from "@/hooks/user/use-delete-user"
import { Trash2, Edit } from "lucide-react"
import { useState } from "react"

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  created_at: string
  updated_at: string
  destroyed_at: string | null
}

export function UserList() {
  const { data: usersData, isLoading, error } = useGetAllUsers()
  const deleteUserMutation = useDeleteUser()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setDeletingId(id)
      try {
        await deleteUserMutation.mutateAsync(id)
      } catch (error) {
        console.error("Failed to delete user:", error)
      } finally {
        setDeletingId(null)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-gray-500">Loading users...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="text-sm text-red-600">
          Error loading users: {error.message}
        </div>
      </div>
    )
  }

  if (!usersData?.success || !usersData.users?.length) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-500">No users found</div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Users ({usersData.users.length})
      </h2>
      
      <div className="space-y-2">
        {usersData.users.map((user: User) => (
          <div
            key={user.id}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900">
                    {user.first_name} {user.last_name}
                  </h3>
                  <span className="text-sm text-gray-500">#{user.id}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Created: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit user"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={deletingId === user.id}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  title="Delete user"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}