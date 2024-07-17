import { Outlet } from "react-router-dom";
import { AppSidebar } from "./Sidebar";

export type AppWrapper = Pick<AppSidebar, "options">;

export function AppWrapper({ options }: AppWrapper) {
  return (
    <div className="flex w-full h-screen dark:bg-secondary-950 selection:text-secondary-700 bg-white selection:bg-[#79ffe1] dark:selection:bg-[#f81ce5] dark:selection:text-white">
      <AppSidebar options={options} />
      <Outlet />
    </div>
  );
}
