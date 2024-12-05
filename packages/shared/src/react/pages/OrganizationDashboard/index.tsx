"use client";
import { Squares2X2Icon, SwatchIcon } from "@heroicons/react/24/outline";
import Fuse from "fuse.js";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { LoadingSkeletons, PageHeader, Searchbar } from "../../components";
import { useCollection } from "../../providers";
import { useCollectionsGroups } from "../../queries";
import { CollectionCard } from "./CollectionCard";
import { CollectionsWrapper } from "./CollectionsWrapper";
import { GridWrapper } from "./GridWrapper";

export function OrganizationDashboardPage() {
  const { collections } = useCollection();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const fuse = useMemo(
    () =>
      new Fuse(collections ?? [], {
        keys: ["name.plural"],
        includeMatches: true,
      }),
    [collections],
  );

  let searchResults: CollectionCard[] | undefined = collections;

  if (search) {
    const results = fuse.search(search);

    searchResults = results.reduce<typeof searchResults>(
      (prev, { item, matches }) => {
        prev?.push({
          ...item,
          matches: matches?.flatMap((match) => match.indices),
        });

        return prev;
      },
      [],
    );
  }

  return (
    <>
      <PageHeader title="Dashboard" icon={Squares2X2Icon} />
      <Searchbar placeholder="Search collection" />
      <Groups collections={searchResults} />
      <Collections collections={searchResults} />
    </>
  );
}

type Groups = {
  collections?: CollectionCard[];
};

function Groups(props: Groups) {
  const { data } = useCollectionsGroups();

  const collectionMap = useMemo(
    () =>
      props.collections?.reduce<Record<string, CollectionCard>>((prev, cur) => {
        prev[cur._id] = cur;
        return prev;
      }, {}),
    [props.collections],
  );

  if (!data || !collectionMap)
    return (
      <CollectionsWrapper
        title="Groups"
        icon={<span className="material-icons-round">workspaces</span>}
      >
        <GridWrapper>
          <LoadingSkeletons count={5} className="h-16" />
        </GridWrapper>
      </CollectionsWrapper>
    );

  return data.map((group) => {
    const collections = group.collections.reduce<CollectionCard[]>(
      (prev, col) => {
        const item = collectionMap[col._ref];

        if (item) prev.push(item);
        return prev;
      },
      [],
    );

    if (collections.length > 0)
      return (
        <CollectionsWrapper
          title={group.name}
          icon={<span className="material-icons-round">{group.icon}</span>}
        >
          <GridWrapper>
            {collections.map((collection, index) => (
              <CollectionCard {...collection} key={`${index}-${"col"}`} />
            ))}
          </GridWrapper>
        </CollectionsWrapper>
      );
  });
}

type Collections = CollectionsGrid;

function Collections(props: Collections) {
  return (
    <CollectionsWrapper
      icon={<SwatchIcon className="size-6" />}
      title="All Collections"
      className="mb-3 md:mb-4 lg:mb-5 xl:mb-6"
    >
      <CollectionsGrid {...props} />
    </CollectionsWrapper>
  );
}

type CollectionsGrid = {
  collections?: CollectionCard[];
};

function CollectionsGrid(props: CollectionsGrid) {
  if (!props.collections)
    return <LoadingSkeletons count={5} className="h-16" />;

  return (
    <GridWrapper>
      {props.collections.map((collection, index) => (
        <CollectionCard {...collection} key={`${index}-${"collection"}`} />
      ))}
    </GridWrapper>
  );
}
