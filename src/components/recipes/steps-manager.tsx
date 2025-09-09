"use client";

import { Plus, Save, Trash2, Check, X, MoveUp, MoveDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type RecipeStep = {
  id?: string; // Temp ID for unsaved items
  name: string;
  description: string;
  order: number;
  isEditing?: boolean;
  isSaving?: boolean;
};

type StepsManagerProps = {
  steps: RecipeStep[];
  onStepsChange: (steps: RecipeStep[]) => void;
  mode: "create" | "edit";
  recipeId?: number;
  onSaveStep?: (step: RecipeStep) => Promise<{ success: boolean; error?: string }>;
  onDeleteStep?: (stepId: string) => Promise<{ success: boolean; error?: string }>;
  disabled?: boolean;
};

export function StepsManager({
  steps,
  onStepsChange,
  mode,
  recipeId,
  onSaveStep,
  onDeleteStep,
  disabled,
}: StepsManagerProps) {

  const generateTempId = () => `temp_${Date.now()}_${Math.random()}`;

  const reorderSteps = (steps: RecipeStep[]) => {
    return steps.map((step, index) => ({ ...step, order: index + 1 }));
  };

  const addStep = () => {
    const newStep: RecipeStep = {
      id: generateTempId(),
      name: "",
      description: "",
      order: steps.length + 1,
      isEditing: true,
    };
    
    onStepsChange([...steps, newStep]);
  };

  const updateStep = (index: number, updates: Partial<RecipeStep>) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], ...updates };
    onStepsChange(updated);
  };

  const removeStep = async (index: number) => {
    const step = steps[index];
    
    // If it's an existing step (from database), delete it from database
    if (mode === "edit" && step.id?.startsWith("existing_") && onDeleteStep) {
      const dbId = step.id.replace("existing_", "");
      const result = await onDeleteStep(dbId);
      
      if (!result.success) {
        toast.error("Failed to delete step", {
          description: result.error,
        });
        return;
      }
      
      toast.success("Step deleted successfully");
    }
    
    // Remove from local state
    const updated = steps.filter((_, i) => i !== index);
    const reordered = reorderSteps(updated);
    onStepsChange(reordered);
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === steps.length - 1)
    ) {
      return;
    }

    const updated = [...steps];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    
    const reordered = reorderSteps(updated);
    onStepsChange(reordered);
  };

  const startEditing = (index: number) => {
    const step = steps[index];
    if (step.id) {
      updateStep(index, { isEditing: true });
    }
  };

  const cancelEditing = async (index: number) => {
    const step = steps[index];
    
    // If it's a new step (temp ID), remove it
    if (step.id?.startsWith("temp_")) {
      await removeStep(index);
    } else {
      updateStep(index, { isEditing: false });
    }
  };

  const saveStep = async (index: number) => {
    const step = steps[index];
    
    if (!step.name.trim()) {
      toast.error("Please enter a step name");
      return;
    }
    
    if (!step.description.trim()) {
      toast.error("Please enter step instructions");
      return;
    }

    if (mode === "edit" && recipeId && onSaveStep) {
      updateStep(index, { isSaving: true });
      
      const result = await onSaveStep(step);
      
      updateStep(index, { isSaving: false });
      
      if (result.success) {
        // Remove from local state since it's now saved in the database
        const updated = steps.filter((_, i) => i !== index);
        const reordered = reorderSteps(updated);
        onStepsChange(reordered);
        toast.success("Step saved successfully");
      } else {
        toast.error("Failed to save step", {
          description: result.error,
        });
      }
    } else {
      // For create mode, just mark as not editing
      updateStep(index, { isEditing: false });
    }
  };

  const isValid = (step: RecipeStep) => {
    return step.name.trim().length > 0 && step.description.trim().length > 0;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recipe Steps</CardTitle>
        <Button 
          type="button" 
          onClick={addStep} 
          size="sm" 
          disabled={disabled}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Step
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id || index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Step {step.order}</h4>
              <div className="flex gap-2">
                {step.isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={() => saveStep(index)}
                      disabled={step.isSaving || !isValid(step) || disabled}
                    >
                      {step.isSaving ? (
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
                      disabled={step.isSaving || disabled}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveStep(index, "up")}
                        disabled={index === 0 || disabled}
                      >
                        <MoveUp className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveStep(index, "down")}
                        disabled={index === steps.length - 1 || disabled}
                      >
                        <MoveDown className="w-4 h-4" />
                      </Button>
                    </div>
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
                      onClick={() => removeStep(index)}
                      disabled={disabled}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {step.isEditing ? (
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Step Name</label>
                  <Input
                    placeholder="e.g., Prepare ingredients"
                    value={step.name}
                    onChange={(e) => updateStep(index, { name: e.target.value })}
                    disabled={step.isSaving || disabled}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Instructions</label>
                  <Textarea
                    placeholder="Detailed instructions for this step..."
                    value={step.description}
                    onChange={(e) => updateStep(index, { description: e.target.value })}
                    disabled={step.isSaving || disabled}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="font-medium text-sm">{step.name}</div>
                <div className="text-sm text-muted-foreground">{step.description}</div>
              </div>
            )}
          </div>
        ))}

        {steps.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No steps added yet. Click &quot;Add Step&quot; to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}