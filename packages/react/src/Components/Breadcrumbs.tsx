import {
  BreadcrumbDivider,
  BreadcrumbItem,
  Breadcrumbs as RaftyBreadcrumbs,
  classNames,
} from "@rafty/ui";
import Link from "next/link";
import { Fragment } from "react";

export type Breadcrumbs = {
  items: { label: string; href?: string }[];
};

export function Breadcrumbs({ items }: Breadcrumbs) {
  const children = items
    .flatMap(({ label, href }, index, arr) => {
      const isLastElement = index === arr.length - 1;

      const key = `${label}.${index}`;

      const item = (
        <BreadcrumbItem
          key={key}
          isActive={isLastElement}
          className={classNames(
            isLastElement
              ? "text-secondary-800 dark:text-secondary-100"
              : "text-secondary-400 dark:!text-secondary-500 hover:text-secondary-800 dark:hover:!text-secondary-200 transition-all ease-in-out",
            "font-medium text-lg capitalize bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent px-0 py-0",
          )}
        >
          {label}
        </BreadcrumbItem>
      );

      return [
        <Fragment key={`${key}.item`}>
          {href && !isLastElement ? <Link href={href}>{item}</Link> : item}
        </Fragment>,
        <BreadcrumbDivider key={`${key}.divider`} />,
      ];
    })
    .slice(0, -1);

  return (
    <RaftyBreadcrumbs className="[&>ul]:gap-3">{children}</RaftyBreadcrumbs>
  );
}
