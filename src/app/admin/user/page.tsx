"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { DataTable } from "@/components/admin/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FullScreenError } from "@/components/ui/full-screen-error";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDeleteUser } from "@/hooks/user/use-delete-user";
import { useGetAllUsers } from "@/hooks/user/use-get-all-users";
import { useGetDeletedUsers } from "@/hooks/user/use-get-deleted-users";
import { useRestoreUser } from "@/hooks/user/use-restore-user";
import { useState } from "react";
import { toast } from "sonner";
import { UserForm } from "../../../components/users/user-form";
import { columns } from "./columns";

export default function AdminUserPage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [restoringUserId, setRestoringUserId] = useState<number | null>(null);
  const { data, error, isLoading, refetch } = useGetAllUsers();
  const { data: deletedData, error: deletedError, isLoading: deletedLoading, refetch: refetchDeleted } = useGetDeletedUsers();

  const restoreUserMutation = useRestoreUser({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("User restored successfully", {
          description: `${result.user?.first_name} ${result.user?.last_name} has been restored.`,
        });
      } else {
        toast.error("Failed to restore user", {
          description: result.error || "An unexpected error occurred.",
        });
      }
      setRestoreDialogOpen(false);
      setRestoringUserId(null);
    },
    onError: (error: Error) => {
      toast.error("Error restoring user", {
        description: error.message || "An unexpected error occurred.",
      });
      setRestoreDialogOpen(false);
      setRestoringUserId(null);
    },
  });

  const deleteUserMutation = useDeleteUser({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("User deleted successfully", {
          description: `${result.user?.first_name} ${result.user?.last_name} has been moved to trash.`,
        });
      } else {
        toast.error("Failed to delete user", {
          description: result.error || "An unexpected error occurred.",
        });
      }
      setDeleteDialogOpen(false);
      setDeletingUserId(null);
    },
    onError: (error: Error) => {
      toast.error("Error deleting user", {
        description: error.message || "An unexpected error occurred.",
      });
      setDeleteDialogOpen(false);
      setDeletingUserId(null);
    },
  });

  const handleDeleteUser = () => {
    if (deletingUserId) {
      deleteUserMutation.mutate(deletingUserId);
    }
  };

  const handleRestoreUser = () => {
    if (restoringUserId) {
      restoreUserMutation.mutate(restoringUserId);
    }
  };

  if (isLoading) {
    return (
      <FullScreenLoader
        title="Getting users..."
        description="Please wait while we load the users..."
      />
    );
  }

  if (error || !data) {
    return (
      <FullScreenError
        title="Error getting users"
        description={error?.message || "An unexpected error occurred."}
        action={<Button onClick={() => refetch()}>Retry</Button>}
      />
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6 h-[calc(100svh-var(--navbar-height))] mt-[var(--navbar-height)] flex flex-col">
      <AdminHeader
        title="Users"
        description="Manage users in the system"
        onAdd={() => {
          setEditingId(null);
          setOpen(true);
        }}
      />
      <Tabs defaultValue="active" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Users</TabsTrigger>
          <TabsTrigger value="deleted">Deleted Users</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="flex-1 flex flex-col">
          <DataTable
            columns={columns}
            data={data.users || []}
            onEdit={(id) => {
              setEditingId(id);
              setOpen(true);
            }}
            onDelete={(id) => {
              setDeletingUserId(id);
              setDeleteDialogOpen(true);
            }}
            getId={(row) => row.id}
          />
        </TabsContent>
        <TabsContent value="deleted" className="flex-1 flex flex-col">
          {deletedLoading ? (
            <FullScreenLoader
              title="Getting deleted users..."
              description="Please wait while we load the deleted users..."
            />
          ) : deletedError || !deletedData ? (
            <FullScreenError
              title="Error getting deleted users"
              description={deletedError?.message || "An unexpected error occurred."}
              action={<Button onClick={() => refetchDeleted()}>Retry</Button>}
            />
          ) : (
            <DataTable
              columns={columns}
              data={deletedData.users || []}
              onRestore={(id) => {
                setRestoringUserId(id);
                setRestoreDialogOpen(true);
              }}
              getId={(row) => row.id}
              showRestoreAction={true}
            />
          )}
        </TabsContent>
      </Tabs>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingId ? "Edit User" : "Create User"}</SheetTitle>
            <SheetDescription>
              {editingId
                ? "Update the user information below."
                : "Create a new user in the system."}
            </SheetDescription>
          </SheetHeader>
          <div className="px-4">
            <UserForm
              mode={editingId ? "edit" : "create"}
              userId={editingId || undefined}
              onSuccess={() => {
                setOpen(false);
                setEditingId(null);
              }}
            />
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action will move
              the user to trash and can be undone later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this user? This action will move
              the user back to the active users list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreUser}
              disabled={restoreUserMutation.isPending}
            >
              {restoreUserMutation.isPending ? "Restoring..." : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
