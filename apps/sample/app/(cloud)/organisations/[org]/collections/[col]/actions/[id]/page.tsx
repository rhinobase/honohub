"use client";
import { PageHeader, useCollectionActionDocument } from "@honohub/shared";
import { FormMode } from "@honohub/shared";
import { CollectionActionForm } from "../Form";

export default function CollectionActionDocumentPage() {
  const { data, isLoading } = useCollectionActionDocument();

  return (
    <>
      <PageHeader title="Update Collection Action" />
      <CollectionActionForm
        mode={FormMode.UPDATE}
        data={data}
        isLoading={isLoading}
      />
    </>
  );
}
