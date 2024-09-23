import {
  ArchiveBoxIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  InputField,
  classNames,
  eventHandler,
  useBoolean,
  useBreakpointValue,
} from "@rafty/ui";
import Fuse, { type RangeTuple } from "fuse.js";
import { type HTMLAttributes, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import type { CollectionType } from "../../../types";
import { getPluralLabel } from "../../../utils";
import { SidebarItem } from "./Item";

enum SidebarType {
  DRAWER = "drawer",
  STATIC = "static",
}

export type CollectionSidebar = {
  options: Pick<CollectionType, "slug" | "label">[];
} & HTMLAttributes<HTMLDivElement>;

export function CollectionSidebar({ options }: CollectionSidebar) {
  const sidebar =
    useBreakpointValue({
      sm: SidebarType.DRAWER,
      md: SidebarType.STATIC,
      lg: SidebarType.STATIC,
      xl: SidebarType.STATIC,
    }) ?? SidebarType.STATIC;

  const [isDrawerOpen, setDrawerOpen] = useBoolean();

  const location = useLocation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const handleDrawerToggle = eventHandler(() => setDrawerOpen());

  const DrawerButtonIcon = isDrawerOpen ? XMarkIcon : Bars3Icon;

  const ButtomBar = ({
    className,
  }: Pick<HTMLAttributes<HTMLDivElement>, "className">) => (
    <div
      className={classNames(
        "flex items-center w-full bg-secondary-100 dark:bg-secondary-900 p-3 md:p-4 lg:p-5 gap-2 md:gap-3 lg:gap-4 text-secondary-700 dark:text-secondary-300",
        className,
      )}
    >
      <ArchiveBoxIcon className="size-[18px] stroke-3" />
      <p className="font-medium">Collections</p>
      <div className="flex-1" />
      <Button
        size="icon"
        variant="ghost"
        onClick={handleDrawerToggle}
        onKeyDown={handleDrawerToggle}
      >
        <DrawerButtonIcon className="size-[18px] stroke-[3]" />
      </Button>
    </div>
  );

  if (sidebar === SidebarType.DRAWER)
    return (
      <>
        <ButtomBar className="fixed z-30 bottom-0" />
        <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerOverlay className="z-40 bg-black/5" />
          <DrawerContent className="h-max z-40 max-h-[60%] flex flex-col bottom-0 top-auto !animate-none dark:bg-secondary-900 p-0 shadow-[0_-8px_10px_-5px_rgb(0,0,0,0.1)] dark:shadow-none">
            <SidebarRender options={options} />
            <ButtomBar />
          </DrawerContent>
        </Drawer>
      </>
    );
  return (
    <div className="flex h-full w-[250px] min-w-[250px] max-w-[250px] border-r flex-col flex-shrink-0 flex-grow-0 dark:border-secondary-800">
      <SidebarRender options={options} />
    </div>
  );
}

type SidebarRender = {
  options: Pick<CollectionType, "slug" | "label">[];
};

function SidebarRender({ options }: SidebarRender) {
  const [search, setSearch] = useState<string>();

  const [data, fuse] = useMemo(() => {
    const tmp = options.map(({ label, slug }) => ({
      label: getPluralLabel(label),
      slug,
    }));

    return [
      tmp,
      new Fuse(tmp, {
        keys: ["label"],
        includeMatches: true,
      }),
    ];
  }, [options]);

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
    <>
      <header className="px-4 my-[15px]">
        <InputField
          size="sm"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          variant="ghost"
          className="px-0 py-0 focus:border-transparent focus:ring-transparent dark:focus:border-transparent dark:focus:ring-transparent dark:ring-offset-transparent ring-offset-transparent"
        />
      </header>
      <hr className="dark:border-secondary-800" />
      <div className="mt-[15px] px-3 overflow-x-hidden overflow-y-auto h-full">
        {isEmpty ? (
          <p className="font-medium text-sm text-center select-none text-secondary-400 dark:text-secondary-600">
            Not found
          </p>
        ) : (
          searchResults.map(({ slug, label, matches }) => (
            <SidebarItem
              key={slug}
              link={slug}
              label={label}
              matches={matches}
            />
          ))
        )}
      </div>
    </>
  );
}
