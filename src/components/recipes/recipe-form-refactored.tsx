"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBulkCreateRecipeIngredients } from "@/hooks/recipe-ingredient/use-bulk-create-recipe-ingredients";
import { useCreateOrRestoreRecipeIngredient } from "@/hooks/recipe-ingredient/use-create-or-restore-recipe-ingredient";
import { useDeleteRecipeIngredient } from "@/hooks/recipe-ingredient/use-delete-recipe-ingredient";
import { useBulkCreateRecipeTags } from "@/hooks/recipe-tag/use-bulk-create-recipe-tags";
import { useCreateOrRestoreRecipeTag } from "@/hooks/recipe-tag/use-create-or-restore-recipe-tag";
import { useRemoveRecipeTagByIds } from "@/hooks/recipe-tag/use-remove-recipe-tag-by-ids";
import { useCreateRecipe } from "@/hooks/recipe/use-create-recipe";
import { useGetRecipe } from "@/hooks/recipe/use-get-recipe";
import { useUpdateRecipe } from "@/hooks/recipe/use-update-recipe";
import { useCreateStep } from "@/hooks/step/use-create-step";
import { useDeleteStep } from "@/hooks/step/use-delete-step";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Import atomic components
import { CuisineTypeSelect } from "./cuisine-type-select";
import { ImageSelect } from "./image-select";
import { IngredientsManager } from "./ingredients-manager";
import { StepsManager } from "./steps-manager";
import { TagsSelector } from "./tags-selector";
import { UserSelect } from "./user-select";

const recipeFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(200, "Name must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  prep_time: z
    .string()
    .regex(/^(\d{1,2}):(\d{2})$/, "Prep time must be in HH:MM format")
    .optional()
    .or(z.literal("")),
  cook_time: z
    .string()
    .regex(/^(\d{1,2}):(\d{2})$/, "Cook time must be in HH:MM format")
    .optional()
    .or(z.literal("")),
  url: z
    .string()
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      "Please enter a valid URL"
    )
    .optional()
    .or(z.literal("")),
  user_id: z.string().min(1, "User is required"),
  image_id: z.string().optional(),
  source_image_id: z.string().optional(),
  cuisine_type_id: z.string().optional(),
});

type RecipeFormData = z.infer<typeof recipeFormSchema>;

// Types for the atomic components
type RecipeStep = {
  id?: string;
  name: string;
  description: string;
  order: number;
  isEditing?: boolean;
  isSaving?: boolean;
};

type RecipeIngredient = {
  id?: string;
  ingredient_id: string;
  quantity?: string;
  unit?: string;
  notes?: string;
  isEditing?: boolean;
  isSaving?: boolean;
};

type RecipeFormProps = {
  mode: "create" | "edit";
  recipeId?: number;
  onSuccess?: () => void;
};

export function RecipeForm({ mode, recipeId, onSuccess }: RecipeFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      name: "",
      description: "",
      prep_time: "",
      cook_time: "",
      url: "",
      user_id: "",
      image_id: "",
      source_image_id: "",
      cuisine_type_id: "",
    },
  });

  // Hooks for data fetching and mutations
  const { data: recipeData } = useGetRecipe(recipeId!, {
    enabled: mode === "edit" && !!recipeId,
  });

  const createStepMutation = useCreateStep();
  const deleteStepMutation = useDeleteStep();
  const createOrRestoreRecipeIngredientMutation = useCreateOrRestoreRecipeIngredient();
  const deleteRecipeIngredientMutation = useDeleteRecipeIngredient();
  const createOrRestoreRecipeTagMutation = useCreateOrRestoreRecipeTag();
  const removeRecipeTagMutation = useRemoveRecipeTagByIds();
  const bulkCreateRecipeTagsMutation = useBulkCreateRecipeTags();
  const bulkCreateRecipeIngredientsMutation = useBulkCreateRecipeIngredients();

  const createRecipeMutation = useCreateRecipe({
    onSuccess: async (result) => {
      if (result.success && result.recipe) {
        try {
          // Create steps
          for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            await createStepMutation.mutateAsync({
              name: step.name,
              description: step.description,
              order: i + 1,
              recipe_id: result.recipe.id,
            });
          }

          // Create recipe tags
          if (selectedTags.length > 0) {
            await bulkCreateRecipeTagsMutation.mutateAsync({
              recipeId: result.recipe.id,
              tagIds: selectedTags.map((id) => parseInt(id)),
            });
          }

          // Create recipe ingredients
          if (ingredients.length > 0) {
            await bulkCreateRecipeIngredientsMutation.mutateAsync({
              recipeId: result.recipe.id,
              ingredients: ingredients.map((ing) => ({
                ingredient_id: parseInt(ing.ingredient_id),
                quantity: ing.quantity ? parseFloat(ing.quantity) : undefined,
                unit: ing.unit || undefined,
                notes: ing.notes || undefined,
              })),
            });
          }

          toast.success("Recipe created successfully", {
            description: `${result.recipe.name} has been created with all components.`,
          });
          form.reset();
          setSelectedTags([]);
          setSteps([]);
          setIngredients([]);
          onSuccess?.();
        } catch {
          toast.error("Error creating recipe components", {
            description:
              "Recipe was created but some components failed to save.",
          });
        }
      } else {
        toast.error("Failed to create recipe", {
          description: result.error || "An unexpected error occurred.",
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Error creating recipe", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });

  const updateRecipeMutation = useUpdateRecipe({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Recipe updated successfully", {
          description: `${result.recipe?.name} has been updated.`,
        });
        onSuccess?.();
      } else {
        toast.error("Failed to update recipe", {
          description: result.error || "An unexpected error occurred.",
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Error updating recipe", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });

  // Load existing recipe data for edit mode
  useEffect(() => {
    if (mode === "edit" && recipeData?.recipe) {
      const recipe = recipeData.recipe;
      // Set form values individually to ensure they stick
      form.setValue("name", recipe.name);
      form.setValue("description", recipe.description);
      form.setValue("prep_time", recipe.prep_time || "");
      form.setValue("cook_time", recipe.cook_time || "");
      form.setValue("url", recipe.url || "");
      form.setValue("user_id", recipe.user_id.toString());
      form.setValue("image_id", recipe.image_id?.toString() || "");
      form.setValue(
        "source_image_id",
        recipe.source_image_id?.toString() || ""
      );
      form.setValue(
        "cuisine_type_id",
        recipe.cuisine_type_id?.toString() || ""
      );

      // Load existing steps (read-only for display, new steps can be added)
      const existingSteps =
        recipe.steps?.map((step, index) => ({
          id: `existing_${step.id}`,
          name: step.name,
          description: step.description,
          order: index + 1,
          isEditing: false,
        })) || [];
      setSteps(existingSteps);

      // Load existing ingredients (read-only for display, new ingredients can be added)
      const existingIngredients =
        recipe.recipe_ingredients?.map((ri) => ({
          id: `existing_${ri.id}`,
          ingredient_id: ri.ingredient_id.toString(),
          quantity: ri.quantity?.toString() || "",
          unit: ri.unit || "",
          notes: ri.notes || "",
          isEditing: false,
        })) || [];
      setIngredients(existingIngredients);

      // Load existing tags
      const currentTags =
        recipe.recipe_tags?.map((rt) => rt.tag_id.toString()) || [];
      setSelectedTags(currentTags);
    }
  }, [recipeData, form, mode]);

  const onSubmit = (data: RecipeFormData) => {
    const formData = {
      name: data.name,
      description: data.description,
      prep_time: data.prep_time || undefined,
      cook_time: data.cook_time || undefined,
      url: data.url || undefined,
      user_id: parseInt(data.user_id),
      image_id: data.image_id ? parseInt(data.image_id) : undefined,
      source_image_id: data.source_image_id
        ? parseInt(data.source_image_id)
        : undefined,
      cuisine_type_id: data.cuisine_type_id
        ? parseInt(data.cuisine_type_id)
        : undefined,
    };

    if (mode === "create") {
      createRecipeMutation.mutate(formData);
    } else if (mode === "edit" && recipeId) {
      updateRecipeMutation.mutate({ id: recipeId, data: formData });
    }
  };

  const handleSaveStep = async (step: RecipeStep) => {
    if (!recipeId) return { success: false, error: "Recipe ID not found" };

    const result = await createStepMutation.mutateAsync({
      name: step.name,
      description: step.description,
      order: step.order,
      recipe_id: recipeId,
    });

    return {
      success: result.success,
      error: result.error,
    };
  };

  const handleSaveIngredient = async (ingredient: RecipeIngredient) => {
    if (!recipeId) return { success: false, error: "Recipe ID not found" };
    
    if (!ingredient.ingredient_id || ingredient.ingredient_id.trim() === "") {
      return { success: false, error: "Please select an ingredient" };
    }

    const ingredientId = parseInt(ingredient.ingredient_id);
    if (isNaN(ingredientId)) {
      return { success: false, error: "Invalid ingredient selected" };
    }

    // The createOrRestoreRecipeIngredient action will handle both new ingredients
    // and restoring soft-deleted ones, so no need to check for duplicates here

    const result = await createOrRestoreRecipeIngredientMutation.mutateAsync({
      recipe_id: recipeId,
      ingredient_id: ingredientId,
      quantity: ingredient.quantity
        ? parseFloat(ingredient.quantity)
        : undefined,
      unit: ingredient.unit || undefined,
      notes: ingredient.notes || undefined,
    });

    return {
      success: result.success,
      error: result.error,
    };
  };

  const handleDeleteIngredient = async (ingredientId: string) => {
    const result = await deleteRecipeIngredientMutation.mutateAsync(parseInt(ingredientId));
    
    return {
      success: result.success,
      error: result.error,
    };
  };

  const handleDeleteStep = async (stepId: string) => {
    const result = await deleteStepMutation.mutateAsync(parseInt(stepId));
    
    return {
      success: result.success,
      error: result.error,
    };
  };

  const handleAddRecipeTag = async (tagId: string) => {
    if (!recipeId) return { success: false, error: "Recipe ID not found" };
    
    const result = await createOrRestoreRecipeTagMutation.mutateAsync({
      recipe_id: recipeId,
      tag_id: parseInt(tagId),
    });
    
    return {
      success: result.success,
      error: result.error,
    };
  };

  const handleRemoveRecipeTag = async (tagId: string) => {
    if (!recipeId) return { success: false, error: "Recipe ID not found" };
    
    const result = await removeRecipeTagMutation.mutateAsync({
      recipeId: recipeId,
      tagId: parseInt(tagId),
    });
    
    return {
      success: result.success,
      error: result.error,
    };
  };

  const isPending =
    createRecipeMutation.isPending ||
    updateRecipeMutation.isPending ||
    createStepMutation.isPending ||
    deleteStepMutation.isPending ||
    createOrRestoreRecipeTagMutation.isPending ||
    removeRecipeTagMutation.isPending ||
    bulkCreateRecipeTagsMutation.isPending ||
    bulkCreateRecipeIngredientsMutation.isPending ||
    createOrRestoreRecipeIngredientMutation.isPending ||
    deleteRecipeIngredientMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Recipe Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter recipe name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter recipe description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prep_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prep Time (HH:MM)</FormLabel>
                    <FormControl>
                      <Input placeholder="00:30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cook_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cook Time (HH:MM)</FormLabel>
                    <FormControl>
                      <Input placeholder="01:00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/recipe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <FormControl>
                    <UserSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cuisine_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuisine Type</FormLabel>
                  <FormControl>
                    <CuisineTypeSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe Image</FormLabel>
                  <FormControl>
                    <ImageSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                      placeholder="Select recipe image"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <TagsSelector
              selectedTagIds={selectedTags}
              onTagsChange={setSelectedTags}
              mode={mode}
              recipeId={recipeId}
              onAddRecipeTag={handleAddRecipeTag}
              onRemoveRecipeTag={handleRemoveRecipeTag}
              disabled={isPending}
            />
          </CardContent>
        </Card>

        {/* Steps */}
        <StepsManager
          steps={steps}
          onStepsChange={setSteps}
          mode={mode}
          recipeId={recipeId}
          onSaveStep={handleSaveStep}
          onDeleteStep={handleDeleteStep}
          disabled={isPending}
        />

        {/* Ingredients */}
        <IngredientsManager
          ingredients={ingredients}
          onIngredientsChange={setIngredients}
          mode={mode}
          recipeId={recipeId}
          onSaveIngredient={handleSaveIngredient}
          onDeleteIngredient={handleDeleteIngredient}
          disabled={isPending}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending
            ? mode === "create"
              ? "Creating Recipe..."
              : "Updating Recipe..."
            : mode === "create"
            ? "Create Recipe"
            : "Update Recipe"}
        </Button>
      </form>
    </Form>
  );
}
