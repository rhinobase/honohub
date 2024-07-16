import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { CollectionSidebar } from "./Sidebar";

export type CollectionsWrapper = Pick<CollectionSidebar, "options">;

export function CollectionsWrapper({ options }: CollectionsWrapper) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Specified dependencies are enough
  useEffect(() => {
    if (pathname === "/collections")
      navigate(`/collections/${options[0].slug}`);
  }, [options, pathname]);

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
