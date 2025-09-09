"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, RotateCcw, Table2, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { NoResults } from "./no-results";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onEdit?: (id: any) => void;
  onDelete?: (id: any) => void;
  onRestore?: (id: any) => void;
  getId?: (row: TData) => any;
  showRestoreAction?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onEdit,
  onDelete,
  onRestore,
  getId = (row: any) => row.id,
  showRestoreAction = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
            {(onEdit || onDelete || onRestore) && (
              <TableHead>Actions</TableHead>
            )}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
              {(onEdit || onDelete || onRestore) && (
                <TableCell>
                  <div className="flex gap-2">
                    {onEdit && !showRestoreAction && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(getId(row.original))}
                      >
                        <Edit size={16} />
                      </Button>
                    )}
                    {onDelete && !showRestoreAction && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(getId(row.original))}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                    {onRestore && showRestoreAction && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onRestore(getId(row.original))}
                      >
                        <RotateCcw size={16} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={
                columns.length + (onEdit || onDelete || onRestore ? 1 : 0)
              }
            >
              <NoResults
                Icon={Table2}
                title="No results"
                description="Try a different search, remove filters, or clear all to see all results."
              />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
