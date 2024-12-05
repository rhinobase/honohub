"use client";
import type { FieldProps } from "@duck-form/fields";
import { CopyButton } from "@honohub/shared";
import { JSONExplorer } from "@rafty/corp";
import { Tab, TabContent, TabList, TabTrigger } from "@rafty/ui";
import { useFormContext, useWatch } from "react-hook-form";

export type DevToolPanel = {
  schema?: Record<string, FieldProps>;
};

export function DevToolPanel({ schema }: DevToolPanel) {
  const { control } = useFormContext();
  const values = useWatch({ control });

  return (
    <div className="border border-secondary-300 dark:border-secondary-700 rounded-md flex h-full w-full max-w-80">
      <Tab defaultValue="values" className="flex h-full w-full flex-col">
        <TabList className="relative">
          <TabTrigger value="values">Values</TabTrigger>
          <TabTrigger value="schema">Schema</TabTrigger>
          <CopyButton
            data={JSON.stringify(values, null, 2)}
            tooltipContent="Copy Form Values"
            className="absolute top-1.5 right-2"
          />
        </TabList>
        <TabContent value="values" className="flex-1 overflow-auto text-sm p-2">
          <JSONExplorer data={values} />
        </TabContent>
        <TabContent value="schema" className="flex-1 overflow-auto p-2">
          <JSONExplorer data={schema} />
        </TabContent>
      </Tab>
    </div>
  );
}
