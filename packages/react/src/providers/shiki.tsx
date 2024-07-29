"use client";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  type BundledLanguage,
  type BundledTheme,
  type HighlighterGeneric,
  bundledLanguages,
  getHighlighter,
} from "shiki";

const ShikiContext = createContext<ReturnType<typeof useHighlighter> | null>(
  null,
);

export function ShikiProvider({ children }: PropsWithChildren) {
  const value = useHighlighter();
  return (
    <ShikiContext.Provider value={value}>{children}</ShikiContext.Provider>
  );
}

function useHighlighter() {
  const [highlighter, setHighlighter] = useState<HighlighterGeneric<
    BundledLanguage,
    BundledTheme
  > | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    try {
      new Promise((resolve, reject) => {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const abortListener = ({ target }: any) => {
          controller.signal.removeEventListener("abort", abortListener);
          reject(target.reason);
        };
        controller.signal.addEventListener("abort", abortListener);

        getHighlighter({
          themes: ["github-light-default", "github-dark-default"],
          langs: Object.keys(bundledLanguages),
        }).then((highlighter) => {
          setHighlighter(highlighter);
          resolve(highlighter);
        });
      });
    } catch {
      /* Catching all the abort errors */
    }

    return () => {
      controller.abort();
    };
  }, []);

  return highlighter;
}

export function useShiki() {
  const context = useContext(ShikiContext);

  return context;
}
