"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type CreateImageData = {
  name: string
  url: string
  description: string
}

export type UpdateImageData = {
  name?: string
  url?: string
  description?: string
}

export async function createImage(data: CreateImageData) {
  try {
    const image = await db.image.create({
      data: {
        name: data.name,
        url: data.url,
        description: data.description,
      },
    })

    revalidatePath("/images")
    return { success: true, image }
  } catch (error) {
    console.error("Error creating image:", error)
    return { success: false, error: "Failed to create image" }
  }
}

export async function getImageById(id: number) {
  try {
    const image = await db.image.findUnique({
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

    if (!image) {
      return { success: false, error: "Image not found" }
    }

    return { success: true, image }
  } catch (error) {
    console.error("Error getting image:", error)
    return { success: false, error: "Failed to get image" }
  }
}

export async function updateImage(id: number, data: UpdateImageData) {
  try {
    const image = await db.image.update({
      where: {
        id,
        destroyed_at: null,
      },
      data: {
        ...data,
        updated_at: new Date(),
      },
    })

    revalidatePath("/images")
    revalidatePath(`/images/${id}`)
    return { success: true, image }
  } catch (error) {
    console.error("Error updating image:", error)
    return { success: false, error: "Failed to update image" }
  }
}

export async function deleteImage(id: number) {
  try {
    const image = await db.image.update({
      where: {
        id,
        destroyed_at: null,
      },
      data: {
        destroyed_at: new Date(),
        updated_at: new Date(),
      },
    })

    revalidatePath("/images")
    revalidatePath(`/images/${id}`)
    return { success: true, image }
  } catch (error) {
    console.error("Error deleting image:", error)
    return { success: false, error: "Failed to delete image" }
  }
}

export async function getAllImages() {
  try {
    const images = await db.image.findMany({
      where: {
        destroyed_at: null,
      },
      orderBy: {
        created_at: "desc",
      },
    })

    return { success: true, images }
  } catch (error) {
    console.error("Error getting images:", error)
    return { success: false, error: "Failed to get images" }
  }
}

export async function restoreImage(id: number) {
  try {
    const image = await db.image.update({
      where: {
        id,
      },
      data: {
        destroyed_at: null,
        updated_at: new Date(),
      },
    })

    revalidatePath("/images")
    revalidatePath(`/images/${id}`)
    return { success: true, image }
  } catch (error) {
    console.error("Error restoring image:", error)
    return { success: false, error: "Failed to restore image" }
  }
}

export async function getDeletedImages() {
  try {
    const images = await db.image.findMany({
      where: {
        destroyed_at: {
          not: null,
        },
      },
      orderBy: {
        destroyed_at: "desc",
      },
    })

    return { success: true, images }
  } catch (error) {
    console.error("Error getting deleted images:", error)
    return { success: false, error: "Failed to get deleted images" }
  }
}