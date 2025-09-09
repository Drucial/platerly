"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
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
import { useGetAllUsers } from "@/hooks/user/use-get-all-users";
import { useState } from "react";
import { CreateUserForm } from "../../../components/users/create-user-form";
import { columns } from "./columns";

export default function AdminUserPage() {
  const [open, setOpen] = useState(false);
  const { data, error, isLoading, refetch } = useGetAllUsers();

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
        onAdd={() => setOpen(true)}
      />
      <DataTable columns={columns} data={data.users || []} />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Create User</SheetTitle>
            <SheetDescription>
              Create a new user in the system.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4">
            <CreateUserForm onSuccess={() => setOpen(false)} />
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
