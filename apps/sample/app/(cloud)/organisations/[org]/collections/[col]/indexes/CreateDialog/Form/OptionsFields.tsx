import { ChevronDownIcon } from "@heroicons/react/24/outline";
import type { collectionIndexValidation as schema } from "@honohub/shared";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Checkbox,
  FieldWrapper,
  InputField,
  Label,
  useBoolean,
  useFieldControlContext,
} from "@rafty/ui";
import { Controller, useFormContext } from "react-hook-form";
import type z from "zod";

export function OptionsFields() {
  return (
    <Accordion size="sm" variant="ghost" type="single" collapsible>
      <AccordionItem value="options">
        <AccordionTrigger
          showIcon={false}
          className="justify-start gap-1 text-base"
        >
          <ChevronDownIcon className="stroke-secondary-600 dark:stroke-secondary-400 shrink-0 -rotate-90 stroke-[3] transition-transform duration-200 group-data-[state=open]:rotate-0 size-4" />
          Options
        </AccordionTrigger>
        <AccordionContent className="px-0">
          <div className="p-3 space-y-3">
            <FieldWrapper name="options.unique">
              <OptionsUniqueIndexField />
            </FieldWrapper>
            <FieldWrapper name="options.name">
              <OptionNameField />
            </FieldWrapper>
            <FieldWrapper name="options.maxTimeMS">
              <OptionsMaxTimeField />
            </FieldWrapper>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function OptionsUniqueIndexField() {
  const { control } = useFormContext<z.infer<typeof schema>>();

  const fieldControlContext = useFieldControlContext();

  const name = fieldControlContext.name as keyof z.infer<typeof schema>;

  return (
    <div className="flex gap-2 relative">
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange, ...field } }) => (
          <Checkbox
            {...field}
            id={name}
            size="sm"
            // @ts-expect-error
            checked={value}
            onCheckedChange={onChange}
          />
        )}
      />
      <div className="-mt-0.5">
        <Label htmlFor={name}>Create unique index</Label>
        <p className="text-xs">
          A unique index ensures that the indexed fields do not store duplicate
          values; i.e. enforces uniqueness for the indexed fields.
        </p>
      </div>
    </div>
  );
}

function OptionNameField() {
  const [isChecked, setChecked] = useBoolean();

  const { register } = useFormContext<z.infer<typeof schema>>();
  const fieldControlContext = useFieldControlContext();

  const name = fieldControlContext.name as keyof z.infer<typeof schema>;

  return (
    <>
      <div className="flex gap-2 relative">
        <Checkbox
          id={name}
          size="sm"
          checked={isChecked}
          onCheckedChange={(check) => setChecked(check as boolean)}
        />
        <div className="-mt-0.5">
          <Label htmlFor={name}>Index name</Label>
          <p className="text-xs">
            Enter the name of the index to create, or leave blank to have
            MangoDB create a default name for the index.
          </p>
        </div>
      </div>
      {isChecked && <InputField {...register(name)} />}
    </>
  );
}

function OptionsMaxTimeField() {
  const [isChecked, setChecked] = useBoolean();

  const { register } = useFormContext<z.infer<typeof schema>>();
  const fieldControlContext = useFieldControlContext();

  const name = fieldControlContext.name as keyof z.infer<typeof schema>;

  return (
    <>
      <div className="flex gap-2 relative">
        <Checkbox
          id={name}
          size="sm"
          checked={isChecked}
          onCheckedChange={(check) => setChecked(check as boolean)}
        />
        <div className="-mt-0.5">
          <Label htmlFor={name}>Create TTL</Label>
          <p className="text-xs">
            TTL indexes are special single-field indexes that MongoDB can use to
            automatically remove documents from a collection after a certain
            amount of time or at a specific clock time.
          </p>
        </div>
      </div>
      {isChecked && (
        <>
          <Label>Seconds</Label>
          <InputField
            type="number"
            min={0}
            max={2147483647}
            {...register(name, { valueAsNumber: true })}
          />
        </>
      )}
    </>
  );
}
