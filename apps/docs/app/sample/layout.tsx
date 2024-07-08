"use client";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Button } from "@rafty/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren, useState } from "react";
import { Sidebar } from "./Sidebar";

const CLIENT = new QueryClient();

export default function SampleLayout({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(true);

  const handleClick = () => setOpen(false);

  return (
    <QueryClientProvider client={CLIENT}>
      <div className="flex w-full h-screen">
        {open ? (
          <Sidebar onClick={handleClick} />
        ) : (
          <div className="py-5 pl-3">
            <Button size="icon" variant="outline" onClick={() => setOpen(true)}>
              <Bars3Icon className="size-5" />
            </Button>
          </div>
        )}
        <div className="flex-1 px-12 py-4 overflow-x-hidden overflow-y-auto scroll-smooth">
          {children}
        </div>
      </div>
    </QueryClientProvider>
  );
}
