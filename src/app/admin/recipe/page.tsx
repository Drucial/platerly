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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeleteRecipe } from "@/hooks/recipe/use-delete-recipe";
import { useGetAllRecipes } from "@/hooks/recipe/use-get-all-recipes";
import { useGetDeletedRecipes } from "@/hooks/recipe/use-get-deleted-recipes";
import { useRestoreRecipe } from "@/hooks/recipe/use-restore-recipe";
import { useState } from "react";
import { toast } from "sonner";
import { EditSheet } from "../../../components/recipes/edit-sheet";
import { columns } from "./columns";

export default function AdminRecipePage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingRecipeId, setDeletingRecipeId] = useState<number | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [restoringRecipeId, setRestoringRecipeId] = useState<number | null>(
    null
  );
  const { data, error, isLoading, refetch } = useGetAllRecipes();
  const {
    data: deletedData,
    error: deletedError,
    isLoading: deletedLoading,
    refetch: refetchDeleted,
  } = useGetDeletedRecipes();

  const restoreRecipeMutation = useRestoreRecipe({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Recipe restored successfully", {
          description: `${result.recipe?.name} has been restored.`,
        });
      } else {
        toast.error("Failed to restore recipe", {
          description: result.error || "An unexpected error occurred.",
        });
      }
      setRestoreDialogOpen(false);
      setRestoringRecipeId(null);
    },
    onError: (error: Error) => {
      toast.error("Error restoring recipe", {
        description: error.message || "An unexpected error occurred.",
      });
      setRestoreDialogOpen(false);
      setRestoringRecipeId(null);
    },
  });

  const deleteRecipeMutation = useDeleteRecipe({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Recipe deleted successfully", {
          description: `${result.recipe?.name} has been moved to trash.`,
        });
      } else {
        toast.error("Failed to delete recipe", {
          description: result.error || "An unexpected error occurred.",
        });
      }
      setDeleteDialogOpen(false);
      setDeletingRecipeId(null);
    },
    onError: (error: Error) => {
      toast.error("Error deleting recipe", {
        description: error.message || "An unexpected error occurred.",
      });
      setDeleteDialogOpen(false);
      setDeletingRecipeId(null);
    },
  });

  const handleDeleteRecipe = () => {
    if (deletingRecipeId) {
      deleteRecipeMutation.mutate(deletingRecipeId);
    }
  };

  const handleRestoreRecipe = () => {
    if (restoringRecipeId) {
      restoreRecipeMutation.mutate(restoringRecipeId);
    }
  };

  if (isLoading) {
    return (
      <FullScreenLoader
        title="Getting recipes..."
        description="Please wait while we load the recipes..."
      />
    );
  }

  if (error || !data) {
    return (
      <FullScreenError
        title="Error getting recipes"
        description={error?.message || "An unexpected error occurred."}
        action={<Button onClick={() => refetch()}>Retry</Button>}
      />
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6 h-[calc(100svh-var(--navbar-height))] mt-[var(--navbar-height)] flex flex-col">
      <AdminHeader
        title="Recipes"
        description="Manage recipes in the system"
        onAdd={() => {
          setEditingId(null);
          setOpen(true);
        }}
      />
      <Tabs defaultValue="active" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Recipes</TabsTrigger>
          <TabsTrigger value="deleted">Deleted Recipes</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="flex-1 flex flex-col">
          <DataTable
            columns={columns}
            data={data.recipes || []}
            onEdit={(id) => {
              setEditingId(id);
              setOpen(true);
            }}
            onDelete={(id) => {
              setDeletingRecipeId(id);
              setDeleteDialogOpen(true);
            }}
            getId={(row) => row.id}
          />
        </TabsContent>
        <TabsContent value="deleted" className="flex-1 flex flex-col">
          {deletedLoading ? (
            <FullScreenLoader
              title="Getting deleted recipes..."
              description="Please wait while we load the deleted recipes..."
            />
          ) : deletedError || !deletedData ? (
            <FullScreenError
              title="Error getting deleted recipes"
              description={
                deletedError?.message || "An unexpected error occurred."
              }
              action={<Button onClick={() => refetchDeleted()}>Retry</Button>}
            />
          ) : (
            <DataTable
              columns={columns}
              data={deletedData.recipes || []}
              onRestore={(id) => {
                setRestoringRecipeId(id);
                setRestoreDialogOpen(true);
              }}
              getId={(row) => row.id}
              showRestoreAction={true}
            />
          )}
        </TabsContent>
      </Tabs>
      <EditSheet
        editingId={editingId}
        setOpen={setOpen}
        open={open}
        setEditingId={setEditingId}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recipe? This action will move
              the recipe to trash and can be undone later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRecipe}
              disabled={deleteRecipeMutation.isPending}
            >
              {deleteRecipeMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this recipe? This action will
              move the recipe back to the active recipes list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreRecipe}
              disabled={restoreRecipeMutation.isPending}
            >
              {restoreRecipeMutation.isPending ? "Restoring..." : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
