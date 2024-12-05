"use client";
import { Bars3BottomRightIcon } from "@heroicons/react/24/outline";
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuTrigger,
  eventHandler,
} from "@rafty/ui";
import { parseAsArrayOf, parseAsStringLiteral, useQueryState } from "nuqs";
import { HistoryAction } from "../types";

const FILTERS = {
  create: HistoryAction.CREATE,
  update: HistoryAction.UPDATE,
  delete: HistoryAction.DELETE,
  action: HistoryAction.ACTION,
};

const FILTER_NAME = Object.values(FILTERS);

export function ActivitiesActionFilterMenu() {
  const [queryParam, setQueryParam] = useQueryState(
    "action",
    parseAsArrayOf(parseAsStringLiteral(FILTER_NAME)),
  );

  return (
    <Menu size="sm">
      <MenuTrigger size="icon" variant="ghost" className="p-1">
        <Bars3BottomRightIcon className="size-4 stroke-2" />
      </MenuTrigger>
      <MenuContent
        align="end"
        className="z-50 dark:bg-secondary-900 dark:[&>span>svg]:fill-secondary-900 min-w-[10rem]"
      >
        {Object.entries(FILTERS).map(([key, value]) => {
          const handleCheckState = eventHandler(() =>
            setQueryParam((values) => {
              const tmp = values ? [...values] : [];

              const index = tmp.findIndex((item) => item === value);
              if (index > -1) tmp.splice(index, 1);
              else tmp.push(value);

              if (tmp.length === 0) return null;

              return tmp;
            }),
          );

          return (
            <MenuCheckboxItem
              key={key}
              checked={queryParam?.includes(value)}
              onClick={handleCheckState}
              onKeyDown={handleCheckState}
              className="capitalize [&>span>svg]:stroke-primary-500 dark:[&>span>svg]:stroke-primary-300"
            >
              {key}
            </MenuCheckboxItem>
          );
        })}
      </MenuContent>
    </Menu>
  );
}
