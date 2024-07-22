import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PageWrapper } from "../PageWrapper";
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
      <PageWrapper>
        <Outlet />
      </PageWrapper>
    </>
  );
}
