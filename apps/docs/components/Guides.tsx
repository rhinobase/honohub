import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Heading } from "./Heading";

const GUIDES = [
  {
    href: "/authentication",
    name: "Authentication",
    description: "Learn how to authenticate your API requests.",
  },
  {
    href: "/pagination",
    name: "Pagination",
    description: "Understand how to work with paginated responses.",
  },
  {
    href: "/errors",
    name: "Errors",
    description:
      "Read about the different types of errors returned by the API.",
  },
  {
    href: "/webhooks",
    name: "Webhooks",
    description:
      "Learn how to programmatically configure webhooks for your app.",
  },
];

export function Guides() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        Guides
      </Heading>
      <div className="not-prose border-secondary-900/5 mt-4 grid grid-cols-1 gap-8 border-t pt-10 sm:grid-cols-2 xl:grid-cols-4 dark:border-white/5">
        {GUIDES.map(({ name, description, href }) => (
          <div key={href}>
            <h3 className="text-secondary-900 text-[0.875rem] font-semibold leading-[1.5rem] dark:text-white">
              {name}
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400 mt-1 text-[0.875rem] leading-[1.5rem]">
              {description}
            </p>
            <Link
              href={href}
              className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 mt-4 flex w-max items-center gap-1.5 font-semibold transition-all"
            >
              <p>Read more</p>
              <ArrowRightIcon width={16} height={16} className="stroke-2" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
