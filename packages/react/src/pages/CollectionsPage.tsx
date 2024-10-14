import { useLocation } from "react-router-dom";
import { CollectionCard } from "../components/CollectionCard";
import { CollectionsWrapper } from "../components/CollectionsWrapper";
import { PageHeader, PageTitle } from "../components/Header";
import { PageWrapper } from "../components/PageWrapper";
import type { CollectionType } from "../types";

export type CollectionsPage = {
  options: CollectionType[];
};

export function CollectionsPage({ options }: CollectionsPage) {
  const location = useLocation();

  console.log(location.pathname);

  if (location.pathname === "/collections")
    return (
      <PageWrapper>
        <PageHeader>
          <PageTitle>Collections</PageTitle>
        </PageHeader>
        <div className="grid grid-cols-1 gap-3 md:gap-4 lg:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {options.map((collection, index) => (
            <CollectionCard {...collection} key={`${index}-${"collection"}`} />
          ))}
        </div>
      </PageWrapper>
    );
  return <CollectionsWrapper options={options} />;
}
