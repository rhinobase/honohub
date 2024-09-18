import type { eventHandler } from "@rafty/ui";
import { forwardRef } from "react";
import { StorageContextMenu } from "../ContextMenu";

export type ListCard = {
  name: string;
  type: string;
  handleDialogOpen: ReturnType<typeof eventHandler>;
} & Omit<StorageContextMenu, "className">;

export const ListCard = forwardRef<HTMLDivElement, ListCard>(function ListCard(
  { name, type, publicId, isPrivate, handleDialogOpen },
  forwardedRef,
) {
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
        {type !== "raw" && (
          <img
            src={getCloudinaryURL(props, {
              filters: ["c_thumb", "h_64", "q_75", "w_64"],
            })}
            alt={publicId}
            className="h-16 w-16 object-cover transition-all ease-in-out hover:opacity-80"
          />
        )}
        {type === "video" && (
          <span className="material-icons-round !text-3xl text-secondary-600 dark:text-secondary-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            play_circle_outline
          </span>
        )}
        {type === "raw" && (
          <span className="material-icons-round !text-[40px] text-secondary-600 dark:text-secondary-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            raw_on
          </span>
        )}
      </div>
      <div className="flex w-full items-center gap-2 px-3 py-2">
        <p className="truncate text-sm">{name}</p>
        <div className="flex-1" />
        <StorageContextMenu publicId={publicId} isPrivate={isPrivate} />
      </div>
    </div>
  );
});
