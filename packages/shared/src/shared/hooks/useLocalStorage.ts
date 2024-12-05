"use client";
import { useEffect, useState } from "react";

export type useLocalStorage<T> = {
  storageKey: string;
  defaultValue?: T;
};

export function useLocalStorage<T>(props: useLocalStorage<T>) {
  const [state, setState] = useState<T>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only need to run on state change
  useEffect(() => {
    if (state == null)
      setState(
        (localStorage.getItem(props.storageKey) as T) ?? props.defaultValue,
      );
    else localStorage.setItem(props.storageKey, String(state));
  }, [state]);

  return [state, setState] as const;
}
