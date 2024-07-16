import glob from "fast-glob";
import type { PropsWithChildren } from "react";
import { Layout } from "../../components/Layout";
import type { Section } from "../../components/SectionProvider";
import { Providers } from "./providers";

export default async function RootLayout(props: PropsWithChildren) {
  const pages = await glob("**/*.mdx", { cwd: "./app/(docs)" });
  const allSectionsEntries = (await Promise.all(
    pages.map(async (filename) => [
      `/${filename.replace(/(^|\/)page\.mdx$/, "")}`,
      (await import(`./${filename}`)).sections,
    ]),
  )) as Array<[string, Array<Section>]>;
  const allSections = Object.fromEntries(allSectionsEntries);

  return (
    <Providers>
      <div className="w-full">
        <Layout allSections={allSections}>{props.children}</Layout>
      </div>
    </Providers>
  );
}
