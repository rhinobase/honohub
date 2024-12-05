"use client";
import { Square3Stack3DIcon } from "@heroicons/react/24/solid";
import { PageHeader, useCollection } from "@honohub/shared";
import { useBoolean } from "@rafty/ui";
import { ExportButton } from "./ExportButton";
import { ExportDialog } from "./ExportDialog";
import { QueryEditor } from "./QueryEditor";
import { QueryRunButton } from "./QueryRunButton";

export default function CollectionQueryPage() {
  const [isOpen, setOpen] = useBoolean();
  const { current: currentCollection } = useCollection();

  return (
    <>
      <PageHeader
        icon={Square3Stack3DIcon}
        title={`Query${
          currentCollection ? ` of ${currentCollection.name.singular}` : ""
        }`}
      >
        <div className="flex-1" />
        <ExportButton onOpenDialog={() => setOpen(true)} />
        <QueryRunButton />
      </PageHeader>
      <QueryEditor />
      {isOpen && (
        <ExportDialog open={isOpen} onOpenChange={() => setOpen(false)} />
      )}
    </>
  );
}
