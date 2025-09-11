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
import { Textarea } from "@/components/ui/textarea";
import { useCreateCuisineTypeAdmin } from "@/hooks/cuisine-type/use-create-cuisine-type";
import { useGetCuisineType } from "@/hooks/cuisine-type/use-get-cuisine-type";
import { useUpdateCuisineType } from "@/hooks/cuisine-type/use-update-cuisine-type";
import { useEffect } from "react";

const cuisineTypeFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
});

type CuisineTypeFormData = z.infer<typeof cuisineTypeFormSchema>;

type CuisineTypeFormProps = {
  mode: "create" | "edit";
  cuisineTypeId?: number;
  onSuccess?: () => void;
};

export function CuisineTypeForm({ mode, cuisineTypeId, onSuccess }: CuisineTypeFormProps) {
  const form = useForm<CuisineTypeFormData>({
    resolver: zodResolver(cuisineTypeFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { data: cuisineTypeData } = useGetCuisineType(cuisineTypeId!, {
    enabled: mode === "edit" && !!cuisineTypeId,
  });

  const createCuisineTypeMutation = useCreateCuisineTypeAdmin({
    adminHandlers: {
      closeSheet: () => onSuccess?.(),
      resetForm: () => form.reset()
    }
  });

  const updateCuisineTypeMutation = useUpdateCuisineType({
    adminHandlers: {
      closeSheet: () => onSuccess?.()
    }
  });

  useEffect(() => {
    if (mode === "edit" && cuisineTypeData?.cuisineType) {
      const cuisineType = cuisineTypeData.cuisineType;
      form.reset({
        name: cuisineType.name,
        description: cuisineType.description,
      });
    }
  }, [cuisineTypeData, form, mode]);

  const onSubmit = (data: CuisineTypeFormData) => {
    if (mode === "create") {
      createCuisineTypeMutation.mutate(data);
    } else if (mode === "edit" && cuisineTypeId) {
      updateCuisineTypeMutation.mutate({ id: cuisineTypeId, data });
    }
  };

  const isPending = createCuisineTypeMutation.isPending || updateCuisineTypeMutation.isPending;

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
                <Input placeholder="Enter cuisine type name" {...field} />
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
                  placeholder="Enter cuisine type description"
                  {...field}
                />
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
              ? "Create Cuisine Type"
              : "Update Cuisine Type"}
        </Button>
      </form>
    </Form>
  );
}