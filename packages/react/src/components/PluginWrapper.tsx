import type { PropsWithChildren } from "react";
import { PageHeader, PageTitle } from "./Header";

export type PluginWrapper = PropsWithChildren<{ name: string }>;

export function PluginWrapper(props: PluginWrapper) {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader className="md:hidden px-2 py-1 md:px-2.5 md:1.5 lg:px-3 lg:py-2 border-b border-secondary-200 dark:border-secondary-800">
        <PageTitle>{props.name}</PageTitle>
      </PageHeader>
      <div className="flex-1 overflow-x-hidden overflow-y-auto scroll-smooth">
        {props.children}
      </div>
    </div>
  );
}
