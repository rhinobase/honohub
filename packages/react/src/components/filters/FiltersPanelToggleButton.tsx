import { Bars3BottomRightIcon } from "@heroicons/react/24/outline";
import { Button, eventHandler } from "@rafty/ui";

export type FiltersPanelToggleButton = {
  isActive: boolean;
  onInteract: () => void;
};

export function FiltersPanelToggleButton({
  isActive,
  onInteract,
}: FiltersPanelToggleButton) {
  const icon = <Bars3BottomRightIcon className="size-4 stroke-2" />;

  const handleToggleFilterPanelOpen = eventHandler(() => onInteract());

  return (
    <>
      <Button
        variant="ghost"
        leftIcon={icon}
        isActive={isActive}
        onClick={handleToggleFilterPanelOpen}
        onKeyDown={handleToggleFilterPanelOpen}
        className="hidden md:flex"
      >
        Filters
      </Button>
      <Button
        variant="ghost"
        size="icon"
        isActive={isActive}
        onClick={handleToggleFilterPanelOpen}
        onKeyDown={handleToggleFilterPanelOpen}
        className="md:hidden"
      >
        {icon}
      </Button>
    </>
  );
}
