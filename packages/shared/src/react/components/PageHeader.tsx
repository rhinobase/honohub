import type { PlusIcon } from "@heroicons/react/24/outline";
import { classNames } from "@rafty/ui";
import type { HTMLAttributes } from "react";

export type PageHeader = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title: string;
  icon?: string | typeof PlusIcon;
};

export function PageHeader({
  title,
  icon,
  className,
  children,
  ...props
}: PageHeader) {
  let iconRender = undefined;

  if (icon) {
    const Icon = icon;
    if (typeof icon === "string")
      iconRender = (
        <span className="material-icons-round !text-2xl md:!text-3xl">
          {icon}
        </span>
      );
    else iconRender = <Icon className="size-6 md:size-8 stroke-2" />;
  }

  return (
    <div
      {...props}
      className={classNames("flex items-center gap-2 lg:gap-3", className)}
    >
      {iconRender}
      <h3 className="text-2xl md:text-3xl font-semibold">{title}</h3>
      {children}
    </div>
  );
}
