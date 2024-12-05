import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import type { jsonValidator as schema } from "@honohub/shared";
import { Button, eventHandler } from "@rafty/ui";
import { useFormContext, useWatch } from "react-hook-form";
import type z from "zod";

export type ExportButton = {
  onOpenDialog: () => void;
};

export function ExportButton({ onOpenDialog }: ExportButton) {
  const {
    control,
    formState: { errors },
  } = useFormContext<z.infer<typeof schema>>();
  const icon = <ArrowTopRightOnSquareIcon className="size-4 stroke-2" />;

  const query = useWatch({ control, name: "editor" });
  const isDisabled = !query || !!errors.editor;

  const handleOpenDialog = eventHandler(() => onOpenDialog());

  return (
    <>
      <Button
        leftIcon={icon}
        isDisabled={isDisabled}
        onClick={handleOpenDialog}
        onKeyDown={handleOpenDialog}
        className="hidden md:flex"
      >
        Export
      </Button>
      <Button
        size="icon"
        isDisabled={isDisabled}
        onClick={handleOpenDialog}
        onKeyDown={handleOpenDialog}
        className="md:hidden"
      >
        {icon}
      </Button>
    </>
  );
}
