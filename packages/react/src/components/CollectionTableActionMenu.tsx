import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@rafty/ui";
import { Link, useLocation } from "react-router-dom";

export type CollectionTableActionMenu = { id: string; onDelete: () => void };

export function CollectionTableActionMenu({
  id,
  onDelete,
}: CollectionTableActionMenu) {
  const { pathname } = useLocation();

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
          onClick={onDelete}
          onKeyDown={onDelete}
          className="focus:text-red-500 focus:bg-red-200/40 dark:focus:text-red-300 dark:focus:bg-red-300/10"
        >
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
