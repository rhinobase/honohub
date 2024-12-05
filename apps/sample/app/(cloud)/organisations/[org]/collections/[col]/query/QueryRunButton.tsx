import { PlayIcon } from "@heroicons/react/24/outline";
import type { jsonValidator as schema } from "@honohub/shared";
import { Button } from "@rafty/ui";
import { useFormContext, useWatch } from "react-hook-form";
import type { z } from "zod";
import { FORM_ID } from "./QueryEditor/Form";

export function QueryRunButton() {
  const {
    control,
    formState: { errors },
  } = useFormContext<z.infer<typeof schema>>();
  const icon = <PlayIcon className="size-4 stroke-2" />;

  const query = useWatch({ control, name: "editor" });
  const isDisabled = !query || !!errors.editor;

  return (
    <>
      <Button
        form={FORM_ID}
        type="submit"
        colorScheme="primary"
        leftIcon={icon}
        isDisabled={isDisabled}
        className="hidden md:flex"
      >
        Run
      </Button>
      <Button
        form={FORM_ID}
        type="submit"
        colorScheme="primary"
        size="icon"
        isDisabled={isDisabled}
        className="md:hidden"
      >
        {icon}
      </Button>
    </>
  );
}
