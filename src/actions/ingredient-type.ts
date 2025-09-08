"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type CreateIngredientTypeData = {
  name: string
}

export type UpdateIngredientTypeData = {
  name?: string
}

export async function createIngredientType(data: CreateIngredientTypeData) {
  try {
    // Check for active type with same name
    const existingActiveType = await db.ingredientType.findFirst({
      where: {
        name: data.name,
        destroyed_at: null,
      },
    })

    if (existingActiveType) {
      return {
        success: false,
        error: "Type name already exists",
      }
    }

    // Check if a soft-deleted type exists with this name
    const existingDeletedType = await db.ingredientType.findFirst({
      where: {
        name: data.name,
        destroyed_at: { not: null },
      },
    })

    if (existingDeletedType) {
      return {
        success: false,
        error: "EXISTING_DELETED_TYPE",
        existingType: existingDeletedType,
      }
    }

    const type = await db.ingredientType.create({
      data: {
        name: data.name,
      },
    })

    revalidatePath("/ingredient-types")
    return { success: true, type }
  } catch (error) {
    console.error("Error creating ingredient type:", error)
    return { success: false, error: "Failed to create ingredient type" }
  }
}

export async function getIngredientTypeById(id: number) {
  try {
    const type = await db.ingredientType.findUnique({
      where: {
        id,
        destroyed_at: null,
      },
      include: {
        ingredients: {
          where: {
            destroyed_at: null,
          },
        },
      },
    })

    if (!type) {
      return { success: false, error: "Ingredient type not found" }
    }

    return { success: true, type }
  } catch (error) {
    console.error("Error getting ingredient type:", error)
    return { success: false, error: "Failed to get ingredient type" }
  }
}

export async function updateIngredientType(id: number, data: UpdateIngredientTypeData) {
  try {
    // If updating name, check for uniqueness
    if (data.name) {
      const existingType = await db.ingredientType.findFirst({
        where: {
          name: data.name,
          destroyed_at: null,
          id: { not: id },
        },
      })

      if (existingType) {
        return {
          success: false,
          error: "Type name already exists",
        }
      }
    }

    const type = await db.ingredientType.update({
      where: {
        id,
        destroyed_at: null,
      },
      data: {
        ...data,
        updated_at: new Date(),
      },
    })

    revalidatePath("/ingredient-types")
    revalidatePath(`/ingredient-types/${id}`)
    return { success: true, type }
  } catch (error) {
    console.error("Error updating ingredient type:", error)
    return { success: false, error: "Failed to update ingredient type" }
  }
}

export async function deleteIngredientType(id: number) {
  try {
    const type = await db.ingredientType.update({
      where: {
        id,
        destroyed_at: null,
      },
      data: {
        destroyed_at: new Date(),
        updated_at: new Date(),
      },
    })

    revalidatePath("/ingredient-types")
    revalidatePath(`/ingredient-types/${id}`)
    return { success: true, type }
  } catch (error) {
    console.error("Error deleting ingredient type:", error)
    return { success: false, error: "Failed to delete ingredient type" }
  }
}

export async function getAllIngredientTypes() {
  try {
    const types = await db.ingredientType.findMany({
      where: {
        destroyed_at: null,
      },
      orderBy: {
        name: "asc",
      },
    })

    return { success: true, types }
  } catch (error) {
    console.error("Error getting ingredient types:", error)
    return { success: false, error: "Failed to get ingredient types" }
  }
}

export async function restoreIngredientType(id: number) {
  try {
    const type = await db.ingredientType.update({
      where: {
        id,
      },
      data: {
        destroyed_at: null,
        updated_at: new Date(),
      },
    })

    revalidatePath("/ingredient-types")
    revalidatePath(`/ingredient-types/${id}`)
    return { success: true, type }
  } catch (error) {
    console.error("Error restoring ingredient type:", error)
    return { success: false, error: "Failed to restore ingredient type" }
  }
}

export async function getDeletedIngredientTypes() {
  try {
    const types = await db.ingredientType.findMany({
      where: {
        destroyed_at: {
          not: null,
        },
      },
      orderBy: {
        destroyed_at: "desc",
      },
    })

    return { success: true, types }
  } catch (error) {
    console.error("Error getting deleted ingredient types:", error)
    return { success: false, error: "Failed to get deleted ingredient types" }
  }
}