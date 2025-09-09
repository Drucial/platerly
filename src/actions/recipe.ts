"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type CreateRecipeData = {
  name: string;
  description: string;
  prep_time?: string;
  cook_time?: string;
  url?: string;
  user_id: number;
  image_id?: number;
  source_image_id?: number;
  cuisine_type_id?: number;
};

export type UpdateRecipeData = {
  name?: string;
  description?: string;
  prep_time?: string;
  cook_time?: string;
  url?: string;
  image_id?: number;
  source_image_id?: number;
  cuisine_type_id?: number;
};

export async function createRecipe(data: CreateRecipeData) {
  try {
    const recipe = await db.recipe.create({
      data,
      include: {
        user: true,
        image: true,
        source_image: true,
        cuisine_type: true,
        steps: {
          where: { destroyed_at: null },
          orderBy: { order: "asc" },
        },
        recipe_ingredients: {
          where: { destroyed_at: null },
          include: {
            ingredient: true,
          },
        },
        recipe_tags: {
          where: { destroyed_at: null },
          include: {
            tag: true,
          },
        },
      },
    });

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    return { success: true, recipe };
  } catch (error) {
    console.error("Error creating recipe:", error);
    return { success: false, error: "Failed to create recipe" };
  }
}

export async function getRecipeById(id: number) {
  try {
    const recipe = await db.recipe.findUnique({
      where: {
        id,
        destroyed_at: null,
      },
      include: {
        user: true,
        image: true,
        source_image: true,
        cuisine_type: true,
        steps: {
          where: { destroyed_at: null },
          orderBy: { order: "asc" },
        },
        recipe_ingredients: {
          where: { destroyed_at: null },
          include: {
            ingredient: true,
          },
        },
        recipe_tags: {
          where: { destroyed_at: null },
          include: {
            tag: true,
          },
        },
      },
    });

    if (!recipe) {
      return { success: false, error: "Recipe not found" };
    }

    return { success: true, recipe };
  } catch (error) {
    console.error("Error getting recipe:", error);
    return { success: false, error: "Failed to get recipe" };
  }
}

export async function updateRecipe(id: number, data: UpdateRecipeData) {
  try {
    const recipe = await db.recipe.update({
      where: {
        id,
        destroyed_at: null,
      },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        user: true,
        image: true,
        source_image: true,
        cuisine_type: true,
        steps: {
          where: { destroyed_at: null },
          orderBy: { order: "asc" },
        },
        recipe_ingredients: {
          where: { destroyed_at: null },
          include: {
            ingredient: true,
          },
        },
        recipe_tags: {
          where: { destroyed_at: null },
          include: {
            tag: true,
          },
        },
      },
    });

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${id}`);
    return { success: true, recipe };
  } catch (error) {
    console.error("Error updating recipe:", error);
    return { success: false, error: "Failed to update recipe" };
  }
}

export async function deleteRecipe(id: number) {
  try {
    const recipe = await db.recipe.update({
      where: {
        id,
        destroyed_at: null,
      },
      data: {
        destroyed_at: new Date(),
        updated_at: new Date(),
      },
    });

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${id}`);
    return { success: true, recipe };
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return { success: false, error: "Failed to delete recipe" };
  }
}

export async function getAllRecipes() {
  try {
    const recipes = await db.recipe.findMany({
      where: {
        destroyed_at: null,
      },
      include: {
        user: true,
        image: true,
        source_image: true,
        cuisine_type: true,
        steps: {
          where: { destroyed_at: null },
          orderBy: { order: "asc" },
        },
        recipe_ingredients: {
          where: { destroyed_at: null },
          include: {
            ingredient: true,
          },
        },
        recipe_tags: {
          where: { destroyed_at: null },
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            steps: { where: { destroyed_at: null } },
            recipe_ingredients: { where: { destroyed_at: null } },
            recipe_tags: { where: { destroyed_at: null } },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return { success: true, recipes };
  } catch (error) {
    console.error("Error getting recipes:", error);
    return { success: false, error: "Failed to get recipes" };
  }
}

export async function restoreRecipe(id: number) {
  try {
    const recipe = await db.recipe.update({
      where: {
        id,
      },
      data: {
        destroyed_at: null,
        updated_at: new Date(),
      },
    });

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${id}`);
    return { success: true, recipe };
  } catch (error) {
    console.error("Error restoring recipe:", error);
    return { success: false, error: "Failed to restore recipe" };
  }
}

export async function getDeletedRecipes() {
  try {
    const recipes = await db.recipe.findMany({
      where: {
        destroyed_at: {
          not: null,
        },
      },
      include: {
        user: true,
        image: true,
        source_image: true,
        cuisine_type: true,
      },
      orderBy: {
        destroyed_at: "desc",
      },
    });

    return { success: true, recipes };
  } catch (error) {
    console.error("Error getting deleted recipes:", error);
    return { success: false, error: "Failed to get deleted recipes" };
  }
}

export async function getRecipesByUserId(userId: number) {
  try {
    const recipes = await db.recipe.findMany({
      where: {
        user_id: userId,
        destroyed_at: null,
      },
      include: {
        user: true,
        image: true,
        source_image: true,
        cuisine_type: true,
        steps: {
          where: { destroyed_at: null },
          orderBy: { order: "asc" },
        },
        recipe_ingredients: {
          where: { destroyed_at: null },
          include: {
            ingredient: true,
          },
        },
        recipe_tags: {
          where: { destroyed_at: null },
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            steps: { where: { destroyed_at: null } },
            recipe_ingredients: { where: { destroyed_at: null } },
            recipe_tags: { where: { destroyed_at: null } },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return { success: true, recipes };
  } catch (error) {
    console.error("Error getting recipes by user:", error);
    return { success: false, error: "Failed to get recipes by user" };
  }
}