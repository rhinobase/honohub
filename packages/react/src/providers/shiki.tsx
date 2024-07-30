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
  getSingletonHighlighter,
} from "shiki";
import { SupportedLang } from "./preferences";

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
        const abortListener = ({ target }: any) => {
          controller.signal.removeEventListener("abort", abortListener);
          reject(target.reason);
        };
        controller.signal.addEventListener("abort", abortListener);

        getSingletonHighlighter({
          themes: ["github-light-default", "github-dark-default"],
          langs: Object.values(SupportedLang),
        }).then((highlighter) => {
          setHighlighter(highlighter);
          resolve(highlighter);
        });
      });
    } catch (err) {
      console.error("Failed to load shiki", err);
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
