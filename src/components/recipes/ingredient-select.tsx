"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllIngredients } from "@/hooks/ingredient/use-get-all-ingredients";

type IngredientSelectProps = {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
};

export function IngredientSelect({ value, onValueChange, disabled }: IngredientSelectProps) {
  const { data: ingredientsData, isLoading } = useGetAllIngredients();

  return (
    <Select onValueChange={onValueChange} value={value} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select ingredient" />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            Loading ingredients...
          </div>
        ) : ingredientsData?.ingredients && ingredientsData.ingredients.length > 0 ? (
          ingredientsData.ingredients.map((ingredient) => (
            <SelectItem key={ingredient.id} value={ingredient.id.toString()}>
              {ingredient.name}
            </SelectItem>
          ))
        ) : (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No ingredients available
          </div>
        )}
      </SelectContent>
    </Select>
  );
}