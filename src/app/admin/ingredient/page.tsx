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
import { useDeleteIngredient } from "@/hooks/ingredient/use-delete-ingredient";
import { useGetAllIngredients } from "@/hooks/ingredient/use-get-all-ingredients";
import { useGetDeletedIngredients } from "@/hooks/ingredient/use-get-deleted-ingredients";
import { useRestoreIngredient } from "@/hooks/ingredient/use-restore-ingredient";
import { useState } from "react";
import { IngredientForm } from "../../../components/ingredients/ingredient-form";
import { columns } from "./columns";

export default function AdminIngredientPage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingIngredientId, setDeletingIngredientId] = useState<
    number | null
  >(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [restoringIngredientId, setRestoringIngredientId] = useState<
    number | null
  >(null);
  const { data, error, isLoading, refetch } = useGetAllIngredients();
  const {
    data: deletedData,
    error: deletedError,
    isLoading: deletedLoading,
    refetch: refetchDeleted,
  } = useGetDeletedIngredients();

  const restoreIngredientMutation = useRestoreIngredient({
    adminHandlers: {
      closeRestoreDialog: () => setRestoreDialogOpen(false),
      resetRestoreId: () => setRestoringIngredientId(null),
    },
  });

  const deleteIngredientMutation = useDeleteIngredient({
    adminHandlers: {
      closeDeleteDialog: () => setDeleteDialogOpen(false),
      resetDeleteId: () => setDeletingIngredientId(null),
    },
  });

  const handleDeleteIngredient = () => {
    if (deletingIngredientId) {
      deleteIngredientMutation.mutate(deletingIngredientId);
    }
  };

  const handleRestoreIngredient = () => {
    if (restoringIngredientId) {
      restoreIngredientMutation.mutate(restoringIngredientId);
    }
  };

  if (isLoading) {
    return (
      <FullScreenLoader
        title="Getting ingredients..."
        description="Please wait while we load the ingredients..."
      />
    );
  }

  if (error || !data) {
    return (
      <FullScreenError
        title="Error getting ingredients"
        description={error?.message || "An unexpected error occurred."}
        action={<Button onClick={() => refetch()}>Retry</Button>}
      />
    );
  }

  return (
    <div className="h-full flex flex-col flex-1 gap-6">
      <AdminHeader
        title="Ingredients"
        description="Manage ingredients in the system"
        onAdd={() => {
          setEditingId(null);
          setOpen(true);
        }}
      />
      <Tabs defaultValue="active" className="h-full overflow-hidden">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Ingredients</TabsTrigger>
          <TabsTrigger value="deleted">Deleted Ingredients</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="h-full overflow-hidden">
          <DataTable
            columns={columns}
            data={data.ingredients || []}
            onEdit={(id) => {
              setEditingId(id);
              setOpen(true);
            }}
            onDelete={(id) => {
              setDeletingIngredientId(id);
              setDeleteDialogOpen(true);
            }}
            getId={(row) => row.id}
          />
        </TabsContent>
        <TabsContent value="deleted" className="flex-1 flex flex-col">
          {deletedLoading ? (
            <FullScreenLoader
              title="Getting deleted ingredients..."
              description="Please wait while we load the deleted ingredients..."
            />
          ) : deletedError || !deletedData ? (
            <FullScreenError
              title="Error getting deleted ingredients"
              description={
                deletedError?.message || "An unexpected error occurred."
              }
              action={<Button onClick={() => refetchDeleted()}>Retry</Button>}
            />
          ) : (
            <DataTable
              columns={columns}
              data={deletedData.ingredients || []}
              onRestore={(id: number) => {
                setRestoringIngredientId(id);
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
              {editingId ? "Edit Ingredient" : "Create Ingredient"}
            </SheetTitle>
            <SheetDescription>
              {editingId
                ? "Update the ingredient information below."
                : "Create a new ingredient in the system."}
            </SheetDescription>
          </SheetHeader>
          <div className="px-4">
            <IngredientForm
              mode={editingId ? "edit" : "create"}
              ingredientId={editingId || undefined}
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
            <AlertDialogTitle>Delete Ingredient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this ingredient? This action will
              move the ingredient to trash and can be undone later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteIngredient}
              disabled={deleteIngredientMutation.isPending}
            >
              {deleteIngredientMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Ingredient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this ingredient? This action will
              move the ingredient back to the active ingredients list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreIngredient}
              disabled={restoreIngredientMutation.isPending}
            >
              {restoreIngredientMutation.isPending ? "Restoring..." : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
