"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RelativeDate } from "../../../components/ui/tooltips/relative-date";
import { User } from "../../../generated/prisma";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
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
