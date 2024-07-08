import { Breadcrumbs } from "@honohub/react";
import { Avatar } from "@rafty/ui";
import Link from "next/link";

export type ListPageHeader = {
  slug: string;
  pluralLabel: string;
  basepath: string;
};

export function ListPageHeader({
  basepath,
  slug,
  pluralLabel,
}: ListPageHeader) {
  return (
    <div className="flex lg:flex-row flex-col lg:gap-0 gap-5 lg:items-center lg:justify-between w-full">
      <Breadcrumbs
        items={[
          { label: "Collections", href: basepath },
          {
            label: pluralLabel,
            href: `${basepath}/${slug}`,
          },
        ]}
      />
      <Link href="">
        <Avatar size="sm" />
      </Link>
    </div>
  );
}
