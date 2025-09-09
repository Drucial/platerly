"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type CreateTagData = {
  name: string;
  description: string;
};

export type UpdateTagData = {
  name?: string;
  description?: string;
};

export async function createTag(data: CreateTagData) {
  try {
    const tag = await db.tag.create({
      data,
    });

    revalidatePath("/admin/tag");
    return { success: true, tag };
  } catch (error) {
    console.error("Error creating tag:", error);
    return { success: false, error: "Failed to create tag" };
  }
}

export async function getTagById(id: number) {
  try {
    const tag = await db.tag.findUnique({
      where: {
        id,
        destroyed_at: null,
      },
    });

    if (!tag) {
      return { success: false, error: "Tag not found" };
    }

    return { success: true, tag };
  } catch (error) {
    console.error("Error getting tag:", error);
    return { success: false, error: "Failed to get tag" };
  }
}

export async function updateTag(id: number, data: UpdateTagData) {
  try {
    const tag = await db.tag.update({
      where: {
        id,
        destroyed_at: null,
      },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });

    revalidatePath("/admin/tag");
    revalidatePath(`/admin/tag/${id}`);
    return { success: true, tag };
  } catch (error) {
    console.error("Error updating tag:", error);
    return { success: false, error: "Failed to update tag" };
  }
}

export async function deleteTag(id: number) {
  try {
    const tag = await db.tag.update({
      where: {
        id,
        destroyed_at: null,
      },
      data: {
        destroyed_at: new Date(),
        updated_at: new Date(),
      },
    });

    revalidatePath("/admin/tag");
    revalidatePath(`/admin/tag/${id}`);
    return { success: true, tag };
  } catch (error) {
    console.error("Error deleting tag:", error);
    return { success: false, error: "Failed to delete tag" };
  }
}

export async function getAllTags() {
  try {
    const tags = await db.tag.findMany({
      where: {
        destroyed_at: null,
      },
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, tags };
  } catch (error) {
    console.error("Error getting tags:", error);
    return { success: false, error: "Failed to get tags" };
  }
}

export async function restoreTag(id: number) {
  try {
    const tag = await db.tag.update({
      where: {
        id,
      },
      data: {
        destroyed_at: null,
        updated_at: new Date(),
      },
    });

    revalidatePath("/admin/tag");
    revalidatePath(`/admin/tag/${id}`);
    return { success: true, tag };
  } catch (error) {
    console.error("Error restoring tag:", error);
    return { success: false, error: "Failed to restore tag" };
  }
}

export async function getDeletedTags() {
  try {
    const tags = await db.tag.findMany({
      where: {
        destroyed_at: {
          not: null,
        },
      },
      orderBy: {
        destroyed_at: "desc",
      },
    });

    return { success: true, tags };
  } catch (error) {
    console.error("Error getting deleted tags:", error);
    return { success: false, error: "Failed to get deleted tags" };
  }
}