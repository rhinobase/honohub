import { DocumentIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import type { eventHandler } from "@rafty/ui";
import { forwardRef } from "react";
import { useStorage } from "../../providers";
import type { StorageDataType } from "../../types";
import { StorageContextMenu } from "../ContextMenu";

export type ListCard = StorageDataType & {
  name: string;
  handleDialogOpen: ReturnType<typeof eventHandler>;
};

export const ListCard = forwardRef<HTMLDivElement, ListCard>(function ListCard(
  { name, handleDialogOpen, ...props },
  forwardedRef,
) {
  const { generateURL, imageRender: Img } = useStorage();

  return (
    <div
      className="flex w-full items-center gap-2 overflow-hidden rounded-lg border border-secondary-200 dark:border-secondary-800"
      ref={forwardedRef}
    >
      <div
        className="relative h-16 w-16 cursor-pointer bg-secondary-100 dark:bg-secondary-900"
        onClick={handleDialogOpen}
        onKeyDown={handleDialogOpen}
      >
        {props.resource_type !== "raw" && (
          <Img
            src={generateURL({
              content: props,
              filters: { crop: "thumb", height: 64, quality: 75, width: 64 },
            })}
            alt={props.public_id}
            className="size-16 object-cover transition-all ease-in-out hover:opacity-80"
            height={64}
            width={64}
          />
        )}
        {props.resource_type === "video" && (
          <PlayCircleIcon className="size-9 stroke-2 stroke-secondary-600 dark:stroke-secondary-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
        {props.resource_type === "raw" && (
          <DocumentIcon className="size-9 stroke-2 stroke-secondary-600 dark:stroke-secondary-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
      <div className="flex w-full items-center gap-2 px-3 py-2">
        <p className="w-full truncate text-sm">{name}</p>
        <StorageContextMenu {...props} />
      </div>
    </div>
  );
});
