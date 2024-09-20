import { Link } from "react-router-dom";
import { PluginCard } from "../components/PluginCard";
import type { PluginType } from "../types";

export type PluginsPage = {
  options?: PluginType;
};

export function PluginsPage({ options }: PluginsPage) {
  console.log(options);

  return (
    <div className="mx-auto max-w-6xl w-full flex flex-col gap-3 md:gap-4 lg:gap-5 px-3 py-3 md:px-4 md:py-4 lg:px-5 lg:py-5 xl:py-6">
      <h2 className="text-2xl md:text-3xl font-semibold">Plugins</h2>
      <div className="grid grid-cols-1 gap-2 md:gap-4 lg:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {options &&
          Object.entries(options).map(([path, item], index) => (
            <Link to={`/plugins${path}`} key={`${index}-${item.label}`}>
              <PluginCard {...item} />
            </Link>
          ))}
      </div>
    </div>
  );
}
