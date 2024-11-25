import { Searchbar } from "@honohub/shared";
import { Spinner, useLastElement } from "@rafty/ui";
import { useField } from "duck-form";
import { useState } from "react";
import { useReferenceFilterData } from "../../queries/useReferenceFilterData";
import { CommonFilterWrapper, FilterList } from "./CommonFilterWrapper";

export type ReferenceFilter = {
  name: string;
  label: {
    singular: string;
    plural: string;
  };
  slug: string;
};

export function ReferenceFilter() {
  const props = useField<ReferenceFilter>();
  const [search, setSearch] = useState<string>();
  const {
    data: referenceData,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useReferenceFilterData({ slug: props.slug, search });

  const data = referenceData?.pages.flatMap((item) => item.results);

  const lastElementRef = useLastElement({
    fetchNextPage,
    hasNextPage,
    isFetching,
  });

  return (
    <CommonFilterWrapper label={props.label.plural} name={props.name}>
      <div className="h-full p-1">
        <Searchbar
          size="sm"
          local
          onChange={setSearch}
          className="mb-1"
          placeholder={`Search ${props.label.singular.toLowerCase()}`}
        />
        {data ? (
          data.length > 0 ? (
            <FilterList
              name={props.name}
              items={data.map((item) => ({
                label: item.title,
                value: item._ref,
              }))}
              ref={lastElementRef}
            />
          ) : (
            <p className="text-xs text-secondary-400 dark:text-secondary-600 py-1.5 text-center">
              No {props.label.singular.toLowerCase()} found
            </p>
          )
        ) : (
          isLoading && (
            <div className="flex items-center gap-1.5 w-full justify-center py-1.5">
              <Spinner size="sm" className="min-w-4 min-h-4 size-4" />
              <p className="text-xs text-secondary-600 dark:text-secondary-400">
                Loading {props.label.plural.toLowerCase()} data...
              </p>
            </div>
          )
        )}
        {isFetching && !isLoading && (
          <div className="flex items-center gap-1.5 w-full justify-center py-1.5">
            <Spinner size="sm" className="min-w-4 min-h-4 size-4" />
            <p className="text-xs text-secondary-600 dark:text-secondary-400">
              Loading more data...
            </p>
          </div>
        )}
      </div>
    </CommonFilterWrapper>
  );
}
