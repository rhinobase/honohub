import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  CollectionIndexFieldType,
  type collectionIndexValidation as schema,
} from "@honohub/shared";
import {
  Button,
  FieldWrapper,
  InputField,
  Select,
  SelectItem,
  eventHandler,
} from "@rafty/ui";
import { useFieldArray, useFormContext } from "react-hook-form";
import type z from "zod";

const TYPE_OPTONS = {
  [CollectionIndexFieldType.ASC]: "1(asc)",
  [CollectionIndexFieldType.DESC]: "-1(desc)",
  [CollectionIndexFieldType.SPHERE]: "2dsphere",
  [CollectionIndexFieldType.TEXT]: "text",
};

export function IndexFieldsField() {
  const { control, register } = useFormContext<z.infer<typeof schema>>();

  const { fields, insert, remove } = useFieldArray({
    name: "fields",
    control,
  });

  return (
    <FieldWrapper name="fields" label="Index Fields" isRequired>
      <div className="flex flex-col gap-1.5 -m-3 p-3 max-h-[200px] overflow-y-auto">
        {fields.map((field, index, arr) => {
          const handleAdd = eventHandler(() =>
            // @ts-expect-error
            insert(index + 1, { name: "", type: "" }),
          );

          const handleRemove = eventHandler(() => remove(index));

          return (
            <div key={field.id} className="flex items-center gap-1.5">
              <InputField
                {...register(`fields.${index}.name`)}
                placeholder="Type a field name"
              />
              <Select
                {...register(`fields.${index}.type`)}
                placeholder="Select a type"
                className="min-w-[150px]"
              >
                {Object.entries(TYPE_OPTONS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </Select>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleAdd}
                onKeyDown={handleAdd}
              >
                <PlusIcon className="size-4 stroke-[3]" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                isDisabled={arr.length <= 1}
                onClick={handleRemove}
                onKeyDown={handleRemove}
              >
                <MinusIcon className="size-4 stroke-[3]" />
              </Button>
            </div>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
