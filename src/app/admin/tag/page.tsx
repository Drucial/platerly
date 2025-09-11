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
import { useDeleteTag } from "@/hooks/tag/use-delete-tag";
import { useGetAllTags } from "@/hooks/tag/use-get-all-tags";
import { useGetDeletedTags } from "@/hooks/tag/use-get-deleted-tags";
import { useRestoreTag } from "@/hooks/tag/use-restore-tag";
import { useState } from "react";
import { TagForm } from "../../../components/tags/tag-form";
import { columns } from "./columns";

export default function AdminTagPage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTagId, setDeletingTagId] = useState<number | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [restoringTagId, setRestoringTagId] = useState<number | null>(null);
  const { data, error, isLoading, refetch } = useGetAllTags();
  const {
    data: deletedData,
    error: deletedError,
    isLoading: deletedLoading,
    refetch: refetchDeleted,
  } = useGetDeletedTags();

  const restoreTagMutation = useRestoreTag({
    adminHandlers: {
      closeRestoreDialog: () => setRestoreDialogOpen(false),
      resetRestoreId: () => setRestoringTagId(null)
    }
  });

  const deleteTagMutation = useDeleteTag({
    adminHandlers: {
      closeDeleteDialog: () => setDeleteDialogOpen(false),
      resetDeleteId: () => setDeletingTagId(null)
    }
  });

  const handleDeleteTag = () => {
    if (deletingTagId) {
      deleteTagMutation.mutate(deletingTagId);
    }
  };

  const handleRestoreTag = () => {
    if (restoringTagId) {
      restoreTagMutation.mutate(restoringTagId);
    }
  };

  if (isLoading) {
    return (
      <FullScreenLoader
        title="Getting tags..."
        description="Please wait while we load the tags..."
      />
    );
  }

  if (error || !data) {
    return (
      <FullScreenError
        title="Error getting tags"
        description={error?.message || "An unexpected error occurred."}
        action={<Button onClick={() => refetch()}>Retry</Button>}
      />
    );
  }

  return (
    <div className="h-full flex flex-col flex-1 gap-6">
      <AdminHeader
        title="Tags"
        description="Manage tags in the system"
        onAdd={() => {
          setEditingId(null);
          setOpen(true);
        }}
      />
      <Tabs defaultValue="active" className="h-full overflow-hidden">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Tags</TabsTrigger>
          <TabsTrigger value="deleted">Deleted Tags</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="h-full overflow-hidden">
          <DataTable
            columns={columns}
            data={data.tags || []}
            onEdit={(id) => {
              setEditingId(id);
              setOpen(true);
            }}
            onDelete={(id) => {
              setDeletingTagId(id);
              setDeleteDialogOpen(true);
            }}
            getId={(row) => row.id}
          />
        </TabsContent>
        <TabsContent value="deleted" className="flex-1 flex flex-col">
          {deletedLoading ? (
            <FullScreenLoader
              title="Getting deleted tags..."
              description="Please wait while we load the deleted tags..."
            />
          ) : deletedError || !deletedData ? (
            <FullScreenError
              title="Error getting deleted tags"
              description={
                deletedError?.message || "An unexpected error occurred."
              }
              action={<Button onClick={() => refetchDeleted()}>Retry</Button>}
            />
          ) : (
            <DataTable
              columns={columns}
              data={deletedData.tags || []}
              onRestore={(id) => {
                setRestoringTagId(id);
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
            <SheetTitle>{editingId ? "Edit Tag" : "Create Tag"}</SheetTitle>
            <SheetDescription>
              {editingId
                ? "Update the tag information below."
                : "Create a new tag in the system."}
            </SheetDescription>
          </SheetHeader>
          <div className="px-4">
            <TagForm
              mode={editingId ? "edit" : "create"}
              tagId={editingId || undefined}
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
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this tag? This action will move
              the tag to trash and can be undone later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTag}
              disabled={deleteTagMutation.isPending}
            >
              {deleteTagMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this tag? This action will move
              the tag back to the active tags list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreTag}
              disabled={restoreTagMutation.isPending}
            >
              {restoreTagMutation.isPending ? "Restoring..." : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
