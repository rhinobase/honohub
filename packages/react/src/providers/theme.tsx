import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export enum ColorMode {
  DARK = "dark",
  LIGHT = "light",
  SYSTEM = "system",
}

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
  const [theme, toggle] = useState<ColorMode>(
    localStorage.theme || ColorMode.SYSTEM,
  );

  useEffect(() => {
    const applyTheme = (theme: ColorMode) => {
      if (theme === ColorMode.DARK) {
        document.documentElement.classList.add(ColorMode.DARK);
      } else {
        document.documentElement.classList.remove(ColorMode.DARK);
      }
    };

    if (theme === ColorMode.SYSTEM) {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const systemTheme = media.matches ? ColorMode.DARK : ColorMode.LIGHT;
      applyTheme(systemTheme);

      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? ColorMode.DARK : ColorMode.LIGHT);
      };

      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }

    applyTheme(theme);
  }, [theme]);

  const setTheme = (newTheme: ColorMode) => {
    toggle(newTheme);
    localStorage.setItem("theme", newTheme);
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
