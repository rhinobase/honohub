import { Outlet } from "react-router-dom";
import {
  DialogManagerProvider,
  DrawerProvider,
  SidebarProvider,
} from "../providers";
import { ActionDialog } from "./ActionDialog";
import { AppSidebar } from "./AppSidebar";
import { BaseWrapper } from "./BaseWrapper";
import { SidebarDrawer } from "./Drawer";

export type AppWrapper = Pick<AppSidebar, "options">;

export function AppWrapper({ options }: AppWrapper) {
  return (
    <DialogManagerProvider>
      <DrawerProvider>
        <SidebarProvider>
          <BaseWrapper>
            <AppSidebar
              options={options}
              className="hidden md:flex border-r border-secondary-200 dark:border-secondary-800"
            />
            <Outlet />
            <ActionDialog />
            <SidebarDrawer options={options} />
          </BaseWrapper>
        </SidebarProvider>
      </DrawerProvider>
    </DialogManagerProvider>
  );
}
