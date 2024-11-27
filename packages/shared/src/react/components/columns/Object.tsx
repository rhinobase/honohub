import { JSONExplorer } from "@rafty/corp";
import { useField } from "duck-form";

export function ObjectCell() {
  const { value } = useField<{ value: unknown }>();

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <JSONExplorer data={{ value }} />
    </div>
  );
}
