import { SearchField as RaftySearchField } from "@rafty/ui";
import { useDebounce } from "@uidotdev/usehooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function SearchField() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultSearch = searchParams.get("search") ?? undefined;

  const [search, setSearch] = useState<string | undefined>(defaultSearch);

  const debouncedSearch = useDebounce(search, 150);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: need to push new url only when search changes
  useEffect(() => {
    if (debouncedSearch)
      router.push(
        `${pathname}?${createQueryString("search", debouncedSearch)}`,
      );
    else router.push(pathname);
  }, [debouncedSearch]);

  return <RaftySearchField value={search} onValueChange={setSearch} />;
}
