"use client";
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Tab,
  TabContent,
  TabList,
  TabTrigger,
  classNames,
} from "@rafty/ui";
import {
  Children,
  type HTMLAttributes,
  type PropsWithChildren,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { create } from "zustand";
import { Tag } from "./Tag";

const languageNames: Record<string, string> = {
  js: "JavaScript",
  ts: "TypeScript",
  javascript: "JavaScript",
  typescript: "TypeScript",
  php: "PHP",
  python: "Python",
  ruby: "Ruby",
  go: "Go",
};

type getPanelTitle = {
  title?: string;
  language?: string;
};

function getPanelTitle({ title, language }: getPanelTitle) {
  if (title) {
    return title;
  }
  if (language && language in languageNames) {
    return languageNames[language];
  }
  return "Code";
}

type CopyButton = { code: string };

function CopyButton({ code }: CopyButton) {
  const [copyCount, setCopyCount] = useState(0);
  const copied = copyCount > 0;

  useEffect(() => {
    if (copyCount > 0) {
      const timeout = setTimeout(() => setCopyCount(0), 2000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [copyCount]);

  return (
    <div className="invisible absolute right-4 top-3.5 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur transition-all group-hover:visible">
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full"
        onClick={() =>
          window.navigator.clipboard.writeText(code).then(() => {
            setCopyCount((count) => count + 1);
          })
        }
        leftIcon={
          copied ? (
            <CheckIcon className="text-primary-400 size-3.5 stroke-2" />
          ) : (
            <DocumentDuplicateIcon className="size-3.5 stroke-2" />
          )
        }
      >
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}

type CodePanelHeader = { tag?: string; label?: string };

function CodePanelHeader({ tag, label }: CodePanelHeader) {
  if (!tag && !label) {
    return null;
  }

  return (
    <div className="border-b-white/7.5 bg-white/2.5 dark:bg-white/1 bg-secondary-900 flex h-9 items-center gap-2 border-y border-t-transparent px-4 dark:border-b-white/5">
      {tag && (
        <div className="dark flex">
          <Tag variant="small">{tag}</Tag>
        </div>
      )}
      {tag && label && (
        <span className="bg-secondary-500 size-0.5 rounded-full" />
      )}
      {label && (
        <span className="text-secondary-400 dark:text-secondary-600 font-mono text-[0.8125rem] leading-[1.5rem]">
          {label}
        </span>
      )}
    </div>
  );
}

type CodePanel = PropsWithChildren<{
  tag?: string;
  label?: string;
  code?: string;
}>;

function CodePanel({ children, tag, label, code }: CodePanel) {
  const child = Children.only(children);

  if (isValidElement(child)) {
    tag = child.props.tag ?? tag;
    label = child.props.label ?? label;
    code = child.props.code ?? code;
  }

  if (!code) {
    throw new Error(
      "`CodePanel` requires a `code` prop, or a child with a `code` prop.",
    );
  }

  return (
    <div className="dark:bg-white/2.5 group">
      <CodePanelHeader tag={tag} label={label} />
      <div className="relative">
        <pre className="text-[0.8125rem] leading-[1.5rem] text-white [&>code>pre]:overflow-x-auto [&>code>pre]:p-4">
          {children}
        </pre>
        <CopyButton code={code} />
      </div>
    </div>
  );
}

type CodeGroupHeader = PropsWithChildren<{
  title: string;
}>;

function CodeGroupHeader({ title, children }: CodeGroupHeader) {
  const hasTabs = Children.count(children) > 1;

  if (!title && !hasTabs) {
    return null;
  }

  return (
    <div className="border-secondary-200 dark:border-secondary-800 flex border-b px-4">
      {title && (
        <h3
          className={classNames(
            "dark:text-white my-auto mr-auto text-[0.8125rem] font-semibold leading-[1.5rem] text-black",
            !hasTabs ? "py-3" : "py-0",
          )}
        >
          {title}
        </h3>
      )}
      {hasTabs && (
        <TabList className="border-none">
          {Children.map(children, (child) => (
            <TabTrigger
              value={getPanelTitle(isValidElement(child) ? child.props : {})}
              className={classNames(
                "py-3",
                "hover:text-black dark:hover:text-secondary-100",
                "data-[orientation=horizontal]:data-[state=active]:text-primary-600 dark:data-[orientation=horizontal]:data-[state=active]:text-primary-300",
                "data-[orientation=horizontal]:data-[state=active]:border-primary-500 dark:data-[orientation=horizontal]:data-[state=active]:border-primary-300",
              )}
            >
              {isValidElement(child)
                ? getPanelTitle(child.props || {})
                : getPanelTitle({})}
            </TabTrigger>
          ))}
        </TabList>
      )}
    </div>
  );
}

type CodeGroupPanels = CodePanel;

function CodeGroupPanels({ children, ...props }: CodeGroupPanels) {
  const hasTabs = Children.count(children) > 1;

  if (hasTabs) {
    return (
      <>
        {Children.map(children, (child) => (
          <TabContent
            className="data-[orientation=horizontal]:py-0"
            value={getPanelTitle(isValidElement(child) ? child.props : {})}
          >
            <CodePanel {...props}>{child}</CodePanel>
          </TabContent>
        ))}
      </>
    );
  }

  return <CodePanel {...props}>{children}</CodePanel>;
}

const usePreferredLanguageStore = create<{
  preferredLanguages: string[];
  addPreferredLanguage: (language: string) => void;
}>()((set) => ({
  preferredLanguages: [],
  addPreferredLanguage: (language) =>
    set((state) => ({
      preferredLanguages: [
        ...state.preferredLanguages.filter(
          (preferredLanguage) => preferredLanguage !== language,
        ),
        language,
      ],
    })),
}));

function useTabGroupProps(availableLanguages: string[]) {
  const { preferredLanguages, addPreferredLanguage } =
    usePreferredLanguageStore();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeLanguage = [...availableLanguages].sort(
    (a, z) => preferredLanguages.indexOf(z) - preferredLanguages.indexOf(a),
  )[0];
  const languageIndex = availableLanguages.indexOf(activeLanguage);
  const newSelectedIndex = languageIndex === -1 ? selectedIndex : languageIndex;
  if (newSelectedIndex !== selectedIndex) {
    setSelectedIndex(newSelectedIndex);
  }

  return {
    as: "div" as const,
    selectedIndex,
    onChange: (newSelectedIndex: number) =>
      addPreferredLanguage(availableLanguages[newSelectedIndex]),
  };
}

const CodeGroupContext = createContext(false);

export type CodeGroup = CodeGroupPanels & {
  title: string;
};

export function CodeGroup({ children, title, ...props }: CodeGroup) {
  const languages =
    Children.map(children, (child) => {
      const title = getPanelTitle(isValidElement(child) ? child.props : {});
      return title;
    }) ?? [];
  const { selectedIndex, onChange } = useTabGroupProps(languages);
  const hasTabs = Children.count(children) > 1;

  const containerClassName =
    "not-prose my-6 overflow-hidden rounded-2xl bg-white dark:bg-secondary-950 shadow-md ring-1 ring-black/5 dark:ring-white/10";
  const header = <CodeGroupHeader title={title}>{children}</CodeGroupHeader>;
  const panels = <CodeGroupPanels {...props}>{children}</CodeGroupPanels>;

  return (
    <CodeGroupContext.Provider value={true}>
      {hasTabs ? (
        <Tab
          size="sm"
          value={languages[selectedIndex]}
          onValueChange={(val) => {
            const index = languages.findIndex((lang) => lang === val);

            onChange(index);
          }}
          className={containerClassName}
        >
          {header}
          {panels}
        </Tab>
      ) : (
        <div className={containerClassName}>
          {header}
          {panels}
        </div>
      )}
    </CodeGroupContext.Provider>
  );
}

export type Code = HTMLAttributes<HTMLElement>;

export function Code({ children, ...props }: Code) {
  const isGrouped = useContext(CodeGroupContext);

  if (isGrouped) {
    if (typeof children !== "string") {
      throw new Error(
        "`Code` children must be a string when nested inside a `CodeGroup`.",
      );
    }
    // biome-ignore lint/security/noDangerouslySetInnerHtml: for showing code string
    return <code {...props} dangerouslySetInnerHTML={{ __html: children }} />;
  }

  return <code {...props}>{children}</code>;
}

export type Pre = CodeGroup;

export function Pre({ children, ...props }: Pre) {
  const isGrouped = useContext(CodeGroupContext);

  if (isGrouped) {
    return children;
  }

  return <CodeGroup {...props}>{children}</CodeGroup>;
}
