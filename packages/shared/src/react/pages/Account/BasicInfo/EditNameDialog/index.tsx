"use client";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
  useBoolean,
} from "@rafty/ui";
import { EditNameForm } from "./Form";

export function EditNameDialog() {
  const [isOpen, setOpen] = useBoolean();

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger size="icon" colorScheme="primary">
        <PencilSquareIcon className="size-4 stroke-2" />
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent className="gap-3 md:gap-4 lg:gap-5">
        <DialogHeader className="flex-col items-start gap-0">
          <DialogTitle className="text-lg md:text-xl">Edit Name</DialogTitle>
          <DialogDescription className="text-xs md:text-sm">
            Changes to your name will be reflected across rhinobase platform.
          </DialogDescription>
        </DialogHeader>
        <EditNameForm onSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
