"use client";
import { PuzzlePieceIcon } from "@heroicons/react/24/outline";
import { InputField, Text, classNames } from "@rafty/ui";
import Fuse, { type RangeTuple } from "fuse.js";
import {
  Fragment,
  type HTMLAttributes,
  type PropsWithChildren,
  type ReactNode,
  forwardRef,
  useMemo,
  useState,
} from "react";
import { NavLink } from "react-router-dom";

type AppSidebarOptionType = {
  label: string;
  icon?: any;
  path: string;
};

export type AppSidebar = {
  options: Record<string, AppSidebarOptionType[]>;
} & HTMLAttributes<HTMLDivElement>;

export const AppSidebar = forwardRef<HTMLDivElement, AppSidebar>(
  function AppSidebar({ className, options, ...props }, forwardedRef) {
    const [search, setSearch] = useState<string>();

    const fuse = useMemo(() => {
      const data = Object.entries(options).flatMap(([category, items]) =>
        items.map((item) => ({ category, ...item })),
      );

      return new Fuse(data, {
        keys: ["label"],
        includeMatches: true,
      });
    }, [options]);

    let searchResults = options;
    let isEmpty = false;

    if (search) {
      const init = Object.keys(options).reduce<
        Record<string, AppSidebarOptionType[]>
      >((prev, cur) => {
        prev[cur] = [];
        return prev;
      }, {});

      const results = fuse.search(search);

      if (results.length === 0) isEmpty = true;

      searchResults = results.reduce<
        Record<string, (AppSidebarOptionType & { matches?: RangeTuple[] })[]>
      >((prev, cur) => {
        const { item, matches } = cur;

        prev[item.category].push({
          ...item,
          matches: matches
            ?.filter((match) => match.key === "label")
            .flatMap((match) => match.indices),
        });

        return prev;
      }, init);
    }

    return (
      <div
        {...props}
        className={classNames(
          "flex h-full w-[250px] min-w-[250px] max-w-[250px] border-r flex-col flex-shrink-0 flex-grow-0 dark:border-secondary-800",
          className,
        )}
        ref={forwardedRef}
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
        <div className="mt-[15px] px-3 overflow-x-hidden overflow-y-auto h-full">
          {isEmpty ? (
            <p className="font-medium text-sm text-center select-none text-secondary-400 dark:text-secondary-600">
              Not found
            </p>
          ) : (
            Object.entries(searchResults).map(([category, items], index) => (
              <Fragment key={category}>
                {index !== 0 && <SidebarTitle>{category}</SidebarTitle>}
                {items.map((item) => (
                  <SidebarItem key={item.label} {...item} />
                ))}
              </Fragment>
            ))
          )}
        </div>
      </div>
    );
  },
);

function SidebarTitle(props: PropsWithChildren) {
  return (
    <div className="w-full mx-[5px] first:mt-0 mt-5 mb-1.5 font-semibold text-[10px] text-secondary-500 dark:text-secondary-400 uppercase select-none">
      {props.children}
    </div>
  );
}

type SidebarItem = AppSidebarOptionType & {
  matches?: RangeTuple[];
};

function SidebarItem({ label, icon, path, matches }: SidebarItem) {
  const Icon = icon ?? PuzzlePieceIcon;

  return (
    <NavLink
      title={label}
      to={path}
      className={({ isActive }) =>
        classNames(
          "cursor-pointer outline-none no-underline flex w-full items-center gap-2 mb-2 px-3 py-1 min-h-10 rounded-md min-w-0 select-none transition-all ease-in-out",
          isActive
            ? "bg-primary-100 text-primary-600 dark:bg-secondary-700/80 dark:text-white"
            : "text-secondary-600 dark:text-secondary-400 hover:text-black dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-secondary-800/80",
        )
      }
    >
      <Icon className="size-4 stroke-2" />
      <Text className="font-semibold text-sm leading-none">
        {highlightMatches(label, matches)}
      </Text>
    </NavLink>
  );
}

function highlightMatches(
  inputText: string,
  regions: readonly RangeTuple[] = [],
) {
  const children: ReactNode[] = [];
  let nextUnhighlightedRegionStartingIndex = 0;

  regions.forEach((region, i) => {
    const lastRegionNextIndex = region[1] + 1;

    children.push(
      ...[
        inputText
          .substring(nextUnhighlightedRegionStartingIndex, region[0])
          .replace(" ", "\u00A0"),
        <span key={`${i}-${region}`} className="bg-yellow-200/80">
          {inputText
            .substring(region[0], lastRegionNextIndex)
            .replace(" ", "\u00A0")}
        </span>,
      ],
    );

    nextUnhighlightedRegionStartingIndex = lastRegionNextIndex;
  });

  children.push(
    inputText
      .substring(nextUnhighlightedRegionStartingIndex)
      .replace(" ", "\u00A0"),
  );

  return children;
}
