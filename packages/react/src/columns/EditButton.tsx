import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@rafty/ui";
import { Link, useLocation } from "react-router-dom";
import { CellWrapper } from "./CellWrapper";

export function EditButton({ cell }: any) {
  const { pathname } = useLocation();

  const value = String(cell?.getValue());

  return (
    <CellWrapper value={value}>
      <Menu>
        <MenuTrigger variant="ghost" size="icon">
          <EllipsisVerticalIcon width={16} height={16} className="stroke-2" />
        </MenuTrigger>
        <MenuContent align="start" side="right" className="min-w-32">
          <Link to={`${pathname}/${value}`}>
            <MenuItem>Edit</MenuItem>
          </Link>
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Menu>
    </CellWrapper>
  );
}
