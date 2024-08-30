import { classNames } from "@rafty/ui";

const colorStyles = {
  emerald:
    "ring-emerald-300 dark:ring-emerald-800 bg-emerald-50 dark:bg-emerald-950 text-emerald-500 dark:text-emerald-300",
  sky: "ring-sky-300 dark:ring-sky-800 bg-sky-50 dark:bg-sky-950 text-sky-500 dark:text-sky-300",
  amber:
    "ring-amber-300 dark:ring-amber-700/80 bg-amber-100/60 dark:bg-amber-700/20 text-amber-500 dark:text-amber-400",
  rose: "ring-rose-300 dark:ring-rose-800 bg-rose-50 dark:bg-rose-950 text-rose-500 dark:text-rose-300",
};

const valueColorMap = {
  GET: "emerald",
  POST: "sky",
  PUT: "amber",
  DELETE: "rose",
} as Record<string, keyof typeof colorStyles>;

export type RequestTag = {
  children: keyof typeof valueColorMap & string;
  color?: keyof typeof colorStyles;
};

export function RequestTag({
  children,
  color = valueColorMap[children] ?? "emerald",
}: RequestTag) {
  return (
    <span
      className={classNames(
        "font-mono text-[0.690rem] font-semibold rounded-md select-none px-1.5 py-1 leading-none ring-1 ring-inset",
        colorStyles[color],
      )}
    >
      {children}
    </span>
  );
}
