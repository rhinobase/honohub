"use client";
import { Bars3Icon } from "@heroicons/react/24/outline";
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
} from "@rafty/ui";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef } from "react";
import { Navigation } from "./Navigation";
import { useDrawerDialog } from "./store";

const IsInsideMobileNavigationContext = createContext(false);

export function MobileNavigationDialog() {
  const { isOpen, setOpen } = useDrawerDialog();
  const pathname = usePathname();
  const initialPathname = useRef(pathname).current;

  useEffect(() => {
    if (pathname !== initialPathname) {
      setOpen(false);
    }
  }, [pathname, setOpen, initialPathname]);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setOpen}
      aria-label="Navigation"
      side="left"
    >
      <DrawerOverlay />
      <DrawerContent className="size-full max-w-[70vw] p-0 py-6">
        <DrawerClose className="z-[60]" />
        <Navigation className="h-full px-6 pb-6" />
      </DrawerContent>
    </Drawer>
  );
}

export function useIsInsideMobileNavigation() {
  return useContext(IsInsideMobileNavigationContext);
}

export function MobileNavigation() {
  const { setOpen } = useDrawerDialog();

  return (
    <IsInsideMobileNavigationContext.Provider value={true}>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={() => setOpen(true)}
      >
        <Bars3Icon width={20} height={20} className="stroke-2" />
      </Button>
    </IsInsideMobileNavigationContext.Provider>
  );
}
