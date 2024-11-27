"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogTitle,
  Button,
  eventHandler,
} from "@rafty/ui";
import { useUploadContext } from "../providers";

export function CancelUploadDialog() {
  const { isCancel, toggleCancel, setUploadedFiles } = useUploadContext();

  const handleConfirmCancel = eventHandler(() => {
    setUploadedFiles({});
    toggleCancel(false);
  });

  return (
    <AlertDialog size="sm" open={isCancel} onOpenChange={toggleCancel}>
      <AlertDialogOverlay />
      <AlertDialogContent className="w-[90%] md:w-full p-4 md:p-5">
        <AlertDialogTitle>Cancel upload?</AlertDialogTitle>
        <AlertDialogDescription>
          Your upload is not complete. Would you like to cancel the upload?
        </AlertDialogDescription>
        <div className="flex gap-3 justify-end mt-4">
          <AlertDialogCancel asChild>
            <Button>Continue upload</Button>
          </AlertDialogCancel>
          <Button
            colorScheme="error"
            onClick={handleConfirmCancel}
            onKeyDown={handleConfirmCancel}
          >
            Cancel upload
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
