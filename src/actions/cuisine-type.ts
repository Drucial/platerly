"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type CreateCuisineTypeData = {
  name: string;
  description: string;
};

export type UpdateCuisineTypeData = {
  name?: string;
  description?: string;
};

export async function createCuisineType(data: CreateCuisineTypeData) {
  try {
    const cuisineType = await db.cuisineType.create({
      data,
    });

    revalidatePath("/admin/cuisine-type");
    return { success: true, cuisineType };
  } catch (error) {
    console.error("Error creating cuisine type:", error);
    return { success: false, error: "Failed to create cuisine type" };
  }
}

export async function getCuisineTypeById(id: number) {
  try {
    const cuisineType = await db.cuisineType.findUnique({
      where: {
        id,
        destroyed_at: null,
      },
    });

    if (!cuisineType) {
      return { success: false, error: "Cuisine type not found" };
    }

    return { success: true, cuisineType };
  } catch (error) {
    console.error("Error getting cuisine type:", error);
    return { success: false, error: "Failed to get cuisine type" };
  }
}

export async function updateCuisineType(id: number, data: UpdateCuisineTypeData) {
  try {
    const cuisineType = await db.cuisineType.update({
      where: {
        id,
        destroyed_at: null,
      },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });

    revalidatePath("/admin/cuisine-type");
    revalidatePath(`/admin/cuisine-type/${id}`);
    return { success: true, cuisineType };
  } catch (error) {
    console.error("Error updating cuisine type:", error);
    return { success: false, error: "Failed to update cuisine type" };
  }
}

export async function deleteCuisineType(id: number) {
  try {
    const cuisineType = await db.cuisineType.update({
      where: {
        id,
        destroyed_at: null,
      },
      data: {
        destroyed_at: new Date(),
        updated_at: new Date(),
      },
    });

    revalidatePath("/admin/cuisine-type");
    revalidatePath(`/admin/cuisine-type/${id}`);
    return { success: true, cuisineType };
  } catch (error) {
    console.error("Error deleting cuisine type:", error);
    return { success: false, error: "Failed to delete cuisine type" };
  }
}

export async function getAllCuisineTypes() {
  try {
    const cuisineTypes = await db.cuisineType.findMany({
      where: {
        destroyed_at: null,
      },
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, cuisineTypes };
  } catch (error) {
    console.error("Error getting cuisine types:", error);
    return { success: false, error: "Failed to get cuisine types" };
  }
}

export async function restoreCuisineType(id: number) {
  try {
    const cuisineType = await db.cuisineType.update({
      where: {
        id,
      },
      data: {
        destroyed_at: null,
        updated_at: new Date(),
      },
    });

    revalidatePath("/admin/cuisine-type");
    revalidatePath(`/admin/cuisine-type/${id}`);
    return { success: true, cuisineType };
  } catch (error) {
    console.error("Error restoring cuisine type:", error);
    return { success: false, error: "Failed to restore cuisine type" };
  }
}

export async function getDeletedCuisineTypes() {
  try {
    const cuisineTypes = await db.cuisineType.findMany({
      where: {
        destroyed_at: {
          not: null,
        },
      },
      orderBy: {
        destroyed_at: "desc",
      },
    });

    return { success: true, cuisineTypes };
  } catch (error) {
    console.error("Error getting deleted cuisine types:", error);
    return { success: false, error: "Failed to get deleted cuisine types" };
  }
}