"use client";
import { memo } from "react";

function Divider() {
  return (
    <hr className="w-full my-1 border-secondary-200 dark:border-secondary-800" />
  );
}

export default memo(Divider);
