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
import { Wrapper } from "./Wrapper";
import { TemplateType, getTemplate } from "./templates";

export type APIReference = {
  isOpen: boolean;
  toggle: (value: boolean) => void;
  slug: string;
};

const API_REFERENCE_TEMPLATE = {
  [TemplateType.LIST]: {
    title: "List",
    description: "sample",
  },
  [TemplateType.CREATE]: {
    title: "Create",
    description: "sample",
  },
  [TemplateType.RETRIEVE]: {
    title: "Retrieve",
    description: "sample",
  },
  [TemplateType.UPDATE]: {
    title: "Update",
    description: "sample",
  },
  [TemplateType.DELETE]: {
    title: "Delete",
    description: "sample",
  },
  [TemplateType.COUNT]: {
    title: "Count",
    description: "sample",
  },
};

export function APIReference({ isOpen, toggle, slug }: APIReference) {
  return (
    <PreferencesProvider>
      <ShikiProvider>
        <Drawer open={isOpen} onOpenChange={toggle}>
          <DrawerOverlay />
          <DrawerContent className="max-w-[500px] flex flex-col pr-0">
            <DrawerTitle>API Reference</DrawerTitle>
            <div className="flex-1 overflow-y-auto pr-6">
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
}: APIReferenceTemplateRender) {
  const { endpoint } = useServer();

  const reference = endpoint.getUri({
    url: `/collections/${slug}`,
  });

  return (
    <div className="space-y-5 mt-4">
      <div>
        <h3 className="text-lg font-semibold leading-tight">Add {title}</h3>
        <p className="leading-tight">{description}</p>
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
    </div>
  );
}
