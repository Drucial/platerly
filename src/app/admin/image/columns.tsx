"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RelativeDate } from "../../../components/ui/tooltips/relative-date";
import { Image } from "../../../generated/prisma";

export const columns: ColumnDef<Image>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => {
      return (
        <a
          href={row.original.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline truncate block max-w-[200px]"
        >
          {row.original.url}
        </a>
      );
    },
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