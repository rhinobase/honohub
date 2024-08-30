import { Tab, TabList, TabTrigger } from "@rafty/ui";
import { type PropsWithChildren, memo } from "react";
import { SupportedLang, usePreferences } from "../../providers";

export function Wrapper({ children }: PropsWithChildren) {
  const { lang, setLang } = usePreferences((state) => ({
    lang: state.lang,
    setLang: state.setLang,
  }));

  return (
    <Tab
      value={lang}
      onValueChange={(value) => setLang(value as SupportedLang)}
      className="border rounded-xl border-secondary-200 dark:border-secondary-700"
    >
      <SupportedLanguagesTabs />
      {children}
    </Tab>
  );
}

const LANGUAGES = {
  [SupportedLang.NODEJS]: "Node.js",
  [SupportedLang.PYTHON]: "Python",
  [SupportedLang.CURL]: "cURL",
};

const SupportedLanguagesTabs = memo(function LanguagesTabs() {
  return (
    <TabList>
      {Object.values(SupportedLang).map((lang) => (
        <TabTrigger value={lang} key={lang}>
          {LANGUAGES[lang]}
        </TabTrigger>
      ))}
    </TabList>
  );
});
