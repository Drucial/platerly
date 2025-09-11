"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllImages } from "@/hooks/image/use-get-all-images";
import { useGetAllIngredientLocations } from "@/hooks/ingredient-location/use-get-all-ingredient-locations";
import { useGetAllIngredientTypes } from "@/hooks/ingredient-type/use-get-all-ingredient-types";
import { useCreateIngredient } from "@/hooks/ingredient/use-create-ingredient";
import { useGetIngredient } from "@/hooks/ingredient/use-get-ingredient";
import { useUpdateIngredient } from "@/hooks/ingredient/use-update-ingredient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ingredientFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  image_id: z.string().optional(),
  type_id: z.string().optional(),
  location_id: z.string().optional(),
});

type IngredientFormData = z.infer<typeof ingredientFormSchema>;

type IngredientFormProps = {
  mode: "create" | "edit";
  ingredientId?: number;
  onSuccess?: () => void;
};

export function IngredientForm({
  mode,
  ingredientId,
  onSuccess,
}: IngredientFormProps) {
  const form = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: {
      name: "",
      description: "",
      image_id: "",
      type_id: "",
      location_id: "",
    },
  });

  const { data: ingredientData } = useGetIngredient(ingredientId!, {
    enabled: mode === "edit" && !!ingredientId,
  });

  const { data: imagesData } = useGetAllImages();
  const { data: typesData } = useGetAllIngredientTypes();
  const { data: locationsData } = useGetAllIngredientLocations();

  const createIngredientMutation = useCreateIngredient({
    adminHandlers: {
      closeSheet: () => onSuccess?.(),
      resetForm: () => form.reset(),
    },
  });

  const updateIngredientMutation = useUpdateIngredient({
    adminHandlers: {
      closeSheet: () => onSuccess?.(),
    },
  });

  useEffect(() => {
    if (mode === "edit" && ingredientData?.ingredient) {
      const ingredient = ingredientData.ingredient;
      form.reset({
        name: ingredient.name,
        description: ingredient.description,
        image_id: ingredient.image_id?.toString() || "",
        type_id: ingredient.type_id?.toString() || "",
        location_id: ingredient.location_id?.toString() || "",
      });
    }
  }, [ingredientData, form, mode]);

  const onSubmit = (data: IngredientFormData) => {
    const formData = {
      name: data.name,
      description: data.description,
      image_id: data.image_id ? parseInt(data.image_id) : undefined,
      type_id: data.type_id ? parseInt(data.type_id) : undefined,
      location_id: data.location_id ? parseInt(data.location_id) : undefined,
    };

    if (mode === "create") {
      createIngredientMutation.mutate(formData);
    } else if (mode === "edit" && ingredientId) {
      updateIngredientMutation.mutate({ id: ingredientId, data: formData });
    }
  };

  const isPending =
    createIngredientMutation.isPending || updateIngredientMutation.isPending;

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
                <Input placeholder="Enter ingredient name" {...field} />
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
                  placeholder="Enter ingredient description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ingredient type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {typesData?.types && typesData.types.length > 0 ? (
                    typesData.types.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No ingredient types available
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
          name="location_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ingredient location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locationsData?.locations &&
                  locationsData.locations.length > 0 ? (
                    locationsData.locations.map((location) => (
                      <SelectItem
                        key={location.id}
                        value={location.id.toString()}
                      >
                        {location.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No ingredient locations available
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
              <FormLabel>Image</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ingredient image" />
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
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending
            ? mode === "create"
              ? "Creating..."
              : "Updating..."
            : mode === "create"
            ? "Create Ingredient"
            : "Update Ingredient"}
        </Button>
      </form>
    </Form>
  );
}
