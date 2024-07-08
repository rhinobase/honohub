"use client";
import { eventHandler } from "@rafty/ui";
import type { CellContext } from "@tanstack/react-table";
import { CellWrapper } from "./CellWrapper";

export function ClipboardCell<T = unknown, U = unknown>({
  cell,
}: CellContext<T, U>) {
  const value = String(cell.getValue());

  const handleClick = eventHandler(() => navigator.clipboard.writeText(value));

  return (
    <CellWrapper value={value}>
      <div
        className="cursor-pointer"
        onClick={handleClick}
        onKeyDown={handleClick}
        title="Copied"
      >
        {value}
      </div>
    </CellWrapper>
  );
}
