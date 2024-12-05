import type { PropsWithChildren } from "react";
import { HasOrganisationPermission } from "../../permissions";
import { ActionDialogProvider } from "../../providers";
import { ActionDialog } from "./ActionDialog";
import { Header } from "./Header";
import { OrganizationSidebar } from "./Sidebar";

export function OrganizationWrapper(props: PropsWithChildren) {
  return (
    <HasOrganisationPermission showError>
      <ActionDialogProvider>
        <OrganizationSidebar className="hidden md:flex" />
        <div className="w-full h-full flex flex-col">
          <Header />
          <div className="h-full w-full overflow-x-hidden overflow-y-auto scroll-smooth">
            <div className="w-full flex h-full flex-col gap-3 md:gap-4 lg:gap-5 xl:gap-6 p-3 md:p-4 lg:p-5 xl:p-6">
              {props.children}
            </div>
          </div>
        </div>
        <ActionDialog />
      </ActionDialogProvider>
    </HasOrganisationPermission>
  );
}
