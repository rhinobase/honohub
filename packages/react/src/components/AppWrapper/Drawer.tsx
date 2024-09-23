import { Drawer, DrawerClose, DrawerContent, DrawerOverlay } from "@rafty/ui";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDrawer } from "../../providers";
import type { HeaderOptionType } from "../../types";
import { HeaderItem } from "./AppHeader";
import { Logo } from "./Logo";

export type SidebarDrawer = {
  options: HeaderOptionType[];
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
      <DrawerContent className="w-[250px] z-[100] dark:bg-secondary-900 flex flex-col p-3 gap-3">
        <Logo />
        <div className="space-y-1.5 overflow-x-hidden overflow-y-auto h-full">
          {options.map((item) => (
            <HeaderItem key={item.label} {...item} />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
