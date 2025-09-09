"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../../components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { RelativeDate } from "../../../components/ui/tooltips/relative-date";
import {
  CuisineType,
  Image,
  Ingredient,
  Recipe,
  RecipeIngredient,
  RecipeTag,
  Step,
  Tag,
  User,
} from "../../../generated/prisma";
import { pluralize } from "../../../utils/pluralize";

type RecipeWithRelations = Recipe & {
  user?: User | null;
  image?: Image | null;
  source_image?: Image | null;
  cuisine_type?: CuisineType | null;
  steps?: Step[];
  recipe_ingredients?: (RecipeIngredient & {
    ingredient: Ingredient;
  })[];
  recipe_tags?: (RecipeTag & {
    tag: Tag;
  })[];
  _count?: {
    steps: number;
    recipe_ingredients: number;
    recipe_tags: number;
  };
};

export const columns: ColumnDef<RecipeWithRelations>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <span className="truncate block max-w-[200px]">
          {row.original.description}
        </span>
      );
    },
  },
  {
    accessorKey: "user.first_name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.user;
      return user ? (
        `${user.first_name} ${user.last_name}`
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "cuisine_type.name",
    header: "Cuisine",
    cell: ({ row }) => {
      return (
        row.original.cuisine_type?.name || (
          <span className="text-muted-foreground">-</span>
        )
      );
    },
  },
  {
    accessorKey: "prep_time",
    header: "Prep Time",
    cell: ({ row }) => {
      return (
        row.original.prep_time || (
          <span className="text-muted-foreground">-</span>
        )
      );
    },
  },
  {
    accessorKey: "cook_time",
    header: "Cook Time",
    cell: ({ row }) => {
      return (
        row.original.cook_time || (
          <span className="text-muted-foreground">-</span>
        )
      );
    },
  },
  {
    accessorKey: "steps",
    header: "Steps",
    cell: ({ row }) => {
      const count = row.original._count;
      const steps = row.original.steps;
      if (!count) return <span className="text-muted-foreground">-</span>;
      return (
        <Tooltip>
          <TooltipTrigger>
            {count.steps} {pluralize("step", count.steps)}
          </TooltipTrigger>
          {count.steps > 0 && (
            <TooltipContent className="max-h-1/2 overflow-y-auto">
              <div className="space-y-2 max-w-sm">
                {steps?.map((step) => (
                  <div
                    key={step.id}
                    className="border-b border-border pb-2 last:border-b-0"
                  >
                    <div className="font-medium">{step.name}</div>
                    {step.description && (
                      <div className="text-sm mt-1">{step.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "recipe_ingredients",
    header: "Ingredients",
    cell: ({ row }) => {
      const count = row.original._count;
      if (!count) return <span className="text-muted-foreground">-</span>;
      return (
        <Tooltip>
          <TooltipTrigger>
            {count.recipe_ingredients}{" "}
            {pluralize("ingredient", count.recipe_ingredients)}
          </TooltipTrigger>
          {count.recipe_ingredients > 0 && (
            <TooltipContent className="max-h-1/2 overflow-y-auto">
              <div className="space-y-2 max-w-sm">
                {row.original.recipe_ingredients?.map((recipeIngredient) => (
                  <div
                    key={recipeIngredient.id}
                    className="border-b border-border pb-2 last:border-b-0"
                  >
                    <div className="font-medium">
                      {recipeIngredient.ingredient.name}
                    </div>
                    {recipeIngredient.quantity && (
                      <div className="text-sm mt-1">
                        {recipeIngredient.quantity} {recipeIngredient.unit}
                      </div>
                    )}
                    {recipeIngredient.notes && (
                      <div className="text-sm mt-1">
                        {recipeIngredient.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "recipe_tags",
    header: "Tags",
    cell: ({ row }) => {
      const count = row.original._count;
      const recipeTags = row.original.recipe_tags;

      if (!count || count.recipe_tags === 0) {
        return <span className="text-muted-foreground">-</span>;
      }

      return (
        <Tooltip>
          <TooltipTrigger>
            {count.recipe_tags} {pluralize("tag", count.recipe_tags)}
          </TooltipTrigger>
          <TooltipContent className="max-h-1/2 overflow-y-auto z-50 p-1 rounded-lg">
            <div className="flex flex-wrap gap-1 max-w-sm">
              {recipeTags && recipeTags.length > 0 ? (
                recipeTags.map((recipeTag) => (
                  <Badge
                    key={recipeTag.id}
                    className="text-xs border border-white"
                  >
                    {recipeTag.tag.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-white">
                  Tag details not loaded
                </span>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      return <RelativeDate date={row.original.created_at} />;
    },
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ row }) => {
      return <RelativeDate date={row.original.updated_at} />;
    },
  },
  {
    accessorKey: "destroyed_at",
    header: "Destroyed At",
    cell: ({ row }) => {
      if (!row.original.destroyed_at) {
        return <span className="text-muted-foreground">-</span>;
      }
      return <RelativeDate date={row.original.destroyed_at} />;
    },
  },
];
