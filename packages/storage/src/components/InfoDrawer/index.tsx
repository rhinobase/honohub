import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  classNames,
} from "@rafty/ui";
import { useStorageActions } from "../../providers";
import { getStorageItemIcon } from "../../utils";
import { PropertiesTable } from "./PropertiesTable";

export function InfoDrawer() {
  const { info } = useStorageActions();
  const { findContent } = useContentProps();

  const content = findContent(info.value);

  if (!content) return;

  let resourceName = content.public_id.split("/").pop();
  if (content.format) resourceName += `.${content.format}`;

  return (
    <Drawer
      side="right"
      open={info.value !== undefined}
      onOpenChange={(open) => !open && info.set(undefined)}
    >
      <DrawerOverlay className="z-[60]" />
      <DrawerContent className="max-w-full md:max-w-md z-[60]">
        <div className="mb-5 flex items-center">
          <span className="material-icons-round mr-2 text-xl">
            {getStorageItemIcon(content)}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="w-[320px] truncate font-medium">{resourceName}</p>
            </TooltipTrigger>
            <TooltipContent className="z-50 max-w-none" side="bottom">
              {resourceName}
            </TooltipContent>
          </Tooltip>
        </div>
        <div
          className={classNames(
            content.resource_type === "raw" && "bg-white",
            "relative mb-5 h-[260px] overflow-hidden rounded-lg",
          )}
        >
          {content.resource_type !== "raw" && (
            <img
              src={getCloudinaryURL(content, {
                filters: ["c_thumb", "h_260", "q_75", "w_600"],
              })}
              alt={content.public_id}
              className="h-[260px] w-full object-cover"
            />
          )}
          {content.resource_type === "video" && (
            <span className="material-icons-round !text-6xl text-secondary-600 dark:text-secondary-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              play_circle_outline
            </span>
          )}
          {content.resource_type === "raw" && (
            <span className="material-icons-round !text-6xl text-secondary-600 dark:text-secondary-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              raw_on
            </span>
          )}
        </div>
        <PropertiesTable {...content} />
        <DrawerClose />
      </DrawerContent>
    </Drawer>
  );
}
