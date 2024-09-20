import { Drawer, DrawerClose, DrawerContent, DrawerOverlay } from "@rafty/ui";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { OptionType } from ".";
import { useDrawer } from "../../providers";
import { HeaderItem } from "./AppHeader";
import { Logo } from "./Logo";

export type SidebarDrawer = {
  options: OptionType[];
};

export function SidebarDrawer({ options }: SidebarDrawer) {
  const { isOpen, setOpen } = useDrawer();
  const { pathname } = useLocation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Drawer side="left" open={isOpen} onOpenChange={setOpen}>
      <DrawerOverlay className="z-[100]">
        <DrawerClose className="top-2 right-2" />
      </DrawerOverlay>
      <DrawerContent className="w-max p-0 z-[100] dark:bg-secondary-900">
        <div className="flex h-full relative flex-col flex-shrink-0 flex-grow-0 w-[250px] min-w-[250px] max-w-[250px]">
          <header className="px-3 my-[7.5px]">
            <div className="w-max">
              <Logo />
            </div>
          </header>
          <div className="mt-[15px] space-y-2 px-3 overflow-x-hidden overflow-y-auto h-full">
            {options.map((item) => (
              <HeaderItem key={item.label} {...item} />
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
