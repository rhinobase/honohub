import { Outlet } from "react-router-dom";
import { CollectionSidebar } from "../Components";

export type CollectionsWrapper = Pick<CollectionSidebar, "options">;

export function CollectionsWrapper({ options }: CollectionsWrapper) {
  return (
    <>
      <CollectionSidebar options={options} />
      <div className="flex-1 px-10 py-4 overflow-x-hidden overflow-y-auto scroll-smooth">
        <div className="flex flex-col min-h-0 w-full h-full flex-grow gap-5">
          <Outlet />
        </div>
      </div>
    </>
  );
}
