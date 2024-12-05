import type { PropsWithChildren } from "react";

export function GridWrapper(props: PropsWithChildren) {
  return (
    <div className="grid grid-cols-1 gap-2 md:gap-3 lg:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {props.children}
    </div>
  );
}
