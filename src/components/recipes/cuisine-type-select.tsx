"use client";

import { SelectWithAdd } from "@/components/ui/select-with-add";
import { useGetAllCuisineTypes } from "@/hooks/cuisine-type/use-get-all-cuisine-types";
import { useCreateCuisineType } from "@/hooks/cuisine-type/use-create-cuisine-type";
import { toast } from "sonner";

type CuisineTypeSelectProps = {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
};

export function CuisineTypeSelect({ value, onValueChange, disabled }: CuisineTypeSelectProps) {
  const { data: cuisineTypesData, isLoading } = useGetAllCuisineTypes();
  
  const createCuisineTypeMutation = useCreateCuisineType({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Cuisine type created successfully");
      } else {
        toast.error("Failed to create cuisine type", {
          description: result.error,
        });
      }
    },
    onError: (error) => {
      toast.error("Error creating cuisine type", {
        description: error.message,
      });
    },
  });

  const handleCreateNew = async (data: { name: string; description: string }) => {
    const result = await createCuisineTypeMutation.mutateAsync(data);
    
    if (result.success && result.cuisineType) {
      return {
        success: true,
        item: {
          id: result.cuisineType.id,
          name: result.cuisineType.name,
        },
      };
    }
    
    return {
      success: false,
      error: result.error || "Failed to create cuisine type",
    };
  };

  return (
    <SelectWithAdd
      placeholder="Select cuisine type"
      options={cuisineTypesData?.cuisineTypes || []}
      value={value}
      onValueChange={onValueChange}
      onCreateNew={handleCreateNew}
      createButtonText="Create Cuisine Type"
      createDialogTitle="Create New Cuisine Type"
      createDialogDescription="Add a new cuisine type to the system."
      isLoading={isLoading}
      isCreating={createCuisineTypeMutation.isPending}
      disabled={disabled}
    />
  );
}