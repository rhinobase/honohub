import { CodeBracketIcon } from "@heroicons/react/24/outline";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerTitle,
  TabContent,
} from "@rafty/ui";
import {
  PreferencesProvider,
  ShikiProvider,
  SupportedLang,
  useServer,
} from "../../providers";
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
    <PreferencesProvider>
      <ShikiProvider>
        <Drawer open={isOpen} onOpenChange={toggle}>
          <DrawerOverlay />
          <DrawerContent className="max-w-xl flex flex-col pr-0">
            <DrawerTitle className="flex items-center gap-2">
              <CodeBracketIcon className="size-5 stroke-2" /> API Reference
            </DrawerTitle>
            <div className="flex-1 overflow-y-auto pr-6 space-y-2">
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
    </PreferencesProvider>
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
  const { endpoint } = useServer();

  const reference = endpoint.getUri({
    url: `/collections/${slug}`,
  });

  return (
    <>
      <div>
        <div className="flex items-center gap-2 mt-8 mb-1">
          <Tag>{tag}</Tag>
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        </div>
        <p className="leading-tight text-secondary-700 dark:text-secondary-400">
          {description}
        </p>
      </div>
      <Wrapper>
        {Object.entries(SupportedLang).map(([_, lang]) => (
          <TabContent
            key={lang}
            value={lang}
            className="data-[orientation=horizontal]:py-0 overflow-auto rounded-b-xl max-h-[450px] h-full"
          >
            <CodeHighlighter
              content={getTemplate({
                type,
                lang,
              })(reference)}
              language={lang}
            />
          </TabContent>
        ))}
      </Wrapper>
    </>
  );
}
