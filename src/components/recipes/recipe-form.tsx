"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCreateRecipe } from "@/hooks/recipe/use-create-recipe";
import { useGetRecipe } from "@/hooks/recipe/use-get-recipe";
import { useUpdateRecipe } from "@/hooks/recipe/use-update-recipe";
import { useGetAllUsers } from "@/hooks/user/use-get-all-users";
import { useGetAllImages } from "@/hooks/image/use-get-all-images";
import { useGetAllCuisineTypes } from "@/hooks/cuisine-type/use-get-all-cuisine-types";
import { useGetAllTags } from "@/hooks/tag/use-get-all-tags";
import { useGetAllIngredients } from "@/hooks/ingredient/use-get-all-ingredients";
import { useBulkCreateRecipeTags } from "@/hooks/recipe-tag/use-bulk-create-recipe-tags";
import { useCreateRecipeTag } from "@/hooks/recipe-tag/use-create-recipe-tag";
import { useRemoveRecipeTagByIds } from "@/hooks/recipe-tag/use-remove-recipe-tag-by-ids";
import { useBulkCreateRecipeIngredients } from "@/hooks/recipe-ingredient/use-bulk-create-recipe-ingredients";
import { useCreateRecipeIngredient } from "@/hooks/recipe-ingredient/use-create-recipe-ingredient";
import { useCreateStep } from "@/hooks/step/use-create-step";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Save, Trash2 } from "lucide-react";

const stepSchema = z.object({
  name: z.string().min(1, "Step name is required"),
  description: z.string().min(1, "Step description is required"),
  order: z.number(),
});

const recipeIngredientSchema = z.object({
  ingredient_id: z.string().min(1, "Ingredient is required"),
  quantity: z.string().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
});

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
    .refine((val) => !val || /^https?:\/\/.+/.test(val), "Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  user_id: z.string().min(1, "User is required"),
  image_id: z.string().optional(),
  source_image_id: z.string().optional(),
  cuisine_type_id: z.string().optional(),
  steps: z.array(stepSchema).optional(),
  recipe_ingredients: z.array(recipeIngredientSchema).optional(),
  tag_ids: z.array(z.string()).optional(),
});

type RecipeFormData = z.infer<typeof recipeFormSchema>;

type RecipeFormProps = {
  mode: "create" | "edit";
  recipeId?: number;
  onSuccess?: () => void;
};

export function RecipeForm({ mode, recipeId, onSuccess }: RecipeFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [originalTags, setOriginalTags] = useState<string[]>([]);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<RecipeFormData | null>(null);
  
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
      steps: [],
      recipe_ingredients: [],
      tag_ids: [],
    },
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control: form.control,
    name: "steps",
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: form.control,
    name: "recipe_ingredients",
  });

  const { data: recipeData } = useGetRecipe(recipeId!, {
    enabled: mode === "edit" && !!recipeId,
  });

  const { data: usersData } = useGetAllUsers();
  const { data: imagesData } = useGetAllImages();
  const { data: cuisineTypesData } = useGetAllCuisineTypes();
  const { data: tagsData } = useGetAllTags();
  const { data: ingredientsData } = useGetAllIngredients();

  const createStepMutation = useCreateStep();
  const createRecipeIngredientMutation = useCreateRecipeIngredient();
  const createRecipeTagMutation = useCreateRecipeTag();
  const removeRecipeTagMutation = useRemoveRecipeTagByIds();
  const bulkCreateRecipeTagsMutation = useBulkCreateRecipeTags();
  const bulkCreateRecipeIngredientsMutation = useBulkCreateRecipeIngredients();

  const createRecipeMutation = useCreateRecipe({
    onSuccess: async (result) => {
      if (result.success && result.recipe) {
        try {
          // Create steps
          const steps = form.getValues("steps") || [];
          for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            await createStepMutation.mutateAsync({
              ...step,
              order: i + 1,
              recipe_id: result.recipe.id,
            });
          }

          // Create recipe tags
          if (selectedTags.length > 0) {
            await bulkCreateRecipeTagsMutation.mutateAsync({
              recipeId: result.recipe.id,
              tagIds: selectedTags.map(id => parseInt(id)),
            });
          }

          // Create recipe ingredients
          const ingredients = form.getValues("recipe_ingredients") || [];
          if (ingredients.length > 0) {
            await bulkCreateRecipeIngredientsMutation.mutateAsync({
              recipeId: result.recipe.id,
              ingredients: ingredients.map(ing => ({
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
          onSuccess?.();
        } catch {
          toast.error("Error creating recipe components", {
            description: "Recipe was created but some components failed to save.",
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

  useEffect(() => {
    if (mode === "edit" && recipeData?.recipe && usersData?.users) {
      const recipe = recipeData.recipe;
      form.reset({
        name: recipe.name,
        description: recipe.description,
        prep_time: recipe.prep_time || "",
        cook_time: recipe.cook_time || "",
        url: recipe.url || "",
        user_id: recipe.user_id.toString(),
        image_id: recipe.image_id?.toString() || "",
        source_image_id: recipe.source_image_id?.toString() || "",
        cuisine_type_id: recipe.cuisine_type_id?.toString() || "",
        steps: recipe.steps?.map((step, index) => ({
          name: step.name,
          description: step.description,
          order: index + 1,
        })) || [],
        recipe_ingredients: recipe.recipe_ingredients?.map(ri => ({
          ingredient_id: ri.ingredient_id.toString(),
          quantity: ri.quantity?.toString() || "",
          unit: ri.unit || "",
          notes: ri.notes || "",
        })) || [],
      });
      const currentTags = recipe.recipe_tags?.map(rt => rt.tag_id.toString()) || [];
      setSelectedTags(currentTags);
      setOriginalTags(currentTags);
    }
  }, [recipeData, form, mode, usersData]);

  const hasUnsavedStepsOrIngredients = (data: RecipeFormData) => {
    const hasSteps = (data.steps && data.steps.length > 0) || false;
    const hasIngredients = (data.recipe_ingredients && data.recipe_ingredients.length > 0) || false;
    return hasSteps || hasIngredients;
  };

  const handleFormSubmit = (data: RecipeFormData) => {
    const formData = {
      name: data.name,
      description: data.description,
      prep_time: data.prep_time || undefined,
      cook_time: data.cook_time || undefined,
      url: data.url || undefined,
      user_id: parseInt(data.user_id),
      image_id: data.image_id ? parseInt(data.image_id) : undefined,
      source_image_id: data.source_image_id ? parseInt(data.source_image_id) : undefined,
      cuisine_type_id: data.cuisine_type_id ? parseInt(data.cuisine_type_id) : undefined,
    };

    if (mode === "create") {
      createRecipeMutation.mutate(formData);
    } else if (mode === "edit" && recipeId) {
      updateRecipeMutation.mutate({ id: recipeId, data: formData });
    }
  };

  const onSubmit = (data: RecipeFormData) => {
    if (mode === "edit" && hasUnsavedStepsOrIngredients(data)) {
      setPendingSubmitData(data);
      setShowUnsavedWarning(true);
    } else {
      handleFormSubmit(data);
    }
  };

  const handleConfirmSubmit = () => {
    if (pendingSubmitData) {
      handleFormSubmit(pendingSubmitData);
      setPendingSubmitData(null);
    }
    setShowUnsavedWarning(false);
  };

  const handleCancelSubmit = () => {
    setPendingSubmitData(null);
    setShowUnsavedWarning(false);
  };

  const isPending = createRecipeMutation.isPending || updateRecipeMutation.isPending || 
                    createStepMutation.isPending || bulkCreateRecipeTagsMutation.isPending || 
                    bulkCreateRecipeIngredientsMutation.isPending || createRecipeTagMutation.isPending ||
                    removeRecipeTagMutation.isPending;

  const addStep = () => {
    appendStep({
      name: "",
      description: "",
      order: stepFields.length + 1,
    });
  };

  const saveStep = async (index: number) => {
    if (!recipeId) return;
    
    const step = form.getValues(`steps.${index}`);
    if (!step.name || !step.description) {
      toast.error("Please fill in both step name and description");
      return;
    }

    try {
      const result = await createStepMutation.mutateAsync({
        name: step.name,
        description: step.description,
        order: step.order,
        recipe_id: recipeId,
      });

      if (result.success) {
        toast.success("Step saved successfully");
        // Remove this step from the form since it's now saved
        removeStep(index);
      } else {
        toast.error("Failed to save step", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Error saving step", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  };

  const addIngredient = () => {
    appendIngredient({
      ingredient_id: "",
      quantity: "",
      unit: "",
      notes: "",
    });
  };

  const saveIngredient = async (index: number) => {
    if (!recipeId) return;
    
    const ingredient = form.getValues(`recipe_ingredients.${index}`);
    if (!ingredient.ingredient_id) {
      toast.error("Please select an ingredient");
      return;
    }

    try {
      const result = await createRecipeIngredientMutation.mutateAsync({
        recipe_id: recipeId,
        ingredient_id: parseInt(ingredient.ingredient_id),
        quantity: ingredient.quantity ? parseFloat(ingredient.quantity) : undefined,
        unit: ingredient.unit || undefined,
        notes: ingredient.notes || undefined,
      });

      if (result.success) {
        toast.success("Ingredient saved successfully");
        // Remove this ingredient from the form since it's now saved
        removeIngredient(index);
      } else {
        toast.error("Failed to save ingredient", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Error saving ingredient", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const hasTagChanges = () => {
    const current = [...selectedTags].sort();
    const original = [...originalTags].sort();
    return JSON.stringify(current) !== JSON.stringify(original);
  };

  const saveTags = async () => {
    if (!recipeId || !hasTagChanges()) {
      if (!hasTagChanges()) {
        toast.info("No tag changes to save");
      }
      return;
    }

    try {
      // Find tags to add and remove
      const tagsToAdd = selectedTags.filter(tag => !originalTags.includes(tag));
      const tagsToRemove = originalTags.filter(tag => !selectedTags.includes(tag));

      // Remove tags first
      for (const tagId of tagsToRemove) {
        await removeRecipeTagMutation.mutateAsync({
          recipeId,
          tagId: parseInt(tagId),
        });
      }

      // Add new tags
      for (const tagId of tagsToAdd) {
        await createRecipeTagMutation.mutateAsync({
          recipe_id: recipeId,
          tag_id: parseInt(tagId),
        });
      }

      // Update original tags to current selection
      setOriginalTags([...selectedTags]);
      toast.success("Tags saved successfully");
    } catch (error) {
      toast.error("Error saving tags", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  };

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
                    <Input placeholder="https://example.com/recipe" {...field} />
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {usersData?.users && usersData.users.length > 0 ? (
                        usersData.users.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.first_name} {user.last_name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          No users available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cuisine_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuisine Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cuisine type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cuisineTypesData?.cuisineTypes && cuisineTypesData.cuisineTypes.length > 0 ? (
                          cuisineTypesData.cuisineTypes.map((cuisineType) => (
                            <SelectItem key={cuisineType.id} value={cuisineType.id.toString()}>
                              {cuisineType.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No cuisine types available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recipe image" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {imagesData?.images && imagesData.images.length > 0 ? (
                          imagesData.images.map((image) => (
                            <SelectItem key={image.id} value={image.id.toString()}>
                              {image.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No images available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tags</CardTitle>
            {mode === "edit" && hasTagChanges() && (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={saveTags}
                disabled={createRecipeTagMutation.isPending || removeRecipeTagMutation.isPending}
              >
                <Save className="w-4 h-4 mr-1" />
                Save Changes
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {tagsData?.tags?.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id.toString()) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag.id.toString())}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Selected: {selectedTags.length} tags
                  {mode === "edit" && hasTagChanges() && (
                    <span className="text-yellow-600 ml-2">(unsaved changes)</span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recipe Steps</CardTitle>
            <Button type="button" onClick={addStep} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {stepFields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Step {index + 1}</h4>
                  <div className="flex gap-2">
                    {mode === "edit" && (
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => saveStep(index)}
                        disabled={createStepMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeStep(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <FormField
                    control={form.control}
                    name={`steps.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Step Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Prepare ingredients" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`steps.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed instructions for this step..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            {stepFields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No steps added yet. Click &quot;Add Step&quot; to get started.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recipe Ingredients</CardTitle>
            <Button type="button" onClick={addIngredient} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Ingredient
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {ingredientFields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Ingredient {index + 1}</h4>
                  <div className="flex gap-2">
                    {mode === "edit" && (
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => saveIngredient(index)}
                        disabled={createRecipeIngredientMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name={`recipe_ingredients.${index}.ingredient_id`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Ingredient</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select ingredient" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ingredientsData?.ingredients && ingredientsData.ingredients.length > 0 ? (
                              ingredientsData.ingredients.map((ingredient) => (
                                <SelectItem key={ingredient.id} value={ingredient.id.toString()}>
                                  {ingredient.name}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                No ingredients available
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`recipe_ingredients.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input placeholder="2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`recipe_ingredients.${index}.unit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Input placeholder="cups" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`recipe_ingredients.${index}.notes`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Notes (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="diced, room temperature, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            {ingredientFields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No ingredients added yet. Click &quot;Add Ingredient&quot; to get started.
              </div>
            )}
          </CardContent>
        </Card>

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

      {/* Unsaved Changes Warning Dialog */}
      <AlertDialog open={showUnsavedWarning} onOpenChange={setShowUnsavedWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Steps or Ingredients</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved steps or ingredients in this form. These will not be saved when you update the recipe. 
              Do you want to continue with saving just the basic recipe information, or cancel to review your changes?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelSubmit}>
              Cancel - Review Changes
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Continue - Save Basic Info Only
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  );
}