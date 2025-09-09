"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RelativeDate } from "../../../components/ui/tooltips/relative-date";
import { Ingredient, IngredientType, IngredientLocation, Image } from "../../../generated/prisma";

type IngredientWithRelations = Ingredient & {
  type?: IngredientType | null;
  location?: IngredientLocation | null;  
  image?: Image | null;
};

export const columns: ColumnDef<IngredientWithRelations>[] = [
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
    accessorKey: "type.name",
    header: "Type",
    cell: ({ row }) => {
      return row.original.type?.name || <span className="text-muted-foreground">-</span>;
    },
  },
  {
    accessorKey: "location.name",
    header: "Location",
    cell: ({ row }) => {
      return row.original.location?.name || <span className="text-muted-foreground">-</span>;
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