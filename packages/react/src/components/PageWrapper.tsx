import type { PropsWithChildren } from "react";

export function PageWrapper(props: PropsWithChildren) {
  return (
    <div className="flex-1 px-3 py-2 md:px-[18px] md:py-3 lg:px-6 lg:py-4">
      <div className="flex flex-col min-h-0 w-full h-full flex-grow gap-3 md:gap-4 lg:gap-5 overflow-x-hidden overflow-y-auto scroll-smooth">
        {props.children}
      </div>
    </div>
  );
}
