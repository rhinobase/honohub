"use client";
import { useCollection } from "@honohub/shared";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@rafty/ui";
import { CreateIndexForm } from "./Form";

export type CreateIndexDialog = Pick<Dialog, "open" | "onOpenChange">;

export function CreateIndexDialog(props: CreateIndexDialog) {
  const { current } = useCollection();

  return (
    <Dialog {...props}>
      <DialogOverlay />
      <DialogContent className="dark:bg-secondary-900">
        <DialogHeader className="flex-col items-start gap-0">
          <DialogTitle className="text-2xl">Create Index</DialogTitle>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            {current?.slug} / {current?._id}
          </p>
        </DialogHeader>
        <CreateIndexForm />
      </DialogContent>
    </Dialog>
  );
}
