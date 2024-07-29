import { Tab, TabList, TabTrigger } from "@rafty/ui";
import type { PropsWithChildren } from "react";
import { SupportedLang, usePreferences } from "../../providers";

export function Wrapper({ children }: PropsWithChildren) {
  const { lang, setLang } = usePreferences();

  return (
    <Tab
      value={lang}
      onValueChange={(value) => setLang(value as SupportedLang)}
      className="border rounded-xl border-secondary-200 dark:border-secondary-700"
    >
      <TabList>
        {Object.entries(SupportedLang).map(([key, lang]) => (
          <TabTrigger value={lang} key={lang} className="capitalize">
            {key.toLowerCase()}
          </TabTrigger>
        ))}
      </TabList>
      {children}
    </Tab>
  );
}
