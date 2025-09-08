"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type CreateIngredientData = {
  name: string
  description: string
  image_id?: number
  location_id?: number
  type_id?: number
}

export type UpdateIngredientData = {
  name?: string
  description?: string
  image_id?: number
  location_id?: number
  type_id?: number
}

export async function createIngredient(data: CreateIngredientData) {
  try {
    const ingredient = await db.ingredient.create({
      data: {
        name: data.name,
        description: data.description,
        image_id: data.image_id,
        location_id: data.location_id,
        type_id: data.type_id,
      },
      include: {
        image: true,
        location: true,
        type: true,
      },
    })

    revalidatePath("/ingredients")
    return { success: true, ingredient }
  } catch (error) {
    console.error("Error creating ingredient:", error)
    return { success: false, error: "Failed to create ingredient" }
  }
}

export async function getIngredientById(id: number) {
  try {
    const ingredient = await db.ingredient.findUnique({
      where: {
        id,
        destroyed_at: null,
      },
      include: {
        image: {
          where: {
            destroyed_at: null,
          },
        },
        location: {
          where: {
            destroyed_at: null,
          },
        },
        type: {
          where: {
            destroyed_at: null,
          },
        },
      },
    })

    if (!ingredient) {
      return { success: false, error: "Ingredient not found" }
    }

    return { success: true, ingredient }
  } catch (error) {
    console.error("Error getting ingredient:", error)
    return { success: false, error: "Failed to get ingredient" }
  }
}

export async function updateIngredient(id: number, data: UpdateIngredientData) {
  try {
    const ingredient = await db.ingredient.update({
      where: {
        id,
        destroyed_at: null,
      },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        image: true,
        location: true,
        type: true,
      },
    })

    revalidatePath("/ingredients")
    revalidatePath(`/ingredients/${id}`)
    return { success: true, ingredient }
  } catch (error) {
    console.error("Error updating ingredient:", error)
    return { success: false, error: "Failed to update ingredient" }
  }
}

export async function deleteIngredient(id: number) {
  try {
    const ingredient = await db.ingredient.update({
      where: {
        id,
        destroyed_at: null,
      },
      data: {
        destroyed_at: new Date(),
        updated_at: new Date(),
      },
    })

    revalidatePath("/ingredients")
    revalidatePath(`/ingredients/${id}`)
    return { success: true, ingredient }
  } catch (error) {
    console.error("Error deleting ingredient:", error)
    return { success: false, error: "Failed to delete ingredient" }
  }
}

export async function getAllIngredients() {
  try {
    const ingredients = await db.ingredient.findMany({
      where: {
        destroyed_at: null,
      },
      include: {
        image: {
          where: {
            destroyed_at: null,
          },
        },
        location: {
          where: {
            destroyed_at: null,
          },
        },
        type: {
          where: {
            destroyed_at: null,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return { success: true, ingredients }
  } catch (error) {
    console.error("Error getting ingredients:", error)
    return { success: false, error: "Failed to get ingredients" }
  }
}

export async function restoreIngredient(id: number) {
  try {
    const ingredient = await db.ingredient.update({
      where: {
        id,
      },
      data: {
        destroyed_at: null,
        updated_at: new Date(),
      },
      include: {
        image: true,
        location: true,
        type: true,
      },
    })

    revalidatePath("/ingredients")
    revalidatePath(`/ingredients/${id}`)
    return { success: true, ingredient }
  } catch (error) {
    console.error("Error restoring ingredient:", error)
    return { success: false, error: "Failed to restore ingredient" }
  }
}

export async function getDeletedIngredients() {
  try {
    const ingredients = await db.ingredient.findMany({
      where: {
        destroyed_at: {
          not: null,
        },
      },
      include: {
        image: true,
        location: true,
        type: true,
      },
      orderBy: {
        destroyed_at: "desc",
      },
    })

    return { success: true, ingredients }
  } catch (error) {
    console.error("Error getting deleted ingredients:", error)
    return { success: false, error: "Failed to get deleted ingredients" }
  }
}