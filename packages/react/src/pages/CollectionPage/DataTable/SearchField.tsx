import { SearchField as RaftySearchField } from "@rafty/ui";
import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function SearchField() {
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultSearch = searchParams.get("search") ?? undefined;

  const [search, setSearch] = useState<string | undefined>(defaultSearch);

  const debouncedSearch = useDebounce(search, 150);

  const createQueryString = useCallback(
    (name: string, value?: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) params.set(name, value);
      else params.delete(name);

      return params.toString();
    },
    [searchParams],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: need to push new url only when search changes
  useEffect(() => {
    setSearchParams(createQueryString("search", debouncedSearch));
  }, [debouncedSearch]);

  return <RaftySearchField value={search} onValueChange={setSearch} />;
}
