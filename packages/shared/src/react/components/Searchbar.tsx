"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Searchbar as SharedSearchbar } from "../../shared";

export type Searchbar = Pick<SharedSearchbar, "placeholder">;

export function Searchbar(props: Searchbar) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <SharedSearchbar
      {...props}
      onChange={router.push}
      pathname={pathname}
      searchParams={searchParams}
    />
  );
}
