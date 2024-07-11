import type { PropsWithChildren } from "react";

export default function CollectionsLayout(props: PropsWithChildren) {
  return (
    <div className="flex-1 px-10 py-4 overflow-x-hidden overflow-y-auto scroll-smooth">
      <div className="flex flex-col min-h-0 w-full h-full flex-grow gap-5">
        {props.children}
      </div>
    </div>
  );
}
