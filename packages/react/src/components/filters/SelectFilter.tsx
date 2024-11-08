import { useField } from "duck-form";
import { CommonFilterWrapper, FilterList } from "./CommonFilterWrapper";

export type SelectFilter = {
  name: string;
  label: string;
  options: {
    label: string;
    value: string;
  }[];
};

export function SelectFilter() {
  const props = useField<SelectFilter>();

  return (
    <CommonFilterWrapper name={props.name} label={props.label}>
      <FilterList name={props.name} items={props.options} className="p-1" />
    </CommonFilterWrapper>
  );
}
