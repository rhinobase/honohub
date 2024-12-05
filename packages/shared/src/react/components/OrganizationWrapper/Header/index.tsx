"use client";
import { classNames } from "@rafty/ui";
import { useParams, usePathname } from "next/navigation";
import { ProfileMenu } from "../../ProfileMenu";
import { OrganizationSelector } from "./OrganizationSelector";

export function Header() {
  const pathname = usePathname();
  const { org, id } = useParams();

  return (
    <div
      className={classNames(
        pathname === `/organisations/${org}/reports/${id}` &&
          "hide-on-fullscreen",
        "flex items-center gap-1.5 p-1.5 border-b border-secondary-200 dark:border-secondary-800",
      )}
    >
      <OrganizationSelector />
      <div className="flex-1" />
      <ProfileMenu />
    </div>
  );
}
