import { ArrowUpTrayIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@rafty/ui";
import { Link } from "react-router-dom";

export function ProfileMenu() {
  return (
    <Menu>
      <MenuTrigger size="icon" variant="ghost" className="p-1">
        <Avatar size="sm" />
      </MenuTrigger>
      <MenuContent align="end" alignOffset={1} className="space-y-1 z-10">
        <Link to="/settings">
          <MenuItem>
            <Cog6ToothIcon className="size-4 stroke-2" />
            Settings
          </MenuItem>
        </Link>
        <MenuSeparator />
        <MenuItem className="focus:text-red-500 focus:bg-red-200/40 dark:focus:bg-red-300/20 dark:focus:text-red-300">
          <ArrowUpTrayIcon className="size-4 stroke-2 rotate-90" />
          Sign out
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
