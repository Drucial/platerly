"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { DataTable } from "@/components/admin/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FullScreenError } from "@/components/ui/full-screen-error";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeleteIngredientType } from "@/hooks/ingredient-type/use-delete-ingredient-type";
import { useGetAllIngredientTypes } from "@/hooks/ingredient-type/use-get-all-ingredient-types";
import { useGetDeletedIngredientTypes } from "@/hooks/ingredient-type/use-get-deleted-ingredient-types";
import { useRestoreIngredientType } from "@/hooks/ingredient-type/use-restore-ingredient-type";
import { useState } from "react";
import { toast } from "sonner";
import { IngredientTypeForm } from "../../../components/ingredient-types/ingredient-type-form";
import { columns } from "./columns";

export default function AdminIngredientTypePage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingIngredientTypeId, setDeletingIngredientTypeId] = useState<
    number | null
  >(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [restoringIngredientTypeId, setRestoringIngredientTypeId] = useState<
    number | null
  >(null);
  const { data, error, isLoading, refetch } = useGetAllIngredientTypes();
  const {
    data: deletedData,
    error: deletedError,
    isLoading: deletedLoading,
    refetch: refetchDeleted,
  } = useGetDeletedIngredientTypes();

  const restoreIngredientTypeMutation = useRestoreIngredientType({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Ingredient type restored successfully", {
          description: `${result.type?.name} has been restored.`,
        });
      } else {
        toast.error("Failed to restore ingredient type", {
          description: result.error || "An unexpected error occurred.",
        });
      }
      setRestoreDialogOpen(false);
      setRestoringIngredientTypeId(null);
    },
    onError: (error: Error) => {
      toast.error("Error restoring ingredient type", {
        description: error.message || "An unexpected error occurred.",
      });
      setRestoreDialogOpen(false);
      setRestoringIngredientTypeId(null);
    },
  });

  const deleteIngredientTypeMutation = useDeleteIngredientType({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Ingredient type deleted successfully", {
          description: `${result.type?.name} has been moved to trash.`,
        });
      } else {
        toast.error("Failed to delete ingredient type", {
          description: result.error || "An unexpected error occurred.",
        });
      }
      setDeleteDialogOpen(false);
      setDeletingIngredientTypeId(null);
    },
    onError: (error: Error) => {
      toast.error("Error deleting ingredient type", {
        description: error.message || "An unexpected error occurred.",
      });
      setDeleteDialogOpen(false);
      setDeletingIngredientTypeId(null);
    },
  });

  const handleDeleteIngredientType = () => {
    if (deletingIngredientTypeId) {
      deleteIngredientTypeMutation.mutate(deletingIngredientTypeId);
    }
  };

  const handleRestoreIngredientType = () => {
    if (restoringIngredientTypeId) {
      restoreIngredientTypeMutation.mutate(restoringIngredientTypeId);
    }
  };

  if (isLoading) {
    return (
      <FullScreenLoader
        title="Getting ingredient types..."
        description="Please wait while we load the ingredient types..."
      />
    );
  }

  if (error || !data) {
    return (
      <FullScreenError
        title="Error getting ingredient types"
        description={error?.message || "An unexpected error occurred."}
        action={<Button onClick={() => refetch()}>Retry</Button>}
      />
    );
  }

  return (
    <div className="h-full flex flex-col flex-1 gap-6">
      <AdminHeader
        title="Ingredient Types"
        description="Manage ingredient types in the system"
        onAdd={() => {
          setEditingId(null);
          setOpen(true);
        }}
      />
      <Tabs defaultValue="active" className="h-full overflow-hidden">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Types</TabsTrigger>
          <TabsTrigger value="deleted">Deleted Types</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="h-full overflow-hidden">
          <DataTable
            columns={columns}
            data={data.types || []}
            onEdit={(id) => {
              setEditingId(id);
              setOpen(true);
            }}
            onDelete={(id) => {
              setDeletingIngredientTypeId(id);
              setDeleteDialogOpen(true);
            }}
            getId={(row) => row.id}
          />
        </TabsContent>
        <TabsContent value="deleted" className="flex-1 flex flex-col">
          {deletedLoading ? (
            <FullScreenLoader
              title="Getting deleted ingredient types..."
              description="Please wait while we load the deleted ingredient types..."
            />
          ) : deletedError || !deletedData ? (
            <FullScreenError
              title="Error getting deleted ingredient types"
              description={
                deletedError?.message || "An unexpected error occurred."
              }
              action={<Button onClick={() => refetchDeleted()}>Retry</Button>}
            />
          ) : (
            <DataTable
              columns={columns}
              data={deletedData.types || []}
              onRestore={(id: number) => {
                setRestoringIngredientTypeId(id);
                setRestoreDialogOpen(true);
              }}
              getId={(row) => row.id}
              showRestoreAction={true}
            />
          )}
        </TabsContent>
      </Tabs>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editingId ? "Edit Ingredient Type" : "Create Ingredient Type"}
            </SheetTitle>
            <SheetDescription>
              {editingId
                ? "Update the ingredient type information below."
                : "Create a new ingredient type in the system."}
            </SheetDescription>
          </SheetHeader>
          <div className="px-4">
            <IngredientTypeForm
              mode={editingId ? "edit" : "create"}
              ingredientTypeId={editingId || undefined}
              onSuccess={() => {
                setOpen(false);
                setEditingId(null);
              }}
            />
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Ingredient Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this ingredient type? This action
              will move the ingredient type to trash and can be undone later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteIngredientType}
              disabled={deleteIngredientTypeMutation.isPending}
            >
              {deleteIngredientTypeMutation.isPending
                ? "Deleting..."
                : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Ingredient Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this ingredient type? This action
              will move the ingredient type back to the active types list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreIngredientType}
              disabled={restoreIngredientTypeMutation.isPending}
            >
              {restoreIngredientTypeMutation.isPending
                ? "Restoring..."
                : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
