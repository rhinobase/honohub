import { FireIcon } from "@heroicons/react/24/outline";
import { classNames } from "@rafty/ui";

export function Logo({ className }: { className?: string }) {
  return <FireIcon className={classNames("size-7", className)} />;
}
