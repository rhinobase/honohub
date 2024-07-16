import { Outlet } from "react-router-dom";
import { AppSidebar } from "./Sidebar";

export type AppWrapper = Pick<AppSidebar, "options">;

export function AppWrapper({ options }: AppWrapper) {
  return (
    <div className="flex w-full h-screen">
      <AppSidebar options={options} />
      <Outlet />
    </div>
  );
}
