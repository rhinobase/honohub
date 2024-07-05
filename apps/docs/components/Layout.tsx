"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type PropsWithChildren, Suspense } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Logo } from "./Logo";
import { MobileNavigationDialog } from "./MobileNavigation";
import { Navigation } from "./Navigation";
import { SearchDialog } from "./Search";
import { type Section, SectionProvider } from "./SectionProvider";

export type Layout = PropsWithChildren<{
  allSections: Record<string, Array<Section>>;
}>;

export function Layout({ children, allSections }: Layout) {
  const pathname = usePathname();

  return (
    <SectionProvider sections={allSections[pathname] ?? []}>
      <div className="h-full lg:ml-72 xl:ml-80">
        <motion.header
          layoutScroll
          className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
        >
          <div className="lg:border-secondary-900/10 contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:px-6 lg:pb-8 lg:pt-4 xl:w-80 lg:dark:border-white/10">
            <div className="hidden lg:flex">
              <Link
                href="/"
                aria-label="Home"
                className="flex items-center gap-1"
              >
                <Logo className="w-7" />
                <span className="text-[1.5rem] font-semibold italic leading-[2rem]">
                  Fibr
                </span>
              </Link>
            </div>
            <Header />
            <Navigation className="hidden lg:mt-10 lg:block" />
          </div>
        </motion.header>
        <div className="relative flex h-full flex-col px-4 pt-14 sm:px-6 lg:px-8">
          <main className="flex-auto">{children}</main>
          <Footer />
        </div>
      </div>
      <MobileNavigationDialog />
      <Suspense fallback={null}>
        <SearchDialog />
      </Suspense>
    </SectionProvider>
  );
}
