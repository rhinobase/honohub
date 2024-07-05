import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { Button } from "@rafty/ui";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const otherTheme = resolvedTheme === "dark" ? "light" : "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label={mounted ? `Switch to ${otherTheme} theme` : "Toggle theme"}
      onClick={() => setTheme(otherTheme)}
    >
      <SunIcon
        className="stroke-secondary-900 stroke-2 dark:hidden"
        width={16}
        height={16}
      />
      <MoonIcon
        className="hidden stroke-white stroke-2 dark:block"
        width={16}
        height={16}
      />
    </Button>
  );
}
