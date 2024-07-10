import type { PropsWithChildren } from "react";

export function SidebarTitle(props: PropsWithChildren) {
  return (
    <div className="w-full mx-[5px] first:mt-0 mt-[30px] mb-[15px] font-medium text-xs text-secondary-500 dark:text-secondary-400 capitalize select-none">
      {props.children}
    </div>
  );
}
