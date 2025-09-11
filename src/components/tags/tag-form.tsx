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
import { useCreateTag } from "@/hooks/tag/use-create-tag";
import { useGetTag } from "@/hooks/tag/use-get-tag";
import { useUpdateTag } from "@/hooks/tag/use-update-tag";
import { useEffect } from "react";

const tagFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
});

type TagFormData = z.infer<typeof tagFormSchema>;

type TagFormProps = {
  mode: "create" | "edit";
  tagId?: number;
  onSuccess?: () => void;
};

export function TagForm({ mode, tagId, onSuccess }: TagFormProps) {
  const form = useForm<TagFormData>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { data: tagData } = useGetTag(tagId!, {
    enabled: mode === "edit" && !!tagId,
  });

  const createTagMutation = useCreateTag({
    adminHandlers: {
      closeSheet: () => onSuccess?.(),
      resetForm: () => form.reset()
    }
  });

  const updateTagMutation = useUpdateTag({
    adminHandlers: {
      closeSheet: () => onSuccess?.()
    }
  });

  useEffect(() => {
    if (mode === "edit" && tagData?.tag) {
      const tag = tagData.tag;
      form.reset({
        name: tag.name,
        description: tag.description,
      });
    }
  }, [tagData, form, mode]);

  const onSubmit = (data: TagFormData) => {
    if (mode === "create") {
      createTagMutation.mutate(data);
    } else if (mode === "edit" && tagId) {
      updateTagMutation.mutate({ id: tagId, data });
    }
  };

  const isPending = createTagMutation.isPending || updateTagMutation.isPending;

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
                <Input placeholder="Enter tag name" {...field} />
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
                  placeholder="Enter tag description"
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
              ? "Create Tag"
              : "Update Tag"}
        </Button>
      </form>
    </Form>
  );
}