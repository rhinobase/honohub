import { classNames } from "@rafty/ui";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { PropsWithChildren } from "react";
import "./global.css";
import { Providers } from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "rhinobase",
    template: "%s | rhinobase",
  },
  description: "Building the next-generation platform for No Code Apps",
  keywords: [
    "no code",
    "low code",
    "platform",
    "open source",
    "javascript",
    "typescript",
    "next-gen",
  ],
  category: "technology",
  authors: [
    {
      name: "rhinobase team",
      url: "https://github.com/rhinobase",
    },
    {
      name: "Decole Technologies",
      url: "https://decole.io",
    },
  ],
  metadataBase: new URL("https://rhinobase.io"),
  twitter: {
    card: "summary_large_image",
    title: {
      default: "rhinobase",
      template: "%s | rhinobase",
    },
    description: "Building the next-generation platform for No Code Apps",
    creator: "@rhinobaseio",
    images: {
      width: 1200,
      height: 630,
      url: "https://rhinobase.io/api/og",
    },
  },
  openGraph: {
    title: {
      default: "rhinobase",
      template: "%s | rhinobase",
    },
    description: "Building the next-generation platform for No Code Apps",
    url: "https://rhinobase.io",
    siteName: "rhinobase home page",
    images: {
      width: 1200,
      height: 630,
      url: "https://rhinobase.io/api/og",
    },
    locale: "en_US",
    type: "website",
  },
  manifest: "/manifest.json",
  icons: {
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
    icon: [
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
      </head>
      <body
        className={classNames(
          inter.className,
          "h-screen w-full bg-white dark:bg-secondary-950 text-black dark:text-white selection:bg-[#79ffe1] dark:selection:bg-[#f81ce5] dark:selection:text-white selection:text-secondary-700",
        )}
      >
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}
