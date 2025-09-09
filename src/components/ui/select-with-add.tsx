"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createItemSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
});

type CreateItemData = z.infer<typeof createItemSchema>;

type Option = {
  id: number;
  name: string;
};

type SelectWithAddProps = {
  placeholder: string;
  options: Option[];
  value?: string;
  onValueChange: (value: string) => void;
  onCreateNew: (
    data: CreateItemData
  ) => Promise<{ success: boolean; error?: string; item?: Option }>;
  createButtonText: string;
  createDialogTitle: string;
  createDialogDescription: string;
  isLoading?: boolean;
  isCreating?: boolean;
  disabled?: boolean;
};

export function SelectWithAdd({
  placeholder,
  options,
  value,
  onValueChange,
  onCreateNew,
  createButtonText,
  createDialogTitle,
  createDialogDescription,
  isLoading,
  isCreating,
  disabled,
}: SelectWithAddProps) {
  const [showDialog, setShowDialog] = useState(false);

  const form = useForm<CreateItemData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleCreate = async (data: CreateItemData) => {
    const result = await onCreateNew(data);

    if (result.success && result.item) {
      onValueChange(result.item.id.toString());
      form.reset();
      setShowDialog(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <div className="flex-1">
          <Select
            onValueChange={onValueChange}
            value={value}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : options.length > 0 ? (
                options.map((option) => (
                  <SelectItem key={option.id} value={option.id.toString()}>
                    {option.name}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No options available
                </div>
              )}
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
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{createDialogTitle}</DialogTitle>
            <DialogDescription>{createDialogDescription}</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreate)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
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
                      <Textarea placeholder="Enter description" {...field} />
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
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : createButtonText}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
