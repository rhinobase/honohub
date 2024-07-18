import type { PropsWithChildren } from "react";

export function BaseWrapper(props: PropsWithChildren) {
  return (
    <div className="flex w-full h-screen text-black dark:text-white dark:bg-secondary-950 selection:text-secondary-700 bg-white selection:bg-[#79ffe1] dark:selection:bg-[#f81ce5] dark:selection:text-white">
      {props.children}
    </div>
  );
}
