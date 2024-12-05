"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
  useBoolean,
} from "@rafty/ui";
import { CreateOrganizationForm } from "./Form";

export function CreateOrganizationDialog() {
  const [isOpen, setOpen] = useBoolean();

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger
        colorScheme="primary"
        variant="solid"
        leftIcon={<PlusIcon className="size-4 stroke-[3]" />}
        className="hidden md:flex"
      >
        Create organization
      </DialogTrigger>
      <DialogTrigger
        colorScheme="primary"
        variant="solid"
        size="icon"
        className="flex md:hidden"
      >
        <PlusIcon className="size-4 stroke-[3]" />
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent className="gap-3 md:gap-4 lg:gap-5">
        <DialogHeader className="flex-col items-start gap-0">
          <DialogTitle className="text-xl">Create Organization</DialogTitle>
        </DialogHeader>
        <CreateOrganizationForm onSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
