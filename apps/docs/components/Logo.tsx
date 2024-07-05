import { classNames } from "@rafty/ui";
import type { SVGProps } from "react";

export type Logo = SVGProps<SVGSVGElement>;

export function Logo({ className, ...props }: Logo) {
  return (
    <svg
      viewBox="0 0 102 65"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={classNames("fill-primary-500", className)}
      {...props}
    >
      <title>Fibr Logo</title>
      <rect x="17" y="0" width="85" height="15" transform="skewX(-15)" />
      <rect x="17" y="25" width="85" height="15" transform="skewX(-15)" />
      <rect x="17" y="50" width="85" height="15" transform="skewX(-15)" />
    </svg>
  );
}
