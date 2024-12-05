"use client";
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  classNames,
  eventHandler,
  useBoolean,
} from "@rafty/ui";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useEffect } from "react";

export type CopyButton = {
  data?: string;
  tooltipContent?: string;
  className?: HTMLDivElement["className"];
};

export function CopyButton({ data, className, tooltipContent }: CopyButton) {
  const [_, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useBoolean();

  useEffect(() => {
    if (!isCopied) return;

    const timeoutId = setTimeout(() => {
      setIsCopied(false);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [isCopied, setIsCopied]);

  const handleCopy = eventHandler(() => {
    if (data) {
      copyToClipboard(data);
      setIsCopied(true);
    }
  });

  const Icon = isCopied ? CheckIcon : DocumentDuplicateIcon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          aria-label="copy"
          variant="ghost"
          disabled={!data}
          className={className}
          onClick={handleCopy}
          onKeyDown={handleCopy}
        >
          <Icon
            className={classNames(
              "size-4 stroke-2",
              isCopied && "stroke-green-500 dark:stroke-green-300",
            )}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent hidden={!data}>
        {isCopied ? "Copied" : (tooltipContent ?? "Copy Code")}
      </TooltipContent>
    </Tooltip>
  );
}
