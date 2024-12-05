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
import { useActionDialog } from "../../providers";

export function ActionDialog() {
  const { action, setAction } = useActionDialog();

  const handleAction = action.show
    ? eventHandler(() => {
        action.event();
        setAction({ show: false });
      })
    : undefined;

  return (
    <AlertDialog
      size="sm"
      open={action.show}
      onOpenChange={() => setAction({ show: false })}
    >
      <AlertDialogOverlay />
      <AlertDialogContent className="gap-1 rounded-lg">
        {action.show && (
          <>
            <AlertDialogTitle>{action.title}</AlertDialogTitle>
            <AlertDialogDescription>{action.message}</AlertDialogDescription>
            <div className="flex justify-between mt-4">
              <AlertDialogCancel asChild>
                <Button>Cancel</Button>
              </AlertDialogCancel>
              <Button
                colorScheme="error"
                onClick={handleAction}
                onKeyDown={handleAction}
              >
                Confirm
              </Button>
            </div>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
