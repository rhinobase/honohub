"use client";
import { SearchField, useQueryParams } from "@rafty/ui";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

export type Searchbar = SearchField &
  (
    | (Pick<useQueryParams, "onChange" | "pathname"> & {
        local?: false;
        searchParams: URLSearchParams;
        paramName?: string;
      })
    | {
        local: true;
        onChange: (search?: string) => void;
      }
  );

export function Searchbar(props: Searchbar) {
  let componentProps = {};

  if (props.local) {
    const { local, onChange, ...searchFieldProps } = props;
    componentProps = searchFieldProps;
  } else {
    const {
      local,
      onChange,
      pathname,
      searchParams,
      paramName,
      ...searchFieldProps
    } = props;
    componentProps = searchFieldProps;
  }

  const defaultValue = !props.local
    ? props.searchParams.get(props.paramName ?? "search")
    : null;

  const [value, setValue] = useState(defaultValue);
  const search = useDebounce(value?.trim(), 150);

  const { setQueryParams } = useQueryParams({
    onChange: props.onChange,
    pathname: props.local ? "" : props.pathname,
    searchParams: props.local ? "" : props.searchParams.toString(),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: need to push new url only when search changes
  useEffect(() => {
    if (props.local) props.onChange(search);
    else setQueryParams({ search });
  }, [search]);

  return (
    <SearchField
      {...componentProps}
      value={value ?? undefined}
      onValueChange={setValue}
    />
  );
}
