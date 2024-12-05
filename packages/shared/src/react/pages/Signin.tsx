import { AuthForm, Logo } from "../components";

export function SigninPage(props: AuthForm) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="max-w-sm w-full px-3 md:px-0 flex flex-col gap-4 md:gap-5 lg:gap-6 items-center">
        <div className="md:[&>*]:w-max flex flex-col items-center gap-1 md:gap-2 lg:gap-3">
          <Logo className="md:size-9 lg:size-10" />
          <h2 className="text-center text-2xl lg:text-3xl font-bold">
            Sign in to your account
          </h2>
        </div>
        <AuthForm {...props} />
      </div>
    </div>
  );
}
