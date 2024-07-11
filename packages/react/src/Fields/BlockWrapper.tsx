"use client";
import { FibrProvider } from "@fibr/react";
import type { PropsWithChildren, ReactNode } from "react";
import { blocks } from "./blocks";

export function BlockWrapper({
  children,
  plugins,
}: PropsWithChildren<Partial<Pick<FibrProvider, "plugins">>>) {
  const components: Record<string, () => ReactNode>[] = [blocks];
  if (plugins)
    if (Array.isArray(plugins)) components.push(...plugins);
    else components.push(plugins);

  return <FibrProvider plugins={components}>{children}</FibrProvider>;
}
