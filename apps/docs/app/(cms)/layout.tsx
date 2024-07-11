"use client";
import { ArrowUpTrayIcon, CircleStackIcon } from "@heroicons/react/24/outline";
import { AppWrapper } from "@honohub/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

const CLIENT = new QueryClient();

export default function CMSLayout(props: PropsWithChildren) {
  return (
    <QueryClientProvider client={CLIENT}>
      <div className="flex w-full h-screen">
        <AppWrapper
          options={[
            {
              label: "Collections",
              icon: CircleStackIcon,
              route: "/collections",
            },
            {
              label: "Uploads",
              icon: ArrowUpTrayIcon,
              route: "/uploads",
            },
          ]}
        >
          {props.children}
        </AppWrapper>
      </div>
    </QueryClientProvider>
  );
}
