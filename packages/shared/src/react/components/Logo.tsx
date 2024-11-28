import { classNames } from "@rafty/ui";
import Image, { type ImageProps } from "next/image";
import LogoImage from "../public/logo.png";

export type Logo = Omit<ImageProps, "src" | "alt">;

export function Logo({ className, ...props }: Logo) {
  return (
    <Image
      {...props}
      src={LogoImage}
      alt="Rhinobase logo"
      className={classNames("size-8 rounded", className)}
    />
  );
}
