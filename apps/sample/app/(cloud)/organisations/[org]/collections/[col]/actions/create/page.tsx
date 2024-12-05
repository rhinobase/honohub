"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { FormMode, PageHeader } from "@honohub/shared";
import { CollectionActionForm } from "../Form";

export default function CollectionActionCreatePage() {
  return (
    <>
      <PageHeader title="Create Collection Action" icon={PlusIcon} />
      <CollectionActionForm mode={FormMode.CREATE} />
    </>
  );
}
