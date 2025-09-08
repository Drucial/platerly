"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRestoreUser } from "@/hooks/user/use-restore-user";
import { toast } from "sonner";
import { User } from "@/generated/prisma";


interface RestoreUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingUser: User | null;
  onRestoreComplete: () => void;
}

export function RestoreUserDialog({
  open,
  onOpenChange,
  existingUser,
  onRestoreComplete,
}: RestoreUserDialogProps) {
  const restoreUserMutation = useRestoreUser({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("User restored successfully", {
          description: `${result.user?.first_name} ${result.user?.last_name} has been restored.`,
        });
        onOpenChange(false);
        onRestoreComplete();
      } else {
        toast.error("Failed to restore user", {
          description: result.error || "An unexpected error occurred.",
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Error restoring user", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });

  const handleRestore = () => {
    if (existingUser) {
      restoreUserMutation.mutate(existingUser.id);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!existingUser) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Previously Existed</DialogTitle>
          <DialogDescription>
            A user with the email <strong>{existingUser.email}</strong>{" "}
            previously existed in the system but was removed on{" "}
            {new Date(existingUser.destroyed_at!).toLocaleDateString()}.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-gray-900 mb-2">
              Previous User Details:
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                <strong>Name:</strong> {existingUser.first_name}{" "}
                {existingUser.last_name}
              </div>
              <div>
                <strong>Email:</strong> {existingUser.email}
              </div>
              <div>
                <strong>Removed:</strong>{" "}
                {new Date(existingUser.destroyed_at!).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <DialogDescription>
          Would you like to restore this user instead of creating a new one?
        </DialogDescription>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={restoreUserMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRestore}
            disabled={restoreUserMutation.isPending}
          >
            {restoreUserMutation.isPending ? "Restoring..." : "Restore User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
