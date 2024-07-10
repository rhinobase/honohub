"use client";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { Avatar, Menu, MenuContent, MenuItem, MenuTrigger } from "@rafty/ui";

export function ProfileMenu() {
  return (
    <Menu>
      <MenuTrigger variant="ghost" className="rounded-full p-2">
        <Avatar />
      </MenuTrigger>
      <MenuContent side="right" align="end" className="min-w-[11rem] space-y-1">
        <MenuItem className="focus:text-red-500 focus:bg-red-200/40 dark:focus:text-red-300 dark:focus:bg-red-300/10">
          <ArrowLeftCircleIcon className="size-5" />
          Logout
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
