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
import { useDeleteCuisineType } from "@/hooks/cuisine-type/use-delete-cuisine-type";
import { useGetAllCuisineTypes } from "@/hooks/cuisine-type/use-get-all-cuisine-types";
import { useGetDeletedCuisineTypes } from "@/hooks/cuisine-type/use-get-deleted-cuisine-types";
import { useRestoreCuisineType } from "@/hooks/cuisine-type/use-restore-cuisine-type";
import { useState } from "react";
import { toast } from "sonner";
import { CuisineTypeForm } from "../../../components/cuisine-types/cuisine-type-form";
import { columns } from "./columns";

export default function AdminCuisineTypePage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCuisineTypeId, setDeletingCuisineTypeId] = useState<
    number | null
  >(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [restoringCuisineTypeId, setRestoringCuisineTypeId] = useState<
    number | null
  >(null);
  const { data, error, isLoading, refetch } = useGetAllCuisineTypes();
  const {
    data: deletedData,
    error: deletedError,
    isLoading: deletedLoading,
    refetch: refetchDeleted,
  } = useGetDeletedCuisineTypes();

  const restoreCuisineTypeMutation = useRestoreCuisineType({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Cuisine type restored successfully", {
          description: `${result.cuisineType?.name} has been restored.`,
        });
      } else {
        toast.error("Failed to restore cuisine type", {
          description: result.error || "An unexpected error occurred.",
        });
      }
      setRestoreDialogOpen(false);
      setRestoringCuisineTypeId(null);
    },
    onError: (error: Error) => {
      toast.error("Error restoring cuisine type", {
        description: error.message || "An unexpected error occurred.",
      });
      setRestoreDialogOpen(false);
      setRestoringCuisineTypeId(null);
    },
  });

  const deleteCuisineTypeMutation = useDeleteCuisineType({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Cuisine type deleted successfully", {
          description: `${result.cuisineType?.name} has been moved to trash.`,
        });
      } else {
        toast.error("Failed to delete cuisine type", {
          description: result.error || "An unexpected error occurred.",
        });
      }
      setDeleteDialogOpen(false);
      setDeletingCuisineTypeId(null);
    },
    onError: (error: Error) => {
      toast.error("Error deleting cuisine type", {
        description: error.message || "An unexpected error occurred.",
      });
      setDeleteDialogOpen(false);
      setDeletingCuisineTypeId(null);
    },
  });

  const handleDeleteCuisineType = () => {
    if (deletingCuisineTypeId) {
      deleteCuisineTypeMutation.mutate(deletingCuisineTypeId);
    }
  };

  const handleRestoreCuisineType = () => {
    if (restoringCuisineTypeId) {
      restoreCuisineTypeMutation.mutate(restoringCuisineTypeId);
    }
  };

  if (isLoading) {
    return (
      <FullScreenLoader
        title="Getting cuisine types..."
        description="Please wait while we load the cuisine types..."
      />
    );
  }

  if (error || !data) {
    return (
      <FullScreenError
        title="Error getting cuisine types"
        description={error?.message || "An unexpected error occurred."}
        action={<Button onClick={() => refetch()}>Retry</Button>}
      />
    );
  }

  return (
    <div className="h-full flex flex-col flex-1 gap-6">
      <AdminHeader
        title="Cuisine Types"
        description="Manage cuisine types in the system"
        onAdd={() => {
          setEditingId(null);
          setOpen(true);
        }}
      />
      <Tabs defaultValue="active" className="h-full overflow-hidden">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Cuisine Types</TabsTrigger>
          <TabsTrigger value="deleted">Deleted Cuisine Types</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="flex-1 flex flex-col">
          <DataTable
            columns={columns}
            data={data.cuisineTypes || []}
            onEdit={(id) => {
              setEditingId(id);
              setOpen(true);
            }}
            onDelete={(id) => {
              setDeletingCuisineTypeId(id);
              setDeleteDialogOpen(true);
            }}
            getId={(row) => row.id}
          />
        </TabsContent>
        <TabsContent value="deleted" className="flex-1 flex flex-col">
          {deletedLoading ? (
            <FullScreenLoader
              title="Getting deleted cuisine types..."
              description="Please wait while we load the deleted cuisine types..."
            />
          ) : deletedError || !deletedData ? (
            <FullScreenError
              title="Error getting deleted cuisine types"
              description={
                deletedError?.message || "An unexpected error occurred."
              }
              action={<Button onClick={() => refetchDeleted()}>Retry</Button>}
            />
          ) : (
            <DataTable
              columns={columns}
              data={deletedData.cuisineTypes || []}
              onRestore={(id) => {
                setRestoringCuisineTypeId(id);
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
              {editingId ? "Edit Cuisine Type" : "Create Cuisine Type"}
            </SheetTitle>
            <SheetDescription>
              {editingId
                ? "Update the cuisine type information below."
                : "Create a new cuisine type in the system."}
            </SheetDescription>
          </SheetHeader>
          <div className="px-4">
            <CuisineTypeForm
              mode={editingId ? "edit" : "create"}
              cuisineTypeId={editingId || undefined}
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
            <AlertDialogTitle>Delete Cuisine Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this cuisine type? This action
              will move the cuisine type to trash and can be undone later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCuisineType}
              disabled={deleteCuisineTypeMutation.isPending}
            >
              {deleteCuisineTypeMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Cuisine Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this cuisine type? This action
              will move the cuisine type back to the active cuisine types list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreCuisineType}
              disabled={restoreCuisineTypeMutation.isPending}
            >
              {restoreCuisineTypeMutation.isPending
                ? "Restoring..."
                : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
