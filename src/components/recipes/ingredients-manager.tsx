"use client";

import { Plus, Save, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IngredientSelect } from "./ingredient-select";
import { toast } from "sonner";

type RecipeIngredient = {
  id?: string; // Temp ID for unsaved items
  ingredient_id: string;
  quantity?: string;
  unit?: string;
  notes?: string;
  isEditing?: boolean;
  isSaving?: boolean;
};

type IngredientsManagerProps = {
  ingredients: RecipeIngredient[];
  onIngredientsChange: (ingredients: RecipeIngredient[]) => void;
  mode: "create" | "edit";
  recipeId?: number;
  onSaveIngredient?: (ingredient: RecipeIngredient) => Promise<{ success: boolean; error?: string }>;
  onDeleteIngredient?: (ingredientId: string) => Promise<{ success: boolean; error?: string }>;
  disabled?: boolean;
};

export function IngredientsManager({
  ingredients,
  onIngredientsChange,
  mode,
  recipeId,
  onSaveIngredient,
  onDeleteIngredient,
  disabled,
}: IngredientsManagerProps) {

  const generateTempId = () => `temp_${Date.now()}_${Math.random()}`;

  const addIngredient = () => {
    const newIngredient: RecipeIngredient = {
      id: generateTempId(),
      ingredient_id: "",
      quantity: "",
      unit: "",
      notes: "",
      isEditing: true,
    };
    
    onIngredientsChange([...ingredients, newIngredient]);
  };

  const updateIngredient = (index: number, updates: Partial<RecipeIngredient>) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], ...updates };
    onIngredientsChange(updated);
  };

  const removeIngredient = async (index: number) => {
    const ingredient = ingredients[index];
    
    // If it's an existing ingredient (from database), delete it from database
    if (mode === "edit" && ingredient.id?.startsWith("existing_") && onDeleteIngredient) {
      const dbId = ingredient.id.replace("existing_", "");
      const result = await onDeleteIngredient(dbId);
      
      if (!result.success) {
        toast.error("Failed to delete ingredient", {
          description: result.error,
        });
        return;
      }
      
      toast.success("Ingredient deleted successfully");
    }
    
    // Remove from local state
    const updated = ingredients.filter((_, i) => i !== index);
    onIngredientsChange(updated);
  };

  const startEditing = (index: number) => {
    const ingredient = ingredients[index];
    if (ingredient.id) {
      updateIngredient(index, { isEditing: true });
    }
  };

  const cancelEditing = (index: number) => {
    const ingredient = ingredients[index];
    
    // If it's a new ingredient (temp ID), remove it
    if (ingredient.id?.startsWith("temp_")) {
      removeIngredient(index);
    } else {
      updateIngredient(index, { isEditing: false });
    }
  };

  const saveIngredient = async (index: number) => {
    const ingredient = ingredients[index];
    
    if (!ingredient.ingredient_id) {
      toast.error("Please select an ingredient");
      return;
    }

    if (mode === "edit" && recipeId && onSaveIngredient) {
      updateIngredient(index, { isSaving: true });
      
      const result = await onSaveIngredient(ingredient);
      
      updateIngredient(index, { isSaving: false });
      
      if (result.success) {
        // Remove from local state since it's now saved in the database
        removeIngredient(index);
        toast.success("Ingredient saved successfully");
      } else {
        toast.error("Failed to save ingredient", {
          description: result.error,
        });
      }
    } else {
      // For create mode, just mark as not editing
      updateIngredient(index, { isEditing: false });
    }
  };

  const isValid = (ingredient: RecipeIngredient) => {
    return ingredient.ingredient_id.length > 0;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recipe Ingredients</CardTitle>
        <Button 
          type="button" 
          onClick={addIngredient} 
          size="sm" 
          disabled={disabled}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Ingredient
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {ingredients.map((ingredient, index) => (
          <div key={ingredient.id || index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Ingredient {index + 1}</h4>
              <div className="flex gap-2">
                {ingredient.isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={() => saveIngredient(index)}
                      disabled={ingredient.isSaving || !isValid(ingredient) || disabled}
                    >
                      {ingredient.isSaving ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          {mode === "edit" ? "Save" : "Done"}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => cancelEditing(index)}
                      disabled={ingredient.isSaving || disabled}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    {mode === "edit" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(index)}
                        disabled={disabled}
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                      disabled={disabled}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {ingredient.isEditing ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">Ingredient</label>
                  <IngredientSelect
                    value={ingredient.ingredient_id}
                    onValueChange={(value) => updateIngredient(index, { ingredient_id: value })}
                    disabled={ingredient.isSaving || disabled}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Quantity</label>
                  <Input
                    placeholder="2"
                    value={ingredient.quantity || ""}
                    onChange={(e) => updateIngredient(index, { quantity: e.target.value })}
                    disabled={ingredient.isSaving || disabled}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Unit</label>
                  <Input
                    placeholder="cups"
                    value={ingredient.unit || ""}
                    onChange={(e) => updateIngredient(index, { unit: e.target.value })}
                    disabled={ingredient.isSaving || disabled}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">Notes (optional)</label>
                  <Input
                    placeholder="diced, room temperature, etc."
                    value={ingredient.notes || ""}
                    onChange={(e) => updateIngredient(index, { notes: e.target.value })}
                    disabled={ingredient.isSaving || disabled}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Ingredient:</span> {ingredient.ingredient_id || "Not selected"}</div>
                {ingredient.quantity && <div><span className="font-medium">Quantity:</span> {ingredient.quantity}</div>}
                {ingredient.unit && <div><span className="font-medium">Unit:</span> {ingredient.unit}</div>}
                {ingredient.notes && <div><span className="font-medium">Notes:</span> {ingredient.notes}</div>}
              </div>
            )}
          </div>
        ))}

        {ingredients.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No ingredients added yet. Click &quot;Add Ingredient&quot; to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}