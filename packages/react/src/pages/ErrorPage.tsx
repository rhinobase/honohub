import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { BaseWrapper } from "../components";

export function ErrorPage() {
  const error = useRouteError() as Error;
  let errorProps: Wrapper;

  if (isRouteErrorResponse(error)) {
    const routeError = error as any;

    errorProps = {
      name: routeError.data,
      message: routeError.error.message,
      stack: routeError.error.stack,
    };
  } else {
    errorProps = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return (
    <BaseWrapper>
      <Wrapper {...errorProps} />
    </BaseWrapper>
  );
}

type Wrapper = {
  name: string;
  message: string;
  stack?: string;
};

function Wrapper({ message, name, stack }: Wrapper) {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="max-w-3xl w-full mx-auto bg-white dark:bg-secondary-900 border-t-4 space-y-4 shadow-lg border-red-500 dark:border-red-400 flex flex-col rounded-md p-3 max-h-[500px]">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">
            {name}
          </h2>
          <p className="text-red-500 dark:text-red-300 text-sm">
            Error: {message}
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
          <h2 className="text-xl font-semibold dark:text-white text-black">
            Source
          </h2>
          <pre className="overflow-auto flex-1 text-secondary-600 dark:text-secondary-400 text-sm">
            {stack}
          </pre>
        </div>
      </div>
    </div>
  );
}
