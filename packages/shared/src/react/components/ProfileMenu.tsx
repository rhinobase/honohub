"use client";
import {
  ArrowUpTrayIcon,
  Cog6ToothIcon,
  ExclamationCircleIcon,
  MoonIcon,
  SunIcon,
  TvIcon,
} from "@heroicons/react/24/outline";
import {
  Avatar,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  Skeleton,
  classNames,
} from "@rafty/ui";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useAuth } from "../providers";

export function ProfileMenu() {
  const { user, profile, isProfileLoading, isProfileError, signout } =
    useAuth();

  if (!user || !profile || isProfileLoading)
    return (
      <Skeleton className="size-[38px] min-w-[38px] min-h-[38px] rounded-md" />
    );

  if (isProfileError)
    return (
      <div className="p-[5px]">
        <ExclamationCircleIcon className="size-7 stroke-red-500 dark:stroke-red-300" />
      </div>
    );

  const displayName = [profile.first_name, profile.last_name].join(" ").trim();

  const handleSignout = () => signout();

  return (
    <Menu>
      <MenuTrigger size="icon" variant="ghost" className="p-1">
        <Avatar
          src={user.photoURL ?? undefined}
          name={user.displayName ?? displayName}
          size="sm"
        />
      </MenuTrigger>
      <MenuContent align="end" alignOffset={1} className="space-y-1 z-10">
        <ThemeSelector />
        <Link href="/account">
          <MenuItem>
            <Cog6ToothIcon className="size-4 stroke-2" />
            Settings
          </MenuItem>
        </Link>
        <MenuSeparator />
        <MenuItem
          className="focus:text-red-500 focus:bg-red-200/40 dark:focus:bg-red-300/20 dark:focus:text-red-300"
          onClick={handleSignout}
          onKeyDown={handleSignout}
        >
          <ArrowUpTrayIcon className="size-4 stroke-2 rotate-90" />
          Sign out
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}

const THEMES = {
  light: SunIcon,
  dark: MoonIcon,
  system: TvIcon,
};

function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const ThemeTriggerIcon = THEMES[theme as keyof typeof THEMES];

  return (
    <MenuSub>
      <MenuSubTrigger className="justify-start data-[state=open]:bg-secondary-200/70 dark:data-[state=open]:bg-secondary-700/60">
        <ThemeTriggerIcon className="size-4 stroke-2" />
        Theme
        <div className="flex-1" />
      </MenuSubTrigger>
      <MenuSubContent alignOffset={-4} className="space-y-1 z-10">
        {Object.entries(THEMES).map(([name, Icon]) => (
          <MenuItem
            key={name}
            className={classNames(
              theme === name &&
                "bg-primary-50/70 focus:bg-primary-50/70 text-primary-500 dark:bg-primary-500/30 dark:focus:bg-primary-500/30 dark:text-white",
              "capitalize",
            )}
            onClick={() => setTheme(name)}
            onKeyDown={() => setTheme(name)}
          >
            <Icon className="stroke-2 size-4" />
            {name}
          </MenuItem>
        ))}
      </MenuSubContent>
    </MenuSub>
  );
}
