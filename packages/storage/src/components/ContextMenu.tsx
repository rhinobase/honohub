"use client";
import {
  EllipsisVerticalIcon,
  InformationCircleIcon,
  LinkIcon,
  LockClosedIcon,
  LockOpenIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@rafty/ui";
import type { HTMLAttributes } from "react";
import toast from "react-hot-toast";
import { useStorageActions } from "../providers";

export type StorageContextMenu = {
  className?: HTMLAttributes<HTMLDivElement>["className"];
  publicId: string;
  isPrivate: boolean;
};

export function StorageContextMenu({
  publicId,
  isPrivate,
  className,
}: StorageContextMenu) {
  const { info, rename, remove } = useStorageActions();

  const handleInfoDrawerOpen = () => info.set(publicId);

  const PrivateFileIcon = isPrivate ? LockOpenIcon : LockClosedIcon;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      getCloudinaryURL(props, {
        filters: [],
        raw: true,
      }),
    );
    toast.success("Resource link copied!");
  };

  const handleRename = () => rename.set(publicId);

  const handleRemove = () => remove.set(publicId);

  return (
    <Menu>
      <MenuTrigger variant="ghost" size="icon" className={className}>
        <EllipsisVerticalIcon className="size-4 stroke-2" />
      </MenuTrigger>
      <MenuContent align="start" side="right" className="z-50">
        <MenuItem
          onClick={handleInfoDrawerOpen}
          onKeyDown={handleInfoDrawerOpen}
        >
          <InformationCircleIcon className="size-4 stroke-2" />
          View details
        </MenuItem>
        <MenuItem disabled>
          <PrivateFileIcon className="size-4 stroke-2" />
          Make file {isPrivate ? "public" : "private"}
        </MenuItem>
        <MenuItem onClick={handleCopyLink} onKeyDown={handleCopyLink}>
          <LinkIcon className="size-4 stroke-2" />
          Get link
        </MenuItem>
        <MenuItem onClick={handleRename} onKeyDown={handleRename}>
          <PencilSquareIcon className="size-4 stroke-2" />
          Rename
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          className="focus:text-red-500 focus:bg-red-200/40 dark:focus:bg-red-300/20 dark:focus:text-red-300"
          onClick={handleRemove}
          onKeyDown={handleRemove}
        >
          <TrashIcon className="size-4 stroke-2" />
          Remove
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
