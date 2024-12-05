"use client";
import { LoadingComponent, Logo, ProfileMenu } from "@honohub/shared";
import { ErrorComponent, useAuth } from "@honohub/shared";
import { classNames } from "@rafty/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

export function RootPageWrapper(props: PropsWithChildren) {
  const pathname = usePathname();
  const { user, profile, isProfileError, isProfileLoading } = useAuth();

  if (!user || !profile || isProfileLoading)
    return <LoadingComponent>Getting your profile...</LoadingComponent>;

  if (isProfileError)
    return <ErrorComponent>Error fetching profile</ErrorComponent>;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-secondary-200 dark:border-secondary-800">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex-1" />
        <ProfileMenu />
      </div>
      <div className="h-full w-full overflow-x-hidden overflow-y-auto scroll-smooth">
        <div
          className={classNames(
            pathname !== "/" ? "h-full" : "mx-auto max-w-6xl",
            "w-full flex flex-col gap-3 md:gap-4 lg:gap-5 px-3 py-3 md:px-4 md:py-4 lg:px-5 lg:py-5 xl:py-6",
          )}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}
