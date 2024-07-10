import { Breadcrumbs } from "@honohub/react";

export type Header = {
  slug: string;
  basepath: string;
};

export function Header({ basepath, slug }: Header) {
  return (
    <div className="flex lg:flex-row flex-col lg:gap-0 gap-5 lg:items-center lg:justify-between w-full">
      <Breadcrumbs
        items={[
          { label: "Collections", href: basepath },
          {
            label: slug,
            href: `${basepath}/${slug}`,
          },
        ]}
      />
    </div>
  );
}
