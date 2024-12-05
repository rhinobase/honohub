"use client";
import {
  endpoint,
  handleError,
  userPasswordValidation as schema,
} from "@honohub/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldWrapper, PasswordField } from "@rafty/ui";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type z from "zod";

export function PasswordForm() {
  const router = useRouter();
  const { org, id } = useParams();
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
    setError,
  } = methods;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(async (values) => {
          try {
            await endpoint.post(
              `/organisations/${org}/manage/users/${id}/password`,
              values,
            );

            toast.success("Operation successfully completed");

            router.push(`/organisations/${org}/manage/users`);
          } catch (err) {
            handleError(err, setError);
          }
        }, console.error)}
        className="space-y-4"
      >
        <div className="space-y-5 max-w-4xl mx-auto">
          <FieldWrapper
            name="password"
            label="Password"
            description="Your password can't be too similar to your other personal information. Your password must contain at least 8 characters. Your password can't be a commonly used password. Your password can't be entirely numeric."
            isRequired
          >
            <PasswordField {...register("password")} />
          </FieldWrapper>
          <FieldWrapper
            name="confirm"
            label="Password Confirmation"
            description="Enter the same password as before, for verification."
            isRequired
          >
            <PasswordField {...register("confirm")} />
          </FieldWrapper>
        </div>
        <div className="flex justify-end gap-4 p-2 bg-secondary-100 dark:bg-secondary-900 rounded-md">
          <Link href={`/organisations/${org}/manage/users/${id}`}>
            <Button variant="ghost">Cancel</Button>
          </Link>
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Submitting"
            colorScheme="primary"
          >
            Submit
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
