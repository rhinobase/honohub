import { Outlet } from "react-router-dom";
import { DialogManagerProvider } from "../../providers";
import { ActionDialog } from "../ActionDialog";
import { BaseWrapper } from "../BaseWrapper";
import { AppSidebar } from "./Sidebar";

export type AppWrapper = Pick<AppSidebar, "options">;

export function AppWrapper({ options }: AppWrapper) {
  return (
    <DialogManagerProvider>
      <BaseWrapper>
        <AppSidebar options={options} />
        <Outlet />
        <ActionDialog />
      </BaseWrapper>
    </DialogManagerProvider>
  );
}
