import {
  AdjustmentsHorizontalIcon,
  ArchiveBoxIcon,
  BoltIcon,
  BugAntIcon,
  LightBulbIcon,
  PuzzlePieceIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "@rafty/ui";
import type { ComponentPropsWithoutRef } from "react";
import { Link, type LinkProps } from "react-router-dom";
import urlJoin from "url-join";
import { Logo } from "../components";

const SOCIALS = [
  {
    icon: StarIcon,
    label: "Star on GitHub",
    href: "https://github.com/rhinobase/honohub",
    isExternal: true,
  },
  {
    icon: LightBulbIcon,
    label: "Ideas & Suggestions",
    href: "https://github.com/rhinobase/honohub/discussions",
    isExternal: true,
  },
  {
    icon: BugAntIcon,
    label: "Bug Reports",
    href: "https://github.com/rhinobase/honohub/issues",
    isExternal: true,
  },
  {
    icon: AdjustmentsHorizontalIcon,
    label: "Setttings",
    href: "/settings",
  },
];

export type HomePage = {
  basePath: string;
  stats: {
    version: string;
    hono: string;
    collections: number;
    routes: number;
    plugins: number;
  };
};

export function HomePage({ stats, basePath }: HomePage) {
  return (
    <div className="flex h-full w-full justify-center items-center flex-col gap-6">
      <div className="space-y-1.5">
        <div className="flex items-center">
          <Logo className="size-14" />
          <p className="text-5xl font-bold tracking-tight">
            Hono
            <span className="text-primary-500 dark:text-primary-300">Hub</span>
          </p>
        </div>
        <p className="text-secondary-500 text-sm text-center">
          v{stats.version}
        </p>
      </div>
      <div className="grid grid-cols-5 gap-4 w-full max-w-6xl">
        <LinkCard
          to="https://github.com/rhinobase/honohub"
          className="grayscale hover:bg-primary-50 dark:hover:bg-primary-950/50 hover:grayscale-0"
          target="_blank"
          rel="noopener"
        >
          <Logo />
        </LinkCard>
        <LinkCard
          to="https://hono.dev/"
          className="hover:bg-orange-100/60 dark:hover:bg-orange-900/20 grayscale hover:grayscale-0 hover:text-orange-500 dark:hover:text-orange-300 text-secondary-500 dark:text-secondary-400"
          target="_blank"
          rel="noopener"
        >
          <img
            src="https://hono.dev/images/logo-small.png"
            alt="hono logo"
            className="size-7"
          />
          <p className="text-sm font-medium">v{stats.hono}</p>
        </LinkCard>
        <LinkCard
          to="/collections"
          className="text-secondary-500 dark:text-secondary-400 hover:bg-yellow-100/70 dark:hover:bg-yellow-900/30 hover:text-yellow-500 dark:hover:text-yellow-300"
        >
          <ArchiveBoxIcon className="size-7" />
          <p className="text-sm font-medium">
            {stats.collections}{" "}
            {stats.collections > 1 ? "collections" : "collection"}
          </p>
        </LinkCard>
        <LinkCard
          to=""
          className="text-secondary-500 dark:text-secondary-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-500 dark:hover:text-purple-300"
        >
          <BoltIcon className="size-7" />
          <p className="text-sm font-medium">
            {stats.routes} {stats.routes > 1 ? "routes" : "route"}
          </p>
        </LinkCard>
        <LinkCard
          to=""
          className="text-secondary-500 dark:text-secondary-400 hover:bg-green-100/70 dark:hover:bg-green-900/20 hover:text-green-500 dark:hover:text-green-300"
        >
          <PuzzlePieceIcon className="size-7" />
          <p className="text-sm font-medium">
            {stats.plugins} {stats.plugins > 1 ? "plugins" : "plugin"}
          </p>
        </LinkCard>
      </div>
      <div className="flex gap-5">
        {SOCIALS.map(({ icon: Icon, label, href, isExternal }) => (
          <a
            href={isExternal ? href : urlJoin(basePath, href)}
            key={label}
            className="flex items-center gap-1 hover:text-primary-500 dark:hover:text-white text-secondary-500 transition-all text-sm ease-in-out"
            {...(isExternal
              ? { target: "_blank", rel: "noopener" }
              : undefined)}
          >
            <Icon className="size-4 stroke-2" />
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}

type LinkCard = ComponentPropsWithoutRef<typeof Link>;

function LinkCard({ className, ...props }: LinkProps) {
  return (
    <Link
      {...props}
      className={classNames(
        "rounded-md border border-secondary-200 dark:border-secondary-800 w-full min-h-24 max-h-24 h-24 flex flex-col gap-1 items-center justify-center transition-all ease-in-out duration-300",
        className,
      )}
    />
  );
}
