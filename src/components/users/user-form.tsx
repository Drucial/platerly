"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@/generated/prisma";
import { useCreateUser } from "@/hooks/user/use-create-user";
import { useGetUser } from "@/hooks/user/use-get-user";
import { useUpdateUser } from "@/hooks/user/use-update-user";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from "@/lib/users/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { RestoreUserDialog } from "./restore-user-dialog";

type UserFormProps = {
  mode: "create" | "edit";
  userId?: number;
  onSuccess: () => void;
};

export function UserForm({ mode, userId, onSuccess }: UserFormProps) {
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [existingUser, setExistingUser] = useState<User | null>(null);

  const isEditMode = mode === "edit";
  const schema = isEditMode ? updateUserSchema : createUserSchema;

  const form = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
    },
  });

  // Fetch user data for edit mode
  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
  } = useGetUser(userId!, {
    enabled: isEditMode && !!userId,
  });

  // Update form when user data is loaded
  useEffect(() => {
    if (isEditMode && userData?.success && userData.user) {
      const user = userData.user;
      form.reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    }
  }, [userData, isEditMode, form]);

  const createUserMutation = useCreateUser({
    onSuccess: (result) => {
      if (result.success) {
        form.reset();
        toast.success("User created successfully", {
          description: `${result.user?.first_name} ${result.user?.last_name} has been added to the system.`,
        });
        onSuccess();
      } else if (result.error === "EXISTING_DELETED_USER") {
        setExistingUser(result.existingUser || null);
        setShowRestoreDialog(true);
      } else {
        toast.error("Failed to create user", {
          description: result.error || "An unexpected error occurred.",
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Error creating user", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });

  const updateUserMutation = useUpdateUser({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("User updated successfully", {
          description: `${result.user?.first_name} ${result.user?.last_name} has been updated.`,
        });
        onSuccess();
      } else {
        toast.error("Failed to update user", {
          description: result.error || "An unexpected error occurred.",
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Error updating user", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });

  const onSubmit = (data: CreateUserFormData | UpdateUserFormData) => {
    if (isEditMode && userId) {
      updateUserMutation.mutate({ id: userId, data: data as UpdateUserFormData });
    } else {
      createUserMutation.mutate(data as CreateUserFormData);
    }
  };

  const handleRestoreComplete = () => {
    form.reset();
    setExistingUser(null);
  };

  const isLoading = isEditMode ? isLoadingUser : false;
  const isPending = createUserMutation.isPending || updateUserMutation.isPending;
  const error = isEditMode ? userError : createUserMutation.error;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-muted-foreground">Loading user...</div>
      </div>
    );
  }

  if (isEditMode && userError) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-red-600">Failed to load user data</div>
      </div>
    );
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full"
            >
              {isPending
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update User"
                : "Create User"}
            </Button>
          </div>
        </form>
      </Form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="text-sm text-red-600">
            Error: {error.message}
          </div>
        </div>
      )}

      <RestoreUserDialog
        open={showRestoreDialog}
        onOpenChange={setShowRestoreDialog}
        existingUser={existingUser}
        onRestoreComplete={handleRestoreComplete}
      />
    </>
  );
}