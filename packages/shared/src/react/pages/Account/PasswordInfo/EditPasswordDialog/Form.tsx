"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, DialogFooter, FieldWrapper, PasswordField } from "@rafty/ui";
import { FormProvider, useForm } from "react-hook-form";
import type z from "zod";
import { useAuth } from "../../../../providers";
import { handleError } from "../../../../utils";
import { userPasswordValidation as schema } from "../../../../validations";

export type EditPasswordForm = {
  onSubmit?: () => void;
};

export function EditPasswordForm(props: EditPasswordForm) {
  const { updatePassword } = useAuth();

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = methods;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(async (values) => {
          try {
            await updatePassword(values);
            props.onSubmit?.();
          } catch (err) {
            handleError(err, setError);
          }
        }, console.error)}
        className="space-y-2 md:space-y-3 w-full"
      >
        <div className="md:space-y-1">
          <FieldWrapper name="password" label="New Password" isRequired>
            <PasswordField {...register("password")} />
          </FieldWrapper>
          <p className="text-xs text-secondary-600 dark:text-secondary-400">
            Your password can&apos;t be too similar to your other personal
            information.
            <br />
            Your password must contain at least 8 characters.
            <br />
            Your password can&apos;t be a commonly used password.
            <br />
            Your password can&apos;t be entirely numeric.
          </p>
        </div>
        <div className="md:space-y-1">
          <FieldWrapper name="confirm" label="Confirm Password" isRequired>
            <PasswordField {...register("confirm")} />
          </FieldWrapper>
          <p className="text-xs text-secondary-600 dark:text-secondary-400">
            Enter the same password as before, for verification.
          </p>
        </div>
        <DialogFooter className="justify-end !mt-3 md:!mt-4 lg:!mt-5">
          <Button
            type="submit"
            colorScheme="primary"
            loadingText="Saving"
            isLoading={isSubmitting}
          >
            Save
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
