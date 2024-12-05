"use client";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  getActionPerformed,
  useOrganizationActivitiesData,
} from "@honohub/shared";
import { Button, Skeleton, Tag } from "@rafty/ui";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

dayjs.extend(relativeTime);

export function HistoryPanel() {
  const pathname = usePathname();
  const { org, id } = useParams();
  const { data } = useOrganizationActivitiesData({
    userId: [String(id)],
  });

  const activities = data?.results.slice(0, 5);

  return (
    <div className="hidden xl:block space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6">
      <div className="flex items-center gap-1 lg:gap-2">
        <span className="material-icons-round !text-xl md:!text-2xl">
          history
        </span>
        <h4 className="text-lg md:text-xl font-semibold min-w-max">
          Recent Activities
        </h4>
        <div className="flex-1" />
        <Link href={`${pathname}/activity`}>
          <Button size="icon" variant="ghost">
            <ArrowRightIcon className="size-4 stroke-[3]" />
          </Button>
        </Link>
      </div>
      <div className="space-y-1 md:space-y-2 lg:space-y-3 xl:space-y-4">
        {activities ? (
          activities.length > 0 ? (
            activities.map(({ collection, action, date, document }, index) => {
              const { label, color } = getActionPerformed(action);

              return (
                <Link
                  href={`/organisations/${org}/collections/${collection.slug}/${document}`}
                  className="w-full text-sm text-secondary-800 group/activity flex items-center gap-1.5 dark:text-secondary-200"
                  key={`${index}-${id}-activity`}
                  target="_blank"
                >
                  <Tag colorScheme={color as Tag["colorScheme"]}>{label}</Tag>
                  <span className="group-hover/activity:underline group-hover/activity:text-blue-500 dark:group-hover/activity:text-blue-300">
                    {collection.name}
                  </span>
                  <div className="flex-1" />
                  <span className="text-xs font-medium text-secondary-500 dark:text-secondary-400 min-w-max">
                    {dayjs(date).fromNow(true)} ago
                  </span>
                </Link>
              );
            })
          ) : (
            <div className="w-full h-[150px] border-2 border-dashed border-secondary-200 dark:border-secondary-800 flex items-center justify-center">
              <p className="text-secondary-400 dark:text-secondary-600 text-sm select-none">
                No recent activity
              </p>
            </div>
          )
        ) : (
          // isLoading &&
          Array.from({ length: 5 }, (_, i) => (
            <Skeleton
              key={`${i}-${"loading"}`}
              className="w-full h-7 rounded"
            />
          ))
        )}
      </div>
    </div>
  );
}
