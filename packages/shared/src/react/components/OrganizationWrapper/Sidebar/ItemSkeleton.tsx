import { Skeleton } from "@rafty/ui";

export type SidebarItemsSkeleton = { length: number };

export function SidebarItemsSkeleton({ length }: SidebarItemsSkeleton) {
  return Array.from({ length }).map((_, index) => (
    <Skeleton
      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
      key={`${index}-sidebar-skeleton`}
      className="w-full min-h-10 h-10 rounded-md"
    />
  ));
}
