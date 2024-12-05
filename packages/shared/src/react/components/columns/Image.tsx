import { eventHandler } from "@rafty/ui";
import { useField } from "duck-form";
import Image from "next/image";
import type { StorageDataType } from "../../../storage";
import { useImageHeader } from "../../providers";
import { getCloudinaryURL } from "../../utils";
import type { ColumnThreadProps } from "./types";

export function ImageCell() {
  const { setContent } = useImageHeader();
  const { value: content } = useField<ColumnThreadProps<StorageDataType>>();

  const handleDialogOpen = eventHandler(() => setContent(content));

  return (
    <div
      className="size-9 cursor-pointer overflow-hidden rounded-md"
      onClick={handleDialogOpen}
      onKeyDown={handleDialogOpen}
    >
      <Image
        src={getCloudinaryURL(content, {
          filters: ["c_thumb", "h_64", "w_64"],
        })}
        alt={content.public_id}
        width={64}
        height={64}
        unoptimized
        className="bg-secondary-100 dark:bg-secondary-900"
      />
    </div>
  );
}
