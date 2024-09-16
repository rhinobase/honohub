"use client";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  eventHandler,
  useBoolean,
} from "@rafty/ui";
import { useFormContext } from "react-hook-form";
import { DocumentSubmitType, FormMode } from "./utils";

export const SUBMIT_BUTTON_KEY = "__submit_btn";

export type FormFooter =
  | {
      mode?: FormMode.ADD;
    }
  | {
      mode?: FormMode.EDIT;
      onDelete?: () => Promise<void>;
    };

export function FormFooter(props: FormFooter) {
  const { mode = FormMode.ADD } = props;
  const [isDeleting, setDeleting] = useBoolean();

  const {
    setValue,
    formState: { isSubmitting },
  } = useFormContext();

  const isDisabled = isSubmitting || isDeleting;

  const handleSaveAndAddAnother = () => {
    setValue(SUBMIT_BUTTON_KEY, DocumentSubmitType.SAVE_AND_ADD_ANOTHER);
  };

  const handleSave = () => {
    setValue(SUBMIT_BUTTON_KEY, DocumentSubmitType.SAVE);
  };

  return (
    <>
      <div className="flex gap-3 p-3 bg-secondary-100 dark:bg-secondary-900 rounded-md mb-3 md:mb-4 lg:mb-5 xl:mb-6">
        {mode === FormMode.EDIT && (
          <DeleteButton
            isLoading={isDeleting}
            isDisabled={isDisabled}
            onDelete={async () => {
              setDeleting(true);
              if (props.mode === FormMode.EDIT) props.onDelete?.();
              setDeleting(false);
            }}
          />
        )}
        <div className="flex-1" />
        <Button
          type="submit"
          variant="ghost"
          colorScheme="primary"
          isDisabled={isDisabled}
          onClick={handleSaveAndAddAnother}
          onKeyDown={handleSaveAndAddAnother}
        >
          Save and add another
        </Button>
        <Button
          type="submit"
          isDisabled={isDisabled}
          colorScheme="primary"
          onClick={handleSave}
          onKeyDown={handleSave}
        >
          Submit
        </Button>
      </div>
    </>
  );
}

type DeleteButton = {
  onDelete: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
};

function DeleteButton({ onDelete, isDisabled, isLoading }: DeleteButton) {
  const handleDelete = eventHandler(() => onDelete());

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          isDisabled={isDisabled}
          isLoading={isLoading}
          leftIcon={<TrashIcon className="size-4 stroke-2" />}
          colorScheme="error"
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogTitle>Delete User</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure? You can&apos;t undo this action afterwards.
        </AlertDialogDescription>
        <div className="flex items-center justify-between">
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              colorScheme="error"
              onClick={handleDelete}
              onKeyDown={handleDelete}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
