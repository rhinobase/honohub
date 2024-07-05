import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import logoGo from "../public/logos/go.svg";
import logoNode from "../public/logos/node.svg";
import logoPhp from "../public/logos/php.svg";
import logoPython from "../public/logos/python.svg";
import logoRuby from "../public/logos/ruby.svg";
import { Heading } from "./Heading";

const LIBRARIES = [
  {
    href: "#",
    name: "PHP",
    description:
      "A popular general-purpose scripting language that is especially suited to web development.",
    logo: logoPhp,
  },
  {
    href: "#",
    name: "Ruby",
    description:
      "A dynamic, open source programming language with a focus on simplicity and productivity.",
    logo: logoRuby,
  },
  {
    href: "#",
    name: "Node.js",
    description:
      "Node.js® is an open-source, cross-platform JavaScript runtime environment.",
    logo: logoNode,
  },
  {
    href: "#",
    name: "Python",
    description:
      "Python is a programming language that lets you work quickly and integrate systems more effectively.",
    logo: logoPython,
  },
  {
    href: "#",
    name: "Go",
    description:
      "An open-source programming language supported by Google with built-in concurrency.",
    logo: logoGo,
  },
];

export function Libraries() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="official-libraries">
        Official libraries
      </Heading>
      <div className="not-prose border-secondary-900/5 mt-4 grid grid-cols-1 gap-x-6 gap-y-10 border-t pt-10 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3 dark:border-white/5">
        {LIBRARIES.map(({ name, description, logo, href }) => (
          <div key={name} className="flex flex-row-reverse gap-6">
            <div className="flex-auto">
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
            <Image src={logo} alt={name} className="size-12" unoptimized />
          </div>
        ))}
      </div>
    </div>
  );
}
