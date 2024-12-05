"use client";
import { mongoIDValidation } from "../validations";
import { ErrorComponent } from "@honohub/shared";
import { useParams } from "next/navigation";
import type { PropsWithChildren } from "react";

export function IDValidator(props: PropsWithChildren) {
  const { id: docID } = useParams();
  const { success } = mongoIDValidation.safeParse(docID);

  if (docID && !success)
    return (
      <ErrorComponent>
        `{docID}` is not a valid ID for this collection!
      </ErrorComponent>
    );

  return props.children;
}
