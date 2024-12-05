import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  classNames,
  eventHandler,
} from "@rafty/ui";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import type { ReactNode } from "react";

export type OptionsMenu = {
  queryKey: unknown[];
  menuOptions?: { label: ReactNode; href: string }[];
};

export function OptionsMenu({ queryKey, menuOptions }: OptionsMenu) {
  const queryClient = useQueryClient();

  const handleRefresh = eventHandler(() => {
    queryClient.refetchQueries({
      queryKey,
    });
  });

  const queriesFetching = useIsFetching({
    queryKey,
  });

  const isFetching = queriesFetching > 0;

  return (
    <Menu>
      <MenuTrigger variant="ghost" size="icon" className="p-1.5 md:p-2">
        <EllipsisVerticalIcon className="size-4 md:size-5 stroke-2" />
      </MenuTrigger>
      <MenuContent side="bottom" align="end" className="z-50">
        <MenuItem
          disabled={isFetching}
          onClick={handleRefresh}
          onKeyDown={handleRefresh}
        >
          <ArrowPathIcon
            className={classNames(
              isFetching && "animate-spin",
              "size-4 stroke-2",
            )}
          />
          {isFetching ? "Refreshing" : "Refresh"}
        </MenuItem>
        {menuOptions?.map((option, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <Link key={index} href={option.href}>
            <MenuItem>{option.label}</MenuItem>
          </Link>
        ))}
        <MenuItem disabled>
          <ArrowTopRightOnSquareIcon className="size-4 stroke-2" />
          Export
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
