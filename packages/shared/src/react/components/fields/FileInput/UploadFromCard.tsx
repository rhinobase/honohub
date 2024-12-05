import type { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { classNames } from "@rafty/ui";
import type { HTMLAttributes } from "react";

export type UploadFromCard = HTMLAttributes<HTMLDivElement> & {
  icon: typeof ComputerDesktopIcon;
  title: string;
  description: string;
};

export function UploadFromCard({
  title,
  description,
  icon: Icon,
  className,
  ...props
}: UploadFromCard) {
  return (
    <div
      {...props}
      className={classNames(
        "p-8 w-full flex flex-col items-center gap-1 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-800/50 cursor-pointer select-none transition-all ease-in-out",
        className,
      )}
    >
      <Icon className="size-8 stroke-2" />
      <div className="text-center">
        <p className="font-medium">{title}</p>
        <p className="text-xs opacity-50">{description}</p>
      </div>
    </div>
  );
}
