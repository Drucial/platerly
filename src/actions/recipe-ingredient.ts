"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type CreateRecipeIngredientData = {
  recipe_id: number;
  ingredient_id: number;
  quantity?: number;
  unit?: string;
  notes?: string;
};

export type UpdateRecipeIngredientData = {
  quantity?: number;
  unit?: string;
  notes?: string;
};

export async function createRecipeIngredient(data: CreateRecipeIngredientData) {
  try {
    const recipeIngredient = await db.recipeIngredient.create({
      data,
      include: {
        recipe: true,
        ingredient: true,
      },
    });

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${data.recipe_id}`);
    return { success: true, recipeIngredient };
  } catch (error) {
    console.error("Error creating recipe ingredient:", error);
    return { success: false, error: "Failed to create recipe ingredient" };
  }
}

export async function getRecipeIngredientById(id: number) {
  try {
    const recipeIngredient = await db.recipeIngredient.findUnique({
      where: {
        id,
        destroyed_at: null,
      },
      include: {
        recipe: true,
        ingredient: true,
      },
    });

    if (!recipeIngredient) {
      return { success: false, error: "Recipe ingredient not found" };
    }

    return { success: true, recipeIngredient };
  } catch (error) {
    console.error("Error getting recipe ingredient:", error);
    return { success: false, error: "Failed to get recipe ingredient" };
  }
}

export async function updateRecipeIngredient(id: number, data: UpdateRecipeIngredientData) {
  try {
    const recipeIngredient = await db.recipeIngredient.update({
      where: {
        id,
        destroyed_at: null,
      },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        recipe: true,
        ingredient: true,
      },
    });

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${recipeIngredient.recipe_id}`);
    return { success: true, recipeIngredient };
  } catch (error) {
    console.error("Error updating recipe ingredient:", error);
    return { success: false, error: "Failed to update recipe ingredient" };
  }
}

export async function deleteRecipeIngredient(id: number) {
  try {
    const recipeIngredient = await db.recipeIngredient.update({
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
        ingredient: true,
      },
    });

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${recipeIngredient.recipe_id}`);
    return { success: true, recipeIngredient };
  } catch (error) {
    console.error("Error deleting recipe ingredient:", error);
    return { success: false, error: "Failed to delete recipe ingredient" };
  }
}

export async function getRecipeIngredientsByRecipeId(recipeId: number) {
  try {
    const recipeIngredients = await db.recipeIngredient.findMany({
      where: {
        recipe_id: recipeId,
        destroyed_at: null,
      },
      include: {
        recipe: true,
        ingredient: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    return { success: true, recipeIngredients };
  } catch (error) {
    console.error("Error getting recipe ingredients by recipe:", error);
    return { success: false, error: "Failed to get recipe ingredients by recipe" };
  }
}

export async function restoreRecipeIngredient(id: number) {
  try {
    const recipeIngredient = await db.recipeIngredient.update({
      where: {
        id,
      },
      data: {
        destroyed_at: null,
        updated_at: new Date(),
      },
      include: {
        recipe: true,
        ingredient: true,
      },
    });

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${recipeIngredient.recipe_id}`);
    return { success: true, recipeIngredient };
  } catch (error) {
    console.error("Error restoring recipe ingredient:", error);
    return { success: false, error: "Failed to restore recipe ingredient" };
  }
}

export async function bulkCreateRecipeIngredients(
  recipeId: number,
  ingredients: Array<{
    ingredient_id: number;
    quantity?: number;
    unit?: string;
    notes?: string;
  }>
) {
  try {
    const recipeIngredients = await db.$transaction(
      ingredients.map(ingredient =>
        db.recipeIngredient.create({
          data: {
            recipe_id: recipeId,
            ...ingredient,
          },
          include: {
            recipe: true,
            ingredient: true,
          },
        })
      )
    );

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${recipeId}`);
    return { success: true, recipeIngredients };
  } catch (error) {
    console.error("Error bulk creating recipe ingredients:", error);
    return { success: false, error: "Failed to bulk create recipe ingredients" };
  }
}

export async function createOrRestoreRecipeIngredient(data: CreateRecipeIngredientData) {
  try {
    // First, check if a soft-deleted recipe ingredient exists
    const existingDeleted = await db.recipeIngredient.findFirst({
      where: {
        recipe_id: data.recipe_id,
        ingredient_id: data.ingredient_id,
        destroyed_at: {
          not: null,
        },
      },
    });

    let recipeIngredient;

    if (existingDeleted) {
      // Restore the soft-deleted ingredient with updated data
      recipeIngredient = await db.recipeIngredient.update({
        where: {
          id: existingDeleted.id,
        },
        data: {
          quantity: data.quantity,
          unit: data.unit,
          notes: data.notes,
          destroyed_at: null,
          updated_at: new Date(),
        },
        include: {
          recipe: true,
          ingredient: true,
        },
      });
    } else {
      // Create a new recipe ingredient
      recipeIngredient = await db.recipeIngredient.create({
        data,
        include: {
          recipe: true,
          ingredient: true,
        },
      });
    }

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${data.recipe_id}`);
    return { success: true, recipeIngredient };
  } catch (error) {
    console.error("Error creating or restoring recipe ingredient:", error);
    return { success: false, error: "Failed to create or restore recipe ingredient" };
  }
}

export async function bulkUpdateRecipeIngredients(
  recipeId: number,
  ingredients: Array<{
    ingredient_id: number;
    quantity?: number;
    unit?: string;
    notes?: string;
  }>
) {
  try {
    const recipeIngredients = await db.$transaction(async (tx) => {
      // Soft delete existing recipe ingredients
      await tx.recipeIngredient.updateMany({
        where: {
          recipe_id: recipeId,
          destroyed_at: null,
        },
        data: {
          destroyed_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Create new recipe ingredients
      const newRecipeIngredients = await Promise.all(
        ingredients.map(ingredient =>
          tx.recipeIngredient.create({
            data: {
              recipe_id: recipeId,
              ...ingredient,
            },
            include: {
              recipe: true,
              ingredient: true,
            },
          })
        )
      );

      return newRecipeIngredients;
    });

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${recipeId}`);
    return { success: true, recipeIngredients };
  } catch (error) {
    console.error("Error bulk updating recipe ingredients:", error);
    return { success: false, error: "Failed to bulk update recipe ingredients" };
  }
}