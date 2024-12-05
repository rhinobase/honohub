"use client";
import { CodeHighlighter, CopyButton, useCollection } from "@honohub/shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@rafty/ui";
import { useFormContext, useWatch } from "react-hook-form";

export type ExportDialog = Pick<Dialog, "open" | "onOpenChange">;

export function ExportDialog({ onOpenChange, open }: ExportDialog) {
  const { control } = useFormContext();
  const { current: currentCollection } = useCollection();

  const query = useWatch({ control, name: "editor" });

  const content = `db.getCollection(
  '${currentCollection?._id}'
).aggregate(${JSON.stringify(JSON.parse(query), null, 2)}, {
  maxTimeMS: 60000,
  allowDiskUse: true
})`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Export</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Aggregation on main {currentCollection?.slug}
        </DialogDescription>
        <div className="space-y-1.5">
          <DialogDescription>
            Export results from the aggregation below
          </DialogDescription>
          <div className="p-2 relative bg-white border max-h-96 h-full overflow-y-auto border-secondary-200 dark:border-secondary-800 rounded-md dark:bg-[#0d1117]">
            <CodeHighlighter content={content} language="js" />
            <CopyButton data={content} className="absolute top-2 right-2" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
