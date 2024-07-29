import { classNames } from "@rafty/ui";
import type { ImgHTMLAttributes } from "react";

export type Logo = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;

export function Logo({ className, ...props }: Logo) {
  return (
    <img
      {...props}
      src="https://honohub.dev/images/logo-small.png"
      alt="honohub logo"
      className={classNames("size-7", className)}
    />
  );
}
