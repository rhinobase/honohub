import { classNames } from "@rafty/ui";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { type HTMLAttributes, type PropsWithChildren, forwardRef } from "react";
import { Logo } from "./Logo";
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
} from "./MobileNavigation";
import { MobileSearch, Search } from "./Search";
import { ThemeToggle } from "./ThemeToggle";
import { useDrawerDialog } from "./store";

type TopLevelNavItem = PropsWithChildren<{
  href: string;
}>;

function TopLevelNavItem({ href, children }: TopLevelNavItem) {
  return (
    <li>
      <Link
        href={href}
        className="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 text-[0.875rem] leading-5 leading-[1.5rem] transition dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}

export type Header = Pick<HTMLAttributes<HTMLDivElement>, "className">;

export const Header = forwardRef<HTMLDivElement, Header>(function Header(
  { className },
  forwardedRef,
) {
  const { isOpen: mobileNavIsOpen } = useDrawerDialog();
  const isInsideMobileNavigation = useIsInsideMobileNavigation();

  const { scrollY } = useScroll();
  const bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9]);
  const bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8]);

  return (
    <motion.div
      ref={forwardedRef}
      className={classNames(
        className,
        "fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80",
        !isInsideMobileNavigation &&
          "backdrop-blur-sm lg:left-72 xl:left-80 dark:backdrop-blur",
        isInsideMobileNavigation
          ? "dark:bg-secondary-900 bg-white"
          : "dark:bg-secondary-900/[var(--bg-opacity-dark)] bg-white/[var(--bg-opacity-light)]",
      )}
      style={
        {
          "--bg-opacity-light": bgOpacityLight,
          "--bg-opacity-dark": bgOpacityDark,
        } as React.CSSProperties
      }
    >
      <div
        className={classNames(
          "absolute inset-x-0 top-full h-px transition",
          (isInsideMobileNavigation || !mobileNavIsOpen) &&
            "bg-secondary-900/7.5 dark:bg-white/7.5",
        )}
      />
      <Search />
      <div className="flex items-center gap-5 lg:hidden">
        <MobileNavigation />
        <Link href="/" aria-label="Home" className="flex items-center gap-1">
          <Logo className="w-7" />
          <span className="text-[1.5rem] font-semibold italic leading-[2rem]">
            Fibr
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            <TopLevelNavItem href="/playground">Playground</TopLevelNavItem>
          </ul>
        </nav>
        <div className="bg-secondary-900/10 hidden h-5 w-px md:block dark:bg-white/15" />
        <div className="flex gap-4">
          <MobileSearch />
          <ThemeToggle />
        </div>
      </div>
    </motion.div>
  );
});
