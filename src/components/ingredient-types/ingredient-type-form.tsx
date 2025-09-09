"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useCreateIngredientType } from "@/hooks/ingredient-type/use-create-ingredient-type";
import { useGetIngredientType } from "@/hooks/ingredient-type/use-get-ingredient-type";
import { useUpdateIngredientType } from "@/hooks/ingredient-type/use-update-ingredient-type";
import { useEffect } from "react";
import { toast } from "sonner";

const ingredientTypeFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
});

type IngredientTypeFormData = z.infer<typeof ingredientTypeFormSchema>;

type IngredientTypeFormProps = {
  mode: "create" | "edit";
  ingredientTypeId?: number;
  onSuccess?: () => void;
};

export function IngredientTypeForm({ mode, ingredientTypeId, onSuccess }: IngredientTypeFormProps) {
  const form = useForm<IngredientTypeFormData>({
    resolver: zodResolver(ingredientTypeFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const { data: ingredientTypeData } = useGetIngredientType(ingredientTypeId!, {
    enabled: mode === "edit" && !!ingredientTypeId,
  });

  const createIngredientTypeMutation = useCreateIngredientType({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Ingredient type created successfully", {
          description: `${result.type?.name} has been created.`,
        });
        form.reset();
        onSuccess?.();
      } else {
        toast.error("Failed to create ingredient type", {
          description: result.error || "An unexpected error occurred.",
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Error creating ingredient type", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });

  const updateIngredientTypeMutation = useUpdateIngredientType({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Ingredient type updated successfully", {
          description: `${result.type?.name} has been updated.`,
        });
        onSuccess?.();
      } else {
        toast.error("Failed to update ingredient type", {
          description: result.error || "An unexpected error occurred.",
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Error updating ingredient type", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });

  useEffect(() => {
    if (mode === "edit" && ingredientTypeData?.type) {
      form.reset({
        name: ingredientTypeData.type.name,
      });
    }
  }, [ingredientTypeData, form, mode]);

  const onSubmit = (data: IngredientTypeFormData) => {
    if (mode === "create") {
      createIngredientTypeMutation.mutate(data);
    } else if (mode === "edit" && ingredientTypeId) {
      updateIngredientTypeMutation.mutate({ id: ingredientTypeId, data });
    }
  };

  const isPending = createIngredientTypeMutation.isPending || updateIngredientTypeMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter ingredient type name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending
            ? mode === "create"
              ? "Creating..."
              : "Updating..."
            : mode === "create"
              ? "Create Ingredient Type"
              : "Update Ingredient Type"}
        </Button>
      </form>
    </Form>
  );
}