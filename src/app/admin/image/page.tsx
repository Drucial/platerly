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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useDeleteImage } from "@/hooks/image/use-delete-image";
import { useGetAllImages } from "@/hooks/image/use-get-all-images";
import { useGetDeletedImages } from "@/hooks/image/use-get-deleted-images";
import { useRestoreImage } from "@/hooks/image/use-restore-image";
import { useState } from "react";
import { toast } from "sonner";
import { ImageForm } from "../../../components/images/image-form";
import { columns } from "./columns";

export default function AdminImagePage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [restoringImageId, setRestoringImageId] = useState<number | null>(null);
  const { data, error, isLoading, refetch } = useGetAllImages();
  const { data: deletedData, error: deletedError, isLoading: deletedLoading, refetch: refetchDeleted } = useGetDeletedImages();

  const restoreImageMutation = useRestoreImage({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Image restored successfully", {
          description: `${result.image?.name} has been restored.`,
        });
      } else {
        toast.error("Failed to restore image", {
          description: result.error || "An unexpected error occurred.",
        });
      }
      setRestoreDialogOpen(false);
      setRestoringImageId(null);
    },
    onError: (error: Error) => {
      toast.error("Error restoring image", {
        description: error.message || "An unexpected error occurred.",
      });
      setRestoreDialogOpen(false);
      setRestoringImageId(null);
    },
  });

  const deleteImageMutation = useDeleteImage({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Image deleted successfully", {
          description: `${result.image?.name} has been moved to trash.`,
        });
      } else {
        toast.error("Failed to delete image", {
          description: result.error || "An unexpected error occurred.",
        });
      }
      setDeleteDialogOpen(false);
      setDeletingImageId(null);
    },
    onError: (error: Error) => {
      toast.error("Error deleting image", {
        description: error.message || "An unexpected error occurred.",
      });
      setDeleteDialogOpen(false);
      setDeletingImageId(null);
    },
  });

  const handleDeleteImage = () => {
    if (deletingImageId) {
      deleteImageMutation.mutate(deletingImageId);
    }
  };

  const handleRestoreImage = () => {
    if (restoringImageId) {
      restoreImageMutation.mutate(restoringImageId);
    }
  };

  if (isLoading) {
    return (
      <FullScreenLoader
        title="Getting images..."
        description="Please wait while we load the images..."
      />
    );
  }

  if (error || !data) {
    return (
      <FullScreenError
        title="Error getting images"
        description={error?.message || "An unexpected error occurred."}
        action={<Button onClick={() => refetch()}>Retry</Button>}
      />
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6 h-[calc(100svh-var(--navbar-height))] mt-[var(--navbar-height)] flex flex-col">
      <AdminHeader
        title="Images"
        description="Manage images in the system"
        onAdd={() => {
          setEditingId(null);
          setOpen(true);
        }}
      />
      <Tabs defaultValue="active" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Images</TabsTrigger>
          <TabsTrigger value="deleted">Deleted Images</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="flex-1 flex flex-col">
          <DataTable
            columns={columns}
            data={data.images || []}
            onEdit={(id) => {
              setEditingId(id);
              setOpen(true);
            }}
            onDelete={(id) => {
              setDeletingImageId(id);
              setDeleteDialogOpen(true);
            }}
            getId={(row) => row.id}
          />
        </TabsContent>
        <TabsContent value="deleted" className="flex-1 flex flex-col">
          {deletedLoading ? (
            <FullScreenLoader
              title="Getting deleted images..."
              description="Please wait while we load the deleted images..."
            />
          ) : deletedError || !deletedData ? (
            <FullScreenError
              title="Error getting deleted images"
              description={deletedError?.message || "An unexpected error occurred."}
              action={<Button onClick={() => refetchDeleted()}>Retry</Button>}
            />
          ) : (
            <DataTable
              columns={columns}
              data={deletedData.images || []}
              onRestore={(id: number) => {
                setRestoringImageId(id);
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
            <SheetTitle>{editingId ? "Edit Image" : "Create Image"}</SheetTitle>
            <SheetDescription>
              {editingId
                ? "Update the image information below."
                : "Create a new image in the system."}
            </SheetDescription>
          </SheetHeader>
          <div className="px-4">
            <ImageForm
              mode={editingId ? "edit" : "create"}
              imageId={editingId || undefined}
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
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action will move
              the image to trash and can be undone later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteImage}
              disabled={deleteImageMutation.isPending}
            >
              {deleteImageMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this image? This action will move
              the image back to the active images list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreImage}
              disabled={restoreImageMutation.isPending}
            >
              {restoreImageMutation.isPending ? "Restoring..." : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
