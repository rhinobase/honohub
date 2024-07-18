import { FireIcon } from "@heroicons/react/24/outline";
import { classNames } from "@rafty/ui";

export function Logo({ className }: { className?: string }) {
  return (
    <img
      src="https://hono.dev/images/logo-small.png"
      alt="honohub logo"
      style={{ filter: "sepia(100%) hue-rotate(190deg) saturate(500%)" }}
      className={classNames("size-7", className)}
    />
  );
}
