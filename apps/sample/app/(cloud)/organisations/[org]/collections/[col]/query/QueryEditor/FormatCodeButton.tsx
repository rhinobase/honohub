"use client";
import { Bars3CenterLeftIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type eventHandler,
} from "@rafty/ui";

export type FormatCodeButton = {
  isDisabled: boolean;
  onFormat: ReturnType<typeof eventHandler>;
};

export function FormatCodeButton({ onFormat, isDisabled }: FormatCodeButton) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          isDisabled={isDisabled}
          onClick={onFormat}
          onKeyDown={onFormat}
        >
          <Bars3CenterLeftIcon className="size-4 stroke-2" />
        </Button>
      </TooltipTrigger>
      <TooltipContent hidden={isDisabled}>Format Code</TooltipContent>
    </Tooltip>
  );
}
