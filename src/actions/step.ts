"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type CreateStepData = {
  name: string;
  description: string;
  order: number;
  recipe_id: number;
};

export type UpdateStepData = {
  name?: string;
  description?: string;
  order?: number;
};

export async function createStep(data: CreateStepData) {
  try {
    const step = await db.step.create({
      data,
      include: {
        recipe: true,
      },
    });

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${data.recipe_id}`);
    return { success: true, step };
  } catch (error) {
    console.error("Error creating step:", error);
    return { success: false, error: "Failed to create step" };
  }
}

export async function getStepById(id: number) {
  try {
    const step = await db.step.findUnique({
      where: {
        id,
        destroyed_at: null,
      },
      include: {
        recipe: true,
      },
    });

    if (!step) {
      return { success: false, error: "Step not found" };
    }

    return { success: true, step };
  } catch (error) {
    console.error("Error getting step:", error);
    return { success: false, error: "Failed to get step" };
  }
}

export async function updateStep(id: number, data: UpdateStepData) {
  try {
    const step = await db.step.update({
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
      },
    });

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${step.recipe_id}`);
    return { success: true, step };
  } catch (error) {
    console.error("Error updating step:", error);
    return { success: false, error: "Failed to update step" };
  }
}

export async function deleteStep(id: number) {
  try {
    const step = await db.step.update({
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
      },
    });

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${step.recipe_id}`);
    return { success: true, step };
  } catch (error) {
    console.error("Error deleting step:", error);
    return { success: false, error: "Failed to delete step" };
  }
}

export async function getStepsByRecipeId(recipeId: number) {
  try {
    const steps = await db.step.findMany({
      where: {
        recipe_id: recipeId,
        destroyed_at: null,
      },
      include: {
        recipe: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    return { success: true, steps };
  } catch (error) {
    console.error("Error getting steps by recipe:", error);
    return { success: false, error: "Failed to get steps by recipe" };
  }
}

export async function restoreStep(id: number) {
  try {
    const step = await db.step.update({
      where: {
        id,
      },
      data: {
        destroyed_at: null,
        updated_at: new Date(),
      },
      include: {
        recipe: true,
      },
    });

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${step.recipe_id}`);
    return { success: true, step };
  } catch (error) {
    console.error("Error restoring step:", error);
    return { success: false, error: "Failed to restore step" };
  }
}

export async function reorderSteps(recipeId: number, stepOrders: { id: number; order: number }[]) {
  try {
    await db.$transaction(
      stepOrders.map(({ id, order }) =>
        db.step.update({
          where: {
            id,
            recipe_id: recipeId,
            destroyed_at: null,
          },
          data: {
            order,
            updated_at: new Date(),
          },
        })
      )
    );

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${recipeId}`);
    return { success: true };
  } catch (error) {
    console.error("Error reordering steps:", error);
    return { success: false, error: "Failed to reorder steps" };
  }
}

export async function bulkUpdateSteps(
  recipeId: number,
  steps: Array<{
    name: string;
    description: string;
    order: number;
  }>
) {
  try {
    const newSteps = await db.$transaction(async (tx) => {
      // Soft delete existing steps
      await tx.step.updateMany({
        where: {
          recipe_id: recipeId,
          destroyed_at: null,
        },
        data: {
          destroyed_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Create new steps
      const createdSteps = await Promise.all(
        steps.map(step =>
          tx.step.create({
            data: {
              recipe_id: recipeId,
              ...step,
            },
            include: {
              recipe: true,
            },
          })
        )
      );

      return createdSteps;
    });

    revalidatePath("/recipes");
    revalidatePath("/admin/recipe");
    revalidatePath(`/recipes/${recipeId}`);
    return { success: true, steps: newSteps };
  } catch (error) {
    console.error("Error bulk updating steps:", error);
    return { success: false, error: "Failed to bulk update steps" };
  }
}