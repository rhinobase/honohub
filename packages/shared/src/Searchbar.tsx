"use client";
import { SearchField, useQueryParams } from "@rafty/ui";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

export type Searchbar = SearchField &
  Omit<useQueryParams, "searchParams" | "onChange"> & {
    searchParams: URLSearchParams;
    paramName?: string;
  } & (
    | ({ local?: false } & Pick<useQueryParams, "onChange">)
    | {
        local: true;
        onChange: (search?: string) => void;
      }
  );

export function Searchbar({
  local,
  onChange,
  pathname,
  searchParams,
  paramName = "search",
  ...props
}: Searchbar) {
  const defaultValue = !local ? searchParams.get(paramName) : null;

  const [value, setValue] = useState(defaultValue);
  const search = useDebounce(value?.trim(), 150);

  const { setQueryParams } = useQueryParams({
    onChange,
    pathname,
    searchParams: searchParams.toString(),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: need to push new url only when search changes
  useEffect(() => {
    if (local) onChange(search);
    else if (search) setQueryParams({ search });
    else onChange(pathname);
  }, [search]);

  return (
    <SearchField
      {...props}
      value={value ?? undefined}
      onValueChange={setValue}
    />
  );
}
