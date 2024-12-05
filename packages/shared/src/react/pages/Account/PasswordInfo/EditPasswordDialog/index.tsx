"use client";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
  useBoolean,
} from "@rafty/ui";
import { EditPasswordForm } from "./Form";

export function EditPasswordDialog() {
  const [isOpen, setOpen] = useBoolean();

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger size="icon" colorScheme="primary">
        <PencilSquareIcon className="size-4 stroke-2" />
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent className="gap-3 md:gap-4 lg:gap-5">
        <DialogTitle className="text-lg md:text-xl">Edit Password</DialogTitle>
        <EditPasswordForm onSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
