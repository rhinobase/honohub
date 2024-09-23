import { Outlet } from "react-router-dom";
import { PageWrapper } from "../PageWrapper";
import { CollectionSidebar } from "./Sidebar";

export type CollectionsWrapper = Pick<CollectionSidebar, "options">;

export function CollectionsWrapper({ options }: CollectionsWrapper) {
  return (
    <div className="flex h-full">
      <CollectionSidebar options={options} />
      <PageWrapper className="[&>div]:h-full">
        <Outlet />
      </PageWrapper>
    </div>
  );
}
