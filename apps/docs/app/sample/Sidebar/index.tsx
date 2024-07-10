"use client";
import type { RaftyIconProps } from "@rafty/icons";
import { InputField, classNames } from "@rafty/ui";
import Fuse, { type RangeTuple } from "fuse.js";
import { type HTMLAttributes, useMemo, useState } from "react";
import { SidebarItem } from "./SidebarItem";
import { SidebarTitle } from "./SidebarTitle";

export type Sidebar = {
  options: {
    slug: string;
    icon: RaftyIconProps["type"];
    label: string;
  }[];
} & Pick<HTMLAttributes<HTMLDivElement>, "className">;

export function Sidebar({ options, className }: Sidebar) {
  const [search, setSearch] = useState<string>();

  const [data, fuse] = useMemo(
    () => [
      options,
      new Fuse(options, {
        keys: ["label"],
        includeMatches: true,
      }),
    ],
    [options],
  );

  let searchResults: ((typeof data)[0] & { matches?: RangeTuple[] })[] = data;
  let isEmpty = false;

  if (search) {
    const results = fuse.search(search);

    if (results.length === 0) isEmpty = true;

    searchResults = results.reduce<typeof searchResults>(
      (prev, { item, matches }) => {
        prev.push({
          ...item,
          matches: matches?.flatMap((match) => match.indices),
        });

        return prev;
      },
      [],
    );
  }

  return (
    <div
      className={classNames(
        "flex h-full w-[250px] min-w-[250px] max-w-[250px] border-r flex-col flex-shrink-0 flex-grow-0 dark:border-secondary-800",
        className,
      )}
    >
      <header className="px-4 my-[15px]">
        <InputField
          size="sm"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          variant="ghost"
          className="px-0 py-0 focus:border-transparent focus:ring-transparent dark:focus:border-transparent dark:focus:ring-transparent"
        />
      </header>
      <hr className="dark:border-secondary-800" />
      <div className="mt-[15px] px-4 overflow-x-hidden overflow-y-auto h-full">
        {isEmpty ? (
          <p className="font-medium text-sm text-center select-none text-secondary-400">
            Not found
          </p>
        ) : (
          <>
            <SidebarTitle>collections</SidebarTitle>
            {searchResults.map(({ slug, label, icon, matches }) => (
              <SidebarItem
                key={slug}
                link={`${slug}`}
                label={label}
                icon={icon}
                matches={matches}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
