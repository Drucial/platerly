"use client";

import { CreateUserForm } from "@/components/users/create-user-form";
import { UserList } from "@/components/users/user-list";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export default function AdminUserPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage users, create new accounts, and handle user data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - User List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent>
                <UserList />
              </CardContent>
            </Card>
          </div>

          {/* Right column - Create User Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Create User</CardTitle>
              </CardHeader>
              <CardContent>
                <CreateUserForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
