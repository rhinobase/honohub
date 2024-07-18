import { useRouteError } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError() as Error;

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="max-w-3xl w-full mx-auto border-t-4 space-y-4 shadow-lg border-red-500 dark:border-red-300 flex flex-col rounded-md p-3 max-h-[500px]">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">
            {error.name}
          </h2>
          <p className="text-red-500 dark:text-red-300 text-sm">
            Error: {error.message}
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
          <h2 className="text-xl font-semibold">Source</h2>
          <pre className="overflow-auto flex-1 text-secondary-600 dark:text-secondary-400 text-sm">
            {error.stack}
          </pre>
        </div>
      </div>
    </div>
  );
}
