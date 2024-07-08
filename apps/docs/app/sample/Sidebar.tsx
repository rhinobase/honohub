"use client";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Sidebar as SidebarComponent, SidebarItem } from "@honohub/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Text,
  classNames,
} from "@rafty/ui";
import { usePathname } from "next/navigation";

const ITEMS = {
  collection: {
    list: {
      label: "List",
    },
  },
};

export function Sidebar({ onClick }: { onClick: () => void }) {
  const pathname = usePathname();

  const currentActive = pathname.split("/")[2] ?? "dashboard";

  return (
    <SidebarComponent
      header={
        <Button
          variant="outline"
          className="w-max"
          size="icon"
          onClick={onClick}
        >
          <ChevronLeftIcon className="size-5" />
        </Button>
      }
    >
      <Accordion type="multiple" variant="ghost">
        {Object.entries(ITEMS).map(([sidebarValue, item]) => (
          <AccordionItem value={sidebarValue} key={sidebarValue}>
            <AccordionTrigger
              isUnstyled
              className="text-secondary-700 flex group transition-all justify-between items-center w-full py-1.5 px-2.5 font-medium"
            >
              {sidebarValue}
            </AccordionTrigger>
            <AccordionContent className="space-y-0.5">
              {Object.entries(item).map(([value, { label }]) => (
                <SidebarItem
                  key={value}
                  className={classNames(
                    value === currentActive &&
                      "border-transparent bg-secondary-100",
                  )}
                  value={value}
                  href={`/sample/${value === "dashboard" ? "" : value}`}
                >
                  <Text className="capitalize font-medium">{label}</Text>
                </SidebarItem>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SidebarComponent>
  );
}
