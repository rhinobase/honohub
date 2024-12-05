import {
  Avatar,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Text,
} from "@rafty/ui";
import { useField } from "duck-form";
import type { ColumnThreadProps } from "./types";

type UserProfile = {
  displayName: string;
  email: string;
  photo: string;
};

export function UserProfileCell() {
  const { value } = useField<ColumnThreadProps<UserProfile>>();

  return (
    <div className="flex items-center">
      <HoverCard openDelay={300} closeDelay={100}>
        <HoverCardTrigger className="flex items-center gap-1.5 cursor-pointer">
          <Avatar
            src={value.photo}
            name={value.displayName}
            className="size-6"
          />
          <Text className="font-medium">{value.displayName}</Text>
        </HoverCardTrigger>
        <HoverCardContent className="p-3 flex items-center gap-2.5">
          <Avatar
            src={value.photo}
            name={value.displayName}
            className="size-10"
          />
          <div className="space-y-1.5">
            <Text className="leading-none">{value.displayName}</Text>
            <Text className="text-sm leading-none text-secondary-500 dark:text-secondary-400">
              {value.email}
            </Text>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
