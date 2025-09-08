"use client";

import { useDeleteUser } from "@/hooks/user/use-delete-user";
import { useGetAllUsers } from "@/hooks/user/use-get-all-users";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { User } from "../../generated/prisma";

export function UserList() {
  const { data: usersData, isLoading, error } = useGetAllUsers();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const deleteUserMutation = useDeleteUser({
    onSuccess: (result, id) => {
      const user = usersData?.users?.find((u: User) => u.id === id);
      const userName = user ? `${user.first_name} ${user.last_name}` : "User";

      if (result.success) {
        toast.success("User deleted successfully", {
          description: `${userName} has been removed from the system.`,
        });
      } else {
        toast.error("Failed to delete user", {
          description: result.error || "An unexpected error occurred.",
        });
      }
      setDeletingId(null);
    },
    onError: (error: any) => {
      toast.error("Error deleting user", {
        description: error.message || "An unexpected error occurred.",
      });
      setDeletingId(null);
    },
    onMutate: (id) => {
      setDeletingId(id);
    },
  });

  const handleDelete = (id: number) => {
    const user = usersData?.users?.find((u: User) => u.id === id);
    const userName = user ? `${user.first_name} ${user.last_name}` : "User";

    if (confirm(`Are you sure you want to delete ${userName}?`)) {
      deleteUserMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-gray-500">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="text-sm text-red-600">
          Error loading users: {error.message}
        </div>
      </div>
    );
  }

  if (!usersData?.success || !usersData.users?.length) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-500">No users found</div>
      </div>
    );
  }

  return (
    <ul className="divide-y rounded-lg border">
      {usersData.users.map((user: User) => (
        <li
          key={user.id}
          className="p-4 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">
                  {user.first_name} {user.last_name}
                </h3>
                <span className="text-sm text-muted-foreground">
                  #{user.id}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Created: {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="p-2 text-muted-foreground hover:text-blue-600 transition-colors"
                title="Edit user"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                disabled={deletingId === user.id}
                className="p-2 text-muted-foreground hover:text-red-600 transition-colors disabled:opacity-50"
                title="Delete user"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
