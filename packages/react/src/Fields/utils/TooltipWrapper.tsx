"use client";
import type { TooltipWrapperProps } from "@dawncms/core";
import { useThread } from "@fibr/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@rafty/ui";
import type { PropsWithChildren } from "react";

export type TooltipWrapper = PropsWithChildren;

export function TooltipWrapper({ children }: TooltipWrapper) {
  const { tooltip } = useThread<TooltipWrapperProps>();

  if (tooltip)
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">{children}</div>
        </TooltipTrigger>
        <TooltipContent
          align="start"
          className="rounded px-1.5 py-1 leading-none"
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );

  return children;
}
