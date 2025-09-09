import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { RecipeForm } from "./recipe-form-refactored";

type EditSheetProps = {
  editingId: number | null;
  setEditingId: (editingId: number | null) => void;
  setOpen: (open: boolean) => void;
  open: boolean;
};

export function EditSheet({
  editingId,
  setOpen,
  open,
  setEditingId,
}: EditSheetProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="divide-y gap-0">
        <SheetHeader>
          <SheetTitle>{editingId ? "Edit Recipe" : "Create Recipe"}</SheetTitle>
          <SheetDescription>
            {editingId
              ? "Update the recipe information below."
              : "Create a new recipe in the system."}
          </SheetDescription>
        </SheetHeader>
        <div className="p-4 overflow-y-auto">
          <RecipeForm
            mode={editingId ? "edit" : "create"}
            recipeId={editingId || undefined}
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
  );
}
