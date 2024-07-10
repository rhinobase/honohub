"use client";
import { classNames } from "@rafty/ui";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { Logo } from "./Logo";
import { ProfileMenu } from "./ProfileMenu";
import { Sidebar, SidebarItem } from "./Sidebar";

export type AppWrapper = PropsWithChildren<{
  items: {
    label: string;
    icon: React.ComponentType<
      React.PropsWithoutRef<React.ComponentProps<"svg">> & {
        title?: string | undefined;
        titleId?: string | undefined;
      }
    >;
    route: string;
  }[];
}>;
export function AppWrapper({ items, children }: AppWrapper) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full">
      <Sidebar
        className="w-20"
        header={<Logo className="w-10" />}
        footer={<ProfileMenu />}
      >
        {items.map(({ icon: Icon, label, route }, index) => (
          <SidebarItem
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            href={route}
            value={label}
            className={classNames(
              "size-[45px] rounded-xl justify-center",
              pathname === route && "border-secondary-700",
            )}
          >
            <Icon className="size-6 stroke-2" />
          </SidebarItem>
        ))}
      </Sidebar>
      {children}
    </div>
  );
}
