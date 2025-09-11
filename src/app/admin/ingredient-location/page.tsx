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
import { useDeleteIngredientLocation } from "@/hooks/ingredient-location/use-delete-ingredient-location";
import { useGetAllIngredientLocations } from "@/hooks/ingredient-location/use-get-all-ingredient-locations";
import { useGetDeletedIngredientLocations } from "@/hooks/ingredient-location/use-get-deleted-ingredient-locations";
import { useRestoreIngredientLocation } from "@/hooks/ingredient-location/use-restore-ingredient-location";
import { useState } from "react";
import { toast } from "sonner";
import { IngredientLocationForm } from "../../../components/ingredient-locations/ingredient-location-form";
import { columns } from "./columns";

export default function AdminIngredientLocationPage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingIngredientLocationId, setDeletingIngredientLocationId] =
    useState<number | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [restoringIngredientLocationId, setRestoringIngredientLocationId] =
    useState<number | null>(null);
  const { data, error, isLoading, refetch } = useGetAllIngredientLocations();
  const {
    data: deletedData,
    error: deletedError,
    isLoading: deletedLoading,
    refetch: refetchDeleted,
  } = useGetDeletedIngredientLocations();

  const restoreIngredientLocationMutation = useRestoreIngredientLocation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Ingredient location restored successfully", {
          description: `${result.location?.name} has been restored.`,
        });
      } else {
        toast.error("Failed to restore ingredient location", {
          description: result.error || "An unexpected error occurred.",
        });
      }
      setRestoreDialogOpen(false);
      setRestoringIngredientLocationId(null);
    },
    onError: (error: Error) => {
      toast.error("Error restoring ingredient location", {
        description: error.message || "An unexpected error occurred.",
      });
      setRestoreDialogOpen(false);
      setRestoringIngredientLocationId(null);
    },
  });

  const deleteIngredientLocationMutation = useDeleteIngredientLocation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Ingredient location deleted successfully", {
          description: `${result.location?.name} has been moved to trash.`,
        });
      } else {
        toast.error("Failed to delete ingredient location", {
          description: result.error || "An unexpected error occurred.",
        });
      }
      setDeleteDialogOpen(false);
      setDeletingIngredientLocationId(null);
    },
    onError: (error: Error) => {
      toast.error("Error deleting ingredient location", {
        description: error.message || "An unexpected error occurred.",
      });
      setDeleteDialogOpen(false);
      setDeletingIngredientLocationId(null);
    },
  });

  const handleDeleteIngredientLocation = () => {
    if (deletingIngredientLocationId) {
      deleteIngredientLocationMutation.mutate(deletingIngredientLocationId);
    }
  };

  const handleRestoreIngredientLocation = () => {
    if (restoringIngredientLocationId) {
      restoreIngredientLocationMutation.mutate(restoringIngredientLocationId);
    }
  };

  if (isLoading) {
    return (
      <FullScreenLoader
        title="Getting ingredient locations..."
        description="Please wait while we load the ingredient locations..."
      />
    );
  }

  if (error || !data) {
    return (
      <FullScreenError
        title="Error getting ingredient locations"
        description={error?.message || "An unexpected error occurred."}
        action={<Button onClick={() => refetch()}>Retry</Button>}
      />
    );
  }

  return (
    <div className="h-full flex flex-col flex-1 gap-6">
      <AdminHeader
        title="Ingredient Locations"
        description="Manage ingredient locations in the system"
        onAdd={() => {
          setEditingId(null);
          setOpen(true);
        }}
      />
      <Tabs defaultValue="active" className="h-full overflow-hidden">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Locations</TabsTrigger>
          <TabsTrigger value="deleted">Deleted Locations</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="flex-1 flex flex-col">
          <DataTable
            columns={columns}
            data={data.locations || []}
            onEdit={(id) => {
              setEditingId(id);
              setOpen(true);
            }}
            onDelete={(id) => {
              setDeletingIngredientLocationId(id);
              setDeleteDialogOpen(true);
            }}
            getId={(row) => row.id}
          />
        </TabsContent>
        <TabsContent value="deleted" className="flex-1 flex flex-col">
          {deletedLoading ? (
            <FullScreenLoader
              title="Getting deleted ingredient locations..."
              description="Please wait while we load the deleted ingredient locations..."
            />
          ) : deletedError || !deletedData ? (
            <FullScreenError
              title="Error getting deleted ingredient locations"
              description={
                deletedError?.message || "An unexpected error occurred."
              }
              action={<Button onClick={() => refetchDeleted()}>Retry</Button>}
            />
          ) : (
            <DataTable
              columns={columns}
              data={deletedData.locations || []}
              onRestore={(id: number) => {
                setRestoringIngredientLocationId(id);
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
              {editingId
                ? "Edit Ingredient Location"
                : "Create Ingredient Location"}
            </SheetTitle>
            <SheetDescription>
              {editingId
                ? "Update the ingredient location information below."
                : "Create a new ingredient location in the system."}
            </SheetDescription>
          </SheetHeader>
          <div className="px-4">
            <IngredientLocationForm
              mode={editingId ? "edit" : "create"}
              ingredientLocationId={editingId || undefined}
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
            <AlertDialogTitle>Delete Ingredient Location</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this ingredient location? This
              action will move the ingredient location to trash and can be
              undone later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteIngredientLocation}
              disabled={deleteIngredientLocationMutation.isPending}
            >
              {deleteIngredientLocationMutation.isPending
                ? "Deleting..."
                : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Ingredient Location</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this ingredient location? This
              action will move the ingredient location back to the active
              locations list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreIngredientLocation}
              disabled={restoreIngredientLocationMutation.isPending}
            >
              {restoreIngredientLocationMutation.isPending
                ? "Restoring..."
                : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
