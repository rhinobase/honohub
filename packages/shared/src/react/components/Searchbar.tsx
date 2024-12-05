"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchbarComponent } from "../../shared";

export type Searchbar = Pick<SearchbarComponent, "placeholder">;

export function Searchbar(props: Searchbar) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <SearchbarComponent
      {...props}
      onChange={router.push}
      pathname={pathname}
      searchParams={searchParams}
    />
  );
}
