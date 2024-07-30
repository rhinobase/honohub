import {
  CheckIcon,
  CodeBracketIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerTitle,
  TabContent,
  classNames,
  eventHandler,
  useBoolean,
} from "@rafty/ui";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { ShikiProvider, SupportedLang, useServer } from "../../providers";
import { CodeHighlighter } from "./Higlighter";
import { Tag } from "./Tag";
import { Wrapper } from "./Wrapper";
import { TemplateType, getTemplate } from "./templates";

export type APIReference = {
  isOpen: boolean;
  toggle: (value: boolean) => void;
  slug: string;
};

const API_REFERENCE_TEMPLATE = {
  [TemplateType.LIST]: {
    tag: "GET",
    title: "List Records",
    description:
      "List all the records in the collection. You can also filter, sort, and paginate the records.",
  },
  [TemplateType.CREATE]: {
    tag: "POST",
    title: "Create a Record",
    description: "Create a new record in the collection.",
  },
  [TemplateType.RETRIEVE]: {
    tag: "GET",
    title: "Retrieve a Record",
    description: "Retrieve a single record by its ID/queryKey.",
  },
  [TemplateType.UPDATE]: {
    tag: "PUT",
    title: "Update a Record",
    description: "Update a record by its ID/queryKey.",
  },
  [TemplateType.DELETE]: {
    tag: "DELETE",
    title: "Delete a Record",
    description: "Delete a record by its ID/queryKey.",
  },
  [TemplateType.COUNT]: {
    tag: "GET",
    title: "Count Records",
    description: "Count the number of records in the collection.",
  },
};

export function APIReference({ isOpen, toggle, slug }: APIReference) {
  return (
    <ShikiProvider>
      <Drawer open={isOpen} onOpenChange={toggle}>
        <DrawerOverlay />
        <DrawerContent className="max-w-xl flex flex-col pr-0 pb-0 dark:bg-secondary-900">
          <DrawerTitle className="flex items-center gap-2">
            <CodeBracketIcon className="size-5 stroke-2" /> API Reference
          </DrawerTitle>
          <div className="flex-1 overflow-y-auto pr-6 space-y-8 pt-4 pb-6">
            {Object.entries(API_REFERENCE_TEMPLATE).map(([type, item]) => (
              <APIReferenceTemplateRender
                key={type}
                slug={slug}
                {...item}
                type={type as TemplateType}
              />
            ))}
          </div>
          <DrawerClose />
        </DrawerContent>
      </Drawer>
    </ShikiProvider>
  );
}

type APIReferenceTemplateRender = {
  tag: string;
  title: string;
  description: string;
  slug: string;
  type: TemplateType;
};

function APIReferenceTemplateRender({
  description,
  title,
  slug,
  type,
  tag,
}: APIReferenceTemplateRender) {
  const [, copyToClipboard] = useCopyToClipboard();
  const [copied, toggle] = useBoolean();

  const { endpoint } = useServer();

  const reference = endpoint.getUri({
    url: `/collections/${slug}`,
  });

  useEffect(() => {
    if (!copied) return;

    const timeoutId = setTimeout(() => {
      toggle(false);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [copied, toggle]);

  const handleCopy = (content: string) =>
    eventHandler(() => {
      copyToClipboard(content);
      toggle(true);
    });

  return (
    <div>
      <div className="flex items-center gap-2">
        <Tag>{tag}</Tag>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-secondary-600 dark:text-secondary-400 mb-3">
        {description}
      </p>
      <Wrapper>
        {Object.entries(SupportedLang).map(([_, lang]) => {
          const content = getTemplate({
            type,
            lang,
          })(reference);

          const Icon = copied ? CheckIcon : DocumentDuplicateIcon;

          return (
            <TabContent
              key={lang}
              value={lang}
              className="data-[orientation=horizontal]:py-0 overflow-auto rounded-b-xl max-h-[450px] h-full relative"
            >
              <CodeHighlighter content={content} language={lang} />
              <Button
                className={classNames(
                  "right-2 top-2 absolute",
                  copied
                    ? "text-green-500 dark:text-green-300"
                    : "hover:text-black dark:hover:text-white",
                )}
                size="icon"
                variant="ghost"
                onClick={handleCopy(content)}
                onKeyDown={handleCopy(content)}
              >
                <Icon className="stroke-2 size-4" />
              </Button>
            </TabContent>
          );
        })}
      </Wrapper>
    </div>
  );
}
