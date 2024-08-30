import { Outlet } from "react-router-dom";
import {
  DialogManagerProvider,
  DrawerProvider,
  SidebarProvider,
} from "../../providers";
import { BaseWrapper } from "../BaseWrapper";
import { ActionDialog } from "./ActionDialog";
import { SidebarDrawer } from "./Drawer";
import { AppSidebar } from "./Sidebar";

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
