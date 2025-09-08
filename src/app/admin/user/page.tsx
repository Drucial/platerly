"use client"

import { UserList } from "@/components/users/user-list"
import { CreateUserForm } from "@/components/users/create-user-form"

export default function AdminUserPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage users, create new accounts, and handle user data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - User List */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <UserList />
            </div>
          </div>

          {/* Right column - Create User Form */}
          <div className="lg:col-span-1">
            <CreateUserForm />
          </div>
        </div>
      </div>
    </div>
  )
}