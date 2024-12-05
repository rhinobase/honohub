import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  FieldWrapper,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  Skeleton,
} from "@rafty/ui";
import { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useOrganization } from "../../../providers";
import { getCloudinaryURL } from "../../../utils";

const FIELD_NAME = "template.organisation";

export function TemplateField() {
  const { control } = useFormContext();
  const { organisations } = useOrganization();
  const [width, setWidth] = useState<number>();

  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (triggerRef.current) {
      setWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  if (!organisations)
    return <Skeleton className="h-[38px] w-full rounded-md" />;

  return (
    <FieldWrapper
      name={FIELD_NAME}
      label="Template"
      description="Use an organization as a template"
    >
      <Controller
        name={FIELD_NAME}
        control={control}
        render={({ field: { value, onChange } }) => {
          const selectedOrg = organisations.find((item) => item._id === value);

          return (
            <Menu>
              <MenuTrigger
                leftIcon={
                  selectedOrg ? (
                    <Avatar
                      name={selectedOrg.name}
                      src={
                        selectedOrg.logo && getCloudinaryURL(selectedOrg.logo)
                      }
                      className="size-5"
                    />
                  ) : undefined
                }
                rightIcon={
                  <ChevronDownIcon className="size-3.5 stroke-2 group-data-[state=open]/org-selector:rotate-180 transition-all ease-in-out duration-300" />
                }
                variant="outline"
                className="group/org-selector justify-start font-medium"
                ref={triggerRef}
              >
                {selectedOrg === undefined
                  ? "Select an organization"
                  : selectedOrg.name}
                <div className="flex-1" />
              </MenuTrigger>
              <MenuContent
                align="start"
                className="space-y-1 z-[100]"
                style={{
                  width: `${width}px`,
                }}
              >
                {organisations.map((org) => {
                  const handleSelectValue = () =>
                    value === org._id ? onChange() : onChange(org._id);

                  return (
                    <MenuItem
                      key={org._id}
                      className={
                        selectedOrg?._id === org._id
                          ? "bg-primary-50/70 focus:bg-primary-50/70 text-primary-500 dark:bg-primary-500/30 dark:focus:bg-primary-500/30 dark:text-white"
                          : undefined
                      }
                      onClick={handleSelectValue}
                      onKeyDown={handleSelectValue}
                    >
                      <Avatar
                        name={org.name}
                        src={org.logo && getCloudinaryURL(org.logo)}
                        className="size-5"
                      />
                      {org.name}
                    </MenuItem>
                  );
                })}
              </MenuContent>
            </Menu>
          );
        }}
      />
    </FieldWrapper>
  );
}
