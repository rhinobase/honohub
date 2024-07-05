"use client";
import {
  type MotionValue,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import Link from "next/link";
import type { ComponentType } from "react";
import { GridPattern } from "./GridPattern";
import { Heading } from "./Heading";
import { ChatBubbleIcon } from "./icons/ChatBubbleIcon";
import { EnvelopeIcon } from "./icons/EnvelopeIcon";
import { UserIcon } from "./icons/UserIcon";
import { UsersIcon } from "./icons/UsersIcon";

const RESOURCES: Resource[] = [
  {
    href: "/contacts",
    name: "Contacts",
    description:
      "Learn about the contact model and how to create, retrieve, update, delete, and list contacts.",
    icon: UserIcon,
    pattern: {
      y: 16,
      squares: [
        [0, 1],
        [1, 3],
      ],
    },
  },
  {
    href: "/conversations",
    name: "Conversations",
    description:
      "Learn about the conversation model and how to create, retrieve, update, delete, and list conversations.",
    icon: ChatBubbleIcon,
    pattern: {
      y: -6,
      squares: [
        [-1, 2],
        [1, 3],
      ],
    },
  },
  {
    href: "/messages",
    name: "Messages",
    description:
      "Learn about the message model and how to create, retrieve, update, delete, and list messages.",
    icon: EnvelopeIcon,
    pattern: {
      y: 32,
      squares: [
        [0, 2],
        [1, 4],
      ],
    },
  },
  {
    href: "/groups",
    name: "Groups",
    description:
      "Learn about the group model and how to create, retrieve, update, delete, and list groups.",
    icon: UsersIcon,
    pattern: {
      y: 22,
      squares: [[0, 1]],
    },
  },
];

type Resource = {
  href: string;
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  pattern: Omit<GridPattern, "width" | "height" | "x">;
};

function Resource({ name, description, href, icon, pattern }: Resource) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      key={href}
      onMouseMove={onMouseMove}
      className="dark:bg-white/2.5 bg-secondary-50 hover:shadow-secondary-900/5 group relative flex rounded-2xl transition-shadow hover:shadow-md dark:hover:shadow-black/5"
    >
      <ResourcePattern {...pattern} mouseX={mouseX} mouseY={mouseY} />
      <div className="ring-secondary-900/7.5 group-hover:ring-secondary-900/10 absolute inset-0 rounded-2xl ring-1 ring-inset dark:ring-white/10 dark:group-hover:ring-white/20" />
      <div className="relative rounded-2xl px-4 pb-4 pt-16">
        <ResourceIcon icon={icon} />
        <h3 className="text-secondary-900 mt-4 text-[0.875rem] font-semibold leading-7 leading-[1.5rem] dark:text-white">
          <Link href={href}>
            <span className="absolute inset-0 rounded-2xl" />
            {name}
          </Link>
        </h3>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1 text-[0.875rem] leading-[1.5rem]">
          {description}
        </p>
      </div>
    </div>
  );
}

function ResourceIcon({ icon: Icon }: { icon: Resource["icon"] }) {
  return (
    <div className="dark:bg-white/7.5 bg-secondary-900/5 ring-secondary-900/25 group-hover:ring-secondary-900/25 dark:group-hover:bg-primary-300/10 dark:group-hover:ring-primary-400 flex size-7 items-center justify-center rounded-full ring-1 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 dark:ring-white/15">
      <Icon className="fill-secondary-700/10 stroke-secondary-700 group-hover:stroke-secondary-900 dark:stroke-secondary-400 dark:group-hover:stroke-primary-400 dark:group-hover:fill-primary-300/10 size-5 transition-colors duration-300 dark:fill-white/10" />
    </div>
  );
}

function ResourcePattern({
  mouseX,
  mouseY,
  ...gridProps
}: Resource["pattern"] & {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const maskImage = useMotionTemplate`radial-gradient(180px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50">
        <GridPattern
          width={72}
          height={56}
          x="50%"
          className="dark:fill-white/1 dark:stroke-white/2.5 absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.02] stroke-black/5"
          {...gridProps}
        />
      </div>
      <motion.div
        className="from-primary-100 to-primary-300 dark:from-primary-500 dark:to-primary-300 absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 transition duration-300 group-hover:opacity-50 dark:group-hover:opacity-15"
        style={style}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay transition duration-300 group-hover:opacity-100"
        style={style}
      >
        <GridPattern
          width={72}
          height={56}
          x="50%"
          className="dark:fill-white/2.5 absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/50 stroke-black/70 dark:stroke-white/10"
          {...gridProps}
        />
      </motion.div>
    </div>
  );
}

export function Resources() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="resources">
        Resources
      </Heading>
      <div className="not-prose border-secondary-900/5 mt-4 grid grid-cols-1 gap-8 border-t pt-10 sm:grid-cols-2 xl:grid-cols-4 dark:border-white/5">
        {RESOURCES.map((resource) => (
          <Resource key={resource.name} {...resource} />
        ))}
      </div>
    </div>
  );
}
