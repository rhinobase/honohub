import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";
import { Button, Text, classNames, eventHandler } from "@rafty/ui";
import {
  Fragment,
  type HTMLAttributes,
  type PropsWithChildren,
  forwardRef,
} from "react";
import { Link, NavLink } from "react-router-dom";
import { usePreferences } from "../../providers";
import { Logo } from "../Logo";

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
    const isShrink = usePreferences((state) => state.isShrink);

    return (
      <div
        {...props}
        className={classNames(
          "flex h-full relative flex-col flex-shrink-0 flex-grow-0",
          isShrink ? "w-16" : "w-[250px] min-w-[250px] max-w-[250px]",
          className,
        )}
        ref={forwardedRef}
      >
        <header className="px-3 my-[7.5px]">
          <div className="w-max">
            <Link to="/">
              {isShrink ? (
                <Logo className="h-[39px] w-max" />
              ) : (
                <div className="flex items-center ml-1 w-max">
                  <Logo className="h-8 w-max" />
                  <p className="text-[26px] font-bold tracking-tight">
                    Hono
                    <span className="text-primary-500 dark:text-primary-300">
                      Hub
                    </span>
                  </p>
                </div>
              )}
            </Link>
          </div>
        </header>
        <hr
          className={
            isShrink
              ? "border-transparent"
              : "border-secondary-200 dark:border-secondary-800"
          }
        />
        <div className="mt-[15px] px-3 overflow-x-hidden overflow-y-auto h-full">
          {Object.entries(options).map(([category, items], index) => (
            <Fragment key={category}>
              {index !== 0 &&
                (isShrink ? (
                  <div className="h-[33px] flex items-center">
                    <hr className="border-secondary-200 dark:border-secondary-800 w-full" />
                  </div>
                ) : (
                  <SidebarTitle>{category}</SidebarTitle>
                ))}
              {items.map((item) => (
                <SidebarItem key={item.label} {...item} />
              ))}
            </Fragment>
          ))}
        </div>
        <SidebarShrinkButton />
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

type SidebarItem = AppSidebarOptionType;

function SidebarItem({ label, icon, path }: SidebarItem) {
  const isShrink = usePreferences((state) => state.isShrink);

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
          isShrink && "w-max",
        )
      }
    >
      <Icon className="size-4 stroke-2" />
      {!isShrink && (
        <Text className="font-semibold text-sm leading-none">{label}</Text>
      )}
    </NavLink>
  );
}

function SidebarShrinkButton() {
  const { isShrink, setShrink } = usePreferences((state) => ({
    isShrink: state.isShrink,
    setShrink: state.setShrink,
  }));

  const Icon = isShrink ? ChevronRightIcon : ChevronLeftIcon;

  const handleSidebarShrink = eventHandler(() => setShrink());

  return (
    <Button
      className="hidden lg:block absolute bottom-6 hover:dark:bg-secondary-950 hover:bg-white -right-4 border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-950"
      size="fab"
      onClick={handleSidebarShrink}
      onKeyDown={handleSidebarShrink}
    >
      <Icon className="size-4 stroke-2 stroke-secondary-500 dark:stroke-secondary-400" />
    </Button>
  );
}
