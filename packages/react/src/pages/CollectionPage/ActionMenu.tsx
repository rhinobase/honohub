import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  eventHandler,
} from "@rafty/ui";
import { Link, useLocation } from "react-router-dom";

export type ActionMenu = { id: string; onDelete: () => void };

export function ActionMenu({ id, onDelete }: ActionMenu) {
  const { pathname } = useLocation();

  const handleDeleteCollection = eventHandler(() => {
    onDelete();
  });

  return (
    <Menu>
      <MenuTrigger variant="ghost" size="icon">
        <EllipsisVerticalIcon width={16} height={16} className="stroke-2" />
      </MenuTrigger>
      <MenuContent align="start" side="right" className="min-w-32">
        <Link to={`${pathname}/${id}`}>
          <MenuItem>Edit</MenuItem>
        </Link>
        <MenuItem
          onClick={handleDeleteCollection}
          onKeyDown={handleDeleteCollection}
          className="focus:text-red-500 focus:bg-red-200/40 dark:focus:text-red-300 dark:focus:bg-red-300/10"
        >
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
