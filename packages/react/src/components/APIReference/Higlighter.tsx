import { Skeleton } from "@rafty/ui";
import { useShiki, useTheme } from "../../providers";

export type CodeHighlighter = { content: string; language: string };

export function CodeHighlighter({ content, language }: CodeHighlighter) {
  const highlighter = useShiki();
  const { theme } = useTheme();

  if (!highlighter)
    return (
      <div className="h-full space-y-2 py-3">
        <Skeleton className="h-5 w-1/2 rounded" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-5 w-1/4 rounded" />
      </div>
    );

  const html = highlighter.codeToHtml(content, {
    lang: language,
    theme: theme === "light" ? "github-light-default" : "github-dark-default",
  });

  return (
    <div
      className="h-max min-h-full w-max min-w-full p-4 dark:bg-[#0d1117]"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Need this to show the highlighting
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
