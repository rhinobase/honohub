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
  Text,
  classNames,
  eventHandler,
  useBoolean,
  useBreakpointValue,
} from "@rafty/ui";
import Fuse, { type RangeTuple } from "fuse.js";
import {
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { CollectionType } from "../../types";
import { getPluralLabel } from "../../utils";

enum SidebarType {
  DRAWER = "drawer",
  STATIC = "static",
}

export type CollectionSidebar = {
  options: Pick<CollectionType, "slug" | "label">[];
} & HTMLAttributes<HTMLDivElement>;

export function CollectionSidebar({ options }: CollectionSidebar) {
  const sidebar = useBreakpointValue({
    sm: SidebarType.DRAWER,
    md: SidebarType.STATIC,
    lg: SidebarType.STATIC,
    xl: SidebarType.STATIC,
  });

  const [isDrawerOpen, setDrawerOpen] = useBoolean();

  const { pathname } = useLocation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

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
          <DrawerOverlay className="z-40" />
          <DrawerContent className="h-max z-40 max-h-[60%] flex flex-col bottom-0 top-auto animate-none dark:bg-secondary-900 p-0">
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

type SidebarItem = Pick<CollectionType, "label"> & {
  link: string;
  matches?: RangeTuple[];
};

function SidebarItem({ link, label, matches }: SidebarItem) {
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
      <Text className="font-semibold text-sm leading-none capitalize">
        {highlightMatches(title, matches)}
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
