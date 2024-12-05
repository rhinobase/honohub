"use client";
import type { GeneralWrapperProps } from "@duck-form/fields";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
  useBoolean,
} from "@rafty/ui";
import { useBlueprint, useDuckForm, useField } from "duck-form";
import { useId, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { UploadFromDevice } from "./UploadFromDevice";
import { UploadFromStorage } from "./UploadFromStorage";
import { UploadedItem } from "./UploadedItem";
import type { FileInputFieldProps } from "./types";

export type { FileInputFieldProps } from "./types";

export function FileInputField() {
  const props = useField<GeneralWrapperProps<FileInputFieldProps>>();
  const { generateId } = useDuckForm();
  const { schema } = useBlueprint();

  const autoId = useId();
  const customId = useMemo(
    () => generateId?.(schema, props),
    [generateId, schema, props],
  );

  const id = customId ?? autoId;

  const [isOpen, setOpen] = useBoolean();

  const { control, setValue } = useFormContext();

  const fieldValue = useWatch({ control, name: id });

  const isMultiple = props.options?.multiple ?? false;

  const deleteUploaded = (index: number) => {
    if (fieldValue) {
      if (isMultiple) {
        fieldValue.splice(index, 1);
        setValue(id, [...fieldValue]);
      } else setValue(id, undefined);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogTrigger
          variant="solid"
          colorScheme="primary"
          leftIcon={<ArrowUpTrayIcon className="size-4 stroke-2" />}
          isDisabled={
            props.disabled ??
            ((!isMultiple && fieldValue?.length === 1) || props.readonly)
          }
          isHidden={props.hidden}
          className="w-max"
        >
          Choose / upload {isMultiple ? "files" : "file"}
        </DialogTrigger>
        <DialogOverlay />
        <DialogContent className="p-4 gap-4">
          <DialogTitle>Upload from</DialogTitle>
          <div className="flex w-full gap-4">
            <UploadFromDevice handleDialogClose={() => setOpen(false)} />
            <UploadFromStorage
              id={id}
              handleDialogClose={() => setOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
      {fieldValue &&
        Array.from(isMultiple ? fieldValue : [fieldValue]).map(
          // @ts-expect-error
          (content: UploadedItem["content"], index) => (
            <UploadedItem
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              content={content}
              onRemove={() => deleteUploaded(index)}
            />
          ),
        )}
    </div>
  );
}
