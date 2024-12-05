import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@rafty/ui";
import type { RangeTuple } from "fuse.js";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { BaseSyntheticEvent } from "react";
import { highlightMatches } from "../../../shared";
import type { CollectionType } from "../../types";

export type CollectionCard = CollectionType & {
  matches?: RangeTuple[];
};

export function CollectionCard(props: CollectionCard) {
  const router = useRouter();
  const { org } = useParams();

  const handleAddCollection = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    router.push(`/organisations/${org}/collections/${props.slug}/create`);
  };

  return (
    <Link href={`/organisations/${org}/collections/${props.slug}`}>
      <div className="group flex items-center gap-2 rounded-md bg-secondary-50 p-3 md:p-3.5 lg:p-4 transition-all ease-in-out hover:bg-secondary-100 dark:bg-secondary-900 dark:hover:bg-secondary-800">
        <span className="material-icons-round text-xl text-secondary-700 transition-all group-hover:text-black dark:text-secondary-200 dark:group-hover:text-secondary-300 ease-in-out">
          {props.icon}
        </span>
        <h4 className="line-clamp-1 text-lg font-medium text-secondary-600 transition-all group-hover:text-black dark:text-secondary-300 dark:group-hover:text-white ease-in-out">
          {props.matches
            ? highlightMatches(props.name.plural, props.matches)
            : props.name.plural}
        </h4>
        <div className="flex-1" />
        {!props.preview?.list && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleAddCollection}
                onKeyDown={handleAddCollection}
              >
                <PlusIcon className="size-4 stroke-[3]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create {props.name.plural}</TooltipContent>
          </Tooltip>
        )}
      </div>
    </Link>
  );
}
