import { DocumentIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@rafty/ui";
import { useContentProps } from "../../hooks";
import { useStorage, useStorageActions } from "../../providers";
import { getStorageItemIcon } from "../../utils";
import { PropertiesTable } from "./PropertiesTable";

export function InfoDrawer() {
  const { generateURL, imageRender: Img } = useStorage();
  const { info } = useStorageActions();
  const { findContent } = useContentProps();

  const content = findContent(info.value);

  if (!content) return;

  let resourceName = content.public_id.split("/").pop();
  if (content.format) resourceName += `.${content.format}`;

  const Icon = getStorageItemIcon(content);

  return (
    <Drawer
      side="right"
      open={info.value !== undefined}
      onOpenChange={(open) => !open && info.set(undefined)}
    >
      <DrawerOverlay className="z-[60]" />
      <DrawerContent className="max-w-full md:max-w-md z-[60] dark:bg-secondary-900">
        <div className="mb-5 flex items-center">
          <Icon className="size-6 stroke-2 mr-2" />
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="w-[320px] truncate font-medium">{resourceName}</p>
            </TooltipTrigger>
            <TooltipContent className="z-50 max-w-none" side="bottom">
              {resourceName}
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="relative mb-5 h-[260px] overflow-hidden rounded-lg bg-secondary-100 dark:bg-secondary-800">
          {content.resource_type !== "raw" && (
            <Img
              src={generateURL({
                content,
                filters: {
                  crop: "thumb",
                  height: 260,
                  quality: 75,
                  width: 600,
                },
              })}
              alt={content.public_id}
              className="h-[260px] w-full object-cover"
              height={260}
              width={600}
            />
          )}
          {content.resource_type === "video" && (
            <PlayCircleIcon className="size-16 stroke-2 stroke-secondary-600 dark:stroke-secondary-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          )}
          {content.resource_type === "raw" && (
            <DocumentIcon className="size-16 stroke-2 stroke-secondary-600 dark:stroke-secondary-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>
        <PropertiesTable {...content} />
        <DrawerClose />
      </DrawerContent>
    </Drawer>
  );
}
