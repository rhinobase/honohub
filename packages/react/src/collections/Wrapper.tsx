import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { CollectionSidebar } from "../Components";

export type CollectionsWrapper = Pick<CollectionSidebar, "options">;

export function CollectionsWrapper({ options }: CollectionsWrapper) {
  const navigate = useNavigate();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Specified dependencies are enough
  useEffect(() => {
    navigate(`/${options[0].slug}`);
  }, [options]);

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
