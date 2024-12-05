import { Skeleton, classNames } from "@rafty/ui";

export type LoadingSkeletons = {
  count: number;
} & Pick<Skeleton, "className">;

export function LoadingSkeletons({ count, className }: LoadingSkeletons) {
  return Array.from({ length: count }).map((_, index) => (
    <Skeleton
      key={`${index}-${"loading"}`}
      className={classNames("w-full h-10 rounded-md", className)}
    />
  ));
}
