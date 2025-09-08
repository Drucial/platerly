"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type CreateIngredientLocationData = {
  name: string
}

export type UpdateIngredientLocationData = {
  name?: string
}

export async function createIngredientLocation(data: CreateIngredientLocationData) {
  try {
    // Check for active location with same name
    const existingActiveLocation = await db.ingredientLocation.findFirst({
      where: {
        name: data.name,
        destroyed_at: null,
      },
    })

    if (existingActiveLocation) {
      return {
        success: false,
        error: "Location name already exists",
      }
    }

    // Check if a soft-deleted location exists with this name
    const existingDeletedLocation = await db.ingredientLocation.findFirst({
      where: {
        name: data.name,
        destroyed_at: { not: null },
      },
    })

    if (existingDeletedLocation) {
      return {
        success: false,
        error: "EXISTING_DELETED_LOCATION",
        existingLocation: existingDeletedLocation,
      }
    }

    const location = await db.ingredientLocation.create({
      data: {
        name: data.name,
      },
    })

    revalidatePath("/ingredient-locations")
    return { success: true, location }
  } catch (error) {
    console.error("Error creating ingredient location:", error)
    return { success: false, error: "Failed to create ingredient location" }
  }
}

export async function getIngredientLocationById(id: number) {
  try {
    const location = await db.ingredientLocation.findUnique({
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

    if (!location) {
      return { success: false, error: "Ingredient location not found" }
    }

    return { success: true, location }
  } catch (error) {
    console.error("Error getting ingredient location:", error)
    return { success: false, error: "Failed to get ingredient location" }
  }
}

export async function updateIngredientLocation(id: number, data: UpdateIngredientLocationData) {
  try {
    // If updating name, check for uniqueness
    if (data.name) {
      const existingLocation = await db.ingredientLocation.findFirst({
        where: {
          name: data.name,
          destroyed_at: null,
          id: { not: id },
        },
      })

      if (existingLocation) {
        return {
          success: false,
          error: "Location name already exists",
        }
      }
    }

    const location = await db.ingredientLocation.update({
      where: {
        id,
        destroyed_at: null,
      },
      data: {
        ...data,
        updated_at: new Date(),
      },
    })

    revalidatePath("/ingredient-locations")
    revalidatePath(`/ingredient-locations/${id}`)
    return { success: true, location }
  } catch (error) {
    console.error("Error updating ingredient location:", error)
    return { success: false, error: "Failed to update ingredient location" }
  }
}

export async function deleteIngredientLocation(id: number) {
  try {
    const location = await db.ingredientLocation.update({
      where: {
        id,
        destroyed_at: null,
      },
      data: {
        destroyed_at: new Date(),
        updated_at: new Date(),
      },
    })

    revalidatePath("/ingredient-locations")
    revalidatePath(`/ingredient-locations/${id}`)
    return { success: true, location }
  } catch (error) {
    console.error("Error deleting ingredient location:", error)
    return { success: false, error: "Failed to delete ingredient location" }
  }
}

export async function getAllIngredientLocations() {
  try {
    const locations = await db.ingredientLocation.findMany({
      where: {
        destroyed_at: null,
      },
      orderBy: {
        name: "asc",
      },
    })

    return { success: true, locations }
  } catch (error) {
    console.error("Error getting ingredient locations:", error)
    return { success: false, error: "Failed to get ingredient locations" }
  }
}

export async function restoreIngredientLocation(id: number) {
  try {
    const location = await db.ingredientLocation.update({
      where: {
        id,
      },
      data: {
        destroyed_at: null,
        updated_at: new Date(),
      },
    })

    revalidatePath("/ingredient-locations")
    revalidatePath(`/ingredient-locations/${id}`)
    return { success: true, location }
  } catch (error) {
    console.error("Error restoring ingredient location:", error)
    return { success: false, error: "Failed to restore ingredient location" }
  }
}

export async function getDeletedIngredientLocations() {
  try {
    const locations = await db.ingredientLocation.findMany({
      where: {
        destroyed_at: {
          not: null,
        },
      },
      orderBy: {
        destroyed_at: "desc",
      },
    })

    return { success: true, locations }
  } catch (error) {
    console.error("Error getting deleted ingredient locations:", error)
    return { success: false, error: "Failed to get deleted ingredient locations" }
  }
}