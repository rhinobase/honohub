"use client";
import {
  CollectionsPermissionsField,
  FormMode,
  HasAdminPermission,
  ReferenceFieldComponent,
  StaticCollection,
  submitButtonValidation,
  userValidation,
} from "@honohub/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldWrapper,
  InputField,
  Label,
  PasswordField,
  Switch,
} from "@rafty/ui";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import type z from "zod";
import { ManageFormWrapper } from "../FormWrapper";

const createSchema = userValidation;

const editSchema = userValidation.omit({
  password: true,
  confirm: true,
});

export type UserForm =
  | {
      mode: FormMode.CREATE;
    }
  | {
      mode: FormMode.UPDATE;
      data: z.infer<typeof editSchema>;
      isLoading: boolean;
    };

export function UserForm(props: UserForm) {
  const { org, id } = useParams();

  const isCreateMode = props.mode === FormMode.CREATE;

  const schema = isCreateMode
    ? submitButtonValidation.merge(createSchema)
    : submitButtonValidation.merge(editSchema);

  if (isCreateMode)
    // @ts-expect-error
    schema.refine((data) => data.password === data.confirm, {
      message: "Passwords don't match",
      path: ["confirm"],
    });

  const data = !isCreateMode ? props.data : undefined;
  const isLoading = !isCreateMode ? props.isLoading : undefined;

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const { register } = methods;

  return (
    <FormProvider {...methods}>
      <ManageFormWrapper
        slug={StaticCollection.USERS}
        data={data}
        isLoading={isLoading}
      >
        <FieldWrapper
          name="email"
          label="Email / Username"
          description="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
          isRequired
        >
          <InputField type="email" {...register("email")} />
        </FieldWrapper>
        {isCreateMode ? (
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 lg:gap-5 xl:gap-6">
            <FieldWrapper name="password" label="Password" isRequired>
              {/* @ts-expect-error */}
              <PasswordField {...register("password")} />
              <p className="text-secondary-600 dark:text-secondary-400 text-xs font-medium">
                Your password can&apos;t be too similar to your other personal
                information. Your password must contain at least 8 characters.
                Your password can&apos;t be a commonly used password. Your
                password can&apos;t be entirely numeric.
              </p>
            </FieldWrapper>
            <FieldWrapper
              name="confirm"
              label="Password Confirmation"
              isRequired
            >
              {/* @ts-expect-error */}
              <PasswordField {...register("confirm")} />
              <p className="text-secondary-600 dark:text-secondary-400 text-xs font-medium">
                Enter the same password as before, for verification.
              </p>
            </FieldWrapper>
          </div>
        ) : (
          <HasAdminPermission>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <p>
                Raw passwords are not stored, so there is no way to see this
                user&apos;s password, but you can change the password using{" "}
                <Link
                  href={`/organisations/${org}/manage/users/${id}/password`}
                  className="underline"
                >
                  this form
                </Link>
                .
              </p>
            </div>
          </HasAdminPermission>
        )}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 lg:gap-5 xl:gap-6">
          <FieldWrapper name="first_name" label="First Name" isRequired>
            <InputField {...register("first_name")} />
          </FieldWrapper>
          <FieldWrapper name="last_name" label="Last Name" isRequired>
            <InputField {...register("last_name")} />
          </FieldWrapper>
        </div>
        <div className="flex gap-3 md:gap-4 lg:gap-5 xl:gap-6">
          <StatusField
            name="disabled"
            label="Disabled"
            description="Designates whether this user should be treated as disabled. Select this instead of deleting accounts."
          />
          <StatusField
            name="staff"
            label="Staff status"
            description="Designates whether the user can log into this admin site."
          />
          <HasAdminPermission>
            <StatusField
              name="superuser"
              label="Superuser status"
              description="Designates that this user has all permissions without explicitly assigning them."
            />
          </HasAdminPermission>
        </div>
        <FieldWrapper name="role" label="Role">
          <ReferenceFieldComponent
            id="role"
            to={{
              collection: "roles",
            }}
          />
        </FieldWrapper>
        <FieldWrapper name="permissions" label="Permissions">
          <CollectionsPermissionsField />
        </FieldWrapper>
      </ManageFormWrapper>
    </FormProvider>
  );
}

type StatusField = {
  name: string;
  label: string;
  description: string;
};

function StatusField(props: StatusField) {
  const { control } = useFormContext();

  return (
    <FieldWrapper
      {...props}
      orientation="row-reverse"
      className="relative [&>div]:items-start [&>div>div]:-mt-1"
    >
      <Controller
        name={props.name}
        control={control}
        render={({ field: { name, onChange, value, ...props } }) => (
          <Switch
            {...props}
            id={name}
            checked={value}
            onCheckedChange={onChange}
            className="min-w-[34px]"
          />
        )}
      />
    </FieldWrapper>
  );
}
