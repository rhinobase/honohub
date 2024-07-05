import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import "./global.css";

export const metadata: Metadata = {
  title: {
    template: "%s - Fibr Playground",
    default: "Fibr Playground",
  },
};

export default async function RootLayout(props: PropsWithChildren) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="dark:bg-secondary-950 flex min-h-full bg-white antialiased">
        {props.children}
      </body>
    </html>
  );
}
