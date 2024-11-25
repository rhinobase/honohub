import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@rafty/ui";
import { useStorageActions } from "../../providers";
import { RenameForm } from "./Form";

export function RenameDialog() {
  const { rename } = useStorageActions();

  return (
    <Dialog
      size="sm"
      open={rename.value !== undefined}
      onOpenChange={(open) => !open && rename.set(undefined)}
    >
      <DialogOverlay className="z-[60]" />
      <DialogContent className="z-[60] gap-4">
        <DialogTitle>Rename</DialogTitle>
        <RenameForm />
      </DialogContent>
    </Dialog>
  );
}
