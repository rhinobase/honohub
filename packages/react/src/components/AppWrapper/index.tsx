import { Outlet } from "react-router-dom";
import { BaseWrapper } from "../BaseWrapper";
import { AppSidebar } from "./Sidebar";

export type AppWrapper = Pick<AppSidebar, "options">;

export function AppWrapper({ options }: AppWrapper) {
  return (
    <BaseWrapper>
      <AppSidebar options={options} />
      <Outlet />
    </BaseWrapper>
  );
}
