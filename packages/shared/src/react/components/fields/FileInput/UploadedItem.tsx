import {
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, eventHandler } from "@rafty/ui";
import Image from "next/image";
import Link from "next/link";
import type { StorageDataType } from "../../../../storage";
import { getCloudinaryURL } from "../../../utils";

export type UploadedItem = {
  content: StorageDataType;
  onRemove: () => void;
};

export function UploadedItem({ content, onRemove }: UploadedItem) {
  let resourceName = content.public_id.split("/").pop();

  if (content.format) resourceName += `.${content.format}`;

  const handleRemoveItem = eventHandler(() => onRemove());

  return (
    <div className="mt-1 flex w-full items-center gap-2 overflow-hidden rounded-lg border border-secondary-200 dark:border-secondary-800">
      <div className="relative h-16 w-16 bg-secondary-100 dark:bg-secondary-900">
        {content.resource_type !== "raw" && (
          <Image
            src={getCloudinaryURL(content, {
              filters: ["c_thumb", "h_64", "q_75", "w_64"],
            })}
            alt={content.public_id ?? ""}
            width={64}
            height={64}
            className="size-16 object-cover transition-all ease-in-out hover:opacity-80"
            unoptimized
          />
        )}
        {content.resource_type === "video" && (
          <span className="material-icons-round !text-xl text-secondary-600 dark:text-secondary-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            play_circle_outline
          </span>
        )}
        {content.resource_type === "raw" && (
          <span className="material-icons-round !text-[40px] text-secondary-600 dark:text-secondary-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            raw_on
          </span>
        )}
      </div>
      <div className="flex w-full items-center gap-2 px-3 py-2">
        <p className="truncate">{resourceName}</p>
        <div className="flex-1" />
        <Link
          href={getCloudinaryURL(content, { raw: true, filters: [] })}
          target="_blank"
          rel="noopener"
        >
          <Button variant="ghost" size="icon">
            <ArrowTopRightOnSquareIcon className="size-4 stroke-2" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemoveItem}
          onKeyDown={handleRemoveItem}
        >
          <XMarkIcon className="size-4 stroke-2" />
        </Button>
      </div>
    </div>
  );
}
