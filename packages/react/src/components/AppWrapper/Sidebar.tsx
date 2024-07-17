import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";
import { Button, Text, classNames, useBoolean } from "@rafty/ui";
import {
  Fragment,
  type HTMLAttributes,
  type PropsWithChildren,
  forwardRef,
} from "react";
import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";

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
    const [isOpen, setOpen] = useBoolean(true);

    const Icon = isOpen ? ChevronLeftIcon : ChevronRightIcon;

    return (
      <div
        {...props}
        className={classNames(
          "flex h-full relative border-r flex-col flex-shrink-0 flex-grow-0 dark:border-secondary-800",
          isOpen ? "w-[250px] min-w-[250px] max-w-[250px]" : "w-16",
          className,
        )}
        ref={forwardedRef}
      >
        <header className="px-3 my-[7.5px]">
          {isOpen ? (
            <div className="flex items-center -ml-1">
              <Logo className="h-9 w-max" />
              <p className="text-[26px] font-bold tracking-tight">
                Hono
                <span className="text-primary-500 dark:text-primary-300">
                  Hub
                </span>
              </p>
            </div>
          ) : (
            <Logo className="h-[39px] w-max" />
          )}
        </header>
        <hr
          className={
            isOpen
              ? "border-secondary-200 dark:border-secondary-800"
              : "border-transparent"
          }
        />
        <div className="mt-[15px] px-3 overflow-x-hidden overflow-y-auto h-full">
          {Object.entries(options).map(([category, items], index) => (
            <Fragment key={category}>
              {index !== 0 &&
                (isOpen ? (
                  <SidebarTitle>{category}</SidebarTitle>
                ) : (
                  <div className="h-[33px] flex items-center">
                    <hr className="border-secondary-200 dark:border-secondary-800 w-full" />
                  </div>
                ))}
              {items.map((item) => (
                <SidebarItem key={item.label} {...item} isOpen={isOpen} />
              ))}
            </Fragment>
          ))}
        </div>
        <Button
          className="absolute bottom-6 hover:dark:bg-secondary-950 hover:bg-white -right-4 border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-950"
          size="fab"
          onClick={() => setOpen()}
        >
          <Icon className="size-4 stroke-2 stroke-secondary-500 dark:stroke-secondary-400" />
        </Button>
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
  isOpen: boolean;
};

function SidebarItem({ label, icon, path, isOpen }: SidebarItem) {
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
          !isOpen && "w-max",
        )
      }
    >
      <Icon className="size-4 stroke-2" />
      {isOpen && (
        <Text className="font-semibold text-sm leading-none">{label}</Text>
      )}
    </NavLink>
  );
}
