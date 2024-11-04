import {
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  classNames,
  eventHandler,
} from "@rafty/ui";
import { useContentProps } from "../../hooks";
import { useStorage, useStorageActions } from "../../providers";
import type { StorageDataType } from "../../types";
import { getStorageItemIcon } from "../../utils";
import { StorageContextMenu } from "../ContextMenu";
import { ImageDisplay } from "./ImageDisplay";
import { PdfDisplay } from "./PdfDisplay";
import { VideoDisplay } from "./VideoDisplay";

export function ContentDialog() {
  const { generateURL } = useStorage();
  const { view } = useStorageActions();
  const { findContent, getNext, getPrevious } = useContentProps();

  const content = findContent(view.value);

  if (!content) return;

  const nextContentId = getNext(view.value);
  const previousContentId = getPrevious(view.value);

  const handleGoToNext = eventHandler(() => view.set(nextContentId));
  const handleGoToPrevious = eventHandler(() => view.set(previousContentId));

  const Icon = getStorageItemIcon(content);

  return (
    <Dialog
      size="xl"
      open={view.value !== undefined}
      onOpenChange={(open) => !open && view.set(undefined)}
    >
      <DialogOverlay className="bg-black/50 dark:bg-black/70" />
      <DialogContent
        isUnstyled
        className="fixed left-1/2 top-1/2 z-50 h-screen w-full -translate-x-1/2 -translate-y-1/2"
        showCloseButton={false}
      >
        {previousContentId && (
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-10 top-[85%] z-[100] md:top-1/2"
            onClick={handleGoToPrevious}
            onKeyDown={handleGoToPrevious}
          >
            <ChevronLeftIcon className="size-7 stroke-2 stroke-white" />
          </Button>
        )}
        {nextContentId && (
          <Button
            variant="ghost"
            size="icon"
            className="fixed right-10 top-[85%] z-[100] md:top-1/2"
            onClick={handleGoToNext}
            onKeyDown={handleGoToNext}
          >
            <ChevronRightIcon className="size-7 stroke-2 stroke-white" />
          </Button>
        )}
        <div className="h-full w-full flex flex-col">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <Icon className="size-6 stroke-2 text-white" />
            <p className="truncate text-xl font-medium text-white">
              {`${content.public_id.split("/").pop()}.${content.format}`}
            </p>
            <div className="flex-1" />
            <a
              download={`${content.public_id.split("/").pop()}.${
                content.format
              }`}
              href={generateURL({ content })}
              target="_blank"
              rel="noreferrer"
            >
              <Button aria-label="close" variant="ghost" size="icon">
                <ArrowDownTrayIcon className="size-5 stroke-2 stroke-white" />
              </Button>
            </a>
            <StorageContextMenu
              {...content}
              className="[&>svg]:size-5 [&>svg]:stroke-white"
            />
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <XMarkIcon className="size-5 stroke-2 stroke-white" />
              </Button>
            </DialogClose>
          </div>
          <div className="w-full h-full flex overflow-y-auto">
            <div className="max-w-5xl mx-auto mb-3">{findDisplay(content)}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function findDisplay(props: StorageDataType) {
  switch (props.format) {
    case "pdf":
      return <PdfDisplay {...props} />;
    default:
      break;
  }

  switch (props.resource_type) {
    case "video":
      return <VideoDisplay {...props} />;
    case "image":
      return <ImageDisplay {...props} />;
    case "raw":
      return (
        <div className="flex h-full items-center justify-center">
          <Alert status="info" className="max-w-[500px]">
            <AlertIcon />
            <AlertTitle>Not supported format</AlertTitle>
            <AlertDescription>
              Currently this format is not support by Rhinobase Space to display
              here. You can access the resource from the link.
            </AlertDescription>
          </Alert>
        </div>
      );
    default:
      return (
        <div className="flex h-full items-center justify-center">
          <Alert status="error" className="max-w-[500px]">
            <AlertIcon />
            <AlertTitle>No displayer found</AlertTitle>
            <AlertDescription>
              There was an error processing this asset. We were unable to
              identify the component to display this asset. This is most likely
              a bug, you should connect to your admin team or contact for help!
            </AlertDescription>
          </Alert>
        </div>
      );
  }
}
