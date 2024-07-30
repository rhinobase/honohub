import { Outlet } from "react-router-dom";
import { DialogManagerProvider, DrawerProvider } from "../providers";
import { ActionDialog } from "./ActionDialog";
import { AppSidebar } from "./AppSidebar";
import { BaseWrapper } from "./BaseWrapper";
import { SidebarDrawer } from "./Drawer";

export type AppWrapper = Pick<AppSidebar, "options">;

export function AppWrapper({ options }: AppWrapper) {
  return (
    <DialogManagerProvider>
      <DrawerProvider>
        <BaseWrapper>
          <AppSidebar
            options={options}
            className="hidden md:flex border-r border-secondary-200 dark:border-secondary-800"
          />
          <Outlet />
          <ActionDialog />
          <SidebarDrawer options={options} />
        </BaseWrapper>
      </DrawerProvider>
    </DialogManagerProvider>
  );
}
