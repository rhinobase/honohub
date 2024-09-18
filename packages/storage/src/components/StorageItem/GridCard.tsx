import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type eventHandler,
} from "@rafty/ui";
import { forwardRef } from "react";
import { StorageContextMenu } from "../ContextMenu";

export type GridCard = {
  name: string;
  type: string;
  handleDialogOpen: ReturnType<typeof eventHandler>;
} & Omit<StorageContextMenu, "className">;

export const GridCard = forwardRef<HTMLDivElement, GridCard>(function GridCard(
  { name, handleDialogOpen, isPrivate, publicId, type },
  forwardedRef,
) {
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
        {type !== "raw" && (
          <img
            src={getCloudinaryURL(props, {
              filters: ["c_thumb", "h_260", "q_75", "w_260"],
            })}
            alt={publicId}
            className="h-[258px] w-full object-cover transition-all ease-in-out hover:opacity-80"
          />
        )}
        {type === "video" && (
          <span className="material-icons-round !text-6xl text-secondary-600 dark:text-secondary-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            play_circle_outline
          </span>
        )}
        {type === "raw" && (
          <span className="material-icons-round !text-8xl text-secondary-600 dark:text-secondary-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            raw_on
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 px-3 py-2">
        <span className="material-icons-round text-secondary-600 dark:text-secondary-400 select-none">
          {getStorageItemIcon(props)}
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="w-full text-sm truncate select-none">{name}</p>
          </TooltipTrigger>
          <TooltipContent className="max-w-none">{name}</TooltipContent>
        </Tooltip>
        <div className="flex-1" />
        <StorageContextMenu publicId={publicId} isPrivate={isPrivate} />
      </div>
    </div>
  );
});
