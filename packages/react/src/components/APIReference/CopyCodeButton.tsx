import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { Button, classNames, eventHandler, useBoolean } from "@rafty/ui";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useEffect } from "react";

export type CopyCodeButton = {
  content: string;
};

export function CopyCodeButton({ content }: CopyCodeButton) {
  const [, copyToClipboard] = useCopyToClipboard();
  const [copied, toggle] = useBoolean();

  useEffect(() => {
    if (!copied) return;

    const timeoutId = setTimeout(() => {
      toggle(false);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [copied, toggle]);

  const handleCopy = (content: string) =>
    eventHandler(() => {
      copyToClipboard(content);
      toggle(true);
    });

  const Icon = copied ? CheckIcon : DocumentDuplicateIcon;

  return (
    <Button
      className={classNames(
        "right-2 top-2 absolute invisible group-hover/content:visible",
        copied
          ? "text-green-500 dark:text-green-300"
          : "hover:text-black dark:hover:text-white",
      )}
      size="icon"
      variant="ghost"
      onClick={handleCopy(content)}
      onKeyDown={handleCopy(content)}
    >
      <Icon className="stroke-2 size-4" />
    </Button>
  );
}
