"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RelativeDate } from "../../../components/ui/tooltips/relative-date";
import { IngredientType } from "../../../generated/prisma";

export const columns: ColumnDef<IngredientType>[] = [
  {
    accessorKey: "name",
    header: "Name",
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