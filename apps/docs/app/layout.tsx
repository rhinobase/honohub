import glob from "fast-glob";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { Layout } from "../components/Layout";
import type { Section } from "../components/SectionProvider";
import "./global.css";
import { Providers } from "./providers";

export function generateMetadata(): Metadata {
  const title = {
    template: "%s | HonoHub",
    default: "HonoHub - Open Source Honojs Headless CMS",
  };
  const description = "";

  return {
    title,
    description,
    keywords: [],
    metadataBase: new URL("https://www.honohub.dev"),
    authors: [
      {
        name: "Decole Technologies",
        url: "https://decole.io",
      },
    ],
    creator: "Decole Technologies",
    category: "development",
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    openGraph: {
      title,
      description,
      siteName: "HonoHub Website",
      url: "/",
      locale: "en_US",
      type: "website",
      emails: "hello@rhinobase.io",
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
}

export default async function RootLayout(props: PropsWithChildren) {
  const pages = await glob("**/*.mdx", { cwd: "./app" });
  const allSectionsEntries = (await Promise.all(
    pages.map(async (filename) => [
      `/${filename.replace(/(^|\/)page\.mdx$/, "")}`,
      (await import(`./${filename}`)).sections,
    ]),
  )) as Array<[string, Array<Section>]>;
  const allSections = Object.fromEntries(allSectionsEntries);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="dark:bg-secondary-950 h-screen w-full bg-white antialiased">
        <Providers>
          <Layout allSections={allSections}>{props.children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
