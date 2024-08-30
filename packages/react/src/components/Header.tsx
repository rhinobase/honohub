import { Bars3Icon } from "@heroicons/react/24/outline";
import { Button, classNames, eventHandler } from "@rafty/ui";
import { type HTMLAttributes, forwardRef } from "react";
import { useDrawer } from "../providers";

export type PageHeader = HTMLAttributes<HTMLElement>;

export const PageHeader = forwardRef<HTMLElement, PageHeader>(
  function PageHeader({ className, children, ...props }, forwardedRef) {
    const { setOpen } = useDrawer();

    const handleDrawerOpen = eventHandler(() => setOpen(true));

    return (
      <header
        {...props}
        className={classNames("flex items-center gap-2", className)}
        ref={forwardedRef}
      >
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={handleDrawerOpen}
          onKeyDown={handleDrawerOpen}
        >
          <Bars3Icon className="size-[18px] stroke-[3]" />
        </Button>
        {children}
      </header>
    );
  },
);

export type PageTitle = HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export const PageTitle = forwardRef<HTMLHeadingElement, PageTitle>(
  function PageTitle({ as = "h2", className, ...props }, forwardedRef) {
    const Component = as;

    return (
      <Component
        {...props}
        className={classNames(
          "text-2xl md:text-3xl font-bold dark:text-secondary-100 leading-tight",
          className,
        )}
        ref={forwardedRef}
      />
    );
  },
);
