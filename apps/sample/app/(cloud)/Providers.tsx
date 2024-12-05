import {
  CollectionProvider,
  LoadingComponent,
  OrganizationProvider,
  PreferencesProvider,
} from "@honohub/shared";
import { type PropsWithChildren, Suspense } from "react";

export function Providers(props: PropsWithChildren) {
  return (
    <Suspense
      fallback={<LoadingComponent>Loading preferences...</LoadingComponent>}
    >
      <PreferencesProvider>
        <OrganizationProvider>
          <CollectionProvider>{props.children}</CollectionProvider>
        </OrganizationProvider>
      </PreferencesProvider>
    </Suspense>
  );
}
