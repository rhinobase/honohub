import { Text } from "@rafty/ui";
import { Link } from "react-router-dom";
import type { CollectionType } from "../types";

export type CollectionCard = CollectionType;

export function CollectionCard(props: CollectionCard) {
  const label =
    typeof props.label !== "string" ? props.label.plural : props.label;

  return (
    <Link to={`/collections/${props.slug}`}>
      <div className="flex items-center gap-1 md:gap-1.5 lg:gap-2 rounded md:rounded-md bg-secondary-100 hover:shadow-lg p-3 md:p-3.5 lg:p-4 transition-all ease-in-out dark:hover:shadow-none dark:bg-secondary-900 dark:hover:bg-secondary-800">
        <h3 className="text-sm md:text-base lg:text-lg font-medium leading-tight md:leading-none lg:leading-none">
          {label}
        </h3>
        <Text className="line-clamp-1 italic text-secondary-500 text-xs md:text-sm dark:text-secondary-400">
          ({props.slug})
        </Text>
      </div>
    </Link>
  );
}
