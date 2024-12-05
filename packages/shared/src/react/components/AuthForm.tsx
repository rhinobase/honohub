"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldWrapper, InputField, PasswordField } from "@rafty/ui";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { handleError } from "../utils/handle-error";
import { authValidation } from "../validations";

const AUTH_TOAST = "signin-toast";

export type AuthForm = { suffix?: string; redirectUrl: string };

export function AuthForm(props: AuthForm) {
  const schema = props.suffix
    ? z.object({ email: z.string().max(50) }).merge(
        authValidation.pick({
          password: true,
        }),
      )
    : authValidation;

  const auth = getAuth();
  const router = useRouter();

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
        onSubmit={handleSubmit(async ({ email: raw_email, password }) => {
          try {
            let email: string = raw_email;
            if (props.suffix && !email.match(new RegExp(`${props.suffix}$`)))
              email += props.suffix;

            await signInWithEmailAndPassword(
              auth,
              email.toLowerCase(),
              password,
            );

            toast.success("Sign in successful", {
              id: AUTH_TOAST,
            });

            if (["/", ""].includes(props.redirectUrl)) router.push("/");
            else router.push(props.redirectUrl);
          } catch (err) {
            handleError(err, setError);
          }
        }, console.error)}
        className="space-y-2 md:space-y-3 w-full"
      >
        <FieldWrapper name="email" label="Username / Email" isRequired>
          <InputField {...register("email")} />
        </FieldWrapper>
        <FieldWrapper name="password" label="Password" isRequired>
          <PasswordField {...register("password")} />
        </FieldWrapper>
        <Button
          colorScheme="primary"
          className="!mt-4 md:!mt-5 lg:!mt-6 w-full"
          isLoading={isSubmitting}
          loadingText="Signing in"
          type="submit"
        >
          Sign in
        </Button>
      </form>
    </FormProvider>
  );
}
