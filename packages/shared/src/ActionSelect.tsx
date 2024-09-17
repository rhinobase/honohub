"use client";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  type ComboboxOptionType,
  ComboboxTrigger,
  findLabel,
  useComboboxContext,
} from "@rafty/corp";
import { Skeleton, Spinner } from "@rafty/ui";
import { type ReactNode, useMemo, useState } from "react";
import { ErrorComponent } from "./ErrorComponent";

export type ActionType = {
  name: string;
  icon: ReactNode;
  label?: string;
};

export type ActionSelect = {
  handler: (name: string) => void | Promise<void>;
  actions?: ActionType[];
  isLoading?: boolean;
  isError?: boolean;
};

export function ActionSelect({
  handler,
  actions = [],
  isError,
  isLoading,
}: ActionSelect) {
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const [options, icons] = useMemo(() => {
    const options: ComboboxOptionType[] = [];
    const icons: Record<string, ReactNode> = {};

    for (const action of actions) {
      options.push({
        label: action.label ?? action.name,
        value: action.name,
      });
      icons[action.name] = action.icon;
    }

    return [options, icons];
  }, [actions]);

  if (isLoading) return <Skeleton className="w-[300px] h-[38px]" />;

  if (isError) return <ErrorComponent className="w-max" />;

  return (
    <div className="w-[300px]">
      <Combobox
        options={options}
        placeholder={{ trigger: "Select an action" }}
        selected={selected}
        onSelectionChange={async (value) => {
          const action = value ? String(value) : undefined;

          setSelected(action);

          if (action) {
            await handler(action);
            setSelected(undefined);
          }
        }}
      >
        <ComboboxTrigger>
          <CustomTriggerRender />
        </ComboboxTrigger>
        <ComboboxContent showArrow={false}>
          {({ option }) => {
            const val = String(option.value);
            return <CustomOption {...option} icon={icons[val]} />;
          }}
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

function CustomTriggerRender() {
  const { selected, options } = useComboboxContext();
  const label = findLabel(selected[0], options);

  if (!selected || selected.length > 0)
    return (
      <div className="flex items-center gap-2">
        <Spinner size="sm" />
        {label}
      </div>
    );
  return "Select Option";
}

function CustomOption({
  label,
  value,
  icon,
}: ComboboxOptionType & { icon: ReactNode }) {
  const { onSelectionChange } = useComboboxContext();

  return (
    <ComboboxItem
      value={String(value)}
      onSelect={onSelectionChange}
      className="gap-2"
    >
      {icon}
      {label}
    </ComboboxItem>
  );
}
