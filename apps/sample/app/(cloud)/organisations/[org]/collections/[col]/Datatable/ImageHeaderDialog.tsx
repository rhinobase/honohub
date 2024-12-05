import {
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getCloudinaryURL, useImageHeader } from "@honohub/shared";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
} from "@rafty/ui";
import Image from "next/image";

export function ImageHeaderDialog() {
  const { content, setContent } = useImageHeader();

  if (!content) return;

  let name: string;
  if (content._type === "unsplash") name = "Image from unsplash";
  else name = content.public_id.split("/").pop() ?? "Image";

  if (content.format) name += `.${content.format}`;

  return (
    <Dialog
      open={content != null}
      size="lg"
      onOpenChange={(open) => !open && setContent(undefined)}
    >
      <DialogOverlay />
      <DialogContent
        className="overflow-hidden p-0 gap-0 w-max md:w-max flex flex-col h-max"
        showCloseButton={false}
        style={{ maxHeight: "90%" }}
      >
        <DialogHeader className="p-3 gap-2">
          <h2>{name}</h2>
          <div className="flex-1" />
          <a
            href={
              content._type === "unsplash"
                ? content._ref
                : getCloudinaryURL(content, { filters: [] })
            }
            target="_blank"
            rel="noreferrer"
          >
            <Button size="icon" variant="ghost" className="p-1.5 md:p-2">
              <ArrowTopRightOnSquareIcon className="size-4 md:size-5 stroke-2" />
            </Button>
          </a>
          <DialogClose asChild>
            <Button size="icon" variant="ghost" className="p-1.5 md:p-2">
              <XMarkIcon className="size-4 md:size-5 stroke-2" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <Image
          width={1000}
          height={1000}
          src={getCloudinaryURL(content, {
            filters: ["c_thumb", "q_75"],
          })}
          alt={content.public_id}
          unoptimized
          className="mx-auto"
        />
      </DialogContent>
    </Dialog>
  );
}
