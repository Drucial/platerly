"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type CreateRecipeTagData = {
  recipe_id: number;
  tag_id: number;
};

export async function createRecipeTag(data: CreateRecipeTagData) {
  try {
    const recipeTag = await db.recipeTag.create({
      data,
      include: {
        recipe: true,
        tag: true,
      },
    });

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${data.recipe_id}`);
    return { success: true, recipeTag };
  } catch (error) {
    console.error("Error creating recipe tag:", error);
    return { success: false, error: "Failed to create recipe tag" };
  }
}

export async function getRecipeTagById(id: number) {
  try {
    const recipeTag = await db.recipeTag.findUnique({
      where: {
        id,
        destroyed_at: null,
      },
      include: {
        recipe: true,
        tag: true,
      },
    });

    if (!recipeTag) {
      return { success: false, error: "Recipe tag not found" };
    }

    return { success: true, recipeTag };
  } catch (error) {
    console.error("Error getting recipe tag:", error);
    return { success: false, error: "Failed to get recipe tag" };
  }
}

export async function deleteRecipeTag(id: number) {
  try {
    const recipeTag = await db.recipeTag.update({
      where: {
        id,
        destroyed_at: null,
      },
      data: {
        destroyed_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        recipe: true,
        tag: true,
      },
    });

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${recipeTag.recipe_id}`);
    return { success: true, recipeTag };
  } catch (error) {
    console.error("Error deleting recipe tag:", error);
    return { success: false, error: "Failed to delete recipe tag" };
  }
}

export async function getRecipeTagsByRecipeId(recipeId: number) {
  try {
    const recipeTags = await db.recipeTag.findMany({
      where: {
        recipe_id: recipeId,
        destroyed_at: null,
      },
      include: {
        recipe: true,
        tag: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    return { success: true, recipeTags };
  } catch (error) {
    console.error("Error getting recipe tags by recipe:", error);
    return { success: false, error: "Failed to get recipe tags by recipe" };
  }
}

export async function restoreRecipeTag(id: number) {
  try {
    const recipeTag = await db.recipeTag.update({
      where: {
        id,
      },
      data: {
        destroyed_at: null,
        updated_at: new Date(),
      },
      include: {
        recipe: true,
        tag: true,
      },
    });

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${recipeTag.recipe_id}`);
    return { success: true, recipeTag };
  } catch (error) {
    console.error("Error restoring recipe tag:", error);
    return { success: false, error: "Failed to restore recipe tag" };
  }
}

export async function bulkCreateRecipeTags(recipeId: number, tagIds: number[]) {
  try {
    const recipeTags = await db.$transaction(
      tagIds.map(tagId =>
        db.recipeTag.create({
          data: {
            recipe_id: recipeId,
            tag_id: tagId,
          },
          include: {
            recipe: true,
            tag: true,
          },
        })
      )
    );

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${recipeId}`);
    return { success: true, recipeTags };
  } catch (error) {
    console.error("Error bulk creating recipe tags:", error);
    return { success: false, error: "Failed to bulk create recipe tags" };
  }
}

export async function removeRecipeTagByIds(recipeId: number, tagId: number) {
  try {
    const recipeTag = await db.recipeTag.updateMany({
      where: {
        recipe_id: recipeId,
        tag_id: tagId,
        destroyed_at: null,
      },
      data: {
        destroyed_at: new Date(),
        updated_at: new Date(),
      },
    });

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${recipeId}`);
    return { success: true, recipeTag };
  } catch (error) {
    console.error("Error removing recipe tag:", error);
    return { success: false, error: "Failed to remove recipe tag" };
  }
}