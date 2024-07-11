"use client";
import { classNames } from "@rafty/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { Logo } from "./Logo";
import { ProfileMenu } from "./ProfileMenu";

export type AppWrapper = PropsWithChildren & Sidebar;

export function AppWrapper({ options, children }: AppWrapper) {
  return (
    <div className="flex h-full w-full">
      <Sidebar options={options} />
      {children}
    </div>
  );
}

type Sidebar = {
  options: {
    label: string;
    icon: React.ComponentType<
      React.PropsWithoutRef<React.ComponentProps<"svg">> & {
        title?: string | undefined;
        titleId?: string | undefined;
      }
    >;
    route: string;
  }[];
};

function Sidebar({ options }: Sidebar) {
  const pathname = usePathname();

  return (
    <div className="flex h-full border-r">
      <aside className="py-5 px-3 flex w-full flex-col gap-8 h-full flex-grow-0 flex-shrink-0">
        <Logo className="w-10" />
        <nav className="flex-grow flex flex-col items-center justify-start w-full gap-4 overflow-x-hidden overflow-y-auto">
          {options.map(({ icon: Icon, label, route }, index) => (
            <Link
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              href={route}
              title={label}
              className={classNames(
                "border-2 transition-all ease-in-out flex items-center justify-center size-[45px] rounded-xl",
                pathname === route
                  ? "border-black text-black"
                  : "border-transparent text-secondary-600 hover:text-black hover:bg-secondary-200/80",
              )}
            >
              <Icon className="size-6 stroke-2" />
            </Link>
          ))}
        </nav>
        <ProfileMenu />
      </aside>
    </div>
  );
}
