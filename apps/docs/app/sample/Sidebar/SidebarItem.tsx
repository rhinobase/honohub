"use client";
import RaftyIcon, { type RaftyIconProps } from "@rafty/icons";
import { Text, classNames } from "@rafty/ui";
import type { RangeTuple } from "fuse.js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export type SidebarItem = {
  icon?: RaftyIconProps["type"];
  link: string;
  label: string;
  matches?: RangeTuple[];
};

export function SidebarItem({ link, label, matches, icon }: SidebarItem) {
  const pathname = usePathname();

  return (
    <Link
      title={label}
      href={link}
      className={classNames(
        "cursor-pointer outline-none no-underline flex w-full items-center gap-2.5 my-2 px-3 py-[3px] min-h-10 rounded-[4px] min-w-0 select-none transition-all ease-in-out",
        pathname === link
          ? "bg-secondary-200/80 text-black dark:bg-secondary-700/80 dark:text-white"
          : "text-secondary-600 dark:text-secondary-400 hover:text-black dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-secondary-800/80",
      )}
    >
      {icon && <RaftyIcon type={icon} className="size-[18px] stroke-2" />}
      <Text className="font-medium">{highlightMatches(label, matches)}</Text>
    </Link>
  );
}

function highlightMatches(
  inputText: string,
  regions: readonly RangeTuple[] = [],
) {
  const children: ReactNode[] = [];
  let nextUnhighlightedRegionStartingIndex = 0;

  regions.forEach((region, i) => {
    const lastRegionNextIndex = region[1] + 1;

    children.push(
      ...[
        inputText
          .substring(nextUnhighlightedRegionStartingIndex, region[0])
          .replace(" ", "\u00A0"),
        <span key={`${i}-${region}`} className="bg-yellow-200/80">
          {inputText
            .substring(region[0], lastRegionNextIndex)
            .replace(" ", "\u00A0")}
        </span>,
      ],
    );

    nextUnhighlightedRegionStartingIndex = lastRegionNextIndex;
  });

  children.push(
    inputText
      .substring(nextUnhighlightedRegionStartingIndex)
      .replace(" ", "\u00A0"),
  );

  return children;
}
