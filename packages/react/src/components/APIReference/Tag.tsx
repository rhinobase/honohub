import { classNames } from "@rafty/ui";

const colorStyles = {
  emerald:
    "ring-emerald-300 dark:ring-emerald-400/30 bg-emerald-400/10 text-emerald-500 dark:text-emerald-400",
  sky: "ring-sky-300 bg-sky-400/10 text-sky-500 dark:ring-sky-400/30 dark:bg-sky-400/10 dark:text-sky-400",
  amber:
    "ring-amber-300 bg-amber-400/10 text-amber-500 dark:ring-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400",
  rose: "ring-rose-200 bg-rose-50 text-red-500 dark:ring-rose-500/20 dark:bg-rose-400/10 dark:text-rose-400",
};

const valueColorMap = {
  GET: "emerald",
  POST: "sky",
  PUT: "amber",
  DELETE: "rose",
} as Record<string, keyof typeof colorStyles>;

export function Tag({
  children,
  color = valueColorMap[children] ?? "emerald",
}: {
  children: keyof typeof valueColorMap & string;
  color?: keyof typeof colorStyles;
}) {
  return (
    <span
      className={classNames(
        "font-mono text-[0.625rem] font-semibold leading-6 rounded-lg px-1.5 ring-1 ring-inset",
        colorStyles[color],
      )}
    >
      {children}
    </span>
  );
}
