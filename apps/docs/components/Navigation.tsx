"use client";
import { classNames } from "@rafty/ui";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type HTMLAttributes,
  type LiHTMLAttributes,
  type PropsWithChildren,
  useRef,
} from "react";
import { useIsInsideMobileNavigation } from "../components/MobileNavigation";
import { useSectionStore } from "../components/SectionProvider";
import { Tag } from "../components/Tag";
import { remToPx } from "../lib/remToPx";

type NavGroupType = {
  title: string;
  links: {
    title: string;
    href: string;
  }[];
};

function useInitialValue<T>(value: T, condition = true) {
  const initialValue = useRef(value).current;
  return condition ? initialValue : value;
}

function TopLevelNavItem({
  href,
  children,
}: PropsWithChildren<{
  href: string;
}>) {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 block py-1 text-[0.875rem] leading-[1.5rem] transition dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}

function NavLink({
  href,
  children,
  tag,
  active = false,
  isAnchorLink = false,
}: PropsWithChildren<{
  href: string;
  tag?: string;
  active?: boolean;
  isAnchorLink?: boolean;
}>) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={classNames(
        "flex justify-between gap-2 py-1 pr-3 text-[0.875rem] leading-[1.5rem] transition",
        isAnchorLink ? "pl-7" : "pl-4",
        active
          ? "text-secondary-900 dark:text-white"
          : "text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white",
      )}
    >
      <span className="truncate">{children}</span>
      {tag && (
        <Tag variant="small" color="secondary">
          {tag}
        </Tag>
      )}
    </Link>
  );
}

function VisibleSectionHighlight({
  group,
  pathname,
}: {
  group: NavGroupType;
  pathname: string;
}) {
  const [sections, visibleSections] = useInitialValue(
    [
      useSectionStore((s) => s.sections),
      useSectionStore((s) => s.visibleSections),
    ],
    useIsInsideMobileNavigation(),
  );

  const isPresent = useIsPresent();
  const firstVisibleSectionIndex = Math.max(
    0,
    [{ id: "_top" }, ...sections].findIndex(
      (section) => section.id === visibleSections[0],
    ),
  );
  const itemHeight = remToPx(2);
  const height = isPresent
    ? Math.max(1, visibleSections.length) * itemHeight
    : itemHeight;
  const top =
    group.links.findIndex((link) => link.href === pathname) * itemHeight +
    firstVisibleSectionIndex * itemHeight;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="bg-zinc-800/2.5 dark:bg-white/2.5 absolute inset-x-0 will-change-transform"
      style={{ borderRadius: 8, height, top }}
    />
  );
}

function ActivePageMarker({
  group,
  pathname,
}: {
  group: NavGroupType;
  pathname: string;
}) {
  const itemHeight = remToPx(2);
  const offset = remToPx(0.25);
  const activePageIndex = group.links.findIndex(
    (link) => link.href === pathname,
  );
  const top = offset + activePageIndex * itemHeight;

  return (
    <motion.div
      layout
      className="bg-primary-500 absolute left-2 h-6 w-px"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  );
}

function NavigationGroup({
  group,
  className,
}: {
  group: NavGroupType;
} & Pick<LiHTMLAttributes<HTMLLinkElement>, "className">) {
  // If this is the mobile navigation then we always render the initial
  // state, so that the state does not change during the close animation.
  // The state will still update when we re-open (re-render) the navigation.
  const isInsideMobileNavigation = useIsInsideMobileNavigation();
  const [pathname, sections] = useInitialValue(
    [usePathname(), useSectionStore((s) => s.sections)],
    isInsideMobileNavigation,
  );

  const isActiveGroup =
    group.links.findIndex((link) => link.href === pathname) !== -1;

  return (
    <li className={classNames("relative mt-6", className)}>
      <motion.h2
        layout="position"
        className="text-secondary-900 text-[0.8125rem] font-semibold leading-[1.5rem] dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {isActiveGroup && (
            <VisibleSectionHighlight group={group} pathname={pathname} />
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="bg-secondary-900/10 absolute inset-y-0 left-2 w-px dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {isActiveGroup && (
            <ActivePageMarker group={group} pathname={pathname} />
          )}
        </AnimatePresence>
        <ul className="border-l border-transparent">
          {group.links.map((link) => (
            <motion.li key={link.href} layout="position" className="relative">
              <NavLink href={link.href} active={link.href === pathname}>
                {link.title}
              </NavLink>
              <AnimatePresence mode="popLayout" initial={false}>
                {link.href === pathname && sections.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { delay: 0.1 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15 },
                    }}
                  >
                    {sections.map((section) => (
                      <li key={section.id}>
                        <NavLink
                          href={`${link.href}#${section.id}`}
                          tag={section.tag}
                          isAnchorLink
                        >
                          {section.title}
                        </NavLink>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export const NAVIGATION: NavGroupType[] = [
  {
    title: "🚀 Getting Started",
    links: [
      { title: "Introduction", href: "/" },
      { title: "Quick Start Guide", href: "/quickstart" },
      { title: "Admin Panel", href: "/admin-panel" },
      { title: "Deployment", href: "/deployment" },
    ],
  },
  {
    title: "📦 APIs",
    links: [
      { title: "defineHub", href: "/apis/defineHub" },
      { title: "defineCollection", href: "/apis/defineCollection" },
      { title: "createHub", href: "/apis/createHub" },
      { title: "createBase", href: "/apis/createBase" },
      { title: "@honohub/vite", href: "/apis/vite" },
      { title: "@honohub/react", href: "/apis/react" },
    ],
  },
  {
    title: "🔌 Plugins",
    links: [
      { title: "REST API", href: "/plugins/rest" },
      { title: "GraphQL", href: "/plugins/graphql" },
      { title: "usePagination", href: "/plugins/usePagination" },
    ],
  },
];

export function Navigation(props: HTMLAttributes<HTMLElement>) {
  return (
    <nav {...props}>
      <ul>
        <TopLevelNavItem href="/">API</TopLevelNavItem>
        <TopLevelNavItem href="#">Documentation</TopLevelNavItem>
        <TopLevelNavItem href="#">Support</TopLevelNavItem>
        {NAVIGATION.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 ? "md:mt-0" : ""}
          />
        ))}
      </ul>
    </nav>
  );
}
