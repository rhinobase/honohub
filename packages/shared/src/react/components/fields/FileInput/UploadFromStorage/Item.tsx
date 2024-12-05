import { CheckIcon } from "@heroicons/react/24/outline";
import { Tooltip, TooltipContent, TooltipTrigger } from "@rafty/ui";
import Image from "next/image";
import { type HTMLAttributes, forwardRef } from "react";
import {
  type StorageDataType,
  getStorageItemIcon,
} from "../../../../../storage";
import { getCloudinaryURL } from "../../../../utils";

export type UploadFromStorageItem = StorageDataType & {
  isSelected: boolean;
} & Pick<HTMLAttributes<HTMLDivElement>, "onClick" | "onKeyDown">;

export const UploadFromStorageItem = forwardRef<
  HTMLDivElement,
  UploadFromStorageItem
>(function UploadFromStorageItem(props, forwardedRef) {
  let resourceName = props.public_id.split("/").pop();

  if (props.format) resourceName += `.${props.format}`;

  const Icon = getStorageItemIcon(props);

  return (
    <div
      className="cursor-pointer flex flex-col relative h-[180px] md:h-[246px] w-full rounded-lg border border-secondary-200 dark:border-secondary-700"
      onClick={props.onClick}
      onKeyDown={props.onKeyDown}
      ref={forwardedRef}
    >
      {props.isSelected && (
        <div className="absolute z-[60] top-2 right-2 rounded-full p-1 bg-green-500 dark:bg-green-300">
          <CheckIcon className="size-4 stroke-[3] stroke-white dark:stroke-black" />
        </div>
      )}
      <div className="relative h-full w-full bg-secondary-100 dark:bg-secondary-800 overflow-hidden rounded-t-[inherit]">
        {props.resource_type !== "raw" && (
          <Image
            src={getCloudinaryURL(props, {
              filters: ["c_thumb", "h_260", "q_75", "w_260"],
            })}
            alt={props.public_id}
            className="h-full w-full object-cover"
            height={300}
            width={300}
            unoptimized
          />
        )}
        {props.resource_type === "video" && (
          <span className="material-icons-round !text-6xl text-secondary-600 dark:text-secondary-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            play_circle_outline
          </span>
        )}
        {props.resource_type === "raw" && (
          <span className="material-icons-round !text-6xl text-secondary-600 dark:text-secondary-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            raw_on
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 px-3 py-2">
        <Icon className="size-4 text-secondary-600 dark:text-secondary-400" />
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="w-full truncate text-sm">{resourceName}</p>
          </TooltipTrigger>
          <TooltipContent className="max-w-none">{resourceName}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
});
