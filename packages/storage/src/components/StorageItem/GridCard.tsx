import { DocumentIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type eventHandler,
} from "@rafty/ui";
import { forwardRef } from "react";
import { useStorage } from "../../providers";
import type { StorageDataType } from "../../types";
import { getStorageItemIcon } from "../../utils";
import { StorageContextMenu } from "../ContextMenu";

export type GridCard = StorageDataType & {
  name: string;
  handleDialogOpen: ReturnType<typeof eventHandler>;
};

export const GridCard = forwardRef<HTMLDivElement, GridCard>(function GridCard(
  { name, handleDialogOpen, ...props },
  forwardedRef,
) {
  const { generateURL, imageRender: Img } = useStorage();
  const Icon = getStorageItemIcon(props);

  return (
    <div
      className="min-h-[100px] w-full overflow-hidden rounded-lg border border-secondary-200 dark:border-secondary-800"
      ref={forwardedRef}
    >
      <div
        className="relative h-[258px] w-full cursor-pointer bg-secondary-100 dark:bg-secondary-900"
        onClick={handleDialogOpen}
        onKeyDown={handleDialogOpen}
      >
        {props.resource_type !== "raw" && (
          <Img
            src={generateURL({
              content: props,
              filters: { crop: "thumb", height: 260, quality: 75, width: 260 },
            })}
            alt={props.public_id}
            className="h-[258px] w-full object-cover transition-all ease-in-out hover:opacity-80"
            height={260}
            width={260}
          />
        )}
        {props.resource_type === "video" && (
          <PlayCircleIcon className="size-16 stroke-2 stroke-secondary-600 dark:stroke-secondary-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
        {props.resource_type === "raw" && (
          <DocumentIcon className="size-16 stroke-2 stroke-secondary-600 dark:stroke-secondary-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
      <div className="flex items-center gap-3 px-3 py-2">
        <Icon className="size-6 stroke-2 stroke-secondary-600 dark:stroke-secondary-400" />
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="w-full text-sm truncate select-none">{name}</p>
          </TooltipTrigger>
          <TooltipContent className="max-w-none">{name}</TooltipContent>
        </Tooltip>
        <StorageContextMenu {...props} />
      </div>
    </div>
  );
});
