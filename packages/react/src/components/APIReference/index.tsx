import { CodeBracketIcon } from "@heroicons/react/24/outline";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerTitle,
  TabContent,
} from "@rafty/ui";
import { ShikiProvider, SupportedLang, useServer } from "../../providers";
import { CopyCodeButton } from "./CopyCodeButton";
import { CodeHighlighter } from "./Higlighter";
import { RequestTag } from "./Tag";
import { Wrapper } from "./Wrapper";
import { TemplateType, getTemplate } from "./templates";

const API_REFERENCE_DATA = {
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

export type APIReferenceDrawer = {
  open: Drawer["open"];
  onOpenChange: Drawer["onOpenChange"];
  slug: string;
};

export function APIReferenceDrawer({
  open,
  onOpenChange,
  slug,
}: APIReferenceDrawer) {
  return (
    <ShikiProvider>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerOverlay />
        <DrawerContent className="max-w-xl flex flex-col pr-0 pb-0 dark:bg-secondary-900">
          <div className="flex items-center gap-2 pb-6">
            <CodeBracketIcon className="size-5 stroke-2" />
            <DrawerTitle className="mb-0">API Reference</DrawerTitle>
          </div>
          <div className="flex-1 overflow-y-auto pr-6 space-y-8 pb-6">
            {Object.entries(API_REFERENCE_DATA).map(([type, item]) => (
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
  const { endpoint } = useServer();

  const reference = endpoint.getUri({
    url: `/collections/${slug}`,
  });

  return (
    <div>
      <div className="flex items-center gap-2.5">
        <RequestTag>{tag}</RequestTag>
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

          return (
            <TabContent
              key={lang}
              value={lang}
              className="data-[orientation=horizontal]:py-0 overflow-auto rounded-b-xl max-h-[450px] h-full relative group/content"
            >
              <CodeHighlighter content={content} language={lang} />
              <CopyCodeButton content={content} />
            </TabContent>
          );
        })}
      </Wrapper>
    </div>
  );
}
