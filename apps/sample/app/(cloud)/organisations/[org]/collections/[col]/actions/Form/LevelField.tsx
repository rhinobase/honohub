"use client";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import type { collectionActionValidation } from "@honohub/shared";
import {
  Checkbox,
  FieldWrapper,
  InputField,
  Label,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useBoolean,
} from "@rafty/ui";
import { useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type z from "zod";

export function LevelField() {
  const { control } =
    useFormContext<z.infer<typeof collectionActionValidation>>();

  const value = useWatch({ name: "level" });

  return (
    <>
      <Controller
        name="level"
        control={control}
        render={({ field: { value, onChange, ...field } }) => (
          <div className="flex items-center gap-1.5">
            <Checkbox
              id={field.name}
              {...field}
              checked={value as boolean}
              onCheckedChange={onChange}
            />
            <Label htmlFor={field.name}>Is this action disruptive?</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <InformationCircleIcon className="size-4 stroke-2 stroke-secondary-500 dark:stroke-secondary-400 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                A disruptive change is an action that may significantly affect
                your data or system, such as deleting records, making
                irreversible updates, or modifying critical settings. Enabling
                this option will display a warning message to users before
                proceeding with the action.
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      />
      {value && <CustomErrorMessageField />}
    </>
  );
}

function CustomErrorMessageField() {
  const [isCustom, setIsCustom] = useBoolean();
  const {
    register,
    setValue,
    resetField,
    formState: { dirtyFields },
  } = useFormContext<z.infer<typeof collectionActionValidation>>();

  const [label, name] = useWatch({ name: ["label", "name"] });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // @ts-expect-error
    if (isCustom && !dirtyFields?.level?.title) {
      let temp = "";
      if (label) temp = label;
      else if (name) temp = name;

      setValue("level.title", `Confirm ${temp} Action`);
    }
  }, [isCustom, label, name]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isCustom) {
      setValue(
        "level.message",
        "Are you sure you want to perform this action?",
      );
    } else {
      resetField("level.title");
      resetField("level.message");
      setValue("level", true);
    }
  }, [isCustom]);

  return (
    <>
      <div className="flex items-center gap-1.5">
        <Checkbox
          id="customMessage"
          checked={isCustom}
          onCheckedChange={(check) => setIsCustom(check as boolean)}
        />
        <Label htmlFor="customMessage">Customize warning message</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <InformationCircleIcon className="size-4 stroke-2 stroke-secondary-500 dark:stroke-secondary-400 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>
            If you would like to provide a specific warning message for this
            action, enable this option. You can customize the title and
            description that will be shown to the user before they proceed. This
            is useful when you need to give detailed context about the
            consequences of the action.
          </TooltipContent>
        </Tooltip>
      </div>
      {isCustom && (
        <FieldWrapper name="level" label="Level">
          <div className="p-3 md:p-4 lg:p-5 xl:p-6 space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6 rounded-md border border-secondary-200 dark:border-secondary-800">
            <FieldWrapper name="level.title" label="Title" isRequired>
              <InputField {...register("level.title")} />
            </FieldWrapper>
            <FieldWrapper name="label.message" label="Message" isRequired>
              <InputField {...register("level.message")} />
            </FieldWrapper>
          </div>
        </FieldWrapper>
      )}
    </>
  );
}
