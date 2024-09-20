import { Outlet } from "react-router-dom";
import { DialogManagerProvider, DrawerProvider } from "../../providers";
import { BaseWrapper } from "../BaseWrapper";
import { ActionDialog } from "./ActionDialog";
import { AppHeader } from "./AppHeader";
import { SidebarDrawer } from "./Drawer";

export type OptionType = {
  path: string;
  label: string;
};

const OPTIONS: OptionType[] = [
  {
    path: "/collections",
    label: "Collections",
  },
  {
    path: "/plugins",
    label: "Plugins",
  },
];

export function AppWrapper() {
  return (
    <DialogManagerProvider>
      <DrawerProvider>
        <BaseWrapper>
          <AppHeader options={OPTIONS} />
          <Outlet />
          <ActionDialog />
          <SidebarDrawer options={OPTIONS} />
        </BaseWrapper>
      </DrawerProvider>
    </DialogManagerProvider>
  );
}
