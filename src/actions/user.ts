"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type CreateUserData = {
  first_name: string;
  last_name: string;
  email: string;
};

export type UpdateUserData = {
  first_name?: string;
  last_name?: string;
  email?: string;
};

export async function createUser(data: CreateUserData) {
  try {
    // First check if a soft-deleted user exists with this email
    const existingDeletedUser = await db.user.findFirst({
      where: {
        email: data.email,
        destroyed_at: { not: null }, // Only soft-deleted users
      },
    });

    if (existingDeletedUser) {
      return {
        success: false,
        error: "EXISTING_DELETED_USER",
        existingUser: existingDeletedUser,
      };
    }

    // Check for active user with same email
    const existingActiveUser = await db.user.findFirst({
      where: {
        email: data.email,
        destroyed_at: null, // Active users
      },
    });

    if (existingActiveUser) {
      return {
        success: false,
        error: "Email already exists",
      };
    }

    // Create new user
    const user = await db.user.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
      },
    });

    revalidatePath("/users");
    return { success: true, user };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: "Failed to create user" };
  }
}

export async function getUserById(id: number) {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
        destroyed_at: null, // Only get non-deleted users
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Error getting user:", error);
    return { success: false, error: "Failed to get user" };
  }
}

export async function updateUser(id: number, data: UpdateUserData) {
  try {
    const user = await db.user.update({
      where: {
        id,
        destroyed_at: null, // Only update non-deleted users
      },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });

    revalidatePath("/users");
    revalidatePath(`/users/${id}`);
    return { success: true, user };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUser(id: number) {
  try {
    // Soft delete - set destroyed_at timestamp
    const user = await db.user.update({
      where: {
        id,
        destroyed_at: null, // Only delete non-deleted users
      },
      data: {
        destroyed_at: new Date(),
        updated_at: new Date(),
      },
    });

    revalidatePath("/users");
    revalidatePath(`/users/${id}`);
    return { success: true, user };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function getAllUsers() {
  try {
    const users = await db.user.findMany({
      where: {
        destroyed_at: null, // Only get non-deleted users
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return { success: true, users };
  } catch (error) {
    console.error("Error getting users:", error);
    return { success: false, error: "Failed to get users" };
  }
}

export async function restoreUser(id: number) {
  try {
    // Restore a soft-deleted user
    const user = await db.user.update({
      where: {
        id,
      },
      data: {
        destroyed_at: null,
        updated_at: new Date(),
      },
    });

    revalidatePath("/users");
    revalidatePath(`/users/${id}`);
    return { success: true, user };
  } catch (error) {
    console.error("Error restoring user:", error);
    return { success: false, error: "Failed to restore user" };
  }
}

export async function getDeletedUsers() {
  try {
    const users = await db.user.findMany({
      where: {
        destroyed_at: {
          not: null,
        },
      },
      orderBy: {
        destroyed_at: "desc",
      },
    });

    return { success: true, users };
  } catch (error) {
    console.error("Error getting deleted users:", error);
    return { success: false, error: "Failed to get deleted users" };
  }
}
