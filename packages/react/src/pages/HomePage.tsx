import {
  AdjustmentsHorizontalIcon,
  BugAntIcon,
  LightBulbIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import urlJoin from "url-join";
import { Logo } from "../components";

const SOCIAL_ITEMS = [
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
  version: string;
  basePath: string;
};

export function HomePage({ version, basePath }: HomePage) {
  return (
    <div className="flex h-full w-full justify-center items-center flex-col gap-6">
      <div className="space-y-1.5">
        <div className="flex items-center">
          <Logo className="w-14 h-14" />
          <p className="text-5xl font-bold tracking-tight">
            Hono
            <span className="text-primary-500 dark:text-primary-300">Hub</span>
          </p>
        </div>
        <p className="text-secondary-500 dark:text-secondary-600 text-sm text-center">
          v{version}
        </p>
      </div>
      <div className="flex gap-5">
        {SOCIAL_ITEMS.map(({ icon: Icon, label, href, isExternal }) => (
          <a
            href={isExternal ? href : urlJoin(basePath, href)}
            key={label}
            className="flex items-center gap-1 hover:text-black dark:hover:text-white text-secondary-500 dark:text-secondary-600 transition-all text-sm ease-in-out"
          >
            <Icon className="size-4 stroke-2" />
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
