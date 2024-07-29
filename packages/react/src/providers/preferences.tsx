import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

export enum SupportedLang {
  NODEJS = "js",
  PYTHON = "py",
  RUBY = "ruby",
  GO = "go",
  PHP = "php",
  CURL = "bash",
}

const PreferencesContext = createContext<ReturnType<
  typeof usePreferencesManager
> | null>(null);

export function PreferencesProvider({ children }: PropsWithChildren) {
  const value = usePreferencesManager();

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

function usePreferencesManager() {
  const [lang, setLang] = useState(SupportedLang.NODEJS);

  return { lang, setLang };
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context)
    throw new Error("Missing PreferencesContext.Provider in the tree!");

  return context;
}
