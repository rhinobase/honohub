"use client";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  Skeleton,
} from "@rafty/ui";
import Link from "next/link";
import { useOrganization } from "../../../providers";
import { getCloudinaryURL } from "../../../utils";

export function OrganizationSelector() {
  const { organisations, current: currentOrganization } = useOrganization();

  if (!organisations) return <Skeleton className="h-full w-40 rounded-md" />;

  return (
    <Menu>
      <MenuTrigger
        leftIcon={
          currentOrganization ? (
            <Avatar
              name={currentOrganization.name}
              src={
                currentOrganization.logo &&
                getCloudinaryURL(currentOrganization.logo)
              }
              className="size-5"
            />
          ) : undefined
        }
        rightIcon={
          <ChevronDownIcon className="size-3.5 stroke-2 group-data-[state=open]/org-selector:rotate-180 transition-all ease-in-out duration-300" />
        }
        className="group/org-selector"
      >
        {currentOrganization === null
          ? "Organisations"
          : currentOrganization.name}
      </MenuTrigger>
      <MenuContent align="start" className="space-y-1 z-10">
        <Link href="/">
          <MenuItem>See all organisations</MenuItem>
        </Link>
        <MenuSeparator />
        {organisations.map((org) => (
          <Link key={org._id} href={`/organisations/${org.slug}`}>
            <MenuItem
              className={
                currentOrganization?._id === org._id
                  ? "bg-primary-50/70 focus:bg-primary-50/70 text-primary-500 dark:bg-primary-500/30 dark:focus:bg-primary-500/30 dark:text-white"
                  : undefined
              }
            >
              <Avatar
                name={org.name}
                src={org.logo && getCloudinaryURL(org.logo)}
                className="size-5"
              />
              {org.name}
            </MenuItem>
          </Link>
        ))}
      </MenuContent>
    </Menu>
  );
}
