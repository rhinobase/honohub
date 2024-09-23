import { Link } from "react-router-dom";
import { PageHeader, PageTitle } from "../components/Header";
import { PageWrapper } from "../components/PageWrapper";
import { PluginCard } from "../components/PluginCard";
import type { PluginType } from "../types";

export type PluginsPage = {
  options?: PluginType;
};

export function PluginsPage({ options }: PluginsPage) {
  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Plugins</PageTitle>
      </PageHeader>
      <div className="grid grid-cols-1 gap-3 md:gap-4 lg:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {options &&
          Object.entries(options).map(([path, item], index) => (
            <Link to={`/plugins${path}`} key={`${index}-${item.label}`}>
              <PluginCard {...item} />
            </Link>
          ))}
      </div>
    </PageWrapper>
  );
}
