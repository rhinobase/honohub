import { useField } from "duck-form";
import type { ColumnThreadProps } from "./types";

export function IconCell() {
  const { value } = useField<ColumnThreadProps<string>>();

  return (
    <div className="flex items-center gap-1.5">
      <span className="material-icons-round !text-lg !leading-none">
        {value}
      </span>
      <p>{value}</p>
    </div>
  );
}
