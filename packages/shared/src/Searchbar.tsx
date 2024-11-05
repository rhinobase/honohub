"use client";
import { SearchField } from "@rafty/ui";
import { useDebounce } from "@uidotdev/usehooks";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

export type Searchbar = SearchField &
  (
    | {
        local?: false;
        paramName?: string;
      }
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
    const { local, paramName, ...searchFieldProps } = props;
    componentProps = searchFieldProps;
  }

  const defaultValue = !props.local ? (props.paramName ?? "search") : "";

  const [query, setQuery] = useQueryState(defaultValue);
  const [value, setValue] = useState(query);
  const search = useDebounce(value?.trim(), 150);

  // biome-ignore lint/correctness/useExhaustiveDependencies: need to push new url only when search changes
  useEffect(() => {
    if (props.local) props.onChange(search);
    else setQuery(search ? search : null);
  }, [search]);

  return (
    <SearchField
      {...componentProps}
      value={value ?? undefined}
      onValueChange={setValue}
    />
  );
}
