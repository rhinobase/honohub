import type { BoltIcon } from "@heroicons/react/24/outline";
import { Suspense, lazy, useMemo } from "react";
import type { PluginType } from "../types";

export type PluginCard = PluginType["a"];

export function PluginCard(props: PluginCard) {
  const Icon = useMemo(
    () =>
      lazy(() =>
        import("@heroicons/react/24/outline").then((mod) => ({
          default: mod[props.icon as string] as typeof BoltIcon,
        })),
      ),
    [props.icon],
  );

  return (
    <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3 rounded md:rounded-md bg-secondary-100 hover:shadow-lg p-3 md:p-3.5 lg:p-4 transition-all ease-in-out dark:hover:shadow-none dark:bg-secondary-900 dark:hover:bg-secondary-800">
      <Suspense fallback="Loading...">
        <Icon className="size-4 stroke-2" />
      </Suspense>
      {props.label}
    </div>
  );
}
