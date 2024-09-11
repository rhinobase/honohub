import type { PlusIcon } from "@heroicons/react/24/outline";
import { classNames } from "@rafty/ui";
import type { HTMLAttributes } from "react";

export type PageHeader = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title: string;
  icon?: string | typeof PlusIcon;
};

export function PageHeader({
  title,
  icon: Icon,
  className,
  children,
  ...props
}: PageHeader) {
  const iconRender = Icon ? (
    typeof Icon === "string" ? (
      <span className="material-icons-round !text-2xl md:!text-3xl">
        {Icon}
      </span>
    ) : (
      <Icon className="size-6 md:size-8 stroke-2" />
    )
  ) : undefined;

  return (
    <div
      {...props}
      className={classNames("flex items-center gap-3", className)}
    >
      {iconRender}
      <h3 className="text-2xl md:text-3xl font-semibold">{title}</h3>
      {children}
    </div>
  );
}
