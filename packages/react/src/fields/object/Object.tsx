import { Thread, useThread } from "@fibr/react";
import type { Prettify } from "honohub";
import type { FieldProps, ObjectProps } from "../types";

export function ObjectField<
  T extends Record<string, FieldProps> = Record<string, FieldProps>,
>() {
  const { id, blocks } = useThread<Prettify<ObjectProps<T>>>();

  return (
    <>
      {Object.entries(blocks).map(([block, blockProps]) => (
        <Thread id={`${id}.${block}`} key={block} {...blockProps} />
      ))}
    </>
  );
}
