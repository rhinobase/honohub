"use client";
import {
  ArrowPathIcon,
  BoltIcon,
  RocketLaunchIcon,
  WindowIcon,
} from "@heroicons/react/24/outline";
import {
  type MotionValue,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import type { ComponentType } from "react";
import { GridPattern } from "./GridPattern";

const FEATURES: Feature[] = [
  {
    name: "Rich Integration",
    description: "First class support for Hono and all the runtimes.",
    icon: RocketLaunchIcon,
    pattern: {
      y: 16,
      squares: [
        [0, 1],
        [1, 3],
      ],
    },
  },
  {
    name: "Automatic API Generation",
    description:
      "Automatically generates RESTful and GraphQL API endpoints from Drizzle schema.",
    icon: BoltIcon,
    pattern: {
      y: -6,
      squares: [
        [-1, 2],
        [1, 3],
      ],
    },
  },
  {
    name: "Schema Synchronization",
    description: "Keeps the API in sync with changes to the Drizzle schema.",
    icon: ArrowPathIcon,
    pattern: {
      y: 32,
      squares: [
        [0, 2],
        [1, 4],
      ],
    },
  },
  {
    name: "Integrated User Interface",
    description:
      "Provides a user-friendly UI for managing and visualizing data, storage, and API endpoints.",
    icon: WindowIcon,
    pattern: {
      y: 22,
      squares: [[0, 1]],
    },
  },
];

type Feature = {
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  pattern: Omit<GridPattern, "width" | "height" | "x">;
};

function Feature({ name, description, icon, pattern }: Feature) {
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
      key={name}
      onMouseMove={onMouseMove}
      className="dark:bg-white/2.5 bg-secondary-50 hover:shadow-secondary-900/5 group relative flex rounded-2xl transition-shadow hover:shadow-md dark:hover:shadow-black/5"
    >
      <FeaturePattern {...pattern} mouseX={mouseX} mouseY={mouseY} />
      <div className="ring-secondary-900/7.5 group-hover:ring-secondary-900/10 absolute inset-0 rounded-2xl ring-1 ring-inset dark:ring-white/10 dark:group-hover:ring-white/20" />
      <div className="relative rounded-2xl px-4 pb-4 pt-16">
        <FeatureIcon icon={icon} />
        <h3 className="text-secondary-900 mt-4 text-[0.875rem] font-semibold leading-7 dark:text-white">
          <span className="absolute inset-0 rounded-2xl" />
          {name}
        </h3>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1 text-[0.875rem] leading-[1.5rem]">
          {description}
        </p>
      </div>
    </div>
  );
}

function FeatureIcon({ icon: Icon }: { icon: Feature["icon"] }) {
  return (
    <div className="dark:bg-white/7.5 bg-secondary-900/5 ring-secondary-900/25 group-hover:ring-secondary-900/25 dark:group-hover:bg-primary-300/10 dark:group-hover:ring-primary-400 flex size-7 items-center justify-center rounded-full ring-1 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 dark:ring-white/15">
      <Icon className="fill-secondary-700/10 stroke-secondary-700 group-hover:stroke-secondary-900 dark:stroke-secondary-400 dark:group-hover:stroke-primary-400 dark:group-hover:fill-primary-300/10 size-5 transition-colors duration-300 dark:fill-white/10" />
    </div>
  );
}

function FeaturePattern({
  mouseX,
  mouseY,
  ...gridProps
}: Feature["pattern"] & {
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

export function Features() {
  return (
    <div className="xl:max-w-none">
      <div className="not-prose grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {FEATURES.map((feature) => (
          <Feature key={feature.name} {...feature} />
        ))}
      </div>
    </div>
  );
}
