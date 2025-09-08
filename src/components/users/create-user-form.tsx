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
import { useCreateUser } from "@/hooks/user/use-create-user";
import {
  createUserSchema,
  type CreateUserFormData,
} from "@/lib/users/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { RestoreUserDialog } from "./restore-user-dialog";

export function CreateUserForm() {
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [existingUser, setExistingUser] = useState<any>(null);

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
    },
  });

  const createUserMutation = useCreateUser({
    onSuccess: (result) => {
      if (result.success) {
        form.reset();
        toast.success("User created successfully", {
          description: `${result.user?.first_name} ${result.user?.last_name} has been added to the system.`,
        });
      } else if (result.error === "EXISTING_DELETED_USER") {
        // Show restoration dialog
        setExistingUser(result.existingUser);
        setShowRestoreDialog(true);
      } else {
        toast.error("Failed to create user", {
          description: result.error || "An unexpected error occurred.",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Error creating user", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });

  const onSubmit = (data: CreateUserFormData) => {
    createUserMutation.mutate(data);
  };

  const handleRestoreComplete = () => {
    form.reset();
    setExistingUser(null);
  };

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
              disabled={createUserMutation.isPending}
              className="w-full"
            >
              {createUserMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </Form>

      {createUserMutation.error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="text-sm text-red-600">
            Error: {createUserMutation.error.message}
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
