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
import { useCreateImage } from "@/hooks/image/use-create-image";
import { useGetImage } from "@/hooks/image/use-get-image";
import { useUpdateImage } from "@/hooks/image/use-update-image";
import { useEffect } from "react";
import { toast } from "sonner";

const imageFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  url: z
    .string()
    .url("Please enter a valid URL")
    .max(500, "URL must be less than 500 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
});

type ImageFormData = z.infer<typeof imageFormSchema>;

type ImageFormProps = {
  mode: "create" | "edit";
  imageId?: number;
  onSuccess?: () => void;
};

export function ImageForm({ mode, imageId, onSuccess }: ImageFormProps) {
  const form = useForm<ImageFormData>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      name: "",
      url: "",
      description: "",
    },
  });

  const { data: imageData } = useGetImage(imageId!, {
    enabled: mode === "edit" && !!imageId,
  });

  const createImageMutation = useCreateImage({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Image created successfully", {
          description: `${result.image?.name} has been created.`,
        });
        form.reset();
        onSuccess?.();
      } else {
        toast.error("Failed to create image", {
          description: result.error || "An unexpected error occurred.",
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Error creating image", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });

  const updateImageMutation = useUpdateImage({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Image updated successfully", {
          description: `${result.image?.name} has been updated.`,
        });
        onSuccess?.();
      } else {
        toast.error("Failed to update image", {
          description: result.error || "An unexpected error occurred.",
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Error updating image", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });

  useEffect(() => {
    if (mode === "edit" && imageData?.image) {
      form.reset({
        name: imageData.image.name,
        url: imageData.image.url,
        description: imageData.image.description,
      });
    }
  }, [imageData, form, mode]);

  const onSubmit = (data: ImageFormData) => {
    if (mode === "create") {
      createImageMutation.mutate(data);
    } else if (mode === "edit" && imageId) {
      updateImageMutation.mutate({ id: imageId, data });
    }
  };

  const isPending = createImageMutation.isPending || updateImageMutation.isPending;

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
                <Input placeholder="Enter image name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
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
                  placeholder="Enter image description"
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
              ? "Create Image"
              : "Update Image"}
        </Button>
      </form>
    </Form>
  );
}