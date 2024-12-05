import type { CheckIcon } from "@heroicons/react/24/outline";

export type SidebarItemType = {
  _id: string;
  label: string;
  icon: string | typeof CheckIcon;
  href: string;
};
