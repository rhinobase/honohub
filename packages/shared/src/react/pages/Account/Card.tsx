import { Card, CardContent, CardHeader } from "@rafty/ui";
import type { PropsWithChildren } from "react";

export type AccountPageCard = PropsWithChildren<{
  title: string;
}>;

export function AccountPageCard(props: AccountPageCard) {
  return (
    <Card>
      <CardHeader className="border-b border-secondary-300 dark:border-secondary-700">
        <h4 className="text-xl font-semibold">{props.title}</h4>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-4">
        {props.children}
      </CardContent>
    </Card>
  );
}
