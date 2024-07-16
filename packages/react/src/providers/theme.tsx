"use client";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type ThemeContextType = ReturnType<typeof useThemeWatcher>;

const ThemeContext = createContext<ThemeContextType | null>(null);

export type ThemeProviderProps = PropsWithChildren;

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const values = useThemeWatcher();

  return (
    <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>
  );
};

function useThemeWatcher() {
  const [theme, setThemeColor] = useState("light");

  useEffect(() => {
    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const systemTheme = media.matches ? "dark" : "light";
      setThemeColor(systemTheme);

      const handleChange = (e: MediaQueryListEvent) => {
        setThemeColor(e.matches ? "dark" : "light");
      };

      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const setTheme = (theme: string) => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  };

  return {
    theme,
    setTheme,
  };
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) throw new Error("Missing ThemeContext.Provider in the tree!");

  return context;
};
