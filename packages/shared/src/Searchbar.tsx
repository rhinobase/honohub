"use client";
import { SearchField, useQueryParams } from "@rafty/ui";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

export type Searchbar = SearchField &
  Omit<useQueryParams, "searchParams"> & {
    searchParams: URLSearchParams;
    paramName?: string;
  };

export function Searchbar({
  onChange,
  pathname,
  searchParams,
  paramName = "search",
  ...props
}: Searchbar) {
  const defaultValue = searchParams.get(paramName) ?? undefined;

  const [value, setValue] = useState(defaultValue);
  const search = useDebounce(value?.trim(), 150);

  const { setQueryParams } = useQueryParams({
    onChange,
    pathname,
    searchParams: searchParams.toString(),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: need to push new url only when search changes
  useEffect(() => {
    if (search) setQueryParams({ search });
    else onChange(pathname);
  }, [search]);

  return <SearchField {...props} value={value} onValueChange={setValue} />;
}
