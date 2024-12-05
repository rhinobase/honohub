"use client";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button, classNames, eventHandler } from "@rafty/ui";
import { SidebarLayout, usePreferences } from "../../../providers";

export function SidebarShrinkButton() {
  const layout = usePreferences((state) => state.sidebar);
  const setLayout = usePreferences((state) => state.setSidebar);

  const handleShrink = eventHandler(() => setLayout());

  return (
    <Button
      size="fab"
      variant="outline"
      className="hidden md:flex bg-white hover:bg-secondary-100 dark:bg-secondary-950 dark:hover:bg-secondary-800 absolute bottom-5 -right-4"
      onClick={handleShrink}
      onKeyDown={handleShrink}
    >
      <ChevronLeftIcon
        className={classNames(
          "size-4 stroke-2 stroke-secondary-500 dark:stroke-secondary-300 transition-all ease-in-out duration-300",
          layout === SidebarLayout.SHRINK && "rotate-180",
        )}
      />
    </Button>
  );
}
