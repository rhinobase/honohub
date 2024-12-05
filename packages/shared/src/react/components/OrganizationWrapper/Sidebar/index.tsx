"use client";
import { TrashIcon, VariableIcon } from "@heroicons/react/24/outline";
import {
  ChartBarIcon,
  CloudIcon,
  Cog6ToothIcon,
  CubeTransparentIcon,
  KeyIcon,
  LockOpenIcon,
  QueueListIcon,
  SignalIcon,
  Squares2X2Icon,
  SwatchIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { Tooltip, TooltipContent, TooltipTrigger, classNames } from "@rafty/ui";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { type HTMLAttributes, useMemo } from "react";
import {
  SidebarLayout,
  useAuth,
  useCollection,
  useOrganization,
  usePreferences,
} from "../../../providers";
import type { SidebarItemType } from "../../../types";
import { StaticCollection } from "../../../utils";
import { Logo } from "../../Logo";
import { Sidebar, SidebarItem } from "../../sidebar";
import Divider from "./Divider";
import { SidebarItemsSkeleton } from "./ItemSkeleton";
import { SidebarShrinkButton } from "./ShrinkButton";

export type OrganizationSidebar = {
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

export function OrganizationSidebar({ className }: OrganizationSidebar) {
  const { current: currentOrganization } = useOrganization();
  const pathname = usePathname();
  const { collections, isLoading: isCollectionsLoading } = useCollection();
  const { profile, isProfileLoading } = useAuth();
  const layout = usePreferences((state) => state.sidebar);
  const { org } = useParams();

  const authorisedUser = profile?.dev || profile?.superuser || profile?.staff;

  const { standardSidebarItems, devSidebarItems, collectionSidebarItems } =
    useMemo<{
      standardSidebarItems: SidebarItemType[];
      devSidebarItems: SidebarItemType[];
      collectionSidebarItems: SidebarItemType[];
    }>(() => {
      const standardSidebarItems = [
        {
          _id: `__${StaticCollection.USERS}`,
          label: "Users",
          icon: UserCircleIcon,
          href: `/organisations/${org}/manage/${StaticCollection.USERS}`,
        },
        {
          _id: `__${StaticCollection.ROLES}`,
          label: "Roles",
          icon: LockOpenIcon,
          href: `/organisations/${org}/manage/${StaticCollection.ROLES}`,
        },
      ];
      if (profile?.dev || profile?.superuser)
        standardSidebarItems.push({
          _id: "__activity",
          label: "Activities",
          icon: QueueListIcon,
          href: `/organisations/${org}/manage/activity`,
        });

      if (currentOrganization?.report)
        standardSidebarItems.push({
          _id: "__reports",
          label: "Reports",
          icon: ChartBarIcon,
          href: `/organisations/${org}/reports`,
        });

      standardSidebarItems.push({
        _id: "__storage",
        label: "Storage",
        icon: CloudIcon,
        href: `/organisations/${org}/storage`,
      });

      const devSidebarItems = profile?.dev
        ? [
            {
              _id: `__${StaticCollection.WEBHOOKS}`,
              label: "Webhooks",
              icon: SignalIcon,
              href: `/organisations/${org}/dev/${StaticCollection.WEBHOOKS}`,
            },
            {
              _id: `__${StaticCollection.TOKENS}`,
              label: "Tokens",
              icon: KeyIcon,
              href: `/organisations/${org}/dev/${StaticCollection.TOKENS}`,
            },
            {
              _id: `__${StaticCollection.COLLECTIONS}`,
              label: "Collections",
              icon: SwatchIcon,
              href: `/organisations/${org}/dev/${StaticCollection.COLLECTIONS}`,
            },
            {
              _id: `__${StaticCollection.CONTAINERS}`,
              label: "Containers",
              icon: CubeTransparentIcon,
              href: `/organisations/${org}/dev/${StaticCollection.CONTAINERS}`,
            },
            {
              _id: `__${StaticCollection.GROUPS}`,
              label: "Groups",
              icon: UserGroupIcon,
              href: `/organisations/${org}/dev/${StaticCollection.GROUPS}`,
            },
            {
              _id: `__${StaticCollection.REPORTS}`,
              label: "Reports",
              icon: ChartBarIcon,
              href: `/organisations/${org}/dev/${StaticCollection.REPORTS}`,
            },
            {
              _id: "__graphql",
              label: "GraphQL",
              icon: VariableIcon,
              href: `/organisations/${org}/dev/graphql`,
            },
            {
              _id: `__${StaticCollection.TRASH}`,
              label: "Trash",
              icon: TrashIcon,
              href: `/organisations/${org}/dev/${StaticCollection.TRASH}`,
            },
            {
              _id: "__settings",
              label: "Settings",
              icon: Cog6ToothIcon,
              href: `/organisations/${org}/settings`,
            },
          ]
        : [];

      const collectionSidebarItems = collections
        ? collections.map(
            (collection) =>
              ({
                _id: collection._id,
                label: collection.name.plural,
                icon: collection.icon,
                href: `/organisations/${org}/collections/${collection.slug}`,
              }) satisfies SidebarItemType,
          )
        : [];

      return {
        standardSidebarItems,
        devSidebarItems,
        collectionSidebarItems,
      };
    }, [profile, collections, currentOrganization, org]);

  const active = useMemo(() => {
    const allOptions = [
      { _id: "__dashboard", href: `/organisations/${org}` },
      ...standardSidebarItems,
      ...devSidebarItems,
      ...collectionSidebarItems,
    ];

    const pathnameLength = pathname.length;
    let active: string | undefined;
    let minScore = Number.MAX_SAFE_INTEGER;

    for (const item of allOptions) {
      if (!pathname.startsWith(item.href)) continue;

      const score = pathnameLength - item.href.length;

      if (score < minScore) {
        minScore = score;
        active = item._id;
      }
    }

    return active;
  }, [
    pathname,
    org,
    standardSidebarItems,
    devSidebarItems,
    collectionSidebarItems,
  ]);

  return (
    <Sidebar
      header={
        <Link href="/">
          <Logo
            className={layout === SidebarLayout.SHRINK ? "mx-auto" : undefined}
          />
        </Link>
      }
      className={classNames("relative", className)}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarItem
            value="__dashboard"
            href={`/organisations/${org}`}
            isActive={active === "__dashboard"}
          >
            <Squares2X2Icon className="size-5" />
            {layout === SidebarLayout.DEFAULT && (
              <p className="font-medium leading-none">Dashboard</p>
            )}
          </SidebarItem>
        </TooltipTrigger>
        <TooltipContent side="right" hidden={layout === SidebarLayout.DEFAULT}>
          Dashboard
        </TooltipContent>
      </Tooltip>
      {authorisedUser &&
        standardSidebarItems.map((item) => {
          const Icon = item.icon;

          return (
            <Tooltip key={item._id}>
              <TooltipTrigger asChild>
                <SidebarItem
                  value={item._id}
                  href={item.href}
                  isActive={active === item._id}
                >
                  <Icon className="size-5" />
                  {layout === SidebarLayout.DEFAULT && (
                    <p className="font-medium leading-none">{item.label}</p>
                  )}
                </SidebarItem>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                hidden={layout === SidebarLayout.DEFAULT}
              >
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      {!isProfileLoading ? (
        <>
          <Divider />
          {devSidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <Tooltip key={item._id}>
                <TooltipTrigger asChild>
                  <SidebarItem
                    value={item._id}
                    href={item.href}
                    isActive={active === item._id}
                  >
                    <Icon className="size-5" />
                    {layout === SidebarLayout.DEFAULT && (
                      <p className="font-medium leading-none">{item.label}</p>
                    )}
                  </SidebarItem>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  hidden={layout === SidebarLayout.DEFAULT}
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </>
      ) : (
        <>
          <Divider />
          <SidebarItemsSkeleton length={3} />
        </>
      )}
      {!isCollectionsLoading ? (
        <>
          <Divider />
          {collectionSidebarItems.map((item) => {
            const Icon = item.icon;

            const icon =
              typeof item.icon === "string" ? (
                <span className="material-icons-round !text-xl !leading-none">
                  {item.icon}
                </span>
              ) : (
                <Icon />
              );

            return (
              <Tooltip key={item._id}>
                <TooltipTrigger asChild>
                  <SidebarItem
                    value={item._id}
                    href={item.href}
                    isActive={active === item._id}
                  >
                    {icon}
                    {layout === SidebarLayout.DEFAULT && (
                      <p className="font-medium leading-none">{item.label}</p>
                    )}
                  </SidebarItem>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  hidden={layout === SidebarLayout.DEFAULT}
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </>
      ) : (
        <>
          <Divider />
          <SidebarItemsSkeleton length={8} />
        </>
      )}
      <SidebarShrinkButton />
    </Sidebar>
  );
}
