"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetAllTags } from "@/hooks/tag/use-get-all-tags";
import { useCreateTag } from "@/hooks/tag/use-create-tag";
import { toast } from "sonner";

const createTagSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
});

type CreateTagData = z.infer<typeof createTagSchema>;

type TagsSelectorProps = {
  selectedTagIds: string[];
  onTagsChange: (tagIds: string[]) => void;
  mode?: "create" | "edit";
  recipeId?: number;
  onAddRecipeTag?: (tagId: string) => Promise<{ success: boolean; error?: string }>;
  onRemoveRecipeTag?: (tagId: string) => Promise<{ success: boolean; error?: string }>;
  disabled?: boolean;
};

export function TagsSelector({ 
  selectedTagIds, 
  onTagsChange, 
  mode, 
  recipeId, 
  onAddRecipeTag, 
  onRemoveRecipeTag, 
  disabled 
}: TagsSelectorProps) {
  const [showDialog, setShowDialog] = useState(false);
  const { data: tagsData, isLoading } = useGetAllTags();

  const form = useForm<CreateTagData>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createTagMutation = useCreateTag({
    onSuccess: (result) => {
      if (result.success && result.tag) {
        toast.success("Tag created successfully");
        // Auto-select the newly created tag
        onTagsChange([...selectedTagIds, result.tag.id.toString()]);
        form.reset();
        setShowDialog(false);
      } else {
        toast.error("Failed to create tag", {
          description: result.error,
        });
      }
    },
    onError: (error) => {
      toast.error("Error creating tag", {
        description: error.message,
      });
    },
  });

  const toggleTag = async (tagId: string) => {
    if (disabled) return;
    
    const isSelected = selectedTagIds.includes(tagId);
    
    if (mode === "edit" && recipeId) {
      // Live update in edit mode
      if (isSelected && onRemoveRecipeTag) {
        const result = await onRemoveRecipeTag(tagId);
        if (result.success) {
          onTagsChange(selectedTagIds.filter(id => id !== tagId));
          toast.success("Tag removed from recipe");
        } else {
          toast.error("Failed to remove tag", {
            description: result.error,
          });
        }
      } else if (!isSelected && onAddRecipeTag) {
        const result = await onAddRecipeTag(tagId);
        if (result.success) {
          onTagsChange([...selectedTagIds, tagId]);
          toast.success("Tag added to recipe");
        } else {
          toast.error("Failed to add tag", {
            description: result.error,
          });
        }
      }
    } else {
      // Local state update in create mode
      if (isSelected) {
        onTagsChange(selectedTagIds.filter(id => id !== tagId));
      } else {
        onTagsChange([...selectedTagIds, tagId]);
      }
    }
  };

  const removeTag = async (tagId: string) => {
    if (disabled) return;
    
    if (mode === "edit" && recipeId && onRemoveRecipeTag) {
      // Live update in edit mode
      const result = await onRemoveRecipeTag(tagId);
      if (result.success) {
        onTagsChange(selectedTagIds.filter(id => id !== tagId));
        toast.success("Tag removed from recipe");
      } else {
        toast.error("Failed to remove tag", {
          description: result.error,
        });
      }
    } else {
      // Local state update in create mode
      onTagsChange(selectedTagIds.filter(id => id !== tagId));
    }
  };

  const handleCreateTag = async (data: CreateTagData) => {
    await createTagMutation.mutateAsync(data);
  };

  const selectedTags = tagsData?.tags?.filter(tag => 
    selectedTagIds.includes(tag.id.toString())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
        <span className="text-muted-foreground">Loading tags...</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* Tag Select with Add New */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Select
              onValueChange={toggleTag}
              value=""
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tags" />
              </SelectTrigger>
              <SelectContent>
                {tagsData?.tags?.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id.toString());
                  return (
                    <SelectItem 
                      key={tag.id} 
                      value={tag.id.toString()}
                      className={isSelected ? "bg-primary/10 font-medium" : ""}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{tag.name}</span>
                        {isSelected && (
                          <span className="ml-2 text-primary">✓</span>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowDialog(true)}
            disabled={disabled}
          >
            <span className="text-lg">+</span>
          </Button>
        </div>

        {/* Selected Tags as Badges */}
        {selectedTags.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Selected Tags:</div>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="default"
                  className="pr-1"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => removeTag(tag.id.toString())}
                    disabled={disabled}
                    className="ml-2 rounded-full hover:bg-primary/20 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
            <DialogDescription>Add a new tag to categorize your recipes.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateTag)} className="space-y-4">
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
                      <Textarea placeholder="Enter tag description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setShowDialog(false);
                  }}
                  disabled={createTagMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createTagMutation.isPending}>
                  {createTagMutation.isPending ? "Creating..." : "Create Tag"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}