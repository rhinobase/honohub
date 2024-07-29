import {
  AdjustmentsHorizontalIcon,
  ArchiveBoxIcon,
  Bars3Icon,
  BoltIcon,
  BugAntIcon,
  LightBulbIcon,
  PuzzlePieceIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { Button, classNames, eventHandler } from "@rafty/ui";
import { Link, type LinkProps } from "react-router-dom";
import urlJoin from "url-join";
import { Logo } from "../components";
import { useDrawer } from "../providers";

export type HomePage = LinksGrid & Socials;

export function HomePage({ stats, basePath }: HomePage) {
  return (
    <div className="flex h-full w-full justify-center items-center flex-col gap-3 md:gap-4 lg:gap-5 p-3 md:p-4 lg:p-5 overflow-y-auto">
      <DrawerButton />
      <div className="space-y-1.5">
        <div className="flex items-center">
          <Logo className="size-10 lg:size-14" />
          <p className="text-4xl lg:text-5xl font-bold tracking-tight">
            Hono
            <span className="text-primary-500 dark:text-primary-300">Hub</span>
          </p>
        </div>
        <p className="text-secondary-500 text-sm text-center">
          v{stats.version}
        </p>
      </div>
      <LinksGrid stats={stats} />
      <Socials basePath={basePath} />
    </div>
  );
}

function DrawerButton() {
  const { setOpen } = useDrawer();

  const handleDrawerOpen = eventHandler(() => setOpen(true));

  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden fixed top-3 left-3"
      onClick={handleDrawerOpen}
      onKeyDown={handleDrawerOpen}
    >
      <Bars3Icon className="size-[18px] stroke-[3]" />
    </Button>
  );
}

type LinksGrid = {
  stats: {
    version: string;
    hono: string;
    collections: number;
    routes: number;
    plugins: number;
  };
};

function LinksGrid({ stats }: LinksGrid) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5 w-full xl:max-w-6xl">
      <LinkCard
        to="https://honohub.dev/"
        className="grayscale hover:bg-primary-50 dark:hover:bg-primary-950/50 hover:grayscale-0"
        target="_blank"
        rel="noopener"
      >
        <Logo className="size-6 md:size-8" />
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
          className="size-5 md:size-7"
        />
        <p className="text-sm font-medium">v{stats.hono}</p>
      </LinkCard>
      <LinkCard
        to="/collections"
        className="text-secondary-500 dark:text-secondary-400 hover:bg-yellow-100/70 dark:hover:bg-yellow-900/30 hover:text-yellow-500 dark:hover:text-yellow-300"
      >
        <ArchiveBoxIcon className="size-5 md:size-7" />
        <p className="text-sm font-medium">
          {stats.collections}{" "}
          {stats.collections === 1 ? "collection" : "collections"}
        </p>
      </LinkCard>
      <LinkCard className="text-secondary-500 dark:text-secondary-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-500 dark:hover:text-purple-300">
        <BoltIcon className="size-5 md:size-7" />
        <p className="text-sm font-medium">
          {stats.routes} {stats.routes === 1 ? "route" : "routes"}
        </p>
      </LinkCard>
      <LinkCard className="text-secondary-500 dark:text-secondary-400 hover:bg-green-100/70 dark:hover:bg-green-900/20 hover:text-green-500 dark:hover:text-green-300">
        <PuzzlePieceIcon className="size-5 md:size-7" />
        <p className="text-sm font-medium">
          {stats.plugins} {stats.plugins === 1 ? "plugin" : "plugins"}
        </p>
      </LinkCard>
    </div>
  );
}

type LinkCard = Omit<LinkProps, "to"> & {
  to?: string;
};

function LinkCard({ className, to, children, ...props }: LinkCard) {
  const classNameProp = classNames(
    "rounded md:rounded-md cursor-pointer border border-secondary-200 dark:border-secondary-800 w-full min-h-20 max-h-20 h-20 lg:min-h-24 lg:max-h-24 lg:h-24 flex flex-row md:flex-col gap-2 md:gap-1 items-center justify-center transition-all ease-in-out duration-300",
    className,
  );

  if (to)
    return (
      <Link {...props} to={to} className={classNameProp}>
        {children}
      </Link>
    );
  return <div className={classNameProp}>{children}</div>;
}

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

type Socials = {
  basePath: string;
};

function Socials({ basePath }: Socials) {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4 lg:gap-5 w-full md:w-max">
      {SOCIALS.map(({ icon: Icon, label, href, isExternal }) => {
        const Component = isExternal ? "a" : Link;

        return (
          <Component
            key={label}
            to={urlJoin(basePath, href)}
            className="flex w-max items-center gap-1 hover:text-primary-500 dark:hover:text-white text-secondary-500 transition-all text-sm ease-in-out"
            {...(isExternal
              ? { target: "_blank", rel: "noopener", href }
              : undefined)}
          >
            <Icon className="size-4 stroke-2" />
            {label}
          </Component>
        );
      })}
    </div>
  );
}
