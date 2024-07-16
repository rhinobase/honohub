import { classNames } from "@rafty/ui";

export function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="HonoHub"
      className={classNames("w-10 h-10", className)}
    />
  );
}
