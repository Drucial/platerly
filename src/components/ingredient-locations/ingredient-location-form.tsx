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
import { useCreateIngredientLocation } from "@/hooks/ingredient-location/use-create-ingredient-location";
import { useGetIngredientLocation } from "@/hooks/ingredient-location/use-get-ingredient-location";
import { useUpdateIngredientLocation } from "@/hooks/ingredient-location/use-update-ingredient-location";
import { useEffect } from "react";

const ingredientLocationFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
});

type IngredientLocationFormData = z.infer<typeof ingredientLocationFormSchema>;

type IngredientLocationFormProps = {
  mode: "create" | "edit";
  ingredientLocationId?: number;
  onSuccess?: () => void;
};

export function IngredientLocationForm({ mode, ingredientLocationId, onSuccess }: IngredientLocationFormProps) {
  const form = useForm<IngredientLocationFormData>({
    resolver: zodResolver(ingredientLocationFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const { data: ingredientLocationData } = useGetIngredientLocation(ingredientLocationId!, {
    enabled: mode === "edit" && !!ingredientLocationId,
  });

  const createIngredientLocationMutation = useCreateIngredientLocation({
    adminHandlers: {
      closeSheet: () => onSuccess?.(),
      resetForm: () => form.reset()
    }
  });

  const updateIngredientLocationMutation = useUpdateIngredientLocation({
    adminHandlers: {
      closeSheet: () => onSuccess?.()
    }
  });

  useEffect(() => {
    if (mode === "edit" && ingredientLocationData?.location) {
      form.reset({
        name: ingredientLocationData.location.name,
      });
    }
  }, [ingredientLocationData, form, mode]);

  const onSubmit = (data: IngredientLocationFormData) => {
    if (mode === "create") {
      createIngredientLocationMutation.mutate(data);
    } else if (mode === "edit" && ingredientLocationId) {
      updateIngredientLocationMutation.mutate({ id: ingredientLocationId, data });
    }
  };

  const isPending = createIngredientLocationMutation.isPending || updateIngredientLocationMutation.isPending;

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
                <Input placeholder="Enter ingredient location name" {...field} />
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
              ? "Create Ingredient Location"
              : "Update Ingredient Location"}
        </Button>
      </form>
    </Form>
  );
}