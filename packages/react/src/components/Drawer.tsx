import { Drawer, DrawerClose, DrawerContent, DrawerOverlay } from "@rafty/ui";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDrawer } from "../providers";
import { AppSidebar } from "./AppSidebar";

export type SidebarDrawer = Pick<AppSidebar, "options">;

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
        <AppSidebar options={options} />
      </DrawerContent>
    </Drawer>
  );
}
