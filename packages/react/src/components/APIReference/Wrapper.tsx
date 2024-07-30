import { Tab, TabList, TabTrigger } from "@rafty/ui";
import type { PropsWithChildren } from "react";
import { SupportedLang, usePreferences } from "../../providers";

const LANGUAGES = ["Node.js", "Python", "cURL"];

export function Wrapper({ children }: PropsWithChildren) {
  const { lang, setLang } = usePreferences();

  return (
    <Tab
      value={lang}
      onValueChange={(value) => setLang(value as SupportedLang)}
      className="border rounded-xl border-secondary-200 dark:border-secondary-700"
    >
      <TabList>
        {Object.values(SupportedLang).map((lang, index) => (
          <TabTrigger value={lang} key={lang}>
            {LANGUAGES[index]}
          </TabTrigger>
        ))}
      </TabList>
      {children}
    </Tab>
  );
}
