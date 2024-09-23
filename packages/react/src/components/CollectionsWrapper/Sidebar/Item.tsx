import { highlightMatches } from "@honohub/shared";
import { classNames } from "@rafty/ui";
import type { RangeTuple } from "fuse.js";
import { NavLink } from "react-router-dom";
import type { CollectionType } from "../../../types";
import { getPluralLabel } from "../../../utils";

export type SidebarItem = Pick<CollectionType, "label"> & {
  link: string;
  matches?: RangeTuple[];
};

export function SidebarItem({ link, label, matches }: SidebarItem) {
  const title = getPluralLabel(label);

  return (
    <NavLink
      title={title}
      to={link}
      className={({ isActive }) =>
        classNames(
          "cursor-pointer outline-none no-underline flex w-full items-center gap-2 mb-2 px-3 py-1 min-h-10 rounded-md min-w-0 select-none transition-all ease-in-out",
          isActive
            ? "bg-primary-100 text-primary-600 dark:bg-secondary-700/80 dark:text-white"
            : "text-secondary-600 dark:text-secondary-400 hover:text-black dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-secondary-800/80",
        )
      }
    >
      <p className="font-semibold text-sm leading-none capitalize">
        {highlightMatches(title, matches)}
      </p>
    </NavLink>
  );
}
