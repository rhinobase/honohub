import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export type AppWrapper = Pick<Sidebar, "options">;

export function AppWrapper({ options }: AppWrapper) {
  return (
    <div className="flex w-full h-screen">
      <Sidebar options={options} />
      <Outlet />
    </div>
  );
}
