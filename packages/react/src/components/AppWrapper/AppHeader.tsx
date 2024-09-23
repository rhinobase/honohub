import { Bars3Icon } from "@heroicons/react/24/outline";
import { Button, Text, classNames, eventHandler } from "@rafty/ui";
import { NavLink } from "react-router-dom";
import { useDrawer } from "../../providers";
import type { HeaderOptionType } from "../../types";
import { ProfileMenu } from "../ProfileMenu";
import { Logo } from "./Logo";

export type AppHeader = {
  options: HeaderOptionType[];
};

export function AppHeader({ options }: AppHeader) {
  const { setOpen } = useDrawer();

  const handleDrawerOpen = eventHandler(() => setOpen(true));

  return (
    <header className="border-b flex items-center gap-1 md:gap-5 border-secondary-200 dark:border-secondary-800 p-2">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={handleDrawerOpen}
        onKeyDown={handleDrawerOpen}
      >
        <Bars3Icon className="size-[18px] stroke-2" />
      </Button>
      <Logo />
      <span className="h-[60%] w-px bg-secondary-200 dark:bg-secondary-800 md:block hidden" />
      <div className="items-center gap-2 hidden md:flex">
        {options.map((item, index) => (
          <HeaderItem key={`${index}-${item.label}`} {...item} />
        ))}
      </div>
      <div className="flex-1" />
      <ProfileMenu />
    </header>
  );
}

export function HeaderItem({ label, path }: HeaderOptionType) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        classNames(
          "cursor-pointer flex items-center outline-none no-underline gap-2 px-3 py-2 rounded-md min-w-0 select-none transition-all ease-in-out",
          isActive
            ? "bg-primary-100 text-primary-600 dark:bg-primary-300/20 dark:text-white"
            : "text-secondary-600 dark:text-secondary-400 hover:text-black dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-secondary-800/80",
        )
      }
    >
      <Text className="font-semibold text-sm capitalize leading-none">
        {label}
      </Text>
    </NavLink>
  );
}
