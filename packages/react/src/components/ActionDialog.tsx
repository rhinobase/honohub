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
import { useDialogManager } from "../providers";

export function ActionDialog() {
  const {
    action: { state, setState },
  } = useDialogManager();

  const manageAction = state.show
    ? eventHandler(() => {
        state.action();
        setState({ show: false });
      })
    : undefined;

  return (
    <AlertDialog size="sm" open={state.show}>
      <AlertDialogOverlay />
      <AlertDialogContent className="gap-1 rounded-lg">
        {state.show && (
          <>
            <AlertDialogTitle>{state.title}</AlertDialogTitle>
            <AlertDialogDescription>{state.message}</AlertDialogDescription>
            <div className="flex justify-between mt-4">
              <AlertDialogCancel asChild>
                <Button>Cancel</Button>
              </AlertDialogCancel>
              <Button
                colorScheme="error"
                onClick={manageAction}
                onKeyDown={manageAction}
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
